import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_Ecd/layout/core'
import MeetingList from '../../pages/meeting-pages/MeetingList'
import AddMeeting from '../../pages/meeting-pages/AddMeeting'
import EditMeeting from '../../pages/meeting-pages/EditMeeting'

const MeetingMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/meeting/list'>
        <PageTitle>Meeting List</PageTitle>
        <MeetingList />
      </Route>
      <Route path='/meeting/add'>
        <PageTitle>Add Meeting</PageTitle>
        <AddMeeting />
      </Route>
      <Route path='/meeting/edit/:meetingID'>
        <PageTitle>Edit Meeting</PageTitle>
        <EditMeeting />
      </Route>
      <Redirect from='/meeting' exact={true} to='/meeting/list' />
      <Redirect to='/meeting/list' />
    </Switch>
  )
}

export default MeetingMasterPage
