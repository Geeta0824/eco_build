import {Pagination} from 'antd'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Modal, Button} from 'react-bootstrap-v5'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {
  IAddonWorkOrderChangeReqModel,
  IDIYStageChangeReqModel,
  IOtherVendorWorkChangeReqModel,
} from '../../../models/projects-page/IStageChangeReqModel'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {
  ModualrOtherVendorWorkStageChangeApproveReqAPI,
  ModualrOtherWorkOrderStagReqListForAdminReqListAPI,
  ModularPMCAddonWorkStageChangeApproveReqAPI,
  ModularPMCAddonWorkStageReqListForAdminReqListAPI,
  ModularProjectStageChangeApproveReqAPI,
  ModularStageChangeReqListForAdminReqListAPI,
} from '../../../modules/project-master-page/stage-change-req-page/ModularStageChangeReqCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'

interface ICustomer {
  loading: boolean
  stageChangeReqData: IDIYStageChangeReqModel[]
  tmpStageChangeReqData: IDIYStageChangeReqModel[]
  addonWrkOdrChangeReqData: IAddonWorkOrderChangeReqModel[]
  tmpAddonWrkOdrChangeReqData: IAddonWorkOrderChangeReqModel[]
  otherVendorWrkOdrChangeReqData: IOtherVendorWorkChangeReqModel[]
  tmpOtherVendorWrkOdrChangeReqData: IOtherVendorWorkChangeReqModel[]
  projectData: IProjectModel[]
  selProjectVendorPaymentStructureID: number
  selProjectPMCVendorMapDtlID: number
  selProjectVendorId: number
}

