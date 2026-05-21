import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import DesignOnly3dDiscountRequesList from '../../../pages/discount-request-page/design-only-3d-request-page/DesignOnly3dDiscountRequesList'

const DesignOnly3dDiscountRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/3d-design-onliy-dis-req/list'>
        <PageTitle>Design Only 3D Discount Reques List</PageTitle>
        <DesignOnly3dDiscountRequesList />
      </Route>
      <Redirect from='/discount-req/3d-design-onliy-dis-req' exact={true} to='/discount-req/3d-design-onliy-dis-req/list' />
      <Redirect to='/discount-req/3d-design-onliy-dis-req/list' />
    </Switch>
  )
}

export default DesignOnly3dDiscountRequestMasterPage
