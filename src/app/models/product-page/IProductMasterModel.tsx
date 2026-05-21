export interface IProductMasterModel {
  productID: number
  productCategoryID: number
  productCategoryName: string
  productName: string
  photoPath: string
  description: string
  unitName: string
  length: number
  height: number
  depth: number
  sqft: number
  agencyTypeId: number
  agencyTypeName: string
  pricePerSqFt: number
  agnecyPrice: number
  defaultUnitID: number
  isActive: boolean
  createBy: number
  iPAddress: string
  isMinLength: boolean
  isMinHeight: boolean
  isMinTotalSqft: boolean
  isCrarpetArea: boolean
  minLength: number
  minHeight: number
  minTotalUnit: number
}
export const productInitValue: IProductMasterModel = {
  productID: 0,
  productCategoryID: 0,
  productCategoryName: '',
  productName: '',
  photoPath: '',
  description: '',
  unitName: '',
  length: 0.0,
  height: 0.0,
  depth: 0.0,
  sqft: 0.0,
  agencyTypeId: 0,
  agencyTypeName: '',
  pricePerSqFt: 0.0,
  agnecyPrice: 0.0,
  defaultUnitID: 0,
  isActive: false,
  createBy: 0,
  iPAddress: '',
  isMinLength: false,
  isMinHeight: false,
  isMinTotalSqft: false,
  isCrarpetArea: false,
  minLength: 0,
  minHeight: 0,
  minTotalUnit: 0
}

export interface IAreaProductModel {
  areaID: number
  areaName: string
  isMember: number
}

export interface IAsseccoriesProductModel {
  asseccoriesID: number
  accessoriesName: string
  isMember: number
}
