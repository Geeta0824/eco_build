export interface IEduCategoryModel {
    eduCategoryID: number
    eduCategoryName: string
    isActive: boolean
  }
  export const eduCategoryInitValue: IEduCategoryModel = {
    eduCategoryName: '',
    eduCategoryID: 0,
    isActive: false
  }