import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import AddProjectForm from '../../pages/project-page/AddProjectForm'
import EditProjectForm from '../../pages/project-page/EditProjectForm'
import ProjectList from '../../pages/project-page/ProjectList'

const ProjectsMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/project/list'>
        <PageTitle>Projects List</PageTitle>
        <ProjectList />
      </Route>
      <Route path='/project/add'>
        <PageTitle>Add Projects</PageTitle>
        <AddProjectForm />
      </Route>
      <Route path='/project/edit/:id'>
        <PageTitle>Edit Projects</PageTitle>
        <EditProjectForm />
      </Route>
      <Redirect from='/project' exact={true} to='/project/list' />
      <Redirect to='/project/list' />
    </Switch>
  )
}

export default ProjectsMasterPage
