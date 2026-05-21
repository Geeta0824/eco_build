import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import SundryDebtorReportList from '../../../pages/accounts-reports/sundry-debtor-pages/SundryDebtorReportList'
import SundryDebtorReportPDF from '../../../pages/accounts-reports/sundry-debtor-pages/SundryDebtorReportPDF'

const SundryDebtorsReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/sundry-debtor/list'>
        <PageTitle>Sundry Debtors Report List</PageTitle>
        <SundryDebtorReportList />
      </Route>
      <Route path='/account-reports/sundry-debtor/download'>
        <PageTitle>Download Sundry Debtors Report</PageTitle>
        <SundryDebtorReportPDF />
      </Route>
      <Route path='/account-reports/sundry-debtor/view/:sundryDebtorsID'>
        <PageTitle>View Sundry Debtors Report</PageTitle>
        {/* <ViewSundryDebtoReport /> */}
      </Route>
      
      <Redirect
        from='/account-reports/sundry-debtor'
        exact={true}
        to='/account-reports/sundry-debtor/list'
      />
      <Redirect to='/account-reports/sundry-debtor/list' />
    </Switch>
  )
}

export default SundryDebtorsReportMasterPage
