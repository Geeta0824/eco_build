import React, {useState} from 'react'

const statusInfo: { [key: string]: string } = {
  All: 'Shows all employees, regardless of status.',
  Available: 'Employees currently available for tasks.',
  'Checked In': 'Employees who have checked in.',
  Unavailable: 'Employees currently unavailable.',
}

interface Props {
  filter: string
  setFilter: (status: string) => void
}

const FilterPanel: React.FC<Props> = ({filter, setFilter}) => {
  const [showInfo, setShowInfo] = useState<boolean>(false)

  return (
    <div className='card shadow-sm p-3 mb-3 text-center position-relative'>
      <div className='d-flex justify-content-center gap-3'>
        {['All', 'Available', 'Checked In', 'Unavailable'].map((status) => (
          <button
            key={status}
            className={`btn ${filter === status ? 'btn-primary' : 'btn-outline-primary'} fw-bold`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <span
        className='position-absolute top-0 end-0 p-2 text-primary'
        style={{cursor: 'pointer', fontSize: '1.5rem'}}
        onClick={() => setShowInfo(!showInfo)}
      >
        ℹ️
      </span>
      {showInfo && (
        <div className='alert alert-info text-center'>
          <strong>Filter Info:</strong> {statusInfo[filter]}
        </div>
      )}
    </div>
  )
}

export default FilterPanel
