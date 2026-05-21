export interface ICountryModel {
    countryID: number
    countryCode: string
    countryName: string
    flagPath: string
    isActive: boolean
    createDate: string
    createBy: number
    updateDate: string
    updateBy: number
    iPAddress: string
  }
  
  export const countryInitValues: ICountryModel = {
    countryID: 0,
    countryCode: '',
    countryName: '',
    flagPath: '',
    isActive: false,
    createDate: '',
    createBy: 0,
    updateDate: '',
    updateBy: 0,
    iPAddress: '',
  }

  export interface ICountryDDModel {
    countryID: number
    countryCode: string
    countryName: string
  }