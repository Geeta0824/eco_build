export interface IStageChangeReqModel {
  projectVendorPaymentStructureID: 0
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
  projectName: string
  customerName: string
}

export interface IDIYStageChangeReqModel {
  vendorAgencyWorkStageID: number
  projectID: number
  vendorID: number
  supervisorID: number
  approvalBy: number
  seqNo: number
  isCompleted: true
  isStageApprove: true
  stageName: string
  companyName: string
  supervisorName: string
  stageCompleteDate: string
  projectName: string
  customerName: string
  agencyTypeName: string
}

export interface IAddonWorkOrderChangeReqModel {
  projectID: number
  vendorID: number
  supervisorID: number
  sequenceNo: number
  companyName: string
  supervisorName: string
  projectName: string
  customerName: string
  projectPMCVendorMapDtl: number
  workCompleteApprovalBy: number
  isWorkCompleted: boolean
  isWorkCompleteRequestApprove: boolean
  remarks: string
  workCompleteRequestDate: string
}

export interface IOtherVendorWorkChangeReqModel {
  projectID: number
  vendorID: number
  supervisorID: number
  sequenceNo: number
  companyName: string
  supervisorName: string
  projectName: string
  customerName: string
  projectVendorID: number
  workCompleteApprovalBy: number
  isWorkCompleted: boolean
  isWorkCompleteRequestApprove: boolean
  remarks: string
  workCompleteRequestDate: string
}

export const stageChangeInitValues: IStageChangeReqModel = {
  projectVendorPaymentStructureID: 0,
  projectID: 0,
  vendorID: 0,
  supervisorID: 0,
  approvalBy: 0,
  sequenceNo: 0,
  isCompleted: true,
  isStageApprove: true,
  stageName: '',
  companyName: '',
  supervisorName: '',
  stageCompleteDate: '',
  projectName: '',
  customerName: '',
}
