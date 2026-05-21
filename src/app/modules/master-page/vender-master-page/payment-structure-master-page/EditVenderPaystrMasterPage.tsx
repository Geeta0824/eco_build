import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_Ecd/layout/core'
import VenderList from '../../../../pages/master-pages/vender-pages/VenderList'
import AddVender from '../../../../pages/master-pages/vender-pages/AddVender'
import EditVender from '../../../../pages/master-pages/vender-pages/EditVender'
import VenderHeader from './VenderHeader'
import AddPaymentStructure from '../../../../pages/master-pages/vender-pages/payment-structure-pages/AddPaymentStructure'
import EditPaymentStructure from '../../../../pages/master-pages/vender-pages/payment-structure-pages/EditPaymentStructure'
import PaymentStructureList from '../../../../pages/master-pages/vender-pages/payment-structure-pages/PaymentStructureList'

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

const EditVenderPaystrMasterPage: React.FC = () => {
  return (
    <>
      <VenderHeader />
      <Switch>
        <Route path='/master/vender/pay-str/:vendorID/list'>
          <PageTitle>Payment Structure List</PageTitle>
          <PaymentStructureList />
        </Route>
        <Route path='/master/vender/pay-str/:vendorID/add'>
          <PageTitle>Add Payment Structure</PageTitle>
          <AddPaymentStructure />
        </Route>
        <Route path='/master/vender/pay-str/:vendorID/edit/:payStrID'>
          <PageTitle>Edit Payment Structure</PageTitle>
          <EditPaymentStructure />
        </Route>
        {/* <Route path='/master/vender/pay-str/:venderid'>
                <PageTitle>Edit Vender</PageTitle>
                <EditVenderPaystrMasterPage />
            </Route> */}
        <Redirect
          from='/master/vender/pay-str/:vendorID'
          exact={true}
          to='/master/vender/pay-str/:vendorID/list'
        />
        <Redirect to='/master/vender/pay-str/:vendorID/list' />
      </Switch>
    </>
  )
}

export default EditVenderPaystrMasterPage
