import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import {InvoicePageList} from '../../../../pages/projects-pages/project-page/invoice-pages/InvoicePageList'
import AddInvoicePage from '../../../../pages/projects-pages/project-page/invoice-pages/AddInvoicePage'
import EditInvoicePage from '../../../../pages/projects-pages/project-page/invoice-pages/EditInvoicePage'
import InvoiceHeader from '../simple-header/InvoiceHeader'

const InvoiceMastePager: React.FC = () => {
  return (
    <>
      <InvoiceHeader />
      <Switch>
        <Route path='/projects/project/invoice/list'>
          <PageTitle>Project Invoice List</PageTitle>
          <InvoicePageList />
        </Route>
        <Route path='/projects/project/invoice/add'>
          <PageTitle>Add Project Invoice</PageTitle>
          <AddInvoicePage />
        </Route>
        <Route path='/projects/project/invoice/edit/:projectInvoiceID'>
          <PageTitle>Edit Project Invoice</PageTitle>
          <EditInvoicePage />
        </Route>
        <Redirect
          from='/projects/project/invoice'
          exact={true}
          to='/projects/project/invoice/list'
        />
        <Redirect to='/projects/project/invoice/list' />
      </Switch>
    </>
  )
}
export default InvoiceMastePager
