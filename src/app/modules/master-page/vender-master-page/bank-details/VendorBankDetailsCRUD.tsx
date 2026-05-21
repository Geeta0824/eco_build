import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================VendorBankDetails URL======================
export const GET_ALL_VENDOR_BANK_DETAILS = `${BASE_API_URL}/VendorBank/GetVendorBankDtlWebList`// Get List
export const GET_VENDOR_BANK_DETAILS_VENDOR_ID = `${BASE_API_URL}/VendorBank/GetVendorBankDtlByVendorID`//Post list By ID 
export const CREATE_VENDOR_BANK_DETAILS = `${BASE_API_URL}/VendorBank/AddVendorBankDtlDetails`//create
export const UPDATE_VENDOR_BANK_DETAILS = `${BASE_API_URL}/VendorBank/UpdateVendorBankDtlDetails`//update
export const ISACTIVE_VENDOR_BANK_DETAILS = `${BASE_API_URL}/VendorBank/UpdateVendorBankDtlIsactive`//Is Active
export const DELETE_VENDOR_BANK_DETAILS = `${BASE_API_URL}/VendorBank/PostDeleteVendorBankDtl`//Delete
export const GET_VENDOR_BANK_DETAILS_BY_VENDOR_BANK_ID = `${BASE_API_URL}/VendorBank/GetVendorBankDtlByVendorBankDtlID`//Get By Id
export const GET_VENDOR_BANK_DETAILS_BY_VENDOR_ID = `${BASE_API_URL}/VendorBank/GetDropDownVendorBankDtlList`// Bank Dtl Drop Down

// export function getAllVendorBankDetails() {
//   return axios.get(GET_ALL_VENDOR_BANK_DETAILS)
// }

export function getVendorBankDetailsByVendorID(VendorID: number) {
  return axios.post(GET_VENDOR_BANK_DETAILS_VENDOR_ID, {VendorID})
}

export function createVendorBankDetails(
  VendorID: number,
  bankName: string,
  branchName: string,
  ifscCode: string,
  accountNumber: string,
  accountName: string,
  accountTypeID: number,
  pfaCompanyName: string,
  pfaunNumber: string,
  pfaNumber: string,
  esicNumber: string,
  esicStartDate: string,
  esicExpDate: string,
  pfaStartDate: string,
  pfaEndDate: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_VENDOR_BANK_DETAILS, {
    VendorID,
    bankName,
    branchName,
    ifscCode,
    accountNumber,
    accountName,
    accountTypeID,
    pfaCompanyName,
    pfaunNumber,
    pfaNumber,
    esicNumber,
    esicStartDate,
    esicExpDate,
    pfaStartDate,
    pfaEndDate,
    isActive,
    createBy,
    ipAddress,
  })
}

export function getVendorBankDetByVendorId(vendorBankID: string) {
  return axios.post(GET_VENDOR_BANK_DETAILS_BY_VENDOR_ID, {vendorBankID})
}

export function updateVendorBankDetails(
  vendorBankID: number,
  VendorID: number,
  bankName: string,
  branchName: string,
  ifscCode: string,
  accountNumber: string,
  accountName: string,
  accountTypeID: number,
  pfaCompanyName: string,
  pfaunNumber: string,
  pfaNumber: string,
  esicNumber: string,
  esicStartDate: string,
  esicExpDate: string,
  pfaStartDate: string,
  pfaEndDate: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_VENDOR_BANK_DETAILS, {
    vendorBankID,
    VendorID,
    bankName,
    branchName,
    ifscCode,
    accountNumber,
    accountName,
    accountTypeID,
    pfaCompanyName,
    pfaunNumber,
    pfaNumber,
    esicNumber,
    esicStartDate,
    esicExpDate,
    pfaStartDate,
    pfaEndDate,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function isActiveVendorBankDetails(vendorBankID: number, isActive: boolean) {
  return axios.post(ISACTIVE_VENDOR_BANK_DETAILS, {vendorBankID, isActive})
}
export function deleteVendorBankDetails(vendorBankID: number) {
  return axios.post(DELETE_VENDOR_BANK_DETAILS, {vendorBankID})
}
export function getVenBankDetailsByVenBankIDApi(vendorBankID: number) {
  return axios.post(GET_VENDOR_BANK_DETAILS_BY_VENDOR_BANK_ID, {vendorBankID})
}
