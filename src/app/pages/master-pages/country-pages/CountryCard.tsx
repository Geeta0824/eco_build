/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { ICountryModel } from '../../../models/master-page/ICountryModel'
import { Link } from 'react-router-dom'
import { KTSVG } from '../../../../_Ecd/helpers'

type Props = {
  data: ICountryModel
  handleShowFlag: (path: string) => void
  handleShowActive: (e: any) => void
  handleShow: (id: number) => void
  name:string
}

const CountryCard: React.FC<Props> = ({ data, handleShowFlag, handleShowActive, handleShow,name }) => {
  const pathUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
 //  console.log('Use Effect Call')
    return () => { }
  }, [data])

  return (
    <>
      <tr key={data.countryID}>
        <td>
          <div className='d-flex align-items-center'>
            <div
              className='symbol symbol-45px me-5 cursor-pointer'
              onClick={() => handleShowFlag(data.flagPath)}
            >
              <img src={pathUrl + data.flagPath} alt='' />
            </div>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.countryName}
              </a>
            </div>
          </div>
        </td>
        <td>
          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
            {data.countryCode}
          </a>
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.countryID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname:`/master/country/edit/${data.countryID}`,state:{searchText:name}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.countryID)}
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

export { CountryCard }
