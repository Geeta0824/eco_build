import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import CashAccountReportList from '../../../pages/accounts-reports/cash-account-report-page/CashAccountReportList'
import CashAccountLedgerView from '../../../pages/accounts-reports/cash-account-report-page/CashAccountLedgerView'
import CashAccountPDF from '../../../pages/accounts-reports/cash-account-report-page/CashAccountPDF'
import CashAccountLedgerPDF from '../../../pages/accounts-reports/cash-account-report-page/CashAccountLedgerPDF'

const CashAccountReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/cash/list'>
        <PageTitle>Cash Account Report List</PageTitle>
        <CashAccountReportList />
      </Route>
      <Route path='/account-reports/cash/download/:cashAccountID'>
        <PageTitle>Download Cash Account Report</PageTitle>
        <CashAccountPDF />
      </Route>
      <Route path='/account-reports/cash/view'>
        <PageTitle>View Cash Account Ledger</PageTitle>
        <CashAccountLedgerView />
      </Route>
      <Route path='/account-reports/cash/download-view/:cashAccountID'>
        <PageTitle>Download Cash Account Ledger</PageTitle>
        <CashAccountLedgerPDF />
      </Route>
      <Redirect from='/account-reports/cash' exact={true} to='/account-reports/cash/list' />
      <Redirect to='/account-reports/cash/list' />
    </Switch>
  )
}

export default CashAccountReportMasterPage
