import moment from "moment"

export interface IAdditionalItemServiceModel {
  projectID: number
  projectAdditionalItemID: number
  additionalItemDescription: string
  additionalAmount: number
  createDate: string
}

export const additionalItemServiceModelInitValues: IAdditionalItemServiceModel = {
  projectID: 0,
  projectAdditionalItemID: 0,
  additionalItemDescription: '',
  additionalAmount: 0,
  createDate:  moment(new Date()).format('YYYY-MM-DD'),
}
