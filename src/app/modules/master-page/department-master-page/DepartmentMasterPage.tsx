import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import Department from '../../../pages/master-pages/department-pages/Department'
import { AddDepartment } from '../../../pages/master-pages/department-pages/AddDepartment'
import { EditDepartment } from '../../../pages/master-pages/department-pages/EditDepartment'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Department',
    path: '/master/city/list',
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

const DepartmentMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/department/list'>
        <PageTitle>Department List</PageTitle>
        <Department />
      </Route>
      <Route path='/master/department/add'>
        <PageTitle>Add Department</PageTitle>
        <AddDepartment />
      </Route>
      <Route path='/master/department/edit/:docmtId'>
        <PageTitle>Edit Department</PageTitle>
        <EditDepartment />
      </Route>
      <Redirect from='/master/department' exact={true} to='/master/department/list' />
      <Redirect to='/master/department/list' />
    </Switch>
  )
}

export default DepartmentMasterPage
