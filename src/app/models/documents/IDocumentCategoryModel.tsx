export interface IDocumentCategoryModel {
  documentCategoryID: number
  documentCategoryName: string
  isActive: boolean
}
export interface IUserMapWithDocCatgryModel {
  roleID: number
  roleName: string
  isMember:number
}
export const documentCtgryInitValue: IDocumentCategoryModel = {
  documentCategoryID: 0,
  documentCategoryName: '',
  isActive: false,
}
