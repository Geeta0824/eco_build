import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddCountry} from '../../../pages/master-pages/country-pages/AddCountry'
import CountryListPage from '../../../pages/master-pages/country-pages/CountryListPage'
import { EditCountry } from '../../../pages/master-pages/country-pages/EdityCountry'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Country',
    path: '/master/country/list',
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

const CountryMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/country/list'>
        <PageTitle>Country List</PageTitle>
        <CountryListPage />
      </Route>
      <Route path='/master/country/add'>
        <PageTitle>Add Country</PageTitle>
        <AddCountry />
      </Route>
      <Route path='/master/country/edit/:countryid'>
        <PageTitle>Edit Country</PageTitle>
        <EditCountry />
      </Route>
      <Redirect from='/master/country' exact={true} to='/master/country/list' />
      <Redirect to='/master/country/list' />
    </Switch>
  )
}

export default CountryMasterPage
