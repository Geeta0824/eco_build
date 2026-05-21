import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'

import {EditDiscount} from '../../../pages/master-pages/discount-pages/EditDiscount'
import {AddDiscount} from '../../../pages/master-pages/discount-pages/AddDiscount'
import DNCDiscountList from '../../../pages/master-pages/dnc-discount-page/DNCDiscountList'
import { AddDNCDiscount } from '../../../pages/master-pages/dnc-discount-page/AddDNCDiscount'
import { EditDNCDiscount } from '../../../pages/master-pages/dnc-discount-page/EditDNCDiscount'

const DNCDiscountMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/dnc-discount/list'>
        <PageTitle>DNC Discount List</PageTitle>
        <DNCDiscountList />
      </Route>
      <Route path='/master/dnc-discount/add'>
        <PageTitle>Add DNC Discount</PageTitle>
        <AddDNCDiscount />
      </Route>
      <Route path='/master/dnc-discount/edit/:discountID'>
        <PageTitle>Edit DNC Discount</PageTitle>
        <EditDNCDiscount />
      </Route>
      <Redirect from='/master/dnc-discount' exact={true} to='/master/dnc-discount/list' />
      <Redirect to='/master/dnc-discount/list' />
    </Switch>
  )
}

export default DNCDiscountMasterPage
