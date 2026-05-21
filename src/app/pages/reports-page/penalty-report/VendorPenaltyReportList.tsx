import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
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
import {Get_Generated_Penalty_Report_By_VendorID_ProjectID_FilterAPI} from '../../../modules/reports-page/penalty-report/PenaltyReportCRUD'
import {dayDataList} from '../../other-dropDowns/otherDropDowns'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {getVenderListByVendorTypeID} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import VendorModal from './VendorModal'

type Props = {}

interface IDIY {
  loading: boolean
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel[]
  vendorData: IVenderModel[]
  tmpVendorData: IVenderModel[]
  vendorPenaltyData: IPenaltyReportModel[]
  tmpVendorPenaltyData: IPenaltyReportModel[]
  selProjectName: string
  selCustomerName: string
  selDay: string
  selProjectID: number
  selVendorID: number
  selVendorName: string
  selCompanyName: string
}

const VendorPenaltyReportList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<IDIY>({
    loading: false,
    projectData: [] as IProjectModel[],
    tmpProjectData: [] as IProjectModel[],
    vendorData: [] as IVenderModel[],
    tmpVendorData: [] as IVenderModel[],
    vendorPenaltyData: [] as IPenaltyReportModel[],
    tmpVendorPenaltyData: [] as IPenaltyReportModel[],
    selProjectName: '',
    selCustomerName: '',
    selDay: '',
    selProjectID: 0,
    selVendorID: 0,
    selVendorName: '',
    selCompanyName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var ProjectName: any = ''
      var ProjectID: number = 0
      var VendorName: any = ''
      var VendorID: number = 0
      var Day: string = ''
      if (lc != undefined) {
        ProjectName = lc.ProjectName
        VendorName = lc.VendorName
        ProjectID = lc.ProjectID
        VendorID = lc.VendorID
        Day = lc.Day
      }
      getAllDIYQuotationData(
        ProjectID,
        ProjectName,
        state.selCustomerName,
        Day,
        VendorID,
        VendorName,
        state.selCompanyName
      )
    }, 100)
  }, [])

  function getAllDIYQuotationData(
    temProID: number,
    temProName: string,
    temCusName: string,
    temSelDay: string,
    temVendorID: number,
    temVendorName: string,
    temCompanyName: string
  ) {
    Get_Generated_Penalty_Report_By_VendorID_ProjectID_FilterAPI(temProID, temVendorID, temSelDay)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getVendorDataListByProjectID(
            responseData,
            temProID,
            temProName,
            temCusName,
            temSelDay,
            temVendorID,
            temVendorName,
            temCompanyName
          )
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

  function getVendorDataListByProjectID(
    temPenaltyReportData: IPenaltyReportModel[],
    temProID: number,
    temProName: string,
    temCusName: string,
    temSelDay: string,
    temVendorID: number,
    temVendorName: string,
    temCompanyName: string
  ) {
    getVenderListByVendorTypeID(1).then((response) => {
      let responseData = response.data.responseObject
      if (response.data.isSuccess == true) {
        getAllProjectListDataByRoleIDAndEmployeeID(
          temPenaltyReportData,
          temProID,
          temProName,
          temCusName,
          temSelDay,
          responseData,
          temVendorID,
          temVendorName,
          temCompanyName
        )
      } else {
        toast.error(`${response.data.massege}`)
        setState({
          ...state,
          vendorData: [],
          loading: false,
        })
      }
    })
  }

  function getAllProjectListDataByRoleIDAndEmployeeID(
    temPenaltyReportData: IPenaltyReportModel[],
    temProID: number,
    temProName: string,
    temCusName: string,
    temSelDay: string,
    temVendorData: IVenderModel[],
    temVendorID: number,
    temVendorName: string,
    temCompanyName: string
  ) {
    getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
      .then((response) => {
        let responseData = response.data
        let projectData = responseData.responseObject
        if (responseData.isSuccess == true) {
          setState({
            ...state,
            projectData: projectData,
            tmpProjectData: projectData,
            vendorPenaltyData: temPenaltyReportData,
            tmpVendorPenaltyData: temPenaltyReportData,
            vendorData: temVendorData,
            tmpVendorData: temVendorData,
            selProjectID: temProID,
            selProjectName: temProName,
            selCustomerName: temCusName,
            selDay: temSelDay,
            selVendorID: temVendorID,
            selVendorName: temVendorName,
            selCompanyName: temCompanyName,
            loading: false,
          })
          setTotal(projectData.length)
          setPage(1)
          setTotalVendor(temVendorData.length)
          setPageVendor(1)
          setTotalPenalty(temPenaltyReportData.length)
          setPagePenalty(1)
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
    getAllDIYQuotationData(
      ProjectID,
      ProjectName,
      CustomerName,
      state.selDay,
      state.selVendorID,
      state.selVendorName,
      state.selCompanyName
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

  function selectVendor(tmpVendorData: IVenderModel) {
    let VendorID: number = tmpVendorData.vendorID
    let VendorName: string = tmpVendorData.contactPerson
    let CompanyName: string = tmpVendorData.companyName
    getAllDIYQuotationData(
      state.selProjectID,
      state.selProjectName,
      state.selCustomerName,
      state.selDay,
      VendorID,
      VendorName,
      CompanyName
    )
    setState({...state, loading: true})
    setShowVendor(false)
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

  // ------------------------- Project Pagination ----------------------------
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(15)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ------------------------- Vendor Pagination ----------------------------
  const [totalVendor, setTotalVendor] = useState(0) //  length
  const [pageVendor, setPageVendor] = useState(1)
  const [postPerPageVendor, setPostPerPageVendor] = useState(15)
  const indexOfLastPageVendor = pageVendor * postPerPageVendor
  const indexOfFirstPageVendor = indexOfLastPageVendor - postPerPageVendor
  const currentPostsVendor: IVenderModel[] = state.vendorData.slice(
    indexOfFirstPageVendor,
    indexOfLastPageVendor
  )

  const onShowSizeChangeVendor = (current: any, pageSize: any) => {
    setPostPerPageVendor(pageSize)
  }

  // -------------------------- Project Filter --------------------------------
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

  // -------------------------- Vendor Filter --------------------------------
  const [venName, setVenName] = useState('')
  const filterVendor = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpVendorData.filter((user) => {
        return (
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.aboutVendor.toString().includes(keyword.toString())
        )
      })
      setState({...state, vendorData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, vendorData: state.tmpVendorData})
      setTotal(state.tmpVendorData.length)
      setPage(1)
    }
    setVenName(keyword)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'dayID') {
      getAllDIYQuotationData(
        state.selProjectID,
        state.selProjectName,
        state.selCustomerName,
        value,
        state.selVendorID,
        state.selVendorName,
        state.selCompanyName
      )
      setState({...state, loading: true})
    }
  }

  function resetFilter() {
    getAllDIYQuotationData(0, '', '', '', 0, '', '')
    setState({...state, loading: true})
  }

  return (
    <>
      {/* <Loader loading={state.loading} />
      <div className={state.loading === true ? 'd-none' : `card`}> */}
      <div className={`card`}>
        <div
          className='card-header border-0 py-2 p-0'
          style={{backgroundColor: '#000000', justifyContent: 'initial'}}
        >
          <div className='mb-2 d-flex ms-2'>
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

            <label className='text-white mt-5 fs-5'>Select Vendor : </label>
            <span className='mt-5 fw-bolder fs-6 text-primary d-flex align-item-center fs-5'>
              &nbsp;{state.selVendorName}
            </span>
            <div className='fv-row'>
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
            <div className='fv-row mt-4 ms-2'>
              <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
                Reset
              </button>
            </div>
            <div className={'position-absolute top-1 m-2 end-0'}>
              <Link
                to={{
                  pathname: `/reports/vendor-penalty/download`,
                  state: {
                    ProjectName: state.selProjectName,
                    ProjectID: state.selProjectID,
                    VendorID: state.selVendorID,
                    Day: state.selDay,
                    VendorName: state.selVendorName,
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
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Penalty By</span>
                    <span className='text-muted fw-bold d-block fs-6'>Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Vendor Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Amount</span>
                  </th>
                  <th className='min-w-250px'>
                    <span>Penalty Type</span>
                  </th>
                  <th className='min-w-250px'>Remark</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={4} />
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
                              <span className='text-muted d-block fs-6 mt-1'>
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
                              <span className='text-dark text-hover-primary mb-1 fs-6 cursor-pointer'>
                                {data.penaltyTypeName}
                              </span>
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
      <VendorModal
        show={showVendor}
        handleClose={handleCloseVendor}
        projectData={currentPostsVendor}
        filterByString={filterVendor}
        selectProject={selectVendor}
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

export default VendorPenaltyReportList
