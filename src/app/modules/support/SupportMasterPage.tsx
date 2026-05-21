import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_Ecd/layout/core'
import SupportList from '../../pages/support-page/SupportList'
import { AddSupport } from '../../pages/support-page/AddSupport'

const SupportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/support/list'>
        <PageTitle>Support List</PageTitle>
        <SupportList />
      </Route>
      <Route path='/support/add'>
        <PageTitle>Add Support</PageTitle>
        <AddSupport/>
      </Route>
      
      <Redirect from='/support' exact={true} to='/support/list' />
      <Redirect to='/support/list' />
    </Switch>
  )
}

export default SupportMasterPage
