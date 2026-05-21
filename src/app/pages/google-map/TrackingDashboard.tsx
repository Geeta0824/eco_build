import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import Select from 'react-select';
import DatePicker, { utils } from 'react-modern-calendar-datepicker';
import {
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap-v5';
import { Employee } from '../../models/google-map/Employee';
import { getAllEmployeeWebList } from '../../modules/organization-page/employee-master-page/EmployeeCRUD';
import { getTrackingDataApi } from '../../modules/google-mape-master-pages/map-path-master-page/MapWithPathCRUD';
import { IEmployeeWebModel } from '../../models/organization-page/Employee/IEmployeeModel';
import { GetTrackingLogHistoryByStatusApi } from '../../modules/google-mape-master-pages/live-tracking-master-page/LiveTrackingCRUD';

interface Location {
  id: number;
  lat: number;
  lng: number;
  datetime: string;
  address?: string;
}

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  border: '1px solid #dee2e6',
};

const defaultCenter = { lat: 0, lng: 0 };

const TrackingDashboard: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const [viewMode, setViewMode] = useState<'live' | 'history'>('live');
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);

  const [filter, setFilter] = useState<string>('All');
  const [liveEmployees, setLiveEmployees] = useState<Employee[]>([]);
  const [selectedLiveEmployee, setSelectedLiveEmployee] = useState<Employee | null>(null);

  const [employees, setEmployees] = useState<{ value: number; label: string }[]>([]);
  const [selectedHistoryEmployee, setSelectedHistoryEmployee] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cache for geocoded addresses to optimize performance
  const addressCache = useRef<Map<string, string>>(new Map());

  // Reverse geocoding function
  const getAddress = useCallback(async (lat: number, lng: number): Promise<string> => {
    const cacheKey = `${lat},${lng}`;
    if (addressCache.current.has(cacheKey)) {
      return addressCache.current.get(cacheKey)!;
    }

    if (!isLoaded || !window.google?.maps?.Geocoder) {
      return 'Address unavailable';
    }

    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          addressCache.current.set(cacheKey, address);
          resolve(address);
        } else {
          addressCache.current.set(cacheKey, 'Address unavailable');
          resolve('Address unavailable');
        }
      });
    });
  }, [isLoaded]);

  useEffect(() => {
    if (viewMode === 'live') {
      const fetchLiveData = async () => {
        setLoading(true);
        try {
          const res = await GetTrackingLogHistoryByStatusApi(filter);
          if (res.data.isSuccess) {
            const employeesWithAddress = await Promise.all(
              res.data.responseObject.map(async (emp: Employee) => ({
                ...emp,
                address: await getAddress(parseFloat(emp.latitude), parseFloat(emp.longitude)),
              }))
            );
            setLiveEmployees(employeesWithAddress);
          } else {
            setLiveEmployees([]);
          }
        } catch {
          setError('Live tracking failed.');
        } finally {
          setLoading(false);
        }
      };
      fetchLiveData();
    }
  }, [viewMode, filter, getAddress]);

  useEffect(() => {
    if (viewMode === 'history') {
      const fetchEmployees = async () => {
        try {
          const response = await getAllEmployeeWebList();
          const employeeData: IEmployeeWebModel[] = response.data.responseObject || [];
          setEmployees(
            employeeData.map((emp) => ({
              value: emp.employeeID,
              label: `${emp.firstName} ${emp.lastName}`,
            }))
          );
        } catch {
          setError('Failed to fetch employee list');
        }
      };
      fetchEmployees();
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode !== 'history' || !selectedHistoryEmployee || !selectedDate) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(
          2,
          '0'
        )}-${String(selectedDate.day).padStart(2, '0')}`;
        const response = await getTrackingDataApi(selectedHistoryEmployee.value, formattedDate);
        if (!response.data.responseObject?.length) {
          setError('No tracking data found for the selected date.');
          setLocations([]);
        } else {
          const locationsWithAddress = await Promise.all(
            response.data.responseObject.map(async (item: any) => ({
              id: parseFloat(item.track_Log_HistoryID),
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
              datetime: item.formattedDateTime,
              address: await getAddress(parseFloat(item.latitude), parseFloat(item.longitude)),
            }))
          );
          setLocations(locationsWithAddress);
        }
      } catch {
        setError('Failed to fetch historical tracking data');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [selectedHistoryEmployee, selectedDate, getAddress]);

  // Calculate map bounds only when Google Maps API is loaded
  const mapBounds = useMemo(() => {
    if (!isLoaded || !window.google?.maps) {
      return null; // Return null to avoid accessing undefined
    }

    const bounds = new window.google.maps.LatLngBounds();
    if (viewMode === 'live' && liveEmployees.length > 0) {
      liveEmployees.forEach((emp) =>
        bounds.extend({ lat: parseFloat(emp.latitude), lng: parseFloat(emp.longitude) })
      );
    } else if (viewMode === 'history' && locations.length > 0) {
      locations.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.lng }));
    }
    return bounds;
  }, [isLoaded, viewMode, liveEmployees, locations]);

  const mapCenter = useMemo(() => {
    if (mapBounds && !mapBounds.isEmpty()) {
      return mapBounds.getCenter().toJSON();
    }
    return defaultCenter;
  }, [mapBounds]);

  // Fit map to bounds when data changes
  useEffect(() => {
    if (mapRef.current && mapBounds && !mapBounds.isEmpty()) {
      mapRef.current.fitBounds(mapBounds);
    }
  }, [mapBounds]);

  const resetDate = useCallback(() => {
    setSelectedDate(null);
    setLocations([]);
  }, []);

  return (
    <Card className="shadow p-4 border-0 rounded-4 bg-white">
      <Card.Body>
        <Row className="mb-4 justify-content-center">
          <ToggleButtonGroup
            type="radio"
            name="viewToggle"
            value={viewMode}
            onChange={(val) => setViewMode(val)}
          >
            <ToggleButton id="live" value="live" variant="outline-primary" className="px-4">
              Live Tracking
            </ToggleButton>
            <ToggleButton id="history" value="history" variant="outline-secondary" className="px-4">
              History Tracking
            </ToggleButton>
          </ToggleButtonGroup>
        </Row>

        {viewMode === 'live' && (
          <Row className="mb-3">
            <Col md={6} className="mx-auto">
              <FormLabel>Status Filter</FormLabel>
              <Select
                options={['All', 'Available', 'Unavailable', 'Checked In'].map((status) => ({
                  value: status,
                  label: status,
                }))}
                onChange={(opt) => setFilter(opt?.value || 'All')}
                defaultValue={{ label: 'All', value: 'All' }}
              />
            </Col>
          </Row>
        )}

        {viewMode === 'history' && (
          <Row className="mb-4 g-3">
            <Col md={6}>
              <Row>
                <FormLabel>Select Employee:</FormLabel>
                <Select
                  options={employees}
                  value={selectedHistoryEmployee}
                  onChange={setSelectedHistoryEmployee}
                  placeholder="Search Employee..."
                />
              </Row>
            </Col>
            <Col md={6}>
              <FormLabel>Select Date:</FormLabel>
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date || null)}
                inputPlaceholder="Select a date"
                calendarPopperPosition="bottom"
                calendarClassName="responsive-calendar"
                maximumDate={utils('en').getToday()}
                renderFooter={() => (
                  <div className="text-center">
                    <Button variant="danger" onClick={resetDate} size="sm">
                      Reset
                    </Button>
                  </div>
                )}
              />
            </Col>
          </Row>
        )}

        {loading ? (
          <Spinner animation="border" role="status" className="d-block mx-auto" />
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : !isLoaded ? (
          <Alert variant="info" className="text-center">
            Loading Google Maps...
          </Alert>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={2}
            onLoad={(map) => {
              mapRef.current = map;
              if (mapBounds && !mapBounds.isEmpty()) {
                map.fitBounds(mapBounds);
              }
            }}
          >
            {viewMode === 'live' &&
              liveEmployees.map((emp) => (
                <Marker
                  key={emp.employeeID}
                  position={{ lat: parseFloat(emp.latitude), lng: parseFloat(emp.longitude) }}
                  onClick={() =>
                    setSelectedMarker({
                      id: emp.employeeID,
                      lat: parseFloat(emp.latitude),
                      lng: parseFloat(emp.longitude),
                      datetime: emp.status || 'Live',
                    })
                  }
                  label={emp.employeeName}
                />
              ))}

            {viewMode === 'history' &&
              locations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={loc}
                  label={loc.datetime}
                  onClick={() => setSelectedMarker(loc)}
                />
              ))}

            {viewMode === 'history' && locations.length > 1 && (
              <Polyline
                path={locations}
                options={{ strokeColor: '#0d6efd', strokeOpacity: 0.9, strokeWeight: 4 }}
              />
            )}

            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <strong>Date & Time:</strong> {selectedMarker.datetime}
                  <br />
                  <strong>Lat:</strong> {selectedMarker.lat.toFixed(6)}
                  <br />
                  <strong>Lng:</strong> {selectedMarker.lng.toFixed(6)}
                  <br />
                  <strong>Address:</strong> {selectedMarker.address || 'Fetching...'}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </Card.Body>
    </Card>
  );
};

export default TrackingDashboard;
