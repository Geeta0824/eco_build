import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CivilAndArchitectDiscountRequestList from '../../../pages/discount-request-page/civil-and-architect-request-page/CivilAndArchitectDiscountRequestList'

const CivilAndArchitectDiscountRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/civil-and-architect-dis-req/list'>
        <PageTitle>Civil And Architect  And D&C  Discount Request List</PageTitle>
        <CivilAndArchitectDiscountRequestList />
      </Route>

      <Redirect
        from='/discount-req/civil-and-architect-dis-req'
        exact={true}
        to='/discount-req/civil-and-architect-dis-req/list'
      />
      <Redirect to='/discount-req/civil-and-architect-dis-req/list' />
    </Switch>
  )
}

export default CivilAndArchitectDiscountRequestMasterPage
