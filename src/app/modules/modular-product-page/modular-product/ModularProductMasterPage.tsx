import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import ModularProductList from '../../../pages/modular-product-pages/modular-product/ModularProductList'
import {AddModularProduct} from '../../../pages/modular-product-pages/modular-product/AddModularProduct'
import {EditModularProduct} from '../../../pages/modular-product-pages/modular-product/EditModularProduct'
import ExcelAddModularProduct from '../../../pages/modular-product-pages/modular-product/ExcelAddModularProduct'

const ModularProductMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/module/products/list'>
        <PageTitle>Modular Product List</PageTitle>
        <ModularProductList />
      </Route>
      <Route path='/module/products/add'>
        <PageTitle>Add Modular Product</PageTitle>
        <AddModularProduct />
      </Route>
      <Route path='/module/products/edit/:productMasterID'>
        <PageTitle>Edit Modular Product</PageTitle>
        <EditModularProduct />
      </Route>
      <Route path='/module/products/excel'>
        <PageTitle>Modular Product Excel</PageTitle>
        <ExcelAddModularProduct />
      </Route>
      <Redirect from='/module/products' exact={true} to='/module/products/list' />
      <Redirect to='/module/products/list' />
    </Switch>
  )
}

export default ModularProductMasterPage
