export interface IDocumentMstModel {
  documentCategoryName: string
  documentName: string
  attachFile: string
  documentID: number
  roleID: number
  documentCategoryID: number
  isActive: boolean
}
export const documentMstInitValue: IDocumentMstModel = {
  documentCategoryName: '',
  documentName: '',
  attachFile: '',
  documentID: 0,
  roleID: 0,
  documentCategoryID: 0,
  isActive: false,
}
export interface IHRDocumentModel {
  roleID: number
  documentCategoryName: string
  documentName: string
  attachFile: string
  documentID: number
  documentCategoryID: number
  isActive: boolean
}
