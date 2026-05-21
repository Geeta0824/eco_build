export interface ITurnkeyPaymentStructureModel {
  turnkeyid: number
  turnkeyProjPaymentStageID: number
  projectTypeID: number
  projectType: string
  sequenceNo: number
  stageName: string
  noOfDays: string
  amtPercentage: number
  createDate: string
  createBy: number
  updateDate: string
  updateBy: number
  iPAddress: string
}
export const turnkeyInitValue: ITurnkeyPaymentStructureModel = {
  turnkeyid: 0,
  turnkeyProjPaymentStageID: 0,
  projectTypeID: 0,
  projectType: '',
  sequenceNo: 0,
  stageName: '',
  noOfDays: '',
  amtPercentage: 0,
  createBy: 0,
  createDate: '',
  updateDate: '',
  updateBy: 0,
  iPAddress: '',
}
export interface ITurnkeyPaymentStrByBranchModel {
  branchID: number
  branchName: string
  isMember: number
}
