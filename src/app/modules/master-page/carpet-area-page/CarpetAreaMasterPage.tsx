import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CarpetAreaListPage from '../../../pages/master-pages/carpet-area-pages/CarpetAreaListPage'
import { AddCarpetArea } from '../../../pages/master-pages/carpet-area-pages/AddCarpetArea'
import { EditCarpetArea } from '../../../pages/master-pages/carpet-area-pages/EditCarpetArea'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'CarpetArea',
    path: '/master/carpetArea/list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const CarpetAreaMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/carpetArea/list'>
        <PageTitle>Carpet Area List</PageTitle>
        <CarpetAreaListPage />
      </Route>
      <Route path='/master/carpetArea/add'>
        <PageTitle>Add Carpet Area</PageTitle>
        <AddCarpetArea />
      </Route>
      <Route path='/master/carpetArea/edit/:carpetAreaId'>
        <PageTitle>Edit Carpet Area</PageTitle>
        <EditCarpetArea />
      </Route>
      <Redirect from='/master/carpetArea' exact={true} to='/master/carpetArea/list' />
      <Redirect to='/master/carpetArea/list' />
    </Switch>
  )
}

export default CarpetAreaMasterPage
