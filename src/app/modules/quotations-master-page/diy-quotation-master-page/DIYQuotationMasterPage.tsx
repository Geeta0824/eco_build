import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {AddDIYQuotation} from '../../../pages/quotations-pages/diy-quotation-pages/AddDIYQuotation'
import DIYQuotationListPage from '../../../pages/quotations-pages/diy-quotation-pages/DIYQuotationListPage'
import DIYByQuotationID from '../../../pages/quotations-pages/diy-quotation-pages/cart-items/DIYByQuotationID'
import CartListDIYQuotation from '../../../pages/quotations-pages/diy-quotation-pages/cart-items/CartListDIYQuotation'
import PDFDIYQuotataion from '../../../pages/quotations-pages/diy-quotation-pages/PDFDIYQuotataion'
import {AgencyWorkOrderPage} from '../../../pages/quotations-pages/diy-quotation-pages/AgencyWorkOrderPage'
import ModalPopUpDIYPDF from '../../../pages/quotations-pages/diy-quotation-pages/cart-items/ModalPopUpDIYPDF'

const DIYQuotationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/quotations/diy-quotation/list'>
        <PageTitle>DIY Master List</PageTitle>
        <DIYQuotationListPage />
      </Route>
      <Route path='/quotations/diy-quotation/add'>
        <PageTitle>Add DIY Master</PageTitle>
        <AddDIYQuotation />
      </Route>
      <Route path='/quotations/diy-quotation/add-cart/:quotationID'>
        <PageTitle>Add DIY Cart</PageTitle>
        <DIYByQuotationID />
      </Route>
      <Route path='/quotations/diy-quotation/view-cart/:quotationID'>
        <PageTitle>View DIY Master</PageTitle>
        <CartListDIYQuotation />
      </Route>
      <Route path='/quotations/diy-quotation/backpdf/:quotationID'>
        <PageTitle>PDF DIY Master</PageTitle>
        <ModalPopUpDIYPDF />
      </Route>
      <Route path='/quotations/diy-quotation/pdf/:quotationID'>
        <PageTitle>PDF DIY Master</PageTitle>
        <PDFDIYQuotataion />
      </Route>
      <Route path='/quotations/diy-quotation/admin-pdf/:quotationID'>
        <PageTitle>PDF DIY Master</PageTitle>
        <PDFDIYQuotataion />
      </Route>
      <Route path='/quotations/diy-quotation/agency-breakup-pdf/:quotationID'>
        <PageTitle>Agency BreakUp PDF DIY Master</PageTitle>
        <PDFDIYQuotataion />
      </Route>
      <Route path='/quotations/diy-quotation/agency-work-order/:quotationID'>
        <PageTitle>Agency Work Order</PageTitle>
        <AgencyWorkOrderPage />
      </Route>
      <Redirect from='/quotations/diy-quotation' exact={true} to='/quotations/diy-quotation/list' />
      <Redirect to='/quotations/diy-quotation/list' />
    </Switch>
  )
}

export default DIYQuotationMasterPage
