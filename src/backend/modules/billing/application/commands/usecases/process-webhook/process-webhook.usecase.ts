import { randomUUID } from "node:crypto"
import { inject, injectable } from "tsyringe"
import type { CustomerRepository } from "@/backend/modules/billing/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import {
  PAYMENT_STATUS,
  Payment,
  type PaymentStatus
} from "@/backend/modules/billing/domain/payment/payment"
import type { PaymentRepository } from "@/backend/modules/billing/domain/payment/payment.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/domain/payment/payment.repository"
import { WebhookEvent } from "@/backend/modules/billing/domain/webhook-event/webhook-event"
import {
  WebhookEventAlreadyProcessedError,
  WebhookProcessingFailedError
} from "@/backend/modules/billing/domain/webhook-event/webhook-event.errors"
import type { WebhookEventRepository } from "@/backend/modules/billing/domain/webhook-event/webhook-event.repository"
import { WebhookEventRepositoryToken } from "@/backend/modules/billing/domain/webhook-event/webhook-event.repository"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type {
  CheckoutSessionCompletedEvent,
  PaymentIntentEvent,
  ProcessWebhookPort,
  WebhookEventData
} from "../../ports/process-webhook.port"
import { ProcessWebhookPortToken } from "../../ports/process-webhook.port"
import type {
  ProcessWebhookUseCasePort,
  ProcessWebhookUseCasePortInput
} from "./process-webhook.usecase.port"

@injectable()
export class ProcessWebhookUseCase implements ProcessWebhookUseCasePort {
  constructor(
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(ProcessWebhookPortToken)
    private readonly processWebhook: ProcessWebhookPort,
    @inject(WebhookEventRepositoryToken)
    private readonly webhookEventRepository: WebhookEventRepository,
    @inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository
  ) {}

  async handle(input: ProcessWebhookUseCasePortInput): Promise<void> {
    // 1. 署名検証 & イベントパース（アダプター）- トランザクション外
    const { event } = await this.processWebhook.handle({
      payload: input.payload,
      signature: input.signature
    })

    // 2. リポジトリ操作はトランザクション内で実行
    await this.transactor.execute(async () => {
      await this.processEvent(event)
    })
  }

  private async processEvent(event: WebhookEventData): Promise<void> {
    // イベント重複チェック
    const existingEvent = await this.webhookEventRepository.findByStripeEventId(
      event.stripeEventId
    )
    if (existingEvent?.processed) {
      throw new WebhookEventAlreadyProcessedError()
    }

    // イベント記録
    const webhookEvent = WebhookEvent.create({
      id: existingEvent?.id ?? randomUUID(),
      stripeEventId: event.stripeEventId,
      eventType: event.type === "unknown" ? event.eventType : event.type
    })
    if (!existingEvent) {
      await this.webhookEventRepository.save(webhookEvent)
    }

    // イベント種別による分岐処理
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutSessionCompleted(event)
          break
        case "payment_intent.succeeded":
        case "payment_intent.payment_failed":
        case "payment_intent.canceled":
          await this.handlePaymentIntentEvent(event)
          break
        default:
          // 未対応のイベントは無視
          break
      }

      // 処理済みフラグを更新
      webhookEvent.markAsProcessed()
      await this.webhookEventRepository.save(webhookEvent)
    } catch {
      throw new WebhookProcessingFailedError()
    }
  }

  private async handleCheckoutSessionCompleted(
    event: CheckoutSessionCompletedEvent
  ): Promise<void> {
    // PaymentIntent IDがない場合は処理しない
    if (!event.stripePaymentIntentId) {
      return
    }

    // Customer IDからCustomerを取得
    if (!event.stripeCustomerId) {
      return
    }
    const customer = await this.customerRepository.findByStripeCustomerId(
      event.stripeCustomerId
    )
    if (!customer) {
      return
    }

    // 既にPaymentが存在する場合はスキップ
    const existingPayment =
      await this.paymentRepository.findByStripePaymentIntentId(
        event.stripePaymentIntentId
      )
    if (existingPayment) {
      return
    }

    // Paymentレコードを作成
    const payment = Payment.create({
      id: randomUUID(),
      customerId: customer.id,
      stripePaymentIntentId: event.stripePaymentIntentId,
      amount: event.amountTotal,
      currency: event.currency
    })
    await this.paymentRepository.save(payment)
  }

  private async handlePaymentIntentEvent(
    event: PaymentIntentEvent
  ): Promise<void> {
    const payment = await this.paymentRepository.findByStripePaymentIntentId(
      event.stripePaymentIntentId
    )
    if (!payment) {
      return
    }

    const status = this.mapEventTypeToStatus(event.type)
    payment.updateStatus(status)
    await this.paymentRepository.save(payment)
  }

  private mapEventTypeToStatus(
    eventType: PaymentIntentEvent["type"]
  ): PaymentStatus {
    switch (eventType) {
      case "payment_intent.succeeded":
        return PAYMENT_STATUS.SUCCEEDED
      case "payment_intent.payment_failed":
        return PAYMENT_STATUS.FAILED
      case "payment_intent.canceled":
        return PAYMENT_STATUS.CANCELED
    }
  }
}
