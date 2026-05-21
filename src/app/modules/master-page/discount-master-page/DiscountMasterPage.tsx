import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import DiscountListPage from '../../../pages/master-pages/discount-pages/DiscountListPage'
import {EditDiscount} from '../../../pages/master-pages/discount-pages/EditDiscount'
import {AddDiscount} from '../../../pages/master-pages/discount-pages/AddDiscount'

const DiscountMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/discount/list'>
        <PageTitle>DIY Discount List</PageTitle>
        <DiscountListPage />
      </Route>
      <Route path='/master/discount/add'>
        <PageTitle>Add DIY Discount</PageTitle>
        <AddDiscount />
      </Route>
      <Route path='/master/discount/edit/:discountId'>
        <PageTitle>Edit DIY Discount</PageTitle>
        <EditDiscount />
      </Route>
      <Redirect from='/master/discount' exact={true} to='/master/discount/list' />
      <Redirect to='/master/discount/list' />
    </Switch>
  )
}

export default DiscountMasterPage
