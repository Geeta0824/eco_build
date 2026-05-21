/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {ICountryModel} from '../../../models/master-page/ICountryModel'
import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IEduDepartmentModel} from '../../../models/master-page/IEducationDepartmentModel'

type Props = {
  data: IEduDepartmentModel
  //  handleShowFlag: (path: string) => void
  handleShowActive: (e: any) => void
  handleShow: (id: number) => void
  name: string
}

const EducationDepartmentCard: React.FC<Props> = ({data, handleShowActive, handleShow, name}) => {
  const pathUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.eduDepartmentID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.eduDepartmentName}
              </a>
            </div>
          </div>
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.eduDepartmentID}`}
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
              to={{
                pathname: `/master/eduDepartment/edit/${data.eduDepartmentID}`,
                state: {searchText: name},
              }}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.eduDepartmentID)}
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

export {EducationDepartmentCard}
