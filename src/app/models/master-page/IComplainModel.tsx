import {BooleanSupportOption} from 'prettier'

export interface IComplainModel {
  complainID: number
  projectTypeID: number
  agencyTypeID: number
  complainDescription: string
  agencyTypeName: string
  quotationCategoryName: string
}
export const complainInitValue: IComplainModel = {
  complainID: 0,
  projectTypeID: 0,
  agencyTypeID: 0,
  complainDescription: '',
  agencyTypeName: '',
  quotationCategoryName: '',
}

export interface IAgencyTypeDropdownModel {
  agencyTypeID: number
  agencyTypeName: string
}
