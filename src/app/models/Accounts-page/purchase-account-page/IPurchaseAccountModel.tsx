import moment from 'moment'

export interface IPurchaseAccountModel {
  primaryID: number
  vendorID: number
  vendorTypeID: number
  unitID: number
  vendorName: string
  purchaseDate: string
  description: string
  filePath: string
  itemName: string
  itemQty: number
  itemDescr: string
  itemAmount: number
  lineTotal: number
  contactNumber: number
  SrNumber: number
  isActive: false
  createBy: number
  ipAddress: string
}
export const purchaseAccountInitValues: IPurchaseAccountModel = {
  primaryID: 0,
  vendorID: 0,
  vendorTypeID: 0,
  unitID: 0,
  vendorName: '',
  purchaseDate: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  filePath: '',
  itemName: '',
  itemQty: 0,
  itemDescr: '',
  itemAmount: 0,
  lineTotal: 0,
  contactNumber: 0,
  SrNumber: 0,
  isActive: false,
  createBy: 0,
  ipAddress: '',
}

export interface IPurchaseAccountListModel {
  purchaseID: number
  createBy: number
  vendorTypeID: number
  vendorName: string
  createByName: string
  itemDescr: string
  purchaseDate: string
  totalAmount: number
  remainingAmount: number
  paidAmount: number
  documentPath: string
  voucherNo: string
  transactionMode: string
  cashAccountName: string
  vendorTypeName: string
}

export interface IJobWorkOutCheckedByModel {
  primaryID: number
  bpBatchName: string
  lineNumber: string
  finalBatchName: string
  scrapQty: string
  rsfBathNo: string
  inQty: string
  outQty: string
  status: string
}

export interface IPurchaseAccCheckModel {
  purchaseDetailID: number
  itemQty: string
  itemName: string
  pricePerUnit: string
  lineTotal: string
  unitName?: string
  unitID: number
}
