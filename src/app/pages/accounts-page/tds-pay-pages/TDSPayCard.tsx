/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'

import {ITDSPayListModel} from '../../../models/Accounts-page/tds-pay-page/ITDSPayModel'

type Props = {
  data: ITDSPayListModel
  downloadQuotationFile: (id: string) => void
  handleShow: (id: number) => void
  name: string
  EmployeeID: number
}

const TDSPayCard: React.FC<Props> = ({
  data,
  downloadQuotationFile,
  handleShow,
  name,
  EmployeeID,
}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.tdsPaymentID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.tdsPayDate}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.voucherNo}</span>
            </div>
          </div>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.tdsYear}/{data.tdsMonth}
          </span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.tdsAmount}</span>
          <span className='text-muted d-block fs-7'>{data.transactionMode}</span>
        </td>

        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.cashAccountName}
          </span>
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
                  pathname: `/accounts/tds/edit/${data.tdsPaymentID}`,
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
                onClick={() => handleShow(data.tdsPaymentID)}
                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='ssvg-icon-3 svg-icon-danger'
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

export {TDSPayCard}
