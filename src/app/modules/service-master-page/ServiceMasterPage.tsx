import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import ServiceList from '../../pages/service-page/ServiceList'
import AddServiceForm from '../../pages/service-page/AddServiceForm'
import EditServiceForm from '../../pages/service-page/EditServiceForm'

const ServiceMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/service/list'>
        <PageTitle>Service List</PageTitle>
        <ServiceList />
      </Route>
      <Route path='/service/add'>
        <PageTitle>Add Service</PageTitle>
        <AddServiceForm />
      </Route>
      <Route path='/service/edit/:id'>
        <PageTitle>Edit Service</PageTitle>
        <EditServiceForm />
      </Route>
      <Redirect from='/service' exact={true} to='/service/list' />
      <Redirect to='/service/list' />
    </Switch>
  )
}

export default ServiceMasterPage
