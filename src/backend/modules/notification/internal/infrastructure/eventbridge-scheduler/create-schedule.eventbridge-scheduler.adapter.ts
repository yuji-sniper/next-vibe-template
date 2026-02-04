import {
  CreateScheduleCommand,
  FlexibleTimeWindowMode,
  SchedulerClient
} from "@aws-sdk/client-scheduler"
import { injectable } from "tsyringe"
import type {
  CreateSchedulePort,
  CreateSchedulePortInput,
  CreateSchedulePortOutput
} from "@/backend/modules/notification/internal/application/commands/ports/create-schedule.port"
import { env } from "@/env"

// TODO: IAM Role ARNは環境変数から取得するように変更する
const SCHEDULER_ROLE_ARN =
  process.env.SCHEDULER_ROLE_ARN ??
  "arn:aws:iam::000000000000:role/notification-scheduler-role"

@injectable()
export class CreateScheduleEventBridgeSchedulerAdapter
  implements CreateSchedulePort
{
  private readonly client: SchedulerClient

  constructor() {
    this.client = new SchedulerClient({
      region: env.AWS_REGION
    })
  }

  async handle(
    input: CreateSchedulePortInput
  ): Promise<CreateSchedulePortOutput> {
    const command = new CreateScheduleCommand({
      Name: input.scheduleName,
      ScheduleExpression: `at(${input.scheduleTime.toISOString().replace(/\.\d{3}Z$/, "")})`,
      ScheduleExpressionTimezone: "UTC",
      FlexibleTimeWindow: {
        Mode: FlexibleTimeWindowMode.OFF
      },
      Target: {
        Arn: input.lambdaArn,
        RoleArn: SCHEDULER_ROLE_ARN,
        Input: JSON.stringify(input.payload)
      },
      ActionAfterCompletion: "DELETE"
    })

    const response = await this.client.send(command)

    return {
      scheduleArn: response.ScheduleArn ?? ""
    }
  }
}
