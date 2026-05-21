import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CustomizationDiscountRequestListPage from '../../../pages/discount-request-page/customization-request-pages/CustomizationDiscountRequestListPage'

const CustomizationDiscountRequestMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/discount-req/customization-req/list'>
        <PageTitle>Customization Discount Request List</PageTitle>
        <CustomizationDiscountRequestListPage />
      </Route>
      <Redirect
        from='/discount-req/customization-req'
        exact={true}
        to='/discount-req/customization-req/list'
      />
      <Redirect to='/discount-req/customization-req/list' />
    </Switch>
  )
}

export default CustomizationDiscountRequestMasterPage
