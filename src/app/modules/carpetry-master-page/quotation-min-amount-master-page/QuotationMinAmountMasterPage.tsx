import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {QuotationMinAmountList} from '../../../pages/carperty-page/quotation-min-amount-page/QuotationMinAmountList'
import {EditQuotationMinAmount} from '../../../pages/carperty-page/quotation-min-amount-page/EditQuotationMinAmount'

const QuotationMinAmountMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/carpetry/quotation-min-amt/list'>
        <PageTitle>Quotation Min Amount List</PageTitle>
        <QuotationMinAmountList />
      </Route>
      <Route path='/carpetry/quotation-min-amt/edit/:carpetentryQutationMinAmountID'>
        <PageTitle>Edit Quotation Min Amount</PageTitle>
        <EditQuotationMinAmount />
      </Route>
      <Redirect
        from='/carpetry/quotation-min-amt'
        exact={true}
        to='/carpetry/quotation-min-amt/list'
      />
      <Redirect to='/carpetry/quotation-min-amt/list' />
    </Switch>
  )
}

export default QuotationMinAmountMasterPage
