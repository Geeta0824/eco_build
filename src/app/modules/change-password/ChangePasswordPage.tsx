import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_Ecd/layout/core'
import { ChangePassword } from '../../pages/change-password/ChangePassword'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Change Password',
    path: '/change/password',
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

const ChangePasswordPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/change/password'>
        <PageTitle>Change Password</PageTitle>
        <ChangePassword />
      </Route>
      {/* <Route path='/organization/customer/add'>
        <PageTitle>Add Customer</PageTitle>
        <AddCustomer />
      </Route>
      <Route path='/organization/customer/edit'>
        <PageTitle>Edit Customer</PageTitle>
        <EditCustomer />
      </Route> */}
      <Redirect from='/change/password' exact={true} to='/change/password' />
      <Redirect to='/change/password' />
    </Switch>
  )
}

export default ChangePasswordPage
