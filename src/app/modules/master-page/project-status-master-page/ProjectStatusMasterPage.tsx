import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ProjectStatusList from '../../../pages/master-pages/project-status-pages/ProjectStatusList'
import AddProjectStatus from '../../../pages/master-pages/project-status-pages/AddProjectStatus'
import EditProjectStatus from '../../../pages/master-pages/project-status-pages/EditProjectStatus'

const ProjectStatusMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/projectstatus/list'>
        <PageTitle>Project Status List</PageTitle>
        <ProjectStatusList />
      </Route>
      <Route path='/master/projectstatus/add'>
        <PageTitle>Add Project Status</PageTitle>
        <AddProjectStatus />
      </Route>
      <Route path='/master/projectstatus/edit/:projectStuID'>
        <PageTitle>Edit Project Status</PageTitle>
        <EditProjectStatus />
      </Route>
      <Redirect from='/master/projectstatus' exact={true} to='/master/projectstatus/list' />
      <Redirect to='/master/projectstatus/list' />
    </Switch>
  )
}

export default ProjectStatusMasterPage
