export interface IModularProductCategoryModel {
  modularTypeID: number
  modularTypeName: string
  productCategoryID: number
  productCategoryName: string
  photoPath: string
  isActive: boolean
  createBy: number
  iPAddress: string
}
export const modularProductCategoryInitValue: IModularProductCategoryModel = {
  modularTypeID: 0,
  modularTypeName: '',
  productCategoryID: 0,
  productCategoryName: '',
  photoPath: '',
  isActive: false,
  createBy: 0,
  iPAddress: '',
}

export interface IModularTypeModel {
  modularTypeID: number
  modularTypeName: string
}
