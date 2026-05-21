export interface IQuotationLevelModel {
  quotationLevelID: number
  quotationLevelName: string
}
export const quotationLevelInitValue: IQuotationLevelModel = {
  quotationLevelID: 0,
  quotationLevelName: '',
}
export interface IEmployeeQuoLevelMapModel {
  employeeID: number
  employeeName: string
  designationName: string
  roleName: string
  isMember: number
  isActive: boolean
}
