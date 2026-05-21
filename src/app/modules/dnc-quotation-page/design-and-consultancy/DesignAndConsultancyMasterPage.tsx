import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import DesignAndConsultancyList from '../../../pages/dnc-quotation-pages/design-and-consultancy-page/DesignAndConsultancyList'
import {AddDesignAndConsultancy} from '../../../pages/dnc-quotation-pages/design-and-consultancy-page/AddDesignAndConsultancy'
import PDFDesignAndConsultancy from '../../../pages/dnc-quotation-pages/design-and-consultancy-page/PDFDesignAndConsultancy'


const DesignAndConsultancyMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/dnc-quotation/design-and-consultancy/list'>
        <PageTitle>Design And Consultancy List</PageTitle>
        <DesignAndConsultancyList />
      </Route>

      <Route path='/dnc-quotation/design-and-consultancy/add'>
        <PageTitle>Add Design And Consultancy</PageTitle>
        <AddDesignAndConsultancy />
      </Route>

      <Route path='/dnc-quotation/design-and-consultancy/pdf/:quotationID'>
        <PageTitle>PDF  Design And Consultanc</PageTitle>
        <PDFDesignAndConsultancy />
      </Route>
    
      <Redirect
        from='/dnc-quotation/design-and-consultancy'
        exact={true}
        to='/dnc-quotation/design-and-consultancy/list'
      />
      <Redirect to='/dnc-quotation/design-and-consultancy/list' />
    </Switch>
  )
}

export default DesignAndConsultancyMasterPage
