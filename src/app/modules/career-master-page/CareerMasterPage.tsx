import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../_Ecd/layout/core'
import BusinessList from '../../pages/business/BusinessList'
import AddBusinessForm from '../../pages/business/AddBusinessForm'
import EditBusinessForm from '../../pages/business/EditBusinessForm'
import EditCareerForm from '../../pages/career-page/EditCareerForm'
import AddCareerForm from '../../pages/career-page/AddCareerForm'
import CareerList from '../../pages/career-page/CareerList'

const CareerMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/career/list'>
        <PageTitle>Career List</PageTitle>
        <CareerList />
      </Route>
      <Route path='/career/add'>
        <PageTitle>Add Career</PageTitle>
        <AddCareerForm />
      </Route>
      <Route path='/career/edit/:id'>
        <PageTitle>Edit Career</PageTitle>
        <EditCareerForm />
      </Route>
      <Redirect from='/career' exact={true} to='/career/list' />
      <Redirect to='/career/list' />
    </Switch>
  )
}

export default CareerMasterPage
