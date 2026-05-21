import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import EmployeePenaltyReportList from '../../../pages/reports-page/penalty-report/EmployeePenaltyReportList'
import EmployeePenaltyReportPDF from '../../../pages/reports-page/penalty-report/EmployeePenaltyReportPDF'

const EmployeePenaltyReportMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/reports/employee-penalty/list'>
        <PageTitle>Employee Penalty Report List</PageTitle>
        <EmployeePenaltyReportList />
      </Route>
      <Route path='/reports/employee-penalty/download'>
        <PageTitle>Employee Penalty Report Download</PageTitle>
        <EmployeePenaltyReportPDF />
      </Route>
      <Redirect from='/reports/employee-penalty' exact={true} to='/reports/employee-penalty/list' />
      <Redirect to='/reports/employee-penalty/list' />
    </Switch>
  )
}

export default EmployeePenaltyReportMasterPage
