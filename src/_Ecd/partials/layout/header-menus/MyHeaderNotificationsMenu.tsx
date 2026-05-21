/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl, defaultAlerts, defaultLogs} from '../../../helpers'
import {INotificationModel} from '../../../../app/models/dashboard-page/IDashboardModel'
import {UpdateNotification_IsSeenApi} from '../../../../app/modules/dashboard-page/DashboardCRUD'
import {toast} from 'react-toastify'

type Props = {
  data: INotificationModel[]
}

const MyHeaderNotificationsMenu: FC<Props> = ({data}) => {
  const history = useHistory()

  // // ===============Update API CALL=============
  function UpdateNotification(
    notificationId: number,
    quotationCategoryID: number,
    projectNumber: string,
    notificationTypeID: number
  ) {
    UpdateNotification_IsSeenApi(notificationId)
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          history.push(
            notificationTypeID == 1
              ? quotationCategoryID == 2
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
              : notificationTypeID == 2
              ? {pathname: `/meeting/list`, state: {notifSearch: projectNumber}}
              : notificationTypeID == 3
              ? {pathname: `/generate-penalty/list`, state: {notifSearch: projectNumber}}
              : notificationTypeID == 4
              ? {pathname: `/generate-ticket/list`, state: {notifSearch: projectNumber}}
              : notificationTypeID == 5
              ? {pathname: `/projects/list`, state: {notifSearch: projectNumber}}
              : notificationTypeID == 6
              ? quotationCategoryID == 1
                ? {pathname: `/projects/stage-change-req/list`, state: {notifSearch: projectNumber}}
                : quotationCategoryID == 2
                ? {
                    pathname: `/projects/diy-stage-change-req/list`,
                    state: {notifSearch: projectNumber},
                  }
                : quotationCategoryID == 3
                ? {
                    pathname: `/projects/modular-stage-change-req`,
                    state: {notifSearch: projectNumber},
                  }
                : quotationCategoryID == 4
                ? {
                    pathname: `/projects/designer-stage-change-req/list`,
                    state: {notifSearch: projectNumber},
                  }
                : ''
              : notificationTypeID == 7
              ? quotationCategoryID == 2
                ? {pathname: `/quotations/diy-quotation/list`, state: {notifSearch: projectNumber}}
                : quotationCategoryID == 1
                ? {
                    pathname: `/quotations/ready-made-quotation/list`,
                    state: {notifSearch: projectNumber},
                  }
                : quotationCategoryID == 4
                ? {
                    pathname: `/quotations/design-and-consultancy/list`,
                    state: {notifSearch: projectNumber},
                  }
                : quotationCategoryID == 3
                ? {
                    pathname: `/quotations/modular-quotation/list`,
                    state: {notifSearch: projectNumber},
                  }
                : ``
              : ''
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
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
      data-kt-menu='true'
    >
      <div
        className='d-flex flex-column bgi-no-repeat rounded-top'
        style={{backgroundImage: `url('${toAbsoluteUrl('/media/misc/pattern-1.jpg')}')`}}
      >
        <h4 className='text-white fw-bold px-9 mt-8 mb-4'>
          {/* <span className='fs-8 opacity-75 ps-3'>{data.length}</span> */}
          {data.length} Notifications
        </h4>
      </div>

      <div className='tab-content'>
        <div className='tab-pane fade show active' id='kt_topbar_notifications_3' role='tabpanel'>
          <div className='scroll-y mh-325px my-5 px-5'>
            {data.length > 0 &&
              data.map((log, index) => (
                <span
                  key={log.notificationID}
                  className='d-flex flex-stack py-4 cursor-pointer bg-hover-light-primary'
                  onClick={() =>
                    UpdateNotification(
                      log.notificationID,
                      log.quotationCategoryID,
                      log.projectNumber,
                      log.notificationTypeID
                    )
                  }
                >
                  <div className='d-flex align-items-center me-1'>
                    {/* <span className={clsx('w-70px badge', `badge-light-${log.state}`, 'me-4')}>
                    {log.code}
                  </span> */}
                    <span className='text-gray-800 text-hover-primary fw-bold'>
                      <span className='badge badge-light fs-8'>{log.date}</span> {log.title}
                    </span>
                    {/* <span className='badge badge-light fs-8'>{log.date}</span> */}
                  </div>
                </span>
              ))}
          </div>
          <div className='py-3 text-center border-top'>
            <Link to={`/notification`} className='btn btn-color-gray-600 btn-active-color-primary'>
              View All
              <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-5' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export {MyHeaderNotificationsMenu}
