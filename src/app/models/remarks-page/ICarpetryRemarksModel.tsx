export interface ICarpetryRemarksModel {
    quotationRemarksID: number
    projectTypeID: number
    typeID: number
    remarks: string
    createBy: number
    iPAddress: string
    projectType: string
    isActive:boolean
  }
  export const carpetryRemarksInitValue: ICarpetryRemarksModel = {
    quotationRemarksID: 0,
    projectTypeID: 0,
    typeID: 0,
    remarks: '',
    createBy: 0,
    iPAddress: '', 
    projectType: '', 
    isActive:false
  }
  