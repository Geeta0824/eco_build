import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {EditProject} from '../../../pages/projects-pages/project-page/EditProject'
import ProjectHeader from './ProjectHeader'
import PaymentStructureMasterPage from '../../project-master-page/payment-structure-master-page/PaymentStructureMasterPage'
import VendorMasterPage from '../vendor-Master-page/VendorMasterPage'
import ImpRemarksMasterPage from '../imp-remarks/ImpRemarksMasterPage'
import StageInfoMasterPage from '../stage-info/StageInfoMasterPage'

const EditProjectMasterPage: React.FC = () => {
  return (
    <>
      <ProjectHeader />
      <Switch>
        <Route path='/projects/project/edit/:projectID/edit'>
          <PageTitle>Edit Project</PageTitle>
          <EditProject />
        </Route>
        <Route path='/projects/project/edit/:projectID/paymentstructure'>
          <PageTitle>Project Structure</PageTitle>
          <PaymentStructureMasterPage />
        </Route>
        <Route path='/projects/project/edit/:projectID/vendor'>
          <PageTitle>Vendor</PageTitle>
          <VendorMasterPage />
        </Route>
        <Route path='/projects/project/edit/:projectID/imp-remarks'>
          <PageTitle>IMP Remarks</PageTitle>
          <ImpRemarksMasterPage />
        </Route>
        <Route path='/projects/project/edit/:projectID/stage-info'>
          <PageTitle>Stage Info</PageTitle>
          <StageInfoMasterPage />
        </Route>

        <Redirect
          from='/projects/project/edit'
          exact={true}
          to='/projects/project/edit/:projectID/edit'
        />
        <Redirect to='/projects/project/edit/:projectID/edit' />
      </Switch>
    </>
  )
}
export default EditProjectMasterPage
