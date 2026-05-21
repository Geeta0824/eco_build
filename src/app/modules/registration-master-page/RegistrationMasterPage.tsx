import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import RegistrationListPage from '../../pages/registration-page/RegistrationListPage'
import {PageTitle} from '../../../_Ecd/layout/core'
import {VeiwVendorRegistration} from '../../pages/registration-page/VeiwVendorRegistration'

const RegistrationMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/registration/vendor-reg-req/list'>
        <PageTitle>Registration List</PageTitle>
        <RegistrationListPage />
      </Route>
      <Route path='/registration/vendor-reg-req/view/:vendorID'>
        <PageTitle>View Registration</PageTitle>
        <VeiwVendorRegistration />
      </Route>

      <Redirect
        from='/registration/vendor-reg-req'
        exact={true}
        to='/registration/vendor-reg-req/list'
      />
      <Redirect to='/registration/vendor-reg-req/list' />
    </Switch>
  )
}

export default RegistrationMasterPage
