import moment from 'moment'

export interface IGSTPayModel {
  paymentID: number
  projectNumber: string
  projectTypeID: number
  chequeDate: string
  cashAccountTypeID: number
  email: string
  YearID: number
  gstTypeID: number
  gstAmount: number
  tdsPercentage: number
  cashAccountTypeName: string
  cashAccountID: number
  mobileNumber: number
  amount: number
  discription: string
  vendorTypeName: string
  MonthID: number
  customerName: string
  projecStatus: string
  projectCategoryName: string
  projectStatusName: string
  workStatus: string
  isActive: boolean
  projectID: number
  paymentDate: string
  transactionModeID: number
  transactionID: string
  chequeBankName: string
  chequeBankBranch: string
  chequeAmount: number
  chequeNumber: string
  cashAccountBankID: number
  projectInvoiceNo: string
  description: string
  filePath: string
  createBy: number
  ipAddress: string
  vendorID: number
  vendorInvoiceNo: string
}

export const GSTPayInitValues: IGSTPayModel = {
  discription: '',
  amount: 0,
  MonthID: 0,
  paymentID: 0,
  vendorTypeName: '',
  YearID: 0,
  gstTypeID: 0,
  gstAmount: 0,
  tdsPercentage: 0,
  cashAccountTypeID: 0,
  cashAccountTypeName: '',
  projectNumber: '',
  projectTypeID: 0,
  projecStatus: '',
  projectCategoryName: '',
  projectStatusName: '',
  chequeDate: '',
  cashAccountID: 0,
  customerName: '',
  email: '',
  mobileNumber: 0,
  workStatus: '',
  isActive: false,
  projectID: 0,
  paymentDate: moment(new Date()).format('YYYY-MM-DD'),
  transactionModeID: 0,
  transactionID: '',
  chequeBankName: '',
  chequeBankBranch: '',
  chequeAmount: 0,
  chequeNumber: '',
  cashAccountBankID: 0,
  projectInvoiceNo: '',
  description: '',
  filePath: '',
  createBy: 0,
  ipAddress: '',
  vendorID: 0,
  vendorInvoiceNo: '',
}

export interface IGSTPayListModel {
  gstPaymentID: number
  createBy: number
  projectPaymentID: number
  voucherID: number
  description: string
  createByName: string
  gstPayDate: string
  gstAmount: number
  documentPath: string
  voucherNo: string
  transactionMode: string
  cashAccountName: string
  gstYear: number
  gstMonth: number
}
export interface IGSTBreakupModel {
  gstReceivableID: number
  gstRecivableMstID: number
  projectPaymentID: number
  vendorID: number
  gstMonth: number
  gstYear: number
  gstTypeID: number
  voucherTypeID: number
  invoiceAmt: number
  cgstPer: number
  cgstAmt: number
  sgstPer: number
  sgstAmt: number
  igstPer: number
  igstAmt: number
  totalGST: number
  totalPer: number
  voucherTypeName: string
  invoiceDate: string
  refInvoiceNo: string
}
