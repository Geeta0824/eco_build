import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import ComplainExpireList from '../../../pages/master-pages/complain-expire-pages/ComplainExpireList'
import {AddComplainExpire} from '../../../pages/master-pages/complain-expire-pages/AddComplainExpire'
import {EditComplainExpire} from '../../../pages/master-pages/complain-expire-pages/EditComplainExpire'

const ComplainExpireMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/expire-complaint/list'>
        <PageTitle>Complaint Expire List</PageTitle>
        <ComplainExpireList />
      </Route>
      <Route path='/master/expire-complaint/add'>
        <PageTitle>Add Complaint Expire</PageTitle>
        <AddComplainExpire />
      </Route>
      <Route path='/master/expire-complaint/edit/:complainExpireID'>
        <PageTitle>Edit Complaint Expire</PageTitle>
        <EditComplainExpire />
      </Route>
      <Redirect from='/master/expire-complaint' exact={true} to='/master/expire-complaint/list' />
      <Redirect to='/master/expire-complaint/list' />
    </Switch>
  )
}

export default ComplainExpireMasterPage
