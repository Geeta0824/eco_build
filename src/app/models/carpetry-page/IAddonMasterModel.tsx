export interface IAddonMasterModel {
  addonItemID: number
  addonItemName: string
  productCategoryName: string
  itemPrice: number
  filePath: string
  isActive: boolean
  createBy: number
  productCategoryID: number
  iPAddress: string
}
export const addonMasterInitValue: IAddonMasterModel = {
  addonItemID: 0,
  addonItemName: '',
  productCategoryName: '',
  itemPrice: 0,
  filePath: '',
  isActive: false,
  productCategoryID: 0,
  createBy: 0,
  iPAddress: '',
}
