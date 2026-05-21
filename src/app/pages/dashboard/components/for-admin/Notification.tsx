import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {NotificationCard} from './NotificationCard'
import {INotificationModel} from '../../../../models/dashboard-page/IDashboardModel'
import {
  GetNotification_DiscountReq_ListApi,
  UpdateNotification_IsSeenApi,
} from '../../../../modules/dashboard-page/DashboardCRUD'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import Header_Search from '../../../../../components/table-header/Header_Search'
import {useParams} from 'react-router-dom'

type Props = {}

interface INoti {
  loading: boolean
  NotificationData: INotificationModel[]
  tmpNotificationData: INotificationModel[]
  searchText: string
  selDeparId: number
  activeID: number
  activeType: any
}

const Notification: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<INoti>({
    loading: false,
    NotificationData: [] as INotificationModel[],
    tmpNotificationData: [] as INotificationModel[],
    searchText: '',
    selDeparId: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getNotificationData()
    }, 100)
  }, [])

  // ===============GET API CALL=============
  function getNotificationData() {
    GetNotification_DiscountReq_ListApi(user.employeeID)
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          setState({
            ...state,
            NotificationData: responseData.responseObject,
            tmpNotificationData: responseData.responseObject,
            loading: false,
          })
          setTotal(responseData.responseObject.length)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, NotificationData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, NotificationData: [], loading: false})
      })
  }

  // // ===============GET API CALL=============
  // function UpdateNotification(NotificationData: INotificationModel[]) {
  //   UpdateNotification_IsSeenApi(parseInt(atob(notificationId)))
  //     .then((response) => {
  //       let responseData = response.data
  //       if (responseData.isSuccess == true) {
  //         setState({
  //           ...state,
  //           NotificationData: NotificationData,
  //           tmpNotificationData: NotificationData,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.massege}`)
  //         setState({...state, loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, loading: false})
  //     })
  // }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')
  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpNotificationData.filter((user) => {
        return (
          // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.title.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, NotificationData: results, searchText: keyword})
      setTotal(results.length)
    } else {
      setState({...state, NotificationData: state.tmpNotificationData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpNotificationData.length)
    }
    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: INotificationModel[] = state.NotificationData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className={`card-header border-0`}>
          <Header_Search searchText={name} filter={(e) => filter(e)} />
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Notification</th>
                  <th className='min-w-25px'>Date</th>
                  <th className='min-w-25px'>Create By</th>
                  {/* <th className='min-w-100px text-end'>Edit | Delete</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return <NotificationCard data={data} />
                  })}
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
          <div className='text-center'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notification
