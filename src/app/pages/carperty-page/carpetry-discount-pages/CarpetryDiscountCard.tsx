/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'

import {ICarpetryDiscountModel} from '../../../models/carpetry-page/ICarpetryDiscountModel'

type Props = {
  data: ICarpetryDiscountModel
  name: string
}

const CarpetryDiscountCard: React.FC<Props> = ({data, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.discountID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>
                {data.discountPercentage + '%'}
              </span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <span className='text-dark text-hover-primary fs-6'>{data.branchName}</span>
            </div>
          </div>
        </td>
        <td className='text-center'>
          <div className='d-flex justify-content-center flex-shrink-0'>
            <Link
              to={{
                pathname: `/carpetry/discount/edit/${data.discountID}`,
                state: {searchText: name},
              }}
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

export {CarpetryDiscountCard}
