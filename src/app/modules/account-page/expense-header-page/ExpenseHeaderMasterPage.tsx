import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ExpenseHeaderListPage from '../../../pages/accounts-page/expense-header/ExpenseHeaderListPage'
import {AddExpenseHeader} from '../../../pages/accounts-page/expense-header/AddExpenseHeader'
import {EditExpenseHeader} from '../../../pages/accounts-page/expense-header/EditExpenseHeader'

const ExpenseHeaderMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/expense-head/list'>
        <PageTitle>Expense Head List</PageTitle>
        <ExpenseHeaderListPage />
      </Route>
      <Route path='/accounts/expense-head/add'>
        <PageTitle>Add Expense Head</PageTitle>
        <AddExpenseHeader />
      </Route>
      <Route path='/accounts/expense-head/edit/:expenseid'>
        <PageTitle>Edit Expense Head</PageTitle>
        <EditExpenseHeader />
      </Route>
      <Redirect from='/accounts/expense-head' exact={true} to='/accounts/expense-head/list' />
      <Redirect to='/accounts/expense-head/list' />
    </Switch>
  )
}

export default ExpenseHeaderMasterPage
