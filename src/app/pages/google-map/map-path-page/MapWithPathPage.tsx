import {GoogleMap, Marker, Polyline, useLoadScript, InfoWindow} from '@react-google-maps/api'
import {useEffect, useState, useRef, useCallback, useMemo} from 'react'
import {getTrackingDataApi} from '../../../modules/google-mape-master-pages/map-path-master-page/MapWithPathCRUD'
import {getAllEmployeeWebList} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {IEmployeeWebModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import Select from 'react-select'
import DatePicker, {utils} from 'react-modern-calendar-datepicker'
import {Card, Spinner, Alert, Row, Col, Button, FormLabel} from 'react-bootstrap-v5'

interface Location {
  id: number
  lat: number
  lng: number
  datetime: string
}

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
}

const defaultCenter = {lat: 23.089458, lng: 72.564819}

const MapWithPathPage: React.FC = () => {
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  })

  const [employees, setEmployees] = useState<{value: number; label: string}[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<{value: number; label: string} | null>(
    null
  )
  const [selectedDate, setSelectedDate] = useState<{
    year: number
    month: number
    day: number
  } | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  // Fetch Employee List
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployeeWebList()
        const employeeData: IEmployeeWebModel[] = response.data.responseObject || []
        setEmployees(
          employeeData.map((emp) => ({
            value: emp.employeeID,
            label: `${emp.firstName} ${emp.lastName}`,
          }))
        )
      } catch {
        setError('Failed to fetch employee list')
      }
    }
    fetchEmployees()
  }, [])

  // Fetch Tracking Data
  useEffect(() => {
    if (!selectedEmployee || !selectedDate) return

    const fetchTrackingData = async () => {
      setLoading(true)
      setError(null)

      try {
        const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(
          2,
          '0'
        )}-${String(selectedDate.day).padStart(2, '0')}`
        const response = await getTrackingDataApi(selectedEmployee.value, formattedDate)

        console.log('API Response:', response.data.responseObject)

        if (!response.data.responseObject || response.data.responseObject.length === 0) {
          setError('No tracking data found for this employee on the selected date.')
          setLocations([])
        } else {
          setLocations(
            response.data.responseObject.map((item: any) => ({
              id: parseFloat(item.track_Log_HistoryID),
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
              datetime: item.formattedDateTime,
            }))
          )
        }
      } catch (err) {
        console.error('API Error:', err)
        setError('Failed to fetch tracking data')
      } finally {
        setLoading(false)
      }
    }

    fetchTrackingData()
  }, [selectedEmployee, selectedDate])

  // Reset Date Selection
  const resetDate = useCallback(() => {
    setSelectedDate(null)
    setLocations([])
  }, [])

  // Determine map center dynamically
  const mapCenter = useMemo(
    () => (locations.length > 0 ? locations[0] : defaultCenter),
    [locations]
  )

  return (
    <Card className='shadow-lg p-4 border-0 rounded'>
      <Card.Body>
        {/* <Card.Title className='text-center mb-3 fw-bold fs-4 text-primary'>
          {selectedDate
            ? `Tracking Map - ${selectedDate.year}-${String(selectedDate.month).padStart(
                2,
                '0'
              )}-${String(selectedDate.day).padStart(2, '0')}`
            : 'Employee Tracking Map'}
        </Card.Title> */}
        <Row className='mb-4 align-items-center'>
          <Col md={6} className='d-flex align-items-center'>
            <FormLabel className='fw-bold text-primary fs-5 me-3'>Select Employee:</FormLabel>
            <Select
              options={employees}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              isSearchable
              placeholder='Search Employee...'
              className='shadow-sm flex-grow-1'
            />
          </Col>
          <Col md={6} className='d-flex align-items-center'>
            <FormLabel className='fw-bold text-primary fs-5 me-3'>Select Date:</FormLabel>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || null)} // ✅ Fixed: Now correctly updates state
              inputPlaceholder='Select a date'
              calendarPopperPosition='bottom'
              calendarClassName='responsive-calendar'
              maximumDate={utils('en').getToday()}
              renderFooter={() => (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Button variant='danger' onClick={resetDate}>
                    Reset
                  </Button>
                </div>
              )}
            />
          </Col>
        </Row>
        {loading ? (
          <Spinner animation='border' role='status' className='d-block mx-auto my-3' />
        ) : error ? (
          <Alert variant='danger' className='text-center'>
            {error}
          </Alert>
        ) : (
          isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              onLoad={(map) => {
                mapRef.current = map
              }}
            >
              {/* Markers */}
              {locations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={loc}
                  label={loc.datetime}
                  onClick={() => setSelectedMarker(loc)}
                />
              ))}
              {/* Polyline for path tracking */}
              {locations.length > 1 && (
                <Polyline
                  path={locations}
                  options={{
                    strokeColor: '#007bff',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                  }}
                />
              )}
              {/* Info Window */}
              {selectedMarker && (
                <InfoWindow
                  position={{lat: selectedMarker.lat, lng: selectedMarker.lng}}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <p>
                      <strong>Date & Time:</strong> {selectedMarker.datetime}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {selectedMarker.lat.toFixed(6)}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {selectedMarker.lng.toFixed(6)}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )
        )}
      </Card.Body>
    </Card>
  )
}

export default MapWithPathPage
