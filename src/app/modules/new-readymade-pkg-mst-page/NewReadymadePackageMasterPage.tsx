import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_Ecd/layout/core'
import NewReadymadePackageList from '../../pages/new-readymade-pkg-pages/NewReadymadePackageList'
import AddNewReadymadePackage from '../../pages/new-readymade-pkg-pages/AddNewReadymadePackage'
import EditNewReadymadePackage from '../../pages/new-readymade-pkg-pages/EditNewReadymadePackage'

const NewReadymadePackageMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/readymade-pkg/new-readymade-pkg/list'>
        <PageTitle>New Readymade Package List</PageTitle>
        <NewReadymadePackageList />
      </Route>
      <Route path='/readymade-pkg/new-readymade-pkg/add'>
        <PageTitle>Add New Readymade Package</PageTitle>
        <AddNewReadymadePackage />
      </Route>
      <Route path='/readymade-pkg/new-readymade-pkg/edit/:readymadeTypeId'>
        <PageTitle>Edit New Readymade Package</PageTitle>
        <EditNewReadymadePackage />
      </Route>
      <Redirect
        from='/readymade-pkg/new-readymade-pkg'
        exact={true}
        to='/readymade-pkg/new-readymade-pkg/list'
      />
      <Redirect to='/readymade-pkg/new-readymade-pkg/list' />
    </Switch>
  )
}

export default NewReadymadePackageMasterPage
