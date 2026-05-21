import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import CivilWithDesignList from '../../../pages/dnc-quotation-pages/civil-with-design-page/CivilWithDesignList'
import {AddCivilWithDesign} from '../../../pages/dnc-quotation-pages/civil-with-design-page/AddCivilWithDesign'
import PDFCivilWithDesign from '../../../pages/dnc-quotation-pages/civil-with-design-page/PDFCivilWithDesign'

const CivilWithDesignMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/dnc-quotation/civil-with-design-and-consultancy/list'>
        <PageTitle>Civil With Design And consultancy List</PageTitle>
        <CivilWithDesignList />
      </Route>

      <Route path='/dnc-quotation/civil-with-design-and-consultancy/add'>
        <PageTitle>Add Civil With Design  And consultancy </PageTitle>
        <AddCivilWithDesign />
      </Route>
      <Route path='/dnc-quotation/civil-with-design-and-consultancy/pdf/:quotationID'>
        <PageTitle>PDF Civil With Design  And consultancy</PageTitle>
        <PDFCivilWithDesign />
      </Route>

      <Redirect
        from='/dnc-quotation/civil-with-design-and-consultancy'
        exact={true}
        to='/dnc-quotation/civil-with-design-and-consultancy/list'
      />
      <Redirect to='/dnc-quotation/civil-with-design-and-consultancy/list' />
    </Switch>
  )
}

export default CivilWithDesignMasterPage
