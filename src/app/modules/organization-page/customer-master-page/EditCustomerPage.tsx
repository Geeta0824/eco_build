import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {CustomerHeader} from './CustomerHeader'
import {PageTitle} from '../../../../_Ecd/layout/core'
import { EditCustomerPersonal } from '../../../pages/organization-page/customer-master/EditPages/EditCustomerPersonal'
import { EditCustomerAddress } from '../../../pages/organization-page/customer-master/EditPages/EditCustomerAddress'
import EmployeeBankPage from './bank-details/CustomerBankPage'
import CustomerKYCDocumentDetailsPage from './KYC-document-details/CustomerKYCDocumentDetailsPage'
import { CustomerTerminalPage } from '../../../pages/organization-page/customer-master/EditPages/CustomerTerminalPage'

const EditCustomerPage: React.FC = () => {
  return (
    <>
      <CustomerHeader />
      <Switch>
        <Route path='/organization/customer/edit/:customerID/personal'>
          <PageTitle>Personal</PageTitle>
          <EditCustomerPersonal />
        </Route>
        <Route path='/organization/customer/edit/:customerID/address'>
          <PageTitle>Address</PageTitle>
          <EditCustomerAddress />
        </Route>
        <Route path='/organization/customer/edit/:customerID/bank'>
          <PageTitle>Bank Details</PageTitle>
          <EmployeeBankPage />
        </Route>
        {/* <Route path='/organization/customer/edit/:customerID/education'>
          <PageTitle>Education Details</PageTitle>
          <CustomerEducationDetailsPage />
        </Route> */}
        <Route path='/organization/customer/edit/:customerID/document'>
          <PageTitle>KYC Document Details</PageTitle>
          <CustomerKYCDocumentDetailsPage />
        </Route>
        <Route path='/organization/customer/edit/:customerID/terminal'>
          <PageTitle>Terminal Code Details</PageTitle>
          <CustomerTerminalPage />
        </Route>

        <Redirect
          from='/organization/customer/edit/:customerID'
          exact={true}
          to='/organization/customer/edit/:customerID/personal'
        />
        <Redirect to='/organization/customer/edit/:customerID/personal' />
      </Switch>
    </>
  )
}

export default EditCustomerPage
