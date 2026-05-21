import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import SimpleHeader from '../simple-header/SimpleHeader'
import { DeductionItemServiceList } from '../../../../pages/projects-pages/project-page/additional-deduction-item-service-page/deduction-itrm-service-pages/DeductionItemServiceList'
import AddDeductionItemService from '../../../../pages/projects-pages/project-page/additional-deduction-item-service-page/deduction-itrm-service-pages/AddDeductionItemService'
import EditDeductionItemService from '../../../../pages/projects-pages/project-page/additional-deduction-item-service-page/deduction-itrm-service-pages/EditDeductionItemService'



const DeductionItemServiceMaster: React.FC = () => {
  return (
    <>  
     {/* <SimpleHeader /> */}
      <Switch>
        <Route path='/projects/project/add-ded/deduction/list'>
          <PageTitle>Reduction Item List</PageTitle>
          <DeductionItemServiceList />
        </Route>
        <Route path='/projects/project/add-ded/deduction/add'>
          <PageTitle>Add Reduction Item </PageTitle>
          <AddDeductionItemService />
        </Route>
        <Route path='/projects/project/add-ded/deduction/edit/:projectDeductionItemID'>
          <PageTitle>Edit Reduction Item</PageTitle>
          <EditDeductionItemService />
        </Route>

        <Redirect
          from='/projects/project/add-ded/deduction'
          exact={true}
          to='/projects/project/add-ded/deduction/list'
        />
        <Redirect to='/projects/project/add-ded/deduction/list' />
      </Switch>
    </>
  )
}
export default DeductionItemServiceMaster
