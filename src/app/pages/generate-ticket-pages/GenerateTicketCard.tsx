import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {RootState} from '../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../modules/auth/models/UserModel'
import {KTSVG} from '../../../_Ecd/helpers'
import {IGenerateTicketModel} from '../../models/generate-ticket/GenerateTicketModel'

type Props = {
  data: IGenerateTicketModel
  handleShowFlag: (path: string) => void
  handleShow: (id: number) => void
  handleShowDesign: (id: number) => void
  name: string
}

const GenerateTicketCard: React.FC<Props> = ({
  data,
  handleShowFlag,
  handleShow,
  handleShowDesign,
  name,
}) => {
  const pathUrl = process.env.REACT_APP_API_URL
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])

  return (
    <>
      <tr key={data.ticketID}>
        <td>
          <div
            className='symbol symbol-45px me-5 cursor-pointer'
            onClick={() => handleShowFlag(data.photoPath)}
          >
            <img src={pathUrl + data.photoPath} alt='' />
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-start flex-column'>
            <span className='text-dark text-hover-primary fs-6'>{data.projectName}</span>
          </div>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.customerName}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.employeeName}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.ticketCategory}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block fs-6'>{data.ticketRemarks}</span>
        </td>
        <td className='text-center'>
          <div
            onClick={() => handleShowDesign(data.ticketID)}
            className='btn btn-icon btn-bg-light bg-hover-info text-hover-inverse-info btn-sm me-1'
          >
            <KTSVG
              path='/media/icons/duotune/general/gen035.svg'
              className='svg-icon-2 svg-icon-success'
            />
          </div>
        </td>
        {user.roleID == 6 ||
          (user.roleID == 2 && (
            <td>
              <div className='d-flex justify-content-end flex-shrink-0'>
                <Link
                  to={{
                    pathname: `/generate-ticket/edit/${data.ticketID}`,
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
                  onClick={() => handleShow(data.ticketID)}
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

export {GenerateTicketCard}
