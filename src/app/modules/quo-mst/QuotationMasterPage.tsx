import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import QuotationMstListPage from '../../pages/quo-mst-page/QuotationMstListPage'
import EditQuotationMst from '../../pages/quo-mst-page/EditQuotationMst'
import ProjectTypeListPage from '../../pages/quo-mst-page/project-type-mst-page/ProjectTypeMstListPage'
import EditProjectTypeMst from '../../pages/quo-mst-page/project-type-mst-page/EditProjectTypeMst'
import AddProjectTypeMst from '../../pages/quo-mst-page/project-type-mst-page/AddProjectTypeMst'

const QuotationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/quotation-mst/list'>
        <PageTitle>Quotation List</PageTitle>
        <QuotationMstListPage />
      </Route>
      <Route path='/master/quotation-mst/edit/:quoMstID'>
        <PageTitle>Edit Quotation</PageTitle>
        <EditQuotationMst />
      </Route>
      <Route path='/master/project-type-mst/list'>
        <PageTitle>Quotation List</PageTitle>
        <ProjectTypeListPage />
      </Route>
      <Route path='/master/project-type-mst/add'>
        <PageTitle>Add Quotation</PageTitle>
        <AddProjectTypeMst />
      </Route>
      <Route path='/master/project-type-mst/edit/:projTypeMstID'>
        <PageTitle>Edit Quotation</PageTitle>
        <EditProjectTypeMst />
      </Route>
      <Redirect from='/master/project-type-mst' exact={true} to='/master/project-type-mst/list' />
      <Redirect to='/master/project-type-mst/list' />
    </Switch>
  )
}
export default QuotationMasterPage
