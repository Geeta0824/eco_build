export interface AreaPriceModel {
  areaRateID: number
  areaID: number
  projectTypeID: number
  bhkID: number
  sqftAreaID: number
  bhkName: string
  areaRate: number
  projectType: string
  areaName: string
  carpetArea: string
}
export const areaPriceInitValue: AreaPriceModel = {
  areaRateID: 0,
  areaID: 0,
  projectTypeID: 0,
  bhkID: 0,
  sqftAreaID: 0,
  bhkName: '',
  areaRate: 0,
  projectType: '',
  areaName: '',
  carpetArea: '',
}

export interface IAreaSqftModel {
  carpetAreaID: number
  carpetArea: string
  isMember: number
}
