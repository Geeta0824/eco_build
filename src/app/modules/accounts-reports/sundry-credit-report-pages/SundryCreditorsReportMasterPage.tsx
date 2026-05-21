import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import SundryCreditorReportList from '../../../pages/accounts-reports/sundry-creditor-pages/SundryCreditorReportList'
import SundryCreditorReportPDF from '../../../pages/accounts-reports/sundry-creditor-pages/SundryCreditorReportPDF'
import SundryCreditorList from '../../../pages/accounts-reports/sundry-creditor-pages/SundryCreditorList'
import SundryCreditorPDF from '../../../pages/accounts-reports/sundry-creditor-pages/SundryCreditorPDF'

const SundryCreditorsReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/sundry-creditor/list'>
        <PageTitle>Sundry Creditors Report List</PageTitle>
        <SundryCreditorList />
      </Route>
      <Route path='/account-reports/sundry-creditor/download'>
        <PageTitle>Download Sundry Creditors PDF</PageTitle>
        <SundryCreditorPDF />
      </Route>
      <Route path='/account-reports/sundry-creditor/view/list'>
        <PageTitle>Sundry Creditors Report List</PageTitle>
        <SundryCreditorReportList />
      </Route>
      <Route path='/account-reports/sundry-creditor/view/download'>
        <PageTitle>View Sundry Creditors Report PDF</PageTitle>
        <SundryCreditorReportPDF />
      </Route>

      <Redirect
        from='/account-reports/sundry-creditor'
        exact={true}
        to='/account-reports/sundry-creditor/list'
      />
      <Redirect to='/account-reports/sundry-creditor/list' />
    </Switch>
  )
}

export default SundryCreditorsReportMasterPage
