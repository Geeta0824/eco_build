export interface IGeneratePenaltyModel {
  penaltyID: number
  projectID: number
  penaltyTypeID: number
  designerID: number
  amount: number
  penaltyTypeName: string
  departmentName: string
  penaltyForName: string
  customerName: string
  approvalForName: string
  employeeName: string
  projectName: string
  remarks: string
  statusID: boolean
  penaltyForID: number
  approvalForID: number
  departmentID: number
}

export interface IPenaltyStatusModel {
  penaltyStatusID: number
  penaltyStatusName: string
}

export const generatePenaltyInitValue: IGeneratePenaltyModel = {
  penaltyID: 0,
  projectID: 0,
  penaltyTypeID: 0,
  designerID: 0,
  amount: 0,
  penaltyTypeName: '',
  departmentName: '',
  penaltyForName: '',
  customerName: '',
  approvalForName: '',
  employeeName: '',
  projectName: '',
  remarks: '',
  statusID: false,
  penaltyForID: 0,
  approvalForID: 0,
  departmentID: 0,
}
