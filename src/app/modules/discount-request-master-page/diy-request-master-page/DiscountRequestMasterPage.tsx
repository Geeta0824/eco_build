import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import DIYQuotationListPage from '../../../pages/quotations-pages/diy-quotation-pages/DIYQuotationListPage'
import DiscountRequestListPage from '../../../pages/discount-request-page/diy-request-pages/DiscountRequestListPage'

const DiscountRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/diy-req/list'>
        <PageTitle>DIY Discount Request List</PageTitle>
        <DiscountRequestListPage />
      </Route>
      <Redirect from='/discount-req/diy-req' exact={true} to='/discount-req/diy-req/list' />
      <Redirect to='/discount-req/diy-req/list' />
    </Switch>
  )
}

export default DiscountRequestMasterPage
