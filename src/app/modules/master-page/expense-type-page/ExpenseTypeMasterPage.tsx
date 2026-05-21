import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import ExpenseTypeListPage from '../../../pages/master-pages/expense-type-page/ExpenseTypeListPage'
import {EditExpenseType} from '../../../pages/master-pages/expense-type-page/EditExpenseType'
import { AddExpenseType } from '../../../pages/master-pages/expense-type-page/AddExpenseType'


const ExpenseTypeMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/expenseType/list'>
        <PageTitle>Office Expense Type List</PageTitle>
        <ExpenseTypeListPage />
      </Route>
      <Route path='/accounts/expenseType/add'>
        <PageTitle>Add Office Expense Type</PageTitle>
        <AddExpenseType />
      </Route>
      <Route path='/accounts/expenseType/edit/:expenseid'>
        <PageTitle>Edit Office Expense Type</PageTitle>
        <EditExpenseType />
      </Route>
      <Redirect from='/accounts/expenseType' exact={true} to='/accounts/expenseType/list' />
      <Redirect to='/accounts/expenseType/list' />
    </Switch>
  )
}

export default ExpenseTypeMasterPage
