import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CivilWithDesignDiscountRequestList from '../../../pages/discount-request-page/civil-with-design-request-page/CivilWithDesignDiscountRequestList'

const CivilWithDesignDiscountRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/civil-design-consultancy-dis-req/list'>
        <PageTitle>Civil With Design & consultancy Discount Request List</PageTitle>
        <CivilWithDesignDiscountRequestList />
      </Route>
      <Redirect from='/discount-req/civil-design-consultancy-dis-req' exact={true} to='/discount-req/civil-design-consultancy-dis-req/list' />
      <Redirect to='/discount-req/civil-design-consultancy-dis-req/list' />
    </Switch>
  )
}

export default CivilWithDesignDiscountRequestMasterPage
