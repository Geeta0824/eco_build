import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import DebitNoteListPage from '../../../pages/accounts-page/debit-note-pages/DebitNoteListPage'
import {AddDebitNote} from '../../../pages/accounts-page/debit-note-pages/AddDebitNote'
import {EditDebitNote} from '../../../pages/accounts-page/debit-note-pages/EditDebitNote'

const DebitNoteMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/accounts/debit-note/list'>
        <PageTitle>Debit Note List</PageTitle>
        <DebitNoteListPage />
      </Route>
      <Route path='/accounts/debit-note/add'>
        <PageTitle>Add Debit Note</PageTitle>
        <AddDebitNote />
      </Route>
      <Route path='/accounts/debit-note/edit/:debitNoteId'>
        <PageTitle>Edit Debit Note</PageTitle>
        <EditDebitNote />
      </Route>
      <Redirect from='/accounts/debit-note' exact={true} to='/accounts/debit-note/list' />
      <Redirect to='/accounts/debit-note/list' />
    </Switch>
  )
}

export default DebitNoteMasterPage
