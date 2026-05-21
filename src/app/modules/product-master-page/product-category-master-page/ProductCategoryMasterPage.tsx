import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import ProductCategoryListPage from '../../../pages/product-pages/product-category-master-page/ProductCategoryListPage'
import { AddProductCategory } from '../../../pages/product-pages/product-category-master-page/AddProductCategory'
import { EditProductCategory } from '../../../pages/product-pages/product-category-master-page/EditProductCategory'

const ProductCategoryMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/p-product/product-category/list'>
        <PageTitle>Product Area List</PageTitle>
        <ProductCategoryListPage />
      </Route>
      <Route path='/p-product/product-category/add'>
        <PageTitle>Add Product Area</PageTitle>
        <AddProductCategory />
      </Route>
      <Route path='/p-product/product-category/edit/:productCategoryId'>
        <PageTitle>Edit Product Area</PageTitle>
        <EditProductCategory />
      </Route>
      <Redirect
        from='/p-product/product-category'
        exact={true}
        to='/p-product/product-category/list'
      />
      <Redirect to='/p-product/product-category/list' />
    </Switch>
  )
}

export default ProductCategoryMasterPage
