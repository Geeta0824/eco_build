import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import { AddDesignation } from '../../../pages/master-pages/designation-pages/AddDesignation'
import Designation from '../../../pages/master-pages/designation-pages/Designation'
import { EditDesignation } from '../../../pages/master-pages/designation-pages/EditDesignation'

const DesignationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/designation/list'>
        <PageTitle>Designation List</PageTitle>
        <Designation />
      </Route>
      <Route path='/master/designation/add'>
        <PageTitle>Add Designation</PageTitle>
        <AddDesignation />
      </Route>
      <Route path='/master/designation/edit/:degignaId'>
        <PageTitle>Edit Designation</PageTitle>
        <EditDesignation />
      </Route>
      <Redirect from='/master/designation' exact={true} to='/master/designation/list' />
      <Redirect to='/master/designation/list' />
    </Switch>
  )
}

export default DesignationMasterPage
