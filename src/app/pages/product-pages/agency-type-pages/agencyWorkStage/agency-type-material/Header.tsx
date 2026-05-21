// Header.tsx

import React from 'react'
import {Link} from 'react-router-dom'

interface HeaderProps {
  agencyTypeID: number
  stageName: string
  mainSearch: string
  searchText: string
  agencyTypeName: string
  agencyWorkStageID: number
}
const Header: React.FC<HeaderProps> = ({
  agencyTypeID,
  stageName,
  mainSearch,
  searchText,
  agencyTypeName,
  agencyWorkStageID,
}) => (
  <div className='text-end'>
    <Link
      className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
      to={{
        pathname: `/p-product/agency-type/${agencyTypeID}/list`,
        state: {
          search: searchText,
          mainSearch: mainSearch,
          agencyWorkStageID,
          agencyTypeName,
          agencyTypeID,
        },
      }}
    >
      Back To List
    </Link>
    <div className='d-flex flex-column mb-2'>
      <div className='d-flex align-items-center'>
        <label className='text-dark text-hover-primary cursor-pointer fs-4 fw-bolder'>
          Stage Name:
        </label>
        <span className='text-primary text-hover-dark cursor-pointer fs-4 fw-bolder ms-3'>
          {stageName}
        </span>
      </div>
    </div>
  </div>
)

export default Header
