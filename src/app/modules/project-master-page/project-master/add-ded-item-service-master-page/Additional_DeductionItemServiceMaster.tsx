import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../../_Ecd/layout/core'
import SimpleHeader from '../simple-header/SimpleHeader'
import AdditionalItemServiceMaster from './AdditionalItemServiceMaster'
import DeductionItemServiceMaster from './DeductionItemServiceMaster'

const Additional_DeductionItemServiceMaster: React.FC = () => {
  return (
    <>
      <SimpleHeader />
      <Switch>
        <Route path='/projects/project/add-ded/additional'>
          <PageTitle>Additional Item  List</PageTitle>
          <AdditionalItemServiceMaster />
        </Route>
        <Route path='/projects/project/add-ded/deduction'>
          <PageTitle>Dediction Item </PageTitle>
          <DeductionItemServiceMaster />
        </Route>

        <Redirect
          from='/projects/project/add-ded'
          exact={true}
          to='/projects/project/add-ded/list'
        />
        <Redirect to='/projects/project/add-ded/list' />
      </Switch>
    </>
  )
}
export default Additional_DeductionItemServiceMaster
