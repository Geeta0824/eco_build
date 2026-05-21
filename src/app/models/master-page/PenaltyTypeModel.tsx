export interface PenaltyTypeModel {
  penaltyTypeID: number
  penaltyTypeName: string
}
export const penaltyTypeInitValues: PenaltyTypeModel = {
  penaltyTypeID: 0,
  penaltyTypeName: '',
}

export interface IEmpVendorModel {
  empVendorID: number
  empVendorName: string
  companyName: string
  contactNumber: string
  email: string
}

export interface IPenaltyForModel {
  penaltyForID: number
  penaltyForName: string
}

export interface IHeadOfDepartmentModel {
  headOfDepartmentID: number
  headOfDepartmentName: string
}
