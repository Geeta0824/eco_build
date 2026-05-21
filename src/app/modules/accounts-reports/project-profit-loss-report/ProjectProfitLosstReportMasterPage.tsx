import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ProjectProjectProfitLossReportList from '../../../pages/accounts-reports/project-profit-loss-page/ProjectProjectProfitLossReportList'
import ProjectProfitLossReportPDF from '../../../pages/accounts-reports/project-profit-loss-page/ProjectProfitLossReportPDF'

const ProjectProfitLosstReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/account-reports/project-profit-loss/list'>
        <PageTitle>Project Profit | Loss Report List</PageTitle>
        <ProjectProjectProfitLossReportList />
      </Route>
      <Route path='/account-reports/project-profit-loss/download'>
        <PageTitle>Download Project Profit | Loss Report</PageTitle>
        <ProjectProfitLossReportPDF />
      </Route>
      {/* <Route path='/account-reports/project-profit-loss/view/:projectID'>
        <PageTitle>View Project Report</PageTitle>
        <ViewProjectReport />
      </Route> */}

      <Redirect
        from='/account-reports/project-profit-loss'
        exact={true}
        to='/account-reports/project-profit-loss/list'
      />
      <Redirect to='/account-reports/project-profit-loss/list' />
    </Switch>
  )
}

export default ProjectProfitLosstReportMasterPage
