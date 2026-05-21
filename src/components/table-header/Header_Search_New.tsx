import React from 'react'
import {KTSVG} from '../../_Ecd/helpers'
import Search from 'antd/es/input/Search'

type Props = {
  searchText: string
  filter: (e: any) => void
  onChangefilter: (e: any) => void
}

const Header_Search_New: React.FC<Props> = ({searchText, filter, onChangefilter}) => {
  return (
    <>
      {/* <div className='card-header border-0 py-2 bg-secondary'> */}
        <div className='mb-2 col-xl-4 col-sm-6 ps-0'>
          <label className='form-label fw-bold text-white'>Search :</label>
          <Search
            placeholder='input search text'
            value={searchText}
            allowClear
            onChange={(e) => filter(e.target.value)}
            onSearch={(value: any) => onChangefilter(value)}
          />
        </div>
      {/* </div> */}
    </>
  )
}

export default Header_Search_New
