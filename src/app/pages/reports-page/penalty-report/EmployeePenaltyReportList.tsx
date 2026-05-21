import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import Loader from '../../common-pages/Loader'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {getAllProjectListByRoleIDAndEmployeeIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import ProjectModal from '../../material-report-pages/ProjectModal'
import {IPenaltyReportModel} from '../../../models/Reports-page/PenaltyReportModel'
import {Get_Generated_Penalty_Report_By_EmployeeID_ProjectID_FilterAPI} from '../../../modules/reports-page/penalty-report/PenaltyReportCRUD'
import {dayDataList} from '../../other-dropDowns/otherDropDowns'
import {
  GetEmployee_DropdownListByProjectIDAndDepartmentIDAPI,
  GetEmployee_ListByDepartmentIDAPI,
} from '../../../modules/generate-ticket-master-page/GenerateTicketCRUD'
import {IDepartmentModel} from '../../../models/master-page/IDepartmentModel'
import {getAllDepartmentData} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import {Pagination} from 'antd'
import {IEmployeePageModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import EmployeeModal from './EmployeeModal'
import {NumberLiteralType} from 'typescript'

type Props = {}

interface IDIY {
  loading: boolean
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel[]
  employeeData: IEmployeePageModel[]
  tmpEmployeeData: IEmployeePageModel[]
  vendorPenaltyData: IPenaltyReportModel[]
  tmpVendorPenaltyData: IPenaltyReportModel[]
  departmentData: IDepartmentModel[]
  selProjectName: string
  selCustomerName: string
  selDay: string
  selProjectID: number
  selEmployeeID: number
  selDepartmentID: number
  selEmployeeName: string
}

const EmployeePenaltyReportList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDIY>({
    loading: false,
    projectData: [] as IProjectModel[],
    tmpProjectData: [] as IProjectModel[],
    employeeData: [] as IEmployeePageModel[],
    tmpEmployeeData: [] as IEmployeePageModel[],
    vendorPenaltyData: [] as IPenaltyReportModel[],
    tmpVendorPenaltyData: [] as IPenaltyReportModel[],
    departmentData: [] as IDepartmentModel[],
    selProjectName: '',
    selCustomerName: '',
    selDay: '',
    selProjectID: 0,
    selEmployeeID: 0,
    selDepartmentID: 0,
    selEmployeeName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var ProjectName: any = ''
      var EmployeeName: any = ''
      var ProjectID: number = 0
      var VendorID: number = 0
      var DepartmentID: number = 0
      var Day: string = ''
      if (lc != undefined) {
        ProjectName = lc.ProjectName
        EmployeeName = lc.EmployeeName
        ProjectID = lc.ProjectID
        VendorID = lc.VendorID
        DepartmentID = lc.DepartmentID
        Day = lc.Day
      }
      GetPenaltyReportListDataByProjectID(
        ProjectID,
        ProjectName,
        state.selCustomerName,
        Day,
        VendorID,
        EmployeeName,
        state.employeeData,
        DepartmentID
      )
    }, 100)
  }, [])

  function GetPenaltyReportListDataByProjectID(
    temProID: number,
    temProName: string,
    temCusName: string,
    temSelDay: string,
    temEmployeeID: number,
    temEmployeeName: string,
    temEmpData: IEmployeePageModel[],
    temDepartmentID: number
  ) {
    getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
      .then((response) => {
        let responseData = response.data
        let projectData = responseData.responseObject
        if (responseData.isSuccess == true) {
          getDepartmentData(
            temProID,
            temProName,
            temCusName,
            temSelDay,
            temEmployeeID,
            temEmployeeName,
            projectData,
            temEmpData,
            temDepartmentID
          )
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

  function getDepartmentData(
    temProID: number,
    temProName: string,
    temCusName: string,
    temSelDay: string,
    temEmployeeID: number,
    temEmployeeName: string,
    tmpProjectData: IProjectModel[],
    temEmpData: IEmployeePageModel[],
    temDepartmentID: number
  ) {
    getAllDepartmentData()
      .then((response) => {
        // let responseData = response.data
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let respObj = resp.responseObject
        if (resp.isSuccess == true) {
          GetPenaltyReportListData(
            temProID,
            temProName,
            temCusName,
            temSelDay,
            temEmployeeID,
            temEmployeeName,
            tmpProjectData,
            respObj,
            temEmpData,
            temDepartmentID
          )
        } else {
          toast.error(`${resp.massege}`)
          setState({...state, departmentData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, departmentData: [], loading: false})
      })
  }

  function GetPenaltyReportListData(
    temProID: number,
    temProName: string,
    temCusName: string,
    temSelDay: string,
    temEmployeeID: number,
    temEmployeeName: string,
    tmpProjectData: IProjectModel[],
    temDepData: IDepartmentModel[],
    temEmpData: IEmployeePageModel[],
    temDepartmentID: number
  ) {
    Get_Generated_Penalty_Report_By_EmployeeID_ProjectID_FilterAPI(
      temProID,
      temDepartmentID,
      temEmployeeID,
      temSelDay
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            projectData: tmpProjectData,
            tmpProjectData: tmpProjectData,
            vendorPenaltyData: responseData,
            tmpVendorPenaltyData: responseData,
            departmentData: temDepData,
            selEmployeeID: temEmployeeID,
            selEmployeeName: temEmployeeName,
            selProjectID: temProID,
            selDay: temSelDay,
            selProjectName: temProName,
            selCustomerName: temCusName,
            employeeData: temEmpData,
            tmpEmployeeData: temEmpData,
            selDepartmentID: temDepartmentID,
            loading: false,
          })
          setTotalPenalty(responseData.length)
          setPagePenalty(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorPenaltyData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, vendorPenaltyData: [], loading: false})
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
    let ProjectID: number = tmpProjectData.projectID
    let ProjectName: string = tmpProjectData.projectName
    let CustomerName: string = tmpProjectData.firstName + ' ' + tmpProjectData.lastName
    GetPenaltyReportListDataByProjectID(
      ProjectID,
      ProjectName,
      CustomerName,
      state.selDay,
      state.selEmployeeID,
      state.selEmployeeName,
      state.employeeData,
      state.selDepartmentID
    )
    setState({...state, loading: true})
    setShow(false)
  }

  // -------------------------- For Vendor ----------------
  const [showVendor, setShowVendor] = useState(false)
  function handleShowVendor() {
    setShowVendor(true)
  }
  function handleCloseVendor() {
    setShowVendor(false)
  }

  function selectEmployee(tmpEmployeeData: IEmployeePageModel) {
    let EmployeeID: number = tmpEmployeeData.employeeID
    let EmployeeName: string = tmpEmployeeData.firstName + ' ' + tmpEmployeeData.firstName
    let ContactNumber: string = tmpEmployeeData.contactNumber
    GetPenaltyReportListDataByProjectID(
      state.selProjectID,
      state.selProjectName,
      state.selCustomerName,
      state.selDay,
      EmployeeID,
      EmployeeName,
      state.employeeData,
      state.selDepartmentID
    )
    setState({...state, loading: true})
    setShowVendor(false)
  }

  function GetEmployeeListDataDepartmentID(temDepartmentID: number) {
    state.selEmployeeID = 0
    state.selEmployeeName = ''
    GetEmployee_ListByDepartmentIDAPI(temDepartmentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const employeeData = response.data.responseObject
          GetPenaltyReportListDataByProjectID(
            state.selProjectID,
            state.selProjectName,
            state.selCustomerName,
            state.selDay,
            state.selEmployeeID,
            state.selEmployeeName,
            employeeData,
            temDepartmentID
          )
          setTotalVendor(employeeData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorPenaltyData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, vendorPenaltyData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'dayID') {
      GetPenaltyReportListDataByProjectID(
        state.selProjectID,
        state.selProjectName,
        state.selCustomerName,
        value,
        state.selEmployeeID,
        state.selEmployeeName,
        state.employeeData,
        state.selDepartmentID
      )
      setState({...state, loading: true})
    } else if (elementId === 'departmentID') {
      GetEmployeeListDataDepartmentID(parseInt(value))
      setState({...state, loading: true})
    }
  }

  // ------------------------- Penalty Pagination Pagination ----------------------------
  const [totalPenalty, setTotalPenalty] = useState(0) //  length
  const [pagePenalty, setPagePenalty] = useState(1)
  const [postPerPagePenalty, setPostPerPagePenalty] = useState(15)
  const indexOfLastPagePenalty = pagePenalty * postPerPagePenalty
  const indexOfFirstPagePenalty = indexOfLastPagePenalty - postPerPagePenalty
  const currentPostsPenalty: IPenaltyReportModel[] = state.vendorPenaltyData.slice(
    indexOfFirstPagePenalty,
    indexOfLastPagePenalty
  )

  const onShowSizeChangePenalty = (current: any, pageSize: any) => {
    setPostPerPagePenalty(pageSize)
  }

  // ------------------------- Penalty Pagination Pagination ----------------------------
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(15)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ------------------------- Employee Pagination ----------------------------
  const [totalVendor, setTotalVendor] = useState(0) //  length
  const [pageVendor, setPageVendor] = useState(1)
  const [postPerPageVendor, setPostPerPageVendor] = useState(15)
  const indexOfLastPageVendor = pageVendor * postPerPageVendor
  const indexOfFirstPageVendor = indexOfLastPageVendor - postPerPageVendor
  const currentPostsVendor: IEmployeePageModel[] = state.employeeData.slice(
    indexOfFirstPageVendor,
    indexOfLastPageVendor
  )

  const onShowSizeChangeVendor = (current: any, pageSize: any) => {
    setPostPerPageVendor(pageSize)
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

  // -------------------------- Employee Filter --------------------------------
  const [venName, setVenName] = useState('')
  const filterVendor = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpEmployeeData.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.departmentName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.designationName.toString().includes(keyword.toString())
        )
      })
      setState({...state, employeeData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, employeeData: state.tmpEmployeeData})
      setTotal(state.tmpEmployeeData.length)
      setPage(1)
    }
    setVenName(keyword)
  }

  function resetFilter() {
    GetPenaltyReportListDataByProjectID(0, '', '', '', 0, '', [], 0)
    setState({...state, loading: true})
  }

  return (
    <>
      {/* <Loader loading={state.loading} /> */}
      {/* <div className={state.loading === true ? 'd-none' : `card`}> */}
      <div className={`card`}>
        <div
          className='card-header border-0 py-2 p-0'
          style={{backgroundColor: '#000000', justifyContent: 'initial'}}
        >
          <div className='mb-2 d-flex ms-2'>
            {/* <label className='text-white me-5 mt-5 fs-5'>Select Project : </label>
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
            </div> */}
            <label className='text-white mt-5 fs-5'>Select Project : </label>
            <span className='mt-5 fw-bolder fs-6 text-primary d-flex align-item-center fs-5'>
              &nbsp;{state.selProjectName}
            </span>
            <div className='fv-row'>
              <div
                className='mt-3 btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 p-5 ms-2'
                onClick={handleShow}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen004.svg'
                  className='svg-icon-2 svg-icon-white'
                />
              </div>
            </div>

            <label className={state.selDepartmentID > 0 ? 'text-white mt-5 fs-5' : 'd-none'}>
              Select Employee :
            </label>
            <span
              className={
                state.selDepartmentID > 0
                  ? 'mt-5 fw-bolder fs-6 text-primary d-flex align-item-center fs-5'
                  : 'd-none'
              }
            >
              &nbsp;{state.selEmployeeName}
            </span>
            <div className={state.selDepartmentID > 0 ? 'fv-row' : 'd-none'}>
              <div
                className='mt-3 btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 p-5 ms-2'
                onClick={handleShowVendor}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen004.svg'
                  className='svg-icon-2 svg-icon-white'
                />
              </div>
            </div>

            <div className='fv-row mt-4 ms-1'>
              <select
                // className='form-select'
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='dayID'
              >
                <option selected={state.selDay == '' ? true : false} value={''}>
                  Select Date
                </option>
                {dayDataList.length > 0 &&
                  dayDataList.map((data, index) => {
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
            </div>
            <div className={'fv-row mt-4 ms-1'}>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='departmentID'
              >
                <option selected={state.selEmployeeID == 0 ? true : false} value={0}>
                  Select Deparment
                </option>
                {state.departmentData.length > 0 &&
                  state.departmentData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.departmentID}
                        selected={state.selDepartmentID == data.departmentID ? true : false}
                      >
                        {data.departmentName}
                      </option>
                    )
                  })}
              </select>
            </div>
            <div className='fv-row mt-4 ms-2'>
              <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
                Reset
              </button>
            </div>
            <div className={'position-absolute top-1 m-2 end-0'}>
              <Link
                to={{
                  pathname: `/reports/employee-penalty/download`,
                  state: {
                    ProjectName: state.selProjectName,
                    ProjectID: state.selProjectID,
                    VendorID: state.selEmployeeID,
                    EmployeeName: state.selEmployeeName,
                    DepartmentID: state.selDepartmentID,
                    Day: state.selDay,
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
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer</span>
                  </th>
                  <th className='min-w-125px'>
                    <span className='d-block mb-1'>Penalty By</span>
                    <span className='text-muted fw-bold d-block fs-6'>Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Employee Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Amount</span>
                  </th>
                  <th className='min-w-250px'>
                    <span className='d-block mb-1'>Penalty Type</span>
                  </th>
                  <th className='min-w-250px'>
                    <span className='d-block mb-1'>Approval For</span>
                    <span className='text-muted fw-bold d-block fs-6'>Department</span>
                  </th>
                  <th className='min-w-250px'>Remark</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={5} />
                ) : (
                  <>
                    {currentPostsPenalty.length > 0 &&
                      currentPostsPenalty.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.projectName}
                                  </span>
                                  <span className='text-muted d-block fs-6 mt-1'>
                                    {data.customerName}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
                                {data.penaltyByName == '' ? 'N.A' : data.penaltyByName}
                              </span>
                              <span className='text-muted d-block fs-6'>
                                {data.penaltyCreateDate}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
                                {data.empVendorName == '' ? 'N.A' : data.empVendorName}
                              </span>
                              <span className='text-muted d-block fs-6'>{data.amount}</span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
                                {data.penaltyTypeName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
                                {data.approveForName == '' ? 'N.A' : data.approveForName}
                              </span>
                              <span className='text-muted d-block fs-6'>{data.departmentName}</span>
                            </td>
                            <td className='text-dark text-hover-primary fs-6'>{data.remarks}</td>
                          </tr>
                        )
                      })}
                    {/* =================== Loading get Api Data ============== */}
                    <BlankDataImageInTable
                      length={currentPostsPenalty.length}
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
              onChange={(value: any) => setPagePenalty(value)}
              pageSize={postPerPagePenalty}
              total={totalPenalty}
              current={pagePenalty}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChangePenalty}
              showTotal={(totalPenalty) => `Total ${totalPenalty} items`}
            ></Pagination>
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
      <EmployeeModal
        show={showVendor}
        handleClose={handleCloseVendor}
        projectData={currentPostsVendor}
        filterByString={filterVendor}
        selectProject={selectEmployee}
        loading={state.loading}
        proName={venName}
        setPage={(value) => setPageVendor(value)}
        postPerPage={postPerPageVendor}
        total={totalVendor}
        page={pageVendor}
        onShowSizeChange={(current, pageSizeVendor) =>
          onShowSizeChangeVendor(current, pageSizeVendor)
        }
      />
    </>
  )
}

export default EmployeePenaltyReportList
