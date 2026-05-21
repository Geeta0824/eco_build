import moment from 'moment'

export interface IDebitNoteModel {
  debitNoteID: number
  createBy: number
  debitNoteDetailID: number
  vendorID: number
  vendorTypeID: number
  vendorName: string
  purchaseID: string
  itemQty: number
  itemName: string
  unitName: string
  unitID: number
  itemAmount: number
  returnQty: string
  debitAmount: string
  remarks: string
  purchaseDate: string
  debitNoteDate: string
  filePath: string
  totalReturnAmt: number
  debitVoucherNo: string
  purchaseOrderNo: string
  vendorTypeName: string
  createByName: string
}
export const accountTransferInitValues: IDebitNoteModel = {
  debitNoteID: 0,
  createBy: 0,
  vendorID: 0,
  vendorTypeID: 0,
  vendorName: '',
  purchaseID: '',
  itemQty: 0,
  itemName: '',
  unitName: '',
  unitID: 0,
  itemAmount: 0,
  returnQty: '',
  debitAmount: '',
  remarks: '',
  purchaseDate: moment(new Date()).format('YYYY-MM-DD'),
  debitNoteDetailID: 0,
  debitNoteDate: '',
  filePath: '',
  totalReturnAmt: 0,
  debitVoucherNo: '',
  purchaseOrderNo: '',
  vendorTypeName: '',
  createByName: '',
}
export interface IDebitNoteDtlModel {
  // debitNoteDetailID: number
  // returnQty: number
  // itemName: string
  // pricePerUnit: number
  // lineTotal: number
  // unitID: number
  // purchaseID: number
  // purchaseDetailID: number
  debitNoteDetailID: number
  purchaseDetailID: number
  debitNoteID: number
  purchaseID: number
  purchaseQty: number
  returnQty: number
  itemName: string
  purchaseUnitName: string
  pricePerUnit: number
  purchaseTotal: number
  returnTotal: number
  purchaseUnitID: number
  returnUnitID: number
}
export interface IDebitNoteCheckedModel {
  returnQty: number
  itemName: string
  pricePerUnit: number
  lineTotal: number
  unitID: number
  purchaseID: number
  purchaseDetailID: number
}
export interface IDebitNoteEditModel {
  returnQty: number
  itemName: string
  pricePerUnit: number
  lineTotal: number
  unitID: number
  purchaseID: number
  purchaseDetailID: number
  debitNoteDetailID: number
}
export interface IPurchasetDtlModel {
  debitNoteDetailID: number
  purchaseDetailID: number
  itemQty: number
  pricePerUnit: number
  itemName: string
  unitName: string
  unitID: number
  lineTotal: number
  debitAmount: string
  returnQty: string
  returnUnit: number
  isSelected: number
  purchaseID: number
}

export interface IPurchasetDtlByIDModel {
  debitNoteDetailID: number
  purchaseDetailID: number
  debitNoteID: number
  purchaseID: number
  purchaseQty: number
  returnQty: number
  itemName: string
  purchaseUnitName: string
  pricePerUnit: number
  purchaseTotal: number
  returnTotal: number
  purchaseUnitID: number
  returnUnitID: number
}
