import {useEffect} from 'react'
import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import {INotificationModel} from '../../../../models/dashboard-page/IDashboardModel'
import {toast} from 'react-toastify'
import {UpdateNotification_IsSeenApi} from '../../../../modules/dashboard-page/DashboardCRUD'

type props = {
  data: INotificationModel
}

const NotificationCard: React.FC<props> = ({data}) => {
  const history = useHistory()

  // // ===============Update API CALL=============
  function UpdateNotification(
    notificationId: number,
    quotationCategoryID: number,
    projectNumber: string
  ) {
    UpdateNotification_IsSeenApi(notificationId)
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          history.push(
            quotationCategoryID == 2
              ? {pathname: `/discount-req/diy-req/list`, state: {notifSearch: projectNumber}}
              : quotationCategoryID == 1
              ? {
                  pathname: `/discount-req/carpetry-cust-req/list`,
                  state: {notifSearch: projectNumber},
                }
              : quotationCategoryID == 4
              ? {
                  pathname: `/discount-req/design-consultancy-dis-req/list`,
                  state: {notifSearch: projectNumber},
                }
              : quotationCategoryID == 3
              ? {
                  pathname: `/discount-req/modular-dis-req/list`,
                  state: {notifSearch: projectNumber},
                }
              : ``
          )
        } else {
          toast.error(`${response.data.massege}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  return (
    <>
      <tr
        key={data.notificationID}
        className='cursor-pointer bg-hover-light-primary'
        onClick={() =>
          UpdateNotification(data.notificationID, data.quotationCategoryID, data.projectNumber)
        }
      >
        <td>
          <span className='text-dark text-hover-primary fs-6'>{data.title}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary fs-6'>{data.date}</span>
        </td>
        <td>
          <span className='text-dark text-hover-primary fs-6'>{data.createByName}</span>
        </td>
      </tr>
    </>
  )
}
export {NotificationCard}
