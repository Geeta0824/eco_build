export interface IChangePasswordModel {
  employeeID: number
  currentPassWord: string
  newPassWord: string
  conformNewPassWord: string
}
export const changePasswordInitValue: IChangePasswordModel = {
  employeeID: 0,
  currentPassWord: '',
  newPassWord: '',
  conformNewPassWord: '',
}
