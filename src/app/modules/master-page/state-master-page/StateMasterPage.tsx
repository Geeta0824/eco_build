import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import StateListPage from '../../../pages/master-pages/state-pages/StateListPage'
import { AddState } from '../../../pages/master-pages/state-pages/AddState'
import { EditState } from '../../../pages/master-pages/state-pages/EditState'

const stateBreadCrumbs: Array<PageLink> = [
  {
    title: 'State',
    path: '/master/state/list',
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

const StateMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/state/list'>
        <PageTitle>State List</PageTitle>
        <StateListPage />
      </Route>
      <Route path='/master/state/add'>
        <PageTitle>Add State</PageTitle>
        <AddState />
      </Route>
      <Route path='/master/state/edit/:stateid'>
        <PageTitle>Edit State</PageTitle>
        <EditState />
      </Route>
      <Redirect from='/master/state' exact={true} to='/master/state/list' />
      <Redirect to='/master/state/list' />
    </Switch>
  )
}

export default StateMasterPage
