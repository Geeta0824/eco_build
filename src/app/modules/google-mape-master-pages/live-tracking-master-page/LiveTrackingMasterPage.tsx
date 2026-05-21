import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import LiveTracking from '../../../pages/google-map/live-tracking-pages/for-available-status/LiveTracking'
import MapWithPathPage from '../../../pages/google-map/map-path-page/MapWithPathPage'
import TrackingDashboard from '../../../pages/google-map/TrackingDashboard'

const LiveTrackingMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/track/live/location'>
        <PageTitle>Live Tracking</PageTitle>
        <LiveTracking />
      </Route>
      <Route path='/track/history/location'>
        <PageTitle>History Tracking</PageTitle>
        {/* <TrackingDashboard /> */}
        <MapWithPathPage />
      </Route>
      <Redirect from='/track' exact={true} to='/track/live/location' />
      <Redirect to='/track/live/location' />
    </Switch>
  )
}

export default LiveTrackingMasterPage
