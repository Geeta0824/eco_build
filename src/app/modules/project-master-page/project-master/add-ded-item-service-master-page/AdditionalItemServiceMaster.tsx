import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import { AdditionalItemServiceList } from '../../../../pages/projects-pages/project-page/additional-deduction-item-service-page/additional-item-service-pages/AdditionalItemServiceList'
import AddAdditionalItemService from '../../../../pages/projects-pages/project-page/additional-deduction-item-service-page/additional-item-service-pages/AddAdditionalItemService'
import EditAdditionalItemService from '../../../../pages/projects-pages/project-page/additional-deduction-item-service-page/additional-item-service-pages/EditAdditionalItemService'

const AdditionalItemServiceMaster: React.FC = () => {
  return (
    <>
      {/* <SimpleHeader /> */}
      <Switch>
        <Route path='/projects/project/add-ded/additional/list'>
          <PageTitle>Additional Item Service List</PageTitle>
          <AdditionalItemServiceList />
        </Route>
        <Route path='/projects/project/add-ded/additional/add'>
          <PageTitle>Add Additional Item Service</PageTitle>
          <AddAdditionalItemService />
        </Route>
        <Route path='/projects/project/add-ded/additional/edit/:projectAdditionalItemID'>
          <PageTitle>Edit Additional Item Service</PageTitle>
          <EditAdditionalItemService />
        </Route>

        <Redirect
          from='/projects/project/add-ded/additional'
          exact={true}
          to='/projects/project/add-ded/additional/list'
        />
        <Redirect to='/projects/project/add-ded/additional/list' />
      </Switch>
    </>
  )
}
export default AdditionalItemServiceMaster
