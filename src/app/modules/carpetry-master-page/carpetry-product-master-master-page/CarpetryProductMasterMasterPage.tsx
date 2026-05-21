import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import CarpetryProductMasterList from '../../../pages/carperty-page/carpetry-product-master-page/CarpetryProductMasterList'
import {AddCarpetryProductMaster} from '../../../pages/carperty-page/carpetry-product-master-page/AddCarpetryProductMaster'
import {EditCarpetryProductMaster} from '../../../pages/carperty-page/carpetry-product-master-page/EditCarpetryProductMaster'
import CarpetryExcelAddProduct from '../../../pages/carperty-page/carpetry-product-master-page/CarpetryExcelAddProduct'
import CarpetyProductPhotosMaster from './carpetry-product-photos-master/CarpetyProductPhotosMaster'

const CarpetryProductMasterMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/carpetry/product-master/list'>
        <PageTitle>Carpetry Product Master List</PageTitle>
        <CarpetryProductMasterList />
      </Route>
      <Route path='/carpetry/product-master/add'>
        <PageTitle>Add Carpetry Product Master</PageTitle>
        <AddCarpetryProductMaster />
      </Route>
      <Route path='/carpetry/product-master/edit/:productMasterID'>
        <PageTitle>Edit Carpetry Product Master</PageTitle>
        <EditCarpetryProductMaster />
      </Route>
      <Route path='/carpetry/product-master/excel'>
        <PageTitle>Carpetry Excel</PageTitle>
        <CarpetryExcelAddProduct />
      </Route>
      <Route path='/carpetry/product-master/photos/:productMasterID'>
        <PageTitle>Photos</PageTitle>
        <CarpetyProductPhotosMaster />
      </Route>
      <Redirect from='/carpetry/product-master' exact={true} to='/carpetry/product-master/list' />
      <Redirect to='/carpetry/product-master/list' />
    </Switch>
  )
}

export default CarpetryProductMasterMasterPage
