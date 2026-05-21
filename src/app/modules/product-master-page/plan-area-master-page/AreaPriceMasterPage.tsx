import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'

import AreaList from '../../../pages/product-pages/plan-area-pages/area-price/AreaList'
import {AddArea} from '../../../pages/product-pages/plan-area-pages/area-price/AddArea'
import {AreaPriceHeader} from './AreaPriceHeader'
import {EditArea} from '../../../pages/product-pages/plan-area-pages/area-price/EditArea'

const AreaPriceMasterPage: React.FC = () => {
  return (
    <>
      <AreaPriceHeader />
      <Switch>
        <Route path='/p-product/plan-area/:planAreaId/list'>
          <PageTitle>Area Price List</PageTitle>
          <AreaList />
        </Route>
        <Route path='/p-product/plan-area/:planAreaId/add'>
          <PageTitle>Add Area Price</PageTitle>
          <AddArea />
        </Route>
        <Route path='/p-product/plan-area/:planAreaId/edit'>
          <PageTitle>Update Area Price</PageTitle>
          <EditArea />
        </Route>
        <Redirect
          from='/p-product/plan-area/:planAreaId'
          exact={true}
          to='/p-product/plan-area/:planAreaId/list'
        />
        <Redirect to='/p-product/plan-area/:planAreaId' />
      </Switch>
    </>
  )
}

export default AreaPriceMasterPage
