import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import Nationality from '../../../pages/master-pages/nationality-pages/Nationality'
import {AddNationality} from '../../../pages/master-pages/nationality-pages/AddNationality'
import {EditNationality} from '../../../pages/master-pages/nationality-pages/EditNationality'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Nationality',
    path: '/master/nationality/list',
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

const NationalityMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/nationality/list'>
        <PageTitle>Nationality List</PageTitle>
        <Nationality />
      </Route>
      <Route path='/master/nationality/add'>
        <PageTitle>Add Nationality</PageTitle>
        <AddNationality />
      </Route>
      <Route path='/master/nationality/edit/:nationaId'>
        <PageTitle>Edit Nationality</PageTitle>
        <EditNationality />
      </Route>
      <Redirect from='/master/nationality' exact={true} to='/master/nationality/list' />
      <Redirect to='/master/nationality/list' />
    </Switch>
  )
}

export default NationalityMasterPage
