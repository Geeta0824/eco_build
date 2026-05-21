import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import DesignAndConsultancyDiscountRequestList from '../../../pages/discount-request-page/design-and-consultancy-Request-page/DesignAndConsultancyDiscountRequestList'

const DesignAndConsultancyDiscountRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/design-consultancy-dis-req/list'>
        <PageTitle>Design And Consultancy Discount Request List</PageTitle>
        <DesignAndConsultancyDiscountRequestList />
      </Route>
      <Redirect
        from='/discount-req/design-consultancy-dis-req'
        exact={true}
        to='/discount-req/design-consultancy-dis-req/list'
      />
      <Redirect to='/discount-req/design-consultancy-dis-req/list' />
    </Switch>
  )
}

export default DesignAndConsultancyDiscountRequestMasterPage
