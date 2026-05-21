export interface IPDFPhotoMstModel {
  projectTypeID:number
  pdfPhotoID:number
  quotationCategoryID:number
  projectID: number
  quotationCategoryName: string
  projectTypeName: string
  imageNumber: string
  productName: string
  photo1Path: string
  photo2Path: string
  photo3Path: string
  photo4Path: string
  page2PhotoPath: string
  page3_OptionalPath: string
  page4_OptionalPath: string
  createBy: number
  iPAddress: string
  }
  export const pdfPhotoMstInitValue: IPDFPhotoMstModel = {
    projectTypeID: 0,
    pdfPhotoID: 0,
    quotationCategoryID: 0,
    projectID: 0,
    quotationCategoryName: '',
    projectTypeName: '',
    imageNumber: '',
    productName: '',
    photo1Path: '',
    photo2Path: '',
    photo3Path: '',
    photo4Path: '',
    page2PhotoPath: '',
    page3_OptionalPath: '',
    page4_OptionalPath: '',
    createBy: 0,
    iPAddress: '',
  }
  export interface IQuotationCateogryDropDownModel {
    quotationCategoryID: number
    quotationCategoryName: string
  }
  
