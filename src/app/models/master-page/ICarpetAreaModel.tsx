export interface ICarpetAreaModel {
    carpetAreaID: number
    carpetArea: string
    isActive: boolean
    createBy: number
    iPAddress: string
  }
  export const carpetAreaInitValue: ICarpetAreaModel = {
    carpetAreaID: 0,
    carpetArea: '',
    isActive: false,
    createBy: 0,
    iPAddress: ''
  }
  