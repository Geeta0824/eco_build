import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Button, Modal} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import LoaderInTable from '../common-pages/LoaderInTable'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import Loader from '../common-pages/Loader'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {IProjectModel} from '../../models/projects-page/IProjectsModel'
import {getAllProjectListByRoleIDAndEmployeeIDAPI} from '../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectMaterialModel} from '../../models/Reports-page/IWorkHistoryModel'
import {GetProjectWise_MaterialInfo_ReportAPI} from '../../modules/material-report-page/MaterialReportCRUD'
import ProjectModal from './ProjectModal'
import ProjectMaterialData from './ProjectMaterialData'

type Props = {}

interface IDIY {
  loading: boolean
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel[]
  projectMaterialData: IProjectMaterialModel[]
  tmpProjectMaterialData: IProjectMaterialModel[]
  searchText: string
  selProjectName: string
  selCustomerName: string
  stageName: string
  selProjectID: number
  stageID: number
  selProjectCategoryID: number
}

const ProjectMaterilaReportList: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDIY>({
    loading: false,
    projectData: [] as IProjectModel[],
    tmpProjectData: [] as IProjectModel[],
    projectMaterialData: [] as IProjectMaterialModel[],
    tmpProjectMaterialData: [] as IProjectMaterialModel[],
    searchText: '',
    selProjectName: '',
    selCustomerName: '',
    stageName: '',
    selProjectID: 0,
    stageID: 0,
    selProjectCategoryID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var searchText: any = ''
      if (lc != undefined) {
        searchText = lc.searchText
      }
      getAllAddonItemData(state.searchText)
    }, 100)
  }, [])

  function getAllAddonItemData(searchText: string) {
    getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
      .then((response) => {
        let responseData = response.data
        let projectData = responseData.responseObject
        if (responseData.isSuccess == true) {
          setState({
            ...state,
            projectData: projectData,
            tmpProjectData: projectData,
            loading: false,
          })
          setTotal(projectData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, projectData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectData: [], loading: false})
      })
  }

  function getAllDIYQuotationData(tmpProjectData: IProjectModel) {
    GetProjectWise_MaterialInfo_ReportAPI(
      tmpProjectData.projectID,
      tmpProjectData.projectCategoryID
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            projectMaterialData: responseData,
            tmpProjectMaterialData: responseData,
            selProjectName: tmpProjectData.projectName,
            selCustomerName: tmpProjectData.firstName + ' ' + tmpProjectData.lastName,
            selProjectID: tmpProjectData.projectID,
            stageID: response.data.stageID,
            stageName: response.data.stageName,
            selProjectCategoryID: tmpProjectData.projectCategoryID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectMaterialData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectMaterialData: [], loading: false})
      })
  }
  // -----------------------------------------------------------

  const [show, setShow] = useState(false)
  function handleShow() {
    setShow(true)
  }
  function handleClose() {
    setShow(false)
  }

  function selectProject(tmpProjectData: IProjectModel) {
    getAllDIYQuotationData(tmpProjectData)
    setState({...state, loading: true})
    setShow(false)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(15)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ----------------------------------------------------------
  const [proName, setProName] = useState('')
  const filterByString = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpProjectData.filter((user) => {
        return (
          user.mobileNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectType.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toString()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.remainingAmount.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectData: state.tmpProjectData})
      setTotal(state.tmpProjectData.length)
      setPage(1)
    }
    setProName(keyword)
  }

  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  //------------------- the search result-----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpProjectMaterialData.filter((user) => {
        return user.stageName.toLowerCase().includes(keyword.toLowerCase())
      })
      setState({...state, projectMaterialData: results})
    } else {
      setState({...state, projectMaterialData: state.tmpProjectMaterialData})
    }
    setName(keyword)
  }

  return (
    <>
      <div className={`card`}>
        <div
          className='card-header border-0 py-2 p-0'
          style={{backgroundColor: '#000000', justifyContent: 'initial'}}
        >
          <div className='border-0 p-2'>
            <form className='w-100 position-relative' autoComplete='off'>
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
            </form>
          </div>

          <div className='mb-2 d-flex'>
            <label className='text-white me-5 mt-5 fs-5'>Select Project : </label>
            <span className='mt-5 fw-bolder fs-6 text-primary d-flex align-item-center fs-5'>
              {state.selProjectName}
            </span>
            <div className='fv-row'>
              <div
                className='mt-3 btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 p-5 ms-6'
                onClick={handleShow}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen004.svg'
                  className='svg-icon-2 svg-icon-white'
                />
              </div>
            </div>
            <label
              className={state.selProjectID === 0 ? 'd-none' : 'text-white me-5 mt-5 fs-5 ms-2'}
            >
              Customer Name :{' '}
            </label>
            <span
              className={
                state.selProjectID === 0
                  ? 'd-none'
                  : 'mt-5 fw-bolder fs-6 text-primary d-flex align-item-center fs-5'
              }
            >
              {state.selCustomerName}
            </span>

            <div
              className={state.selProjectID === 0 ? 'd-none' : 'position-absolute top-1 m-2 end-0'}
            >
              <Link
                to={{
                  pathname: `/reports/project-material/download`,
                  state: {
                    ProjectName: state.selProjectName,
                    ProjectID: state.selProjectID,
                    ProjectCategoryID: state.selProjectCategoryID,
                  },
                }}
                className='symbol symbol-40px cursor-pointer d-block justify-content-center text-center'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='View PDF'
              >
                <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
              </Link>
            </div>
          </div>
        </div>
        {/* begin::Body */}
        <div className='card-body p-4'>
          <div className='table-responsive'>
            <table className='table table-hover table-borderless align-middle'>
              <thead className='bg-dark'>
                <tr className='text-light fw-bold fs-6 text-uppercase'>
                  <th className='min-w-200px ps-2'>Material Name</th>
                  <th className='min-w-150px text-center'>Montdor Material Name</th>
                  <th className='min-w-150px text-center pe-2'>PMC Material Name</th>
                </tr>
              </thead>
              <tbody className="border-bottom">
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : state.projectMaterialData.length > 0 ? (
                  <ProjectMaterialData projectMaterialData={state.projectMaterialData} />
                ) : (
                  <BlankDataImageInTable
                    colSpan={13}
                    length={state.projectMaterialData.length}
                    loading={state.loading}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* ============================ Project Model =============================== */}

      <ProjectModal
        show={show}
        handleClose={handleClose}
        projectData={currentPosts}
        filterByString={filterByString}
        selectProject={selectProject}
        loading={state.loading}
        proName={proName}
        setPage={(value) => setPage(value)}
        postPerPage={postPerPage}
        total={total}
        page={page}
        onShowSizeChange={(current, pageSize) => onShowSizeChange(current, pageSize)}
      />
    </>
  )
}

export default ProjectMaterilaReportList
