import moment from "moment"

export interface IReductionServiceModel {
  projectID: number
  createDate: string
  projectReductionlItemID: number
  reductionItemDescription: string
  reductionAmount: number
}

export const reductionServiceModelInitValues: IReductionServiceModel = {
  projectID: 0,
  projectReductionlItemID: 0,
  reductionItemDescription: '',
  reductionAmount: 0,
  createDate: moment(new Date()).format('YYYY-MM-DD'),
}
