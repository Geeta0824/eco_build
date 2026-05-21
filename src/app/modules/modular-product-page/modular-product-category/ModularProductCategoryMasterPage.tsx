import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddModularProductCategory} from '../../../pages/modular-product-pages/modular-product-category/AddModularProductCategory'
import {EditMoudlarProductCategory} from '../../../pages/modular-product-pages/modular-product-category/EditMoudlarProductCategory'
import ProductModularCategoryList from '../../../pages/modular-product-pages/modular-product-category/ProductModularCategoryList'

const ModularProductCategoryMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/module/product-category/list'>
        <PageTitle>Modular Product Category List</PageTitle>
        <ProductModularCategoryList />
      </Route>
      <Route path='/module/product-category/add'>
        <PageTitle>Add Modular Product Category</PageTitle>
        <AddModularProductCategory />
      </Route>
      <Route path='/module/product-category/edit/:productCategoryId'>
        <PageTitle>Edit Modular Product Category</PageTitle>
        <EditMoudlarProductCategory />
      </Route>
      <Redirect from='/module/product-category' exact={true} to='/module/product-category/list' />
      <Redirect to='/module/product-category/list' />
    </Switch>
  )
}

export default ModularProductCategoryMasterPage
