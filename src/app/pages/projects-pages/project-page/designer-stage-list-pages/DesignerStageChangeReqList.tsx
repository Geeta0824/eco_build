import {Pagination} from 'antd'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../../_Ecd/helpers'
import {Modal, Button} from 'react-bootstrap-v5'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {
  Approve_ProjectDesignStage_ByDesignerAPI,
  DesignStageChangeReqListForDesignerListAPI,
  Reject_ProjectDesignStage_ByDesignerAPI,
} from '../../../../modules/master-page/pmc-work-stage-master-page/PMCWorkStageCRUD'
import {IDesignerStageChangeModel} from '../../../../models/projects-page/ProjectDesignerStageModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../../../models/projects-page/IProjectsModel'
import {ProjectDetailsModel} from '../../../common-pages/ProjectDetailsModel'

interface ICustomer {
  loading: boolean
  DIYStageChangeReqData: IDesignerStageChangeModel[]
  tmpDIYStageChangeReqData: IDesignerStageChangeModel[]
  projectData: IProjectModel[]
  selProjectDesignStageMapID: number
  selProjectPMCVendorMapDtlID: number
}

const DesignerStageChangeReqList = () => {
  const [modalLoader, setModalLoader] = useState(false)
  const [state, setState] = useState<ICustomer>({
    loading: false,
    DIYStageChangeReqData: [] as IDesignerStageChangeModel[],
    tmpDIYStageChangeReqData: [] as IDesignerStageChangeModel[],
    projectData: [] as IProjectModel[],
    selProjectDesignStageMapID: 0,
    selProjectPMCVendorMapDtlID: 0,
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getProjectDesignStageChangeReqData()
    }, 100)
  }, [])

  function getProjectDesignStageChangeReqData() {
    DesignStageChangeReqListForDesignerListAPI()
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
  const handleShow = (temProjectDesignStageMapID: number) => {
    setState({
      ...state,
      selProjectDesignStageMapID: temProjectDesignStageMapID,
      loading: false,
    })
    setShow(true)
  }

  function stageReqApprove(temProjectDesignStageMapID: number) {
    Approve_ProjectDesignStage_ByDesignerAPI(
      temProjectDesignStageMapID,
      user.employeeID,
      '192.33.66'
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Approved Successfull')
          getProjectDesignStageChangeReqData()
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDIYStageChangeReqData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.designerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
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
  const currentPosts: IDesignerStageChangeModel[] = state.DIYStageChangeReqData.slice(
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

  // =================== Reject ===================
  const [showReject, setShowReject] = useState(false)
  const handleCloseReject = () => setShowReject(false)
  const handleShowReject = (temProjectDesignStageMapID: number) => {
    setState({
      ...state,
      selProjectDesignStageMapID: temProjectDesignStageMapID,
      loading: false,
    })
    setShowReject(true)
  }

  function designStageReqReject(temProjectDesignStageMapID: number) {
    setShowReject(false)
    Reject_ProjectDesignStage_ByDesignerAPI(temProjectDesignStageMapID, '192.33.66')
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Reject Successfull')
          getProjectDesignStageChangeReqData()
          setShowReject(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowReject(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowReject(false)
      })
  }

  return (
    <>
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
                    <span className='d-block  mb-1 me-4'>Designer Name</span>
                  </th>
                  <th className='min-w-100px text-center'>Approve</th>
                  <th className='min-w-100px text-center'>Reject</th>
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
                                {data.designerName}
                              </span>
                            </td>
                            {data.isStageApprove === true ? (
                              <span>N.A</span>
                            ) : (
                              <td className='text-center'>
                                <span
                                  className='  text-success text-hover-info  mb-1 fs-7 badge badge-secondary   fw-bolder cursor-pointer text-center'
                                  onClick={(e) => handleShow(data.projectDesignStageMapID)}
                                >
                                  Approve
                                </span>
                              </td>
                            )}
                            <td className='text-center'>
                              <span
                                className='text-dark text-hover-white mb-1 fs-7 badge badge-primary fw-bolder cursor-pointer text-center'
                                onClick={(e) => handleShowReject(data.projectDesignStageMapID)}
                              >
                                Reject
                              </span>
                            </td>
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
      {/* =====================Approval Model PopUp=============== */}
      <Modal show={show} onHide={handleClose} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Designer Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to Approve</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='success'
            onClick={() => stageReqApprove(state.selProjectDesignStageMapID)}
          >
            Approve
          </Button>
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
      <Modal show={showReject} onHide={handleCloseReject} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Design Stage Change Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to Reject?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() => designStageReqReject(state.selProjectDesignStageMapID)}
          >
            Reject
          </Button>
          <Button variant='secondary' onClick={handleCloseReject}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DesignerStageChangeReqList
