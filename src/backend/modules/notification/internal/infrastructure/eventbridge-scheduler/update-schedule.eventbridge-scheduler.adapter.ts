import {
  FlexibleTimeWindowMode,
  SchedulerClient,
  UpdateScheduleCommand
} from "@aws-sdk/client-scheduler"
import { injectable } from "tsyringe"
import type {
  UpdateSchedulePort,
  UpdateSchedulePortInput,
  UpdateSchedulePortOutput
} from "@/backend/modules/notification/internal/application/commands/ports/update-schedule.port"
import { env } from "@/env"

// TODO: IAM Role ARNは環境変数から取得するように変更する
const SCHEDULER_ROLE_ARN =
  process.env.SCHEDULER_ROLE_ARN ??
  "arn:aws:iam::000000000000:role/notification-scheduler-role"

@injectable()
export class UpdateScheduleEventBridgeSchedulerAdapter
  implements UpdateSchedulePort
{
  private readonly client: SchedulerClient

  constructor() {
    this.client = new SchedulerClient({
      region: env.AWS_REGION
    })
  }

  async handle(
    input: UpdateSchedulePortInput
  ): Promise<UpdateSchedulePortOutput> {
    const command = new UpdateScheduleCommand({
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
