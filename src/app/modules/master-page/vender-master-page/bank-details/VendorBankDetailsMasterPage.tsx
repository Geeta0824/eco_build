import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import VendorBankDetails from '../../../../pages/master-pages/vender-pages/bank-details/VendorBankDetails'
import { AddVendorBank } from '../../../../pages/master-pages/vender-pages/bank-details/AddVendorBank'
import { EditVendorBank } from '../../../../pages/master-pages/vender-pages/bank-details/EditVendorBank'

const VendorBankDetailsMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/vender/edit/:vendorID/bank/list'>
        <PageTitle>Bank Details List</PageTitle>
        <VendorBankDetails />
      </Route>
      <Route path='/vender/edit/:vendorID/bank/add'>
        <PageTitle>Add Bank Details</PageTitle>
        <AddVendorBank />
      </Route>
      <Route path='/vender/edit/:vendorID/bank/edit/:bankID'>
        <PageTitle>Edit Bank Details</PageTitle>
        <EditVendorBank />
      </Route>
      <Redirect
        from='/vender/edit/:vendorID/bank'
        exact={true}
        to='/vender/edit/:vendorID/bank/list'
      />
      <Redirect to='/vender/edit/:vendorID/bank/list' />
    </Switch>
  )
}

export default VendorBankDetailsMasterPage
