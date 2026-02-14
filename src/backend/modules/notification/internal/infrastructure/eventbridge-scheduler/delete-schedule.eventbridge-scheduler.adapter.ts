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
  private readonly client: SchedulerClient

  constructor() {
    this.client = new SchedulerClient({
      region: env.AWS_REGION,
      credentials: awsCredentialsProvider({
        roleArn: env.AWS_ROLE_ARN
      })
    })
  }

  async handle(input: DeleteSchedulePortInput): Promise<void> {
    const command = new DeleteScheduleCommand({
      Name: input.scheduleName
    })

    await this.client.send(command)
  }
}
