export interface IPaymentStructureModel {
  projectID: number
  sequenceNo: number
  stageName: string
  amtPercentage: number
  receiveDate: string
  stageWiseAmount: number
  stageWiseReciveAmt: number
  staeWiseRemAmt: number
  amountExpectDate: string
  projectPaymentStructureID: number
}

export const PaymentStructureModelInitValues: IPaymentStructureModel = {
  projectID: 0,
  sequenceNo: 0,
  stageName: '',
  amtPercentage: 0,
  projectPaymentStructureID: 0,
  receiveDate: '',
  stageWiseAmount: 0,
  stageWiseReciveAmt: 0,
  staeWiseRemAmt: 0,
  amountExpectDate: '',
}

export interface totalPaymentStructure {
  amtPercentage: number
  stageWiseAmount: number
  stageWiseReciveAmt: number
  staeWiseRemAmt: number
}

export interface IAddonListModel {
  addonItemName: string
  amountExpectDate: string
  amtPercentage: number
  projectPaymentStructureID: number
  receiveDate: string
  sequenceNo: number
  staeWiseRemAmt: number
  stageName: string
  stageWiseAmount: number
  stageWisePaymentStatusID: number
  stageWiseReciveAmt: number
}
