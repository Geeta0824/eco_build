import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageTitle } from '../../../../_Ecd/layout/core'
import DNCTypeList from '../../../pages/master-pages/dnc-type-pages/DNCTypeList'
import EditDNCType from '../../../pages/master-pages/dnc-type-pages/EditDNCType'

const DNCTypeMasterPage = () => {
    return (
        <>
            <Switch>
                <Route path={'/master/dnc-type/list'}>
                    <PageTitle>DNC Type List</PageTitle>
                    <DNCTypeList />
                </Route>

                <Route path='/master/dnc-type/edit/:dncTypeID'>
                    <PageTitle>Edit DNC type</PageTitle>
                    <EditDNCType />
                </Route>
                <Redirect from='/master/dnc-type' exact={true} to='/master/dnc-type/list' />
                <Redirect to='/master/dnc-type/list' />
            </Switch>
        </>
    )
}

export default DNCTypeMasterPage