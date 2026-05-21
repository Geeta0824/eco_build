import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
export const Get_PurchaseListBy_VendorID = `${BASE_API_URL}/PurchaseMasters/GetPurchaseListByVendorID`
export const Get_PayPurchase_Fund_List = `${BASE_API_URL}/PurchasePayment/GetPayPurchaseFundList`
export const Add_Purchase_FundPay_ToVendor = `${BASE_API_URL}/PurchasePayment/AddPurchaseFundPayToVendor`
export const Update_Purchase_FundPay_Details = `${BASE_API_URL}/PurchasePayment/UpdatePurchaseFundPayDetails`
export const Get_PayPurchaseFund_By_PurchasePaymentID = `${BASE_API_URL}/PurchasePayment/GetPayPurchaseFundByPurchasePaymentID`
export const GET_Project_List_By_Vendor_ID = `${BASE_API_URL}/PurchasePayment/GetProjectListByVendorID`
export const DELETE_PAY_FUND_DETAILS = `${BASE_API_URL}/PurchasePayment/DeletePayFund`

// ============================================================
export function GetPurchaseListByVendorID(vendorID: number) {
  return axios.post(Get_PurchaseListBy_VendorID, {vendorID})
}

export function GetPayPurchaseFundListApi() {
  return axios.get(Get_PayPurchase_Fund_List)
}

// ==============================
export function AddPurchaseFundPayToVendorApi(
  vendorID: number,
  purchaseID: number,
  paymentDate: string,
  amount: number,
  cashAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  cashAccountBankID: number,
  vendorInvoiceNo: string,
  description: string,
  filePath: string,
  isTdsDeduct: boolean,
  isgst: boolean,
  gstTypeID: number,
  cgstVal: number,
  sgstVal: number,
  igstVal: number,
  gstAmount: number,
  tdsPer: number,
  createBy: number,
  ipAddress: string,
  tdsAmount: number,
  sgstPer: number,
  cgstPer: number,
  igstPer: number,
  afterTDSAmt: number,
  afterGSTAmount: number,
  finalAmount: number
) {
  return axios.post(Add_Purchase_FundPay_ToVendor, {
    vendorID,
    purchaseID,
    paymentDate,
    amount,
    cashAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    cashAccountBankID,
    vendorInvoiceNo,
    description,
    filePath,
    isTdsDeduct,
    isgst,
    gstTypeID,
    cgstVal,
    sgstVal,
    igstVal,
    gstAmount,
    tdsPer,
    createBy,
    ipAddress,
    tdsAmount,
    sgstPer,
    cgstPer,
    igstPer,
    afterTDSAmt,
    afterGSTAmount,
    finalAmount,
  })
}

export function UpdatePurchaseFundPayDetails(
  purchasePaymentID: number,
  vendorID: number,
  purchaseID: number,
  paymentDate: string,
  amount: number,
  cashAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  cashAccountBankID: number,
  vendorInvoiceNo: string,
  description: string,
  filePath: string,
  isTdsDeduct: boolean,
  isgst: boolean,
  gstTypeID: number,
  cgstVal: number,
  sgstVal: number,
  igstVal: number,
  gstAmount: number,
  tdsPer: number,
  updateBy: number,
  ipAddress: string,
  tdsAmount: number,
  sgstPer: number,
  cgstPer: number,
  igstPer: number,
  afterTDSAmt: number,
  afterGSTAmount: number,
  finalAmount: number
) {
  return axios.post(Update_Purchase_FundPay_Details, {
    purchasePaymentID,
    vendorID,
    purchaseID,
    paymentDate,
    amount,
    cashAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    cashAccountBankID,
    vendorInvoiceNo,
    description,
    filePath,
    isTdsDeduct,
    isgst,
    gstTypeID,
    cgstVal,
    sgstVal,
    igstVal,
    gstAmount,
    tdsPer,
    updateBy,
    ipAddress,
    tdsAmount,
    sgstPer,
    cgstPer,
    igstPer,
    afterTDSAmt,
    afterGSTAmount,
    finalAmount,
  })
}

export function DeletePayFundDetails(purchasePaymentID: number) {
  return axios.post(DELETE_PAY_FUND_DETAILS, {purchasePaymentID})
}

export function GetPayPurchaseFundByPurchasePaymentIDApi(purchasePaymentID: number) {
  return axios.post(Get_PayPurchaseFund_By_PurchasePaymentID, {purchasePaymentID})
}
