import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import QuotationLevelListPage from '../../../pages/master-pages/quotation-level-pages/QuotationLevelListPage'
import AddQuotationLevel from '../../../pages/master-pages/quotation-level-pages/AddQuotationLevel'
import EditQuotationLevel from '../../../pages/master-pages/quotation-level-pages/EditQuotationLevel'

const QuotationLevelMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/quotation-level/list'>
        <PageTitle>Quotation Level List</PageTitle>
        <QuotationLevelListPage />
      </Route>
      <Route path='/master/quotation-level/add'>
        <PageTitle>Add Quotation Level</PageTitle>
        <AddQuotationLevel />
      </Route>
      <Route path='/master/quotation-level/edit/:quotationLevelID'>
        <PageTitle>Edit Quotation Level</PageTitle>
        <EditQuotationLevel />
      </Route>
      <Redirect from='/master/quotation-level' exact={true} to='/master/quotation-level/list' />
      <Redirect to='/master/quotation-level/list' />
    </Switch>
  )
}

export default QuotationLevelMasterPage
