import {
  CreateScheduleCommand,
  FlexibleTimeWindowMode,
  SchedulerClient
} from "@aws-sdk/client-scheduler"
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider"
import { injectable } from "tsyringe"
import type {
  CreateSchedulePort,
  CreateSchedulePortInput,
  CreateSchedulePortOutput
} from "@/backend/modules/notification/internal/application/ports/create-schedule.port"
import { env } from "@/env"

const MAX_EVENT_AGE_IN_SECONDS = 60 * 60 * 24
const MAX_RETRY_ATTEMPTS = 3

@injectable()
export class CreateScheduleEventBridgeSchedulerAdapter
  implements CreateSchedulePort
{
  async handle(
    input: CreateSchedulePortInput
  ): Promise<CreateSchedulePortOutput> {
    if (process.env.NODE_ENV === "development") {
      return {
        scheduleArn: `arn:aws:scheduler:${env.AWS_REGION}:000000000000:schedule/${input.scheduleName}`
      }
    }

    const schedulerClient = new SchedulerClient({
      region: env.AWS_REGION,
      credentials: awsCredentialsProvider({
        roleArn: env.AWS_ROLE_ARN
      })
    })

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
        Input: JSON.stringify(input.payload),
        RetryPolicy: {
          MaximumEventAgeInSeconds: MAX_EVENT_AGE_IN_SECONDS,
          MaximumRetryAttempts: MAX_RETRY_ATTEMPTS
        }
      },
      GroupName: env.AWS_SCHEDULER_GROUP_NAME_NOTIFICATION,
      ActionAfterCompletion: "DELETE"
    })

    const response = await schedulerClient.send(command)

    return {
      scheduleArn: response.ScheduleArn ?? ""
    }
  }
}
