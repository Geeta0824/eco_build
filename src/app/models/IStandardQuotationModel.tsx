export interface IStandardQuotationModel {
  standarQuotationPDFID: number
  bhkID: number
  carpetAreaID: number
  projectTypeID: number
  filePath: string
  bhkName: string
  projectType: string
  carpetArea: string
  message: string
  isSuccess: boolean
}

export const standardQuotationInitValues: IStandardQuotationModel = {
  standarQuotationPDFID: 0,
  bhkID: 0,
  carpetAreaID: 0,
  projectTypeID: 0,
  filePath: '',
  bhkName: '',
  projectType: '',
  carpetArea: '',
  message: '',
  isSuccess: false,
}
