import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {EmployeeHeader} from './EmployeeHeader'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {EditEmployeePersonal} from '../../../pages/organization-page/employee-master/EditPages/EditEmployeePersonal'
import {EditEmployeeAddress} from '../../../pages/organization-page/employee-master/EditPages/EditEmployeeAddress'
import EmployeeBankDetailsPage from './bank-details/EmployeeBankDetailsPage'
import EmployeeDocumentDetailsPage from './document-details/EmployeeDocumentDetailsPage'
import EmployeeEducationDetailsPage from './education-details/EmployeeEducationDetailsPage'

const EditEmployeePage: React.FC = () => {
  return (
    <>
      <EmployeeHeader />
      <Switch>
        <Route path='/organization/employee/edit/:employeeID/personal'>
          <PageTitle>Personal</PageTitle>
          <EditEmployeePersonal />
        </Route>
        <Route path='/organization/employee/edit/:employeeID/address'>
          <PageTitle>Address</PageTitle>
          <EditEmployeeAddress />
        </Route>
        <Route path='/organization/employee/edit/:employeeID/bank'>
          <PageTitle>Bank Details</PageTitle>
          <EmployeeBankDetailsPage />
        </Route>
        <Route path='/organization/employee/edit/:employeeID/education'>
          <PageTitle>Education Details</PageTitle>
          <EmployeeEducationDetailsPage />
        </Route>
        <Route path='/organization/employee/edit/:employeeID/document'>
          <PageTitle>Document Details</PageTitle>
          <EmployeeDocumentDetailsPage />
        </Route>

        <Redirect
          from='/organization/employee/edit/:employeeID'
          exact={true}
          to='/organization/employee/edit/:employeeID/personal'
        />
        <Redirect to='/organization/employee/edit/:employeeID/personal' />
      </Switch>
    </>
  )
}

export default EditEmployeePage
