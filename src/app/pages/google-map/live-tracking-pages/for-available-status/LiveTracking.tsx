import React, { useEffect, useState } from 'react';
import { GetTrackingLogHistoryByStatusApi } from '../../../../modules/google-mape-master-pages/live-tracking-master-page/LiveTrackingCRUD';
import { Employee } from '../../../../models/google-map/Employee';
import FilterPanel from './FilterPanel';
import EmployeeMap from './EmployeeMap';
import EmployeeList from './EmployeeList';

const LiveTracking: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees(filter);
  }, [filter]); // Fetch employees when filter changes

  const fetchEmployees = async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetTrackingLogHistoryByStatusApi(status);
      if (response.data.isSuccess) {
        setEmployees(response.data.responseObject);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex">
      <div className="flex-grow-1">
        <FilterPanel filter={filter} setFilter={setFilter} />
        <EmployeeMap
          employees={employees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      </div>
      <EmployeeList
        employees={employees} // Pass already filtered employees
        setSelectedEmployee={setSelectedEmployee}
      />
    </div>
  );
};

export default LiveTracking;
