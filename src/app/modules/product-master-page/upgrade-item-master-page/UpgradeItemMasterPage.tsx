import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import UpgradeItemList from '../../../pages/product-pages/upgrade-item-page/UpgradeItemList'
import {PageTitle} from '../../../../_Ecd/layout/core'
import AddUpgradeItem from '../../../pages/product-pages/upgrade-item-page/AddUpgradeItem'
import EditUpgradeItem from '../../../pages/product-pages/upgrade-item-page/EditUpgradeItem'

const UpgradeItemMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/p-product/upgrade-item/list'>
        <PageTitle>UpGrade Item List</PageTitle>
        <UpgradeItemList />
      </Route>
      <Route path='/p-product/upgrade-item/add'>
        <PageTitle>Add UpGrade Item </PageTitle>
        <AddUpgradeItem />
      </Route>
      <Route path='/p-product/upgrade-item/edit/:upGradeItemID'>
        <PageTitle>Edit UpGrade Item </PageTitle>
        <EditUpgradeItem />
      </Route>


      <Redirect from='/p-product/upgrade-item' exact={true} to='/p-product/upgrade-item/list' />
      <Redirect to='/p-product/upgrade-item/list' />
    </Switch>
  )
}

export default UpgradeItemMasterPage
