import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import PayPurchaseList from '../../../pages/accounts-page/pay-purchase-master/PayPurchaseList'
import AddPayPurchase from '../../../pages/accounts-page/pay-purchase-master/AddPayPurchase'
import EditPayPurchase from '../../../pages/accounts-page/pay-purchase-master/EditPayPurchase'

const PayPurchaseMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/pay-for-purchase/list'>
        <PageTitle>Pay Purchase List</PageTitle>
        <PayPurchaseList />
      </Route>
      <Route path='/accounts/pay-for-purchase/add'>
        <PageTitle>Add Pay Purchase</PageTitle>
        <AddPayPurchase />
      </Route>
      <Route path='/accounts/pay-for-purchase/edit/:purchasePaymentID'>
        <PageTitle>Edit Pay Purchase</PageTitle>
        <EditPayPurchase />
      </Route>
      <Redirect
        from='/accounts/pay-for-purchase'
        exact={true}
        to='/accounts/pay-for-purchase/list'
      />
      <Redirect to='/accounts/pay-for-purchase/list' />
    </Switch>
  )
}

export default PayPurchaseMasterPage
