import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import PurchaseLedgerList from '../../../pages/accounts-reports/purchage-ledger-pages/PurchaseLedgerList'
const PurchaseLedgerMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/purchase-ledger/list'>
        <PageTitle>Purchase Ledger List</PageTitle>
        <PurchaseLedgerList />
      </Route>
      {/* <Route path='/account-reports/purchase-ledger/download/:vendorID'>
        <PageTitle>Download Vendor Report</PageTitle>
        <VendorPDF />
      </Route>
      <Route path='/account-reports/purchase-ledger/download-view/:vendorID'>
        <PageTitle>Download Vendor View Report</PageTitle>
        <VendorReportViewPDF />
      </Route>
      <Route path='/account-reports/purchase-ledger/view'>
        <PageTitle>View Project Wise Report</PageTitle>
        <VendorReportView />
      </Route> */}
      <Redirect from='/account-reports/purchase-ledger' exact={true} to='/account-reports/purchase-ledger/list' />
      <Redirect to='/account-reports/purchase-ledger/list' />
    </Switch>
  )
}

export default PurchaseLedgerMasterPage
