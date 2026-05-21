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
}
export interface IDIYCheckOutModel {
  primaryID?: any
  productID: number
  productName: string
  description: string
  areaName: string
  productCategoryName: string
  unitName: string
  parentName: string
  planAreaID: number
  productCategoryID: number
  length: string
  pricePerSqFt: string
  depth: string
  height: string
  noOfUnit: number
  photoPath: string
  defaultUnitID: number
  isHeightChange: boolean
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
  photoPath: string
  productCategoryName: string
  defaultUnitID: number
  isHeightChange: boolean
  unitName: string
  planAreaID: number
  isMinLength: boolean
  isMinHeight: boolean
  isMinTotalSqft: boolean
  isCrarpetArea: boolean
  minLength: number
  minHeight: number
  minTotalUnit: number
}

export interface IDIYQuotationModel {
  quotationID: number
  quotationNumber: string
  projectName: string
  projectNumber: string
  customerID: number
  projectTypeID: number
  projectID: number
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
  isBooked: boolean
  isExtraDiscount: boolean
  ExtraDiscount: number
  discountStatusID: number
  discountCondition: string
  discountBy: number
  discountResponseBy: number
  extraDiscount: string
  extraDiscStatusName: string
  discountTypeID: number
  reqExtraDisc: string
  isBeforeDiscount: boolean
  isModularMerge: boolean
  address1: string
  cloneCustomerName: string
}

export const diyQuotationInitValues: IDIYQuotationModel = {
  quotationID: 0,
  quotationNumber: '',
  projectName: '',
  projectNumber: '',
  customerID: 0,
  projectTypeID: 0,
  projectID: 0,
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
  isBooked: false,
  isCheckOut: false,
  isExtraDiscount: false,
  ExtraDiscount: 0,
  discountStatusID: 0,
  discountCondition: '',
  discountBy: 0,
  discountResponseBy: 0,
  extraDiscount: '',
  extraDiscStatusName: '',
  discountTypeID: 0,
  reqExtraDisc: '',
  isBeforeDiscount: false,
  isModularMerge: false,
  address1: '',
  cloneCustomerName: '',
}

export interface IDIYUpgradeItemModel {
  diyUpgrageItemMapID: number
  quotationID: number
  upGradeItemID: number
  agencyTypeID: number
  upGradeItemName: string
  agencyTypeName: string
  upGradePercentage: number
  isRemovedByDesigner: boolean
}
export interface IUpgradeKazulenciaModel {
 diyKazulenciaUpgrageItemMapID: number,
      quotationID: number,
      upGradeItemID: number,
      agencyTypeID: number,
      upGradeItemName: string,
      agencyTypeName: string,
      upGradePercentage: number,
      isRemovedByDesigner: boolean
}
