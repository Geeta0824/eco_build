import {Redirect, Route, Switch} from 'react-router-dom'
import PurchaseReportList from '../../../pages/accounts-reports/perchase-report-page/PurchaseReportList'
import {PageTitle} from '../../../../_Ecd/layout/core'
import ViewPurchaseReport from '../../../pages/accounts-reports/perchase-report-page/ViewPurchaseReport'
import PurchasePDF from '../../../pages/accounts-reports/perchase-report-page/PurchasePDF'
import PurchaseItemViewPDF from '../../../pages/accounts-reports/perchase-report-page/PurchaseItemViewPDF'

function PurchaseReportMasterPage() {
  return (
    <Switch>
      <Route path='/account-reports/purchase/list'>
        <PageTitle>Purchase Report List</PageTitle>
        <PurchaseReportList />
      </Route>
      <Route path='/account-reports/purchase/view'>
        <PageTitle>View Purchase Report</PageTitle>
        <ViewPurchaseReport />
      </Route>
      <Route path='/account-reports/purchase/item/pdf'>
        <PageTitle>Download Purchase Item PDF</PageTitle>
        <PurchaseItemViewPDF />
      </Route>
      <Route path='/account-reports/purchase/download'>
        <PageTitle>Purchase Report PDF</PageTitle>
        <PurchasePDF />
      </Route>
      <Redirect from='/account-reports/' exact={true} to='/account-reports/purchase/list' />
      <Redirect to='/account-reports/purchase/list' />
    </Switch>
  )
}

export default PurchaseReportMasterPage
