import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {OpenProjectListPage} from '../../../pages/master-pages/vender-pages/OpenProjectListPage'
import { ProjectListHeader } from './projectListHeader'
import {CloseProjectListPage} from '../../../pages/master-pages/vender-pages/CloseProjectListPage'

// const stateBreadCrumbs: Array<PageLink> = [
//   {
//     title: 'State',
//     path: '/master/state/list',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: '',
//     path: '',
//     isSeparator: true,
//     isActive: false,
//   },
// ]

const VendorProjectMasterPage: React.FC = () => {
  return (
    <>
      <ProjectListHeader />
      <Switch>
        <Route path='/master/vender/project/:vendorID/open'>
          <PageTitle>Open Project List</PageTitle>
          <OpenProjectListPage />
        </Route>
        <Route path='/master/vender/project/:vendorID/close'>
          <PageTitle>Close Project List</PageTitle>
          <CloseProjectListPage />
        </Route>
        <Redirect from='/master/vender' exact={true} to='/master/vender/list' />
        <Redirect to='/master/vender/list' />
      </Switch>
    </>
  )
}

export default VendorProjectMasterPage
