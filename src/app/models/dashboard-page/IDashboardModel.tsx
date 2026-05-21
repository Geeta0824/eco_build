import {StringDecoder} from 'string_decoder'

export interface IAdminDashboardModel {
  isSuccess: boolean
  message: string
  cntbhk: number
  cntBranch: number
  cntCarpetArea: number
  cntCategory: number
  cntCustomer: number
  cntDepartment: number
  cntEmployee: number
  cntplanArea: number
  cntProduct: number
  cntQuotDIY: number
  cntQuotEsst: number
  cntQuotPrem: number
  cntQuotStand: number
  cntQuotTotal: number
  cntUser: number
}
export interface ISalesDashboardModel {
  isSuccess: boolean
  message: string
  cntbhk: string
  cntCarpetArea: string
  cntCategory: string
  cntplanArea: string
  cntProduct: string
  cntQuotDIY: string
  cntQuotEsst: string
  cntQuotPrem: string
  cntQuotStand: string
  cntQuotTotal: string
}

export interface IAccountDashboardModel {
  capitalAccount: string
  todayCredit: string
  todayDebit: string
  monthCredit: string
  monthDebit: string
  todayNewProject: string
  todayHandOverProject: string
  monthNewProject: string
  monthHandOverProject: string
  fixedTotalAssets: string
  totalSundryDetors: string
  totalSundryCreditors: string
  companyBalance: string
  currentAssets: StringDecoder
  yestCredit: string
  yestDebit: string
  lastMonthCredit: string
  lastMonthDebit: string
  cMonthGSTPay: string
  cMonthGSTRec: string
  cMonthGSTBal: string
  lMonthGSTPay: string
  lMonthGSTRec: string
  lMonthGSTBal: string
  cMonthTDS: string
  lMonthTDS: string
  todayMoveToExectuionProject: string
  todayFullPaymentDoneProject: string
  todayOnHoldProject: string
  todayDropedProject: string
  monthMoveToExectuionProject: string
  monthFullPaymentDoneProject: string
  monthOnHoldProject: string
  monthDropedProject: string

  lastMonthNewProject: string
  lastMonthMoveToExectuionProject: string
  lastMonthFullPaymentDoneProject: string
  lastMonthOnHoldProject: string
  lastMonthDropedProject: string
  lastMonthHandOverProject: string
  yearNewProject: string
  yearMoveToExectuionProject: string
  yearFullPaymentDoneProject: string
  yearOnHoldProject: string
  yearDropedProject: string
  yearHandOverProject: string
}

export interface ISalesQutModel {
  employeeID: number
  employeeName: string
  photoPath: string
  cntStd: number
  cntPrm: number
  cntEss: number
  cntPremPlus: number
  cntSuperSav: number
  totalSaleWise: number
  cntDIY: number
  cntModular: number
  cntDNC: number
  bkcntStd: number
  bkcntPrm: number
  bkcntEss: number
  bkcntPremPlus: number
  bkcntSuperSav: number
  bkcntDIY: number
  bkcntModular: number
  bkcntDNC: number
  bkTotalSaleWise: number
}

export interface INotificationModel {
  notificationID: number
  quotationID: number
  createBy: number
  title: string
  date: string
  quotationCategoryID: number
  isSeen: boolean
  isSeenDate: string
  createByName: string
  quotationCategoryName: string
  projectNumber: string
  notificationTypeID: number
  forWhom: number
}

export interface ISalePersonTotalModel {
  cntStdTotal: number
  cntPrmTotal: number
  cntEssTotal: number
  cntPremPlusTotal: number
  cntSuperSavTotal: number
  cntDIYTotal: number
  cntModularTotal: number
  totalSaleWiseTotal: number
  cntDNCTotal: number
  bkcntStdTotal: number
  bkcntPrmTotal: number
  bkcntEssTotal: number
  bkcntPremPlusTotal: number
  bkcntSuperSavTotal: number
  bkcntDIYTotal: number
  bkcntModularTotal: number
  bkcntDNCTotal: number
  bkTotalSaleWiseTotal: number
}
export interface ProjectListPopUp {
  customerID: number
  projectID: number
  projectVendorID: number
  projectStageID: number
  projectName: string
  projectAmount: number
  additionalAmount: number
  finalAmount: number
  reductionAmount: number
  paidAmount: number
  remainingAmount: number
  projectFilePath: string
  quetFilePath: string
  bhkName: string
  carpetArea: string
  projectCategoryName: string
  projectStatusName: string
  projectType: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  terminalCode: string
  description: string
  entryDate: string
  projectCategoryID: number
  projectTypeID: number
  employeeName: string
  employeeCode: string
  employeeID: number
}
export interface projectDataPopUp {
  customerID: number
  quotationID: number
  projectName: string
  projectCategoryName: string
  projectNumber: string
  quotationAmount: number
  projectType: string
  customerName: string
  mobileNumber: string
  terminalCode: string
  bookDate: string
  quotationDate: string
  createDate: string
  projectTypeID: number
  employeeName: string
  employeeCode: string
  employeeID: number
}
export interface ISearchQuotationModel {
  searchID: number
  descriptions: string
  title: string
  pagePath: string
  link: string
}
