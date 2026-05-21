import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {EditBank} from '../../../pages/organization-page/bank-master/EditBank'
import {AddBank} from '../../../pages/organization-page/bank-master/AddBank'
import BankList from '../../../pages/organization-page/bank-master/BankList'

const BankMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/organization/bank/list'>
        <PageTitle>Organization Bank List</PageTitle>
        <BankList />
      </Route>
      <Route path='/organization/bank/add'>
        <PageTitle>Add Organization Bank</PageTitle>
        <AddBank />
      </Route>
      <Route path='/organization/bank/edit/:organisationBankID'>
        <PageTitle>Edit Organization Bank</PageTitle>
        <EditBank />
      </Route>
      <Redirect from='/organization/bank' exact={true} to='/organization/bank/list' />
      <Redirect to='/organization/bank/list' />
    </Switch>
  )
}

export default BankMasterPage
