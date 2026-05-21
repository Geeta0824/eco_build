import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_Ecd/layout/core'
import CustomizationQuotationsListPage from '../../pages/customization-quotation-pages/CustomizationQuotationsListPage'
import {AddCustomizationQuotations} from '../../pages/customization-quotation-pages/AddCustomizationQuotations'
import CustomizationPackageByQuotationID from '../../pages/customization-quotation-pages/package-list-pages/CustomizationPackageByQuotationID'
import CustomizationCartByQuotationID from '../../pages/customization-quotation-pages/cart-pages/CustomizationCartByQuotationID'
import MainCartListCustomizationQuotation from '../../pages/customization-quotation-pages/cart-pages/MainCartListCustomizationQuotation'
import PDFCustomizationQuotation from '../../pages/customization-quotation-pages/PDFCustomizationQuotation'

const CustomizationQuotationsMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/customization-quotations/list'>
        <PageTitle>Customization Quotation List</PageTitle>
        <CustomizationQuotationsListPage />
      </Route>
      <Route path='/customization-quotations/add'>
        <PageTitle>Add Customization Quotation</PageTitle>
        <AddCustomizationQuotations />
      </Route>
      <Route path='/customization-quotations/add-package/:quotationID'>
        <PageTitle>Add Customization Quotation Packages</PageTitle>
        <CustomizationPackageByQuotationID />
      </Route>
      <Route path='/customization-quotations/add-cart/:quotationID'>
        <PageTitle>Add Customization Quotation Cart</PageTitle>
        <CustomizationCartByQuotationID />
      </Route>
      {/* <Route path='/customization-quotations/view/:selQuotationID'>
        <PageTitle>View Customization Quotation</PageTitle>
        <QuotaionCustomizationPDFView />
      </Route> */}
      <Route path='/customization-quotations/view-cart/:quotationID'>
        <PageTitle>View Customization Quotation</PageTitle>
        <MainCartListCustomizationQuotation />
      </Route>
      <Route path='/customization-quotations/pdf/:quotationID'>
        <PageTitle>PDF Customization Quotation</PageTitle>
        <PDFCustomizationQuotation />
      </Route>
      <Route path='/customization-quotations/admin-pdf/:quotationID'>
        <PageTitle>Admin PDF Customization Quotation</PageTitle>
        <PDFCustomizationQuotation />
      </Route>
      <Route path='/customization-quotations/agency-breakup-pdf/:quotationID'>
        <PageTitle>Agency BreakUp PDF Customization Quotation</PageTitle>
        <PDFCustomizationQuotation />
      </Route>
      <Redirect from='/customization-quotations' exact={true} to='/customization-quotations/list' />
      <Redirect to='/customization-quotations/list' />
    </Switch>
  )
}

export default CustomizationQuotationsMasterPage
