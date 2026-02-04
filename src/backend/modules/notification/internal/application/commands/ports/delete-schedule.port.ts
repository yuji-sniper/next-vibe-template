export interface DeleteSchedulePortInput {
  scheduleName: string
}

export interface DeleteSchedulePort {
  handle(input: DeleteSchedulePortInput): Promise<void>
}

export const DeleteSchedulePortToken = Symbol("DeleteSchedulePort")
