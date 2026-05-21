import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ProjectDeadlineReportList from '../../../pages/reports-page/project-deadline-report/ProjectDeadlineReportList'
import ProjectDeadlinePDF from '../../../pages/reports-page/project-deadline-report/ProjectDeadlinePDF'
import StageInfoDetailsList from '../../../pages/projects-pages/stage-info-pages/StageInfoDetailsList'

const ProjectDeadlineReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/reports/project-deadline/list'>
        <PageTitle>Project Deadline Report List</PageTitle>
        <ProjectDeadlineReportList />
      </Route>
      <Route path='/reports/project-deadline/download'>
        <PageTitle>Project Deadline Report Download</PageTitle>
        <ProjectDeadlinePDF />
      </Route>
      <Route path='/reports/project-deadline/view-details'>
        <PageTitle>Project Deadline Report Details</PageTitle>
        <StageInfoDetailsList />
      </Route>
      <Redirect from='/reports/project-deadline' exact={true} to='/reports/project-deadline/list' />
      <Redirect to='/reports/project-deadline/list' />
    </Switch>
  )
}

export default ProjectDeadlineReportMasterPage
