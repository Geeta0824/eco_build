/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'

import {IPayFundListModel} from '../../../models/Accounts-page/pay-fund-page/IPayFundModel'

type Props = {
  data: IPayFundListModel
  downloadQuotationFile: (id: string) => void
  handleShow: (id: number) => void
  handleShowProDtl: (id: number) => void
  VendorID: number
  StartDate: string
  EndTime: string
  SearchText: string
  EmployeeID: number
}

const PayFundCard: React.FC<Props> = ({
  data,
  downloadQuotationFile,
  handleShow,
  handleShowProDtl,
  VendorID,
  StartDate,
  EndTime,
  SearchText,
  EmployeeID,
}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.projectPaymentID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.paymentDate}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.voucherNo}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.vendorName}</span>
            </div>
          </div>
        </td>
        <td>
          <span
            className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'
            title='Click Hear'
            onClick={() => handleShowProDtl(data.projectID)}
          >
            {data.projectName}
          </span>
          <span className='text-muted d-block fs-7'>{data.customeName}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.amount}</span>
          <span className='text-muted d-block fs-7'>{data.transactionMode}</span>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>
                {data.isGST === true ? 'Yes' : 'No'}
              </span>
              {data.isGST === true && data.gstTypeID === 1 ? (
                <span className='text-muted d-block fs-7 mt-1'>
                  {data.gstAmount}&nbsp;{'('}
                  {data.totalGstPer + '%'}
                  {')'}
                </span>
              ) : data.isGST === true && data.gstTypeID === 2 ? (
                <span className='text-muted d-block fs-7 mt-1'>
                  {data.gstAmount}&nbsp;{'('}
                  {data.igstPer + '%'}
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
        </td>{' '}
       
          <td className='text-dark text-hover-primary fs-6'>{data.createByName}</td>
       
        <td className='text-center'>
          {data.filePath === '' ? (
            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>N.A</span>
          ) : (
            <span
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
              title='Download'
              onClick={() => downloadQuotationFile(data.filePath)}
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
                  pathname: `/accounts/pay-for-project/edit/${data.projectPaymentID}`,
                  state: {
                    VendorID: VendorID,
                    StartDate: StartDate,
                    EndTime: EndTime,
                    SearchText: SearchText,
                  },
                }}
                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
              >
                <KTSVG
                  path='/media/icons/duotune/art/art005.svg'
                  className='svg-icon-3 svg-icon-primary'
                />
              </Link>
              <div
                onClick={() => handleShow(data.projectPaymentID)}
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

export {PayFundCard}
