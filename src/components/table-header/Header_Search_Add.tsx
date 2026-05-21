import React from 'react'
import {KTSVG} from '../../_Ecd/helpers'
import {Link} from 'react-router-dom'

type Props = {
  searchText: string
  filter: (e: any) => void
  pathName: string
  title: string
  id?:any

}

const Header_Search_Add: React.FC<Props> = ({searchText, filter, pathName, title,id}) => {
  return (
    <>
      <div className='card-header border-0 ' style={{backgroundColor: '#000000'}}>
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
              onChange={(e) => filter(e)}
              value={searchText}
            />
          </span>
        </div>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title={title}
        >
          <Link
            to={{pathname: pathName, state: {mainSearch: searchText,selMainId:id}}}
            className='btn btn-sm btn-light-primary bg-white'
          >
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
            Add New
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header_Search_Add
