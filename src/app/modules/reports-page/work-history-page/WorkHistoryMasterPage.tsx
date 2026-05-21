import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import WorkHistoryList from '../../../pages/reports-page/work-history-page/WorkHistoryList'

const WorkHistoryMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/reports/work-history/list'>
        <PageTitle> Work History List</PageTitle>
        <WorkHistoryList />
      </Route>

      <Redirect from='/reports/work-history' exact={true} to='/reports/work-history/list' />
      <Redirect to='/reports/work-history/list' />
    </Switch>
  )
}

export default WorkHistoryMasterPage
