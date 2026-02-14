import type Stripe from "stripe"
import { inject, injectable } from "tsyringe"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import {
  INVOICE_STATUS,
  Invoice
} from "@/backend/modules/billing/internal/domain/invoice/invoice"
import type { InvoiceRepository } from "@/backend/modules/billing/internal/domain/invoice/invoice.repository"
import { InvoiceRepositoryToken } from "@/backend/modules/billing/internal/domain/invoice/invoice.repository"
import {
  PAYMENT_STATUS,
  Payment,
  type PaymentStatus
} from "@/backend/modules/billing/internal/domain/payment/payment"
import type { PaymentRepository } from "@/backend/modules/billing/internal/domain/payment/payment.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/internal/domain/payment/payment.repository"
import { Subscription } from "@/backend/modules/billing/internal/domain/subscription/subscription"
import type { SubscriptionRepository } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { WebhookEvent } from "@/backend/modules/billing/internal/domain/webhook-event/webhook-event"
import type { WebhookEventRepository } from "@/backend/modules/billing/internal/domain/webhook-event/webhook-event.repository"
import { WebhookEventRepositoryToken } from "@/backend/modules/billing/internal/domain/webhook-event/webhook-event.repository"
import {
  WebhookEventAlreadyProcessedError,
  WebhookProcessingFailedError
} from "@/backend/modules/billing/public/errors/webhook-event.errors"
import type {
  ProcessStripeWebhookUseCasePort,
  ProcessStripeWebhookUseCasePortInput
} from "@/backend/modules/billing/public/ports/process-stripe-webhook.usecase.port"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import type { ProcessStripeWebhookPort } from "../../../ports/process-stripe-webhook.port"
import { ProcessStripeWebhookPortToken } from "../../../ports/process-stripe-webhook.port"

