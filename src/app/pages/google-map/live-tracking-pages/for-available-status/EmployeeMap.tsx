import React from 'react'
import {GoogleMap, Marker, InfoWindow, LoadScript} from '@react-google-maps/api'
import {Employee} from '../../../../models/google-map/Employee'
import EmployeeInfo from './EmployeeInfo'

const mapContainerStyle = {width: '100%', height: '80vh'}
const center = {lat: 23.089458, lng: 72.564819}

interface Props {
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
}

const EmployeeMap: React.FC<Props> = ({ employees, selectedEmployee, setSelectedEmployee }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
        {employees.map((emp) => (
          <Marker
            key={emp.empAvailableID}
            position={{ lat: parseFloat(emp.latitude), lng: parseFloat(emp.longitude) }}
            onClick={() => setSelectedEmployee(emp)}
            icon={{
              url:
                emp.status === 'Checked In'
                  ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : emp.status === 'Unavailable'
                  ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
          />
        ))}

        {selectedEmployee && <EmployeeInfo selectedEmployee={selectedEmployee} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default EmployeeMap;