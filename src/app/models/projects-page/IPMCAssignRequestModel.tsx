export interface IPMCAssignRequestModel {
  vendorTypeID: number
  vendorID: number
  email: string
  companyName: string
  contactPerson: string
  gstNumber: string
  aboutVendor: string
  contactNumber: string
  isSent: boolean
  address: string
  isActive: boolean
  isSelected: number
  vendorStatusID: number
  
}

export const pmcAssignRequestInitValues: IPMCAssignRequestModel = {
  vendorTypeID: 0,
  vendorID: 0,
  email: '',
  companyName: '',
  contactPerson: '',
  gstNumber: '',
  aboutVendor: '',
  contactNumber: '',
  address: '',
  isSent: false,
  isActive: false,
  isSelected: 0,
  vendorStatusID:0
}

export interface IPMCAssignRequestIsSelectedModel {
  projectID: number
  vendorTypeID: number
  vendorID: number
  email: string
  companyName: string
  contactPerson: string
  gstNumber: string
  pancardNumber: string
  aboutVendor: string
  contactNumber: string
  vendorTypeName: string
  address: string
  isActive: boolean
}
