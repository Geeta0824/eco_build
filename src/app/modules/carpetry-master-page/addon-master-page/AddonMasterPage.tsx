import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddAddonMaster} from '../../../pages/carperty-page/addon-master-page/AddAddonMaster'
import {EditAddonMaster} from '../../../pages/carperty-page/addon-master-page/EditAddonMaster'
import AddonMasterList from '../../../pages/carperty-page/addon-master-page/AddonMasterList'

const AddonMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/carpetry/addon-master/list'>
        <PageTitle>Addon Master List</PageTitle>
        <AddonMasterList />
      </Route>
      <Route path='/carpetry/addon-master/add'>
        <PageTitle>Add Addon Master</PageTitle>
        <AddAddonMaster />
      </Route>
      <Route path='/carpetry/addon-master/edit/:addonItemID'>
        <PageTitle>Edit Addon Master</PageTitle>
        <EditAddonMaster />
      </Route>
      <Redirect from='/carpetry/addon-master' exact={true} to='/carpetry/addon-master/list' />
      <Redirect to='/carpetry/addon-master/list' />
    </Switch>
  )
}

export default AddonMasterPage
