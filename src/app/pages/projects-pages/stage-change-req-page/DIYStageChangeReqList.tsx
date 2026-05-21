import {Pagination} from 'antd'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Modal, Button} from 'react-bootstrap-v5'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {
  IDIYStageChangeReqModel,
  IOtherVendorWorkChangeReqModel,
} from '../../../models/projects-page/IStageChangeReqModel'
import {
  DIYOtherWorkOrderStagReqListForAdminReqListAPI,
  DIYOtherWorkStageChangeApproveAPI,
  DIYStageChangeReqListAPI,
  projectDIYStageChangeApproveAPI,
} from '../../../modules/project-master-page/stage-change-req-page/StageChangeReqCRUD'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import { ProjectDetailsModel } from '../../common-pages/ProjectDetailsModel'

interface ICustomer {
  loading: boolean
  DIYStageChangeReqData: IDIYStageChangeReqModel[]
  tmpDIYStageChangeReqData: IDIYStageChangeReqModel[]
  addonWrkOdrChangeReqData: IOtherVendorWorkChangeReqModel[]
  tmpAddonWrkOdrChangeReqData: IOtherVendorWorkChangeReqModel[]
  projectData: IProjectModel[]
  selVendorAgencyWorkStageID: number
  selProjectPMCVendorMapDtlID: number
}

