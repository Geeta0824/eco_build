import moment from 'moment'

export interface IPMCWorkStageModel {
  pmcWorkStageID: number
  pmcid: number
  stageName: string
  sequenceNo: number
  amtPercentage: number
  createDate: string
  date: string
  createBy: number
  updateDate: string
  updateBy: number
  iPAddress: string
}
export const pmcInitValue: IPMCWorkStageModel = {
  pmcWorkStageID: 0,
  pmcid: 0,
  stageName: '',
  sequenceNo: 0,
  amtPercentage: 0,
  createDate: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  createBy: 0,
  updateDate: '',
  updateBy: 0,
  iPAddress: '',
}

export interface IPMCWorkStageForSupervisorModel {
  projectVendorPaymentStructureID: number
  projectID: number
  vendorID: number
  supervisorID: number
  approvalBy: number
  sequenceNo: number
  isMember: number
  isStage1: number
  isStage2: number
  isCompleted: true
  isCompleted1: true
  isCompleted2: true
  isStageApprove: true
  stageName: string
  approveByName: string
  supervisorName: string
  stageCompleteDate: string
  approveStageChangeDate: string
  targetDate: string
  targetDateApproveDate: string
  isTargetDateApprove: boolean
  isTargetDate: boolean
}

export interface IPMCAddonWorkOrderForSupervisorModel {
  // projectVendorPaymentStructureID: number
  projectID: number
  vendorID: number
  // supervisorID: number
  // approvalBy: number
  // sequenceNo: number
  isAddonMember: number
  // isStage1: number
  // isStage2: number
  // isCompleted: true
  // isCompleted1: true
  // isCompleted2: true
  // isStageApprove: true
  stageName: string
  approveByName: string
  supervisorName: string
  stageCompleteDate: string
  approveStageChangeDate: string
  projectPMCVendorMapDtl: number
  remarks: string
  isWorkCompleted: true
  isWorkCompleteRequestApprove: true
  workOrderCost: string
  contactPerson: string
  assignDate: string
}
export interface IPMCOtherWorkForSupervisorModel {
  projectID: number
  vendorID: number
  isOtherMember: number
  stageName: string
  approveByName: string
  supervisorName: string
  stageCompleteDate: string
  approveStageChangeDate: string
  projectVendorID: number
  remarks: string
  isWorkCompleted: true
  isWorkCompleteRequestApprove: true
  workOrderCost: string
  contactPerson: string
  assignDate: string
}

export interface IDIYWorkStageForSupervisorModel {
  vendorAgencyWorkStageID: number
  agencyTypeID: number
  vendorID: number
  supervisorID: number
  approvalBy: number
  seqNo: number
  isMember: number
  isStage1: number
  isStage2: number
  percentage: number
  isCompleted: true
  isCompleted1: true
  isCompleted2: true
  isStageApprove: true
  stageName: string
  approvalName: string
  supervisorName: string
  stageCompleteDate: string
  approveStageChangeDate: string
  contactPerson: string
  agencyTypeName: string
  createDate: string
  targetDate: string
  targetDateApproveDate: string
  isTargetDateApprove: boolean
  isTargetDate: boolean
}
export interface IDiyOtherWorkForSupervisorModel {
  projectID: number
  vendorID: number
  isDiyOtherMember: number
  stageName: string
  approveByName: string
  supervisorName: string
  stageCompleteDate: string
  approveStageChangeDate: string
  projectVendorID: number
  remarks: string
  isWorkCompleted: true
  isWorkCompleteRequestApprove: true
  workOrderCost: string
  contactPerson: string
  assignDate: string
}
