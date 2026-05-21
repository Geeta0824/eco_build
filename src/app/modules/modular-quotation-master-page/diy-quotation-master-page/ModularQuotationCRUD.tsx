import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_Modular_ProductList_For_CartNew = `${BASE_API_URL}/ModularQuotation/GetModularProductListForCartNew`
export const Get_Modular_Quotation_List = `${BASE_API_URL}/ModularQuotation/GetModularQuotationList`
export const Make_Modular_Quotation = `${BASE_API_URL}/ModularQuotation/MakeModularQuotation`
export const Get_Modular_CartList_By_QuotationID = `${BASE_API_URL}/ModularQuotation/GetModularCartListByQuotationID`
export const Modular_Checkout_Qutation = `${BASE_API_URL}/ModularQuotation/ModularCheckoutQutation`
export const Save_Modular_Quotaion_Detail = `${BASE_API_URL}/ModularQuotation/SaveModularQuotaionDetail`
export const Delete_Modular_Quotation_Detail = `${BASE_API_URL}/ModularQuotation/DeleteModularQuotationDetail`
export const Update_Modular_Quotaion_Detail = `${BASE_API_URL}/ModularQuotation/UpdateModularQuotaionDetail`
export const GET_MODULAR_QUOTATION_DETAILS_BY_ID = `${BASE_API_URL}/ModularQuotation/GetModularQuotationCartListByQuotationDetailID`
export const Generate_Modular_ReqFor_ExtraDisc = `${BASE_API_URL}/ModularQuotation/GenerateModularReqForExtraDisc`
export const Update_Modular_Quotation_Isactive = `${BASE_API_URL}/ModularQuotation/UpdateModularQuotationIsactive`
export const Booked_ModularQuotation = `${BASE_API_URL}/ModularQuotation/Booked_ModularQuotation`
// ------------------------------------------------------------------------
export const GET_Product_List_Cart = `${BASE_API_URL}/ModularQuotation/GetProductListForCart`
export const Modular_Product_Category_By = `${BASE_API_URL}/ModularProduct/GetModularProductCategoryByModularTypeID`
export const Add_Modular_Upgrade_Items_Details = `${BASE_API_URL}/ModularQuotation/Add_ModularUpgradeItems_Details` //upgrade Add
export const Delete_Modular_Upgrade_Item_MapData = `${BASE_API_URL}/ModularQuotation/Delete_ModularUpgradeItemMapData` //upgrade Delete
export const Multiple_Dropdown_List_Modular_Quo = `${BASE_API_URL}/MultipleDropdownList/GetModularQue_DropdownList_ForDropdown` //upgrade Delete

export function GetMultipleDropdownListForModularQuoAPI() {
  return axios.get(Multiple_Dropdown_List_Modular_Quo)
}

export function GetModularProductListForCartNewAPI(
  modularTypeID: number,
  productCategoryID: number,
  searchText: string
) {
  return axios.post(Get_Modular_ProductList_For_CartNew, {
    modularTypeID,
    productCategoryID,
    searchText,
  })
}

export function GetModularQuotationListAPI(
  modularTypeID: number,
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(Get_Modular_Quotation_List, {modularTypeID, employeeID, customerID, searchText})
}

export function CreateMakeModularQuotationApi(
  customerID: number,
  carpetAreaID: number,
  bhkID: number,
  projectTypeID: number,
  createBy: number,
  ipAddress: string,
  isBeforeDiscount: boolean,
  cloneQuotationID: number
) {
  return axios.post(Make_Modular_Quotation, {
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
export function ModularQuotationIsactive(quotationID: number, isBeforeDiscount: boolean) {
  return axios.post(Update_Modular_Quotation_Isactive, {quotationID, isBeforeDiscount})
}

export function GetModularCartListByQuotationIDAPI(quotationID: number) {
  return axios.post(Get_Modular_CartList_By_QuotationID, {quotationID})
}

export function ModularCheckoutQutationApi(quotationID: number, skipID: number) {
  return axios.post(Modular_Checkout_Qutation, {quotationID, skipID})
}

export function deleteDeleteModularQuotationDetailApi(quotationDetailID: number) {
  return axios.post(Delete_Modular_Quotation_Detail, {quotationDetailID})
}
export function AddModularUpgradeItemsDetails(qutationID: number, upGradeItemID: number) {
  return axios.post(Add_Modular_Upgrade_Items_Details, {qutationID, upGradeItemID})
}
export function DeleteModularUpgradeItem(modularUpgrageItemMapID: number) {
  return axios.post(Delete_Modular_Upgrade_Item_MapData, {modularUpgrageItemMapID})
}

export function UpdateModularQuotaionDetailApi(
  quotationDetailID: number | undefined,
  qutationID: number,
  categoryID: number,
  productID: number,
  modularTypeID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number
) {
  return axios.post(Update_Modular_Quotaion_Detail, {
    quotationDetailID,
    qutationID,
    categoryID,
    productID,
    modularTypeID,
    unitID,
    length,
    depth,
    height,
    noOfUnit,
  })
}

export function getModularQuotaionDetailByIDAPI(quotationDetailID: number) {
  return axios.post(GET_MODULAR_QUOTATION_DETAILS_BY_ID, {quotationDetailID})
}

export function GenerateModularReqForExtraDiscountApi(
  employeeID: number,
  customerID: number,
  searchText: string,
  quotationID: number,
  discountTypeID: number,
  reqDisc: string,
  requestBy: number
) {
  return axios.post(Generate_Modular_ReqFor_ExtraDisc, {
    employeeID,
    customerID,
    searchText,
    quotationID,
    discountTypeID,
    reqDisc,
    requestBy,
  })
}

// ---------------------------------------------------------------------------
export function getModularProductCategoryApi(modularTypeID: number) {
  return axios.post(Modular_Product_Category_By, {modularTypeID})
}

export function GetProductListForCartApi(categoryID: number, searchText: string) {
  return axios.post(GET_Product_List_Cart, {categoryID, searchText})
}

export function SaveModularQuotaionDetailInCartApi(
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
  return axios.post(Save_Modular_Quotaion_Detail, {
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

export function Booked_ModularQuotationApi(
  quotationID: number,
  bookBy: number,
  projectName: string,
  bookingDate: string
) {
  return axios.post(Booked_ModularQuotation, {quotationID, bookBy, projectName, bookingDate})
}
