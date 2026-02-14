export interface CreateSchedulePortInput {
  scheduleName: string
  scheduleTime: Date
  lambdaArn: string
  payload: object
}

export interface CreateSchedulePortOutput {
  scheduleArn: string
}

export interface CreateSchedulePort {
  handle(input: CreateSchedulePortInput): Promise<CreateSchedulePortOutput>
}

export const CreateSchedulePortToken = Symbol("CreateSchedulePort")
