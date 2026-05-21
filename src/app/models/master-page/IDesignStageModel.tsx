import moment from 'moment'

export interface IDesignStageModel {
  designStageID: number
  designStageId: number
  title: string
  sequenceNo: number
  createDate: string
  // date: string
  createBy: number
  updateDate: string
  updateBy: number
  iPAddress: string
}
export const desigStageInitValue: IDesignStageModel = {
  designStageID: 0,
  designStageId: 0,
  title: '',
  sequenceNo: 0,
  createDate: '',
  // date: moment(new Date()).format('YYYY-MM-DD'),
  createBy: 0,
  updateDate: '',
  updateBy: 0,
  iPAddress: '',
}