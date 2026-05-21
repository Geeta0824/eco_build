export interface IAreaPinCodeModel {
  areaPincodeID: number
  stateID: number
  cityID: number
  stateName: string
  areaName: string
  cityName: string
  pincode: string
  isActive: boolean
  createBy: number
  updateBy: number
  ipAddress: string
}
export const areaPincodeInitValues: IAreaPinCodeModel = {
  areaPincodeID: 0,
  stateID: 0,
  cityID: 0,
  stateName: '',
  areaName: '',
  cityName: '',
  pincode: '',
  isActive: true,
  createBy: 0,
  updateBy: 0,
  ipAddress: '192.168.0.0'
}
