import { AuthModel } from './AuthModel'
import { UserAddressModel } from './UserAddressModel'
import { UserCommunicationModel } from './UserCommunicationModel'
import { UserConfigModel } from './UserConfigModel'
import { UserEmailSettingsModel } from './UserEmailSettingsModel'
import { UserSocialNetworksModel } from './UserSocialNetworksModel'

export interface UserModel {
  anniversaryDate: string
  birthDate: string
  bloodGroupID: number
  branchID: number
  contactNumber: string
  curntAddress1: string
  curntAddress2: string
  curntCityID: number
  curntCountryID: number
  curntPincode: string
  curntSateID: number
  departmentID: number
  designationID: number
  email: string
  emergencyContactNumber: string
  emergencyRelationID: number
  emergenecyContactName: string
  employeeCode: string
  employeeID: number
  firstName: string
  genderID: number
  isActive: boolean
  isSuccess: boolean
  joinDate: string
  lastName: string
  message: string
  middleName: string
  nationalityID: number
  organizationID: number
  organizationLeaveDate: string
  perAddress1: string
  perAddress2: string
  perCityID: number
  perCoutnryID: number
  perPincode: string
  perStateID: number
  photoPath: string
  resignDate: string
  roleID: number
  salary: number
  shiftID: number
  userID: number
  yearlyPaidLeave: number
}
