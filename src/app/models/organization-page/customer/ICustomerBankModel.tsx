export interface ICustomerBankModel {
  customerBankID: number
  customerID: number
  bankName: string
  branchName: string
  ifscCode: string
  accountNumber: string
  bankAccountType: string
  bankAccountTypeID: number
  micrCode: string
  isActive: boolean
}
export const customerBankIniValue: ICustomerBankModel = {
  customerBankID: 0,
  customerID: 0,
  bankName: '',
  branchName: '',
  ifscCode: '',
  accountNumber: '',
  bankAccountType: '',
  bankAccountTypeID: 0,
  micrCode: '',
  isActive: true,
}
