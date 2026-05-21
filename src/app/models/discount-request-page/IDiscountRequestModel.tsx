export interface IDiscountRequestModel {
  quotationID: number
  quotationNumber: string
  projectName: string
  projectNumber: string
  customerID: number
  projectTypeID: number
  quotationDate: string
  quotationAmount: string
  employeeID: number
  bhkName: string
  status: number
  bhkid: number
  carpetAreaID: number
  standarQuotationPDFID: number
  carpetArea: string
  projectType: string
  customerName: string
  email: string
  employeeName: string
  mobileNumber: string
  customerBranchName: string
  employeeBranchName: string
  quoteStatus: string
  isCheckOut: boolean
  isExtraDiscount: boolean
  extraDiscount: string
  discountStatusID: number
  discountTypeID: number
  discountCondition: string
  discountBy: number
  discountResponseBy: number
  extraDiscStatusName: string
  reqExtraDisc: string
  projectFinalAmount: string
  discPerAsperAmnt: string
}

export const discountRequestInitValues: IDiscountRequestModel = {
  quotationID: 0,
  quotationNumber: "",
  projectName: "",
  projectNumber: "",
  customerID: 0,
  projectTypeID: 0,
  quotationDate: "",
  quotationAmount: "",
  employeeID: 0,
  bhkName: "",
  status: 0,
  bhkid: 0,
  carpetAreaID: 0,
  standarQuotationPDFID: 0,
  carpetArea: "",
  projectType: "",
  customerName: "",
  email: "",
  employeeName: "",
  mobileNumber: "",
  customerBranchName: "",
  employeeBranchName: "",
  quoteStatus: "",
  isCheckOut: true,
  isExtraDiscount: true,
  extraDiscount: "",
  discountStatusID: 0,
  discountTypeID: 0,
  discountCondition: "",
  discountBy: 0,
  discountResponseBy: 0,
  extraDiscStatusName: "",
  reqExtraDisc: "",
  projectFinalAmount: "",
  discPerAsperAmnt: ""
}

export interface IDiscountStatusData {
  discountStatusID: number
  discountTypeName: number
  discoutStatusName: string
}
