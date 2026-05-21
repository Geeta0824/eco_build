import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import ProductMasterListPage from '../../../pages/product-pages/product-master-pages/ProductMasterListPage'
import {AddProductMaster} from '../../../pages/product-pages/product-master-pages/AddProductMaster'
import {EditProductMaster} from '../../../pages/product-pages/product-master-pages/EditProductMaster'
import ExcelAddProduct from '../../../pages/product-pages/product-master-pages/ExcelAddProduct'

const ProductMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/p-product/products/list'>
        <PageTitle>Product Master List</PageTitle>
        <ProductMasterListPage />
      </Route>
      <Route path='/p-product/products/add'>
        <PageTitle>Add Product Master</PageTitle>
        <AddProductMaster />
      </Route>
      <Route path='/p-product/products/edit/:productMasterID'>
        <PageTitle>Edit Product Master</PageTitle>
        <EditProductMaster />
      </Route>
      <Route path='/p-product/products/excel'>
        <PageTitle>Excel</PageTitle>
        <ExcelAddProduct />
      </Route>
      <Redirect from='/p-product/products' exact={true} to='/p-product/products/list' />
      <Redirect to='/p-product/products/list' />
    </Switch>
  )
}

export default ProductMasterPage
