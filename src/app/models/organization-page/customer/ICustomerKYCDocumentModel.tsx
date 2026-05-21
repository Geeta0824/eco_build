export interface ICustomerKYCDocumentWebModel {
  customerName: string
  customerkycDocIMapD: number
  documentName: string
  documentNumber: string
  filePath: string
  mediaTypeID: number
  kycDocID: number
  mobileNumber: string
  terminalCode: string
  isActive: boolean
}
export interface ICustomerKYCDocumentModel {
  customerkycDocIMapD: number
  customerID: number
  mediaTypeID: number
  kycDocID: number
  documentNumber: string
  filePath: string
  isActive: boolean
}
export const customerKYCDocumentIniValues: ICustomerKYCDocumentModel = {
  customerkycDocIMapD: 0,
  customerID: 0,
  mediaTypeID: 0,
  kycDocID: 0,
  documentNumber: '',
  filePath: '',
  isActive: false
}
