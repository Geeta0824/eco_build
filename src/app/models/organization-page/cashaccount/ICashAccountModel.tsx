import {number} from 'yup'

export interface ICashAccountModel {
  cashAccountID: number
  cashAccounID:number
  employeeBankID: number
  cashaccountemployeID: number
  cashAccountTypeID: number
  employeeID: number
  cashAccountRoleID: number
  organisationBankID: number
  cashAccountTypeName: string
  employeeName: string
  cashAccountRoleName: string
  organisationBankName: string
  accountHolderName: string
  accountNumber: string
  branchName: string
  accountName: string
  accountBalance: number
  customerName: string
  mobileNumber: string
  email: string
  isActive: boolean
  createBy: number
  updateBy: number
  ipAddress: string

  cashEmployeeBalanceID: number
  cashAccontToSubID:number
  cashEmployeeSubTypeID: number
  emplyeeID: number
  cashSubAccountName:string
  cashEmployeeSubTypeName: string
  bankName: string
}

export const employeePersonalIniValues: ICashAccountModel = {
  cashAccountID: 0,
  cashAccontToSubID:0,
  cashaccountemployeID: 0,
  cashAccountTypeID: 0,
  employeeID: 0,
  cashAccounID:0,
  cashAccountRoleID: 0,
  organisationBankID: 0,
  accountName: '',
  employeeBankID: 0,
  cashAccountTypeName: '',
  employeeName: '',
  cashAccountRoleName: '',
  organisationBankName: '',
  accountHolderName: '',
  accountNumber: '',
  branchName: '',
  accountBalance: 0,
  customerName: '',
  mobileNumber: '',
  email: '',
  isActive: false,
  createBy: 0,
  updateBy: 0,
  ipAddress: '',

  cashEmployeeBalanceID: 0,

  cashEmployeeSubTypeID: 0,
  emplyeeID: 0,
  cashSubAccountName:'',
  cashEmployeeSubTypeName: '',
  bankName: '',
}

export interface IOrganizationBankModel {
  organisationBankID: number
  employeeBankID: number
  bankName: string
}
