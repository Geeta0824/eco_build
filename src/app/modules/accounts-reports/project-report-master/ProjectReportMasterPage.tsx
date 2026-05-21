import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ProjectReportLIst from '../../../pages/accounts-reports/project-report-page/ProjectReportList'
import ProjectReportPDF from '../../../pages/accounts-reports/project-report-page/ProjectReportPDF'
import ViewProjectReport from '../../../pages/accounts-reports/project-report-page/ViewProjectReport'

const ProjectReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/project-report/list'>
        <PageTitle>Project Report List</PageTitle>
        <ProjectReportLIst />
      </Route>
      <Route path='/account-reports/project-report/download'>
        <PageTitle>Download Project Report</PageTitle>
        <ProjectReportPDF />
      </Route>
      <Route path='/account-reports/project-report/view/:projectID'>
        <PageTitle>View Project Report</PageTitle>
        <ViewProjectReport />
      </Route>
      
      <Redirect
        from='/account-reports/project-report'
        exact={true}
        to='/account-reports/project-report/list'
      />
      <Redirect to='/account-reports/project-report/list' />
    </Switch>
  )
}

export default ProjectReportMasterPage
