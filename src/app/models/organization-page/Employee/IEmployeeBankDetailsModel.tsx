export interface IEmployeeBankDetailsModel {
    employeeBankID: number
    employeeID: number
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
  export const employeeBankDetailsIniValue: IEmployeeBankDetailsModel = {
    employeeBankID: 0,
    employeeID: 0,
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
  