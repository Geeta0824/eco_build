/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'

import {IProjectExpenseModel} from '../../../models/master-page/IProjectExpenseModel'

type Props = {
  data: IProjectExpenseModel
  downloadQuotationFile: (id: string) => void
  handleShow: (id: number) => void
  handleShowProDtl: (id: number) => void
  name: string
  EmployeeID: number
}

const ProjectExpenseCard: React.FC<Props> = ({
  data,
  downloadQuotationFile,
  handleShow,
  handleShowProDtl,
  name,
  EmployeeID,
}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.projectExpenseID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.expenseDate}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.voucherNo}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span
                className='text-dark text-hover-primary fs-5 cursor-pointer'
                title='Click Hear'
                onClick={() => handleShowProDtl(data.projectID)}
              >
                {data.projectName}
              </span>
              <span className='text-muted d-block fs-7 mt-1'>{data.title}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.amount}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.transactionMode}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>
                {data.isGST === true ? 'Yes' : 'No'}
              </span>
              {data.isGST === true ? (
                <span className='text-muted d-block fs-7 mt-1'>
                  {data.gstAmount}&nbsp;{'('}
                  {data.gstPer + '%'}
                  {')'}
                </span>
              ) : (
                <span className='text-muted d-block fs-7 mt-1'>N.A</span>
              )}
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>
                {data.isTDSDeducted === true ? 'Yes' : 'No'}
              </span>
              {data.isTDSDeducted === true ? (
                <span className='text-muted d-block fs-7 mt-1'>
                  {data.tdsAmount}&nbsp;{'('}
                  {data.tdsPercentage + '%'}
                  {')'}
                </span>
              ) : (
                <span className='text-muted d-block fs-7 mt-1'>N.A</span>
              )}
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.finalAmount}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.cashAccountName}</span>
            </div>
          </div>
        </td>
      
          <td className='text-dark text-hover-primary fs-6'>{data.createByName}</td>
      
        <td className='text-center'>
          {data.documentPath === '' ? (
            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>N.A</span>
          ) : (
            <span
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
              title='Download'
              onClick={() => downloadQuotationFile(data.documentPath)}
            >
              <KTSVG
                path='/media/icons/duotune/files/fil017.svg'
                className='svg-icon-fluid svg-icon-primary'
              />
            </span>
          )}
        </td>
        <td>
          {EmployeeID === data.createBy ? (
            <div className='d-flex justify-content-end flex-shrink-0'>
              <Link
                to={{
                  pathname: `/accounts/project-expense/edit/${data.projectExpenseID}`,
                  state: {mainSearch: name},
                }}
                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
              >
                <KTSVG
                  path='/media/icons/duotune/art/art005.svg'
                  className='svg-icon-3 svg-icon-primary'
                />
              </Link>
              <div
                onClick={() => handleShow(data.projectExpenseID)}
                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='svg-icon-3 svg-icon-danger'
                />
              </div>
            </div>
          ) : (
            <span className='ms-5 d-flex text-muted justify-content-center flex-shrink-0 fs-6'>
              N.A
            </span>
          )}
        </td>
      </tr>
    </>
  )
}

export {ProjectExpenseCard}
