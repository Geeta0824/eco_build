import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddDocumentType} from '../../../pages/master-pages/document-type-pages/AddDocumentType'
import DocumentType from '../../../pages/master-pages/document-type-pages/DocumentType'
import {EditDocumentType} from '../../../pages/master-pages/document-type-pages/EditDocumentType'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Document Type',
    path: '/master/documenttype/list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const DocumentTypePage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/documenttype/list'>
        <PageTitle>Document Type List</PageTitle>
        <DocumentType />
      </Route>
      <Route path='/master/documenttype/add'>
        <PageTitle>Add Document Type</PageTitle>
        <AddDocumentType />
      </Route>
      <Route path='/master/documenttype/edit/:doctypeId'>
        <PageTitle>Edit Document Type</PageTitle>
        <EditDocumentType />
      </Route>
      <Redirect from='/master/documenttype' exact={true} to='/master/documenttype/list' />
      <Redirect to='/master/documenttype/list' />
    </Switch>
  )
}

export default DocumentTypePage
