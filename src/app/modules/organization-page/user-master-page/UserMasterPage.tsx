import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import User from '../../../pages/organization-page/user-master/User'
import {AddUser} from '../../../pages/organization-page/user-master/AddUser'
import {EditUser} from '../../../pages/organization-page/user-master/EditUser'
import {ViewUserDetails} from '../../../pages/organization-page/user-master/ViewUserDetails'
import ResetPassword from '../../../pages/organization-page/user-master/ResetPassword'

const UserMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/user/list'>
        <PageTitle>User List</PageTitle>
        <User />
      </Route>
      <Route path='/organization/user/add'>
        <PageTitle>Add User</PageTitle>
        <AddUser />
      </Route>
      <Route path='/organization/user/edit/:userid'>
        <PageTitle>Edit User</PageTitle>
        <EditUser />
      </Route>
      <Route path='/organization/user/view/:userID'>
        <PageTitle>View User</PageTitle>
        <ViewUserDetails />
      </Route>
      <Route path='/organization/user/resetPassword/:userid'>
        <PageTitle>Reset Password</PageTitle>
        <ResetPassword />
      </Route>
      <Redirect from='/organization/user' exact={true} to='/organization/user/list' />
      <Redirect to='/organization/user/list' />
    </Switch>
  )
}

export default UserMasterPage
