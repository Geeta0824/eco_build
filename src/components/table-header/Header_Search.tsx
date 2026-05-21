import React from 'react'
import {KTSVG} from '../../_Ecd/helpers'

type Props = {
  searchText: string
  filter: (e: any) => void
}

const Header_Search: React.FC<Props> = ({searchText, filter}) => {
  return (
    <>
      {/* <div className='card-header border-0 py-2 bg-secondary'> */}
      <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
        <span className='w-100 position-relative'>
          <KTSVG
            path='/media/icons/duotune/general/gen021.svg'
            className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
          />
          <input
            type='text'
            className='form-control form-control-solid px-15 bg-white'
            name='search'
            placeholder='Search'
            onChange={filter}
            value={searchText}
          />
        </span>
      </div>
      {/* </div> */}
    </>
  )
}

export default Header_Search
