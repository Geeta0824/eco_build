import {useEffect} from 'react'
import {KTSVG} from '../../../../_Ecd/helpers'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import React from 'react'
import {Link} from 'react-router-dom'
import {IVenderModel} from '../../../models/master-page/IVenderModel'

type props = {
  data: IVenderModel
  handleShowAgencyType: (data: IVenderModel) => void
  handleShowActive: (e: any) => void
  handleShow: (id: number) => void
  name: string
}
const VenderCard: React.FC<props> = ({
  data,
  handleShowAgencyType,
  handleShowActive,
  handleShow,
  name,
}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.vendorID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.vendorTypeName}
              </a>
            </div>
          </div>
        </td>
        <td>
          {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? (
            <div className='d-flex align-items-center'>
              <div className='text-dark text-hover-primary fs-6'>{data.companyName}</div>
            </div>
          ) : (
            <div className='text-dark text-hover-primary fs-6'>N.A</div>
          )}
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.contactPerson}
              </a>
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.contactNumber}
              </a>
            </div>
          </div>
        </td>
        {/* <td className='text-center'>
          {data.vendorTypeID === 1 ? (
            <Link
              to={{
                pathname: `/vender/pay-str/${data.vendorID}/list`,
                state: {
                  custName: data.contactPerson,
                  companyName: data.companyName,
                },
              }}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              title='View'
            >
              <span className='fa fa-eye fs-2'></span>
            </Link>
          ) : (
            <div className='text-dark text-hover-primary text-center fs-6'>N.A</div>
          )}
        </td> */}
        {/* {user.roleID == 1 ? ( */}
        <td className='text-center'>
          <Link
            to={{pathname: `/vender/change-password`, state: {vendorID: data.vendorID}}}
            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Change Password'
          >
            {/* <span className='fa fa-eye fs-2'></span> */}
            <KTSVG
              path='/media/icons/duotune/general/gen047.svg'
              className='svg-icon-2x svg-icon-primary'
            />
          </Link>
        </td>
        {/* ) : ( */}
        {/* <td className='d-none'></td> */}
        {/* )} */}

        {/* <td className='text-center'> */}
        {/* {data.vendorTypeID === 1 ? ( */}
        {/* <div
            onClick={() => handleShowAgencyType(data)}
            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
          >
            <KTSVG
              path='/media/icons/duotune/social/soc005.svg'
              className='svg-icon-2x svg-icon-primary'
            />
          </div> */}
        {/* ) : (
            <div className='text-dark text-hover-primary text-center fs-6'>N.A</div>
          )} */}
        {/* </td> */}
        {/* <td className='text-center'> */}
        {/* {data.vendorTypeID === 1 ? ( */}
        {/* <Link
            to={{
              pathname: `/vender/agency-list/${data.vendorID}`,
              state: {
                vendorID: data.vendorID,
                custName: data.contactPerson,
                companyName: data.companyName,
                searchText: name,
              },
            }}
            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            title='Agency'
          >
            <KTSVG
              path='/media/icons/duotune/communication/com014.svg'
              className='svg-icon-1 svg-icon-danger'
            />
          </Link> */}
        {/* ) : (
            <div className='text-dark text-hover-primary text-center fs-6'>N.A</div>
          )} */}
        {/* </td> */}
        <td>
          <div className='form-check form-switch'>
            <input
              id={`${data.vendorID}`}
              className='form-check-input'
              type='checkbox'
              checked={data.isActive}
              onChange={(e) => handleShowActive(e)}
            />
          </div>
        </td>
        <td className='text-center'>
          <Link
            to={{pathname: `/vender/view/${data.vendorID}`, state: {searchText: name}}}
            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='View Vendor'
          >
            <span className='fa fa-eye fs-2'></span>
          </Link>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/vender/edit/${data.vendorID}/edit`,
                state: {
                  vendorID: data.vendorID,
                  companyName: data.companyName,
                  searchText: name,
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
              onClick={() => handleShow(data.vendorID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='ssvg-icon-3 svg-icon-danger'
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}
export {VenderCard}
