import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import {ProjectAlbumList} from '../../../../pages/projects-pages/project-page/album-pages/ProjectAlbumList'
import AddProjectAlbum from '../../../../pages/projects-pages/project-page/album-pages/AddProjectAlbum'
import EditProjectAlbum from '../../../../pages/projects-pages/project-page/album-pages/EditProjectAlbum'
import AddProjectAlbumImage from '../../../../pages/projects-pages/project-page/album-pages/AddProjectAlbumImage'
import {ProjectAllAlbumImage} from '../../../../pages/projects-pages/project-page/album-pages/ProjectAllAlbumImage'
import SimpleHeader from '../simple-header/SimpleHeader'
const PhotoAlbumMasterPage: React.FC = () => {
  return (
    <>
      <SimpleHeader />
      <Switch>
        <Route path='/projects/project/album/list'>
          <PageTitle>Album List</PageTitle>
          <ProjectAlbumList />
        </Route>
        <Route path='/projects/project/album/add'>
          <PageTitle>Add Album</PageTitle>
          <AddProjectAlbum />
        </Route>
        <Route path='/projects/project/album/edit/:albumId'>
          <PageTitle>Edit Album</PageTitle>
          <EditProjectAlbum />
        </Route>
        <Route path='/projects/project/album/addImg'>
          <PageTitle>Add Album Image</PageTitle>
          <AddProjectAlbumImage />
        </Route>
        <Route path='/projects/project/album/imgList'>
          <PageTitle>Album Photo List</PageTitle>
          <ProjectAllAlbumImage />
        </Route>
        <Redirect from='/projects/project/album' exact={true} to='/projects/project/album/list' />
        <Redirect to='/projects/project/album/list' />
      </Switch>
    </>
  )
}
export default PhotoAlbumMasterPage
