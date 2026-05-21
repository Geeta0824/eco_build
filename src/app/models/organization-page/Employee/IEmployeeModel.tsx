export interface IEmployeePageModel {
  employeeID: number
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  departmentName: string
  designationName: string
  branchName: string
  branchCode: string
  departmentID: number
  designationID: number
  branchID: number
  pwd: string
  kylasID: number
  isActive: boolean
}

export interface IEmployeeWebModel {
  employeeID: number
  employeeCode: string
  firstName: string
  lastName: string
  middleName: string
  fullName: string
  email: string
  approveBy: string
  finalApprveBy: string
  contactNumber: string
  photoPath: string
  emergencyContactNumber: string
  emergenecyContactName: string
  joinDate: string
  birthDate: string
  anniversaryDate: string
  resignDate: string
  organizationLeaveDate: string
  salary: number
  perPincode: string
  curntAddress1: string
  curntAddress2: string
  curntPincode: string
  yearlyPaidLeave: number
  bloodGroupID: number
  bloodGroupName: string
  bloodGroupCode: string
  genderID: number
  genderName: string
  emergencyRelationID: number
  relationName: string
  nationalityID: number
  nationalityName: string
  shiftID: number
  shiftName: string
  organizationID: number
  organizationName: string
  currentDesignationName: string
  currentDepartmentName: string
  currentBranchName: string
  branchID: number
  branchName: string
  departmentID: number
  departmentName: string
  departmentCode: string
  designationID: number
  designationName: string
  perAddress1: string
  perAddress2: string
  perCityID: number
  perCityName: string
  perStateID: number
  perStateName: string
  perCoutnryID: number
  perCountryName: string
  perCountryCode: string
  curntCityID: number
  curntCityName: string
  curntSateID: number
  curntStateName: string
  curntCountryID: number
  curntCountryCode: string
  curntCountryName: string
  roleID: number
  roleName: string
  pwd: string
  kylasID: number
  isActive: boolean
}
export const employeeIniValues: IEmployeeWebModel = {
  employeeID: 0,
  employeeCode: '',
  firstName: '',
  lastName: '',
  middleName: '',
  fullName: '',
  email: '',
  approveBy: '',
  finalApprveBy: '',
  contactNumber: '',
  photoPath: '',
  emergencyContactNumber: '',
  emergenecyContactName: '',
  joinDate: '',
  birthDate: '',
  anniversaryDate: '',
  resignDate: '',
  organizationLeaveDate: '',
  salary: 0.0,
  perPincode: '',
  curntAddress1: '',
  curntAddress2: '',
  curntPincode: '',
  yearlyPaidLeave: 0,
  bloodGroupID: 0,
  bloodGroupName: '',
  bloodGroupCode: '',
  genderID: 0,
  genderName: '',
  emergencyRelationID: 0,
  relationName: '',
  nationalityID: 0,
  nationalityName: '',
  shiftID: 0,
  shiftName: '',
  organizationID: 0,
  organizationName: '',
  currentDesignationName: '',
  currentDepartmentName: '',
  currentBranchName: '',
  branchID: 0,
  branchName: '',
  departmentID: 0,
  departmentName: '',
  departmentCode: '',
  designationID: 0,
  designationName: '',
  perAddress1: '',
  perAddress2: '',
  perCityID: 0,
  perCityName: '',
  perStateID: 0,
  perStateName: '',
  perCoutnryID: 0,
  perCountryName: '',
  perCountryCode: '',
  curntCityID: 0,
  curntCityName: '',
  curntSateID: 0,
  curntStateName: '',
  curntCountryID: 0,
  curntCountryCode: '',
  curntCountryName: '',
  roleID: 0,
  roleName: '',
  pwd: '',
  kylasID: 0,
  isActive: false,
}

export interface IEmployeePersonalModel {
  anniversaryDate: string
  birthDate: string
  bloodGroupID: number
  bloodGroupName: string
  contactNumber: string
  departmentID: number
  departmentName: string
  designationID: number
  designationName: string
  email: string
  employeeCode: string
  firstName: string
  genderID: number
  genderName: string
  isActive: boolean
  joinDate: string
  lastName: string
  middleName: string
  nationalityID: number
  nationalityName: string
  photoPath: string
  roleID: number
  roleName: string
  branchID: number
  branchName: string
  kylasID: number
}

export const employeePersonalIniValues: IEmployeePersonalModel = {
  anniversaryDate: '',
  birthDate: '',
  bloodGroupID: 0,
  bloodGroupName: '',
  contactNumber: '',
  departmentID: 0,
  departmentName: '',
  designationID: 0,
  designationName: '',
  email: '',
  employeeCode: '',
  firstName: '',
  genderID: 0,
  genderName: '',
  isActive: true,
  joinDate: '',
  lastName: '',
  middleName: '',
  nationalityID: 0,
  nationalityName: '',
  photoPath: '',
  roleID: 0,
  roleName: '',
  branchID: 0,
  branchName: '',
  kylasID: 0,
}

export interface IEmployeeAddressModel {
  curntAddress1: string
  curntAddress2: string
  curntCityID: number
  curntTalukaID: number
  curntCountryID: number
  curntCountryName: string
  curntStateName: string
  curntCityName: string
  curntTalukaName: string
  curntPincode: string
  curntSateID: number
  perAddress1: string
  perAddress2: string
  perCityID: number
  perTalukaID: number
  perCoutnryID: number
  perPincode: string
  perStateID: number
  curntPincodeCityName: string
  perPincodeCityName: string
}
export const employeeAddressIniValues: IEmployeeAddressModel = {
  curntAddress1: '',
  curntAddress2: '',
  curntCityID: 0,
  curntCountryID: 0,
  curntCountryName: '',
  curntStateName: '',
  curntCityName: '',
  curntTalukaName: '',
  curntPincode: '',
  curntSateID: 0,
  perAddress1: '',
  perAddress2: '',
  perCityID: 0,
  perCoutnryID: 0,
  perPincode: '',
  perStateID: 0,
  curntPincodeCityName: '',
  perPincodeCityName: '',
  curntTalukaID: 0,
  perTalukaID: 0,
}

export interface IEmployeeOrganizationModel {
  branchID: number
  designationID: number
  isActive: true
  isSuccess: true
  joinDate: string
  organizationLeaveDate: string
  resignDate: string
  salary: number
  shiftID: number
  yearlyPaidLeave: number
  roleID: number
}

export interface IForgetPasswordModel {
  employeeID: number
  currentPassWord: string
  newPassWord: string
  conformPassWord: string
}
export const forgetPasswordInitValue: IForgetPasswordModel = {
  employeeID: 0,
  currentPassWord: '',
  newPassWord: '',
  conformPassWord: '',
}

export interface IEmployeeSearchDDModel {
  label: string
  mobileNumber: string
  value: number
}
