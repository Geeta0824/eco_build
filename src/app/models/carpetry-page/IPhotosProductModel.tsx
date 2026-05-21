export interface IPhotosProductModel {
    projectTypeID:number
    projectID: number
    projectType: string
    productName: string
    turnkeyProductImageID: number
    filePath: string
    createBy: number
    iPAddress: string
  }
  export const photosProductInitValue: IPhotosProductModel = {
    projectTypeID: 0,
    projectID: 0,
    projectType: '',
    productName: '',
    turnkeyProductImageID: 0,
    filePath: '',
    createBy: 0,
    iPAddress: '',
  }
  