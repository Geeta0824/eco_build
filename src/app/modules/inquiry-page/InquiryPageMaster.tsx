import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import BusinessList from '../../pages/business/BusinessList'
import AddBusinessForm from '../../pages/business/AddBusinessForm'
import EditBusinessForm from '../../pages/business/EditBusinessForm'
import EditCareerForm from '../../pages/career-page/EditCareerForm'
import AddCareerForm from '../../pages/career-page/AddCareerForm'
import CareerList from '../../pages/career-page/CareerList'
import InquiryList from '../../pages/inquiry/InquiryList'

const InquiryPageMaster: React.FC = () => {
  return (
    <Switch>
      <Route path='/inquiry/list'>
        <PageTitle>Inquiry List</PageTitle>
        <InquiryList />
      </Route>
      {/* <Route path='/inquiry/add'>
        <PageTitle>Add Inquiry</PageTitle>
        <AddInquiryForm />
      </Route>
      <Route path='/inquiry/edit/:id'>
        <PageTitle>Edit Inquiry</PageTitle>
        <EditInquiryForm />
      </Route> */}
      <Redirect from='/inquiry' exact={true} to='/inquiry/list' />
      <Redirect to='/inquiry/list' />
    </Switch>
  )
}

export default InquiryPageMaster
