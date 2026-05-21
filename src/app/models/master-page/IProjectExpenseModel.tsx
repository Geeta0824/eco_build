import moment from 'moment'

export interface IProjectExpenseModel {
  projectExpenseID: number
  projectID: number
  projectName: string
  createByName: string
  title: string
  expenseDate: string
  amount: number
  employeeID: number
  documentPath: string
  iPAddress: string
  createBy: number
  updateBy: number
  transactionModeID: number
  chequeNumber: string
  chequeBankName: string
  cashAccountID: number
  chequeBankBranch: string
  chequeAmount: number
  chequeDate: string
  transactionID: string
  cashAccountBankID: number
  vendorInvoiceNo: string
  description: string
  filePath: string
  cashAccountName: string
  transactionMode: string
  voucherNo: string
  employeeName: string
  gstTypeID: number
  cgstPer: number
  cgstVal: number
  sgstVal: number
  sgstPer: number
  igstVal: number
  igstPer: number
  gstAmount: number
  afterTDSAmount: number
  finalAmount: number
  isTDSDeducted: boolean
  isGST: boolean
  tdsPercentage: number
  gstPer: number
  tdsAmount: number
  afterGSTAmount: number
}

export const ProjectExpenseInitValues: IProjectExpenseModel = {
  projectExpenseID: 0,
  projectID: 0,
  projectName: '',
  createByName: '',
  title: '',
  expenseDate: '',
  // expenseDate: moment(new Date()).format('YYYY-MM-DD'),
  amount: 0.0,
  documentPath: '',
  iPAddress: '',
  createBy: 0,
  updateBy: 0,
  transactionModeID: 0,
  chequeNumber: '',
  chequeBankName: '',
  cashAccountID: 0,
  chequeBankBranch: '',
  chequeAmount: 0,
  chequeDate: '',
  transactionID: '',
  cashAccountBankID: 0,
  vendorInvoiceNo: '',
  description: '',
  filePath: '',
  cashAccountName: '',
  transactionMode: '',
  voucherNo: '',
  employeeID: 0,
  employeeName: '',
  gstTypeID: 0,
  cgstPer: 0,
  cgstVal: 0,
  sgstVal: 0,
  sgstPer: 0,
  igstVal: 0,
  igstPer: 0,
  gstAmount: 0,
  afterTDSAmount: 0,
  finalAmount: 0,
  isTDSDeducted: false,
  isGST: false,
  tdsPercentage: 0,
  gstPer: 0,
  tdsAmount: 0,
  afterGSTAmount: 0,
}

export interface IProjectExpMulModel {
  projectID: number
  amount: any
}
