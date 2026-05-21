import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {IExpenseModel} from '../../../models/master-page/IExpenseTypeMode'
import {
  deleteExpenseTypeData,
  getExpenseTypeList,
  isActiveExpenseTypeData,
} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
// import {ExpenseTypeCard} from './ExpenseTypeCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

import {IMeetingTypeModel} from '../../../models/master-page/IMeetingTypeModel'
import {GetMeetingTypeList} from '../../../modules/meeting-mst-pages/MeetingCRUD'
import {MeetingTypeCard} from './MeetingTypeCard'
import {DeleteMeetingType} from '../../../modules/master-page/meeting-type-page/MeetingTypeCRUD'

interface ICountry {
  loading: boolean
  expenseData: IExpenseModel[]
  meetingTypeData: IMeetingTypeModel[]
  tmpMeetingTypeData: IMeetingTypeModel[]
  imageShow: string
  SearchText: string
  selMeetingTypeID: number
  activeID: number
  activeType: any
  pathUrl: any
}

type Props = {}

const MeetingTypeList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ICountry>({
    loading: false,
    expenseData: [] as IExpenseModel[],
    meetingTypeData: [] as IMeetingTypeModel[],
    tmpMeetingTypeData: [] as IMeetingTypeModel[],
    imageShow: '',
    SearchText: '',
    selMeetingTypeID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let SearchText: string = ''
      if (lc != undefined) {
        SearchText = lc.search
      }
      getMeetingTypeListData(SearchText)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getMeetingTypeListData(SearchText: string) {
    GetMeetingTypeList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (SearchText !== '') {
            const results = responseData.filter((user: any) => {
              return (
                // user.expenseTypeName.toLowerCase().startsWith(SearchText.toLowerCase()) ||
                user.meetingTypeName.toLowerCase().startsWith(SearchText.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              meetingTypeData: results,
              tmpMeetingTypeData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              meetingTypeData: responseData,
              tmpMeetingTypeData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(SearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, meetingTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, meetingTypeData: [], loading: false})
      })
  }

  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (meetingTypeID: number) => {
    setState({
      ...state,
      selMeetingTypeID: meetingTypeID,
      loading: false,
    })
    setShow(true)
  }

  const deleteMeetingTypeData = (meetingTypeID: number) => {
    DeleteMeetingType(meetingTypeID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getMeetingTypeListData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpMeetingTypeData.filter((user) => {
        return (
          // user.expenseTypeName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.meetingTypeName.toLowerCase().startsWith(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, meetingTypeData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, meetingTypeData: state.tmpMeetingTypeData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpMeetingTypeData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IMeetingTypeModel[] = state.meetingTypeData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/meeting-type/add'}
          title='Click to add a Expense Type'
        />
        {/* <div className='card-header border-0 py-2 bg-dark'>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </span>
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/accounts/expenseType/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div> */}
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-secondary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Meeting Type</th>

                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <MeetingTypeCard
                        data={data}
                        handleShow={() => handleShow(data.meetingTypeID)}
                        name={name}
                      />
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={15}
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selMeetingTypeID}
        pageName={'Meeting Type'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteMeetingTypeData(state.selMeetingTypeID)}
      />
    </>
  )
}

export default MeetingTypeList
