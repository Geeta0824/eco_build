import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import EmployeeBankDetails from '../../../../pages/organization-page/employee-master/bank-details/EmployeeBankDetails'
import {EditEmployeeBank} from '../../../../pages/organization-page/employee-master/bank-details/EditEmployeeBank'
import {AddEmployeeBank} from '../../../../pages/organization-page/employee-master/bank-details/AddEmployeeBank'

const EmployeeBankDetailsPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/employee/edit/:employeeID/bank/list'>
        <PageTitle>Bank Details List</PageTitle>
        <EmployeeBankDetails />
      </Route>
      <Route path='/organization/employee/edit/:employeeID/bank/add'>
        <PageTitle>Add Bank Details</PageTitle>
        <AddEmployeeBank />
      </Route>
      <Route path='/organization/employee/edit/:employeeID/bank/edit/:bankID'>
        <PageTitle>Edit Bank Details</PageTitle>
        <EditEmployeeBank />
      </Route>
      <Redirect
        from='/organization/employee/edit/:employeeID/bank'
        exact={true}
        to='/organization/employee/edit/:employeeID/bank/list'
      />
      <Redirect to='/organization/employee/edit/:employeeID/bank/list' />
    </Switch>
  )
}

export default EmployeeBankDetailsPage
