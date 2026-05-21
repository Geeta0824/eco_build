import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Kyc Document URL=====================
export const Get_Quotation_Cateogry_Drop_Down_List = `${BASE_API_URL}/QuotationCateogry/GetDropDownUnitList`
export const GET_PDF_Photos_List = `${BASE_API_URL}/PDFPhotos/GetTurnkeyProductImageMapList`
export const ADD_PDF_Photos_DETAILS = `${BASE_API_URL}/PDFPhotos/AddPDFPhotoDetails`
export const UPDATE_PDF_Photos_DETAILS = `${BASE_API_URL}/PDFPhotos/UpdatePDFPhotoDetails`
export const GET_PDF_Photos_BY_PDF_Photos_ID = `${BASE_API_URL}/PDFPhotos/GetPDFPhotoByID`
export const DELETE_PDF_Photos_DETAILS = `${BASE_API_URL}/PDFPhotos/DeletePDFPhotoByID`

export function getPDFPhotosListApi(productID: number) {
  return axios.post(GET_PDF_Photos_List, {productID})
}

export function getQuotationCateogryDropDownAPI() {
  return axios.get(Get_Quotation_Cateogry_Drop_Down_List)
}

export function addPDFPhotosApi(
  quotationCategoryID: number,
  projectTypeID: number,
  photo1Path: string,
  photo2Path: string,
  photo3Path: string,
  photo4Path: string,
  page2PhotoPath: string,
  page3_OptionalPath: string,
  page4_OptionalPath: string,
  createBy: number
) {
  return axios.post(ADD_PDF_Photos_DETAILS, {
    quotationCategoryID,
    projectTypeID,
    photo1Path,
    photo2Path,
    photo3Path,
    photo4Path,
    page2PhotoPath,
    page3_OptionalPath,
    page4_OptionalPath,
    createBy,
  })
}

export function updatePDFPhotosApi(
  pdfPhotoID: number,
  quotationCategoryID: number,
  projectTypeID: number,
  photo1Path: string,
  photo2Path: string,
  photo3Path: string,
  photo4Path: string,
  page2PhotoPath: string,
  page3_OptionalPath: string,
  page4_OptionalPath: string,
  updateBy: number
) {
  return axios.post(UPDATE_PDF_Photos_DETAILS, {
    pdfPhotoID,
    quotationCategoryID,
    projectTypeID,
    photo1Path,
    photo2Path,
    photo3Path,
    photo4Path,
    page2PhotoPath,
    page3_OptionalPath,
    page4_OptionalPath,
    updateBy,
  })
}

export function getPdfPhotosByPdfPhotosIDApi(pdfPhotoID: number) {
  return axios.post(GET_PDF_Photos_BY_PDF_Photos_ID, {pdfPhotoID})
}

export function deletePDFPhotosDataApi(pdfPhotoID: number) {
  return axios.post(DELETE_PDF_Photos_DETAILS, {pdfPhotoID})
}
