import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
// import KycDocument from '../../../pages/master-pages/kyc-document-master/KycDocument'
// import { AddKycDocument } from '../../../pages/master-pages/kyc-document-master/AddKycDocument'
// import { EditKycDocument } from '../../../pages/master-pages/kyc-document-master/EditKycDocument'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Kyc Document',
    path: '/master/kycdocument/list',
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

const KycDocumentMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/kycdocument/list'>
        <PageTitle>Kyc Document List</PageTitle>
        {/* <KycDocument /> */}
      </Route>
      <Route path='/master/kycdocument/add'>
        <PageTitle>Add Kyc Document</PageTitle>
        {/* <AddKycDocument /> */}
      </Route>
      <Route path='/master/kycdocument/edit/:kycdocId'>
        <PageTitle>Edit Kyc Document</PageTitle>
        {/* <EditKycDocument /> */}
      </Route>
      <Redirect from='/master/kycdocument' exact={true} to='/master/kycdocument/list' />
      <Redirect to='/master/kycdocument/list' />
    </Switch>
  )
}

export default KycDocumentMasterPage
