import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import DesignerStageChangeReqList from '../../../pages/projects-pages/project-page/designer-stage-list-pages/DesignerStageChangeReqList'

function DesignerStageChangeReqMasterPage() {
  return (
    <Switch>
      <Route path='/projects/designer-stage-change-req/list'>
        <PageTitle>Designer Project Stage Change Request List</PageTitle>
        <DesignerStageChangeReqList />
      </Route>
      <Redirect
        from='/projects/designer-stage-change-req'
        exact={true}
        to='/projects/designer-stage-change-req/list'
      />
      <Redirect to='/projects/designer-stage-change-req/list' />
    </Switch>
  )
}

export default DesignerStageChangeReqMasterPage
