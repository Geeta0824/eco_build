import {useEffect} from 'react'

import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'

import {IDNCTypeModel} from '../../../models/master-page/IDNCTypeModel'

type props = {
  data: IDNCTypeModel
  name: string
}
const DNCTypeCrad: React.FC<props> = ({data, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.dncTypeID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>{data.dncTypeName}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>{data.amountPerSqft}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname: `/master/dnc-type/edit/${data.dncTypeID}`, state: {searchText: name}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
          </div>
        </td>
      </tr>
    </>
  )
}
export {DNCTypeCrad}
