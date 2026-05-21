import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ImpRemarksListPage from '../../../pages/projects-pages/imp-remarks-pages/ImpRemarksListPage'
import {AddImpRemarks} from '../../../pages/projects-pages/imp-remarks-pages/AddImpRemarks'
import {EditImpRemarks} from '../../../pages/projects-pages/imp-remarks-pages/EditImpRemarks'
const ImpRemarksMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/projects/project/edit/:projectID/imp-remarks/list'>
        <PageTitle>Vendor List</PageTitle>
        <ImpRemarksListPage />
      </Route>
      <Route path='/projects/project/edit/:projectID/imp-remarks/add'>
        <PageTitle>Add Vendor</PageTitle>
        <AddImpRemarks />
      </Route>
      <Route path='/projects/project/edit/:projectID/imp-remarks/edit/:projectVendorID'>
        <PageTitle>Edit Vendor</PageTitle>
        <EditImpRemarks />
      </Route>
      <Redirect
        from='/projects/project/edit/:projectID/imp-remarks'
        exact={true}
        to='/projects/project/edit/:projectID/imp-remarks/list'
      />
      <Redirect to='/projects/project/edit/:projectID/imp-remarks/list' />
    </Switch>
  )
}
export default ImpRemarksMasterPage
