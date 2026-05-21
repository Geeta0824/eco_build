import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'


import  AddPurchaseAccount  from '../../../pages/accounts-page/purchase-account-master/AddPurchaseAccount'
import PurchaseAccountList from '../../../pages/accounts-page/purchase-account-master/PurchaseAccountList'
import EditPurchaseAccount from '../../../pages/accounts-page/purchase-account-master/EditPurchaseAccount'

const PurchaseAccountMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/purchase/list'>
        <PageTitle>Purchase List</PageTitle>
        <PurchaseAccountList />
      </Route>
      <Route path='/accounts/purchase/add'>
        <PageTitle>Add Purchase</PageTitle>
        <AddPurchaseAccount />
      </Route>
      <Route path='/accounts/purchase/edit/:purchaseID'>
        <PageTitle>Edit Purchase</PageTitle>
        <EditPurchaseAccount />
      </Route>
      <Redirect from='/accounts/purchase' exact={true} to='/accounts/purchase/list' />
      <Redirect to='/accounts/purchase/list' />
    </Switch>
  )
}

export default PurchaseAccountMasterPage
