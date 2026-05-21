import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import StageInfoList from '../../../pages/projects-pages/stage-info-pages/StageInfoList'
import StageInfoDetailsList from '../../../pages/projects-pages/stage-info-pages/StageInfoDetailsList'
const StageInfoMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/projects/project/edit/:projectID/stage-info/list'>
        <PageTitle>Stage List</PageTitle>
        <StageInfoList />
      </Route>
      <Route path='/projects/project/edit/:projectID/stage-info/details'>
        <PageTitle>Stage Info List</PageTitle>
        <StageInfoDetailsList />
      </Route>
      <Redirect
        from='/projects/project/edit/:projectID/stage-info'
        exact={true}
        to='/projects/project/edit/:projectID/stage-info/list'
      />
      <Redirect to='/projects/project/edit/:projectID/stage-info/list' />
    </Switch>
  )
}
export default StageInfoMasterPage
