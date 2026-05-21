import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import EditPayFund from '../../../pages/accounts-page/pay-fund-master/EditPayFund'
import KitchenLayoutList from '../../../pages/kithchen-layout-pages/KitchenLayoutList'
import {AddKitchenLayout} from '../../../pages/kithchen-layout-pages/AddKitchenLayout'

const KitchenLayoutMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/kitchen-layout/list'>
        <PageTitle>Kitchen Layout List</PageTitle>
        <KitchenLayoutList />
      </Route>
      <Route path='/kitchen-layout/add'>
        <PageTitle>Add Kitchen Layout</PageTitle>
        <AddKitchenLayout />
      </Route>
      <Route path='/kitchen-layout/edit/:projectPaymentID'>
        <PageTitle>Edit Kitchen Layout</PageTitle>
        <EditPayFund />
      </Route>
      <Redirect from='/kitchen-layout' exact={true} to='/kitchen-layout/list' />
      <Redirect to='/kitchen-layout/list' />
    </Switch>
  )
}

export default KitchenLayoutMasterPage
