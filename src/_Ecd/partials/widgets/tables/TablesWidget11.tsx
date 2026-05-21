/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'

type Props = {
  className: string
}

const TablesWidget11: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>New Arrivals</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 new products</span>
        </h3>
        <div className='card-toolbar'>
          <span  className='btn btn-sm btn-light-primary'>
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
            New Member
          </span>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted bg-light'>
                <th className='ps-4 min-w-325px rounded-start'>Product</th>
                <th className='min-w-125px'>Price</th>
                <th className='min-w-125px'>Deposit</th>
                <th className='min-w-200px'>Agent</th>
                <th className='min-w-150px'>Status</th>
                <th className='min-w-200px text-end rounded-end'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                      <img
                        src={toAbsoluteUrl('/media/stock/600x400/img-26.jpg')}
                        className=''
                        alt=''
                      />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                      <span  className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                        Sant Extreanet Solution
                      </span>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>
                        HTML, JS, ReactJS
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $2,790
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Paid</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $520
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Rejected</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Bradly Beal
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Insurance</span>
                </td>
                <td>
                  <span className='badge badge-light-primary fs-7 fw-bold'>Approved</span>
                </td>
                <td className='text-end'>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-3' />
                  </span>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                  </span>
                  <span  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                      <img
                        src={toAbsoluteUrl('/media/stock/600x400/img-3.jpg')}
                        className=''
                        alt=''
                      />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                      <span  className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                        Telegram Development
                      </span>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>
                        C#, ASP.NET, MS SQL
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $4,790
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Paid</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $240
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Rejected</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Chris Thompson
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>NBA Player</span>
                </td>
                <td>
                  <span className='badge badge-light-danger fs-7 fw-bold'>In Progress</span>
                </td>
                <td className='text-end'>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-3' />
                  </span>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                  </span>
                  <span  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                      <img
                        src={toAbsoluteUrl('/media/stock/600x400/img-9.jpg')}
                        className=''
                        alt=''
                      />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                      <span  className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                        Payroll Application
                      </span>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>
                        PHP, Laravel, VueJS
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $4,390
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Paid</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $593
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Rejected</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Zoey McGee
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Ruby Developer</span>
                </td>
                <td>
                  <span className='badge badge-light-success fs-7 fw-bold'>Success</span>
                </td>
                <td className='text-end'>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-3' />
                  </span>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                  </span>
                  <span  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                      <img
                        src={toAbsoluteUrl('/media/stock/600x400/img-18.jpg')}
                        className=''
                        alt=''
                      />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                      <span  className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                        HR Management System
                      </span>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>
                        Python, PostgreSQL, ReactJS
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $7,990
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Paid</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $980
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Rejected</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Brandon Ingram
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Insurance</span>
                </td>
                <td>
                  <span className='badge badge-light-info fs-7 fw-bold'>Rejected</span>
                </td>
                <td className='text-end'>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-3' />
                  </span>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                  </span>
                  <span  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                      <img
                        src={toAbsoluteUrl('/media/stock/600x400/img-8.jpg')}
                        className=''
                        alt=''
                      />
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                      <span  className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                        Telegram Mobile
                      </span>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>
                        HTML, JS, ReactJS
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $5,790
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Paid</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    $750
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Rejected</span>
                </td>
                <td>
                  <span  className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Natali Trump
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Insurance</span>
                </td>
                <td>
                  <span className='badge badge-light-warning fs-7 fw-bold'>Approved</span>
                </td>
                <td className='text-end'>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-3' />
                  </span>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                  </span>
                  <span  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {TablesWidget11}
