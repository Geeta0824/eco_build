import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import Branch from '../../../pages/master-pages/branch-pages/Branch'
import { EditBranch } from '../../../pages/master-pages/branch-pages/EditBranch'
import { AddBranch } from '../../../pages/master-pages/branch-pages/AddBranch'

const BranchMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/branch/list'>
        <PageTitle>Branch List</PageTitle>
        <Branch />
      </Route>
      <Route path='/master/branch/add'>
        <PageTitle>Add Branch</PageTitle>
        <AddBranch />
      </Route>
      <Route path='/master/branch/edit/:branchid'>
        <PageTitle>Edit Branch</PageTitle>
        <EditBranch />
      </Route>
      <Redirect from='/master/branch' exact={true} to='/master/branch/list' />
      <Redirect to='/master/branch/list' />
    </Switch>
  )
}

export default BranchMasterPage
