import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import {_3DPhotosListPage} from '../../../../pages/projects-pages/project-page/_3d-photos-pages/_3DPhotosListPage'
import Add3DPhotosPage from '../../../../pages/projects-pages/project-page/_3d-photos-pages/Add3DPhotosPage'
import Edit3DPhotosPage from '../../../../pages/projects-pages/project-page/_3d-photos-pages/Edit3DPhotosPage'
import SimpleHeader from '../simple-header/SimpleHeader'
const _3DPhotosMasterPage: React.FC = () => {
  return (
    <>
      <SimpleHeader />
      <Switch>
        <Route path='/projects/project/photos/list'>
          <PageTitle>3D Photos List</PageTitle>
          <_3DPhotosListPage />
        </Route>
        <Route path='/projects/project/photos/add'>
          <PageTitle>Add 3D Photos</PageTitle>
          <Add3DPhotosPage />
        </Route>
        <Route path='/projects/project/photos/edit/:projectImageID'>
          <PageTitle>Edit 3D Photos</PageTitle>
          <Edit3DPhotosPage />
        </Route>

        <Redirect from='/projects/project/photos' exact={true} to='/projects/project/photos/list' />
        <Redirect to='/projects/project/photos/list' />
      </Switch>
    </>
  )
}
export default _3DPhotosMasterPage
