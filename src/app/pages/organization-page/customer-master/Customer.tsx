import React, {useEffect, useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RootState} from '../../../../setup'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import {ICustomerListModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {
  getCustomerList,
  deleteCustomer,
  isActiveCustomer,
  getCustomerListByFilter,
  getCustomerListByFilterUserID,
} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IBranchModel} from '../../../models/master-page/IBranchModel'
import {ITerminalTypeWebModel} from '../../../models/master-page/ITerminalTypeModel'
import {getBranchDropdownList} from '../../../modules/master-page/branch-master-page/BranchCRUD'
import {getTerminalTypeDropdownList} from '../../../modules/master-page/terminal-type-page/TerminalTypeCRUD'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import Search from 'antd/es/input/Search'

type Props = {}

interface ICustomer {
  loading: boolean
  customerData: ICustomerListModel[]
  tmpCustomerData: ICustomerListModel[]
  branchData: IBranchModel[]
  terminalTypeData: ITerminalTypeWebModel[]
  selCustomerId: number
  selBranchID: number
  branchID: number
  selTerminalTypeID: number
  activeID: number
  activeType: any
  selSortType: number
  selSortBy: number
  selSearchText: string
  searchText: string
}

const Customer: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [selectedBranchID, setSelectedBranchID] = useState(0)
  const [branchDropdownData, setBranchDropdownData] = useState([])

  const [state, setState] = useState<ICustomer>({
    loading: false,
    customerData: [] as ICustomerListModel[],
    tmpCustomerData: [] as ICustomerListModel[],
    branchData: [] as IBranchModel[],
    terminalTypeData: [] as ITerminalTypeWebModel[],
    selCustomerId: 0,
    selBranchID: 0,
    branchID: 0,
    selTerminalTypeID: 0,
    activeID: 0,
    activeType: false,
    selSortType: 1,
    selSortBy: 1,
    selSearchText: '',
    searchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainBranchID = lc.BranchID
        mainSearch = lc.search
      }
      getBranchData(mainBranchID, mainSearch)
    }, 100)
  }, [])

  // =======================Customer Api========================

  // =====================Branch Api==========================
  function getBranchData(mainBranchID: number, mainSearch: string) {
    getBranchDropdownList()
      .then((response) => {
        // let responseData = response.data.responseObject
        // if (response.data.isSuccess === true) {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          getAllCustomerData(
            responseData,
            state.selSortType,
            mainBranchID,
            mainSearch,
            state.selSortBy,
            state.selTerminalTypeID
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

  function getAllCustomerData(
    branchData: IBranchModel[],
    selSortType: number,
    selBranchID: number,
    searchText: string,
    selSortBy: number,
    selTerminalTypeId: number
  ) {
    getCustomerListByFilterUserID(0, selBranchID, searchText, 0, 0, user.employeeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            customerData: responseData,
            tmpCustomerData: responseData,
            branchData: branchData,
            selSortType: selSortType,
            selBranchID: selBranchID,
            searchText: searchText,
            selSortBy: selSortBy,
            selTerminalTypeID: selTerminalTypeId,
            loading: false,
          })

          setTotal(responseData.length)
          setPage(1)
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            customerData: [],
            tmpCustomerData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          customerData: [],
          tmpCustomerData: [],
          loading: false,
        })
      })
  }
  // // =====================Terminal Type Api==========================
  // function getTerminalTypeData(branchData: IBranchModel[]) {
  //   getTerminalTypeDropdownList()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getAllCustomerData(
  //           branchData,
  //           responseData,
  //           state.selSortType,
  //           state.selselBranchID,
  //           state.selSearchText,
  //           state.selSortBy,
  //           state.selTerminalTypeID
  //         )
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, terminalTypeData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       setState({...state, terminalTypeData: [], loading: false})
  //       toast.error(`${error}`)
  //     })
  // }

  // ===================BY SORT Filter Function===========
  function customerBySorting(selSortBy: number) {
    let tmpSortType: number = 1
    if (state.selSortBy === selSortBy) {
      if (state.selSortType === 1) {
        tmpSortType = 2
      } else if (state.selSortType === 2) {
        tmpSortType = 1
      }
    }
    setMainLoading(true)
    getAllCustomerData(
      state.branchData,
      tmpSortType,
      state.selBranchID,
      state.searchText,
      selSortBy,
      state.selTerminalTypeID
    )
  }

  // -----------------Is Active model----------------------
  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)
  const handleShowActive = (event: any) => {
    const temCustomerId = event.target.id
    const temIsAct = event.target.checked
    setState({
      ...state,
      activeID: temCustomerId,
      activeType: temIsAct,
    })
    setShowActive(true)
  }

  // ----------------------Is Active Customer api-------------------------
  function checkedFunction(temCustomerId: number, temIsAct: boolean) {
    isActiveCustomer(temCustomerId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getAllCustomerData(
            state.branchData,
            state.selSortType,
            state.selBranchID,
            state.searchText,
            state.selSortBy,
            state.selTerminalTypeID
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
  const handleShow = (customerId: number) => {
    setState({
      ...state,
      selCustomerId: customerId,
    })
    setShow(true)
  }

  // ----------------------delete Customer api-------------------------
  function deleteCustomerItem(temCustomerId: number) {
    deleteCustomer(temCustomerId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getAllCustomerData(
            state.branchData,
            state.selSortType,
            state.selBranchID,
            state.searchText,
            state.selSortBy,
            state.selTerminalTypeID
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

    getAllCustomerData(
      state.branchData,
      state.selSortType,

      tmpBranchId,
      state.searchText,
      state.selSortBy,
      state.selTerminalTypeID
    )
  }

  // ===================Terminal Type Filter Function===========
  function getTerminalTypeIdValue(event: any) {
    const tmpTerminalTypeId = event.target.value
    getAllCustomerData(
      state.branchData,
      state.selSortType,
      state.selBranchID,
      state.searchText,
      state.selSortBy,
      tmpTerminalTypeId
    )
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getAllCustomerData(
        state.branchData,
        state.selSortType,
        state.selBranchID,
        keyword,
        state.selSortBy,
        state.selTerminalTypeID
      )
    } else {
      getAllCustomerData(
        state.branchData,
        state.selSortType,
        state.selBranchID,
        '',
        state.selSortBy,
        state.selTerminalTypeID
      )
    }
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.customerData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICustomerListModel[] = state.customerData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ---------------navigate page------------------------------------
  // function nevigatePage(tmpCustomerID: number, fullName: string, flag: string) {
  //   localStorage.setItem('editCustomerID', JSON.stringify(tmpCustomerID))
  //   localStorage.setItem('editCustomerName', JSON.stringify(fullName))
  //   if (flag === 'Edit') {
  //     history.push(`/organization/customer/edit/${tmpCustomerID}/personal`)
  //   } else if (flag === 'View') {
  //     // history.push(`/customer/details/personal`)
  //   }
  // }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Branch :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getBranchIdValue(e)}
              value={state.selBranchID}
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
                      selected={state.selBranchID === data.branchID ? true : false}
                    >
                      {data.branchName}
                    </option>
                  )
                })}
            </select>
          </div>

          {/* <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Terminal Type :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getTerminalTypeIdValue(e)}
            >
              <option selected value={0}>
                Select Terminal Type
              </option>
              {state.terminalTypeData.length > 0 &&
                state.terminalTypeData.map((data, index) => {
                  return (
                    <option key={index} value={data.terminalTypeID}>
                      {data.terminalTypeName}
                    </option>
                  )
                })}
            </select>
          </div> */}

          <div className='mb-2 col-xl-4 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value: any) => searchFilter(value)}
            />
          </div>

          <div
            className='card-toolbar mt-6'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: '/organization/customer/add',
                state: {mainBranchID: state.selBranchID, mainSearch: state.searchText},
              }}
              className='btn btn-sm btn-light-primary bg-white'
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
                  <th className='min-w-125px'>Branch Name</th>
                  <th className='min-w-125px'>Customer Name</th>
                  <th className='min-w-125px'>Contact Number</th>
                  <th className='min-w-125px'>Email</th>
                  <th className='min-w-125px'>CRMID</th>
                  <th className='min-w-125px'>Lead Owner Name</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-25px'>View</th>
                  {/* <th className='min-w-125px text-end'>Edit | Delete</th> */}
                  <th className='min-w-125px text-end'>Edit</th>
                </tr>
                {/* <tr className='fw-bolder fs-5'>
                  <th className='min-w-125px cursor-pointer' onClick={() => customerBySorting(2)}>
                    <span className='d-flex'>
                      Branch
                      {state.selSortType === 1 && state.selSortBy === 2 ? (
                        <span className='bi bi-arrow-down ms-1'></span>
                      ) : state.selSortType === 2 && state.selSortBy === 2 ? (
                        <span className='bi bi-arrow-up ms-1'></span>
                      ) : (
                        <span className='bi bi-arrow-down-up ms-1'></span>
                      )}
                    </span>
                  </th>
                  <th className='min-w-125px cursor-pointer' onClick={() => customerBySorting(1)}>
                    <span className='d-flex'>
                      Name
                      {state.selSortType === 1 && state.selSortBy === 1 ? (
                        <span className='bi bi-arrow-down ms-1'></span>
                      ) : state.selSortType === 2 && state.selSortBy === 1 ? (
                        <span className='bi bi-arrow-up ms-1'></span>
                      ) : (
                        <span className='bi bi-arrow-down-up ms-1'></span>
                      )}
                    </span>
                  </th>
                  <th className='min-w-125px cursor-pointer' onClick={() => customerBySorting(3)}>
                    <span className='d-flex'>
                      T Code
                      {state.selSortType === 1 && state.selSortBy === 3 ? (
                        <span className='bi bi-arrow-down ms-1'></span>
                      ) : state.selSortType === 2 && state.selSortBy === 3 ? (
                        <span className='bi bi-arrow-up ms-1'></span>
                      ) : (
                        <span className='bi bi-arrow-down-up ms-1'></span>
                      )}
                    </span>
                  </th>
                  <th className='min-w-125px cursor-pointer' onClick={() => customerBySorting(6)}>
                    <span className='d-flex'>
                      User Id
                      {state.selSortType === 1 && state.selSortBy === 6 ? (
                        <span className='bi bi-arrow-down ms-1'></span>
                      ) : state.selSortType === 2 && state.selSortBy === 6 ? (
                        <span className='bi bi-arrow-up ms-1'></span>
                      ) : (
                        <span className='bi bi-arrow-down-up ms-1'></span>
                      )}
                    </span>
                  </th>
                  <th className='w-125px'>Reset PWD</th>
                  <th className='w-50px'>Active</th>
                  <th className='w-25px text-center'>View</th>
                  <th className='w-25px text-center'>Edit</th>
                  <th className='w-25px text-center'>Delete</th>
                </tr> */}
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
                        <td className='text-dark text-hover-primary mb-1 fs-6'>{data.fullName}</td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.mobileNumber}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>{data.email}</td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>{data.crmid}</td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.leadOwnerName}
                        </td>
                        {/* <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.terminalCode}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.voucherNumber}
                        </td>
                        <td className='text-center'>
                          <Link
                            to={`/organization/customer/passwordReset/${data.customerID}`}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Password Reset'
                          >
                            <span className='fa fa-key fs-2'></span>
                          </Link>
                        </td> */}
                        <td className=''>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.customerID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/organization/customer/view/${data.customerID}/personal`,
                              state: {
                                mainBranchID: state.selBranchID,
                                mainSearch: state.searchText,
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
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/organization/customer/edit/${data.customerID}/personal`,
                                state: {
                                  custName: data.fullName,
                                  mainBranchID: state.selBranchID,
                                  mainSearch: state.searchText,
                                },
                              }}
                              // onClick={() => nevigatePage(data.customerID, data.fullName, 'Edit')}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Edit'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>

                            {/* <div
                              onClick={() => handleShow(data.customerID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Delete'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='svg-icon-3 svg-icon-danger'
                              />
                            </div> */}
                          </div>
                        </td>
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
        id={state.selCustomerId}
        pageName={'Customer'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCustomerItem(state.selCustomerId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Customer'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default Customer
