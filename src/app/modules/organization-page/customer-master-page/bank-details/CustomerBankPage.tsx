import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import CustomerBank from '../../../../pages/organization-page/customer-master/bank-details/CustomerBank'
import {AddCustomerBank} from '../../../../pages/organization-page/customer-master/bank-details/AddCustomerBank'
import {EditCustomerBank} from '../../../../pages/organization-page/customer-master/bank-details/EditCustomerBank'

const EmployeeBankPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/customer/edit/:customerID/bank/list'>
        <PageTitle>Bank List</PageTitle>
        <CustomerBank />
      </Route>
      <Route path='/organization/customer/edit/:customerID/bank/add'>
        <PageTitle>Add Bank </PageTitle>
        <AddCustomerBank />
      </Route>
      <Route path='/organization/customer/edit/:customerID/bank/edit/:bankID'>
        <PageTitle>Edit Bank </PageTitle>
        <EditCustomerBank />
      </Route>
      <Redirect
        from='/organization/customer/edit/:customerID/bank'
        exact={true}
        to='/organization/customer/edit/:customerID/bank/list'
      />
      <Redirect to='/organization/customer/edit/:customerID/bank/list' />
    </Switch>
  )
}

export default EmployeeBankPage
