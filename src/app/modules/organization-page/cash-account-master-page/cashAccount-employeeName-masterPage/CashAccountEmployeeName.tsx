import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import {AddCashAccountEmployeeName} from '../../../../pages/organization-page/cash-account-master/cashaccount-employeename-page/AddCashAccountEmployeeName'
import CashAccountEmployeeNameList from '../../../../pages/organization-page/cash-account-master/cashaccount-employeename-page/CashAccountEmployeeNameList'
import {EditCashAccountEmployeeName} from '../../../../pages/organization-page/cash-account-master/cashaccount-employeename-page/EditCashAccountEmployeeName'
import CashAccountEmployeeHeader from './CashAccountEmployeeHeader'


const CashAccountEmployeeName: React.FC = () => {
  return (
    <>
<CashAccountEmployeeHeader />
      <Switch>
        <Route path='/organization/cashaccount/cashaccountemployeename/:cashAccoID/list'>
          <PageTitle>Cash Account Employee Name List</PageTitle>
          <CashAccountEmployeeNameList />
        </Route>
        <Route path='/organization/cashaccount/cashaccountemployeename/:cashAccoID/add'>
          <PageTitle>Add Cash Account Employee Name</PageTitle>
          <AddCashAccountEmployeeName />
        </Route>

        <Route path='/organization/cashaccount/cashaccountemployeename/:cashAccoID/edit/:cashEmployeeBalanceID'>
          <PageTitle>Edit Cash Account Employee Name</PageTitle>
          <EditCashAccountEmployeeName />
        </Route>

        <Redirect
          from='/organization/cashaccount/cashaccountemployeename/:cashAccoID'
          exact={true}
          to='/organization/cashaccount/cashaccountemployeename/:cashAccoID/list'
        />
        <Redirect to='/organization/cashaccount/cashaccountemployeename/:cashAccoID/list' />
      </Switch>
    </>
  )
}

export default CashAccountEmployeeName
