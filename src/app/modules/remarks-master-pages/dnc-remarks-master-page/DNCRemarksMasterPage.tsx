import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'// const stateBreadCrumbs: Array<PageLink> = [
import DNCRemarksList from '../../../pages/remarks-pages/dnc-remarks-pages/DNCRemarksList'
import AddDNCRemarks from '../../../pages/remarks-pages/dnc-remarks-pages/AddDNCRemarks'
import EditDNCRemarks from '../../../pages/remarks-pages/dnc-remarks-pages/EditDNCRemarks'


const DNCRemarksMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/remarks/dnc-rmk/list'>
                <PageTitle>DNC Remarks List</PageTitle>
                <DNCRemarksList />
            </Route>
            <Route path='/remarks/dnc-rmk/add'>
                <PageTitle>Add DNC Remarks</PageTitle>
                <AddDNCRemarks />
            </Route>
            <Route path='/remarks/dnc-rmk/edit/:quotationRemarksID'>
                <PageTitle>Edit DNC Remarks</PageTitle>
                <EditDNCRemarks />
            </Route>
            <Redirect from='/remarks/dnc-rmk' exact={true} to='/remarks/dnc-rmk/list' />
            <Redirect to='/remarks/dnc-rmk/list' />
        </Switch>
    )
}

export default DNCRemarksMasterPage;
