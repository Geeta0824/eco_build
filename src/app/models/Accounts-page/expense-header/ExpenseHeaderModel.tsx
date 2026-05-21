export interface IExpenseHeadModel {
  expenseHeadID: number
  expenseHeadName: string
  createByName: string
  createBy: number
  updateBy: number
  iPAddress: string
}

export const expenseHeadInitValues: IExpenseHeadModel = {
  expenseHeadID: 0,
  expenseHeadName: '',
  createByName: '',
  createBy: 0,
  updateBy: 0,
  iPAddress: '',
}
