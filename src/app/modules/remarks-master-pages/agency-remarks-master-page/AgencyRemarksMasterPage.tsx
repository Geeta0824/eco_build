import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'// const stateBreadCrumbs: Array<PageLink> = [
import AgencyRemarksList from '../../../pages/remarks-pages/agency-remarks-pages/AgencyRemarksList'
import AddAgencyRemarks from '../../../pages/remarks-pages/agency-remarks-pages/AddAgencyRemarks'
import EditAgencyRemarks from '../../../pages/remarks-pages/agency-remarks-pages/EditAgencyRemarks'

const AgencyRemarksMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/remarks/agency-rmk/list'>
                <PageTitle>Agency Remarks List</PageTitle>
                <AgencyRemarksList />
            </Route>
            <Route path='/remarks/agency-rmk/add'>
                <PageTitle>Add Agency Remarks</PageTitle>
                <AddAgencyRemarks />
            </Route>
            <Route path='/remarks/agency-rmk/edit/:agencyRemarksID'>
                <PageTitle>Edit Agency Remarks</PageTitle>
                <EditAgencyRemarks />
            </Route>
            <Redirect from='/remarks/agency-rmk' exact={true} to='/remarks/agency-rmk/list' />
            <Redirect to='/remarks/agency-rmk/list' />
        </Switch>
    )
}

export default AgencyRemarksMasterPage;
