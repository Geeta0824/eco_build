import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import VendorPenaltyReportList from '../../../pages/reports-page/penalty-report/VendorPenaltyReportList'
import VendorPenaltyReportPDF from '../../../pages/reports-page/penalty-report/VendorPenaltyReportPDF'

const VendorPenaltyReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/reports/vendor-penalty/list'>
        <PageTitle>Vendor Penalty Report List</PageTitle>
        <VendorPenaltyReportList />
      </Route>
      <Route path='/reports/vendor-penalty/download'>
        <PageTitle>Vendor Penalty Report Download</PageTitle>
        <VendorPenaltyReportPDF />
      </Route>
      <Redirect from='/reports/vendor-penalty' exact={true} to='/reports/vendor-penalty/list' />
      <Redirect to='/reports/vendor-penalty/list' />
    </Switch>
  )
}

export default VendorPenaltyReportMasterPage
