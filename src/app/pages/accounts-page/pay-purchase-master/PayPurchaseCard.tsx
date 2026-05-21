/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'

import {IPayFundListModel} from '../../../models/Accounts-page/pay-fund-page/IPayFundModel'
import {IPayPurchasetModel} from '../../../models/Accounts-page/pay-purchase-page copy/IPayPurchaseModel'

type Props = {
  data: IPayPurchasetModel
  downloadQuotationFile: (id: string) => void
  handleShow: (id: number) => void
  name: string
  EmployeeID: number
}

const PayPurchaseCard: React.FC<Props> = ({
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
      <tr key={data.purchasePaymentID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.paymentDate}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.voucherNo}</span>
            </div>
          </div>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.purchaseOrdrNo}
          </span>
          <span className='text-muted d-block fs-7'>{data.amount}</span>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.vendorName}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.contactPerson}</span>
            </div>
          </div>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.cashAccountName}
          </span>
          <span className='text-muted d-block fs-7'>{data.transactionMode}</span>
        </td>

        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>
                {data.isGST === true ? 'Yes' : 'No'}
              </span>
              {data.gstTypeID === 1 ? (
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
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.finalAmount}</span>
          <span className='text-muted d-block fs-7'>{data.subTotal}</span>
        </td>
       
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
                  pathname: `/accounts/pay-for-purchase/edit/${data.purchasePaymentID}`,
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
                onClick={() => handleShow(data.purchasePaymentID)}
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

export {PayPurchaseCard}
