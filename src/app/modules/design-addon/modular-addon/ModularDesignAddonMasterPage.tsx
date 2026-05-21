import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ModularAddonListPage from '../../../pages/design-addon-pages/modular-addon-pages/ModularAddonListPage'
import ModularByModularAddonID from '../../../pages/design-addon-pages/modular-addon-pages/modular-addon-cart/ModularByModularAddonID'
import CartListModularAddon from '../../../pages/design-addon-pages/modular-addon-pages/modular-addon-cart/CartListModularAddon'

const ModularDesignAddonMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/design/modular-addon/list'>
        <PageTitle>Modular Addon List</PageTitle>
        <ModularAddonListPage />
      </Route>
      <Route path='/design/modular-addon/add-cart/:quotationID'>
        <PageTitle>Add Modular Addon Cart</PageTitle>
        <ModularByModularAddonID />
      </Route>
      <Route path='/design/modular-addon/view-cart/:quotationID'>
        <PageTitle>View Modular Addon</PageTitle>
        <CartListModularAddon />
      </Route>
      <Redirect from='/design/modular-addon' exact={true} to='/design/modular-addon/list' />
      <Redirect to='/design/modular-addon/list' />
    </Switch>
  )
}

export default ModularDesignAddonMasterPage
