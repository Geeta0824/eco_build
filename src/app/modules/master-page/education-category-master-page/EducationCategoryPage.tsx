import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import { AddEducationCategory } from '../../../pages/master-pages/education-category-pages/AddEducationCategory'
import { EditEducationCategory } from '../../../pages/master-pages/education-category-pages/EditEducationCategory'
import EducationCategory from '../../../pages/master-pages/education-category-pages/EducationCategory'

const cityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Education Category',
    path: '/master/eduCategory/list',
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

const EducationCategoryPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/eduCategory/list'>
        <PageTitle>Education Category List</PageTitle>
        <EducationCategory />
      </Route>
      <Route path='/master/eduCategory/add'>
        <PageTitle>Add Education Category</PageTitle>
        <AddEducationCategory />
      </Route>
      <Route path='/master/eduCategory/edit/:educatid'>
        <PageTitle>Edit Education Category</PageTitle>
        <EditEducationCategory />
      </Route>
      <Redirect from='/master/eduCategory' exact={true} to='/master/eduCategory/list' />
      <Redirect to='/master/eduCategory/list' />
    </Switch>
  )
}

export default EducationCategoryPage
