import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import DesignStageListPage from '../../../pages/master-pages/design-stage-pages/DesignStageListPage'
import AddDesignStage from '../../../pages/master-pages/design-stage-pages/AddDesignStage'
import EditDesignStage from '../../../pages/master-pages/design-stage-pages/EditDesignStage'

const DesignStageMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/design-stage/list'>
        <PageTitle>Design Stage List</PageTitle>
        <DesignStageListPage />
      </Route>
      <Route path='/master/design-stage/add'>
        <PageTitle>Add Design Stage</PageTitle>
        <AddDesignStage />
      </Route>
      <Route path='/master/design-stage/edit/:designStageId'>
        <PageTitle>Edit Design Stage</PageTitle>
        <EditDesignStage />
      </Route>
      <Redirect from='/master/design-stage' exact={true} to='/master/design-stage/list' />
      <Redirect to='/master/design-stage/list' />
    </Switch>
  )
}

export default DesignStageMasterPage
