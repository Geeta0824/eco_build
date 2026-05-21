/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {KTSVG} from '../../../../_Ecd/helpers'
import {IDebitNoteModel} from '../../../models/Accounts-page/debit-note-page/IDebitNoteModel'
import {IFundRecListModel} from '../../../models/Accounts-page/fund-receive/IFundReceiveModel'

type Props = {
  data: IFundRecListModel
  downloadQuotationFile: (id: string) => void
  handleShow: (id: number) => void
  handleShowProDtl: (id: number) => void
  ProjectID: number
  StartDate: string
  EndTime: string
  SearchText: string
  EmployeeID: number
}

const FundReceiveCard: React.FC<Props> = ({
  data,
  downloadQuotationFile,
  handleShow,
  handleShowProDtl,
  ProjectID,
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
          {/* <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                             
                            </span> */}

          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.cashAccountName}
          </span>
        </td>
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
       
          <td className='text-dark text-hover-primary fs-6'>{data.createByName}</td>
      
        <td>
          {EmployeeID === data.createBy ? (
            <div className='d-flex justify-content-end flex-shrink-0'>
              <Link
                to={{
                  pathname: `/accounts/fundreceive/edit/${data.projectPaymentID}`,
                  // state: {
                  //   projName: data.projectName,
                  //   projectID: data.projectID,
                  // },
                  state: {
                    ProjectID: ProjectID,
                    StartDate: StartDate,
                    EndTime: EndTime,
                    mainSearch: SearchText,
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

export {FundReceiveCard}
