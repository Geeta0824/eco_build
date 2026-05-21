export interface IVendorBankDetailsModel {
    vendorBankID: number
    vendorID: number
    bankName: string
    branchName: string
    ifscCode: string
    accountNumber: string
    accountName: string
    accountTypeID: number
    pfaCompanyName: string
    pfaunNumber: string
    pfaNumber: string
    esicNumber: string
    esicStartDate: string
    esicExpDate: string
    pfaStartDate: string
    pfaEndDate: string
    bankAccountType: string
    isActive: boolean
  }
  export const vendorBankDetailsIniValue: IVendorBankDetailsModel = {
    vendorBankID: 0,
    vendorID: 0,
    bankName: '',
    branchName: '',
    ifscCode: '',
    accountNumber: '',
    accountName: '',
    accountTypeID: 0,
    pfaCompanyName: '',
    pfaunNumber: '',
    pfaNumber: '',
    esicNumber: '',
    esicStartDate: '',
    esicExpDate: '',
    pfaStartDate: '',
    pfaEndDate: '',
    bankAccountType: '',
    isActive: false,
  }
  