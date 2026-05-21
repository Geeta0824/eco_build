import moment from 'moment'

export interface ITDSPayModel {
  paymentID: number
  projectNumber: string
  projectTypeID: number
  chequeDate: string
  cashAccountTypeID: number
  email: string
  YearID: number
  gstTypeID: number,
  gstAmount: number,
  tdsPercentage: number,
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
  referenceNo: string
}

export const TDSPayInitValues: ITDSPayModel = {
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
  referenceNo: '',
}


export interface ITDSPayListModel {
  tdsPaymentID: number
  createBy: number
  projectID: number
  customerID: number
  transactionModeID: number
  tdsAmount: number
  transactionID: string
  createByName: string
  tdsPayDate: string
  projectInvoiceNo: string
  voucherNo: string
  documentPath: string
  projectName: string
  customeName: string
  cashAccountName: string
  transactionMode: string
  vendorName: string
  vendorTypeID: number
  tdsYear: number
  tdsMonth: number
}
export interface ITDSBreakupModel {
 govTaxID:number,
 taxPercentage:number,
 taxValue:number,
 panCardNo:string,
 taxDescription:string,
 taxdate:string,
 ledgerRefTypeName:string
 tdsTotalAmount:number
}

