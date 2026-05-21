import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import EmployeeDocumentDetails from '../../../../pages/organization-page/employee-master/document-details/EmployeeDocumentDetails'
import {AddEmployeeDocument} from '../../../../pages/organization-page/employee-master/document-details/AddEmployeeDocument'
import {EditEmployeeDocument} from '../../../../pages/organization-page/employee-master/document-details/EditEmployeeDocument'
import {EditVendorDocument} from '../../../../pages/master-pages/vender-pages/document-details/EditVendorDocument'
import {AddVendorDocument} from '../../../../pages/master-pages/vender-pages/document-details/AddVendorDocument'
import VendorDocumentDetails from '../../../../pages/master-pages/vender-pages/document-details/VendorDocumentDetails'

const VendorDocumentDetailsMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/vender/edit/:vendorID/document/list'>
        <PageTitle>Document List</PageTitle>
        <VendorDocumentDetails />
      </Route>
      <Route path='/vender/edit/:vendorID/document/add'>
        <PageTitle>Add Document</PageTitle>
        <AddVendorDocument />
      </Route>
      <Route path='/vender/edit/:vendorID/document/edit/:vendorDocID'>
        <PageTitle>Edit Document</PageTitle>
        <EditVendorDocument />
      </Route>
      <Redirect
        from='/vender/edit/:vendorID/document'
        exact={true}
        to='/vender/edit/:vendorID/document/list'
      />
      <Redirect to='/vender/edit/:vendorID/document/list' />
    </Switch>
  )
}

export default VendorDocumentDetailsMasterPage
