import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_Ecd/layout/core'
import {AddDesignOnly3D} from '../../../pages/dnc-quotation-pages/design-only-3d-page/AddDesignOnly3D'
import DesignOnly3dList from '../../../pages/dnc-quotation-pages/design-only-3d-page/DesignOnly3dList'
import PDFDesignOnly3d from '../../../pages/dnc-quotation-pages/design-only-3d-page/PDFDesignOnly3d'

const DesignOnly3dMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/dnc-quotation/3d-design-onliy/list'>
        <PageTitle>Design Only 3D List</PageTitle>
        <DesignOnly3dList />
      </Route>

      <Route path='/dnc-quotation/3d-design-onliy/add'>
        <PageTitle>Add Design Only 3D</PageTitle>
        <AddDesignOnly3D />
      </Route>

      <Route path='/dnc-quotation/3d-design-onliy/pdf/:quotationID'>
        <PageTitle>PDF Design Only 3D</PageTitle>
        <PDFDesignOnly3d/>
      </Route>
      <Redirect
        from='/dnc-quotation/3d-design-onliy'
        exact={true}
        to='/dnc-quotation/3d-design-onliy/list'
      />
      <Redirect to='/dnc-quotation/3d-design-onliy/list' />
    </Switch>
  )
}

export default DesignOnly3dMasterPage
