/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IDebitNoteModel} from '../../../models/Accounts-page/debit-note-page/IDebitNoteModel'

type Props = {
  data: IDebitNoteModel
  downloadQuotationFile: (id: string) => void
  handleShow: (id: number) => void
  name: string
  EmployeeID: number
}
const DebitNoteListCard: React.FC<Props> = ({
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
      <tr key={data.debitNoteID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.debitVoucherNo}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.debitNoteDate}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.vendorName}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.purchaseOrderNo}</span>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.returnQty}</span>
              <span className='text-muted d-block fs-7 mt-1'>{data.totalReturnAmt}</span>
            </div>
          </div>
        </td>
        <td className='justify-content-start'>
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
          
            <div className='d-flex align-items-center'>
              <div className='d-flex justify-content-start flex-column'>
                <a href='#' className='text-dark text-hover-primary fs-6'>
                  {data.createByName}
                </a>
              </div>
            </div>
        
        </td>
        <td>
          {EmployeeID === data.createBy ? (
            <div className='d-flex justify-content-end flex-shrink-0'>
              <Link
                to={{
                  pathname: `/accounts/debit-note/edit/${data.debitNoteID}`,
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
                onClick={() => handleShow(data.debitNoteID)}
                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
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

export {DebitNoteListCard}
