import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RootState} from '../../../../setup'
import {IDepartmentModel} from '../../../models/organization-page/IDepartmentModel'
import {IEmployeePageModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {getDropDownDepartmentData} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import {
  deleteEmployee,
  getFilterEmployeeList,
  isActiveEmployee,
} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import {IDesignationModel} from '../../../models/organization-page/IDesignationModel'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IBranchModel} from '../../../models/master-page/IBranchModel'
import {getBranchDropdownList} from '../../../modules/master-page/branch-master-page/BranchCRUD'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import Search from 'antd/es/input/Search'

type Props = {}

interface IEmployee {
  loading: boolean
  employeeData: IEmployeePageModel[]
  tmpEmployeeData: IEmployeePageModel[]
  departmentData: IDepartmentModel[]
  designationData: IDesignationModel[]
  selEmployeeData: IEmployeePageModel
  branchData: IBranchModel[]
  SearchText: string
  selempId: number
  activeID: number
  activeType: any
  selDeprtId: number
  selDesignId: number
  selBranchId: number
  selSearchText: string
  selSortType: number
  selSortBy: number
  mainBranchID: number
  mainSearch: string
}

const Employee: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()
  const location = useLocation()
  const [state, setState] = useState<IEmployee>({
    loading: false,
    employeeData: [] as IEmployeePageModel[],
    tmpEmployeeData: [] as IEmployeePageModel[],
    departmentData: [] as IDepartmentModel[],
    designationData: [] as IDesignationModel[],
    selEmployeeData: {} as IEmployeePageModel,
    branchData: [] as IBranchModel[],
    SearchText: '',
    selempId: 0,
    activeID: 0,
    activeType: false,
    selDeprtId: 0,
    selDesignId: 0,
    selBranchId: 0,
    selSearchText: '',
    selSortType: 0,
    selSortBy: 0,
    mainBranchID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainBranchID = lc.branchId
        mainSearch = lc.search
      }
      getDepartmentData(mainBranchID, mainSearch)
    }, 100)
  }, [])

  function getDepartmentData(mainBranchID: number, mainSearch: string) {
    getDropDownDepartmentData()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          getBranchData(responseData, mainBranchID, mainSearch)
        } else {
          toast.error(`${resp.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =====================Branch Api==========================
  function getBranchData(
    departmentData: IDepartmentModel[],
    mainBranchID: number,
    mainSearch: string
  ) {
    getBranchDropdownList()
      .then((response) => {
        // let responseData = response.data.responseObject
        // if (response.data.isSuccess === true) {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          getAllEmployeeData(
            departmentData,
            responseData,
            mainBranchID,
            mainSearch,
            state.selSortType,
            state.selSortBy
          )
          setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, branchData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, branchData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getAllEmployeeData(
    departmentData: IDepartmentModel[],
    branchData: IBranchModel[],
    selBranchID: number,
    selSearchText: string,
    selSortType: number,
    selSortBy: number
  ) {
    getFilterEmployeeList(selBranchID, selSearchText, selSortType, selSortBy)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            employeeData: responseData,
            departmentData: departmentData,
            branchData: branchData,
            selBranchId: selBranchID,
            selSearchText: selSearchText,
            selSortType: selSortType,
            selSortBy: selSortBy,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  // -----------------Is Active model----------------------
  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)
  const handleShowActive = (event: any) => {
    const temEmpId = event.target.id
    const temIsAct = event.target.checked
    setState({
      ...state,
      activeID: temEmpId,
      activeType: temIsAct,
    })
    setShowActive(true)
  }

  // ----------------------Is Active employee api-------------------------
  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    isActiveEmployee(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getAllEmployeeData(
            state.departmentData,
            state.branchData,
            state.selBranchId,
            state.selSearchText,
            state.selSortType,
            state.selSortBy
          )
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  // -----------------Delete model----------------------
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (empId: number) => {
    setState({
      ...state,
      selempId: empId,
    })
    setShow(true)
  }

  // ----------------------delete employee api-------------------------
  function deleteEmployeeItem(temImpId: number) {
    deleteEmployee(temImpId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getAllEmployeeData(
            state.departmentData,
            state.branchData,
            state.selBranchId,
            state.selSearchText,
            state.selSortType,
            state.selSortBy
          )
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ===================Branch Filter Function===========
  function getBranchIdValue(event: any) {
    const tmpBranchId = event.target.value
    getAllEmployeeData(
      state.departmentData,
      state.branchData,
      tmpBranchId,
      state.selSearchText,
      state.selSortType,
      state.selSortBy
    )
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getAllEmployeeData(
        state.departmentData,
        state.branchData,
        state.selBranchId,
        keyword,
        state.selSortType,
        state.selSortBy
      )
    } else {
      getAllEmployeeData(
        state.departmentData,
        state.branchData,
        state.selBranchId,
        '',
        state.selSortType,
        state.selSortBy
      )
    }
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    getAllEmployeeData(state.departmentData, state.branchData, 0, '', 0, 0)
    setName('')
    // setCurrentPage(1)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.employeeData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IEmployeePageModel[] = state.employeeData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ---------------navigate page------------------------------------
  // function nevigatePage(tmpEmpID: number, fullName: string, flag: string) {
  //   localStorage.setItem('editEmpID', JSON.stringify(tmpEmpID))
  //   localStorage.setItem('editEmpName', JSON.stringify(fullName))
  //   if (flag === 'Edit') {
  //     history.push({
  //       pathname: `/organization/employee/edit/${tmpEmpID}/personal`,
  //       state: {
  //         empName: fullName,
  //       },
  //     })
  //     // history.push(`/organization/employee/edit/${tmpEmpID}/personal`)
  //   } else if (flag === 'View') {
  //     history.push(`/employee/details/personal`)
  //   }
  // }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Employee Lists</span>
            <span className='text-muted mt-1 fw-bold fs-7'>Total {employeeData.length} emloyees</span>
          </h3> */}

          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Branch :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getBranchIdValue(e)}
            >
              <option selected value={0}>
                Select Branch
              </option>
              {state.branchData.length > 0 &&
                state.branchData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.branchID}
                      selected={state.selBranchId == data.branchID ? true : false}
                    >
                      {data.branchName}
                    </option>
                  )
                })}
            </select>
          </div>

          <div className='mb-2 col-xl-5 col-sm-6 ps-0'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value: any) => searchFilter(value)}
            />
          </div>

          <div className=' mt-6 col-xl-1 col-sm-6 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div>

          <div
            className='card-toolbar mt-7'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: '/organization/employee/add',
                state: {mainBranchID: state.selBranchId, mainSearch: state.selSearchText},
              }}
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
                  <th className='min-w-120px'>Branch</th>
                  <th className='min-w-120px'>Branch Code</th>
                  <th className='min-w-120px'>Name</th>
                  <th className='min-w-120px'>Contact Number</th>
                  {/* <th className='min-w-120px'>Kylas ID</th> */}
                  {/* <th className='w-25px'>Password</th> */}
                  <th className='min-w-120px'>Department</th>
                  <th className='min-w-120px'>Designation</th>
                  <th className='w-25px'>Active</th>
                  <th className='w-25px'>View</th>
                  <th className='w-25px'>Edit</th>
                  {/* <th className='w-25px text-end'>Delete</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.branchName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.branchCode}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.firstName}&nbsp;{data.lastName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.contactNumber}
                        </td>
                        {/* <td className='text-dark text-hover-primary mb-1 fs-6'>{data.kylasID}</td> */}
                        {/* <td className='text-dark text-hover-primary mb-1 fs-6'>{data.pwd}</td> */}
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.departmentName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.designationName == '' ? '-' : data.designationName}
                        </td>
                        <td className=''>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.employeeID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td className=''>
                          <Link
                            to={{
                              pathname: `/organization/employee/view/${data.employeeID}/personal`,
                              state: {
                                empName: data.firstName + ' ' + data.lastName,
                                mainBranchID: state.selBranchId,
                                mainSearch: state.selSearchText,
                              },
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                        <td className=''>
                          <div className='justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/organization/employee/edit/${data.employeeID}/personal`,
                                state: {
                                  empName: data.firstName + ' ' + data.lastName,
                                  mainBranchID: state.selBranchId,
                                  mainSearch: state.selSearchText,
                                },
                              }}
                              // onClick={() =>
                              //   nevigatePage(
                              //     data.employeeID,
                              //     `${data.firstName + ' ' + data.lastName}`,
                              //     'Edit'
                              //   )
                              // }
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Edit'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                          </div>
                        </td>
                        {/* <td className=''>
                          <div className='justify-content-end flex-shrink-0'>
                            <div
                              onClick={() => handleShow(data.employeeID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Delete'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='svg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </div>
                        </td> */}
                      </tr>
                    )
                  })}
                {/* =================== Image no data ============== */}
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
            />
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selempId}
        pageName={'Employee'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteEmployeeItem(state.selempId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Employee'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default Employee