const ModularStageChangeReqList = () => {
  const [modalLoader, setModalLoader] = useState(false)
  const [state, setState] = useState<ICustomer>({
    loading: false,
    stageChangeReqData: [] as IDIYStageChangeReqModel[],
    tmpStageChangeReqData: [] as IDIYStageChangeReqModel[],
    addonWrkOdrChangeReqData: [] as IAddonWorkOrderChangeReqModel[],
    tmpAddonWrkOdrChangeReqData: [] as IAddonWorkOrderChangeReqModel[],
    otherVendorWrkOdrChangeReqData: [] as IOtherVendorWorkChangeReqModel[],
    tmpOtherVendorWrkOdrChangeReqData: [] as IOtherVendorWorkChangeReqModel[],
    projectData: [] as IProjectModel[],
    selProjectVendorPaymentStructureID: 0,
    selProjectPMCVendorMapDtlID: 0,
    selProjectVendorId: 0,
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getStageChangeReqListData()
    }, 100)
  }, [])

  function getStageChangeReqListData() {
    ModularStageChangeReqListForAdminReqListAPI()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            stageChangeReqData: responseData,
            tmpStageChangeReqData: responseData,
          })
          setTotal(responseData.length)
          setPage(1)
          setModalLoader(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, stageChangeReqData: []})
          setModalLoader(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, stageChangeReqData: []})
        setModalLoader(false)
      })
  }

  // ============== Addon Work Change =================
  function getAddonWorkOrderChangeReqListData() {
    ModularPMCAddonWorkStageReqListForAdminReqListAPI()
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
            stageChangeReqData: [],
            tmpAddonWrkOdrChangeReqData: [],
          })
          setModalLoader(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          stageChangeReqData: [],
          tmpAddonWrkOdrChangeReqData: [],
        })
        setModalLoader(false)
      })
  }
  // ============== Other Work Change =================
  function getPMCOtherWorkChangeReqListData() {
    ModualrOtherWorkOrderStagReqListForAdminReqListAPI()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            otherVendorWrkOdrChangeReqData: responseData,
            tmpOtherVendorWrkOdrChangeReqData: responseData,
          })
          setModalLoader(false)
          setTotalOther(responseData.length)
          setPageOther(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            stageChangeReqData: [],
            tmpOtherVendorWrkOdrChangeReqData: [],
          })
          setModalLoader(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          stageChangeReqData: [],
          tmpOtherVendorWrkOdrChangeReqData: [],
        })
        setModalLoader(false)
      })
  }
  // ===========================================Approve Model==========================

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (temProjectVendorPaymentStructureID: number) => {
    setState({
      ...state,
      selProjectVendorPaymentStructureID: temProjectVendorPaymentStructureID,
      loading: false,
    })
    setShow(true)
  }
  // =================== Addon Work ===================
  // const [showOther, setShowOther] = useState(false)
  // const handleCloseOther = () => setShowOther(false)
  const handleShowOtherWorkOrder = (temProjectVendorId: number) => {
    setState({
      ...state,
      selProjectVendorId: temProjectVendorId,
      loading: false,
    })
    setShow(true)
  }
  // =================== Addon Work ===================
  // const [showAddon, setShowAddon] = useState(false)
  // const handleCloseAddon = () => setShowAddon(false)
  const handleShowAddonWorkOrder = (projectPMCVendorMapDtlID: number) => {
    setState({
      ...state,
      selProjectPMCVendorMapDtlID: projectPMCVendorMapDtlID,
      loading: false,
    })
    setShow(true)
  }

  function stageReqApprove(selProjectVendorPaymentStructureID: number) {
    ModularProjectStageChangeApproveReqAPI(selProjectVendorPaymentStructureID, user.employeeID)
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
  // =========================== Addon Work Stage =====================
  function addonWorkStageApprove(selProjectVendorPaymentStructureID: number) {
    ModularPMCAddonWorkStageChangeApproveReqAPI(selProjectVendorPaymentStructureID, user.employeeID)
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

  // =========================== Other Vendor Work=====================
  function OtherVendorWorkStageApprove(selProjectVendorPaymentStructureID: number) {
    ModualrOtherVendorWorkStageChangeApproveReqAPI(
      selProjectVendorPaymentStructureID,
      user.employeeID
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Approved Successfull')
          getPMCOtherWorkChangeReqListData()
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

  // ================== Comman for tabbing======================
  const [tab, setTab] = useState(0)
  function handleChangeTab(type: number) {
    state.stageChangeReqData = []
    state.addonWrkOdrChangeReqData = []
    state.otherVendorWrkOdrChangeReqData = []
    setModalLoader(true)
    if (type == 0) {
      getStageChangeReqListData()
    } else if (type == 1) {
      getAddonWorkOrderChangeReqListData()
    } else if (type == 2) {
      getPMCOtherWorkChangeReqListData()
      // (state.selProjectID)
    }
    setTab(type)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpStageChangeReqData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.supervisorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stageCompleteDate.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, stageChangeReqData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, stageChangeReqData: state.tmpStageChangeReqData})
      setTotal(state.tmpStageChangeReqData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const [total, setTotal] = useState(state.stageChangeReqData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDIYStageChangeReqModel[] = state.stageChangeReqData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  // ======================= Addon Work Stage ========================
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
  const currentPostsAddon: IAddonWorkOrderChangeReqModel[] = state.addonWrkOdrChangeReqData.slice(
    indexOfFirstPageAddon,
    indexOfLastPageAddon
  )
  const onShowSizeChangeAddon = (current: any, pageSize: any) => {
    setPostPerPageAddon(pageSize)
  }

  // ======================= Addon Work Stage ========================
  //------------------- the value of the search field----------------
  const [nameOther, setNameOther] = useState('')
  const filterOther = (e: any) => {
    const keywordOther = e.target.value

    if (keywordOther !== '') {
      const results = state.tmpOtherVendorWrkOdrChangeReqData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keywordOther.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keywordOther.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keywordOther.toLowerCase()) ||
          user.supervisorName.toLowerCase().includes(keywordOther.toLowerCase()) ||
          user.remarks.toLowerCase().includes(keywordOther.toLowerCase())
        )
      })
      setState({...state, otherVendorWrkOdrChangeReqData: results})
      setTotalOther(results.length)
      setPageOther(1)
    } else {
      setState({...state, otherVendorWrkOdrChangeReqData: state.tmpOtherVendorWrkOdrChangeReqData})
      setTotalOther(state.tmpOtherVendorWrkOdrChangeReqData.length)
      setPageOther(1)
    }
    setNameOther(keywordOther)
  }

  // ================ Pagination Other Vendor ================
  const [totalOther, setTotalOther] = useState(state.otherVendorWrkOdrChangeReqData.length) //  length
  const [pageOther, setPageOther] = useState(1)
  const [postPerPageOther, setPostPerPageOther] = useState(10)
  const indexOfLastPageOther = pageOther * postPerPageOther
  const indexOfFirstPageOther = indexOfLastPageOther - postPerPageOther
  const currentPostsOther: IOtherVendorWorkChangeReqModel[] =
    state.otherVendorWrkOdrChangeReqData.slice(indexOfFirstPageOther, indexOfLastPageOther)
  const onShowSizeChangeOther = (current: any, pageSize: any) => {
    setPostPerPageOther(pageSize)
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
      {' '}
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
                  PMC Work Stage
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` + (tab == 1 ? 'active' : '')
                  }
                  onClick={() => handleChangeTab(1)}
                >
                  PMC Addon Work Order
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` + (tab == 2 ? 'active' : '')
                  }
                  onClick={() => handleChangeTab(2)}
                >
                  Other Vendor Work
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className='card-header'>
        <div className='card-title text-primary fs-3 fw-bolder pb-3'>
          {tab == 0
            ? `Stage Change Request List`
            : tab == 1
            ? `Addon Work Change Request List`
            : tab == 2
            ? `Other Vendor Change Request List`
            : ''}
        </div>
      </div> */}
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
                                    onClick={(e) =>
                                      handleShowAddonWorkOrder(data.projectPMCVendorMapDtl)
                                    }
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
      ) : tab == 2 ? (
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
                  onChange={filterOther}
                  value={nameOther}
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
                      <span className='d-block  mb-1  me-8'>Other Vendor Work Name</span>
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
                  {' '}
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {currentPostsOther.length > 0 &&
                        currentPostsOther.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6 me-8 text-start'>
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
                                    onClick={(e) => handleShowOtherWorkOrder(data.projectVendorID)}
                                  >
                                    Approve
                                  </span>
                                </td>
                              )}
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={currentPostsOther.length}
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
                onChange={(value: any) => setPageOther(value)}
                pageSize={postPerPageOther}
                total={totalOther}
                current={pageOther}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeOther}
                showTotal={(totalOther) => `Total Other ${totalOther} items`}
              ></Pagination>
            </div>
          </div>
        </div>
      ) : null}
      {/* =====================Approval Model PopUp=============== */}
      <Modal show={show} onHide={handleClose} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          {tab == 0 ? (
            <Modal.Title>Approve Stage</Modal.Title>
          ) : tab == 1 ? (
            <Modal.Title>Addon Work Order</Modal.Title>
          ) : tab == 2 ? (
            <Modal.Title>Other Vendor Work Order</Modal.Title>
          ) : null}
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to Approve</h4>
        </Modal.Body>
        <Modal.Footer>
          {tab == 0 ? (
            <Button
              variant='success'
              onClick={() => stageReqApprove(state.selProjectVendorPaymentStructureID)}
            >
              Approve
            </Button>
          ) : tab == 1 ? (
            <Button
              variant='success'
              onClick={() => addonWorkStageApprove(state.selProjectPMCVendorMapDtlID)}
            >
              Approve
            </Button>
          ) : tab == 2 ? (
            <Button
              variant='success'
              onClick={() => OtherVendorWorkStageApprove(state.selProjectVendorId)}
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

export default ModularStageChangeReqList
