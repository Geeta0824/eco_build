import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import { AddOfferPage } from '../../../pages/master-pages/offer-pages/AddOfferPage'
import OfferListPage from '../../../pages/master-pages/offer-pages/OfferListPage'
import { EditOfferPage } from '../../../pages/master-pages/offer-pages/EditOfferPage'


const OfferMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/offer/list'>
        <PageTitle>Offer List</PageTitle>
        <OfferListPage />
      </Route>
      <Route path='/master/offer/add'>
        <PageTitle>Add Offer</PageTitle>
        <AddOfferPage />
      </Route>
      <Route path='/master/offer/edit/:offerID'>
        <PageTitle>Edit Offer</PageTitle>
        <EditOfferPage />
      </Route>
      <Redirect from='/master/offer' exact={true} to='/master/offer/list' />
      <Redirect to='/master/offer/list' />
    </Switch>
  )
}

export default OfferMasterPage
