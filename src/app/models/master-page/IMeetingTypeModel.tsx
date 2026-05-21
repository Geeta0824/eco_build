import moment from 'moment'

export interface IMeetingTypeModel {
  meetingTypeID: number
  meetingTypeName: string
}

export const meetingTypeInitValues: IMeetingTypeModel = {
  meetingTypeID: 0,
  meetingTypeName: '',
}
