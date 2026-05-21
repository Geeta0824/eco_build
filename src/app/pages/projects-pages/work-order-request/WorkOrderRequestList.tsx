import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'

import axios from 'axios'
import {Button, Modal} from 'react-bootstrap-v5'
import {IWorkOrderRequestModel} from '../../../models/projects-page/IWorkOrderRequestModel'
import {
  ApproveWorkOrderRequestApi,
  DeleteWorkOrderRequestByIDApi,
  GetWorkOrderRequestListAPI,
} from '../../../modules/project-master-page/work-order-request/WorkOrderRequestCRUD'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {DeleteProjectVendorDataAPI} from '../../../modules/project-master-page/vendor-Master-page/ProjectVendorCRUD'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'

type Props = {}

interface IProjectVendor {
  loading: boolean
  WorkOrderRequestData: IWorkOrderRequestModel[]
  tmpWorkOrderRequestData: IWorkOrderRequestModel[]
  projectData: IProjectModel[]
  selWorkOrderReqID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  selVendorID: number
  selVendorTypeName: string
  selVendorName: string
  SearchText: string
  selVendorCost: number
  tmpEmployeeID: number
  selworkOrderRequestID: number
  approveByID: number
  workStageID: number
  selworkStageID: number
}

const WorkOrderRequestList: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const {projectID} = useParams<{projectID: string}>()
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    WorkOrderRequestData: [] as IWorkOrderRequestModel[],
    tmpWorkOrderRequestData: [] as IWorkOrderRequestModel[],
    projectData: [] as IProjectModel[],
    selWorkOrderReqID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    selVendorID: 0,
    selVendorTypeName: '',
    selVendorName: '',
    SearchText: '',
    selVendorCost: 0,
    tmpEmployeeID: 0,
    selworkOrderRequestID: 0,
    approveByID: 0,
    workStageID: 0,
    selworkStageID: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      GetWorkOrderRequestListData(user.employeeID, mainSearch)
    }, 100)
  }, [])

  function GetWorkOrderRequestListData(tmpEmployeeID: number, mainSearch: string) {
    GetWorkOrderRequestListAPI(tmpEmployeeID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.vendorTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.assignDate.toString().includes(mainSearch.toLowerCase()) ||
                user.workCompleteDate.toString().includes(mainSearch.toLowerCase()) ||
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.vendorTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.description.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.workStageName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.amount.toString().includes(mainSearch.toLowerCase()) ||
                user.vendorName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })
            setState({
              ...state,
              WorkOrderRequestData: results,
              tmpWorkOrderRequestData: responseData,
              // tmpEmployeeID:tmpEmployeeID,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              WorkOrderRequestData: responseData,
              tmpWorkOrderRequestData: responseData,
              // tmpEmployeeID:tmpEmployeeID,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            WorkOrderRequestData: [],
            tmpWorkOrderRequestData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          WorkOrderRequestData: [],
          tmpWorkOrderRequestData: [],
          loading: false,
        })
      })
  }

  // ============================Approve Model==========================

  const [showApprove, setShowApprove] = useState(false)
  const handleCloseApprove = () => setShowApprove(false)
  const handleShowApprove = (tmpworkOrderRequestID: number, tmpworkStageID: number) => {
    setState({
      ...state,
      selworkOrderRequestID: tmpworkOrderRequestID,
      approveByID: user.employeeID,
      selworkStageID: tmpworkStageID,
      loading: false,
    })
    setShowApprove(true)
  }

  function WorkOrderReqApprove(selworkOrderRequestID: number, selworkStageID: number) {
    ApproveWorkOrderRequestApi(selworkOrderRequestID, state.approveByID, selworkStageID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Approved Successfull')
          GetWorkOrderRequestListData(user.employeeID, state.SearchText)
          setShowApprove(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowApprove(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowApprove(false)
      })
  }

  //==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (temWorkOrderReqID: number) => {
    setState({
      ...state,
      selWorkOrderReqID: temWorkOrderReqID,
      loading: false,
    })
    setShow(true)
  }

  //==================Delete Api ============================
  function deleteWorkOrderRequest(temWorkOrderReqID: number) {
    DeleteWorkOrderRequestByIDApi(temWorkOrderReqID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          GetWorkOrderRequestListData(user.employeeID, state.SearchText)
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpWorkOrderRequestData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.assignDate.toString().includes(keyword.toLowerCase()) ||
          user.workCompleteDate.toString().includes(keyword.toLowerCase()) ||
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.description.toLowerCase().includes(keyword.toLowerCase()) ||
          user.workStageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amount.toString().includes(keyword.toLowerCase()) ||
          user.vendorName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, WorkOrderRequestData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, WorkOrderRequestData: state.tmpWorkOrderRequestData})
      // If the text field is empty, show all users
      setTotal(state.tmpWorkOrderRequestData.length)
      setPage(1)
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
  const currentPosts: IWorkOrderRequestModel[] = state.WorkOrderRequestData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // ------------------------- For Project Details ---------------------
  const [showProDtl, setShowProDtl] = useState(false)
  function handleCloseProDtl() {
    setShowProDtl(false)
  }

  function handleShowProDtl(temProjectID: number) {
    getGetProjectDetailsList_ByProjectIDAPI(temProjectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          loading: false,
        })
      })
    setShowProDtl(true)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
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
              to={{pathname: `/projects/work-order-request/add`, state: {searchText: name}}}
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
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
                    <span className='d-block mb-1'>Assign Date</span>
                    <span className='text-muted fw-bold d-block fs-7'>Work Complete Date </span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-7'>Customer Name </span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1'>Vendor Name</span>
                    <span className='text-muted fw-bold d-block fs-7'>Vendor Type </span>
                  </th>

                  <th className='min-w-175px '>
                    <span className='d-block mb-1'>Description</span>
                  </th>

                  <th className='min-w-100px'>
                    <span className='d-flex mb-1'>Amount</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-flex mb-1'>Is Approve</span>
                  </th>
                  <th className={user.roleID === 2 || user.roleID === 3 ? 'min-w-100px' : 'd-none'}>
                    <span className='d-flex mb-1'>supervisor Name</span>
                  </th>
                  <th className={user.roleID === 2 || user.roleID === 3 ? 'min-w-100px' : 'd-none'}>
                    <span className='d-flex mb-1'> Approve</span>
                  </th>
                  <th className='min-w-75px text-end'>Edit | Delete</th>
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
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.assignDate}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.workCompleteDate}</span>
                        </td>
                        <td>
                          <span
                            className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'
                            title='Click Hear'
                            onClick={() => handleShowProDtl(data.projectID)}
                          >
                            {data.projectName}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.customerName}</span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.vendorName}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.vendorTypeName}</span>
                        </td>
                        <td>
                          <span className='text-dark  text-hover-primary d-block mb-1 fs-6'>
                            {data.description}
                          </span>
                        </td>

                        {/* <td className='text-dark text-hover-primary mb-1 fs-6'>{data.workOrder}</td> */}
                        <td className='text-dark text-hover-primary mb-1 fs-6'>{data.amount}</td>
                        <td>
                          <span className=' text-hover-primary fs-6'>
                            {data.isApprove === true ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td
                          className={
                            user.roleID === 2 || user.roleID === 3
                              ? 'text-dark text-hover-primary mb-1 fs-6'
                              : 'd-none'
                          }
                        >
                          {data.supervisorName}
                        </td>

                        <td
                          className={
                            user.roleID === 2 || user.roleID === 3 ? 'text-center' : 'd-none'
                          }
                        >
                          {data.isApprove === false ? (
                            <span
                              className='  text-success text-hover-info  mb-1 fs-7 badge badge-secondary   fw-bolder cursor-pointer text-center'
                              onClick={(e) =>
                                handleShowApprove(data.workOrderRequestID, data.workStageID)
                              }
                            >
                              Approve
                            </span>
                          ) : (
                            <span className='text-center me-1 text-muted'>N.A.</span>
                          )}
                        </td>

                        {data.isApprove == false ? (
                          <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              <Link
                                to={{
                                  pathname: `/projects/work-order-request/edit/${data.workOrderRequestID}`,
                                  state: {
                                    // projectID: projectID,
                                    searchText: name,
                                    // projectName: state.ProjectName,
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
                                onClick={() => handleShow(data.workOrderRequestID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='ssvg-icon-3 svg-icon-danger'
                                />
                              </div>
                            </div>
                          </td>
                        ) : (
                          <td className='text-center me-1 text-muted'>N.A.</td>
                        )}
                      </tr>
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

      {/* =====================Approval Model PopUp=============== */}
      <Modal show={showApprove} onHide={handleCloseApprove} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Work Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to Approve</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='success'
            onClick={() => WorkOrderReqApprove(state.selworkOrderRequestID, state.selworkStageID)}
          >
            Approve
          </Button>
          <Button variant='secondary' onClick={handleCloseApprove}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selWorkOrderReqID}
        pageName={'Work Order Request'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteWorkOrderRequest(state.selWorkOrderReqID)}
      />
      <ProjectDetailsModel
        data={state.projectData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
    </>
  )
}

export {WorkOrderRequestList}
