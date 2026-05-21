export interface IModularProductMasterModel {
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
  pricePerSqFt: number
  defaultUnitID: number
  isActive: boolean
  createBy: number
  iPAddress: string
  modularTypeID: number
  modularTypeName: string
  agencyTypeName: string
  agencyTypeID: number
  agnecyPrice: number
}
export const modularProductInitValue: IModularProductMasterModel = {
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
  pricePerSqFt: 0.0,
  defaultUnitID: 0,
  isActive: false,
  createBy: 0,
  iPAddress: '',
  modularTypeID: 0,
  modularTypeName: '',
  agencyTypeName: '',
  agencyTypeID: 0,
  agnecyPrice: 0,
}

export interface IModularProductCateDropdown {
  productCategoryID: number
  productCategoryName: string
  isActive: boolean
}
