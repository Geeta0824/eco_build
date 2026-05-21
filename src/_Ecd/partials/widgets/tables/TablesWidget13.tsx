/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG} from '../../../helpers'

type Props = {
  className: string
}

const TablesWidget13: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Recent Orders</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 orders</span>
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          {/* begin::Menu 2 */}
          <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px'
            data-kt-menu='true'
          >
            {/* begin::Menu item */}
            <div className='menu-item px-3'>
              <div className='menu-content fs-6 text-dark fw-bolder px-3 py-4'>Quick Actions</div>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu separator */}
            <div className='separator mb-3 opacity-75'></div>
            {/* end::Menu separator */}
            {/* begin::Menu item */}
            <div className='menu-item px-3'>
              <span className='menu-link px-3'>
                New Ticket
              </span>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div className='menu-item px-3'>
              <span className='menu-link px-3'>
                New Customer
              </span>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div
              className='menu-item px-3'
              data-kt-menu-trigger='hover'
              data-kt-menu-placement='right-start'
              data-kt-menu-flip='left-start, top'
            >
              {/* begin::Menu item */}
              <span className='menu-link px-3'>
                <span className='menu-title'>New Group</span>
                <span className='menu-arrow'></span>
              </span>
              {/* end::Menu item */}
              {/* begin::Menu sub */}
              <div className='menu-sub menu-sub-dropdown w-175px py-4'>
                {/* begin::Menu item */}
                <div className='menu-item px-3'>
                  <span className='menu-link px-3'>
                    Admin Group
                  </span>
                </div>
                {/* end::Menu item */}
                {/* begin::Menu item */}
                <div className='menu-item px-3'>
                  <span className='menu-link px-3'>
                    Staff Group
                  </span>
                </div>
                {/* end::Menu item */}
                {/* begin::Menu item */}
                <div className='menu-item px-3'>
                  <span className='menu-link px-3'>
                    Member Group
                  </span>
                </div>
                {/* end::Menu item */}
              </div>
              {/* end::Menu sub */}
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div className='menu-item px-3'>
              <span className='menu-link px-3'>
                New Contact
              </span>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu separator */}
            <div className='separator mt-3 opacity-75'></div>
            {/* end::Menu separator */}
            {/* begin::Menu item */}
            <div className='menu-item px-3'>
              <div className='menu-content px-3 py-3'>
                <span className='btn btn-primary btn-sm px-4'>
                  Generate Reports
                </span>
              </div>
            </div>
            {/* end::Menu item */}
          </div>
          {/* end::Menu 2 */}
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-13-check'
                    />
                  </div>
                </th>
                <th className='min-w-150px'>Order Id</th>
                <th className='min-w-140px'>Country</th>
                <th className='min-w-120px'>Date</th>
                <th className='min-w-120px'>Company</th>
                <th className='min-w-120px'>Total</th>
                <th className='min-w-120px'>Status</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary fs-6'>
                    56037-XDER
                  </span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Brasil
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: PH</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    05/28/2020
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Intertico
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>
                    Web, UI/UX Design
                  </span>
                </td>
                <td className='text-dark fw-bolder text-hover-primary fs-6'>$3560</td>
                <td>
                  <span className='badge badge-light-success'>Approved</span>
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
                  <span className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary fs-6'>
                    05822-FXSP
                  </span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Belarus
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: BY</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    04/18/2021
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Agoda
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>
                    Houses &amp; Hotels
                  </span>
                </td>
                <td className='text-dark fw-bolder text-hover-primary fs-6'>$4850</td>
                <td>
                  <span className='badge badge-light-warning'>In Progress</span>
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
                  <span className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary fs-6'>
                    4472-QREX
                  </span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Phillipines
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: BH</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    07/23/2019
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    RoadGee
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Transportation</span>
                </td>
                <td className='text-dark fw-bolder text-hover-primary fs-6'>$8376</td>
                <td>
                  <span className='badge badge-light-danger'>Success</span>
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
                  <span className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary fs-6'>
                    00347-BCLQ
                  </span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Argentina
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: BR</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    12/21/2021
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    The Hill
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Insurance</span>
                </td>
                <td className='text-dark fw-bolder text-hover-primary fs-6'>$9486</td>
                <td>
                  <span className='badge badge-light-info'>Rejected</span>
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
                  <span className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-13-check' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary fs-6'>
                    59486-XDER
                  </span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Agoda
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: BT</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    05/28/2020
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Code: Paid</span>
                </td>
                <td>
                  <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                    Phillipines
                  </span>
                  <span className='text-muted fw-bold text-muted d-block fs-7'>Transportation</span>
                </td>
                <td className='text-dark fw-bolder text-hover-primary fs-6'>$8476</td>
                <td>
                  <span className='badge badge-light-primary'>Approved</span>
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
                  <span className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
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

export {TablesWidget13}
