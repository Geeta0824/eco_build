import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'
import DNCPaymentStructureList from '../../../pages/master-pages/dnc-payment-structure/DNCPaymentStructureList'
import AddDNCPaymentStructure from '../../../pages/master-pages/dnc-payment-structure/AddDNCPaymentStructure'
import EditDNCPaymentStructure from '../../../pages/master-pages/dnc-payment-structure/EditDNCPaymentStructure'

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

const DNCPaymentStructureMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/master/dnc-pay-struc/list'>
                <PageTitle>DNC Payment Structure List</PageTitle>
                <DNCPaymentStructureList />
            </Route>
            <Route path='/master/dnc-pay-struc/add'>
                <PageTitle>Add DNC Payment Structure</PageTitle>
                <AddDNCPaymentStructure />
            </Route>
            <Route path='/master/dnc-pay-struc/edit/:dncid'>
                <PageTitle>Edit DNC Payment Structure</PageTitle>
                <EditDNCPaymentStructure />
            </Route>
            <Redirect from='/master/dnc-pay-struc' exact={true} to='/master/dnc-pay-struc/list' />
            <Redirect to='/master/dnc-pay-struc/list' />
        </Switch>
    )
}

export default DNCPaymentStructureMasterPage;
