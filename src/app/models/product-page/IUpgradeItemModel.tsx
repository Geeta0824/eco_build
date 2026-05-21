import {BooleanSupportOption} from 'prettier'

export interface IUpgradeItemModel {
  upGradeItemID: number
  agencyTypeID: number
  agencyTypeName: string
  upGradeItemName: string
  upGradePercentage: number
  isRemovedByDesigner: boolean
}
export const upgradeItemInitValue: IUpgradeItemModel = {
  upGradeItemID: 0,
  agencyTypeID: 0,
  agencyTypeName: '',
  upGradeItemName: '',
  upGradePercentage: 0,
  isRemovedByDesigner: false,
}
