/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {Link, useHistory} from 'react-router-dom'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'

type Props = {
  quotationID: number
  packageID: number
  customerName: string
  projectNumber: string
  color: string
  image: string
  title: string
  projectType: string
  bhkName: string
  areaName: string
  packageAmount: string
  totalProducts: string
  bhkid: number
  carpetAreaID: number
  mainEmployeeID:number,
  mainCustomerID:number,
  mainSearch:string
}

const ListCarpetryPackageCard: React.FC<Props> = ({
  quotationID,
  packageID,
  customerName,
  projectNumber,
  color,
  image,
  title,
  projectType,
  bhkName,
  areaName,
  packageAmount,
  totalProducts,
  bhkid,
  carpetAreaID,
  mainEmployeeID,
  mainCustomerID,
  mainSearch,
}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()
  return (
    <>
      <Link
        to={{
          pathname: `/quotations/ready-made-quotation/view-cart/${quotationID}`,
          state: {
            packageID: packageID,
            packageTypeID: 1,
            customerName: customerName,
            bhkName: bhkName,
            carpetAreaName: areaName,
            projectName: title,
            projectNumber: projectNumber,
            projectType: projectType,
            bhkid: bhkid,
            carpetAreaID: carpetAreaID,
            mainEmployeeID:mainEmployeeID,
            mainCustomerID:mainCustomerID,
            mainSearch:mainSearch,
          
          },
        }}
        // to={`customization-quotations/view-cart/${quotationID}`}
        className='card border border-2 border-gray-300 border-hover'
      >
        {/* <div className={`${className} h-100`}> */}
        <div className='shadow rounded'>
          <img src={toAbsoluteUrl(image)} className={'card-img-top rounded h-150px'} alt='image' />
          <div className='card-body p-5'>
            <h4 className='card-title'>{title}</h4>
            <div className='card-toolbar mb-2'>
              <span className={`badge badge-light-${color} fw-bolder me-auto px-4 py-3`}>
                {projectType}
              </span>
            </div>
            {/* begin::Row */}
            <div className='row g-0 mt-2'>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>BHK : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{bhkName}</div>
                </div>
              </div>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>Area : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{areaName}</div>
                </div>
              </div>
            </div>
            <div className='row g-0 mt-2'>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>Product : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{totalProducts}</div>
                </div>
              </div>
              <div className='col'>
                {/* begin::Label */}
                <div className='fs-7 text-muted fw-bold'>Amount : </div>
                {/* end::Label */}
                <div className='d-flex align-items-center'>
                  <div className='fs-4 fw-bolder'>{packageAmount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Link>
    </>
  )
}

export {ListCarpetryPackageCard}
