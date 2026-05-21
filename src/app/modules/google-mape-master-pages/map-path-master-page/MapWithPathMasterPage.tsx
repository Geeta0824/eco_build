import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { PageTitle } from '../../../../_Ecd/layout/core'
import MapWithPathPage from '../../../pages/google-map/map-path-page/MapWithPathPage'

const MapWithPathMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/emp-google-path/map'>
        <PageTitle>Employee Map Path</PageTitle>
        <MapWithPathPage />
        {/* <MapWithPathLeafletPage /> */}
      </Route>
      <Redirect from='/emp-google-path' exact={true} to='/emp-google-path/map' />
      <Redirect to='/emp-google-path/map' />
    </Switch>
  )
}

export default MapWithPathMasterPage
