/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IBranchModel} from '../../../models/master-page/IBranchModel'

type Props = {
  data: IBranchModel
  handleShowActive: (e: any) => void
  handleShowBranchMap: (id: number, branchName: string) => void

  handleShow: (id: number) => void
  name: string
}

const BranchCard: React.FC<Props> = ({
  data,
  handleShowActive,
  handleShowBranchMap,
  handleShow,
  name,
}) => {
  const pathUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.branchID}>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.branchName}</span>
          <span className='text-muted d-block fs-7'>{data.branchCode}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.contactPerson}
          </span>
          <span className='text-muted d-block fs-7'>{data.mobileNumber}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.stateMaster}</span>
          <span className='text-muted d-block fs-7'>{data.cityName}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.kazulenciaMinAmt}</span>
         
        </td>
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.branchID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>

        <td>
          <div
            //  bg-hover-primary
            onClick={() => handleShowBranchMap(data.branchID, data.branchName)}
            className='btn btn-icon btn-bg-light bg-hover-primary  btn-sm me-1'
            title='Click Here to Add View Branch Rate'
          >
            <img
              src='/media/img/rate.png'
              alt=''
              className='text-dark'
              height={32}
              width={32}
              style={{borderRadius: '50%'}}
            />
             
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{pathname: `/master/branch/edit/${data.branchID}`, state: {mainSearch: name}}}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.branchID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
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

export {BranchCard}
