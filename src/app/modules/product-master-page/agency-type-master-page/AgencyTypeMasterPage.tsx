import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import AgencyTypeList from '../../../pages/product-pages/agency-type-pages/AgencyTypeList'
import {AddAgencyType} from '../../../pages/product-pages/agency-type-pages/AddAgencyType'
import {EditAgencyType} from '../../../pages/product-pages/agency-type-pages/EditAgencyType'
import AgencyWorkStageMasterPage from './AgencyWorkStageMasterPage'

const AgencyTypeMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/p-product/agency-type/list'>
        <PageTitle>Agency Type List</PageTitle>
        <AgencyTypeList />
      </Route>
      <Route path='/p-product/agency-type/add'>
        <PageTitle>Add Agency Type</PageTitle>
        <AddAgencyType />
      </Route>
      <Route path='/p-product/agency-type/edit/:agencyTypeID/'>
        <PageTitle>Edit Agency Type</PageTitle>
        <EditAgencyType />
      </Route>
      <Route path='/p-product/agency-type/:agencyTypeId'>
        <PageTitle>Agency Work Stage Type</PageTitle>
        <AgencyWorkStageMasterPage />
      </Route>

      <Redirect from='/p-product/agency-type' exact={true} to='/p-product/agency-type/list' />
      <Redirect to='/p-product/agency-type/list' />
    </Switch>
  )
}

export default AgencyTypeMasterPage
