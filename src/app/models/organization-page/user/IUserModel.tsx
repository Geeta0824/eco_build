export interface IUserModel {
  userID: number
  employeeID: number
  departmentID: number
  roleID: number
  userName: string
  departmentName: string
  employeeName: string
  roleName: string
  password: string
  isActive: boolean
}
export const userInitValues: IUserModel = {
  userID: 0,
  employeeID: 0,
  departmentID: 0,
  roleID: 0,
  userName: '',
  departmentName: '',
  employeeName: '',
  roleName: '',
  password: '',
  isActive: false,
}
