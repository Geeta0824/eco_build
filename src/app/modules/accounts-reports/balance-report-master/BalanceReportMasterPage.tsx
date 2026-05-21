import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import BalanceReportList from '../../../pages/accounts-reports/balance-report-master/BalanceReportList'
const BalanceReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/balance/list'>
        <PageTitle>Balance Report List</PageTitle>
        <BalanceReportList />
      </Route>
      <Redirect from='/account-reports/balance' exact={true} to='/account-reports/balance/list' />
      <Redirect to='/account-reports/balance/list' />
    </Switch>
  )
}

export default BalanceReportMasterPage
