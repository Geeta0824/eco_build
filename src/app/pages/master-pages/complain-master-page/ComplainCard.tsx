/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IBHKMasterModel} from '../../../models/master-page/IBHKMasterModel'
import {IComplainModel} from '../../../models/master-page/IComplainModel'

type Props = {
  data: IComplainModel
  handleShow: (id: number) => void
  name:string
}

const ComplainCard: React.FC<Props> = ({data, handleShow,name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.complainID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>
                {data.quotationCategoryName}
              </span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>{data.agencyTypeName}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>{data.complainDescription}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname:`/master/complaints/edit/${data.complainID}`,state:{searchText:name}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.complainID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='ssvg-icon-3 svg-icon-danger'
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}

export {ComplainCard}
