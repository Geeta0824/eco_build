import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'
import DNCPaymentStructureList from '../../../pages/master-pages/dnc-payment-structure/DNCPaymentStructureList'
import AddDNCPaymentStructure from '../../../pages/master-pages/dnc-payment-structure/AddDNCPaymentStructure'
import EditDNCPaymentStructure from '../../../pages/master-pages/dnc-payment-structure/EditDNCPaymentStructure'
import ModularPaymentStructureList from '../../../pages/master-pages/modular-payment-structure-page/ModularPaymentStructureList'
import AddModularPaymentStructure from '../../../pages/master-pages/modular-payment-structure-page/AddModularPaymentStructure'
import EditModularPaymentStructure from '../../../pages/master-pages/modular-payment-structure-page/EditModularPaymentStructure'



const ModularPaymentStructureMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/master/modular-pay-struc/list'>
                <PageTitle>Modular Payment Structure List</PageTitle>
                <ModularPaymentStructureList />
            </Route>
            <Route path='/master/modular-pay-struc/add'>
                <PageTitle>Add Modular Payment Structure</PageTitle>
                <AddModularPaymentStructure />
            </Route>
            <Route path='/master/modular-pay-struc/edit/:modProjPaymentStageID'>
                <PageTitle>Edit Modular Payment Structure</PageTitle>
                <EditModularPaymentStructure />
            </Route>
            <Redirect from='/master/modular-pay-struc' exact={true} to='/master/modular-pay-struc/list' />
            <Redirect to='/master/modular-pay-struc/list' />
        </Switch>
    )
}

export default ModularPaymentStructureMasterPage;
