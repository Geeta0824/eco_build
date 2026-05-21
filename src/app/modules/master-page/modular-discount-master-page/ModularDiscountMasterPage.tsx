import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'
import ModularDiscountList from '../../../pages/master-pages/modular-discount-page/ModularDiscountList'
import { EditModularDiscont } from '../../../pages/master-pages/modular-discount-page/EditModularDiscont'
import { AddModularDiscount } from '../../../pages/master-pages/modular-discount-page/AddModularDiscount'



const ModularDiscountMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/master/modular-discount/list'>
                <PageTitle>Modular Discount List</PageTitle>
                <ModularDiscountList />
            </Route>
            <Route path='/master/modular-discount/add'>
                <PageTitle>Add Modular Discount</PageTitle>
                <AddModularDiscount />
            </Route>
            <Route path='/master/modular-discount/edit/:discountId'>
                <PageTitle>Edit Modular  Discount</PageTitle>
                <EditModularDiscont />
            </Route>
            <Redirect from='/master/modular-discount' exact={true} to='/master/modular-discount/list' />
            <Redirect to='/master/modular-discount/list' />
        </Switch>
    )
}

export default ModularDiscountMasterPage;
