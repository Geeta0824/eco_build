import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {VendorHeader} from './VendorHeader'
import {PageTitle} from '../../../../_Ecd/layout/core'
import EditVender from '../../../pages/master-pages/vender-pages/EditVender'
import VendorBankDetailsMasterPage from './bank-details/VendorBankDetailsMasterPage'
import VendorDocumentDetailsMasterPage from './document-details/VendorDocumentDetailsMasterPage'
// import EmployeeEducationDetailsPage from './education-details/EmployeeEducationDetailsPage'

const EditVendorMasterPage: React.FC = () => {
  return (
    <>
      <VendorHeader />
      <Switch>
        <Route path='/vender/edit/:vendorID/edit'>
          <PageTitle>Edit Vendor</PageTitle>
          <EditVender />
        </Route>
        <Route path='/vender/edit/:vendorID/bank'>
          <PageTitle>Bank Details</PageTitle>
          <VendorBankDetailsMasterPage />
        </Route>
        <Route path='/vender/edit/:vendorID/document'>
          <PageTitle>Document Details</PageTitle>
          <VendorDocumentDetailsMasterPage />
        </Route>

        <Redirect from='/vender/edit/:vendorID' exact={true} to='/vender/edit/:vendorID/edit' />
        <Redirect to='/vender/edit/:vendorID/edit' />
      </Switch>
    </>
  )
}

export default EditVendorMasterPage
