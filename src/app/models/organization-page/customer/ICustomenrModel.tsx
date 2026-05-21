export interface ICustomerPageModel {
  customerID: number
  branchID: number
  terminalTypeID: number
  terminalCode: string
  userName: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  crmid: string
  withdrawableBalance: string
  mobileNumber: string
  alternateMobNumber: string
  branchName: string
  branchCode: string
  phoneNumber: string
  fullName: string
  balance: string
  isActive: boolean
  password: string
  terminalTypeName: string
  address1: string
  address2: string
  pincode: string
  districtName: string
  stateName: string
  countryName: string
  leadOwnerID: number
}

export const customerInitValues: ICustomerPageModel = {
  customerID: 0,
  terminalCode: '',
  userName: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  crmid: '',
  withdrawableBalance: '',
  mobileNumber: '',
  alternateMobNumber: '',
  branchName: '',
  branchCode: '',
  phoneNumber: '',
  fullName: '',
  balance: '',
  isActive: true,
  password: '',
  branchID: 0,
  terminalTypeID: 0,
  terminalTypeName: '',
  address1: '',
  address2: '',
  pincode: '',
  districtName: '',
  stateName: '',
  countryName: '',
  leadOwnerID: 0,
}

export interface ICustomerWebModel {
  customerID: number
  terminalCode: string
  userName: string
  firstName: string
  lastName: string
  middleName: string
  email: string
  mobileNumber: string
  alternateMobNumber: string
  phoneNumber: string
  balance: string
  address1: string
  address2: string
  pincode: string
  districtID: number
  districtName: string
  stateID: number
  stateName: string
  countryID: number
  countryName: string
  countryCode: string
  cityName: string
  talukaName: string
  password: string
  isActive: boolean
}

export interface ICustomerListModel {
  balance: number
  branchName: string
  branchCode: string
  customerID: number
  crmid: string
  leadOwnerName: string
  fullName: string
  lastUpdate: string
  terminalCode: string
  voucherNumber: string
  address1: string
  address2: string
  districtName: string
  stateName: string
  countryName: string
  pincode: string
  mobileNumber: string
  email: string
  isActive: boolean
}

export interface ICustomerDropModel {
  value: number
  label: string
}

export const customerDrpDwnInitValues: ICustomerDropModel = {
  value: 0,
  label: '',
}

export interface ICustomerAddressModel {
  address1: string
  address2: string
  pincode: string
  talukaID: number
  districtID: number
  stateID: number
  countryID: number
  cityName: string
  talukaName: string
  districtName: string
  stateName: string
  countryName: string
}

export const customerAddInitValues: ICustomerAddressModel = {
  address1: '',
  address2: '',
  pincode: '',
  talukaID: 0,
  districtID: 0,
  stateID: 0,
  countryID: 0,
  cityName: '',
  talukaName: '',
  districtName: '',
  stateName: '',
  countryName: '',
}
 export interface ICustomerViewModel{
  customerID: number,
  userName: string,
  password: string,
  branchName: string,
  customerName: string,
  contactNumber: string,
  email: string
}