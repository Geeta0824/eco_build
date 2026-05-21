import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import PenaltyTypeList from '../../../pages/master-pages/penalty-type-pages/PenaltyTypeList'
import AddPenaltyType from '../../../pages/master-pages/penalty-type-pages/AddPenaltyType'
import EditPenaltyType from '../../../pages/master-pages/penalty-type-pages/EditPenaltyType'

const PenaltyTypeMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/penalty-type/list'>
        <PageTitle>Penalty Type List</PageTitle>
        <PenaltyTypeList />
      </Route>
      <Route path='/master/penalty-type/add'>
        <PageTitle>Add Penalty Type</PageTitle>
        <AddPenaltyType />
      </Route>
      <Route path='/master/penalty-type/edit/:penaltyTypeId'>
        <PageTitle>Edit Penalty Type</PageTitle>
        <EditPenaltyType />
      </Route>
      <Redirect from='/master/penalty-type' exact={true} to='/master/penalty-type/list' />
      <Redirect to='/master/penalty-type/list' />
    </Switch>
  )
}

export default PenaltyTypeMasterPage
