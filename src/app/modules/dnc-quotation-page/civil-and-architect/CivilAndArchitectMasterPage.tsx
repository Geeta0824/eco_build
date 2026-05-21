import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CivilAndArchitectList from '../../../pages/dnc-quotation-pages/civil-and-architect-page/CivilAndArchitectList'
import {AddCivilAndArchitect} from '../../../pages/dnc-quotation-pages/civil-and-architect-page/AddCivilAndArchitect'
import PDFCivilAndArchitect from '../../../pages/dnc-quotation-pages/civil-and-architect-page/PDFCivilAndArchitect'

const CivilAndArchitectMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/dnc-quotation/civil-and-architect/list'>
        <PageTitle>Civil And Architect And D&C List</PageTitle>
        <CivilAndArchitectList />
      </Route>

      <Route path='/dnc-quotation/civil-and-architect/add'>
        <PageTitle>Add Civil And Architect And D&C</PageTitle>
        <AddCivilAndArchitect />
      </Route>

      <Route path='/dnc-quotation/civil-and-architect/pdf/:quotationID'>
        <PageTitle>PDF Civil And Architect And D&C</PageTitle>
        <PDFCivilAndArchitect />
      </Route>

      <Redirect
        from='/dnc-quotation/civil-and-architect'
        exact={true}
        to='/dnc-quotation/civil-and-architect/list'
      />
      <Redirect to='/dnc-quotation/civil-and-architect/list' />
    </Switch>
  )
}

export default CivilAndArchitectMasterPage
