import {Redirect, Route, Switch} from 'react-router-dom'
import DIYStageChangeReqList from '../../../pages/projects-pages/stage-change-req-page/DIYStageChangeReqList'
import {PageTitle} from '../../../../_Ecd/layout/core'

function DIYStageChangeReqMasterPage() {
  return (
    <Switch>
      <Route path='/projects/diy-stage-change-req/list'>
        <PageTitle>DIY Project Stage Change Request List</PageTitle>
        <DIYStageChangeReqList />
      </Route>
      <Redirect
        from='/projects/diy-stage-change-req'
        exact={true}
        to='/projects/diy-stage-change-req/list'
      />
      <Redirect to='/projects/diy-stage-change-req/list' />
    </Switch>
  )
}

export default DIYStageChangeReqMasterPage
