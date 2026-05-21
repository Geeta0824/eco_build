import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {EmployeeHeader} from './EmployeeHeader'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {ViewEmployeePersonal} from '../../../pages/organization-page/employee-master/view-employee-details/ViewEmployeePersonal'
import {ViewEmployeeAddress} from '../../../pages/organization-page/employee-master/view-employee-details/ViewEmployeeAddress'
import { ViewEmployeeBank } from '../../../pages/organization-page/employee-master/view-employee-details/ViewEmployeeBank'
import { ViewEmployeeEducation } from '../../../pages/organization-page/employee-master/view-employee-details/ViewEmployeeEducation'
import { ViewEmployeeDocument } from '../../../pages/organization-page/employee-master/view-employee-details/ViewEmployeeDocument'

const ViewEmployeeDetailsPage: React.FC = () => {
  return (
    <>
      <EmployeeHeader />
      <Switch>
        <Route path='/organization/employee/view/:employeeID/personal'>
          <PageTitle>Personal</PageTitle>
          <ViewEmployeePersonal />
        </Route>
        <Route path='/organization/employee/view/:employeeID/address'>
          <PageTitle>Address</PageTitle>
          <ViewEmployeeAddress />
        </Route>
        <Route path='/organization/employee/view/:employeeID/bank'>
          <PageTitle>Bank Details</PageTitle>
          <ViewEmployeeBank />
        </Route>
        <Route path='/organization/employee/view/:employeeID/education'>
          <PageTitle>Education Details</PageTitle>
          <ViewEmployeeEducation />
        </Route>
        <Route path='/organization/employee/view/:employeeID/document'>
          <PageTitle>Document Details</PageTitle>
          <ViewEmployeeDocument />
        </Route>

        <Redirect
          from='/organization/employee/view/:employeeID'
          exact={true}
          to='/organization/employee/view/:employeeID/personal'
        />
        <Redirect to='/organization/employee/view/:employeeID/personal' />
      </Switch>
    </>
  )
}

export default ViewEmployeeDetailsPage
