import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import PaymentStructureList from '../../../pages/projects-pages/payment-structure-page/PaymentStructureList'
import AddPaymentStructure from '../../../pages/projects-pages/payment-structure-page/AddPaymentStructure'
import EditPaymentStructure from '../../../pages/projects-pages/payment-structure-page/EditPaymentStructure'
import PaymentStructurePDF from '../../../pages/projects-pages/payment-structure-page/PaymentStructurePDF'
const PaymentStructureMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/projects/project/edit/:projectID/paymentstructure/list'>
        <PageTitle>Payment Structure List</PageTitle>
        <PaymentStructureList />
      </Route>
      <Route path='/projects/project/edit/:projectID/paymentstructure/add'>
        <PageTitle>Add Payment Structure</PageTitle>
        <AddPaymentStructure />
      </Route>
      <Route path='/projects/project/edit/:projectID/paymentstructure/edit/:projectPaymentStructureID'>
        <PageTitle>Edit Payment Structure</PageTitle>
        <EditPaymentStructure />
      </Route>
      <Route path='/projects/project/edit/:projectID/paymentstructure/pdf'>
        <PageTitle>Download Payment Structure PDF</PageTitle>
        <PaymentStructurePDF />
      </Route>
      <Redirect
        from='/projects/project/edit/:projectID/paymentstructure'
        exact={true}
        to='/projects/project/edit/:projectID/paymentstructure/list'
      />
      <Redirect to='/projects/project/edit/:projectID/paymentstructure/list' />
    </Switch>
  )
}
export default PaymentStructureMasterPage
