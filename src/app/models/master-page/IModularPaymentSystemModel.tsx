export interface IModularPaymentSystemModel {
    dncProjPaymentStageID:number,
    stageName: string
    sequenceNo: number
    amtPercentage: number
    noOfDays: string
    createBy: number
    updateBy: number
    iPAddress: string
}
export const modularPaymentInitValue: IModularPaymentSystemModel = {
    dncProjPaymentStageID:0,
    stageName: '',
    sequenceNo: 0,
    amtPercentage: 0,
    noOfDays: '',
    createBy:0,
    updateBy:0,
    iPAddress: '',
}
export interface IModularPmtStageByBranchModel {
    branchID: number
    branchName: string
    isMember: number
  }