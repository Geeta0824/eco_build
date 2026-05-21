import React from 'react'
import {PageTitle} from '../../../../_Ecd/layout/core'
import {Redirect, Route, Switch} from 'react-router-dom'
import CompanyInfoList from '../../../pages/organization-page/company-info-page/CompanyInfoList'
import {AddCompanyInfo} from '../../../pages/organization-page/company-info-page/AddCompanyInfo'
import {EditCompanyInfo} from '../../../pages/organization-page/company-info-page/EditCompanyInfo'

function ComanyInfoMasterPage() {
  return (
    <Switch>
      <Route path='/organization/company-info/list'>
        <PageTitle>Company info List</PageTitle>
        <CompanyInfoList />
      </Route>
      <Route path='/organization/company-info/add'>
        <PageTitle> Add Company info</PageTitle>
        <AddCompanyInfo />
      </Route>
      <Route path='/organization/company-info/edit/:companyID'>
        <PageTitle> Edit Company info </PageTitle>
        <EditCompanyInfo />
      </Route>

      <Redirect
        from='/organization/company-info'
        exact={true}
        to='/organization/company-info/list'
      />
      <Redirect to='/organization/company-info/list' />
    </Switch>
  )
}

export default ComanyInfoMasterPage
