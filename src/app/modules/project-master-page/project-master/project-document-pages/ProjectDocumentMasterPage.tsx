import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import {ProjectDocumentList} from '../../../../pages/projects-pages/project-page/project-document-pages/ProjectDocumentList'
import AddProjectDocument from '../../../../pages/projects-pages/project-page/project-document-pages/AddProjectDocument'
import EditProjectDocument from '../../../../pages/projects-pages/project-page/project-document-pages/EditProjectDocument'
import SimpleHeader from '../simple-header/SimpleHeader'
const ProjectDocumentMasterPage: React.FC = () => {
  return (
    <>
      <SimpleHeader />
      <Switch>
        <Route path='/projects/project/proj-document/list'>
          <PageTitle>Project Document List</PageTitle>
          <ProjectDocumentList />
        </Route>
        <Route path='/projects/project/proj-document/add'>
          <PageTitle>Add Project Document</PageTitle>
          <AddProjectDocument />
        </Route>
        <Route path='/projects/project/proj-document/edit/:projDocID'>
          <PageTitle>Edit Project Document</PageTitle>
          <EditProjectDocument />
        </Route>

        <Redirect
          from='/projects/project/proj-document'
          exact={true}
          to='/projects/project/proj-document/list'
        />
        <Redirect to='/projects/project/proj-document/list' />
      </Switch>
    </>
  )
}
export default ProjectDocumentMasterPage
