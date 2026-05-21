import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ExpenseMastersList from '../../../pages/master-pages/expense-masters-pages/ExpenseMastersList'
import {AddExpenseMasters} from '../../../pages/master-pages/expense-masters-pages/AddExpenseMasters'
import {EditExpenseMasters} from '../../../pages/master-pages/expense-masters-pages/EditExpenseMasters'
import OfficeExpenseMastersPdf from '../../../pages/master-pages/expense-masters-pages/OfficeExpenseMastersPdf'

const ExpenseMastersMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/expenseMasters/list'>
        <PageTitle>Office Expense List</PageTitle>
        <ExpenseMastersList />
      </Route>
      <Route path='/accounts/expenseMasters/add'>
        <PageTitle>Add Office Expense</PageTitle>
        <AddExpenseMasters />
      </Route>
      <Route path='/accounts/expenseMasters/edit/:expmstID'>
        <PageTitle>Edit Office Expense</PageTitle>
        <EditExpenseMasters />
      </Route>
      <Route path='/accounts/expenseMasters/download'>
        <PageTitle>Download Office Expense</PageTitle>
        <OfficeExpenseMastersPdf />
      </Route>
      <Redirect from='/accounts/expenseMasters' exact={true} to='/accounts/expenseMasters/list' />
      <Redirect to='/accounts/expenseMasters/list' />
    </Switch>
  )
}

export default ExpenseMastersMasterPage
