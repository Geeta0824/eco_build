export interface IVendorReportModel {
  projectID: number
  vendorID: number
  projectName: string
  customerName: string
  mobileNumber: string
  email: string
  projectPaymentID: number
  vendorCost: number
  paidAmount: number
  dueAmount: number
  remainingAmount: number
  projectCategoryID: number
  projectCategoryName: string
}
export const vendorReportInitValues: IVendorReportModel = {
  projectID: 0,
  vendorID: 0,
  projectName: '',
  customerName: '',
  mobileNumber: '',
  email: '',
  projectPaymentID: 0,
  vendorCost: 0,
  paidAmount: 0,
  dueAmount: 0,
  remainingAmount: 0,
  projectCategoryID: 0,
  projectCategoryName: '',
}
export interface totalVendorReportModel {
  projectID: number
  totalVendorCost: number
  totalPaidAmount: number
  totalRemainingAmount: number
  totalDueAmount: number
}
export interface IProjListVendorProjReportModel {
  projectID: number
  projectName: string
  projectPaymentID: number
  customerID: number
  transactionModeID: number
  amount: number
  transactionID: string
  paymentDate: string
  projectInvoiceNo: string
  voucherNo: string
  filePath: string
  customeName: string
  cashAccountName: string
  transactionMode: string
  vendorName: string
  pancardNumber: string
  finalAmount: number
  isTDSDeducted: boolean
  isGST: boolean
  tdsPercentage: number
  gstPer: number
  tdsAmount: number
  gstAmount: number
  afterTDSAmount: number
  igstPer: number
  gstTypeID: number
  totalGstPer: number
}
export const IprojListVendorProjReportModel: IProjListVendorProjReportModel = {
  projectID: 0,
  projectName: '',
  projectPaymentID: 0,
  customerID: 0,
  transactionModeID: 0,
  amount: 0,
  transactionID: '',
  paymentDate: '',
  projectInvoiceNo: '',
  voucherNo: '',
  filePath: '',
  customeName: '',
  cashAccountName: '',
  transactionMode: '',
  vendorName: '',
  pancardNumber: '',
  finalAmount: 0,
  isTDSDeducted: false,
  isGST: false,
  tdsPercentage: 0,
  gstPer: 0,
  tdsAmount: 0,
  gstAmount: 0,
  afterTDSAmount: 0,
  igstPer: 0,
  gstTypeID: 0,
  totalGstPer: 0,
}

export interface IStageWiseReportModel {
  projectVendorPaymentStructureID: number
  stageWisePaymentStatusID: number
  sequenceNo: number
  amtPercentage: Number
  stageWiseAmount: number
  paidDate: string
  stageWisePaidAmt: number
  staeWiseRemAmt: number
  stageName: string
  agencyTypeName: string
  isStageApprove: boolean
}

export interface IPaymentDueReportModel {
  projectVendorPaymentStructureID: number
  projectID: number
  vendorID: number
  supervisorID: number
  approvalBy: number
  sequenceNo: number
  isCompleted: boolean
  isStageApprove: boolean
  stageName: string
  companyName: string
  supervisorName: string
  stageCompleteDate: string
  approveStageChangeDate: string
  approveByName: string
  amtPercentage: string
  stageWiseAmount: string
  stageWisePaidAmt: string
  staeWiseRemAmt: string
  approveStagechangeDate: string
}


export interface IPaymentDiyDueReportModel {
  projectID: number
  vendorID: number
  supervisorID: number
  approvalBy: number
  isCompleted: boolean
  isStageApprove: boolean
  stageName: string
  companyName: string
  supervisorName: string
  stageCompleteDate: string
  approveByName: string
  amtPercentage: string
  stageWiseAmount: string
  stageWisePaidAmt: string
  staeWiseRemAmt: string
  vendorAgencyWorkStageID: number,
  seqNo: number,
  approveStagechangeDate: string,
  projectName: string,
  customerName: string,
  agencyTypeName: string
}

export interface IAddonWorkOdrReportModel {
  projectID: number
  vendorID: number
  supervisorID: number
  companyName: string
  supervisorName: string
  stageCompleteDate: string
  approveByName: string
  projectPMCVendorMapDtl: number
  workCompleteApprovalBy: number
  remarks: string
  approveStageChangeDate: string
  vendorCost: number
  paidAmount: number
  remainingAmount: number
}
export interface IOtherWorkReportModel {
  projectID: number
  vendorID: number
  supervisorID: number
  companyName: string
  supervisorName: string
  stageCompleteDate: string
  approveByName: string
  projectVendorID: number
  workCompleteApprovalBy: number
  remarks: string
  approveStageChangeDate: string
  vendorCost: number
  paidAmount: number
  remainingAmount: number
}
