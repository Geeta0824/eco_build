export interface INewReadymadePkgModel {
  readymadeTypeID: number
  perSqft: string
  readymadeTypeName: string
  IPAddress: string
  isActive: boolean
 


}
export const newReadymadePkgInitValues: INewReadymadePkgModel = {
  readymadeTypeID: 0,
  perSqft: '',
  readymadeTypeName: '',
  IPAddress: '',
  isActive: false,
 


}

export interface IBhkMapModel {
  bhkID: Number
  bhkName: '',
  isMember: number
}
export interface IProductMapModel {
  productID: number
  productName: '',
  productCategoryName: '',
  description: '',
  isMember: number
}
