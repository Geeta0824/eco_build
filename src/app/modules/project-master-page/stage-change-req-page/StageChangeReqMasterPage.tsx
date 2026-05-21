import {Redirect, Route, Switch} from 'react-router-dom'
import StageChangeReqList from '../../../pages/projects-pages/stage-change-req-page/StageChangeReqList'
import { PageTitle } from '../../../../_Ecd/layout/core'

function StageChangeReqMasterPage() {
  return (
    <Switch>
      <Route path='/projects/stage-change-req/list'>
        <PageTitle>Ready Made Project Stage Change Request List</PageTitle>
        <StageChangeReqList />
      </Route>

      <Redirect
        from='/projects/stage-change-req'
        exact={true}
        to='/projects/stage-change-req/list'
      />
      <Redirect to='/projects/stage-change-req/list' />
    </Switch>
  )
}

export default StageChangeReqMasterPage
