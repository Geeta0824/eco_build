import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import CustomerComplainListPage from '../../pages/customer-complain-page/CustomerComplainListPage'
import {ViewCustomerComplain} from '../../pages/customer-complain-page/ViewCustomerComplain'
import AddCustomerComplain from '../../pages/customer-complain-page/AddCustomerComplain'

const CustomerComplainMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/cust-complaint/list'>
        <PageTitle>Customer Complaint List</PageTitle>
        <CustomerComplainListPage />
      </Route>

      <Route path='/cust-complaint/view/:customerComplainID'>
        <PageTitle>View Customer Complaint </PageTitle>
        <ViewCustomerComplain />
      </Route>
      <Route path='/cust-complaint/add'>
        <PageTitle>Add Complaint Details</PageTitle>
        <AddCustomerComplain />
      </Route>
      <Redirect from='/cust-complaint' exact={true} to='/cust-complaint/list' />
      <Redirect to='/cust-complaint/list' />
    </Switch>
  )
}

export default CustomerComplainMasterPage
