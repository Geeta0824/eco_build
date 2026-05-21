import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddPremiumQuotation} from '../../../pages/quotations-pages/premium-quotation-pages/AddPremiumQuotation'
import PremiumQuotationListPage from '../../../pages/quotations-pages/premium-quotation-pages/PremiumQuotationListPage'
import QuotaionPDFView from '../../../pages/quotations-pages/QuotaionPDFView'

const PremiumQuotationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/quotations/premium-quotation/list'>
        <PageTitle>Premium Quotation Master List</PageTitle>
        <PremiumQuotationListPage />
      </Route>
      <Route path='/quotations/premium-quotation/add'>
        <PageTitle>Add Premium Quotation Master</PageTitle>
        <AddPremiumQuotation />
      </Route>
      <Route path='/quotations/premium-quotation/view/:selQuotationID'>
        <PageTitle>View Quotation</PageTitle>
        <QuotaionPDFView />
      </Route>
      <Redirect
        from='/quotations/premium-quotation'
        exact={true}
        to='/quotations/premium-quotation/list'
      />
      <Redirect to='/quotations/premium-quotation/list' />
    </Switch>
  )
}

export default PremiumQuotationMasterPage
