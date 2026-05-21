import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import ProjectMaterilaReportList from '../../pages/material-report-pages/ProjectMaterilaReportList'
import ProjectMaterialPDF from '../../pages/material-report-pages/ProjectMaterialPDF'

const MaterialReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/reports/project-material/list'>
        <PageTitle>Project Material Report List</PageTitle>
        <ProjectMaterilaReportList />
      </Route>
      <Route path='/reports/project-material/download'>
        <PageTitle>Project Material Report Download</PageTitle>
        <ProjectMaterialPDF />
      </Route>
      <Redirect from='/reports/project-material' exact={true} to='/reports/project-material/list' />
      <Redirect to='/reports/project-material/list' />
    </Switch>
  )
}

export default MaterialReportMasterPage
