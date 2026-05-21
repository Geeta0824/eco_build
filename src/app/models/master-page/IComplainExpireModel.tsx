export interface IComplainExpireModel {
  complainExpireID: number
  projectTypeID: number
  categoryID: number
  maintenanceDays: number
  categoryName: string
  createBy: number
  updateBy: number
  ipAddress: string
}
export const complainExpireInitValue: IComplainExpireModel = {
  projectTypeID: 0,
  complainExpireID: 0,
  categoryID: 0,
  maintenanceDays: 0,
  categoryName: '',
  createBy: 0,
  updateBy: 0,
  ipAddress: '',
}
