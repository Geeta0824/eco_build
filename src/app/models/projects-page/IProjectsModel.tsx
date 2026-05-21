import moment from 'moment'

export interface IProjectModel {
  customerID: number
  customerName: string
  projecStatus: string
  projectID: number
  projectVendorID: number
  projectStageID: number
  projectName: string
  description: string
  entryDate: string
  projectAmount: number
  PMCCost: number
  paidAmount: number
  remainingAmount: number
  dueAmount: number
  projectFilePath: string
  longitude: string
  latitude: string
  quetFilePath: string
  bhkName: string
  carpetArea: string
  projectCategoryName: string
  projectStatusName: string
  projectType: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  mobileNumber: string
  terminalCode: string
  quotationCategoryID: number
  projectTypeID: number
  bhkid: number
  carpetAreaID: number
  projectStatusID: number
  createBy: number
  updateBy: number
  ipAddress: string
  contactPerson: string
  amt: string
  isSelected?: number
  isShow?: number
  additionalAmount?: number
  reductionAmount?: number
  finalAmount?: number
  paymentDate?: any
  projectCategoryID: number
  workName: string
}

export const projectModelInitValues: IProjectModel = {
  customerID: 0,
  customerName: '',
  projectID: 0,
  projectVendorID: 0,
  projectStageID: 0,
  projecStatus: '',
  projectName: '',
  description: '',
  entryDate: moment(new Date()).format('YYYY-MM-DD'),
  isActive: true,
  projectAmount: 0,
  PMCCost: 0,
  paidAmount: 0,
  remainingAmount: 0,
  dueAmount: 0,
  projectFilePath: '',
  longitude: '',
  latitude: '',
  quetFilePath: '',
  bhkName: '',
  carpetArea: '',
  projectCategoryName: '',
  projectStatusName: '',
  projectType: '',
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  terminalCode: '',
  quotationCategoryID: 0,
  projectTypeID: 0,
  bhkid: 0,
  carpetAreaID: 0,
  projectStatusID: 0,
  createBy: 0,
  updateBy: 0,
  ipAddress: '',
  contactPerson: '',
  amt: '',
  isSelected: 0,
  isShow: 0,
  additionalAmount: 0,
  reductionAmount: 0,
  finalAmount: 0,
  projectCategoryID: 0,
  paymentDate: moment(new Date()).format('YYYY-MM-DD'),
  workName: '',
}

export interface IProjectVendorMapModel {
  projectVendorID: number
  assignDate: string
  remarks: string
  vendorCost: number
  paidAmount: number
  remainingAmount: number
}

export interface IProjectTypeodel {
  projectTypeID: number
  quotationLevelID: number
  projectType: string
  quotationLevelName: string
  isActive: boolean
}

export const projectTypelInitValues: IProjectTypeodel = {
  projectTypeID: 0,
  quotationLevelID: 0,
  projectType: '',
  quotationLevelName: '',
  isActive: false,
}
export interface IEmployeeMapModel {
  employeeID: number
  employeeName: string
  roleName: string
  designationName: string
  isMember: number
  isActive: boolean
}
