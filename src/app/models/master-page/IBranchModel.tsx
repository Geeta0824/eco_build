export interface IBranchModel {
  branchID: number
  branchName: string
  branchCode: string
  contactPerson: string
  cotactDesignation: number
  mobileNumber: string
  phoneNumber: string
  faxNumber: string
  email: string
  address1: string
  address2: string
  countryID: number
  stateID: number
  districtID: number
  talukaID: number
  pincode: string
  desgnationName: string
  countryName: string
  stateMaster: string
  cityName: string
  districtName: string
  talukaName: string
  isActive: boolean
  ipAddress: string
  createBy: number
  updateBy: number
  isMember: number
 facebookPath:string
 instagramPath:string
 googleMapPath:string
 kazulenciaMinAmt:number
}
export const branchInitValues: IBranchModel = {
  branchID: 0,
  branchName: '',
  branchCode: '',
  contactPerson: '',
  cotactDesignation: 0,
  mobileNumber: '',
  phoneNumber: '',
  faxNumber: '',
  email: '',
  address1: '',
  address2: '',
  countryID: 0,
  stateID: 0,
  districtID: 0,
  talukaID: 0,
  pincode: '',
  desgnationName: '',
  countryName: '',
  stateMaster: '',
  cityName: '',
  districtName: '',
  talukaName: '',
  isActive: false,
  ipAddress: '',
  createBy: 0,
  updateBy: 0,
  isMember: 0,
  facebookPath:'',
  instagramPath:'',
  googleMapPath:'',
  kazulenciaMinAmt:0
}

export interface IBranchRateModel {
  branchRateID: number
  branchID: number
  readyMadePercentage: number
  diyPercentage: number
  modularPercentage: number
  dncPercentage: number
  create_Update_By: number
  ipAddress: string
}
