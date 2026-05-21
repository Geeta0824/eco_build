import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_DIY_QUOTATION = `${BASE_API_URL}/Quotation/GetDIYQuotationList`
export const GET_DIY_QUOTATION_PAGINATION = `${BASE_API_URL}/Quotation/GetDIYQuotationList_Pagination`
export const GET_Product_List_Cart = `${BASE_API_URL}/Quotation/GetProductListForCart`
export const GET_Product_List_Cart_NEW = `${BASE_API_URL}/Quotation/GetProductListForCartNew`
export const CREATE_DIY_QUOTATION = `${BASE_API_URL}/Quotation/MakeDIYQuotation`
export const SAVE_QUOTATION_IN_CART = `${BASE_API_URL}/Quotation/SaveQuotaionDetail`
export const Update_QUOTATION_IN_CART = `${BASE_API_URL}/Quotation/UpdateQuotaionDetail`
export const GET_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/Quotation/GetCartListByQuotationID`
export const GET_QUOTATION_DETAILS_BY_ID = `${BASE_API_URL}/Quotation/GetCartListByQuotationDetailID`
export const DELETE_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/Quotation/DeleteQuotationDetail`
export const DIY_QUOTATION_DISCOUNT = `${BASE_API_URL}/Quotation/GenerateReqForExtraDisc`
export const CHECK_OUT_DIY_QUOTATION = `${BASE_API_URL}/Quotation/CheckoutDIYQute`
export const Booked_DIY_Quotation = `${BASE_API_URL}/Quotation/Booked_DIYQuotation`
export const GET_Agency_Quotation_Breakup_List = `${BASE_API_URL}/AgencyType/AgencyQuotationBreakupList`
export const Add_Diy_UpGrade_Item = `${BASE_API_URL}/Quotation/Add_DIYUpgradeItems_Details`
export const Delete_Diy_UpGrade_Item = `${BASE_API_URL}/Quotation/DeleteUpGradeItemMapData`
export const Update_DIY_Quotation_Isactive = `${BASE_API_URL}/Quotation/UpdateDIYQuotationIsactive`
export const Get_Modular_Quotation_List_By_CustomerID = `${BASE_API_URL}/ModularQuotation/GetModularQuotationListByCustomerID`
export const Merge_DIY_With_Modular = `${BASE_API_URL}/Quotation/Merge_DIY_With_Modular`
export const Multiple_Dropdown_List_DIY_Queotation = `${BASE_API_URL}/MultipleDropdownList/GetDIY_Queotation_DropdownList_ForDropdown` //upgrade Delete
export const Booked_DIY_With_Modualar_Quotation = `${BASE_API_URL}/Quotation/Booked_DIY_With_Modualar_Quotation`
export const Get_UpGradeItem_ListBy_QuoteID_Kazulecia = `${BASE_API_URL}/UpGradeItem/GetUpGradeItemListByQuoteID_Kazulecia`
export const Add_Diy_UpGrade_Kazulencia_Item = `${BASE_API_URL}/Quotation/Add_DIY_Kazulencia_UpgradeItems_Details`
export const Delete_Diy_UpGrade_Kazulencia_Item = `${BASE_API_URL}/Quotation/Delete_Kazulenica_UpGradeItems`

export function GetMultipleDropdownListForDIYQueotationAPI() {
  return axios.get(Multiple_Dropdown_List_DIY_Queotation)
}

// ------------DeleteUpGradeItemMapData
export function getAgencyQuotationBreakupListApi(quotationID: number) {
  return axios.post(GET_Agency_Quotation_Breakup_List, {quotationID})
}

export function GetDiyQuotationListApi(employeeID: number, customerID: number, searchText: string) {
  return axios.post(GET_DIY_QUOTATION, {employeeID, customerID, searchText})
}

export function GetDiyQuotationListApi_Pagination(
  employeeID: number,
  customerID: number,
  searchText: string,
  pageNumber: number,
  pageSize: number
) {
  return axios.post(GET_DIY_QUOTATION_PAGINATION, {
    employeeID,
    customerID,
    searchText,
    pageNumber,
    pageSize,
  })
}

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

