export interface IOrganizationBankModel {
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
  accountName:string
  isActive: boolean
}
export const organizationInitValues: IOrganizationBankModel = {
  organisationBankID: 0,
  bankTypeID: 0,
  bankAccountTypeID: 0,
  bankTypeName: '',
  bankName: '',
  branchName: '',
  accountNumber: '',
  accountHolderName: '',
  ifscCode: '',
  accountName:'',
  micrCode: '',
  isActive: false,
}
