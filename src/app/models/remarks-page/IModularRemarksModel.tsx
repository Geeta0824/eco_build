export interface IModularRemarksModel {
  quotationRemarksID: number
    projectTypeID: number
    typeID: number
    remarks: string
    createBy: number
    iPAddress: string
    isActive:boolean
  }
  export const modularRemarksInitValue: IModularRemarksModel = {
    quotationRemarksID: 0,
    projectTypeID: 0,
    typeID: 0,
    remarks: '',
    createBy: 0,
    iPAddress: '',
    isActive:false
  }
  