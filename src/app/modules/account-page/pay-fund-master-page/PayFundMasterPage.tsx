import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'

import AddPayFund from '../../../pages/accounts-page/pay-fund-master/AddPayFund'
import PayFundList from '../../../pages/accounts-page/pay-fund-master/PayFundList'
import EditPayFund from '../../../pages/accounts-page/pay-fund-master/EditPayFund'
import PayFundReportPDF from '../../../pages/accounts-page/pay-fund-master/PayFundReportPDF'
import AddPayFundOld from '../../../pages/accounts-page/pay-fund-master/AddPayFundOld'

const PayFundMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/pay-for-project/list'>
        <PageTitle>Pay Fund List</PageTitle>
        <PayFundList />
      </Route>
      <Route path='/accounts/pay-for-project/add'>
        <PageTitle>Add Pay Fund</PageTitle>
        {/* <AddPayFundOld /> */}
        <AddPayFund />
      </Route>
      <Route path='/accounts/pay-for-project/edit/:projectPaymentID'>
        <PageTitle>Edit Pay Fund</PageTitle>
        <EditPayFund />
      </Route>
      <Route path='/accounts/pay-for-project/download'>
        <PageTitle>Download Pay Fund</PageTitle>
        <PayFundReportPDF />
      </Route>
      <Redirect from='/accounts/pay-for-project' exact={true} to='/accounts/pay-for-project/list' />
      <Redirect to='/accounts/pay-for-project/list' />
    </Switch>
  )
}

export default PayFundMasterPage
