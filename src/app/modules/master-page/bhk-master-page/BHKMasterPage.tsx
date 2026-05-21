import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import BHKMasterListPage from '../../../pages/master-pages/bhk-master-pages/BHKMasterListPage'
import { AddBHKMaster } from '../../../pages/master-pages/bhk-master-pages/AddBHKMaster'
import { EditBHKMaster } from '../../../pages/master-pages/bhk-master-pages/EditBHKMaster'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'bhkMaster',
    path: '/master/bhkMaster/list',
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

const BHKMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/bhkMaster/list'>
        <PageTitle>BHK Master List</PageTitle>
        <BHKMasterListPage />
      </Route>
      <Route path='/master/bhkMaster/add'>
        <PageTitle>Add BHK Master</PageTitle>
        <AddBHKMaster />
      </Route>
      <Route path='/master/bhkMaster/edit/:bhkId'>
        <PageTitle>Edit BHK Master</PageTitle>
        <EditBHKMaster />
      </Route>
      <Redirect from='/master/bhkMaster' exact={true} to='/master/bhkMaster/list' />
      <Redirect to='/master/bhkMaster/list' />
    </Switch>
  )
}

export default BHKMasterPage
