import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================dashboard URL=====================
export const GET_ADMIN_COUNT = `${BASE_API_URL}/Dashboard/GetAdminDashboard` //Get Admin Count
export const GET_SALES_COUNT = `${BASE_API_URL}/Dashboard/GetSalesDashboard` //Get Sales Count
export const GetAccountDashboard = `${BASE_API_URL}/Dashboard/GetAccountDashboard` //Get Sales Count
export const Get_SalesPerson_Wise_TodayQuotationCount = `${BASE_API_URL}/Dashboard/Get_SalesPerson_Wise_TodayQuotationCount` //Get Sales Count
export const Get_Today_QuotationCount = `${BASE_API_URL}/Dashboard/Get_Today_QuotationCount` //Get today quot
export const Get_Chart_QuotationCount = `${BASE_API_URL}/Dashboard/GetDashBoardDataForChartAndGraph` //Get today quot
export const Get_SalesPerson_Wise_Month_Year_QuotationCount = `${BASE_API_URL}/Dashboard/Get_SalesPerson_Wise_Month_Year_QuotationCount` //Get month quot
export const Get_SalesPerson_Wise_Month_Year_QuotationCount_Excel = `${BASE_API_URL}/Dashboard/Get_SalesPerson_Wise_Month_Year_QuotationCount_Excel` //Get Excel
export const GetNotification_DiscountReq_List = `${BASE_API_URL}/Dashboard/GetNotification_DiscountReq_List` //Get Nitifi
export const UpdateNotification_IsSeen = `${BASE_API_URL}/Dashboard/UpdateNotification_IsSeen` //Get Nitifi ISseen
export const GetProjectList_By_StatusID = `${BASE_API_URL}/Dashboard/GetProjectList_By_StatusID` //popUP lIst
export const Get_Month_Year_Emp_Type_Turnkey_QuotationMst_Book = `${BASE_API_URL}/Dashboard/Get_Month_Year_Emp_Type_Turnkey_QuotationMst_Book` //popUP lIst
export const Get_Month_Year_Emp_QuotationMst_Book = `${BASE_API_URL}/Dashboard/Get_Month_Year_Emp_QuotationMst_Book` //popUP lIst//popUP lIst
export const Get_Month_Year_Emp_ModularQuotationMst_Book = `${BASE_API_URL}/Dashboard/Get_Month_Year_Emp_ModularQuotationMst_Book` //popUP lIst//popUP lIst
export const Get_Month_Year_Emp_DNCQuotationMst_Book = `${BASE_API_URL}/Dashboard/Get_Month_Year_Emp_DNCQuotationMst_Book` //popUP lIst//popUP lIst
export const Post_Search_Quotation_Filter = `${BASE_API_URL}/Search/SearchFilterList` //popUP lIst//popUP lIst

// =========================Get Sales=====================
export function searchFilterListApi(searchText: string) {
  return axios.post(Post_Search_Quotation_Filter, {searchText})
}
// =========================Get Admin=====================
export function getAdminCountApi() {
  return axios.post(GET_ADMIN_COUNT)
}

// =========================Get Sales=====================
export function getSalesCountApi(employeeID: number) {
  return axios.post(GET_SALES_COUNT, {employeeID})
}

// =========================Get Notification=====================
export function GetNotification_DiscountReq_ListApi(employeeID: number) {
  return axios.post(GetNotification_DiscountReq_List, {employeeID})
}

// =========================Get Notification=====================
export function UpdateNotification_IsSeenApi(notificationID: number) {
  return axios.post(UpdateNotification_IsSeen, {notificationID})
}

// =========================Get Sales=====================
export function GetAccountDashboardApi() {
  return axios.post(GetAccountDashboard)
}

// =========================Get Sales=====================
export function Get_SalesPerson_Wise_TodayQuotationCountApi() {
  return axios.get(Get_SalesPerson_Wise_TodayQuotationCount)
}

// =========================Get Sales=====================
export function Get_Today_QuotationCountApi() {
  return axios.get(Get_Today_QuotationCount)
}

// =========================Get Sales=====================
export function Get_Chart_QuotationCountApi() {
  return axios.get(Get_Chart_QuotationCount)
}

// =========================Get Sales=====================
export function Get_SalesPerson_Wise_Month_Year_QuotationCountApi(monthID: number, yearID: number) {
  return axios.post(Get_SalesPerson_Wise_Month_Year_QuotationCount, {monthID, yearID})
}
// =========================Get Sales=====================
export function Get_SalesPerson_Wise_Month_Year_QuotationCount_ExcelApi(
  monthID: number,
  yearID: number
) {
  return axios.post(Get_SalesPerson_Wise_Month_Year_QuotationCount_Excel, {monthID, yearID})
}
// =========================Get Pop Up List=====================
export function GetProjectListByStatusIDApi(statusID: number) {
  return axios.post(GetProjectList_By_StatusID, {statusID})
}
// =========================Get Pop Up List=====================
export function GetMonthYearEmpTypeTurnkeyQuotationMstBookApi(
  employeeID: number,
  monthID: number,
  yearID: number,
  projectTypeID: number
) {
  return axios.post(Get_Month_Year_Emp_Type_Turnkey_QuotationMst_Book, {
    employeeID,
    monthID,
    yearID,
    projectTypeID,
  })
}
// =========================Get Pop Up List=====================
export function GetMonthYearEmpQuotationMstBookApi(
  employeeID: number,
  monthID: number,
  yearID: number
) {
  return axios.post(Get_Month_Year_Emp_QuotationMst_Book, {
    employeeID,
    monthID,
    yearID,
  })
}
// =========================Get Pop Up List=====================
export function GetMonthYearEmpModularQuotationMstBookAPI(
  employeeID: number,
  monthID: number,
  yearID: number
) {
  return axios.post(Get_Month_Year_Emp_ModularQuotationMst_Book, {
    employeeID,
    monthID,
    yearID,
  })
}
// =========================Get Pop Up List=====================
export function GetMonthYearEmpDNCQuotationMstBookApi(
  employeeID: number,
  monthID: number,
  yearID: number
) {
  return axios.post(Get_Month_Year_Emp_DNCQuotationMst_Book, {
    employeeID,
    monthID,
    yearID,
  })
}
