import React from 'react'
import {KTSVG} from '../../../../../../_Ecd/helpers'

interface SearchBarProps {
  setSearch: (value: string) => void
  onAddNew: (addVal: boolean) => void
  setAction: (action: number) => void
  showAddUpdate: boolean
  filter: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchValue: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  setSearch,
  onAddNew,
  setAction,
  showAddUpdate,
  filter,
  searchValue,
}) => {
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value) // Updating the main search value
    filter(e) // Calling the filter function to update the displayed data
  }

  return (
    <>
      <div className='card-header border-0' style={{backgroundColor: '#000000'}}>
        <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
          <span className='w-100 position-relative'>
            {/* Search Icon */}
            <KTSVG
              path='/media/icons/duotune/general/gen021.svg'
              className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
            />
            {/* Search Input */}
            <input
              type='text'
              className='form-control form-control-solid px-15 bg-white'
              placeholder='Search'
              value={searchValue} // Controlled input value
              onChange={handleSearchChange} // Updating search and calling filter function
            />
          </span>
        </div>

        {/* Add New Button */}
        {!showAddUpdate && (
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <span
              className='btn btn-sm btn-light-primary bg-white'
              onClick={() => {
                onAddNew(true) // Trigger Add New state
                setAction(0) // Set action to Add (0 for adding new material)
              }}
            >
              {/* Add New Icon */}
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default SearchBar
