export interface IInvoiceModel {
  projectID: number
  projectInvoiceID: number
  isProjectAmount: number
  isgst: boolean
  isPaymentReceive: boolean
  projectAmount: number
  receiveDate: string
  cgstPer: number
  cgstVal: number
  sgstVal: number
  sgstPer: number
  igstVal: number
  igstPer: number
  gstAmount: number
  afterGSTTotal: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  voucherNumber: string
  gstTypeID: number
  invoiceDate: string
  invDesc: string
  createBy: number
  ipAddress: string
}

export const invoiceModelInitValues: IInvoiceModel = {
  projectID: 0,
  projectInvoiceID: 0,
  isProjectAmount: 0,
  isgst: false,
  isPaymentReceive: false,
  projectAmount: 0,
  receiveDate: '',
  cgstPer: 0,
  cgstVal: 0,
  sgstVal: 0,
  sgstPer: 0,
  igstVal: 0,
  igstPer: 0,
  gstAmount: 0,
  afterGSTTotal: 0,
  totalAmount: 0,
  paidAmount: 0,
  remainingAmount: 0,
  voucherNumber: '',
  gstTypeID: 0,
  invoiceDate: '',
  invDesc: '',
  createBy: 0,
  ipAddress: '',
}
