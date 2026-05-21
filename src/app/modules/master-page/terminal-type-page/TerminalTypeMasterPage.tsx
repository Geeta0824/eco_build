import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
// import { AddTerminalType } from '../../../pages/master-pages/terminal-master/AddTerminalType'
// import { EditTerminalType } from '../../../pages/master-pages/terminal-master/EditTerminalType'
// import TerminalType from '../../../pages/master-pages/terminal-master/TerminalType'

const TerminalTypeMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/terminalType/list'>
        <PageTitle>Terminal Type List</PageTitle>
        {/* <TerminalType /> */}
      </Route>
      <Route path='/master/terminalType/add'>
        <PageTitle>Add Terminal Type</PageTitle>
        {/* <AddTerminalType /> */}
      </Route>
      <Route path='/master/terminalType/edit/:termTypID'>
        <PageTitle>Edit Terminal Type</PageTitle>
        {/* <EditTerminalType /> */}
      </Route>
      <Redirect from='/master/terminalType' exact={true} to='/master/terminalType/list' />
      <Redirect to='/master/terminalType/list' />
    </Switch>
  )
}

export default TerminalTypeMasterPage
