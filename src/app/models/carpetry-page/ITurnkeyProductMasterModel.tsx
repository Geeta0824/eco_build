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
  sqft: string
  noOfUnit:string
  pricePerSqFt: number
  defaultUnitID: number
  isActive: boolean
  createBy: number
  iPAddress: string
  isBeforeDiscount:boolean
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
  sqft: '',
  noOfUnit:'',
  pricePerSqFt: 0.0,
  defaultUnitID: 0,
  isActive: false,
  createBy: 0,
  iPAddress: '',
  isBeforeDiscount:false
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
