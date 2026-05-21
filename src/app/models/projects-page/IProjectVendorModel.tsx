import moment from 'moment'

export interface IProjectVendorModel {
  projectVendorID: number
  vendorID: number
  vendorTypeID: number
  projectCategoryID: number
  projectID: number
  agencyTypeID: number
  assignDate: string
  workCompleteDate: string
  vendorType: string
  vendorName: string
  vendorCost: number
  workOrderCost: number
  reductionCost: number
  paidAmount: number
  remainingAmount: number
  vendorTypeName: string
  companyName: string
  remarks: string
  projectFilePath: string
  subAmount: number
  cgstPer: number
  cgstVal: number
  sgstVal: number
  sgstPer: number
  igstVal: number
  igstPer: number
  gstAmount: number
  totalAmount: number
  gstTypeID: number
  finalAmount: number
  afterGSTAmount: number
  projectModeID: number
  createBy: number
  updateBy: number
  ipAddress: string
}
export const projectVendorInitValues: IProjectVendorModel = {
  projectVendorID: 0,
  vendorID: 0,
  vendorTypeID: 0,
  projectCategoryID: 0,
  projectID: 0,
  agencyTypeID: 0,
  assignDate: moment(new Date()).format('YYYY-MM-DD'),
  workCompleteDate: moment(new Date()).format('YYYY-MM-DD'),
  vendorType: '',
  vendorName: '',
  vendorCost: 0,
  workOrderCost: 0,
  reductionCost: 0,
  paidAmount: 0,
  remainingAmount: 0,
  vendorTypeName: '',
  companyName: '',
  projectFilePath: '',
  subAmount: 0,
  cgstPer: 0,
  cgstVal: 0,
  sgstVal: 0,
  sgstPer: 0,
  igstVal: 0,
  igstPer: 0,
  gstAmount: 0,
  totalAmount: 0,
  gstTypeID: 0,
  finalAmount: 0,
  afterGSTAmount: 0,
  projectModeID: 0,
  remarks: '',
  createBy: 0,
  updateBy: 0,
  ipAddress: '',
}
export interface IProjVendBreakupModel {
  projectPMCVendorMapDtl: number
  projectVendorID: number
  vendorID: number
  assignDate: string
  workCompleteDate: string
  vendorCost: string
  filePath: string
  remarks: string
  editID: number
}
export interface IAgencyTypeDropDownModel {
  agencyTypeID: number
  agencyTypeName: string
  adminCommissionPercentage: number
}

export interface IAgencyTypeDownModel {
  agencyTypeID: number
  agencyTypeName: string
  amt: string
  agencyCost: string
  isSelected?: number
  // ---------------For Gst Calculation------------------
  gstAmount: number
  cgstVal: number
  sgstVal: number
  igstVal: number
  cgstPer: number
  sgstPer: number
  igstPer: number
  subAmount: number
  // isShow?: number
}
export const agencyTypeInitValues: IAgencyTypeDownModel = {
  agencyTypeID: 0,
  agencyTypeName: '',
  amt: '',
  agencyCost: '',
  isSelected: 0,
  // isShow: 0,

  gstAmount: 0,
  cgstVal: 0,
  sgstVal: 0,
  igstVal: 0,
  cgstPer: 0,
  sgstPer: 0,
  igstPer: 0,
  subAmount: 0,
  // isShow?: number
}

export interface IAgencyTypeObjModel {
  agencyTypeID: number
  vendroCost: number
}
