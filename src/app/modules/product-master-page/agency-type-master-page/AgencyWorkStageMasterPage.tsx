import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'

import AgencyWorkStageList from '../../../pages/product-pages/agency-type-pages/agencyWorkStage/AgencyWorkStageList'
// import {AgencyWorkStageHeader} from './AgencyWorkStageHeader'
import {AddAgencyWorkStage} from '../../../pages/product-pages/agency-type-pages/agencyWorkStage/AddAgencyWorkStage'
import {EditAgencyWorkStage} from '../../../pages/product-pages/agency-type-pages/agencyWorkStage/EditAgencyWorkStage'
import AgencyTypeMaterialInfo from '../../../pages/product-pages/agency-type-pages/agencyWorkStage/agency-type-material/AgencyTypeMaterialInfo'

const AgencyWorkStageMasterPage: React.FC = () => {
  return (
    <>
      {/* <AgencyWorkStageHeader /> */}
      <Switch>
        <Route path='/p-product/agency-type/:agencyTypeId/list'>
          <PageTitle>Agency Work Stage List</PageTitle>
          <AgencyWorkStageList />
        </Route>
        <Route path='/p-product/agency-type/:agencyTypeId/add'>
          <PageTitle>Add Agency Work Stage</PageTitle>
          <AddAgencyWorkStage />
        </Route>
        <Route path='/p-product/agency-type/:agencyTypeId/edit'>
          <PageTitle>Edit Agency Work Stage</PageTitle>
          <EditAgencyWorkStage />
        </Route>
        <Route path='/p-product/agency-type/:agencyTypeId/material'>
          <PageTitle>Material Info</PageTitle>
          <AgencyTypeMaterialInfo />
        </Route>
        <Redirect
          from='/p-product/agency-type/:agencyTypeId'
          exact={true}
          to='/p-product/agency-type/:agencyTypeId/list'
        />
        <Redirect to='/p-product/agency-type/:agencyTypeId/list' />
      </Switch>
    </>
  )
}

export default AgencyWorkStageMasterPage
