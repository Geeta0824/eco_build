/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'

type Props = {
  className: string
}

const ListsWidget2_2: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bolder text-dark'>Today Present Employee</h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-2'>
        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          {/* begin::Avatar */}
          <div className='symbol symbol-50px me-5'>
            <img src={toAbsoluteUrl('/media/avatars/300-6.jpg')} className='' alt='' />
          </div>
          {/* end::Avatar */}
          {/* begin::Text */}
          <div className='flex-grow-1'>
            <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
              Emma Smith
            </a>
            <span className='text-muted d-block fw-bold'>Project Manager</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          {/* begin::Avatar */}
          <div className='symbol symbol-50px me-5'>
            <img src={toAbsoluteUrl('/media/avatars/300-5.jpg')} className='' alt='' />
          </div>
          {/* end::Avatar */}
          {/* begin::Text */}
          <div className='flex-grow-1'>
            <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
              Sean Bean
            </a>
            <span className='text-muted d-block fw-bold'>PHP, SQLite, Artisan CLI</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-center'>
          {/* begin::Avatar */}
          <div className='symbol symbol-50px me-5'>
            <img src={toAbsoluteUrl('/media/avatars/300-23.jpg')} className='' alt='' />
          </div>
          {/* end::Avatar */}
          {/* begin::Text */}
          <div className='flex-grow-1'>
            <a href='#' className='text-dark fw-bolder text-hover-primary fs-6'>
              Dan Wilson
            </a>
            <span className='text-muted d-block fw-bold'>PHP, SQLite, Artisan CLI</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ListsWidget2_2}
