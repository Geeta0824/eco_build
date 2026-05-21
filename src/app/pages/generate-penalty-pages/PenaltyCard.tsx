import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {RootState} from '../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../modules/auth/models/UserModel'
import {KTSVG} from '../../../_Ecd/helpers'
import {IGeneratePenaltyModel} from '../../models/generate-penalty/GeneratePenaltyModel'

type Props = {
  data: IGeneratePenaltyModel
  handleShow: (id: number) => void
  handleShowApprove: (id: number) => void
  name: string
}

const PenaltyCard: React.FC<Props> = ({data, handleShow, handleShowApprove, name}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.penaltyID}>
        <td>
          <div className='d-flex align-items-center'>
            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
              <span className='text-dark text-hover-primary fs-5'>{data.projectName}</span>
              <span className='text-muted d-block fs-6 mt-1'>{data.customerName}</span>
            </div>
          </div>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
            {data.penaltyTypeName}
          </span>
          <span className='text-muted d-block fs-6'>
            {data.approvalForName == '' ? 'N.A' : data.approvalForName}
          </span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
            {data.penaltyForName}
          </span>
          <span className='text-muted d-block fs-6'>
            {data.employeeName == '' ? 'N.A' : data.employeeName}
          </span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
            {data.departmentName == '' ? 'N.A' : data.departmentName}
          </span>
          <span className='text-muted d-block fs-6'>{data.amount}</span>
        </td>
        {/* <td>
          <span className='badge badge-secondary text-dark text-hover-primary fs-6'>
            {data.amount}
          </span>
        </td> */}
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.remarks}</span>
        </td>
        <td className='text-center'>
          <span
            className='  text-success text-hover-info  mb-1 fs-6 badge badge-secondary   fw-bolder cursor-pointer text-center'
            onClick={(e) => handleShowApprove(data.penaltyID)}
          >
            Approve
          </span>
        </td>
        {user.roleID == 6 ||
          (user.roleID == 2 && (
            <td>
              <div className='d-flex justify-content-end flex-shrink-0'>
                <Link
                  to={{
                    pathname: `/generate-penalty/edit/${data.penaltyID}`,
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
                  onClick={() => handleShow(data.penaltyID)}
                  className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                >
                  <KTSVG
                    path='/media/icons/duotune/general/gen027.svg'
                    className='ssvg-icon-3 svg-icon-danger'
                  />
                </div>
              </div>
            </td>
          ))}
      </tr>
    </>
  )
}

export {PenaltyCard}
