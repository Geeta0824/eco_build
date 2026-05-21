import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import TalukaListPage from '../../../pages/master-pages/taluka-pages/TalukaListPage'
import {AddTaluka} from '../../../pages/master-pages/taluka-pages/AddTaluka'
import {EditTaluka} from '../../../pages/master-pages/taluka-pages/EditTaluka'

const TalukaMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/taluka/list'>
        <PageTitle>Taluka List</PageTitle>
        <TalukaListPage />
      </Route>
      <Route path='/master/taluka/add'>
        <PageTitle>Add Taluka</PageTitle>
        <AddTaluka />
      </Route>
      <Route path='/master/taluka/edit/:talukaID'>
        <PageTitle>Edit Taluka</PageTitle>
        <EditTaluka />
      </Route>
      <Redirect from='/master/taluka' exact={true} to='/master/taluka/list' />
      <Redirect to='/master/taluka/list' />
    </Switch>
  )
}

export default TalukaMasterPage