export function GetCartListByQuotationIDApi(quotationID: number) {
  return axios.post(GET_QUOTATION_LIST_IN_CART, {quotationID})
}

export function getUpdateQuotaionDetailObj(quotationDetailID: number) {
  return axios.post(GET_QUOTATION_DETAILS_BY_ID, {quotationDetailID})
}

export function deleteQuotationDetailIDApi(quotationDetailID: number) {
  return axios.post(DELETE_QUOTATION_LIST_IN_CART, {quotationDetailID})
}

export function checkoutDIYQuotationApi(quotationID: number, skipID: number) {
  return axios.post(CHECK_OUT_DIY_QUOTATION, {quotationID, skipID})
}
export function DIYQuotationIsactive(quotationID: number, isBeforeDiscount: boolean) {
  return axios.post(Update_DIY_Quotation_Isactive, {quotationID, isBeforeDiscount})
}

export function diyQuotaionDiscountApi(
  employeeID: number,
  customerID: number,
  searchText: string,
  quotationID: number,
  discountTypeID: number,
  reqDisc: string,
  requestBy: number
) {
  return axios.post(DIY_QUOTATION_DISCOUNT, {
    employeeID,
    customerID,
    searchText,
    quotationID,
    discountTypeID,
    reqDisc,
    requestBy,
  })
}

export function createDIYQuotationApi(
  customerID: number,
  carpetAreaID: number,
  bhkID: number,
  // projectTypeID: number,
  createBy: number,
  ipAddress: string,
  isBeforeDiscount: boolean,
  cloneQuotationID: number
) {
  let projectTypeID = 1
  return axios.post(CREATE_DIY_QUOTATION, {
    customerID,
    carpetAreaID,
    bhkID,
    projectTypeID,
    createBy,
    ipAddress,
    isBeforeDiscount,
    cloneQuotationID,
  })
}

export function saveQuotationDetailinCartApi(
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
  return axios.post(SAVE_QUOTATION_IN_CART, {
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

export function UpdateQuotationDetailinCartApi(
  quotationDetailID: number | undefined,
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
  return axios.post(Update_QUOTATION_IN_CART, {
    quotationDetailID,
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

export function BookedDiyQuotationApi(
  quotationID: number,
  bookBy: number,
  projectName: string,
  bookingDate: string
) {
  return axios.post(Booked_DIY_Quotation, {quotationID, bookBy, projectName, bookingDate})
}
export function addDIYUpgradeItemApi(qutationID: number, upGradeItemID: number) {
  return axios.post(Add_Diy_UpGrade_Item, {qutationID, upGradeItemID})
}
export function deleteDIYUpgradeItemByIDApi(diyUpgrageItemMapID: number) {
  return axios.post(Delete_Diy_UpGrade_Item, {diyUpgrageItemMapID})
}
export function GetModularQuotationListByCustomerID(customerID: number) {
  return axios.post(Get_Modular_Quotation_List_By_CustomerID, {customerID})
}
export function MergeDIYWithModularApi(quotationID: number, modularQuotationID: number) {
  return axios.post(Merge_DIY_With_Modular, {quotationID, modularQuotationID})
}

export function BookedDIYWithModualarQuotationApi(
  quotationID: number,
  bookBy: number,
  projectName: string,
  bookingDate: string
) {
  return axios.post(Booked_DIY_With_Modualar_Quotation, {
    quotationID,
    bookBy,
    projectName,
    bookingDate,
  })
}
export function GetUpGradeItemListByQuoteIDKazuleciaApi(quotationID: number) {
  return axios.post(Get_UpGradeItem_ListBy_QuoteID_Kazulecia, {
    quotationID,
  })
}
export function addDIYUpgradeKazulenciaItemApi(qutationID: number, upGradeItemIDs: string) {
  return axios.post(Add_Diy_UpGrade_Kazulencia_Item, {qutationID, upGradeItemIDs})
}
export function deleteDIYUpgradeKazuItemByIDApi(quotationID: number ) {
  return axios.post(Delete_Diy_UpGrade_Kazulencia_Item, {quotationID})
}