import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ReadyMadeAddonListPage from '../../../pages/design-addon-pages/ready-made-addon-pages/ReadyMadeAddonListPage'
import CartListReadyMadeAddon from '../../../pages/design-addon-pages/ready-made-addon-pages/ready-made-addon-cart/CartListReadyMadeAddon'

const ReadyMadeAddonMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/design/readymade-addon/list'>
        <PageTitle>Ready Made Addon List</PageTitle>
        <ReadyMadeAddonListPage />
      </Route>
      <Route path='/design/readymade-addon/view-cart/:quotationID'>
        <PageTitle>View Ready Made Addon</PageTitle>
        <CartListReadyMadeAddon />
      </Route>
      <Redirect from='/design/readymade-addon' exact={true} to='/design/readymade-addon/list' />
      <Redirect to='/design/readymade-addon/list' />
    </Switch>
  )
}

export default ReadyMadeAddonMasterPage
