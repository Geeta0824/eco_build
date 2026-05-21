import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {CustomerHeader} from './CustomerHeader'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {ViewCustomerPersonal} from '../../../pages/organization-page/customer-master/view-customer-details/ViewCustomerPersonal'
import {ViewCustomerAddress} from '../../../pages/organization-page/customer-master/view-customer-details/ViewCustomerAddress'
import {ViewCustomerKycDocument} from '../../../pages/organization-page/customer-master/view-customer-details/ViewCustomerKycDocument'
import {ViewCustomerTerminalCode} from '../../../pages/organization-page/customer-master/view-customer-details/ViewCustomerTerminalCode'
import {ViewCustomerBank} from '../../../pages/organization-page/customer-master/view-customer-details/ViewCustomerBank'
import {ViewCustomerEducation} from '../../../pages/organization-page/customer-master/view-customer-details/ViewCustomerEducation'

const ViewCustomerDetailsPage: React.FC = () => {
  return (
    <>
      {/* <CustomerHeader /> */}
      <Switch>
        <Route path='/organization/customer/view/:customerID/personal'>
          <PageTitle>View Customer</PageTitle>
          <ViewCustomerPersonal />
        </Route>
        {/* <Route path='/organization/customer/view/:customerID/address'>
          <PageTitle>Address</PageTitle>
          <ViewCustomerAddress />
        </Route> */}
        <Route path='/organization/customer/view/:customerID/bank'>
          <PageTitle>Bank Details</PageTitle>
          <ViewCustomerBank />
        </Route>
        {/* <Route path='/organization/customer/view/:customerID/education'>
          <PageTitle>Education Details</PageTitle>
          <ViewCustomerEducation />
        </Route> */}
        <Route path='/organization/customer/view/:customerID/document'>
          <PageTitle>KYC Document Details</PageTitle>
          <ViewCustomerKycDocument />
        </Route>
        <Route path='/organization/customer/view/:customerID/terminal'>
          <PageTitle>Terminal Code Details</PageTitle>
          <ViewCustomerTerminalCode />
        </Route>

        <Redirect
          from='/organization/customer/view/:customerID'
          exact={true}
          to='/organization/customer/view/:customerID/personal'
        />
        <Redirect to='/organization/customer/view/:customerID/personal' />
      </Switch>
    </>
  )
}

export default ViewCustomerDetailsPage
