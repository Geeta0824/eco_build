export interface IProductCategoryModel {
  productCategoryID: number
  productCategoryName: string
  photoPath: string
  isActive: boolean
  createBy: number
  iPAddress: string
}
export const productCategoryInitValue: IProductCategoryModel = {
  productCategoryID: 0,
  productCategoryName: '',
  photoPath: '',
  isActive: false,
  createBy: 0,
  iPAddress: '',
}
