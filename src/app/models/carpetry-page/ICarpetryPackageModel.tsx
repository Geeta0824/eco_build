export interface ICartLisyByPackageModel {
  packageDetailID: number
  packageID: number
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
  description: string
  photoPath: string
}

export interface IDIYCheckOutModel {
  productID: number
  productName: string
  description: string
  areaName: string
  productCategoryName: string
  unitName: string
  parentName: string
  packageID: number
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
  isHeightChange: true
  unitName: string
  planAreaID: number
  turnkeyQty: string
  turnkeyNoOfUnit: string
}

export interface INewPackageModel {
  packageID: number
  packageName: string
  packageTypeID: number
  bhkID: number
  carpetAreaID: number
  photoPath: string
  packageAmount: string
  turnkeyPackageAmount: string
  bhkName: string
  carpetArea: string
  projectType: string
  totalProducts: string
}
export interface IPackageModel {
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
  packageName: string
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
}

export const packageInitValues: IPackageModel = {
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
  packageName: '',
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
}
export interface IBranchRateMapModel {
  branchID: number
  branchRateID: number
  branchName: string
  branchCode: string
  readyMadePercentage: number
  percentage: number

}
