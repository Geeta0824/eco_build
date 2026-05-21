import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import {PMCAssignRequestList} from '../../../../pages/projects-pages/project-page/pmc-assign-req-page/PMCAssignRequestList'

const PMCAssignRequestMasterPage: React.FC = () => {
  return (
    <>
      {/* <ProjectHeader /> */}
      <Switch>
        <Route path='/projects/project/pmc-assign-req/:projectID/list'>
          <PageTitle>PMC Assign Request</PageTitle>
          <PMCAssignRequestList />
        </Route>
        <Redirect
          from='/projects/project/pmc-assign-req'
          exact={true}
          to='/projects/project/pmc-assign-req/:projectID/list'
        />
        <Redirect to='/projects/project/pmc-assign-req/:projectID/list' />
      </Switch>
    </>
  )
}
export default PMCAssignRequestMasterPage
