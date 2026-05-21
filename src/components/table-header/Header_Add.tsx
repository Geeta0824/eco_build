import React from 'react'
import {KTSVG} from '../../_Ecd/helpers'
import {Link} from 'react-router-dom'

type Props = {
  pathName: string
  title: string
  searchText: string
  id?: any
}

const Header_Add: React.FC<Props> = ({pathName, title, searchText, id}) => {
  return (
    <>
      {/* <div className='card-header border-0 py-2 bg-secondary'> */}
      <div
        className='card-toolbar'
        data-bs-toggle='tooltip'
        data-bs-placement='top'
        data-bs-trigger='hover'
        title={title}
      >
        <Link
          to={{pathname: pathName, state: {searchText: searchText, selDistrictID: id}}}
          className='btn btn-sm btn-light-primary bg-white'
        >
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
          Add New
        </Link>
      </div>
      {/* </div> */}
    </>
  )
}

export default Header_Add
