import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import StageInfoDetailsList from '../../../pages/projects-pages/stage-info-pages/StageInfoDetailsList'
import ProjectMissedDeadlinePDF from '../../../pages/reports-page/project-missed-deadline-report/ProjectMissedDeadlinePDF'
import ProjectMissedDeadlineReportList from '../../../pages/reports-page/project-missed-deadline-report/ProjectMissedDeadlineReportList'

const ProjectMissedDeadlineReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/reports/project-missed-deadline/list'>
        <PageTitle>Project Missed Deadline Report List</PageTitle>
        <ProjectMissedDeadlineReportList />
      </Route>
      <Route path='/reports/project-missed-deadline/download'>
        <PageTitle>Project Missed Deadline Report Download</PageTitle>
        <ProjectMissedDeadlinePDF />
      </Route>
      <Route path='/reports/project-missed-deadline/view-details'>
        <PageTitle>Project Missed Deadline Report Details</PageTitle>
        <StageInfoDetailsList />
      </Route>
      <Redirect
        from='/reports/project-missed-deadline'
        exact={true}
        to='/reports/project-missed-deadline/list'
      />
      <Redirect to='/reports/project-missed-deadline/list' />
    </Switch>
  )
}

export default ProjectMissedDeadlineReportMasterPage
