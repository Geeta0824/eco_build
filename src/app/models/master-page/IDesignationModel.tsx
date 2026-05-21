export interface IDesignationModel {
  designationName: string
  departmentName: string
  departmentID: number
  designationID: number
  isActive: boolean
}
export const designationInitValues: IDesignationModel = {
  designationName: '',
  departmentName: '',
  departmentID: 0,
  designationID: 0,
  isActive: false,
}
