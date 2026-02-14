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
} from "@/backend/modules/notification/internal/application/ports/create-schedule.port"
import { env } from "@/env"

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
        RoleArn: env.AWS_SCHEDULER_ROLE_ARN_NOTIFICATION,
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
