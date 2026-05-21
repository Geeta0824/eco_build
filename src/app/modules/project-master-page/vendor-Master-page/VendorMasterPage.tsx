import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {ProjectVendorList} from '../../../pages/projects-pages/vendor-pages/ProjectVendorList'
import {EditProjectVendor} from '../../../pages/projects-pages/vendor-pages/EditProjectVendor'
import {AddProjectVendor} from '../../../pages/projects-pages/vendor-pages/AddProjectVendor'
import {AddProjectVendorOld} from '../../../pages/projects-pages/vendor-pages/AddProjectVendorOld'
const VendorMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/projects/project/edit/:projectID/vendor/list'>
        <PageTitle>Vendor List</PageTitle>
        <ProjectVendorList />
      </Route>
      <Route path='/projects/project/edit/:projectID/vendor/add'>
        <PageTitle>Add Vendor</PageTitle>
        <AddProjectVendor />
        {/* <AddProjectVendorOld /> */}
      </Route>
      <Route path='/projects/project/edit/:projectID/vendor/edit/:projectVendorID'>
        <PageTitle>Edit Vendor</PageTitle>
        <EditProjectVendor />
      </Route>
      <Redirect
        from='/projects/project/edit/:projectID/vendor'
        exact={true}
        to='/projects/project/edit/:projectID/vendor/list'
      />
      <Redirect to='/projects/project/edit/:projectID/vendor/list' />
    </Switch>
  )
}
export default VendorMasterPage
