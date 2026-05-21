/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'

import {IOtherFundRecListModel} from '../../../models/Accounts-page/other-fund-receive/IOtherFundReceiveModel'

type Props = {
  data: IOtherFundRecListModel
  downloadQuotationFile: (id: string) => void
  handleShow: (id: number) => void
  name: string
  EmployeeID: number
}

const OtherFundReceiveCard: React.FC<Props> = ({
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
      <tr key={data.otherPaymentID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.paymentDate}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.voucherNo}</span>
            </div>
          </div>
        </td>
        {data.paymentFromID === 3 ? (
          <td>
            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>Staff</span>
            <span className='text-muted d-block fs-7'>{data.description}</span>
          </td>
        ) : (
          <td>
            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
              {data.paymentFromID === 1 ? 'Vendor' : 'Franchise'}
            </span>
            <span className='text-muted d-block fs-7'>
              {data.paymentFromID === 1
                ? data.companyName + ' - ' + data.vendorContactPerson
                : data.franchieseFirstName + ' ' + data.franchieseLastName}
            </span>
          </td>
        )}

        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.amount}</span>
          <span className='text-muted d-block fs-7'>{data.transactionMode}</span>
        </td>

        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.cashAccountName}
          </span>
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
        {EmployeeID === data.createBy ? (
          <td>
            <div className='d-flex justify-content-end flex-shrink-0'>
              <Link
                to={{
                  pathname: `/accounts/other-fund-receive/edit/${data.otherPaymentID}`,
                  // state: {
                  //   projName: data.vendorContactPerson,
                  //   projectID: data.projectID,
                  // },
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
                onClick={() => handleShow(data.otherPaymentID)}
                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen027.svg'
                  className='ssvg-icon-3 svg-icon-danger'
                />
              </div>
            </div>
          </td>
        ) : (
          <span className='ms-5 d-flex text-muted justify-content-center flex-shrink-0 fs-6'>
            N.A
          </span>
        )}
      </tr>
    </>
  )
}

export {OtherFundReceiveCard}
