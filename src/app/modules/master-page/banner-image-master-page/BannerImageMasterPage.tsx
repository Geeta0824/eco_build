import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'
import BannerImageList from '../../../pages/master-pages/banner-image-master/BannerImageList'
import { AddBannerImage } from '../../../pages/master-pages/banner-image-master/AddBannerImage'
import { EditBannerImage } from '../../../pages/master-pages/banner-image-master/EditBannerImage'


const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Banner Image Master',
    path: '/master/bannerimage/list',
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

const BannerImageMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/bannerimage/list'>
        <PageTitle>Banner Image List</PageTitle>
        <BannerImageList />
      </Route>
      <Route path='/master/bannerimage/add'>
        <PageTitle>Add Banner Image </PageTitle>
        <AddBannerImage />
      </Route>
      <Route path='/master/bannerimage/edit/:bannerId'>
        <PageTitle>Edit Banner Image</PageTitle>
        <EditBannerImage />
      </Route>
      <Redirect from='/master/bannerimage' exact={true} to='/master/bannerimage/list' />
      <Redirect to='/master/bannerimage/list' />
    </Switch>
  )
}

export default BannerImageMasterPage
