export interface IStateModel {
  stateID: number
  countryID: number
  stateMaster: string
  countryName: string
  isActive: boolean
  createDate: string
  createBy: number
  updateDate: string
  updateBy: number
  iPAddress: string
}
export const stateInitValues: IStateModel = {
  stateID: 0,
  countryID: 0,
  stateMaster: '',
  countryName: '',
  isActive: true,
  createDate: '',
  createBy: 0,
  updateDate: '',
  updateBy: 0,
  iPAddress: '',
}
export interface IStateDDModel {
  stateID: number
  stateName: number
  stateMaster: string
}