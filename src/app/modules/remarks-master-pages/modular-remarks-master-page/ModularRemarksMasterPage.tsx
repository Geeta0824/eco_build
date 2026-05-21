import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'// const stateBreadCrumbs: Array<PageLink> = [
import ModularRemarksList from '../../../pages/remarks-pages/modular-remarks-pages/ModularRemarksList'
import AddModularRemarks from '../../../pages/remarks-pages/modular-remarks-pages/AddModularRemarks'
import EditModularRemarks from '../../../pages/remarks-pages/modular-remarks-pages/EditModularRemarks'


const ModularRemarksMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/remarks/modular-rmk/list'>
                <PageTitle>Modular Remarks List</PageTitle>
                <ModularRemarksList />
            </Route>
            <Route path='/remarks/modular-rmk/add'>
                <PageTitle>Add Modular Remarks</PageTitle>
                <AddModularRemarks />
            </Route>
            <Route path='/remarks/modular-rmk/edit/:quotationRemarksID'>
                <PageTitle>Edit Modular Remarks</PageTitle>
                <EditModularRemarks />
            </Route>
            <Redirect from='/remarks/modular-rmk' exact={true} to='/remarks/modular-rmk/list' />
            <Redirect to='/remarks/modular-rmk/list' />
        </Switch>
    )
}

export default ModularRemarksMasterPage;
