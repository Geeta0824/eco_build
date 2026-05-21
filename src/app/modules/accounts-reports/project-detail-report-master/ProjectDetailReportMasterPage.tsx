import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ProjectPDF from '../../../pages/accounts-reports/project-detail-report-page/ProjectPDF'
import ProjectDetailReportList from '../../../pages/accounts-reports/project-detail-report-page/ProjectDetailReportList'
const ProjectDetailReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/project/list'>
        <PageTitle>Project Detail Report List</PageTitle>
        <ProjectDetailReportList />
      </Route>
      <Route path='/account-reports/project/download/:projectID'>
        <PageTitle>Download Project Detail Report</PageTitle>
        <ProjectPDF />
      </Route>
      <Redirect from='/account-reports/project' exact={true} to='/account-reports/project/list' />
      <Redirect to='/account-reports/project/list' />
    </Switch>
  )
}

export default ProjectDetailReportMasterPage
