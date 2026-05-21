import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ProjectExpenseList from '../../../pages/accounts-page/project-expense-pages/ProjectExpenseList'
import {AddProjectExpense} from '../../../pages/accounts-page/project-expense-pages/AddProjectExpense'
import {EditProjectExpense} from '../../../pages/accounts-page/project-expense-pages/EditProjectExpense'
import {AddMultipleProjectExpense} from '../../../pages/accounts-page/project-expense-pages/AddMultipleProjectExpense'

const ProjectExpenseMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/project-expense/list'>
        <PageTitle>Project Expense List</PageTitle>
        <ProjectExpenseList />
      </Route>
      <Route path='/accounts/project-expense/add'>
        <PageTitle>Add Project Expense</PageTitle>
        <AddMultipleProjectExpense />
        {/* <AddProjectExpense /> This is privious backup for payment one by one  project expenxe  */}
      </Route>
      <Route path='/accounts/project-expense/edit/:projectExpenseID'>
        <PageTitle>Edit Project Expense</PageTitle>
        <EditProjectExpense />
      </Route>
      <Redirect from='/accounts/project-expense' exact={true} to='/accounts/project-expense/list' />
      <Redirect to='/accounts/project-expense/list' />
    </Switch>
  )
}

export default ProjectExpenseMasterPage
