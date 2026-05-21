export interface IDNCRemarksModel {
  quotationRemarksID: number
  projectTypeID: number
  typeID: number
  remarks: string
  createBy: number
  isActive: boolean
  iPAddress: string
  dncTypeName: string
}
export const dncRemarksInitValue: IDNCRemarksModel = {
  quotationRemarksID: 0,
  projectTypeID: 0,
  typeID: 0,
  remarks: '',
  createBy: 0,
  isActive: false,
  iPAddress: '',
  dncTypeName: '',
}

export interface IDNCTypeModel {
  dncTypeID: number
  dncTypeName: string
}
