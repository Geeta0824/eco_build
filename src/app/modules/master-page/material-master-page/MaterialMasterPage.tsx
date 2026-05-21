import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import {PageTitle } from '../../../../_Ecd/layout/core'// const stateBreadCrumbs: Array<PageLink> = [
import MaterialPageList from '../../../pages/master-pages/material-pages/MaterialPageList'
import AddMaterialPage from '../../../pages/master-pages/material-pages/AddMaterialPage'
import EditMaterialPage from '../../../pages/master-pages/material-pages/EditMaterialPage'


const MaterialMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/master/material/list'>
                <PageTitle>Material List</PageTitle>
                <MaterialPageList />
            </Route>
            <Route path='/master/material/add'>
                <PageTitle>Add Material</PageTitle>
                <AddMaterialPage />
            </Route>
            <Route path='/master/material/edit/:materialInfoID'>
                <PageTitle>Edit Material</PageTitle>
                <EditMaterialPage />
            </Route>
            <Redirect from='/master/material' exact={true} to='/master/material/list' />
            <Redirect to='/master/material/list' />
        </Switch>
    )
}

export default MaterialMasterPage;
