export interface IBankModel {
  organisationBankID: number
  bankTypeID: number
  bankAccountTypeID: number
  bankTypeName: string
  bankName: string
  branchName: string
  accountNumber: string
  accountHolderName: string
  ifscCode: string
  micrCode: string
  isActive: boolean
}
export const bankInitValues: IBankModel = {
  organisationBankID: 0,
  bankTypeID: 0,
  bankAccountTypeID: 0,
  bankTypeName: '',
  bankName: '',
  branchName: '',
  accountNumber: '',
  accountHolderName: '',
  ifscCode: '',
  micrCode: '',
  isActive: false,
}
