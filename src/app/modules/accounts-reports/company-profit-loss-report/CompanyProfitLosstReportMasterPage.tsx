import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import CompanyProjectProfitLossReportList from '../../../pages/accounts-reports/company-profit-loss-page/CompanyProjectProfitLossReportList'
import CompanyProfitLossReportPDF from '../../../pages/accounts-reports/company-profit-loss-page/CompanyProfitLossReportPDF'

const CompanyProfitLosstReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/company-profit-loss/list'>
        <PageTitle>Company Profit/Loss Report List</PageTitle>
        <CompanyProjectProfitLossReportList />
      </Route>
      <Route path='/account-reports/company-profit-loss/download'>
        <PageTitle>Company Profit/Loss PDF Report</PageTitle>
        <CompanyProfitLossReportPDF />
      </Route>
      <Redirect
        from='/account-reports/company-profit-loss'
        exact={true}
        to='/account-reports/company-profit-loss/list'
      />
      <Redirect to='/account-reports/company-profit-loss/list' />
    </Switch>
  )
}

export default CompanyProfitLosstReportMasterPage
