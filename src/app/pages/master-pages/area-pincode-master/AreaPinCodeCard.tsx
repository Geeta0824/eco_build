import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IAreaPinCodeModel} from '../../../models/master-page/IAreaPinCodeModel'

type Props = {
  data: IAreaPinCodeModel
  handleShowActive: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleShow: (id: number) => void
}

const AreaPinCodeCard: React.FC<Props> = ({data, handleShowActive, handleShow}) => {
  const pathUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.areaPincodeID} className='text-start'>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.areaName}
              </a>
            </div>
          </div>
        </td>
        <td>
          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
            {data.cityName}
          </a>
        </td>

        <td>
          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
            {data.stateName}
          </a>
        </td>

        <td>
          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
            {data.pincode}
          </a>
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.areaPincodeID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive} // Use local state to control checked state
              onChange={handleShowActive}
            />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={`/locations/areapincode/edit/${data.areaPincodeID}`}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <a
              onClick={() => handleShow(data.areaPincodeID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='ssvg-icon-3 svg-icon-danger'
              />
            </a>
          </div>
        </td>
      </tr>
    </>
  )
}

export {AreaPinCodeCard}
