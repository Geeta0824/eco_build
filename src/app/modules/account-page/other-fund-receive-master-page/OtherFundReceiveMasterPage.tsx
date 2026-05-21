import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'

import OtherFundReceiveList from '../../../pages/accounts-page/other-fund-receive-master/OtherFundReceiveList'
import AddOtherFundReceive from '../../../pages/accounts-page/other-fund-receive-master/AddOtherFundReceive'
import EditOtherFundReceive from '../../../pages/accounts-page/other-fund-receive-master/EditOtherFundReceive'

const OtherFundReceiveMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/other-fund-receive/list'>
        <PageTitle>Other Fund Receive List</PageTitle>
        <OtherFundReceiveList />
      </Route>
      <Route path='/accounts/other-fund-receive/add'>
        <PageTitle>Add Other Fund Receive</PageTitle>
        <AddOtherFundReceive />
      </Route>
      <Route path='/accounts/other-fund-receive/edit/:otherPaymentID'>
        <PageTitle>Edit Other Fund Receive</PageTitle>
        <EditOtherFundReceive />
      </Route>
      <Redirect
        from='/accounts/other-fund-receive'
        exact={true}
        to='/accounts/other-fund-receive/list'
      />
      <Redirect to='/accounts/other-fund-receive/list' />
    </Switch>
  )
}

export default OtherFundReceiveMasterPage
