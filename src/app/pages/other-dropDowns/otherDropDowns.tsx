const transactionTypeData = [
  {transactionTypeID: 1, transactionTypeName: 'Credit'},
  {transactionTypeID: 2, transactionTypeName: 'Debit'},
]
const paymentTypeData = [
  {paymentTypeID: 1, paymentTypeName: 'Full'},
  {paymentTypeID: 2, paymentTypeName: 'Partial'},
]
const withdrawTypeData = [
  {withdrawTypeID: 1, withdrawTypeName: 'Deposite'},
  {withdrawTypeID: 2, withdrawTypeName: 'Profit'},
]
const fundTypeData = [
  {fundTypeID: 1, fundTypeName: 'Deposite'},
  {fundTypeID: 2, fundTypeName: 'Other'},
]
const bankAccountTypeData = [
  {bankAccountTypeID: 1, bankAccountTypeName: 'Saving'},
  {bankAccountTypeID: 2, bankAccountTypeName: 'Current'},
]
const bankTypeData = [
  {bankTypeID: 1, bankTypeName: 'Exposnse'},
  {bankTypeID: 2, bankTypeName: 'Expense'},
]
const indexOrStockData = [
  {indexOrStockID: 1, indexOrStockName: 'Stock'},
  {indexOrStockID: 2, indexOrStockName: 'Index'},
]
const stockTypeData = [
  {stockTypeID: 1, stockTypeName: 'Future'},
  {stockTypeID: 2, stockTypeName: 'Option'},
  // {stockTypeID: 3, stockTypeName: 'Equity'},
]
const optionTypeData = [
  {optionTypeID: 1, optionTypeName: 'Call'},
  {optionTypeID: 2, optionTypeName: 'Put'},
]
const instrumentData = [
  {instrumentID: 1, instrumentName: 'Future - Index'},
  {instrumentID: 2, instrumentName: 'Future - Stock'},
  {instrumentID: 3, instrumentName: 'Option - Index'},
  {instrumentID: 4, instrumentName: 'Option - Stock'},
  {instrumentID: 5, instrumentName: 'Equity'},
]
const venderTypeData = [
  {vendorTypeID: 1, vendorTypeName: 'PMC'},
  {vendorTypeID: 2, vendorTypeName: 'Supplier'},
  {vendorTypeID: 3, vendorTypeName: 'Individual'},
]

const agencyTypeDataForModular = [
  {agencyTypeID: 1012, agencyTypeName: 'Modular'},
  {agencyTypeID: 0, agencyTypeName: 'Addon Work'},
]
// const projectTypeData = [
//   {projectTypeID: 1, projectTypeName: 'DIY'},
//   {projectTypeID: 2, projectTypeName: 'Standard'},
//   {projectTypeID: 3, projectTypeName: 'Premium'},
//   {projectTypeID: 4, projectTypeName: 'Essential'},
//   {projectTypeID: 5, projectTypeName: 'Premium Plus'},
//   {projectTypeID: 6, projectTypeName: 'Super Saver'},
//   {projectTypeID: 7, projectTypeName: 'SWIFT'},
// ]
const gstTypeData = [
  {gstTypeID: 1, gstTypeName: 'State GST Tax'},
  {gstTypeID: 2, gstTypeName: 'Central GST Tax'},
]

const MonthDropdownData = [
  {MonthID: 1, MonthName: 'January'},
  {MonthID: 2, MonthName: 'February'},
  {MonthID: 3, MonthName: 'March'},
  {MonthID: 4, MonthName: 'April'},
  {MonthID: 5, MonthName: 'May'},
  {MonthID: 6, MonthName: 'June'},
  {MonthID: 7, MonthName: 'July'},
  {MonthID: 8, MonthName: 'August'},
  {MonthID: 9, MonthName: 'September'},
  {MonthID: 10, MonthName: 'October'},
  {MonthID: 11, MonthName: 'November'},
  {MonthID: 12, MonthName: 'December'},
]

const year = new Date().getFullYear()
const years = Array.from(new Array(5), (val, index) => year - index)
const YearsDropdownData = years

const DiscountTypeData = [
  {discountTypeID: 1, discountTypeName: 'Fix Value'},
  // {discountTypeID: 2, discountTypeName: 'Percentage'},
]
const FundReceiveTypeData = [
  {fundRecTypeID: 1, fundRecTypeName: 'Project Payment'},
  {fundRecTypeID: 2, fundRecTypeName: 'Non Project Payment'},
]
const modularTypeData = [
  {modularTypeID: 3, modularTypeName: 'Modular - KWS'},
  {modularTypeID: 8, modularTypeName: 'Modular - Kitchen'},
  {modularTypeID: 9, modularTypeName: 'Modular - Wardrobe'},
  {modularTypeID: 10, modularTypeName: 'Modular - Storage'},
]
const modularTypeForTreeData = [
  {modularTypeID: 3, modularTypeName: 'KWS'},
  {modularTypeID: 8, modularTypeName: 'Kitchen'},
  {modularTypeID: 9, modularTypeName: 'Wardrobe'},
  {modularTypeID: 10, modularTypeName: 'Storage'},
]
const dayData = [
  {dayID: 1, dayName: 'Today'},
  {dayID: 2, dayName: 'Tomorrow'},
  {dayID: 3, dayName: 'CurrentWeek'},
  {dayID: 4, dayName: 'CurrentMonth'},
  {dayID: 5, dayName: 'Quarter'},
  {dayID: 6, dayName: 'All'},
]

const dayDataList = [
  {dayID: 1, dayName: 'CurrentMonth'},
  {dayID: 2, dayName: 'Quarter'},
  {dayID: 3, dayName: 'Year'},
]

const penaltyForData = [
  {penaltyForID: 1, penaltyForName: 'Employee'},
  {penaltyForID: 2, penaltyForName: 'Vendor'},
]
// const projectTypeForTreeData = [
//   {projectTypeID: 2, projectTypeName: 'Standard'},
//   {projectTypeID: 3, projectTypeName: 'Premium'},
//   {projectTypeID: 4, projectTypeName: 'Essential'},
//   {projectTypeID: 5, projectTypeName: 'Premium Plus'},
//   {projectTypeID: 6, projectTypeName: 'Super Saver'},
//   // {projectTypeID: 7, projectTypeName: 'SWIFT'},
// ]
export {
  indexOrStockData,
  optionTypeData,
  stockTypeData,
  instrumentData,
  transactionTypeData,
  paymentTypeData,
  withdrawTypeData,
  fundTypeData,
  bankAccountTypeData,
  bankTypeData,
  venderTypeData,
  // projectTypeData,
  gstTypeData,
  MonthDropdownData,
  DiscountTypeData,
  FundReceiveTypeData,
  modularTypeData,
  modularTypeForTreeData,
  // projectTypeForTreeData,
  YearsDropdownData,
  agencyTypeDataForModular,
  dayData,
  penaltyForData,
  dayDataList,
}
