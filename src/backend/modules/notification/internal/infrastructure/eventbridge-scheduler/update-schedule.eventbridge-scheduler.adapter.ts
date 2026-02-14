import {
  FlexibleTimeWindowMode,
  SchedulerClient,
  UpdateScheduleCommand
} from "@aws-sdk/client-scheduler"
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider"
import { injectable } from "tsyringe"
import type {
  UpdateSchedulePort,
  UpdateSchedulePortInput,
  UpdateSchedulePortOutput
} from "@/backend/modules/notification/internal/application/ports/update-schedule.port"
import { env } from "@/env"

@injectable()
export class UpdateScheduleEventBridgeSchedulerAdapter
  implements UpdateSchedulePort
{
  private readonly client: SchedulerClient

  constructor() {
    this.client = new SchedulerClient({
      region: env.AWS_REGION,
      credentials: awsCredentialsProvider({
        roleArn: env.AWS_ROLE_ARN
      })
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
