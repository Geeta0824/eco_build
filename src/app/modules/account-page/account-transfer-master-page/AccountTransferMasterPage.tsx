import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'

import AccountTransferList from '../../../pages/accounts-page/account-transfer-master/AccountTransferList'
import AddAccountTransfer from '../../../pages/accounts-page/account-transfer-master/AddAccountTransfer'
import EditAccountTransfer from '../../../pages/accounts-page/account-transfer-master/EditAccountTransfer'
import AccountTransferMasterPDF from '../../../pages/accounts-page/account-transfer-master/AccountTransferMasterPDF'

const AccountTransferMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/accounttransfer/list'>
        <PageTitle>Account Transfer List</PageTitle>
        <AccountTransferList />
      </Route>
      <Route path='/accounts/accounttransfer/add'>
        <PageTitle>Add Account Transfer </PageTitle>
        <AddAccountTransfer />
      </Route>
      <Route path='/accounts/accounttransfer/edit/:accountTransferID'>
        <PageTitle>Edit Account Transfer </PageTitle>
        <EditAccountTransfer />
      </Route>
      <Route path='/accounts/accounttransfer/download'>
        <PageTitle>Download Account Transfer</PageTitle>
        <AccountTransferMasterPDF />
      </Route>
      <Redirect from='/accounts/accounttransfer' exact={true} to='/accounts/accounttransfer/list' />
      <Redirect to='/accounts/accounttransfer/list' />
    </Switch>
  )
}

export default AccountTransferMasterPage
