export interface IDistrictModel {
  countryID:number
  cityID: number
  stateID: number
  stateMaster: string
  cityName: string
  countryName:string
  isActive: boolean
  CreateDate: string
  CreateBy: number
  UpdateDate: string
  UpdateBy: number
  IPAddress: string
}

export const districtModelInitValues: IDistrictModel = {
  countryID: 0,
  cityID: 0,
  stateID: 0,
  stateMaster: '',
  cityName: '',
  countryName: '',
  isActive: false,
  CreateDate: '',
  CreateBy: 0,
  UpdateDate: '',
  UpdateBy: 0,
  IPAddress: '',
}

export interface IDistrictDDModel {
  cityID: 0,
  cityName: '',
  districtID: 0,
  districtName: '',
}
export interface IStateWebModel {
  countryID: number
  countryName: string
  isActive: boolean
  stateID: number
  stateMaster: string
}