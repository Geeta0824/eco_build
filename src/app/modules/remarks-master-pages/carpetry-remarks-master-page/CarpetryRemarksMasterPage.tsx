import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'// const stateBreadCrumbs: Array<PageLink> = [
import CarpetryRemarksList from '../../../pages/remarks-pages/carpetry-remarks-pages/CarpetryRemarksList'
import AddCarpetryRemarks from '../../../pages/remarks-pages/carpetry-remarks-pages/AddCarpetryRemarks'
import EditCarpetryRemarks from '../../../pages/remarks-pages/carpetry-remarks-pages/EditCarpetryRemarks'
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

const CarpetryRemarksMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/remarks/carpetry-rmk/list'>
                <PageTitle>Carpentry Remarks List</PageTitle>
                <CarpetryRemarksList />
            </Route>
            <Route path='/remarks/carpetry-rmk/add'>
                <PageTitle>Add Carpentry Remarks</PageTitle>
                <AddCarpetryRemarks />
            </Route>
            <Route path='/remarks/carpetry-rmk/edit/:quotationRemarksID'>
                <PageTitle>Edit Carpentry Remarks</PageTitle>
                <EditCarpetryRemarks />
            </Route>
            <Redirect from='/remarks/carpetry-rmk' exact={true} to='/remarks/carpetry-rmk/list' />
            <Redirect to='/remarks/carpetry-rmk/list' />
        </Switch>
    )
}

export default CarpetryRemarksMasterPage;
