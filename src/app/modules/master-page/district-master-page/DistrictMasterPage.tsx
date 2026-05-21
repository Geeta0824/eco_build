import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddDistrict} from '../../../pages/master-pages/district-pages/AddDistrict'
import {EditDistrict} from '../../../pages/master-pages/district-pages/EditDistrict'
import DistrictListPage from '../../../pages/master-pages/district-pages/DistrictListPage'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'District',
    path: '/master/district/list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const DistrictMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/district/list'>
        <PageTitle>District List</PageTitle>
        <DistrictListPage />
      </Route>
      <Route path='/master/district/add'>
        <PageTitle>Add District</PageTitle>
        <AddDistrict />
      </Route>
      <Route path='/master/district/edit/:districtid'>
        <PageTitle>Edit District</PageTitle>
        <EditDistrict />
      </Route>
      <Redirect from='/master/district' exact={true} to='/master/district/list' />
      <Redirect to='/master/district/list' />
    </Switch>
  )
}

export default DistrictMasterPage
