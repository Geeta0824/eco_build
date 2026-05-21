import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddDIYQuotation} from '../../../pages/quotations-pages/diy-quotation-pages/AddDIYQuotation'
import DIYQuotationListPage from '../../../pages/quotations-pages/diy-quotation-pages/DIYQuotationListPage'
import DIYByQuotationID from '../../../pages/quotations-pages/diy-quotation-pages/cart-items/DIYByQuotationID'
import CartListDIYQuotation from '../../../pages/quotations-pages/diy-quotation-pages/cart-items/CartListDIYQuotation'
import PDFDIYQuotataion from '../../../pages/quotations-pages/diy-quotation-pages/PDFDIYQuotataion'
import ModularQuotationListPage from '../../../pages/modular-quotation-pages/modular-quotation/ModularQuotationListPage'
import { AddModularQuotation } from '../../../pages/modular-quotation-pages/modular-quotation/AddModularQuotation'
import ModularByQuotationID from '../../../pages/modular-quotation-pages/modular-quotation/modular-quo-cart/ModularByQuotationID'
import CartListModularQuotation from '../../../pages/modular-quotation-pages/modular-quotation/modular-quo-cart/CartListModularQuotation'
import PDFModularQuotataion from '../../../pages/modular-quotation-pages/modular-quotation/PDFModularQuotataion'
import ModalPopUpModularPDF from '../../../pages/modular-quotation-pages/modular-quotation/modular-quo-cart/ModalPopUpModularPDF'

const ModularQuotationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/modular/modular-quotation/list'>
        <PageTitle>Modular Quotation List</PageTitle>
        <ModularQuotationListPage />
      </Route>
      <Route path='/modular/modular-quotation/add'>
        <PageTitle>Add Modular Quotation</PageTitle>
        <AddModularQuotation />
      </Route>
      <Route path='/modular/modular-quotation/add-cart/:quotationID'>
        <PageTitle>Add Modular Quotation Cart</PageTitle>
        <ModularByQuotationID />
      </Route>
      <Route path='/modular/modular-quotation/view-cart/:quotationID'>
        <PageTitle>View Modular Quotation</PageTitle>
        <CartListModularQuotation />
      </Route>
      <Route path='/modular/modular-quotation/backpdf/:quotationID'>
        <PageTitle>PDF Modular Quotation</PageTitle>
        <ModalPopUpModularPDF />
      </Route>
      <Route path='/modular/modular-quotation/pdf/:quotationID'>
        <PageTitle>PDF Modular Quotation</PageTitle>
        <PDFModularQuotataion />
      </Route>
      <Route path='/modular/modular-quotation/admin-pdf/:quotationID'>
        <PageTitle>PDF Modular Quotation</PageTitle>
        <PDFModularQuotataion />
      </Route>
      <Route path='/modular/modular-quotation/agency-breakup-pdf/:quotationID'>
        <PageTitle>Agency BreakUp PDF Modular Quotation</PageTitle>
        <PDFModularQuotataion />
      </Route>
      <Redirect from='/modular/modular-quotation' exact={true} to='/modular/modular-quotation/list' />
      <Redirect to='/modular/modular-quotation/list' />
    </Switch>
  )
}

export default ModularQuotationMasterPage
