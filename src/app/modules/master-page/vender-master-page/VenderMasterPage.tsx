import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import VenderList from '../../../pages/master-pages/vender-pages/VenderList'
import AddVender from '../../../pages/master-pages/vender-pages/AddVender'
import EditVenderPaystrMasterPage from './payment-structure-master-page/EditVenderPaystrMasterPage'
import EditVendorMasterPage from './EditVendorMasterPage'
import {ViewVendor} from '../../../pages/master-pages/vender-pages/ViewVendor'
import AgencyListPage from '../../../pages/master-pages/vender-pages/AgencyListPage'
import VendorProjectMasterPage from './VendorProjectMasterPage'
import {VendorChangePassword} from '../../../pages/master-pages/vender-pages/VendorChangePassword'

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

const VenderMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/vender/list'>
        <PageTitle>Vendor List</PageTitle>
        <VenderList />
      </Route>
      <Route path='/vender/add'>
        <PageTitle>Add Vendor</PageTitle>
        <AddVender />
      </Route>
      <Route path='/vender/edit/:vendorID'>
        <PageTitle>Edit Vendor</PageTitle>
        <EditVendorMasterPage />
      </Route>
      <Route path='/vender/change-password'>
        <PageTitle>Change Password</PageTitle>
        <VendorChangePassword />
      </Route>
      <Route path='/vender/view/:vendorID'>
        <PageTitle>View Vendor</PageTitle>
        <ViewVendor />
      </Route>
      <Route path='/vender/pay-str/:vendorID'>
        <PageTitle>Payment Structure</PageTitle>
        <EditVenderPaystrMasterPage />
      </Route>
      <Route path='/vender/agency-list/:vendorID'>
        <PageTitle>Agency List</PageTitle>
        <AgencyListPage />
      </Route>
      <Route path='/vender/project/:vendorID'>
        <PageTitle>Vendor Project List</PageTitle>
        <VendorProjectMasterPage />
      </Route>
      <Redirect from='/vender' exact={true} to='/vender/list' />
      <Redirect to='/vender/list' />
    </Switch>
  )
}

export default VenderMasterPage
