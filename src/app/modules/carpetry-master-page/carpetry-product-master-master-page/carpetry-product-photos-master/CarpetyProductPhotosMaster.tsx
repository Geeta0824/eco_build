import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../_Ecd/layout/core'// const stateBreadCrumbs: Array<PageLink> = [
import {PhotoCarpetryProduct} from '../../../../pages/carperty-page/carpetry-product-master-page/carpetry-product-photos/PhotoCarpetryProduct'
import AddPhotoCarpetryProduct from '../../../../pages/carperty-page/carpetry-product-master-page/carpetry-product-photos/AddPhotoCarpetryProduct'
import EditPhotoCarpetryProduct from '../../../../pages/carperty-page/carpetry-product-master-page/carpetry-product-photos/EditPhotoCarpetryProduct'
import ViewPhotoCarpetryProduct from '../../../../pages/carperty-page/carpetry-product-master-page/carpetry-product-photos/ViewPhotoCarpetryProduct'


const CarpetyProductPhotosMaster: React.FC = () => {
    return (
        <Switch>
            <Route path='/carpetry/product-master/photos/:productMasterID/list'>
                <PageTitle>Product Photos list</PageTitle>
                <PhotoCarpetryProduct />
            </Route>
            <Route path='/carpetry/product-master/photos/:productMasterID/add'>
                <PageTitle>Add Product Photos</PageTitle>
                <AddPhotoCarpetryProduct />
            </Route>
            <Route path='/carpetry/product-master/photos/:productMasterID/edit/:turnkeyProductImageID'>
                <PageTitle>Edit Product  Photos</PageTitle>
                <EditPhotoCarpetryProduct />
            </Route>
            {/* <Route path='/carpetry/product-master/photos/:productMasterID/view/:turnkeyProductImageID'>
                <PageTitle>View Photos Product</PageTitle>
                <ViewPhotoCarpetryProduct />
            </Route> */}
            <Redirect from='/carpetry/product-master/photos/:productMasterID' exact={true} to='/carpetry/product-master/photos/:productMasterID/list' />
            <Redirect to='/carpetry/product-master/photos/:productMasterID/list' />
        </Switch>
    )
}

export default CarpetyProductPhotosMaster;
