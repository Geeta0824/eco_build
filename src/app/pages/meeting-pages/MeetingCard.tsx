import { useEffect, useState } from 'react'

import React from 'react'
import { Link } from 'react-router-dom'
import { IMeetingModel } from '../../models/meeting-page/IMeetingModel'
import { KTSVG } from '../../../_Ecd/helpers'
import { UserModel } from '../../modules/auth/models/UserModel'

type props = {
  data: IMeetingModel
  user: UserModel
  handleShowEmployee: (data: IMeetingModel) => void
  handleShowMeeting: (data: IMeetingModel) => void
  handleShowMeetingJoin: (data: IMeetingModel) => void
}

const MeetingCard: React.FC<props> = ({
  data,
  user,
  handleShowEmployee,
  handleShowMeeting,
  handleShowMeetingJoin,
}) => {
  const [canJoin, setCanJoin] = useState(false)

  useEffect(() => {
    const currentDate = new Date()
    const meetingStart = new Date(`${data.meetingDateTime} ${data.startTime}`)
    const meetingEnd = new Date(`${data.meetingDateTime} ${data.endTime}`)

    // Check if current time is between the start and end time of the meeting
    if (currentDate >= meetingStart && currentDate <= meetingEnd) {
      setCanJoin(true)
    } else {
      setCanJoin(false)
    }
  }, [data])

  return (
    <>
      <tr key={data.meetingID}>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
            {data.meetingDateTime}
          </span>
          <span className='text-muted d-block fs-7'>
            {data.startTime} To {data.endTime}{' '}
          </span>
        </td>
        <td>
          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>{data.projectName}</span>
          <span className='text-muted d-block fs-7'>{data.customerName}</span>
        </td>
        <td>
          <span className=' text-hover-primary fs-6'>{data.isClient ? 'Yes' : 'No'}</span>
        </td>

        <td>
          <span className=' text-hover-primary fs-6'>{data.isAgency ? 'Yes' : 'No'}</span>
        </td>

        <td>
          <div
            onClick={() => handleShowEmployee(data)}
            className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1'
          >
            <KTSVG
              path='/media/icons/duotune/social/soc005.svg'
              className='svg-icon-2x svg-icon-success'
            />
          </div>
        </td>

        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a className='text-dark text-hover-primary fs-6'>{data.description}</a>
            </div>
          </div>
        </td>

        <td>
          <div className='d-flex align-items-center'>
            <div className='d-flex justify-content-start flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.meetingVenueName}
              </a>
            </div>
          </div>
        </td>

        <td>
          <div className='d-flex '>
            <div className='d-flex  flex-column'>
              <a href='#' className='text-dark text-hover-primary fs-6'>
                {data.meetingStatusName}
              </a>
            </div>
          </div>
        </td>

          <td className=''>
            {canJoin && data.isPresent === false ? (
              <span
                className='text-white text-hover-warning mb-1 fs-7 badge badge-success fw-bolder cursor-pointer text-center'
                onClick={() => handleShowMeetingJoin(data)}
              >
                Join
              </span>
            ) : (
              <span className='text-muted mb-1 fs-7 badge badge-secondary fw-bolder text-center'>
                N.A
              </span>
            )}
          </td>
      
        {(data.meetingBy == user.employeeID || user.roleID == 2 || user.roleID == 1) && (
          <td className='text-center'>
            <div
              onClick={() => handleShowMeeting(data)}
              className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-danger btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen049.svg'
                className='svg-icon-2x svg-icon-success'
              />
            </div>
          </td>
        )}
        {(data.meetingBy == user.employeeID || user.roleID == 2 || user.roleID == 1) && (
          <td>
            <div className='d-flex justify-content-end flex-shrink-0'>
              <Link
                to={{
                  pathname: `/meeting/edit/${data.meetingID}`,
                }}
                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
              >
                <KTSVG
                  path='/media/icons/duotune/art/art005.svg'
                  className='svg-icon-3 svg-icon-primary'
                />
              </Link>
            </div>
          </td>
        )}
      </tr>
    </>
  )
}

export { MeetingCard }
