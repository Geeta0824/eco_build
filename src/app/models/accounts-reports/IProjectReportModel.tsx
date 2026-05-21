export interface IProjectReportModel {
  projectPaymentID: number
  projectID: number
  vendorID: number
  customerID: number
  cashAccountID: number
  cashAccountBankID: number
  transactionTypeID: number
  transactionModeID: number
  amount: string
  balance: string
  transactionID: string
  paymentDate: string
  projectInvoiceNo: string
  voucherNo: string
  filePath: string
  projectName: string
  customerName: string
  cashAccountName: string
  transactionMode: string
  chequeBankName: string
  chequeBankBranch: string
  chequeDate: string
  chequeAmount: string
  chequeNumber: string
  vendorName: string
  vendorInvoiceRefNo: string
  companyName: string
  description: string
  contactPerson: string
  ipAddress: string
  createBy: number
  updateBy: number

  projecStatus: string

  projectAmount: number
  paidAmount: number
  remainingAmount: number
  projectFilePath: string

  projectCategoryName: string
  projectStatusName: string
  projectType: string
  firstName: string
  lastName: string
  email: string

  mobileNumber: string

  projectCategoryID: number
  projectTypeID: number
  bhkid: number
  carpetAreaID: number
  projectStatusID: number
}
export const projectReportInitValues: IProjectReportModel = {
  projectPaymentID: 0,
  projectID: 0,
  vendorID: 0,
  customerID: 0,
  cashAccountID: 0,
  cashAccountBankID: 0,
  transactionTypeID: 0,
  transactionModeID: 0,
  amount: '',
  balance: '',
  transactionID: '',
  paymentDate: '',
  projectInvoiceNo: '',
  voucherNo: '',
  filePath: '',
  projectName: '',
  customerName: '',
  cashAccountName: '',
  transactionMode: '',
  chequeBankName: '',
  chequeBankBranch: '',
  chequeDate: '',
  chequeAmount: '',
  chequeNumber: '',
  vendorName: '',
  vendorInvoiceRefNo: '',
  companyName: '',
  description: '',
  contactPerson: '',
  ipAddress: '',
  createBy: 0,
  updateBy: 0,

  projecStatus: '',

  projectAmount: 0,
  paidAmount: 0,
  remainingAmount: 0,
  projectFilePath: '',

  projectStatusName: '',
  projectType: '',
  firstName: '',
  lastName: '',
  email: '',
  projectCategoryName: '',
  mobileNumber: '',

  projectCategoryID: 0,
  projectTypeID: 0,
  bhkid: 0,
  carpetAreaID: 0,
  projectStatusID: 0,
}
