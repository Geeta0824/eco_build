import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import VendorReportList from '../../../pages/accounts-reports/vendor-report-page/VendorReportList'
import VendorPDF from '../../../pages/accounts-reports/vendor-report-page/VendorPDF'
import VendorReportView from '../../../pages/accounts-reports/vendor-report-page/VendorReportView'
import VendorReportViewPDF from '../../../pages/accounts-reports/vendor-report-page/VendorReportViewPDF'
import ViewStageWiseReportView from '../../../pages/accounts-reports/vendor-report-page/ViewStageWiseReportView'
import StageWiseReportPDF from '../../../pages/accounts-reports/vendor-report-page/StageWiseReportPDF'
import DueDetailsStageWiseList from '../../../pages/accounts-reports/vendor-report-page/DueDetailsStageWiseList'
import OtherVendorReportList from '../../../pages/accounts-reports/other-vendor-report-pages/OtherVendorReportList'
import OtherVendorPDF from '../../../pages/accounts-reports/other-vendor-report-pages/OtherVendorPDF'
import OtherVendorReportView from '../../../pages/accounts-reports/other-vendor-report-pages/OtherVendoReportView'
import OtherVendorReportViewPDF from '../../../pages/accounts-reports/other-vendor-report-pages/OtherVendorReportViewPDF'
import DiyDueDetailsStageWiseList from '../../../pages/accounts-reports/vendor-report-page/DiyDueDetailsStageWiseList'
import ModularDueDetailsStageWiseList from '../../../pages/accounts-reports/vendor-report-page/ModularDueDetailsStageWiseList'
const OtherVendorReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/other-vendor/list'>
        <PageTitle>Other Vendor Report List</PageTitle>
        <OtherVendorReportList />
      </Route>
      <Route path='/account-reports/other-vendor/download/:vendorID'>
        <PageTitle>Download Other Vendor Report</PageTitle>
        <OtherVendorPDF />
      </Route>
      <Route path='/account-reports/other-vendor/view'>
        <PageTitle>View Project Wise Report</PageTitle>
        <OtherVendorReportView />
      </Route>
      <Route path='/account-reports/other-vendor/amount-due-details'>
        <PageTitle>View Amount Due Details</PageTitle>
        <DueDetailsStageWiseList />
      </Route>
      <Route path='/account-reports/other-vendor/diy-amount-due-details'>
        <PageTitle>View DIY Amount Due Details</PageTitle>
        <DiyDueDetailsStageWiseList />
      </Route>
      <Route path='/account-reports/other-vendor/modular-amount-due-details'>
        <PageTitle>View Modular Amount Due Details</PageTitle>
        <ModularDueDetailsStageWiseList />
      </Route>
      <Route path='/account-reports/other-vendor/download-view/:vendorID'>
        <PageTitle>Download Other Vendor View Report</PageTitle>
        <OtherVendorReportViewPDF />
      </Route>

      {/* 
      <Route path='/account-reports/other-vendor/stage-wise'>
        <PageTitle>View Stage Wise Report</PageTitle>
        <ViewStageWiseReportView />
      </Route>
      <Route path='/account-reports/other-vendor/download-stage-wise-report/:vendorID'>
        <PageTitle>Download Vendor Stage Wise View Report</PageTitle>
        <StageWiseReportPDF />
      </Route> */}
      <Redirect
        from='/account-reports/vendor'
        exact={true}
        to='/account-reports/other-vendor/list'
      />
      <Redirect to='/account-reports/other-vendor/list' />
    </Switch>
  )
}

export default OtherVendorReportMasterPage
