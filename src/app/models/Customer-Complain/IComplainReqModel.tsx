export interface ICustomerListModel {
  customerID: number
  projectID: number
  customerName: string
  email: string
  mobileNumber: string
  isActive: boolean
  address1: string
  projectName: string
}

export interface IDescModel {
  complainID: number
  complainDescription: string
  photoPath: string
  isMember: number
}
