import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CarpetryCustomizationDiscountRequestListPage from '../../../pages/discount-request-page/carpetry-customization-request-pages/CarpetryCustomizationDiscountRequestListPage'

const CarpetryCustomizationDiscountRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/carpetry-cust-req/list'>
        <PageTitle>Customization Master List</PageTitle>
        <CarpetryCustomizationDiscountRequestListPage />
      </Route>
      <Redirect
        from='/discount-req/carpetry-cust-req'
        exact={true}
        to='/discount-req/carpetry-cust-req/list'
      />
      <Redirect to='/discount-req/carpetry-cust-req/list' />
    </Switch>
  )
}

export default CarpetryCustomizationDiscountRequestMasterPage
