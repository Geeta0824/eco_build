import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_PACKAGE = `${BASE_API_URL}/Package/GetPackageList`
export const CREATE_PACKAGE = `${BASE_API_URL}/Package/CreateNewPackage`
export const UPDATE_PACKAGE = `${BASE_API_URL}/Package/UpdatePackage`
export const SAVE_PACKAGE_IN_CART = `${BASE_API_URL}/Package/SavePackageProductDetail`
export const GET_PACKAGE_LIST_IN_CART = `${BASE_API_URL}/Package/GetCartListByPackageID`
export const GET_PACKAGE_DETAILS_BY_ID = `${BASE_API_URL}/Package/GetCartListByPackageDetailID`
export const DELETE_PACKAGE_LIST = `${BASE_API_URL}/Package/DeletePackage`
export const DELETE_PACKAGE_LIST_IN_CART = `${BASE_API_URL}/Package/DeletePackageDetail`
export const Update_PACKAGE_IN_CART = `${BASE_API_URL}/Package/UpdatePackageDetail`
export const CHECK_OUT_PACKAGE = `${BASE_API_URL}/Package/CheckoutPackage`
export const Multiple_Dropdown_List_Carpetry_Package = `${BASE_API_URL}/MultipleDropdownList/GetCarpetry_Package_DropdownList_ForDropdown`

export function geMultipleDropdownListCarpetryPkgApi() {
  return axios.get(Multiple_Dropdown_List_Carpetry_Package)
}

export function GetPackageListApi(
  bhkID: number,
  carpetAreaID: number,
  projectTypeID: number,
  searchText: string
) {
  return axios.post(GET_PACKAGE, {bhkID, carpetAreaID, projectTypeID, searchText})
}

export function createNewPackageApi(
  packageName: string,
  carpetAreaID: number,
  bhkID: number,
  projectTypeID: number,
  createBy: number,
  ipAddress: string,
  photoPath: string
) {
  return axios.post(CREATE_PACKAGE, {
    packageName,
    carpetAreaID,
    bhkID,
    projectTypeID,
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
  noOfUnit: number
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

export function UpdateQuotationDetailinCartApi(
  packageDetailID: number | undefined,
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number
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
