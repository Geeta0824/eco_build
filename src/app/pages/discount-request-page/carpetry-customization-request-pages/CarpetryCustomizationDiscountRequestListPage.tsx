import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IDiscountRequestModel,
  IDiscountStatusData,
} from '../../../models/discount-request-page/IDiscountRequestModel'
import {toast} from 'react-toastify'
import {
  GetDiscountStatusListApi,
  getDiscountListApi,
} from '../../../modules/discount-request-master-page/capetry-customize-request-master-page/CarpetryCustomizationDiscountRequestCRUD'
import CustomizationModalDiscountRequest from './CustomizationModalDiscountRequest'
import {IEmployeeSearchDDModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {ICustomerDropModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerDropSearchDownList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {Link, useLocation} from 'react-router-dom'
import Search from 'antd/es/input/Search'
import Select from 'react-select'

type Props = {}

interface ICustomization {
  loading: boolean
  discountRequestData: IDiscountRequestModel[]
  objDiscountRequestData: IDiscountRequestModel
  discountStatusData: IDiscountStatusData[]
  employeeData: IEmployeeSearchDDModel[]
  customerData: ICustomerDropModel[]
  selCustomerID: number
  searchText: string
  selEmployeeID: number
  mainEmployeeID: number
  mainCustomerID: number
  mainSearch: string
}

const CarpetryDiscountRequestListPage: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState(null)
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState(null)

  const [state, setState] = useState<ICustomization>({
    loading: false,
    discountRequestData: [] as IDiscountRequestModel[],
    objDiscountRequestData: {} as IDiscountRequestModel,
    discountStatusData: [] as IDiscountStatusData[],
    selEmployeeID: 0,
    selCustomerID: 0,
    employeeData: [] as IEmployeeSearchDDModel[],
    customerData: [] as ICustomerDropModel[],
    searchText: '',
    mainEmployeeID: 0,
    mainCustomerID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var notifSearch: string = ''
      if (lc != undefined) {
        notifSearch = lc.notifSearch
      }
      getAllEmployeeSearchDropdownData(notifSearch)
    }, 100)
  }, [])

  function getAllEmployeeSearchDropdownData(notifSearch: string) {
    getEmployeeSearchDropDown()
      .then((response) => {
        let tmpEmpId = 0
        if (user.roleID !== 2) {
          tmpEmpId = user.employeeID
        }
        const responseData = response.data
        getAllCustomerSearchDropdownData(tmpEmpId, responseData, notifSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAllCustomerSearchDropdownData(
    selEmployeeID: number,
    employeeData: IEmployeeSearchDDModel[],
    notifSearch: string
  ) {
    getCustomerDropSearchDownList()
      .then((response) => {
        const responseData = response.data
        getAlldiscountRequestData(
          selEmployeeID,
          state.selCustomerID,
          notifSearch,
          employeeData,
          responseData
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAlldiscountRequestData(
    selEmployeeID: number,
    selCustomerID: number,
    searchText: string,
    employeeData: IEmployeeSearchDDModel[],
    customerData: ICustomerDropModel[]
  ) {
    getDiscountListApi(selEmployeeID, selCustomerID, searchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            selEmployeeID: selEmployeeID,
            selCustomerID: selCustomerID,
            searchText: searchText,
            employeeData: employeeData,
            customerData: customerData,
            discountRequestData: responseData,
            loading: false,
            objDiscountRequestData: {} as IDiscountRequestModel,
          })
          setName(searchText)
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, discountRequestData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, discountRequestData: [], loading: false})
      })
  }

  // ================Employee Selection dropdown ================
  function employeeChange(e: any) {
    //  console.log(e)
    if (e === null) {
      setSelectedOptionEmployee(null)
      return getAlldiscountRequestData(
        0,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionEmployee(e)
    getAlldiscountRequestData(
      e.value,
      state.selCustomerID,
      state.searchText,
      state.employeeData,
      state.customerData
    )
  }

  // ================Customer Selection dropdown ================
  function customerChange(e: any) {
    //  console.log(e)
    if (e === null) {
      setSelectedOptionCustomer(null)
      return getAlldiscountRequestData(
        state.selEmployeeID,
        0,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionCustomer(e)
    getAlldiscountRequestData(
      state.selEmployeeID,
      e.value,
      state.searchText,
      state.employeeData,
      state.customerData
    )
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getAlldiscountRequestData(
        state.selEmployeeID,
        state.selCustomerID,
        keyword,
        state.employeeData,
        state.customerData
      )
    } else {
      getAlldiscountRequestData(
        state.selEmployeeID,
        state.selCustomerID,
        '',
        state.employeeData,
        state.customerData
      )
    }
  }

  // ================Model For Response=====================
  const [showResponse, setShowResponse] = useState(false)
  const handleCloseResponse = () => {
    getAlldiscountRequestData(
      state.selEmployeeID,
      state.selCustomerID,
      state.searchText,
      state.employeeData,
      state.customerData
    )
    setShowResponse(false)
  }
  const handleShowResponse = (tmpDiscountRequestData: IDiscountRequestModel) => {
    handleStatusChange(tmpDiscountRequestData)
    setShowResponse(true)
  }

  function handleStatusChange(tmpDiscountRequestData: IDiscountRequestModel) {
    GetDiscountStatusListApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            discountStatusData: responseData,
            objDiscountRequestData: tmpDiscountRequestData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, discountStatusData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, discountStatusData: [], loading: false})
      })
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.discountRequestData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDiscountRequestModel[] = state.discountRequestData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search by Customer:</label>
            <Select
              className='basic-single'
              classNamePrefix='select'
              isClearable={true}
              isSearchable={true}
              value={selectedOptionCustomer}
              onChange={customerChange}
              options={state.customerData}
            />
          </div>
          <div className={user.roleID === 2 ? 'mb-2 col-xl-3 col-sm-6' : 'd-none'}>
            <label className='form-label fw-bold text-white'>Search by Employee:</label>
            <Select
              className='basic-single'
              classNamePrefix='select'
              isClearable={true}
              isSearchable={true}
              value={selectedOptionEmployee}
              onChange={employeeChange}
              options={state.employeeData}
            />
          </div>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value) => searchFilter(value)}
            />
          </div>
          {/* <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/quotations/ready-made-quotation/add'
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div> */}
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
                  <th className='min-w-125px text-center'>Project No.</th>
                  <th className='min-w-125px text-center'>Customer Name</th>
                  <th className='min-w-125px text-center'>Date</th>
                  <th className='min-w-125px text-center'>Employee Name</th>
                  <th className='min-w-100px text-center'>
                    <span className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                      Req. disc
                    </span>
                    <span className='text-muted fw-bold d-block fs-7'>Given disc</span>
                  </th>
                  <th className='min-w-125px text-center'>
                    <span className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                      Quotation Amt
                    </span>
                    <span className='text-muted fw-bold d-block fs-7'>Discount Req&nbsp;%</span>
                  </th>
                  <th className='w-25px text-center'>After Discount</th>
                  <th className='w-25px text-center'>Discount Status</th>
                  <th className='w-25px text-center'>Download</th>
                  <th className='w-25px text-center'>View Cart</th>
                  <th className={user.roleID === 2 ? 'w-25px text-center' : 'd-none'}>
                    Cost BreakUp
                  </th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    let bgcolor = ''
                    if (data.discountStatusID === 2) {
                      bgcolor = 'success'
                    } else if (data.discountStatusID === 3) {
                      bgcolor = 'info'
                    } else if (data.discountStatusID === 4) {
                      bgcolor = 'danger'
                    } else {
                      bgcolor = 'primary'
                    }
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.projectNumber}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.customerName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.quotationDate}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.employeeName}
                        </td>
                        <td className='text-dark text-center text-hover-primary mb-1 fs-6'>
                          <span className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                            {data.reqExtraDisc}&nbsp;
                            {data.discountTypeID === 1 ? '(Fix Value)' : '%'}
                          </span>
                          <span className='text-muted fw-bold d-block fs-7'>
                            {data.discountStatusID === 2 || data.discountStatusID === 3
                              ? `${data.extraDiscount}`
                              : 'N.A.'}
                          </span>
                        </td>
                        <td className='text-dark text-center text-hover-primary mb-1'>
                          <span className='text-dark fw-bolder text-hover-primary mb-1 fs-7'>
                            {data.projectFinalAmount}
                          </span>
                          <span className='text-muted fw-bold d-block fs-7'>
                            {data.discPerAsperAmnt}
                            <span className={data.discPerAsperAmnt === '' ? 'd-none' : ''}>
                              &nbsp;%
                            </span>
                          </span>
                        </td>
                        <td className='text-dark text-hover-primary text-end fw-bolder mb-1 fs-6'>
                          {data.discountTypeID === 1
                            ? `${
                                (parseFloat(data.projectFinalAmount) - parseFloat(data.reqExtraDisc)).toFixed(2)
                              }`
                            : '-'}
                        </td>
                        <td className='text-center text-hover-primary mb-1 fs-6'>
                          <span
                            className={`badge badge-light-${bgcolor} fs-8 fw-bolder mb-1 fs-6 cursor-pointer`}
                            onClick={() => handleShowResponse(data)}
                          >
                            {data.extraDiscStatusName}
                          </span>
                        </td>
                        {/* <td className='text-dark text-hover-primary mb-1 fs-6'>
                          statusss
                        </td> */}
                        <td className='text-center'>
                          {data.isCheckOut === true ? (
                            <Link
                              to={{
                                pathname: `/quotations/ready-made-quotation/pdf/${data.quotationID}`,
                                state: {
                                  mainEmployeeID: state.mainEmployeeID,
                                  mainCustomerID: state.mainCustomerID,
                                  mainSearch: state.mainSearch,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Download'
                            >
                              <span className='fa fa-download fs-2'></span>
                            </Link>
                          ) : (
                            <span className='text-center me-1 text-dark'>N.A.</span>
                          )}
                        </td>
                        <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/quotations/ready-made-quotation/view-cart/${data.quotationID}`,
                              state: {
                                quotationID: data.quotationID,
                                customerName: data.customerName,
                                bhkName: data.bhkName,
                                carpetAreaName: data.carpetArea,
                                projectName: data.projectName,
                                projectNumber: data.projectNumber,

                                mainEmployeeID: state.mainEmployeeID,
                                mainCustomerID: state.mainCustomerID,
                                mainSearch: state.mainSearch,
                              },
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1 text-success text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                        <td className={user.roleID === 2 ? 'text-center' : 'd-none'}>
                          <Link
                            to={`/quotations/ready-made-quotation/admin-pdf/${data.quotationID}`}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Download'
                          >
                            <span className='fa fa-download fs-2'></span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={11}
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>

      {/* ===================Is Discount Response Model===================== */}
      <CustomizationModalDiscountRequest
        discountStatusID={state.objDiscountRequestData.discountStatusID}
        discountTypeID={state.objDiscountRequestData.discountTypeID}
        projectNumber={state.objDiscountRequestData.projectNumber}
        reqExtraDisc={state.objDiscountRequestData.reqExtraDisc}
        extraDiscount={
          state.objDiscountRequestData.discountStatusID === 1
            ? state.objDiscountRequestData.reqExtraDisc
            : state.objDiscountRequestData.extraDiscount
        }
        discountCondition={state.objDiscountRequestData.discountCondition}
        quotationID={state.objDiscountRequestData.quotationID}
        discountStatusData={state.discountStatusData}
        show={showResponse}
        handleClose={handleCloseResponse}
      />
    </>
  )
}

export default CarpetryDiscountRequestListPage
