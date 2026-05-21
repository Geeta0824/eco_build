import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {AddProject} from '../../../pages/projects-pages/project-page/AddProject'
import ProjectList from '../../../pages/projects-pages/project-page/ProjectList'
import EditProjectMasterPage from './EditProjectMasterPage'
import Additional_DeductionItemServiceMaster from './add-ded-item-service-master-page/Additional_DeductionItemServiceMaster'
import InvoiceMastePager from './invoice-master/InvoiceMastePager'
import _3DPhotosMasterPage from './_3d-photos-master-pages/_3DPhotosMasterPage'
import PMCAssignRequestMasterPage from './pmc-assign-req-master-pages/PMCAssignRequestMasterPage'
import ProjectDocumentMasterPage from './project-document-pages/ProjectDocumentMasterPage'
import PhotoAlbumMasterPage from './photo-album-pages/PhotoAlbumMasterPage'

const ProjectMasterPage: React.FC = () => {
  return (
    <>
      <Switch>
        <Route path='/projects/project/list'>
          <PageTitle>Project List</PageTitle>
          <ProjectList />
        </Route>
        <Route path='/projects/project/add'>
          <PageTitle>Add Project</PageTitle>
          <AddProject />
        </Route>
        <Route path='/projects/project/edit'>
          <PageTitle>Edit Project</PageTitle>
          <EditProjectMasterPage />
        </Route>
        <Route path='/projects/project/add-ded'>
          <PageTitle>Additional Item</PageTitle>
          <Additional_DeductionItemServiceMaster />
        </Route>
        <Route path='/projects/project/invoice'>
          <PageTitle>Invoice</PageTitle>
          <InvoiceMastePager />
        </Route>
        <Route path='/projects/project/photos'>
          <PageTitle>3D Photos</PageTitle>
          <_3DPhotosMasterPage />
        </Route>
        <Route path='/projects/project/pmc-assign-req'>
          <PageTitle>PMC Assign</PageTitle>
          <PMCAssignRequestMasterPage />
        </Route>
        <Route path='/projects/project/proj-document'>
          <PageTitle>Project Document</PageTitle>
          <ProjectDocumentMasterPage />
        </Route>
        <Route path='/projects/project/album'>
          <PageTitle>Album</PageTitle>
          <PhotoAlbumMasterPage />
        </Route>
        <Redirect from='/projects/project/' exact={true} to='/projects/project/list' />
        <Redirect to='/projects/project/list' />
      </Switch>
    </>
  )
}
export default ProjectMasterPage
