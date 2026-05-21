import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import { AddStandardQuotation } from '../../../pages/quotations-pages/standard-quotations-pages/AddStandardQuotation'
import StandardQuotationListPage from '../../../pages/quotations-pages/standard-quotations-pages/StandardQuotationListPage'
import QuotaionPDFView from '../../../pages/quotations-pages/QuotaionPDFView'

const StandardQuotationsMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/quotations/standards-quotations/list'>
        <PageTitle>Standard Quotation List</PageTitle>
        <StandardQuotationListPage />
      </Route>
      <Route path='/quotations/standards-quotations/add'>
        <PageTitle>Add Standard Quotation</PageTitle>
        <AddStandardQuotation />
      </Route>
      <Route path='/quotations/standards-quotations/view/:selQuotationID'>
        <PageTitle>View Quotation</PageTitle>
        <QuotaionPDFView />
      </Route>
      <Redirect
        from='/quotations/standards-quotations'
        exact={true}
        to='/quotations/standards-quotations/list'
      />
      <Redirect to='/quotations/standards-quotations/list' />
    </Switch>
  )
}

export default StandardQuotationsMasterPage
