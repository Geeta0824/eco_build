import {Pagination} from 'antd'
import Search from 'antd/es/input/Search'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import Loader from '../../common-pages/Loader'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {dayData} from '../../other-dropDowns/otherDropDowns'
import {IProjectDeadlineModel} from '../../../models/Reports-page/ProjectDeadlineModel'
import {
  Get_MissedDeadline_Report_By_TargateDate_EmpID_FilterAPI,
  Get_MissedDeadline_Report_By_TargateDate_FilterAPI,
} from '../../../modules/reports-page/project-deadline-master-page/ProjectDeadlineReportCRUD'

type Props = {}

interface IDIY {
  loading: boolean
  projectData: IProjectDeadlineModel[]
  tmpProjectData: IProjectDeadlineModel[]
  searchText: string
  selProjectName: string
  selCustomerName: string
  stageName: string
  selProjectID: number
  stageID: number
  selProjectCategoryID: number
  selDay: string
}

const ProjectMissedDeadlineReportList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDIY>({
    loading: false,
    projectData: [] as IProjectDeadlineModel[],
    tmpProjectData: [] as IProjectDeadlineModel[],
    searchText: '',
    selProjectName: '',
    selCustomerName: '',
    stageName: '',
    selProjectID: 0,
    stageID: 0,
    selProjectCategoryID: 0,
    selDay: 'Today',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var searchText: any = ''
      var day: any = 'Today'
      if (lc != undefined) {
        searchText = lc.searchText
        day = lc.day
      }
      getAllProjectDeadlineData(searchText, day)
    }, 100)
  }, [])

  function getAllProjectDeadlineData(searchText: string, temDay: string) {
    if (user.roleID == 2 || user.roleID == 6) {
      Get_MissedDeadline_Report_By_TargateDate_EmpID_FilterAPI(user.employeeID, '', searchText)
        .then((response) => {
          let responseData = response.data
          let projectData = responseData.responseObject
          if (responseData.isSuccess == true) {
            setState({
              ...state,
              projectData: projectData,
              tmpProjectData: projectData,
              // selDay: temDay,
              searchText: searchText,
              loading: false,
            })
            setName(searchText)
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
    } else {
      Get_MissedDeadline_Report_By_TargateDate_FilterAPI('', searchText)
        .then((response) => {
          let responseData = response.data
          let projectData = responseData.responseObject
          if (responseData.isSuccess == true) {
            setState({
              ...state,
              projectData: projectData,
              tmpProjectData: projectData,
              // selDay: temDay,
              searchText: searchText,
              loading: false,
            })
            setName(searchText)
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
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'dayID') {
      getAllProjectDeadlineData(state.searchText, value)
    }
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(15)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectDeadlineModel[] = state.projectData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  // ----------------------------------------------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (e: any) => {
    const keyword = e
    if (keyword !== '') {
      getAllProjectDeadlineData(keyword, state.selDay)
      setState({...state, loading: true})
    } else {
      getAllProjectDeadlineData('', state.selDay)
      setState({...state, loading: true})
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
          <div className='col-xl-3 col-sm-6 mt-4 ms-5'>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value: any) => searchFilter(value)}
            />
          </div>
          {/* <div className='col-lg-3 fv-row mt-4 ms-2'>
            <select
              // className='form-select'
              className='form-select lineHeightByD'
              aria-label='Default select example'
              onChange={selectChange}
              id='dayID'
            >
              {dayData.length > 0 &&
                dayData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.dayName}
                      selected={state.selDay == data.dayName ? true : false}
                    >
                      {data.dayName}
                    </option>
                  )
                })}
            </select>
          </div> */}
          <div className='position-absolute top-1 mt-2 end-0'>
            <Link
              to={{
                pathname: `/reports/project-missed-deadline/download`,
                state: {
                  day: state.selDay,
                  searchText: state.searchText,
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
        {/* begin::Body */}
        {/* begin::Body */}
        <div className='py-2'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered table-rounded align-middle border g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-6'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Category</span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Customer</span>
                    <span className='text-muted fw-bold d-block fs-6'>Mobile</span>
                  </th>
                  <th className='min-w-200px'>Stage Name</th>
                  <th className='min-w-100px'>Date</th>
                  <th className='min-w-150px'>Vendor</th>
                  <th className='min-w-150px'>Supervisor</th>
                  <th className='min-w-50px text-end'>View</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={6} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => (
                    <tr className='border-bottom' key={index}>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            <span className='text-dark text-hover-primary fs-5'>
                              {data.projectName}
                            </span>
                            <span className='text-muted d-block fs-7 mt-1'>
                              {data.quotationCategoryName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
                          {data.customerName}
                        </span>
                        <span className='text-muted d-block fs-7'>{data.mobileNumber}</span>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            <span className='text-dark text-hover-primary fs-5'>
                              {data.stageName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            <span className='text-dark text-hover-primary fs-5'>
                              {data.targetDate == '' ? 'N.A' : data.targetDate}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            <span className='text-dark text-hover-primary fs-5'>
                              {data.contactPerson}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            <span className='text-dark text-hover-primary fs-5'>
                              {data.supervisorName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className='text-center'>
                        <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/reports/project-missed-deadline/view-details`,
                              state: {
                                stageID: data.stageID,
                                projectCategoryID: data.projectCategoryID,
                                projectID: data.projectID,
                                stageName: data.stageName,
                                supervisorName: data.supervisorName,
                                approveByName: data.approveByName,
                                targetDate: data.targetDate,
                                stageCompleteDate: data.stageCompleteDate,
                                targetDateApproveDate: data.targetDateApproveDate,
                                day: state.selDay,
                                searchText: state.searchText,
                              },
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-success btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                      </td>
                    </tr>
                  ))}
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  colSpan={13}
                  length={state.projectData.length}
                  loading={state.loading}
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

export default ProjectMissedDeadlineReportList
