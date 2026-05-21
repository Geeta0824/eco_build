import moment from 'moment'

export interface IEmployeeModel {
  employeeID: number
  employeeName: string
  roleName: string
  isPresent: boolean
}

export interface IMeetingModel {
  meetingID: number
  projectID: number
  isClient: boolean
  isClientPresent: boolean
  isAgency: boolean
  vendorID: number
  isAgencyPresent: boolean
  description: string
  meetingDateTime: string
  venueID: number
  meetingBy: number
  meetingEndTime: string
  conclusion: string
  statusID: number
  createDate: string
  meetingDate: string
  startTime: string
  endTime: string
  mediumID: number
  meetingTypeID: number
  projectName: string
  bhkName: string
  carpetArea: string
  projectStatusName: string
  projectType: string
  customerName: string
  mobileNumber: string
  meetingByName: string
  meetingTypeName: string
  meetingStatusName: string
  meetingMediumName: string
  meetingVenueName: string
  isPresent:boolean, 
  employeeList: IEmployeeModel[]
}

export const meetingInitValue: IMeetingModel = {
  meetingID: 0,
  projectID: 0,
  isClient: false,
  isClientPresent: false,
  isAgency: false,
  vendorID: 0,
  isAgencyPresent: false,
  description: '',
  meetingDateTime: '',
  venueID: 0,
  meetingBy: 0,
  meetingEndTime: '',
  conclusion: '',
  statusID: 0,
  createDate: '',
  meetingDate: moment(new Date()).format('YYYY-MM-DD'),

  startTime: moment(new Date()).format('HH:mm'),
  endTime: moment(new Date()).format('HH:mm'),
  mediumID: 0,
  meetingTypeID: 0,
  projectName: '',
  bhkName: '',
  carpetArea: '',
  projectStatusName: '',
  projectType: '',
  customerName: '',
  mobileNumber: '',
  meetingByName: '',
  meetingTypeName: '',
  meetingStatusName: '',
  meetingMediumName: '',
  meetingVenueName: '',
  isPresent:false,
  employeeList: [
    {
      employeeID: 0,
      employeeName: '',
      roleName: '',
      isPresent: false,
    },
  ],
}
export interface IEmployeeMapkModel {
  employeeID: number
  employeeName: string
  roleName: string
  designationName: string
  departmentName: string
  isMember: number
}

export interface IMeetingTypeDd {
  meetingTypeID: number
  meetingTypeName: string
}
export interface IMeetingCloseModel {
  meetingID: number
  statusID: number
  meetingEndDate: string
  meetingEndTime: string
  conclusion: string
}

export interface IStatusModelDD {
  meetingStatusID: number
  meetingStatusName: string
}
export interface IMediumModelDD {
  meetingMediumID: number
  meetingMediumName: string
}
export interface IVenueModelDD {
  meetingVenueID: number
  meetingVenueName: string
}
export interface IAgencyModelDDL {
  projectVendorID: number
  vendorID: number
  companyName: string
  contactPerson: string
  assignDate: string
  workCompleteDate: string
  vendorCost: string
  workOrderCost: string
  reductionCost: string
  paidAmount: string
  remainingAmount: string
  filePath: string
  remarks: string
  vendorTypeName: string
  statusID: number
  vendorTypeID: number
}
