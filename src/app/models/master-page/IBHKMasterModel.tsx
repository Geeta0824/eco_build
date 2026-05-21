export interface IBHKMasterModel {
    bhkid: number
    bhkName: string
    isActive: boolean
    createBy: number
    iPAddress: string
  }
  export const bhkMasterInitValue: IBHKMasterModel = {
    bhkid: 0,
    bhkName: '',
    isActive: false,
    createBy: 0,
    iPAddress: ''
  }
  