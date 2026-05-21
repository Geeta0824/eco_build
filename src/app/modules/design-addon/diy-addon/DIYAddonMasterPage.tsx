import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import DIYAddonListPage from '../../../pages/design-addon-pages/diy-addon-pages/DIYAddonListPage'
import DIYByDIYAddonID from '../../../pages/design-addon-pages/diy-addon-pages/diy-addon-cart/DIYByDIYAddonID'
import CartListDIYAddon from '../../../pages/design-addon-pages/diy-addon-pages/diy-addon-cart/CartListDIYAddon'
import {AgencyWorkOrderPage} from '../../../pages/quotations-pages/diy-quotation-pages/AgencyWorkOrderPage'

const DIYAddonMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/design/diy-addon/list'>
        <PageTitle>DIY Addon List</PageTitle>
        <DIYAddonListPage />
      </Route>
      <Route path='/design/diy-addon/add-cart/:quotationID'>
        <PageTitle>Add DIY Addon Cart</PageTitle>
        <DIYByDIYAddonID />
      </Route>
      <Route path='/design/diy-addon/view-cart/:quotationID'>
        <PageTitle>View DIY Addon</PageTitle>
        <CartListDIYAddon />
      </Route>
      <Route path='/design/diy-addon/agency-work-order/:quotationID'>
        <PageTitle>Agency Work Order</PageTitle>
        <AgencyWorkOrderPage />
      </Route>
      <Redirect from='/design/diy-addon' exact={true} to='/design/diy-addon/list' />
      <Redirect to='/design/diy-addon/list' />
    </Switch>
  )
}

export default DIYAddonMasterPage
