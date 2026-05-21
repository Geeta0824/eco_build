import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {IAgencyTypeModel, IVenderModel} from '../../models/master-page/IVenderModel'
import {
  IEmployeeModel,
  IMeetingCloseModel,
  IMeetingModel,
} from '../../models/meeting-page/IMeetingModel'
import {
  GetMeetingListApi,
  GetMeetingListByEmployeeApi,
  UpdateMeeting_IsJoinApi,
  UpdateMeetingCloseDetails,
} from '../../modules/meeting-mst-pages/MeetingCRUD'
import {MeetingCard} from './MeetingCard'
import {Button, Modal} from 'react-bootstrap-v5'
import moment from 'moment'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import Header_Search from '../../../components/table-header/Header_Search'

type Props = {}

interface IDesignation {
  loading: boolean
  meetingData: IMeetingModel[]
  empl: IEmployeeModel[]
  // employeeList: IEmployeeModel[]
  tmpMeetingData: IMeetingModel[]
  vendorData: IVenderModel[]
  temVendorDataData: IVenderModel[]
  objVendorData: IVenderModel
  objMeetingData: IMeetingModel
  objAgencyTypeData: IAgencyTypeModel[]
  meetingCloseData: IMeetingCloseModel[]
  SearchText: string
  selMeetingEndDate: string
  selMeetingEndTime: string
  selConclusion: string
  selProjectName: string
  selVenderID: number
  activeID: number
  activeType: any
  agencyTypeID: number
  vendorTypeID: number
  selMeetingID: number
  selStatusID: number
}

