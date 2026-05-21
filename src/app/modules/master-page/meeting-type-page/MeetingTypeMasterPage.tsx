import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'



import MeetingTypeList from '../../../pages/master-pages/meeting-type-pages/MeetingTypeList'
import { AddMeetingType } from '../../../pages/master-pages/meeting-type-pages/AddMeetingType'
import { EditMeetingType } from '../../../pages/master-pages/meeting-type-pages/EditMeetingType'


const MeetingTypeMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/meeting-type/list'>
        <PageTitle>Meeting Type List</PageTitle>
        <MeetingTypeList />
      </Route>
      <Route path='/master/meeting-type/add'>
        <PageTitle>Add Meeting Type</PageTitle>
        <AddMeetingType />
      </Route>
      <Route path='/master/meeting-type/edit/:meetingTypeid'>
        <PageTitle>Edit Meeting Type</PageTitle>
        <EditMeetingType />
      </Route>
      <Redirect from='/master/meeting-type' exact={true} to='/master/meeting-type/list' />
      <Redirect to='/master/meeting-type/list' />
    </Switch>
  )
}

export default MeetingTypeMasterPage
