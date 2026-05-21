import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_Ecd/layout/core'
import {AddPackage} from '../../pages/package-pages/AddPackage'
import PackageListPage from '../../pages/package-pages/PackageListPage'
import PackageByPackageID from '../../pages/package-pages/cart-items/PackageByPackageID'
import CartListPackage from '../../pages/package-pages/cart-items/CartListPackage'
import PDFPackage from '../../pages/package-pages/PDFPackage'

const PackageMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/package/list'>
        <PageTitle>Package Master List</PageTitle>
        <PackageListPage />
      </Route>
      <Route path='/package/add'>
        <PageTitle>Add Package Master</PageTitle>
        <AddPackage />
      </Route>
      <Route path='/package/add-cart/:packageID'>
        <PageTitle>Add Package Cart</PageTitle>
        <PackageByPackageID />
      </Route>
      <Route path='/package/view-cart/:packageID'>
        <PageTitle>View Package Master</PageTitle>
        <CartListPackage />
      </Route>
      <Route path='/package/pdf/:packageID'>
        <PageTitle>PDF Package Master</PageTitle>
        <PDFPackage />
      </Route>
      <Route path='/package/admin-pdf/:packageID'>
        <PageTitle>PDF Package Master</PageTitle>
        <PDFPackage />
      </Route>
      <Redirect from='/package' exact={true} to='/package/list' />
      <Redirect to='/package/list' />
    </Switch>
  )
}

export default PackageMasterPage
