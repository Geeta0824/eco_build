export interface IExpenseModel {
  expenseTypeID: number
  expenseHeadID: number
  expenseTypeName: string
  createByName: string
  expenseHeadName: string
  createBy: number
  updateBy: number
  isActive: boolean
  iPAddress: string
}

export const expenseInitValues: IExpenseModel = {
  expenseTypeID: 0,
  expenseHeadID: 0,
  expenseTypeName: '',
  createByName: '',
  expenseHeadName: '',
  isActive: false,
  createBy: 0,
  updateBy: 0,
  iPAddress: '',
}
