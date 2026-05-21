export interface ICartLisyByQuotationModel {
  quotationDetailID: number
  quotationID: number
  categoryID: number
  productID: number
  planAreaID: number
  unitID: number
  length: string
  depth: string
  height: string
  noOfUnit: string
  productCategoryName: string
  productName: string
  unitName: string
  areaName: string
  photoPath: string
  description: string
  titleAreaName: string
  titleAreaID: number
  isAreaMandatory: boolean
  isProductMandatory: boolean
  isdelete: boolean
  isRemovedByDesigner: boolean
}
export interface IOfferListQuotationModel {
  turnekyQutationOfferID: number
  quotationID: number
  offerID: number
  offerTitle: string
  offerDesc: string
}
export interface IDIYCheckOutModel {
  productID: number
  productName: string
  description: string
  areaName: string
  productCategoryName: string
  unitName: string
  parentName: string
  qutationID: number
  categoryID: number

  planAreaID: number
  unitID: number
  length: number
  depth: number
  height: number
  noOfUnit: number
  turnkeyQty: string
}
export interface IDIYReduxModel {
  quotationId: number
  count: number
}
export interface IDIYProductListModel {
  areaName: any
  productID: number
  productCategoryID: number
  productName: string
  description: string
  length: number
  depth: number
  height: number
  noOfUnit: number
  turnkeyNoOfUnit: string
  photoPath: string
  productCategoryName: string
  defaultUnitID: number
  isHeightChange: true
  unitName: string
  planAreaID: number
  turnkeyQty: string
}

export interface IDIYQuotationModel {
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
  isCheckOut: boolean
  isExtraDiscount: boolean
  ExtraDiscount: number
  discountStatusID: number
  discountCondition: string
  discountBy: number
  discountResponseBy: number
  extraDiscount: string
  extraDiscStatusName: string
  cloneCustomerName: string

  reqExtraDisc: string
  isBeforeDiscount: boolean
}

export const diyQuotationInitValues: IDIYQuotationModel = {
  quotationID: 0,
  quotationNumber: '',
  projectName: '',
  projectNumber: '',
  customerID: 0,
  projectTypeID: 0,
  quotationDate: '',
  quotationAmount: '',
  employeeID: 0,
  bhkName: '',
  status: 0,
  bhkid: 0,
  carpetAreaID: 0,
  standarQuotationPDFID: 0,
  carpetArea: '',
  projectType: '',
  customerName: '',
  email: '',
  employeeName: '',
  mobileNumber: '',
  customerBranchName: '',
  employeeBranchName: '',
  quoteStatus: '',
  isCheckOut: false,
  isExtraDiscount: false,
  ExtraDiscount: 0,
  discountStatusID: 0,
  discountCondition: '',
  discountBy: 0,
  discountResponseBy: 0,
  extraDiscount: '',
  extraDiscStatusName: '',
  reqExtraDisc: '',
  isBeforeDiscount: false,
  cloneCustomerName: '',
}
