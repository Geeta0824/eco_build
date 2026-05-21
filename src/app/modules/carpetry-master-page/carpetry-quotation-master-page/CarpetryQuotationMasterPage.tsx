import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import CarpetryQuotationList from '../../../pages/carperty-page/carpetry-quotation-page/CarpetryQuotationList'
import {AddCarpetryQuotation} from '../../../pages/carperty-page/carpetry-quotation-page/AddCarpetryQuotation'
import CarpetryPackageByQuotationID from '../../../pages/carperty-page/carpetry-quotation-page/carpetry-package-list-page/CarpetryPackageByQuotationID'
import MainCartListCarpetryQuotation from '../../../pages/carperty-page/carpetry-quotation-page/cart-list/MainCartListCarpetryQuotation'
import CarpetryCartByQuotationID from '../../../pages/carperty-page/carpetry-quotation-page/cart-list/CarpetryCartByQuotationID'
import PDFCarpetryQuotation from '../../../pages/carperty-page/carpetry-quotation-page/PDFCarpetryQuotation'
import CheckOutPDFQuotation from '../../../pages/carperty-page/carpetry-quotation-page/cart-list/ModelPopUpPDF'

const CarpetryQuotationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/quotations/ready-made-quotation/list'>
        <PageTitle>Ready Made Quotation List</PageTitle>
        <CarpetryQuotationList />
      </Route>
      <Route path='/quotations/ready-made-quotation/add'>
        <PageTitle>Add Ready Made Quotation</PageTitle>
        <AddCarpetryQuotation />
      </Route>
      <Route path='/quotations/ready-made-quotation/add-package/:quotationID'>
        <PageTitle>Add Ready Made Quotation Packages</PageTitle>
        <CarpetryPackageByQuotationID />
      </Route>
      <Route path='/quotations/ready-made-quotation/add-cart/:quotationID'>
        <PageTitle>Add Ready Made Quotation Cart</PageTitle>
        <CarpetryCartByQuotationID />
      </Route>
      {/* <Route path='/quotations/ready-made-quotation/view/:selQuotationID'>
        <PageTitle>View Customization Quotation</PageTitle>
        <QuotaionCustomizationPDFView />
      </Route> */}
      <Route path='/quotations/ready-made-quotation/view-cart/:quotationID'>
        <PageTitle>View Ready Made Quotation</PageTitle>
        <MainCartListCarpetryQuotation />
      </Route>
      <Route path='/quotations/ready-made-quotation/pdf/:quotationID'>
        <PageTitle>PDF Customization Quotation</PageTitle>
        <PDFCarpetryQuotation />
      </Route>
      <Route path='/quotations/ready-made-quotation/outpdf/:quotationID'>
        <PageTitle>PDF Customization Quotation</PageTitle>
        <CheckOutPDFQuotation />
      </Route>
      <Route path='/quotations/ready-made-quotation/admin-pdf/:quotationID'>
        <PageTitle>Admin PDF Ready Made Quotation</PageTitle>
        <PDFCarpetryQuotation />
      </Route>
      <Route path='/quotations/ready-made-quotation/agency-berakup-pdf/:quotationID'>
        <PageTitle>Agency BreakUp PDF Ready Made Quotation</PageTitle>
        <PDFCarpetryQuotation />
      </Route>
      <Redirect
        from='/quotations/ready-made-quotation'
        exact={true}
        to='/quotations/ready-made-quotation/list'
      />
      <Redirect to='/quotations/ready-made-quotation/list' />
    </Switch>
  )
}

export default CarpetryQuotationMasterPage
