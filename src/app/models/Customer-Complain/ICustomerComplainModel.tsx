export interface ICustomerComplainModel {
  customerComplainID: number
  customerComplainMainID: number
  projectID: number
  voucherID: number
  customerID: number
  projectName: string
  complainStatusName: string
  customerName: string
  agencyTypeName: string
  complainName: string
  description: string
  complainCreateByName: string
  vocuherNo: string
  complainDate: string
  assingDate: string
  mobileNumber: string
  vendorName: string
  address: string
  agencyName: string
}

export interface IViewCustomerComplainDetailsModel {
  customerComplainMainID: number
  vendorID: number
  agencyID: number
  agencyTypeID: number
  statusID: number
  projectID: number
  customerID: number
  agencyName: string
  vendorName: string
  contactNumber: string
  email: string
  assingDate: string
  closeDate: string
  scheduleDate: string
  doneByAgencyDate: string
  approveByCustomerDate: string
}

export interface ICustomerComplainAndPhotoModel {
  customerComplainMainID: number
  customerComplainID: number
  complainID: number
  vendorID: number
  agencyID: number
  agencyTypeID: number
  statusID: number
  projectID: number
  customerID: number
  complainName: string
  photoPath: string
}
export interface IComplainWorkModel {
  complainWorkPhotoID: number,
  photoPath: string
}
