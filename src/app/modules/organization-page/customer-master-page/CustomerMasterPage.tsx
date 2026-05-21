import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import Customer from '../../../pages/organization-page/customer-master/Customer'
import {AddCustomer} from '../../../pages/organization-page/customer-master/AddCustomer'
import EditCustomerPage from './EditCustomerPage'
import ViewCustomerDetailsPage from './ViewCustomerDetailsPage'
import PasswordReset from '../../../pages/organization-page/customer-master/PasswordReset'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Customer',
    path: '/master/city/list',
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

const CustomerMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/customer/list'>
        <PageTitle>Customer List</PageTitle>
        <Customer />
      </Route>
      <Route path='/organization/customer/add'>
        <PageTitle>Add Customer</PageTitle>
        <AddCustomer />
      </Route>
      <Route path='/organization/customer/edit/:customerID'>
        <PageTitle>Edit Customer</PageTitle>
        <EditCustomerPage />
      </Route>
      <Route path='/organization/customer/passwordReset/:customerID'>
        <PageTitle>Password Reset</PageTitle>
        <PasswordReset />
      </Route>
      <Route path='/organization/customer/view/:customerID'>
        <PageTitle>View Customer</PageTitle>
        <ViewCustomerDetailsPage />
      </Route>
      <Redirect from='/organization/customer' exact={true} to='/organization/customer/list' />
      <Redirect to='/organization/customer/list' />
    </Switch>
  )
}

export default CustomerMasterPage
