import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'
import PMCWorkStageList from '../../../pages/master-pages/pmc-work-stage-pages/PMCWorkStageList'
import AddPMCWorkStage from '../../../pages/master-pages/pmc-work-stage-pages/AddPMCWorkStage'
import EditPMCWorkStage from '../../../pages/master-pages/pmc-work-stage-pages/EditPMCWorkStage'
import PMCWorkMaterialInfo from '../../../pages/master-pages/pmc-work-stage-pages/PMCWorkMaterialInfo'

// const stateBreadCrumbs: Array<PageLink> = [
//   {
//     title: 'State',
//     path: '/master/state/list',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: '',
//     path: '',
//     isSeparator: true,
//     isActive: false,
//   },
// ]

const PMCWorkStageMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/master/pmc-work-stage/list'>
                <PageTitle>PMC Work Stage List</PageTitle>
                <PMCWorkStageList />
            </Route>
            <Route path='/master/pmc-work-stage/add'>
                <PageTitle>Add PMC Work Stage</PageTitle>
                <AddPMCWorkStage />
            </Route>
            <Route path='/master/pmc-work-stage/edit/:pmcid'>
                <PageTitle>Edit PMC Work Stage</PageTitle>
                <EditPMCWorkStage />
            </Route>    
            <Route path='/master/pmc-work-stage/material'>
                <PageTitle>PMC Work Material Info</PageTitle>
                <PMCWorkMaterialInfo />
            </Route>
            <Redirect from='/master/pmc-work-stage' exact={true} to='/master/pmc-work-stage/list' />
            <Redirect to='/master/pmc-work-stage/list' />
        </Switch>
    )
}

export default PMCWorkStageMasterPage;
