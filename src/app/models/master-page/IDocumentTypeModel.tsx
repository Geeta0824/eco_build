export interface IDocumentTypeModel {
  documentTypeID: number
  documentTypeName: string
  isActive: boolean
}
export const documentInitValue: IDocumentTypeModel = {
  documentTypeID: 0,
  documentTypeName: '',
  isActive: false,
}

export interface IMediaTypeModel {
  mediaTypeID: number
  mediaType: string
}