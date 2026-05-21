/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'


import { IBannerImageModel } from '../../../models/master-page/IBannerImageModel'
import { KTSVG } from '../../../../_Ecd/helpers'

type Props = {
  data: IBannerImageModel
  handleShowFlag: (path: string) => void
  handleShowActive: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleShow: (id: number) => void
}

const BannerImageCard: React.FC<Props> = ({data, handleShowFlag, handleShowActive,  handleShow,}) => {
  const pathUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
  //   console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.bannerID} className='text-start'>
        <td>
          <div className='d-flex align-items-center'>
            <div
              className='symbol symbol-45px me-5 cursor-pointer'
              onClick={() => handleShowFlag(data.bannerPath)}
            >
              <img src={pathUrl + data.bannerPath} alt='' />
            </div>
          </div>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.bannerTitle}</span>
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.bannerID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive}
              // onChange={(e) => checkedFunction(e)}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={`/master/bannerimage/edit/${data.bannerID}`}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.bannerID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='svg-icon-3 svg-icon-danger'
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}

export {BannerImageCard}
