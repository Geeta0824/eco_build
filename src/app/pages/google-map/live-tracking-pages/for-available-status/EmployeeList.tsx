import React from 'react';
import { Employee } from '../../../../models/google-map/Employee';

interface Props {
  employees: Employee[];
  setSelectedEmployee: (employee: Employee | null) => void;
}

const EmployeeList: React.FC<Props> = ({ employees, setSelectedEmployee }) => {
  return (
    <div className="employee-list card p-3 shadow-sm" style={{ width: '300px', overflowY: 'auto', maxHeight: '90vh' }}>
      <h5 className="fw-bold text-center">Employee List</h5>
      {employees.length === 0 ? (
        <p className="text-muted text-center">No employees found</p>
      ) : (
        employees.map((emp) => (
          <div
            key={emp.empAvailableID}
            className="d-flex align-items-center p-2 border-bottom cursor-pointer"
            onClick={() => setSelectedEmployee(emp)}
          >
            <img
              src={
                emp.photoPath
                  ? process.env.REACT_APP_API_URL + emp.photoPath
                  : '/media/img/NoProduct.png'
              }
              alt="Employee"
              className="rounded-circle shadow me-2"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'cover',
                border: '1px solid #007bff',
              }}
            />
            <div>
              <h6 className="mb-0 fw-bold">{emp.employeeName}</h6>
              <small
                className={`badge fw-normal ${
                  emp.status === 'Checked In'
                    ? 'bg-success'
                    : emp.status === 'Unavailable'
                    ? 'bg-danger'
                    : 'bg-info'
                }`}
              >
                {emp.status}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeList;
