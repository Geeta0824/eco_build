export interface IExpenseTypeReportModel {
  expenseMastersID: number
  expenseTypeID: number
  expenseHeadID: number
  expenseTypeName: string
  expenseHeadName: string
  title: string
  expenseDate: string
  amount: number
  documentPath: string
  voucherNo: string
  transactionMode: string
  cashAccountName: string
  employeeName: string
  isGST: boolean
  finalAmount: number
  isTDSDeducted: boolean
  tdsPercentage: number
  gstPer: number
  tdsAmount: number
  afterGSTAmount: number
  afterTDSAmount: number
  gstAmount: number
}
export const vendorReportInitValues: IExpenseTypeReportModel = {
  expenseMastersID: 0,
  expenseTypeID: 0,
  expenseHeadID: 0,
  expenseTypeName: '',
  expenseHeadName: '',
  title: '',
  expenseDate: '',
  amount: 0,
  documentPath: '',
  voucherNo: '',
  transactionMode: '',
  cashAccountName: '',
  employeeName: '',
  isGST: false,
  finalAmount: 0,
  isTDSDeducted: false,
  tdsPercentage: 0,
  gstPer: 0,
  tdsAmount: 0,
  afterGSTAmount: 0,
  afterTDSAmount: 0,
  gstAmount: 0,
}
