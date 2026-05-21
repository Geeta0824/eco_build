import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import GenerateTicketList from '../../pages/generate-ticket-pages/GenerateTicketList'
import {AddGenerateTicket} from '../../pages/generate-ticket-pages/AddGenerateTicket'
import {UpdateGenerateTicket} from '../../pages/generate-ticket-pages/UpdateGenerateTicket'

const GenerateTicketMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/generate-ticket/list'>
        <PageTitle>Generate Ticket List</PageTitle>
        <GenerateTicketList />
      </Route>
      <Route path='/generate-ticket/add'>
        <PageTitle>Add Generate Ticket</PageTitle>
        <AddGenerateTicket />
      </Route>
      <Route path='/generate-ticket/edit/:ticketID'>
        <PageTitle>Update Generate Ticket</PageTitle>
        <UpdateGenerateTicket />
      </Route>
      <Redirect from='/generate-ticket' exact={true} to='/generate-ticket/list' />
      <Redirect to='/generate-ticket/list' />
    </Switch>
  )
}

export default GenerateTicketMasterPage
