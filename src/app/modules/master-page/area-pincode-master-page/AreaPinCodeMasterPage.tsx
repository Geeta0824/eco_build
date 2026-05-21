import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'
import AreaPinCode from '../../../pages/master-pages/area-pincode-master/AreaPinCode'
import { AddAreaPinCode } from '../../../pages/master-pages/area-pincode-master/AddAreaPinCode'


const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Area Pin Code',
    path: '/master/areapincode/list',
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

const AreaPinCodeMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/areapincode/list'>
        <PageTitle>Area Pin Code List</PageTitle>
        <AreaPinCode />
      </Route>
      <Route path='/master/areapincode/add'>
        <PageTitle>Add Area Pin Code</PageTitle>
        <AddAreaPinCode />
      </Route>
      <Route path='/master/areapincode/edit/:areaPincodeid'>
        <PageTitle>Edit Area Pin Code</PageTitle>
        <AreaPinCode />
      </Route>
      <Redirect from='/master/areapincode' exact={true} to='/master/areapincode/list' />
      <Redirect to='/master/areapincode/list' />
    </Switch>
  )
}

export default AreaPinCodeMasterPage
