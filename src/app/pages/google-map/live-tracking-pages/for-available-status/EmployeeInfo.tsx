import React from 'react'
import {InfoWindow} from '@react-google-maps/api'
import {Employee} from '../../../../models/google-map/Employee'
import {toAbsoluteUrl} from '../../../../../_Ecd/helpers'

const BASE_API_URL = process.env.REACT_APP_API_URL

interface Props {
  selectedEmployee: Employee
}

const EmployeeInfo: React.FC<Props> = ({selectedEmployee}) => {
  return (
    <InfoWindow
      position={{
        lat: parseFloat(selectedEmployee.latitude),
        lng: parseFloat(selectedEmployee.longitude),
      }}
    >
      <div className='p-3 shadow-lg rounded bg-white' style={{minWidth: '320px'}}>
        <div className='d-flex align-items-center'>
          <img
            src={
              selectedEmployee.photoPath
                ? BASE_API_URL + selectedEmployee.photoPath
                : toAbsoluteUrl('/media/img/NoProduct.png')
            }
            alt='Employee'
            className='rounded-circle shadow'
            style={{width: '50px', height: '50px', objectFit: 'cover', border: '2px solid #007bff'}}
          />
          <div className='ms-3'>
            <h4 className='fw-bold text-primary mb-1'>{selectedEmployee.employeeName}</h4>
            <span
              className={`badge fw-normal px-3 py-1 ${
                selectedEmployee.status === 'Checked In'
                  ? 'bg-success'
                  : selectedEmployee.status === 'Unavailable'
                  ? 'bg-danger'
                  : 'bg-info'
              }`}
            >
              {selectedEmployee.status}
            </span>
          </div>
        </div>
        <p className='mt-2 mb-1'>
          <strong>Last Check-In:</strong> {selectedEmployee.lastCheckInTime || 'N/A'}
        </p>
        <p className='mb-1'>
          <strong>Last Check-Out:</strong> {selectedEmployee.lastCheckOutTime || 'N/A'}
        </p>
        <p className='mb-0'>
          <strong>Latitude:</strong> {selectedEmployee.latitude || 'N/A'}
        </p>
        <p className='mb-0'>
          <strong>Longitude:</strong> {selectedEmployee.longitude || 'N/A'}
        </p>
      </div>
    </InfoWindow>
  )
}

export default EmployeeInfo
