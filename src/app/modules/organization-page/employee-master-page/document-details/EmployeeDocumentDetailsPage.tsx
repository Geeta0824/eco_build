import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import EmployeeDocumentDetails from '../../../../pages/organization-page/employee-master/document-details/EmployeeDocumentDetails'
import { AddEmployeeDocument } from '../../../../pages/organization-page/employee-master/document-details/AddEmployeeDocument'
import { EditEmployeeDocument } from '../../../../pages/organization-page/employee-master/document-details/EditEmployeeDocument'

const EmployeeDocumentDetailsPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/employee/edit/:employeeID/document/list'>
        <PageTitle>Document List</PageTitle>
        <EmployeeDocumentDetails />
      </Route>
      <Route path='/organization/employee/edit/:employeeID/document/add'>
        <PageTitle>Add Document</PageTitle>
        <AddEmployeeDocument />
      </Route>
      <Route path='/organization/employee/edit/:employeeID/document/edit/:empDocMapID'>
        <PageTitle>Edit Document</PageTitle>
        <EditEmployeeDocument />
      </Route>
      <Redirect
        from='/organization/employee/edit/:employeeID/document'
        exact={true}
        to='/organization/employee/edit/:employeeID/document/list'
      />
      <Redirect to='/organization/employee/edit/:employeeID/document/list' />
    </Switch>
  )
}

export default EmployeeDocumentDetailsPage
