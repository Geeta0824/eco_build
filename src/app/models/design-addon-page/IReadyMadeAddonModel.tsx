export interface ICartLisyByReadyMadeAddonModel {
    quotationDetailID: number
    quotationID: number
    categoryID: number
    productID: number
    planAreaID: number
    unitID: number
    length: string
    depth: string
    height: string
    noOfUnit: string
    productCategoryName: string
    productName: string
    unitName: string
    areaName: string
    photoPath: string
    description: string
    titleAreaName: string
    titleAreaID: number
  }
  export interface IReadyMadeAddonCheckOutModel {
    primaryID?: any
    productID: number
    productName: string
    description: string
    areaName: string
    productCategoryName: string
    unitName: string
    parentName: string
    planAreaID?: number
    modularTypeID: number
    productCategoryID: number
    length: string
    pricePerSqFt: string
    depth: string
    height: string
    noOfUnit: number
    photoPath: string
    defaultUnitID: number
    isHeightChange: true
  }
  
  export interface IReadyMadeAddonReduxModel {
    quotationId: number
    count: number
  }
  
  export interface IReadyMadeAddonProductListModel {
    areaName: any
    productID: number
    productCategoryID: number
    productName: string
    description: string
    length: number
    depth: number
    height: number
    noOfUnit: number
    photoPath: string
    productCategoryName: string
    defaultUnitID: number
    isHeightChange: true
    unitName: string
    planAreaID: number
    modularTypeID: number
    modularTypeName: number
  }
  
  export interface IReadyMadeAddonModel {
    readyMadeAddonID: number
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
    modularTypeID: number
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
    isBooked: boolean
    isExtraDiscount: boolean
    ExtraDiscount: number
    discountStatusID: number
    discountCondition: string
    discountBy: number
    discountResponseBy: number
    extraDiscount: string
    extraDiscStatusName: string
    discountTypeID: number
    reqExtraDisc: string
    isBeforeDiscount:boolean
    modularQuotationID:number
    address1: string
    cloneCustomerName: string
  }
  
  export const readyMadeAddonInitValues: IReadyMadeAddonModel = {
    readyMadeAddonID:0,
    quotationID: 0,
    quotationNumber: '',
    projectName: '',
    projectNumber: '',
    customerID: 0,
    projectTypeID: 0,
    quotationDate: '',
    quotationAmount: '',
    employeeID: 0,
    bhkName: '',
    status: 0,
    bhkid: 0,
    modularTypeID: 0,
    carpetAreaID: 0,
    standarQuotationPDFID: 0,
    carpetArea: '',
    projectType: '',
    customerName: '',
    email: '',
    employeeName: '',
    mobileNumber: '',
    customerBranchName: '',
    employeeBranchName: '',
    quoteStatus: '',
    isBooked: false,
    isCheckOut: false,
    isExtraDiscount: false,
    ExtraDiscount: 0,
    discountStatusID: 0,
    discountCondition: '',
    discountBy: 0,
    discountResponseBy: 0,
    extraDiscount: '',
    extraDiscStatusName: '',
    discountTypeID: 0,
    reqExtraDisc: '',
    isBeforeDiscount: false,
    modularQuotationID: 0,
    address1: "",
    cloneCustomerName: ""
  }
  