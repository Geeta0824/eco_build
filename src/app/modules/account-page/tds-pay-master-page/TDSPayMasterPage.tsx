import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import TDSPayListPage from '../../../pages/accounts-page/tds-pay-pages/TDSPayListPage'
import EditTDSPayPage from '../../../pages/accounts-page/tds-pay-pages/EditTDSPayPage'
import AddTDSPayPage from '../../../pages/accounts-page/tds-pay-pages/AddTDSPayPage'

const TDSPayMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/tds/list'>
        <PageTitle>TDS Pay List</PageTitle>
        <TDSPayListPage />
      </Route>
      <Route path='/accounts/tds/add'>
        <PageTitle>Add TDS Pay</PageTitle>
        <AddTDSPayPage />
     </Route>
      <Route path='/accounts/tds/edit/:tdsPayID'>
        <PageTitle>Edit TDS Pay</PageTitle>
        <EditTDSPayPage />
     </Route>
      <Redirect from='/accounts/tds' exact={true} to='/accounts/tds/list' />
      <Redirect to='/accounts/tds/list' />
    </Switch>
  )
}

export default TDSPayMasterPage
