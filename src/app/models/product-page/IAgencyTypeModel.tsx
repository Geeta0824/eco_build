import {BooleanSupportOption} from 'prettier'

export interface IAgencyTypeModel {
  agencyTypeID: number
  agencyTypeName: string
  adminCommissionPercentage: string
  isActive: boolean
  isKazulencia: boolean
  createBy: number
  updateBy: number
  iPAddress: string
}
export const agencyTypeInitValue: IAgencyTypeModel = {
  agencyTypeID: 0,
  agencyTypeName: '',
  adminCommissionPercentage: '',
  isActive: false,
  isKazulencia: false,
  createBy: 0,
  updateBy: 0,
  iPAddress: '',
}
export interface IProductCategoryTypeModel {
  productCategoryID: number
  productCategoryName: string
  isMember: number
}
