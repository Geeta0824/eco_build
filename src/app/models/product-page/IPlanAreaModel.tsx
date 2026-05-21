export interface IPlanAreaModel {
  planAreaID: number
  areaName: string
  areaPrice: string
  isActive: boolean
  isMandatory: boolean
  createBy: number
  iPAddress: string
}
export const planAreaInitValue: IPlanAreaModel = {
  planAreaID: 0,
  areaName: '',
  areaPrice: '',
  isActive: false,
  isMandatory: false,
  createBy: 0,
  iPAddress: '',
}