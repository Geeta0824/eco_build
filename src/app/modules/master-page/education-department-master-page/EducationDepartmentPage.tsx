import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import EducationDepartment from '../../../pages/master-pages/education-department-pages/EducationDepartment'
import { AddEducationDepartment } from '../../../pages/master-pages/education-department-pages/AddEducationDepartment'
import { EditEducationDepartment } from '../../../pages/master-pages/education-department-pages/EditEducationDepartment'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Education Department',
    path: '/master/eduDepartment/list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const EducationDepartmentPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/eduDepartment/list'>
        <PageTitle>Education Department List</PageTitle>
        <EducationDepartment />
      </Route>
      <Route path='/master/eduDepartment/add'>
        <PageTitle>Add Education Department</PageTitle>
        <AddEducationDepartment />
      </Route>
      <Route path='/master/eduDepartment/edit/:edudepId'>
        <PageTitle>Edit Education Department</PageTitle>
        <EditEducationDepartment />
      </Route>
      <Redirect from='/master/eduDepartment' exact={true} to='/master/eduDepartment/list' />
      <Redirect to='/master/eduDepartment/list' />
    </Switch>
  )
}

export default EducationDepartmentPage
