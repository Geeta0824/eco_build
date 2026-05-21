import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CarpetryPackageList from '../../../pages/carperty-page/carpetry-package-master-page/CarpetryPackageList'
import {AddCarpetryPackage} from '../../../pages/carperty-page/carpetry-package-master-page/AddCarpetryPackage'
import {AddBHKMaster} from '../../../pages/master-pages/bhk-master-pages/AddBHKMaster'
import CardListCarpetryPackage from '../../../pages/carperty-page/carpetry-package-master-page/cart-item/CardListCarpetryPackage'
import PDFCarpetryPackage from '../../../pages/carperty-page/carpetry-package-master-page/PDFCarpetryPackage'
import CarpetryPackageByPackageID from '../../../pages/carperty-page/carpetry-package-master-page/cart-item/CarpetryPackageByPackageID'
import { CloneCarpetryPackage } from '../../../pages/carperty-page/carpetry-package-master-page/CloneCarpetryPackage'

// const cityBreadCrumbs: Array<PageLink> = [
//   {
//     title: 'carpetry',
//     path: '/carpetry/package-master/list',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: '',
//     path: '',
//     isSeparator: true,
//     isActive: false,
//   },
// ]

const CarpetryPackageMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/carpetry/carpetry-pkg-mst/list'>
        <PageTitle>Carpentry Package Master List</PageTitle>
        <CarpetryPackageList />
      </Route>
      <Route path='/carpetry/carpetry-pkg-mst/add'>
        <PageTitle>Add Carpentry Package Master</PageTitle>
        <AddCarpetryPackage />
      </Route>
      <Route path='/carpetry/carpetry-pkg-mst/add-cart/:packageID'>
        <PageTitle>Add Carpentry Package Cart</PageTitle>
        <CarpetryPackageByPackageID />
      </Route>
      <Route path='/carpetry/carpetry-pkg-mst/view-cart/:packageID'>
        <PageTitle>View Carpentry Package Master</PageTitle>
        <CardListCarpetryPackage />
      </Route>
      <Route path='/carpetry/carpetry-pkg-mst/pdf/:packageID'>
        <PageTitle>PDF Carpentry Package Master</PageTitle>
        <PDFCarpetryPackage />
      </Route>
      <Route path='/carpetry/carpetry-pkg-mst/admin-pdf/:packageID'>
        <PageTitle>PDF Carpentry Package Master</PageTitle>
        <PDFCarpetryPackage />
      </Route>
      <Route path='/carpetry/carpetry-pkg-mst/clone'>
        <PageTitle>Clone Carpentry Package Master</PageTitle>
        <CloneCarpetryPackage />
      </Route>
      <Redirect
        from='/carpetry/carpetry-pkg-mst'
        exact={true}
        to='/carpetry/carpetry-pkg-mst/list'
      />
      <Redirect to='/carpetry/carpetry-pkg-mst/list' />
    </Switch>
  )
}

export default CarpetryPackageMasterPage
