import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import BalanceReportList from '../../../pages/accounts-reports/balance-report-master/BalanceReportList'
import { AccountDashboard } from '../../../pages/accounts-reports/account-dashboard/AccountDashboard'
const AccountDashboardMaster: React.FC = () => {

 
  return (
    <Switch>
      <Route path='/account-reports/account-dashboard/d-board'>
        <PageTitle>Account Dashboard</PageTitle>
        {/* <BalanceReportList /> */}
        <AccountDashboard />
        
      </Route>
      <Redirect from='/account-reports/account-dashboard' exact={true} to='/account-reports/account-dashboard/d-board' />
      <Redirect to='/account-reports/account-dashboard/d-board' />
    </Switch>
  )
}

export default AccountDashboardMaster
