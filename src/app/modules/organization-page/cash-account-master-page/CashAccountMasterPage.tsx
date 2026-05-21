import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import CashAccountList from '../../../pages/organization-page/cash-account-master/CashAccountList'
import {AddCashAccount} from '../../../pages/organization-page/cash-account-master/AddCashAccount'
import {EditCashAccount} from '../../../pages/organization-page/cash-account-master/EditCashAccount'
import ViewCashAccountDetails from '../../../pages/organization-page/cash-account-master/ViewCashAccountDetails'
import ResetPassword from '../../../pages/organization-page/cash-account-master/ResetPassword'
import CashAccountEmployeeName from './cashAccount-employeeName-masterPage/CashAccountEmployeeName'

const CashAccountMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/cashaccount/list'>
        <PageTitle>Cash Account List</PageTitle>
        <CashAccountList />
      </Route>
      <Route path='/organization/cashaccount/add'>
        <PageTitle>Add Cash Account</PageTitle>
        <AddCashAccount />
      </Route>
      <Route path='/organization/cashaccount/cashaccountemployeename/:cashAccoID'>
        <PageTitle>Cash Account Employee Name</PageTitle>
        <CashAccountEmployeeName />
      </Route>
      <Route path='/organization/cashaccount/edit/:cashAccoID'>
        <PageTitle>Edit Cash Account</PageTitle>
        <EditCashAccount />
      </Route>
      {/* <Route path='/organization/cashaccount/view/:userID'>
        <PageTitle>View Cash Account</PageTitle>
        <ViewCashAccountDetails />
      </Route>
      <Route path='/organization/cashaccount/resetPassword/:userid'>
        <PageTitle>Reset Password</PageTitle>
        <ResetPassword />
      </Route> */}
      <Redirect from='/organization/cashaccount' exact={true} to='/organization/cashaccount/list' />
      <Redirect to='/organization/cashaccount/list' />
    </Switch>
  )
}

export default CashAccountMasterPage
