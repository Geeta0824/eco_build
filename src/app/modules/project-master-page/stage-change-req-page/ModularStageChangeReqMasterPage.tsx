import {Redirect, Route, Switch} from 'react-router-dom'
import ModularStageChangeReqList from '../../../pages/projects-pages/stage-change-req-page/ModularStageChangeReqList'
import {PageTitle} from '../../../../_Ecd/layout/core'

function ModularStageChangeReqMasterPage() {
  return (
    <Switch>
      <Route path=''>
        <PageTitle>Modular Project Stage Change Request List</PageTitle>
        <ModularStageChangeReqList />
      </Route>
      <Redirect
        from='/projects/modular-stage-change-req'
        exact={true}
        to='/projects/modular-stage-change-req/list'
      />
      <Redirect to='/projects/modular-stage-change-req/list' />
    </Switch>
  )
}

export default ModularStageChangeReqMasterPage