const DIYStageChangeReqList = () => {
  const [modalLoader, setModalLoader] = useState(false)
  const [state, setState] = useState<ICustomer>({
    loading: false,
    DIYStageChangeReqData: [] as IDIYStageChangeReqModel[],
    tmpDIYStageChangeReqData: [] as IDIYStageChangeReqModel[],
    addonWrkOdrChangeReqData: [] as IOtherVendorWorkChangeReqModel[],
    tmpAddonWrkOdrChangeReqData: [] as IOtherVendorWorkChangeReqModel[],
    projectData: [] as IProjectModel[],
    selVendorAgencyWorkStageID: 0,
    selProjectPMCVendorMapDtlID: 0,
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getStageChangeReqListData()
    }, 100)
  }, [])

  function getStageChangeReqListData() {
    DIYStageChangeReqListAPI()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            DIYStageChangeReqData: responseData,
            tmpDIYStageChangeReqData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
          setModalLoader(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, DIYStageChangeReqData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, DIYStageChangeReqData: [], loading: false})
      })
  }

  // ===========================================Approve Model==========================

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (temVendorAgencyWorkStageID: number) => {
    setState({
      ...state,
      selVendorAgencyWorkStageID: temVendorAgencyWorkStageID,
      loading: false,
    })
    setShow(true)
  }

  function stageReqApprove(temVendorAgencyWorkStageID: number) {
    projectDIYStageChangeApproveAPI(temVendorAgencyWorkStageID, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Approved Successfull')
          getStageChangeReqListData()
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

  // ============== Addon Work Change =================
  function getAddonWorkOrderChangeReqListData() {
    DIYOtherWorkOrderStagReqListForAdminReqListAPI()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            addonWrkOdrChangeReqData: responseData,
            tmpAddonWrkOdrChangeReqData: responseData,
          })
          setTotalAddon(responseData.length)
          setPageAddon(1)
          setModalLoader(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            DIYStageChangeReqData: [],
            tmpAddonWrkOdrChangeReqData: [],
          })
          setModalLoader(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          DIYStageChangeReqData: [],
          tmpAddonWrkOdrChangeReqData: [],
        })
        setModalLoader(false)
      })
  }

  function OtherVendorWorkStageApprove(selProjectVendorPaymentStructureID: number) {
    DIYOtherWorkStageChangeApproveAPI(selProjectVendorPaymentStructureID, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Approved Successfull')
          getAddonWorkOrderChangeReqListData()
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

  // -------------------------------------------------------------------
  // ================== Comman for tabbing======================
  const [tab, setTab] = useState(0)
  function handleChangeTab(type: number) {
    state.DIYStageChangeReqData = []
    state.addonWrkOdrChangeReqData = []
    setModalLoader(true)
    if (type == 0) {
      getStageChangeReqListData()
    } else if (type == 1) {
      getAddonWorkOrderChangeReqListData()
    }
    setTab(type)
  }

  // -----------------------------------------------------------------
  const handleShowAddonWorkOrder = (projectPMCVendorMapDtlID: number) => {
    setState({
      ...state,
      selProjectPMCVendorMapDtlID: projectPMCVendorMapDtlID,
      loading: false,
    })
    setShow(true)
  }

  //------------------- the value of the search field----------------
  const [nameAddon, setNameAddon] = useState('')
  const filterAddon = (e: any) => {
    const keywordAddon = e.target.value

    if (keywordAddon !== '') {
      const results = state.tmpAddonWrkOdrChangeReqData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keywordAddon.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keywordAddon.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keywordAddon.toLowerCase()) ||
          user.supervisorName.toLowerCase().includes(keywordAddon.toLowerCase()) ||
          user.remarks.toLowerCase().includes(keywordAddon.toLowerCase())
        )
      })
      setState({...state, addonWrkOdrChangeReqData: results})
      setTotalAddon(results.length)
      setPageAddon(1)
    } else {
      setState({...state, addonWrkOdrChangeReqData: state.tmpAddonWrkOdrChangeReqData})
      setTotalAddon(state.tmpAddonWrkOdrChangeReqData.length)
      setPageAddon(1)
    }
    setNameAddon(keywordAddon)
  }

  // ================Pagination ================
  const [totalAddon, setTotalAddon] = useState(state.addonWrkOdrChangeReqData.length) //  length
  const [pageAddon, setPageAddon] = useState(1)
  const [postPerPageAddon, setPostPerPageAddon] = useState(10)
  const indexOfLastPageAddon = pageAddon * postPerPageAddon
  const indexOfFirstPageAddon = indexOfLastPageAddon - postPerPageAddon
  const currentPostsAddon: IOtherVendorWorkChangeReqModel[] = state.addonWrkOdrChangeReqData.slice(
    indexOfFirstPageAddon,
    indexOfLastPageAddon
  )
  const onShowSizeChangeAddon = (current: any, pageSize: any) => {
    setPostPerPageAddon(pageSize)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDIYStageChangeReqData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.supervisorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.agencyTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stageCompleteDate.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, DIYStageChangeReqData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, DIYStageChangeReqData: state.tmpDIYStageChangeReqData})
      setTotal(state.tmpDIYStageChangeReqData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const [total, setTotal] = useState(state.DIYStageChangeReqData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDIYStageChangeReqModel[] = state.DIYStageChangeReqData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

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
      <div className='card mb-2 border'>
        <div className='ms-5 pt-2 pb-1'>
          <div className='d-flex overflow-auto h-55px'>
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` + (tab == 0 ? 'active' : '')
                  }
                  onClick={() => handleChangeTab(0)}
                >
                  Agency Work
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` + (tab == 1 ? 'active' : '')
                  }
                  onClick={() => handleChangeTab(1)}
                >
                  Other Work
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {tab == 0 ? (
        <div className={`card `}>
          {/* begin::Header */}
          <div className='card-header border-0 py-2' style={{backgroundColor: '#000000'}}>
            <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  placeholder='Search'
                  onChange={filter}
                  value={name}
                />
              </span>
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='py-3 text-center'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-bordered align-middle g-2'>
                {/* begin::Table head */}
                <thead className='bg-light-primary'>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-120x text-start '>
                      <span className='d-block  mb-1  me-8 '>Project Name</span>
                      <span className='text-muted fw-bold d-block  fs-6 me-8'>Customer Name</span>
                    </th>
                    <th className='min-w-25x text-start '>
                      <span className='d-block  mb-1  me-8'>Stage Name</span>
                      <span className='text-muted fw-bold d-block  fs-6  me-8'>Change Date</span>
                    </th>
                    <th className='min-w-150px text-start'>
                      <span className='d-block  mb-1 me-4'>Agency Name</span>
                    </th>
                    <th className='min-w-150px text-start'>
                      <span className='d-block  mb-1 me-4'>Vendor Name</span>
                      <span className='text-muted fw-bold d-block  fs-6'>supervisor Name</span>
                    </th>
                    <th className='min-w-100pxtext-center'>Approve</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {currentPosts.length > 0 &&
                        currentPosts.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <span
                                  className='text-dark text-hover-primary d-block mb-1 fs-6 me-8 text-start cursor-pointer'
                                  title='Click Hear'
                                  onClick={() => handleShowProDtl(data.projectID)}
                                >
                                  {data.projectName}
                                </span>
                                <span className='text-muted d-block fs-7 me-8 text-start'>
                                  {data.customerName}
                                </span>
                              </td>
                              <td>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start '>
                                  {data.stageName}
                                </span>
                                <span className='text-muted d-block fs-7 text-start'>
                                  {data.stageCompleteDate}
                                </span>
                              </td>
                              <td>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                  {data.agencyTypeName}
                                </span>
                              </td>
                              <td>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                  {data.companyName}
                                </span>
                                <span className='text-muted d-block fs-7 text-start'>
                                  {data.supervisorName}
                                </span>
                              </td>
                              {data.isStageApprove === true ? (
                                <span>N.A</span>
                              ) : (
                                <td className='text-center'>
                                  <span
                                    className='  text-success text-hover-info  mb-1 fs-7 badge badge-secondary   fw-bolder cursor-pointer text-center'
                                    onClick={(e) => handleShow(data.vendorAgencyWorkStageID)}
                                  >
                                    Approve
                                  </span>
                                </td>
                              )}
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={currentPosts.length}
                        loading={state.loading}
                        colSpan={5}
                      />
                    </>
                  )}
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
          </div>{' '}
        </div>
      ) : tab == 1 ? (
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
                  placeholder='Search'
                  onChange={filterAddon}
                  value={nameAddon}
                />
              </span>
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='py-3 text-center'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-bordered align-middle g-2'>
                {/* begin::Table head */}
                <thead className='bg-light-primary'>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-120x text-start '>
                      <span className='d-block  mb-1  me-8 '>Project Name</span>
                      <span className='text-muted fw-bold d-block  fs-6 me-8'>Customer Name</span>
                    </th>
                    <th className='min-w-25x text-start '>
                      <span className='d-block  mb-1  me-8'>Addon Work Order Name</span>
                      <span className='text-muted fw-bold d-block  fs-6  me-8'>Change Date</span>
                    </th>
                    <th className='min-w-120px text-start'>
                      <span className='d-block  mb-1 me-4'>Vendor Name</span>
                      <span className='text-muted fw-bold d-block  fs-6'>supervisor Name</span>
                    </th>

                    <th className='min-w-100pxtext-center'>Approve</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {currentPostsAddon.length > 0 &&
                        currentPostsAddon.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <span
                                  className='text-dark text-hover-primary d-block mb-1 fs-6 me-8 text-start cursor-pointer'
                                  title='Click Hear'
                                  onClick={() => handleShowProDtl(data.projectID)}
                                >
                                  {data.projectName}
                                </span>
                                <span className='text-muted d-block fs-7 me-8 text-start'>
                                  {data.customerName}
                                </span>
                              </td>
                              <td>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start '>
                                  {data.remarks}
                                </span>
                                <span className='text-muted d-block fs-7 text-start'>
                                  {data.workCompleteRequestDate}
                                </span>
                              </td>
                              <td>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                  {data.companyName}
                                </span>
                                <span className='text-muted d-block fs-7 text-start'>
                                  {data.supervisorName}
                                </span>
                              </td>
                              {data.isWorkCompleteRequestApprove === true ? (
                                <span>N.A</span>
                              ) : (
                                <td className='text-center'>
                                  <span
                                    className='  text-success text-hover-info  mb-1 fs-7 badge badge-secondary   fw-bolder cursor-pointer text-center'
                                    onClick={(e) => handleShowAddonWorkOrder(data.projectVendorID)}
                                  >
                                    Approve
                                  </span>
                                </td>
                              )}
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={currentPostsAddon.length}
                        loading={state.loading}
                        colSpan={5}
                      />
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPageAddon(value)}
                pageSize={postPerPageAddon}
                total={totalAddon}
                current={pageAddon}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeAddon}
                showTotal={(totalAddon) => `Total Addon ${totalAddon} items`}
              ></Pagination>
            </div>
          </div>
        </div>
      ) : null}
      {/* =====================Approval Model PopUp=============== */}
      <Modal show={show} onHide={handleClose} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Approve DIY Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to Approve</h4>
        </Modal.Body>
        <Modal.Footer>
          {tab == 0 ? (
            <Button
              variant='success'
              onClick={() => stageReqApprove(state.selVendorAgencyWorkStageID)}
            >
              Approve
            </Button>
          ) : tab == 1 ? (
            <Button
              variant='success'
              onClick={() => OtherVendorWorkStageApprove(state.selProjectPMCVendorMapDtlID)}
            >
              Approve
            </Button>
          ) : null}
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ProjectDetailsModel
        data={state.projectData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
    </>
  )
}

export default DIYStageChangeReqList
