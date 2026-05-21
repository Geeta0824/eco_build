export interface IDNCPaymentStructureModel {
  dncProjPaymentStageID: number
  dncID: number
  stageName: string
  sequenceNo: number
  amtPercentage: number
  noOfDays: string
  createDate: string
  createBy: number
  updateDate: string
  updateBy: number
  iPAddress: string
}
export const dncInitValue: IDNCPaymentStructureModel = {
  dncProjPaymentStageID: 0,
  dncID: 0,
  stageName: '',
  sequenceNo: 0,
  amtPercentage: 0,
  noOfDays: '',
  createDate: '',
  createBy: 0,
  updateDate: '',
  updateBy: 0,
  iPAddress: '',
}
export interface IDNCPmtStageByBranchModel {
  branchID: number
  branchName: string
  isMember: number
}