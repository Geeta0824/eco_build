import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ExpenseTypeReportList from '../../../pages/accounts-reports/expense-type-report-page/ExpenseTypeReportList'
import ExpenseReportPdf from '../../../pages/accounts-reports/expense-type-report-page/ExpenseReportPdf'
import ExpenseTypeReportView from '../../../pages/accounts-reports/expense-type-report-page/ExpenseTypeReportView'
import ExpenseReportPdfView from '../../../pages/accounts-reports/expense-type-report-page/ExpenseReportPdfView'
import ExpenseHeaderReportList from '../../../pages/accounts-reports/expense-type-report-page/ExpenseHeaderReportList'
import ExpenseHeadReportPdf from '../../../pages/accounts-reports/expense-type-report-page/ExpenseHeadReportPdf'

function ExpenseTypeReportMasterPage() {
  return (
    <Switch>
      <Route path='/account-reports/expense/header/list'>
        <PageTitle>Expense Head Report List</PageTitle>
        <ExpenseHeaderReportList />
      </Route>
      <Route path='/account-reports/expense/type-list'>
        <PageTitle>Expense Type Report List</PageTitle>
        <ExpenseTypeReportList />
      </Route>
      <Route path='/account-reports/expense/view'>
        <PageTitle>View Expense Type Report</PageTitle>
        <ExpenseTypeReportView />
      </Route>
      <Route path='/account-reports/expense/download'>
        <PageTitle>Download Expense Report</PageTitle>
        <ExpenseReportPdf />
      </Route>
      <Route path='/account-reports/expense/head/download'>
        <PageTitle>Download Expense Head Report</PageTitle>
        <ExpenseHeadReportPdf />
      </Route>
      <Route path='/account-reports/expense/download-view'>
        <PageTitle>Download Expense View</PageTitle>
        <ExpenseReportPdfView />
      </Route>
      <Redirect from='/account-reports/' exact={true} to='/account-reports/expense/header/list' />
      <Redirect to='/account-reports/expense/header/list' />
    </Switch>
  )
}

export default ExpenseTypeReportMasterPage
