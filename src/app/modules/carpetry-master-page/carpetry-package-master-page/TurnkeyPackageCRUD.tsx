import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_TURNKEY_PACKAGE_LIST = `${BASE_API_URL}/TurnkeyPackage/GetTurnkeyPackageList`
export const CREATE_TURNKEY_PACKAGE = `${BASE_API_URL}/TurnkeyPackage/CreateNewTurnkeyPackage`
export const UPDATE_PACKAGE = `${BASE_API_URL}/TurnkeyPackage/UpdateTurnkeyPackage`
export const SAVE_PACKAGE_IN_CART = `${BASE_API_URL}/TurnkeyPackage/SaveTurnkeyPackageProductDetail`
export const GET_PACKAGE_LIST_IN_CART = `${BASE_API_URL}/TurnkeyPackage/GetCartListByPackageID`
export const GET_PACKAGE_DETAILS_BY_ID = `${BASE_API_URL}/TurnkeyPackage/GetCartListByTurnkeyPackageDetailID`
export const DELETE_PACKAGE_LIST = `${BASE_API_URL}/TurnkeyPackage/DeleteTurnkeyPackage`
export const DELETE_PACKAGE_LIST_IN_CART = `${BASE_API_URL}/TurnkeyPackage/DeleteTurnkeyPackageDetail`
export const Update_PACKAGE_IN_CART = `${BASE_API_URL}/TurnkeyPackage/UpdateTurnkeyPackageDetail`
export const CHECK_OUT_PACKAGE = `${BASE_API_URL}/TurnkeyPackage/CheckoutTurnkeyPackage`
export const Package_Clone_TURNKEY_PACKAGE = `${BASE_API_URL}/TurnkeyPackage/TurnkeyPackage_Clone_Genearate`

export function GetTurnkeyPackageList(
  bhkID: number,
  carpetAreaID: number,
  projectTypeID: number,
  searchText: string
) {
  return axios.post(GET_TURNKEY_PACKAGE_LIST, {bhkID, carpetAreaID, projectTypeID, searchText})
}

export function packageCloneTurnkeyPackageApi(
  newProjectTypeID: number,
  cloneTypeID: number,
  bhkID: number,
  carpetAreaID: number,
  pricePerArea: number,
  packageName: string,
  photoPath: string
) {
  return axios.post(Package_Clone_TURNKEY_PACKAGE, {
    newProjectTypeID,
    cloneTypeID,
    bhkID,
    carpetAreaID,
    pricePerArea,
    packageName,
    photoPath,
  })
}
export function createNewPackageApi(
  packageName: string,
  carpetAreaID: number,
  bhkID: number,
  projectTypeID: number,
  packageAmount: number,
  createBy: number,
  ipAddress: string,
  photoPath: string
) {
  return axios.post(CREATE_TURNKEY_PACKAGE, {
    packageName,
    carpetAreaID,
    bhkID,
    projectTypeID,
    packageAmount,
    createBy,
    ipAddress,
    photoPath,
  })
}

export function savePackageDetailinCartApi(
  packageID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number,
  turnkeyQty: string
) {
  return axios.post(SAVE_PACKAGE_IN_CART, {
    packageID,
    categoryID,
    productID,
    planAreaID,
    unitID,
    length,
    depth,
    height,
    noOfUnit,
    turnkeyQty,
  })
}

export function GetCartListByPackageIDApi(packageID: number) {
  return axios.post(GET_PACKAGE_LIST_IN_CART, {packageID})
}

export function getUpdateQuotaionDetailObj(packageDetailID: number) {
  return axios.post(GET_PACKAGE_DETAILS_BY_ID, {packageDetailID})
}

export function deletePackageMainIDApi(packageID: number) {
  return axios.post(DELETE_PACKAGE_LIST, {packageID})
}

export function deletePackageDetailIDApi(packageDetailID: number) {
  return axios.post(DELETE_PACKAGE_LIST_IN_CART, {packageDetailID})
}

export function UpdateTurnkeyQuotationDetailinCartApi(
  packageDetailID: number | undefined,
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number,
  turnkeyQty: string
) {
  return axios.post(Update_PACKAGE_IN_CART, {
    packageDetailID,
    qutationID,
    categoryID,
    productID,
    planAreaID,
    unitID,
    length,
    depth,
    height,
    noOfUnit,
    turnkeyQty,
  })
}

export function checkoutPackageApi(packageID: number, skipID: number) {
  return axios.post(CHECK_OUT_PACKAGE, {packageID, skipID})
}

export function updatePackageApi(
  packageID: number,
  packageName: string,
  carpetAreaID: number,
  bhkID: number,
  projectTypeID: number,
  packageAmount: number,
  updateBy: number,
  ipAddress: string,
  photoPath: string
) {
  return axios.post(UPDATE_PACKAGE, {
    packageID,
    packageName,
    carpetAreaID,
    bhkID,
    projectTypeID,
    packageAmount,
    updateBy,
    ipAddress,
    photoPath,
  })
}

export const GET_Product_List_Cart = `${BASE_API_URL}/quotation/GetProductListForCart`
export const GET_Product_List_Cart_NEW = `${BASE_API_URL}/quotation/GetProductListForCartNew`
export const PACKAGE_DISCOUNT = `${BASE_API_URL}/Package/GenerateReqForExtraDisc`

export function GetProductListForCartApi(categoryID: number, searchText: string) {
  return axios.post(GET_Product_List_Cart, {categoryID, searchText})
}

export function GetProductListForCartNewApi(
  areaID: number,
  categoryID: number,
  searchText: string
) {
  return axios.post(GET_Product_List_Cart_NEW, {areaID, categoryID, searchText})
}

export function diyQuotaionDiscountApi(
  employeeID: number,
  customerID: number,
  searchText: string,
  packageID: number,
  reqDisc: string,
  requestBy: number
) {
  return axios.post(PACKAGE_DISCOUNT, {
    employeeID,
    customerID,
    searchText,
    packageID,
    reqDisc,
    requestBy,
  })
}
