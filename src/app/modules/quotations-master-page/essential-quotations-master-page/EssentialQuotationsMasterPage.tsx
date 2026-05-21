import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import QuotaionPDFView from '../../../pages/quotations-pages/QuotaionPDFView'
import EssentialQuotationListPage from '../../../pages/quotations-pages/essential-quotations-pages copy/EssentialQuotationListPage'
import {AddEssentialQuotation} from '../../../pages/quotations-pages/essential-quotations-pages copy/AddEssentialQuotation'

const EssentialQuotationsMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/quotations/essential-quotation/list'>
        <PageTitle>Essential Quotation List</PageTitle>
        <EssentialQuotationListPage />
      </Route>
      <Route path='/quotations/essential-quotation/add'>
        <PageTitle>Add Essential Quotation</PageTitle>
        <AddEssentialQuotation />
      </Route>
      <Route path='/quotations/essential-quotation/view/:selQuotationID'>
        <PageTitle>View Essential</PageTitle>
        <QuotaionPDFView />
      </Route>
      <Redirect
        from='/quotations/essential-quotation'
        exact={true}
        to='/quotations/essential-quotation/list'
      />
      <Redirect to='/quotations/essential-quotation/list' />
    </Switch>
  )
}

export default EssentialQuotationsMasterPage
