import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import PenaltyList from '../../pages/generate-penalty-pages/PenaltyList'
import { AddPenalty } from '../../pages/generate-penalty-pages/AddPenalty'
import { UpdatePenalty } from '../../pages/generate-penalty-pages/UpdatePenalty'

const GeneratePenaltyMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/generate-penalty/list'>
        <PageTitle>Generate Penalty List</PageTitle>
        <PenaltyList />
      </Route>
      <Route path='/generate-penalty/add'>
        <PageTitle>Add Generate Penalty</PageTitle>
        <AddPenalty />
      </Route>
      <Route path='/generate-penalty/edit/:penaltyID'>
        <PageTitle>Update Generate Penalty</PageTitle>
        <UpdatePenalty />
      </Route>
      <Redirect from='/generate-penalty' exact={true} to='/generate-penalty/list' />
      <Redirect to='/generate-penalty/list' />
    </Switch>
  )
}

export default GeneratePenaltyMasterPage
