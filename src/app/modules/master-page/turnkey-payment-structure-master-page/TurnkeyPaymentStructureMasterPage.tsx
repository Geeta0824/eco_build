import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'

import AddTurnkeyPaymentStructure from '../../../pages/master-pages/turnkey-payment-structure-pages/AddTurnkeyPaymentStructure'
import EditTurnkeyPaymentStructure from '../../../pages/master-pages/turnkey-payment-structure-pages/EditTurnkeyPaymentStructure'
import TurnkeyPaymentStructureList from '../../../pages/master-pages/turnkey-payment-structure-pages/TurnkeyPaymentStructureList'

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

const TurnkeyPaymentStructureMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/master/turnkey-pay-struc/list'>
                <PageTitle>Turnkey Payment Structure List</PageTitle>
                <TurnkeyPaymentStructureList />
            </Route>
            <Route path='/master/turnkey-pay-struc/add'>
                <PageTitle>Add Turnkey Payment Structure</PageTitle>
                <AddTurnkeyPaymentStructure />
            </Route>
            <Route path='/master/turnkey-pay-struc/edit/:turnkeyid'>
                <PageTitle>Edit Turnkey Payment Structure</PageTitle>
                <EditTurnkeyPaymentStructure />
            </Route>
            <Redirect from='/master/turnkey-pay-struc' exact={true} to='/master/turnkey-pay-struc/list' />
            <Redirect to='/master/turnkey-pay-struc/list' />
        </Switch>
    )
}

export default TurnkeyPaymentStructureMasterPage;
