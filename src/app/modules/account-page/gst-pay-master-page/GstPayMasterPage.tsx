import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'

import GSTPayListPage from '../../../pages/accounts-page/gst-pay-pages/GSTPayListPage'
import AddGSTPayPage from '../../../pages/accounts-page/gst-pay-pages/AddGSTPayPage'
import EditGSTPayPage from '../../../pages/accounts-page/gst-pay-pages/EditGSTPayPage'

const GSTPayMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/gst/list'>
        <PageTitle>GST Pay List</PageTitle>
        <GSTPayListPage />
      </Route>
      <Route path='/accounts/gst/add'>
        <PageTitle>Add GST Pay</PageTitle>
        <AddGSTPayPage />
      </Route>
      <Route path='/accounts/gst/edit/:gstPaymentID'>
        <PageTitle>Edit GST Pay</PageTitle>
        <EditGSTPayPage />
      </Route>
      <Redirect from='/accounts/gst' exact={true} to='/accounts/gst/list' />
      <Redirect to='/accounts/gst/list' />
    </Switch>
  )
}

export default GSTPayMasterPage
