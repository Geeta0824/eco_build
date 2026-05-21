import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import { AddEmployeeEducation } from '../../../../pages/organization-page/employee-master/education-details/AddEmployeeEducation'
import { EditEmployeeEducation } from '../../../../pages/organization-page/employee-master/education-details/EditEmployeeEducation'
import EmployeeEducationDetails from '../../../../pages/organization-page/employee-master/education-details/EmployeeEducationDetails'

const EmployeeEducationDetailsPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/employee/edit/:employeeID/education/list'>
        <PageTitle>Education List</PageTitle>
        <EmployeeEducationDetails />
      </Route>
      <Route path='/organization/employee/edit/:employeeID/education/add'>
        <PageTitle>Add Education</PageTitle>
        <AddEmployeeEducation />
      </Route>
      <Route path='/organization/employee/edit/:employeeID/education/edit/:educationID'>
        <PageTitle>Edit Education</PageTitle>
        <EditEmployeeEducation />
      </Route>
      <Redirect
        from='/organization/employee/edit/:employeeID/education'
        exact={true}
        to='/organization/employee/edit/:employeeID/education/list'
      />
      <Redirect to='/organization/employee/edit/:employeeID/education/list' />
    </Switch>
  )
}

export default EmployeeEducationDetailsPage
