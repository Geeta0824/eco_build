import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import LedgerReportList from '../../../pages/accounts-reports/ledger-report-page/LedgerReportList'
import LedgerPDF from '../../../pages/accounts-reports/ledger-report-page/LedgerPDF'

const LedgerReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/ledger/list'>
        <PageTitle>Ledger Report List</PageTitle>
        <LedgerReportList />
      </Route>
      <Route path='/account-reports/ledger/download'>
        <PageTitle>Download Ledger Report</PageTitle>
        <LedgerPDF />
      </Route>
      <Redirect from='/account-reports/ledger' exact={true} to='/account-reports/ledger/list' />
      <Redirect to='/account-reports/ledger/list' />
    </Switch>
  )
}

export default LedgerReportMasterPage
