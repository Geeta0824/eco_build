import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import { AddCustomerKYCDocument } from '../../../../pages/organization-page/customer-master/KYC-document-details/AddCustomerKYCDocument'
import CustomerKYCDocumentDetails from '../../../../pages/organization-page/customer-master/KYC-document-details/CustomerKYCDocumentDetails'
import { EditCustomerKYCDocument } from '../../../../pages/organization-page/customer-master/KYC-document-details/EditCustomerKYCDocument'

const CustomerKYCDocumentDetailsPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/customer/edit/:customerID/document/list'>
        <PageTitle>KYC Document List</PageTitle>
        <CustomerKYCDocumentDetails />
      </Route>
      <Route path='/organization/customer/edit/:customerID/document/add'>
        <PageTitle>Add KYC Document</PageTitle>
        <AddCustomerKYCDocument />
      </Route>
      <Route path='/organization/customer/edit/:customerID/document/edit/:customerKYCDocID'>
        <PageTitle>Edit KYC Document</PageTitle>
        <EditCustomerKYCDocument />
      </Route>
      <Redirect
        from='/organization/customer/edit/:customerID/document'
        exact={true}
        to='/organization/customer/edit/:customerID/document/list'
      />
      <Redirect to='/organization/customer/edit/:customerID/document/list' />
    </Switch>
  )
}

export default CustomerKYCDocumentDetailsPage
