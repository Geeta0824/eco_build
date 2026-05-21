import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_Ecd/layout/core'
import {AddStandardQuotation} from '../../pages/standard-quotation-pages/AddStandardQuotation'
import StandardQuotationListPage from '../../pages/standard-quotation-pages/StandardQuotationListPage'
import {EditStandardQuotation} from '../../pages/standard-quotation-pages/EditStandardQuotation'

const StandardQuotationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/standard-quotation/list'>
        <PageTitle>Standard Quotation Master List</PageTitle>
        <StandardQuotationListPage />
      </Route>
      <Route path='/standard-quotation/add'>
        <PageTitle>Add Standard Quotation Master</PageTitle>
        <AddStandardQuotation />
      </Route>
      <Route path='/standard-quotation/edit/:standardQuotationId'>
        <PageTitle>Edit Standard Quotation Master</PageTitle>
        <EditStandardQuotation />
      </Route>
      <Redirect from='/standard-quotation' exact={true} to='/standard-quotation/list' />
      <Redirect to='/standard-quotation/list' />
    </Switch>
  )
}

export default StandardQuotationMasterPage
