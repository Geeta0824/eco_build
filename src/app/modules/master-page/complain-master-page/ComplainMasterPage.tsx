import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'

import ComplainList from '../../../pages/master-pages/complain-master-page/ComplainList'
import AddComplain from '../../../pages/master-pages/complain-master-page/AddComplain'
import EditComplain from '../../../pages/master-pages/complain-master-page/EditComplain'

const ComplainMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/complaints/list'>
        <PageTitle>Complaint List</PageTitle>
        <ComplainList />
      </Route>
      <Route path='/master/complaints/add'>
        <PageTitle>Add Complaint</PageTitle>
        <AddComplain />
      </Route>
      <Route path='/master/complaints/edit/:complainID'>
        <PageTitle>Edit Complaint</PageTitle>
        <EditComplain />
      </Route>
      <Redirect from='/master/complaints' exact={true} to='/master/complaints/list' />
      <Redirect to='/master/complaints/list' />
    </Switch>
  )
}

export default ComplainMasterPage
