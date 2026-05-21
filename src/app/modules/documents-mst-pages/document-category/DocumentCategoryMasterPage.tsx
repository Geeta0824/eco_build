import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import DocumentCategoryList from '../../../pages/documents-pages/document-category/DocumentCategoryList'
import DocumentMstList from '../../../pages/documents-pages/document-master/DocumentMstList'

const DocumentCategoryMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/documents/document-ctgry/list'>
        <PageTitle>Document Category List</PageTitle>
        <DocumentCategoryList />
      </Route>
      <Route path='/documents/document-ctgry/document/list'>
        <PageTitle>Document List</PageTitle>
        <DocumentMstList />
      </Route>
      <Redirect from='/documents/document-ctgry' exact={true} to='/documents/document-ctgry/list' />
      <Redirect to='/documents/document-ctgry/list' />
    </Switch>
  )
}

export default DocumentCategoryMasterPage
