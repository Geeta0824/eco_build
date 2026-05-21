export interface IStandardQuotationsModel {
  quotationID: number
  quotationNumber: string
  projectName: string
  projectNumber: string
  customerID: number
  projectTypeID: number
  quotationDate: string
  quotationAmount: string
  employeeID: number
  bhkName: string
  status: number
  bhkid: number
  carpetAreaID: number
  standarQuotationPDFID: number
  carpetArea: string
  projectType: string
  customerName: string
  email: string
  employeeName: string
  mobileNumber: string
  customerBranchName: string
  employeeBranchName: string
  quoteStatus: string
}

export const standardQuotationsInitValues: IStandardQuotationsModel = {
  quotationID: 0,
  quotationNumber: "",
  projectName: "",
  projectNumber: "",
  customerID: 0,
  projectTypeID: 0,
  quotationDate: "",
  quotationAmount: "",
  employeeID: 0,
  bhkName: "",
  status: 0,
  bhkid: 0,
  carpetAreaID: 0,
  standarQuotationPDFID: 0,
  carpetArea: "",
  projectType: "",
  customerName: "",
  email: "",
  employeeName: "",
  mobileNumber: "",
  customerBranchName: "",
  employeeBranchName: "",
  quoteStatus: ""
}
