/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../_Ecd/helpers'
import {SupportModel} from '../../models/Support-page/SupportModel'
import {HRMS_API_URL} from '../../modules/support/SupportCRUD'

type Props = {
  data: SupportModel
  handleShowFlag: (path: string) => void
}

const SupportCard: React.FC<Props> = ({data, handleShowFlag}) => {
  const pathUrl = HRMS_API_URL

  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.projectTaskID}>
        <td>
          {/* <div className='d-flex align-items-center'> */}
          <div
            className='symbol symbol-45px me-5 cursor-pointer'
            onClick={() => handleShowFlag(data.documentPath)}
          >
            <img src={pathUrl + data.documentPath} alt='' />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-start flex-column'>
            <span className='text-dark text-hover-primary fs-6'>{data.taskName}</span>
          </div>
          {/* </div> */}
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.description}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.priorityName}</span>
        </td>
        {/* <td>
          <Link
            to={`/support/document/${data.projectTaskID}`}
            className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1'
          >
            <KTSVG
              path='/media/icons/duotune/files/fil012.svg'
              className='svg-icon-2x svg-icon-success'
            />
          </Link>
        </td> */}
      </tr>
    </>
  )
}

export {SupportCard}
