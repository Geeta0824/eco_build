export interface IVenderModel {
  vendorTypeID: number
  vendorID: number
  email: string
  companyName: string
  password: string
  contactPerson: string
  gstNumber: string
  pancardNumber: string
  aboutVendor: string
  contactNumber: string
  vendorTypeName: string
  address: string
  isActive: boolean
  createBy: number
  updateBy: number
  ipAddress: string
}
export const venderInitValues: IVenderModel = {
  vendorTypeID: 0,
  vendorID: 0,
  email: '',
  companyName: '',
  password: '',
  contactPerson: '',
  gstNumber: '',
  pancardNumber: '',
  aboutVendor: '',
  contactNumber: '',
  vendorTypeName: '',
  address: '',
  isActive: false,
  createBy: 0,
  updateBy: 0,
  ipAddress: '',
}

export interface IPMCWorkStageMapModel {
  pmcWorkStageMapID: 0
  sequenceNo: number
  amtPercentage: number
  stageName: string
  companyName: string
  contactPerson: string
  vendorID: number
}
export const venderPaymentMapInitValues: IPMCWorkStageMapModel = {
  pmcWorkStageMapID: 0,
  sequenceNo: 0,
  amtPercentage: 0,
  stageName: '',
  companyName: '',
  contactPerson: '',
  vendorID: 0,
}
export interface IAgencyTypeModel {
  agencyTypeID: number
  agencyTypeName: string
  isMember: number
}
export interface IAgencyListModel {
  agencyID: number
  vendorID: number
  agencyTypeID: number
  agencyName: string
  contactNumber: string
  contactPerson: string
  email: string
  address: string
  password: string
  isActive: false
  registrationTypeName: string
  agencyTypeName: string
}
export interface IOpenProjectListModel {
  projectAgencyID: number
  projectID: number
  vendorID: number
  customerID: number
  projectName: string
  projectFilePath: string
  quetFilePath: string
  bhkName: string
  carpetArea: string
  projectStatusName: string
  projectType: string
  projectCategoryName: string
  customerName: string
  terminalCode: string
  mobileNumber: string
  email: string
  agencyCost: number
}

export interface IVendorChangePasswordModel {
  vendorID: number
  currentPassWord: string
  newPassWord: string
  conformNewPassWord: string
}
export const changeVendorPasswordInitValue: IVendorChangePasswordModel = {
  vendorID: 0,
  currentPassWord: '',
  newPassWord: '',
  conformNewPassWord: '',
}
