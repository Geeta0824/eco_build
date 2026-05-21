import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {WorkOrderRequestList} from '../../../pages/projects-pages/work-order-request/WorkOrderRequestList'
import {WorkOrderRequestAdd} from '../../../pages/projects-pages/work-order-request/WorkOrderRequestAdd'
import {WorkOrderRequestUpdate} from '../../../pages/projects-pages/work-order-request/WorkOrderRequestUpdate'
const WorkOrderRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/projects/work-order-request/list'>
        <PageTitle>Work Order Request List</PageTitle>
        <WorkOrderRequestList />
      </Route>
      <Route path='/projects/work-order-request/add'>
        <PageTitle>Add Work Order Request</PageTitle>
        <WorkOrderRequestAdd />
      </Route>
      <Route path='/projects/work-order-request/edit/:workOrderID'>
        <PageTitle>Edit Work Order Request</PageTitle>
        <WorkOrderRequestUpdate />
      </Route>
      <Redirect
        from='/projects/work-order-request'
        exact={true}
        to='/projects/work-order-request/list'
      />
      <Redirect to='/projects/work-order-request/list' />
    </Switch>
  )
}
export default WorkOrderRequestMasterPage
