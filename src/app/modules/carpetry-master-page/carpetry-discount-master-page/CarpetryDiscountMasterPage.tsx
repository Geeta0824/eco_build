import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import CarpetryDiscountListPage from '../../../pages/carperty-page/carpetry-discount-pages/CarpetryDiscountListPage'
import {EditCarpetryDiscount} from '../../../pages/carperty-page/carpetry-discount-pages/EditCarpetryDiscount'
import {AddCarpetryDiscount} from '../../../pages/carperty-page/carpetry-discount-pages/AddCarpetryDiscount'

const CarpetryDiscountMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/carpetry/discount/list'>
        <PageTitle>Carpentry Discount List</PageTitle>
        <CarpetryDiscountListPage />
      </Route>
      <Route path='/carpetry/discount/add'>
        <PageTitle>Add Carpentry Discount</PageTitle>
        <AddCarpetryDiscount />
      </Route>
      <Route path='/carpetry/discount/edit/:discountId'>
        <PageTitle>Edit Carpentry Discount</PageTitle>
        <EditCarpetryDiscount />
      </Route>
      <Redirect from='/carpetry/discount' exact={true} to='/carpetry/discount/list' />
      <Redirect to='/master/discount/list' />
    </Switch>
  )
}

export default CarpetryDiscountMasterPage
