import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'

import ModularDiscountRequestList from '../../../pages/discount-request-page/modular-discount-request-page/ModularDiscountRequestList'

const ModularDiscountRequestMasterpage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/modular-dis-req/list'>
        <PageTitle>Modular Discount Request List</PageTitle>
        <ModularDiscountRequestList />
      </Route>
      <Redirect from='/discount-req/modular-dis-req' exact={true} to='/discount-req/modular-dis-req/list' />
      <Redirect to='/discount-req/modular-dis-req/list' />
    </Switch>
  )
}

export default ModularDiscountRequestMasterpage
