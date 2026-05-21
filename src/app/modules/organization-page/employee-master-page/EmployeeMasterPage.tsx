import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import Employee from '../../../pages/organization-page/employee-master/Employee'
import {AddEmployee} from '../../../pages/organization-page/employee-master/AddEmployee'
import EmployeeEditPage from './EditEmployeePage'
import ViewEmployeeDetailsPage from './ViewEmployeeDetailsPage'

const employeeBreadCrumbs: Array<PageLink> = [
  {
    title: 'Employee',
    path: '/organization/employee/list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const EmployeeMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/employee/list'>
        <PageTitle>Employee List</PageTitle>
        <Employee />
      </Route>
      <Route path='/organization/employee/add'>
        <PageTitle>Add Employee</PageTitle>
        <AddEmployee />
      </Route>
      <Route path='/organization/employee/edit/:employeeID'>
        <PageTitle>Edit Employee</PageTitle>
        <EmployeeEditPage />
      </Route>
      <Route path='/organization/employee/view/:employeeID'>
        <PageTitle>View Employee</PageTitle>
        <ViewEmployeeDetailsPage />
      </Route>
      <Redirect from='/organization/employee' exact={true} to='/organization/employee/list' />
      <Redirect to='/organization/employee/list' />
    </Switch>
  )
}

export default EmployeeMasterPage
