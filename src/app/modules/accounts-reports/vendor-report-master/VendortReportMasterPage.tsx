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
import DiyDueDetailsStageWiseList from '../../../pages/accounts-reports/vendor-report-page/DiyDueDetailsStageWiseList'
import ModularDueDetailsStageWiseList from '../../../pages/accounts-reports/vendor-report-page/ModularDueDetailsStageWiseList'
const VendortReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/vendor/list'>
        <PageTitle>PMC Vendor Report List</PageTitle>
        <VendorReportList />
      </Route>
      <Route path='/account-reports/vendor/download/:vendorID'>
        <PageTitle>Download PMC Vendor Report</PageTitle>
        <VendorPDF />
      </Route>
      <Route path='/account-reports/vendor/download-view/:vendorID'>
        <PageTitle>Download PMC Vendor View Report</PageTitle>
        <VendorReportViewPDF />
      </Route>
      <Route path='/account-reports/vendor/view'>
        <PageTitle>View Project Wise Report</PageTitle>
        <VendorReportView />
      </Route>
      <Route path='/account-reports/vendor/stage-wise'>
        <PageTitle>View Stage Wise Report</PageTitle>
        <ViewStageWiseReportView />
      </Route>
      <Route path='/account-reports/vendor/amount-due-details'>
        <PageTitle>View Amount Due Details</PageTitle>
        <DueDetailsStageWiseList />
      </Route>
      <Route path='/account-reports/vendor/diy-amount-due-details'>
        <PageTitle>View DIY Amount Due Details</PageTitle>
        <DiyDueDetailsStageWiseList />
      </Route>
      <Route path='/account-reports/vendor/modular-amount-due-details'>
        <PageTitle>View Modular Amount Due Details</PageTitle>
        <ModularDueDetailsStageWiseList />
      </Route>
      <Route path='/account-reports/vendor/download-stage-wise-report/:vendorID'>
        <PageTitle>Download Vendor Stage Wise View Report</PageTitle>
        <StageWiseReportPDF />
      </Route>
      <Redirect from='/account-reports/vendor' exact={true} to='/account-reports/vendor/list' />
      <Redirect to='/account-reports/vendor/list' />
    </Switch>
  )
}

export default VendortReportMasterPage
