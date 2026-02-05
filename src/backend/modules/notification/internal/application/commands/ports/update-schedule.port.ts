export interface UpdateSchedulePortInput {
  scheduleName: string
  scheduleTime: Date
  lambdaArn: string
  payload: object
}

export interface UpdateSchedulePortOutput {
  scheduleArn: string
}

export interface UpdateSchedulePort {
  handle(input: UpdateSchedulePortInput): Promise<UpdateSchedulePortOutput>
}

export const UpdateSchedulePortToken = Symbol("UpdateSchedulePort")
