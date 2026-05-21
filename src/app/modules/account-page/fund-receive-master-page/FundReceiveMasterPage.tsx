import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'

import FundReceiveList from '../../../pages/accounts-page/fund-receive-master/FundReceiveList'
import AddFundReceive from '../../../pages/accounts-page/fund-receive-master/AddFundReceive'
import EditFundReceive from '../../../pages/accounts-page/fund-receive-master/EditFundReceive'
import FundReceiveReportPDF from '../../../pages/accounts-page/fund-receive-master/FundReceiveReportPDF'

const FundReceiveMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/fundreceive/list'>
        <PageTitle>Fund Receive List</PageTitle>
        <FundReceiveList />
      </Route>
      <Route path='/accounts/fundreceive/add'>
        <PageTitle>Add Fund Receive</PageTitle>
        <AddFundReceive />
      </Route>
      <Route path='/accounts/fundreceive/edit/:projectPaymentID'>
        <PageTitle>Edit Fund Receive</PageTitle>
        <EditFundReceive />
      </Route>
      <Route path='/accounts/fundreceive/download'>
        <PageTitle>Download Fund Receive</PageTitle>
        <FundReceiveReportPDF />
      </Route>
      <Redirect from='/accounts/fundreceive' exact={true} to='/accounts/fundreceive/list' />
      <Redirect to='/accounts/fundreceive/list' />
    </Switch>
  )
}

export default FundReceiveMasterPage