const MeetingList: React.FC<Props> = () => {
  const location = useLocation()
  const [modalLoader, setModalLoader] = useState(false)
  const [state, setState] = useState<IDesignation>({
    loading: false,
    meetingData: [] as IMeetingModel[],
    empl: [] as IEmployeeModel[],
    // employeeList: [] as IEmployeeModel[],
    tmpMeetingData: [] as IMeetingModel[],
    vendorData: [] as IVenderModel[],
    temVendorDataData: [] as IVenderModel[],
    objVendorData: {} as IVenderModel,
    objMeetingData: {} as IMeetingModel,
    objAgencyTypeData: [] as IAgencyTypeModel[],
    meetingCloseData: [] as IMeetingCloseModel[],
    SearchText: '',
    selMeetingEndDate: moment(new Date()).format('YYYY-MM-DD'),
    selMeetingEndTime: moment(new Date()).format('HH:mm'),
    selConclusion: '',
    selProjectName: '',
    vendorTypeID: 0,
    selMeetingID: 0,
    selStatusID: 0,
    selVenderID: 0,
    activeID: 0,
    agencyTypeID: 0,
    activeType: false,
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      GetMeetingListData()
    }, 100)
  }, [])

  function GetMeetingListData() {
    GetMeetingListByEmployeeApi(user.employeeID, user.roleID, user.designationID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess) {
          setState({
            ...state,
            meetingData: responseData,
            tmpMeetingData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, meetingData: [], loading: false})
        toast.error(`${error}`)
      })
  }
  // ===========================Join===========================================

  const [showJoin, setShowJoin] = useState(false)
  const handleCloseJoin = () => setShowJoin(false)
  const handleShowJoin = (tmpMeetingID: number) => {
    setState({
      ...state,
      selMeetingID: tmpMeetingID,
      loading: false,
    })
    setShowJoin(true)
  }

  function handleMeetingJoin(tmpMeetingID: number) {
    UpdateMeeting_IsJoinApi(tmpMeetingID, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Success')
          GetMeetingListData()
          setShowJoin(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowJoin(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowJoin(false)
      })
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpMeetingData.filter((user) => {
        return (
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.description.toLowerCase().includes(keyword.toLowerCase()) ||
          user.meetingVenueName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.meetingStatusName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, meetingData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, meetingData: state.tmpMeetingData})
      // If the text field is empty, show all users
      setTotal(state.tmpMeetingData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ==================Meeeting Close Model Function===============
  const [showEmployee, setShowEmployee] = useState(false)
  const handleCloseEmployee = () => {
    setShowEmployee(false)
  }
  const handleShowEmployee = (data: IMeetingModel) => {
    setState({...state, empl: data.employeeList, objMeetingData: data})
    setShowEmployee(true)
  }

  // ==================================

  const [meetingEndDate, setmeetingEndDate] = useState<any>(moment(new Date()).format('YYYY-MM-DD'))

  function handleEndDateChange(event: any) {
    const value = event.target.value
    const elementId = event.target.id
    setmeetingEndDate(value)
  }
  const [conclusion, setConclusion] = useState<any>()
  function handleChangeconclusion(event: any) {
    const value = event.target.value
    const elementId = event.target.id
    console.log(value)

    setConclusion(value)
  }

  const [meetingEndTime, setmeetingEndTime] = useState<any>(moment(new Date()).format('HH:mm'))

  function handleEndTimeChange(event: any) {
    const value = event.target.value
    const elementId = event.target.id
    console.log(value)

    setmeetingEndTime(value)
  }

  const [showMeeting, setShowMeeting] = useState(false)
  const handleCloseMeeting = () => {
    setmeetingEndDate(moment(new Date()).format('YYYY-MM-DD'))
    setmeetingEndTime(moment(new Date()).format('HH:mm'))
    setConclusion('')

    setState({
      ...state,
      selMeetingID: 0,
      selStatusID: 0,
      loading: false,
    })

    setShowMeeting(false)
  }

  const handleShowMeeting = (tmpMeetingID: number, tmpStatusID: number, projectName: string) => {
    setState({
      ...state,
      selMeetingID: tmpMeetingID,
      selStatusID: tmpStatusID,
      selProjectName: projectName,
      loading: false,
    })

    setShowMeeting(true)
  }

  function handleMeeeting() {
    if (!conclusion || conclusion.trim() === '') {
      return toast.error('Conclusion field is required')
    }

    UpdateMeetingCloseDetails(
      state.selMeetingID,
      state.selStatusID,
      meetingEndDate,
      meetingEndTime,
      conclusion
    )
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess) {
          setState({
            ...state,
            selMeetingID: state.selMeetingID,
            selStatusID: state.selStatusID,
            // selMeetingEndDate: state.selMeetingEndDate,
            // selMeetingEndTime: state.selMeetingEndTime,
            meetingCloseData: responseData,
            loading: false,
          })
          setPage(1)
          setShowMeeting(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            selMeetingID: state.selMeetingID,
            selStatusID: state.selStatusID,
            // selMeetingEndDate: state.selMeetingEndDate,
            // selMeetingEndTime: state.selMeetingEndTime,
            meetingCloseData: responseData,
            loading: false,
          })
          setPage(1)
          setShowMeeting(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowMeeting(false)
      })

    setConclusion('')
    setmeetingEndDate(moment(new Date()).format('YYYY-MM-DD'))
    setmeetingEndTime(moment(new Date()).format('HH:mm'))
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
  const currentPosts: IMeetingModel[] = state.meetingData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <Header_Search searchText={name} filter={filter} />

          {user.roleID == 1 ||
            (user.roleID == 2 && (
              <div
                className='card-toolbar'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='Click to add a user'
              >
                <Link
                  to={{pathname: '/meeting/add', state: {mainSearch: name}}}
                  className='btn btn-sm btn-light-primary bg-white'
                  // data-bs-toggle='modal'
                  // data-bs-target='#kt_modal_invite_friends'
                >
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                  Add New
                </Link>
              </div>
            ))}
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
                  <th className='min-w-175px'>
                    <span className='d-block mb-1'>Meeting Date</span>
                    <span className='text-muted fw-bold d-block fs-7'>Start Time To End Time </span>
                  </th>

                  {/* <th className='min-w-150px'>Project</th> */}
                  <th className='min-w-175px'>
                    <span className='d-block mb-1'>Project</span>
                    <span className='text-muted fw-bold d-block fs-7'>Customer Name </span>
                  </th>
                  <th className='min-w-40px text-center '>Is Client</th>
                  <th className='min-w-40px text-center'>Is Agency</th>
                  <th className='min-w-40px '>Employee</th>
                  <th className='min-w-140px'>Meeting Purpose</th>
                  <th className='min-w-40px'>Venue</th>
                  <th className='min-w-40px '>Status</th>
                  <th className='min-w-40px text-center'>Join</th>
                  {(user.roleID == 1 || user.roleID == 2) && (
                    <th className='min-w-40px  text-center'>Action</th>
                  )}
                  {<th className='min-w-40px text-end'>Edit</th>}
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
                      <MeetingCard
                        data={data}
                        handleShowEmployee={() => handleShowEmployee(data)}
                        handleShowMeeting={(data) =>
                          handleShowMeeting(data.meetingID, data.statusID, data.projectName)
                        }
                        handleShowMeetingJoin={(data) => handleShowJoin(data.meetingID)}
                        user={user}
                      />
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
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

      {/* -============================================================ */}
      <Modal size='lg' show={showMeeting} onHide={handleCloseMeeting} centered keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#008080'}}>
          <div className='d-block'>
            <Modal.Title className='text-light'>Meeting close</Modal.Title>
          </div>
          <div className='d-block'>
            <Modal.Title className='text-light'>Project Name : {state.selProjectName}</Modal.Title>
          </div>
          {/* <Modal.Title>{state.selProjectNo}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <div className='row mb-6 text-center'>
            <label className='col-lg-2 col-form-label required fw-bold fs-6'>Close Date:</label>
            <div className='col-lg-4 fv-row d-flex'>
              <input
                type='date'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                value={meetingEndDate}
                min={moment(new Date()).format('YYYY-MM-DD')}
                onChange={(e) => handleEndDateChange(e)}
                disabled
              />
            </div>
            {/* </div> */}
            <label className='col-lg-3 col-form-label required fw-bold fs-6'>Close Time :</label>
            <div className='col-lg-3 fv-row d-flex'>
              <input
                type='time'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                min={moment(new Date()).format('HH:mm')}
                value={meetingEndTime}
                autoFocus
                onChange={(e) => handleEndTimeChange(e)}
              />
            </div>
          </div>
          <div className='row mb-6 text-center'>
            <label className='col-lg-2 col-form-label required fw-bold fs-6'>Conclusion:</label>
            <div className='col-lg-10 fv-row d-flex'>
              <textarea
                rows={2}
                className='form-control form-control-lg form-control-solid bg-light-primary'
                placeholder='Conclusion'
                value={conclusion}
                autoFocus
                onChange={(e) => handleChangeconclusion(e)}
              />
            </div>
          </div>
          <div className='text-end'>
            <Button variant='primary' className='text-center' onClick={handleMeeeting}>
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* ===============================Employee==============================
       */}

      <Modal size='lg' show={showEmployee} onHide={handleCloseEmployee} centered keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <div className='d-block'>
            <Modal.Title className='text-white'>Employee List</Modal.Title>
          </div>
          <div className='d-block'>
            <Modal.Title className='text-white'>
              Project Name: {state.objMeetingData.projectName}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='card-body p-0'>
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                <thead className='bg-light-primary'>
                  <tr className='fw-bolder fs-5'>
                    {/* <th className='min-w-50px'>Sr.No.</th> */}
                    <th className='min-w-150px'>Employee Name</th>
                    <th className='min-w-50px'>Role Name</th>
                    <th className='min-w-25px'>Is Present</th>
                  </tr>
                </thead>
                <tbody className="border-bottom">
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {state.empl.length > 0 &&
                        state.empl.map((data, index) => {
                          return (
                            <tr
                              key={data.employeeID}
                              // className={data.isComplete === true ? 'text-success' : ''}
                              className={'bg-hover-light-primary text-hover-primary'}
                              // onClick={() => selectEmployee(data)}
                            >
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.employeeName}
                                </span>
                              </td>

                              <td>
                                <span className=' text-hover-primary fs-6'>{data.roleName}</span>
                              </td>

                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.isPresent === true ? 'Yes' : 'No'}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={state.empl.length}
                        loading={state.loading}
                        colSpan={9}
                      />
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* =====================Join Model PopUp=============== */}
      <Modal show={showJoin} onHide={handleCloseJoin} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Join Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to Join</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='success' onClick={() => handleMeetingJoin(state.selMeetingID)}>
            Join
          </Button>
          <Button variant='secondary' onClick={handleCloseJoin}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MeetingList
