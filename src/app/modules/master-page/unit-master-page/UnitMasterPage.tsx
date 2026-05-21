import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import UnitListPage from '../../../pages/master-pages/unit-pages/UnitListPage'
import {AddUnit} from '../../../pages/master-pages/unit-pages/AddUnit'
import {EditUnit} from '../../../pages/master-pages/unit-pages/EditUnit'

const UnitMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/unit/list'>
        <PageTitle>Unit List</PageTitle>
        <UnitListPage />
      </Route>
      <Route path='/master/unit/add'>
        <PageTitle>Add Unit</PageTitle>
        <AddUnit />
      </Route>
      <Route path='/master/unit/edit/:unitId'>
        <PageTitle>Edit Unit</PageTitle>
        <EditUnit />
      </Route>
      <Redirect from='/master/unit' exact={true} to='/master/unit/list' />
      <Redirect to='/master/unit/list' />
    </Switch>
  )
}

export default UnitMasterPage
