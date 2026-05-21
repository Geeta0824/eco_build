export interface IEmpDocMapModel {
  employeeDocID: number
  employeeID: number
  documentTypeID: number
  docNumber: string
  description: string
  mediaTypeID: number
  filePath: string
  isActive: boolean
  firstName: string
  lastName: string
  employeeCode: string
  documentTypeName: string
  mediaType: string
}
export const empDocMapIniValues: IEmpDocMapModel = {
  employeeDocID: 0,
  employeeID: 0,
  documentTypeID: 0,
  docNumber: '',
  description: '',
  mediaTypeID: 0,
  filePath: '',
  isActive: false,
  firstName: '',
  lastName: '',
  employeeCode: '',
  documentTypeName: '',
  mediaType: '',
}