@injectable()
export class ProcessStripeWebhookUseCase
  implements ProcessStripeWebhookUseCasePort
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(ProcessStripeWebhookPortToken)
    private readonly processStripeWebhook: ProcessStripeWebhookPort,
    @inject(WebhookEventRepositoryToken)
    private readonly webhookEventRepository: WebhookEventRepository,
    @inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository,
    @inject(CustomerRepositoryToken)
    private readonly customerRepository: CustomerRepository,
    @inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository,
    @inject(InvoiceRepositoryToken)
    private readonly invoiceRepository: InvoiceRepository,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(input: ProcessStripeWebhookUseCasePortInput): Promise<void> {
    this.logger.info("Processing Stripe webhook started")

    // 1. 署名検証 & イベントパース（アダプター）- トランザクション外
    const { event } = await this.processStripeWebhook.handle({
      payload: input.payload,
      signature: input.signature
    })

    this.logger.info("Stripe webhook event received", {
      eventId: event.id,
      eventType: event.type
    })

    // 2. リポジトリ操作はトランザクション内で実行
    await this.transactor.execute(async () => {
      await this.processEvent(event)
    })

    this.logger.info("Stripe webhook processed successfully", {
      eventId: event.id,
      eventType: event.type
    })
  }

  private async processEvent(event: Stripe.Event): Promise<void> {
    // イベント重複チェック
    const existingEvent = await this.webhookEventRepository.findByStripeEventId(
      event.id
    )
    if (existingEvent?.processed) {
      this.logger.warn("Webhook event already processed", {
        eventId: event.id,
        eventType: event.type
      })
      throw new WebhookEventAlreadyProcessedError()
    }

    // イベント記録
    const webhookEvent = WebhookEvent.create({
      id: existingEvent?.id ?? this.uuidV7Generator.generate(),
      stripeEventId: event.id,
      eventType: event.type
    })
    if (!existingEvent) {
      await this.webhookEventRepository.save(webhookEvent)
    }

    // イベント種別による分岐処理
    try {
      switch (event.type) {
        case "checkout.session.completed":
          this.logger.info("Handling checkout.session.completed", {
            eventId: event.id
          })
          await this.handleCheckoutSessionCompleted(event)
          break
        case "payment_intent.succeeded":
        case "payment_intent.payment_failed":
        case "payment_intent.canceled":
          this.logger.info("Handling payment_intent event", {
            eventId: event.id,
            eventType: event.type
          })
          await this.handlePaymentIntentEvent(event)
          break
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          this.logger.info("Handling subscription event", {
            eventId: event.id,
            eventType: event.type
          })
          await this.handleSubscriptionEvent(event)
          break
        case "invoice.payment_succeeded":
        case "invoice.payment_failed":
          this.logger.info("Handling invoice event", {
            eventId: event.id,
            eventType: event.type
          })
          await this.handleInvoiceEvent(event)
          break
        default:
          this.logger.info("Ignoring unhandled event type", {
            eventId: event.id,
            eventType: event.type
          })
          break
      }

      // 処理済みフラグを更新
      webhookEvent.markAsProcessed()
      await this.webhookEventRepository.save(webhookEvent)
    } catch (error) {
      this.logger.error("Webhook processing failed", {
        eventId: event.id,
        eventType: event.type,
        error
      })
      throw new WebhookProcessingFailedError()
    }
  }

  private async handleCheckoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent
  ): Promise<void> {
    const session = event.data.object

    // Customer ID取得
    const customerId = session.customer
    if (!customerId || typeof customerId !== "string") {
      return
    }

    const customer =
      await this.customerRepository.findByStripeCustomerId(customerId)
    if (!customer) {
      return
    }

    // サブスクリプションモードの場合
    if (session.mode === "subscription" && session.subscription) {
      // Subscriptionはcustomer.subscription.createdで作成されるため、ここでは何もしない
      return
    }

    // 単発決済モードの場合
    if (session.mode === "payment" && session.payment_intent) {
      const paymentIntentId = session.payment_intent
      if (!paymentIntentId || typeof paymentIntentId !== "string") {
        return
      }
      // 既にPaymentが存在する場合はスキップ
      const existingPayment =
        await this.paymentRepository.findByStripePaymentIntentId(
          paymentIntentId
        )
      if (existingPayment) {
        return
      }

      // payment_statusに基づいてステータスを決定
      // checkout.session.completedはpayment_intent.succeededの後に発火するため、
      // ここでステータスを確定させる
      const status =
        session.payment_status === "paid"
          ? PAYMENT_STATUS.SUCCEEDED
          : PAYMENT_STATUS.PENDING

      // Paymentレコードを作成
      const payment = Payment.create({
        id: this.uuidV7Generator.generate(),
        customerId: customer.id,
        stripePaymentIntentId: paymentIntentId,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "jpy",
        status
      })
      await this.paymentRepository.save(payment)
    }
  }

  private async handlePaymentIntentEvent(
    event:
      | Stripe.PaymentIntentCanceledEvent
      | Stripe.PaymentIntentPaymentFailedEvent
      | Stripe.PaymentIntentSucceededEvent
  ): Promise<void> {
    const stripePaymentIntentId = event.data.object.id

    const payment = await this.paymentRepository.findByStripePaymentIntentId(
      stripePaymentIntentId
    )
    if (!payment) {
      return
    }

    const status = this.mapEventTypeToStatus(event.type)
    payment.updateStatus(status)
    await this.paymentRepository.save(payment)
  }

  private mapEventTypeToStatus(
    eventType:
      | Stripe.PaymentIntentCanceledEvent["type"]
      | Stripe.PaymentIntentPaymentFailedEvent["type"]
      | Stripe.PaymentIntentSucceededEvent["type"]
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

  private async handleSubscriptionEvent(
    event:
      | Stripe.CustomerSubscriptionCreatedEvent
      | Stripe.CustomerSubscriptionUpdatedEvent
      | Stripe.CustomerSubscriptionDeletedEvent
  ): Promise<void> {
    const subscriptionObject = event.data.object

    // Customer ID取得
    const customerId = subscriptionObject.customer
    if (!customerId || typeof customerId !== "string") {
      return
    }

    // Customer取得
    const customer =
      await this.customerRepository.findByStripeCustomerId(customerId)
    if (!customer) {
      return
    }

    const firstItem = subscriptionObject.items.data[0]
    if (!firstItem) {
      return
    }

    switch (event.type) {
      case "customer.subscription.created": {
        // 既存のSubscriptionがあるかチェック
        const existing =
          await this.subscriptionRepository.findByStripeSubscriptionId(
            subscriptionObject.id
          )
        if (existing) {
          return
        }

        const priceId = firstItem.price.id

        // Subscriptionレコードを作成
        const subscription = Subscription.create({
          id: this.uuidV7Generator.generate(),
          customerId: customer.id,
          stripeSubscriptionId: subscriptionObject.id,
          stripePriceId: priceId,
          status: subscriptionObject.status,
          currentPeriodStart: firstItem.current_period_start
            ? new Date(firstItem.current_period_start * 1000)
            : null,
          currentPeriodEnd: firstItem.current_period_end
            ? new Date(firstItem.current_period_end * 1000)
            : null,
          cancelAtPeriodEnd: subscriptionObject.cancel_at_period_end
        })
        await this.subscriptionRepository.save(subscription)
        break
      }

      case "customer.subscription.updated": {
        const subscription =
          await this.subscriptionRepository.findByStripeSubscriptionId(
            subscriptionObject.id
          )
        if (!subscription) {
          return
        }

        // status, currentPeriodStart/End, stripePriceId, cancelAtPeriodEnd を更新
        subscription.updateStatus(subscriptionObject.status)
        subscription.updatePeriod(
          firstItem.current_period_start
            ? new Date(firstItem.current_period_start * 1000)
            : null,
          firstItem.current_period_end
            ? new Date(firstItem.current_period_end * 1000)
            : null
        )
        subscription.updatePriceId(firstItem.price.id)
        subscription.setCancelAtPeriodEnd(
          subscriptionObject.cancel_at_period_end
        )
        await this.subscriptionRepository.save(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription =
          await this.subscriptionRepository.findByStripeSubscriptionId(
            subscriptionObject.id
          )
        if (!subscription) {
          return
        }

        // statusをcanceledに更新
        subscription.cancel()
        await this.subscriptionRepository.save(subscription)
        break
      }
    }
  }

  private async handleInvoiceEvent(
    event:
      | Stripe.InvoicePaymentFailedEvent
      | Stripe.InvoicePaymentSucceededEvent
  ): Promise<void> {
    const invoiceObject = event.data.object

    // Customer ID取得
    const customerId = invoiceObject.customer
    if (!customerId || typeof customerId !== "string") {
      return
    }

    // Customer取得
    const customer =
      await this.customerRepository.findByStripeCustomerId(customerId)
    if (!customer) {
      return
    }

    const stripeSubscriptionId =
      invoiceObject.parent?.subscription_details?.subscription

    // 既存のInvoiceがあるかチェック
    const existingInvoice = await this.invoiceRepository.findByStripeInvoiceId(
      invoiceObject.id
    )

    // SubscriptionIDからSubscriptionを取得
    let subscriptionId: string | null = null
    if (stripeSubscriptionId && typeof stripeSubscriptionId === "string") {
      const subscription =
        await this.subscriptionRepository.findByStripeSubscriptionId(
          stripeSubscriptionId
        )
      subscriptionId = subscription?.id ?? null
    }

    const amount = invoiceObject.amount_paid ?? invoiceObject.amount_due ?? 0

    switch (event.type) {
      case "invoice.payment_succeeded": {
        if (existingInvoice) {
          // 既存のInvoiceを更新
          existingInvoice.markAsPaid(new Date())
          await this.invoiceRepository.save(existingInvoice)
        } else {
          // 新規Invoiceレコードを作成
          const invoice = Invoice.create({
            id: this.uuidV7Generator.generate(),
            customerId: customer.id,
            subscriptionId,
            stripeInvoiceId: invoiceObject.id,
            amount,
            currency: invoiceObject.currency,
            status: INVOICE_STATUS.PAID,
            paidAt: new Date()
          })
          await this.invoiceRepository.save(invoice)
        }
        break
      }

      case "invoice.payment_failed": {
        if (existingInvoice) {
          // 既存のInvoiceを更新
          existingInvoice.markAsUncollectible()
          await this.invoiceRepository.save(existingInvoice)
        } else {
          // 新規Invoiceレコードを作成
          const invoice = Invoice.create({
            id: this.uuidV7Generator.generate(),
            customerId: customer.id,
            subscriptionId,
            stripeInvoiceId: invoiceObject.id,
            amount,
            currency: invoiceObject.currency,
            status: INVOICE_STATUS.OPEN
          })
          await this.invoiceRepository.save(invoice)
        }
        break
      }
    }
  }
}
