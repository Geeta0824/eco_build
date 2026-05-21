import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import PlanAreaListPage from '../../../pages/product-pages/plan-area-pages/PlanAreaListPage'
import {AddPlanArea} from '../../../pages/product-pages/plan-area-pages/AddPlanArea'
import {EditPlanArea} from '../../../pages/product-pages/plan-area-pages/EditPlanArea'
import AreaPriceMasterPage from './AreaPriceMasterPage'

const PlanAreaMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/p-product/plan-area/list'>
        <PageTitle>Product Area List</PageTitle>
        <PlanAreaListPage />
      </Route>
      <Route path='/p-product/plan-area/add'>
        <PageTitle>Add Product Area</PageTitle>
        <AddPlanArea />
      </Route>
      <Route path='/p-product/plan-area/edit/:planAreaId'>
        <PageTitle>Edit Product Area</PageTitle>
        <EditPlanArea />
      </Route>
      <Route path='/p-product/plan-area/:planAreaId'>
        <PageTitle>Edit Product Area</PageTitle>
        <AreaPriceMasterPage />
      </Route>
      <Redirect from='/p-product/plan-area' exact={true} to='/p-product/plan-area/list' />
      <Redirect to='/p-product/plan-area/list' />
    </Switch>
  )
}

export default PlanAreaMasterPage
