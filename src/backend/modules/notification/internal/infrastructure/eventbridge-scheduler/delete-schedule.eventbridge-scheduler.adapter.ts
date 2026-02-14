import {
  DeleteScheduleCommand,
  SchedulerClient
} from "@aws-sdk/client-scheduler"
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider"
import { injectable } from "tsyringe"
import type {
  DeleteSchedulePort,
  DeleteSchedulePortInput
} from "@/backend/modules/notification/internal/application/ports/delete-schedule.port"
import { env } from "@/env"

@injectable()
export class DeleteScheduleEventBridgeSchedulerAdapter
  implements DeleteSchedulePort
{
  async handle(input: DeleteSchedulePortInput): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      return
    }

    const schedulerClient = new SchedulerClient({
      region: env.AWS_REGION,
      credentials: awsCredentialsProvider({
        roleArn: env.AWS_ROLE_ARN
      })
    })

    const command = new DeleteScheduleCommand({
      Name: input.scheduleName,
      GroupName: env.AWS_SCHEDULER_GROUP_NAME_NOTIFICATION
    })

    await schedulerClient.send(command)
  }
}
