import moment from 'moment'

export interface IWorkOrderRequestModel {
  workOrderRequestID: number
  workOrder:string
  workStageName: string
  assignDate: string
  projectID: number
  projectName: string
  vendorID: number
  vendorName: string
  pmcWorkStageID: number
  vendorTypeID: number
  vendorTypeName: string
  description: string
  amount: string
  isApprove: boolean
  workCompleteDate: string
  isApproveStatus: string
  supervisorName: string
  customerName: string
  workStageID: number
}
export const workOrderInitValues: IWorkOrderRequestModel = {
  workOrderRequestID: 0,
  workOrder:'',
  workStageName: '',
  assignDate: '',
  projectID: 0,
  projectName: '',
  vendorID: 0,
  vendorName: '',
  pmcWorkStageID: 0,
  vendorTypeID: 0,
  vendorTypeName: '',
  description: '',
  amount: '',
  isApprove: true,
  workCompleteDate: '',
  isApproveStatus: '',
  supervisorName: '',
  customerName: '',
  workStageID:0
}
