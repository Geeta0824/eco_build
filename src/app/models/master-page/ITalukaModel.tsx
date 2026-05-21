export interface ITalukaModel {
    talukaID: number
    talukaName: string
    countryID: number
    countryName: string
    stateID: number
    stateName: string
    districtID: number
    districtName: string
    isActive: boolean
    createDate: string
    createBy: number
    updateDate: string
    updateBy: number
    iPAddress: string
  }
  
  export const talukaInitValues: ITalukaModel = {
    talukaID: 0,
    talukaName: '',
    countryID: 0,
    countryName: '',
    stateID: 0,
    stateName: '',
    districtID: 0,
    districtName: '',
    isActive: true,
    createDate: '',
    createBy: 0,
    updateDate: '',
    updateBy: 0,
    iPAddress: '',
  }
  