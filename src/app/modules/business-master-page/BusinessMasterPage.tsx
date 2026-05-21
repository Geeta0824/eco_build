import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import BusinessList from '../../pages/business/BusinessList'
import AddBusinessForm from '../../pages/business/AddBusinessForm'
import EditBusinessForm from '../../pages/business/EditBusinessForm'

const BusinessMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/business/list'>
        <PageTitle>Business List</PageTitle>
        <BusinessList />
      </Route>
      <Route path='/business/add'>
        <PageTitle>Add Business</PageTitle>
        <AddBusinessForm />
      </Route>
      <Route path='/business/edit/:id'>
        <PageTitle>Edit Business</PageTitle>
        <EditBusinessForm />
      </Route>
      <Redirect from='/business' exact={true} to='/business/list' />
      <Redirect to='/business/list' />
    </Switch>
  )
}

export default BusinessMasterPage
