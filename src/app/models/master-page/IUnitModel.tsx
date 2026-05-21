export interface IUnitModel {
  unitID: number
  unitName: string
  isActive: boolean
  createBy: number
  iPAddress: string
}
export const unitInitValue: IUnitModel = {
  unitID: 0,
  unitName: '',
  isActive: false,
  createBy: 0,
  iPAddress: '',
}
