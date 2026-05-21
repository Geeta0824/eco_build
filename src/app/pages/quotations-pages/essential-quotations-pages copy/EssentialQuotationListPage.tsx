import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {GetStandarQuotationList} from '../../../modules/quotations-master-page/standard-quotations-master-page/StandardQuotationsCRUD'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import Select from 'react-select'
import {IEmployeeSearchDDModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {ICustomerDropModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerDropSearchDownList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import Search from 'antd/es/input/Search'
import {IEssentialQuotationsModel} from '../../../models/quotations-page/Essential-quotation-page/IEssentialQuotationsModel'
import { GetEssentialQuotationList } from '../../../modules/quotations-master-page/essential-quotations-master-page/EssentialQuotationsCRUD'

type Props = {}

interface IStandard {
  loading: boolean
  essentialQuotationsData: IEssentialQuotationsModel[]
  tmpEssentialQuotationsData: IEssentialQuotationsModel[]
  employeeData: IEmployeeSearchDDModel[]
  customerData: ICustomerDropModel[]
  selEmployeeID: number
  selCustomerID: number
  searchText: string
  selStandardQuotationsID: number
  activeID: number
  activeType: any
}

const EssentialQuotationListPage: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState<number>(-1)
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState<number>(-1)
  const [state, setState] = useState<IStandard>({
    loading: false,
    essentialQuotationsData: [] as IEssentialQuotationsModel[],
    tmpEssentialQuotationsData: [] as IEssentialQuotationsModel[],
    employeeData: [] as IEmployeeSearchDDModel[],
    customerData: [] as ICustomerDropModel[],
    searchText: '',
    selStandardQuotationsID: 0,
    activeID: 0,
    selEmployeeID: 0,
    selCustomerID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getAllEmployeeSearchDropdownData()
    }, 100)
  }, [])

  function getAllEmployeeSearchDropdownData() {
    getEmployeeSearchDropDown()
      .then((response) => {
        const responseData = response.data
        let tmpEmpId = -1
        if (user.roleID !== 2) {
          tmpEmpId = user.employeeID
        }
        getAllCustomerSearchDropdownData(tmpEmpId, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAllCustomerSearchDropdownData(
    selEmployeeID: number,
    employeeData: IEmployeeSearchDDModel[]
  ) {
    getCustomerDropSearchDownList()
      .then((response) => {
        const responseData = response.data
        getAllstandardQuotationsData(
          selEmployeeID,
          state.selCustomerID,
          state.searchText,
          employeeData,
          responseData
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAllstandardQuotationsData(
    selEmployeeID: number,
    selCustomerID: number,
    searchText: string,
    employeeData: IEmployeeSearchDDModel[],
    customerData: ICustomerDropModel[]
  ) {
    GetEssentialQuotationList(selEmployeeID, selCustomerID, searchText)
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
            essentialQuotationsData: responseData,
            tmpEssentialQuotationsData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, essentialQuotationsData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, essentialQuotationsData: [], loading: false})
      })
  }

  // ================Employee Selection dropdown ================
  function employeeChange(e: any) {
 //  console.log(e)
    if (e === null) {
      return getAllstandardQuotationsData(
        -1,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionEmployee(e)
    getAllstandardQuotationsData(
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
      return getAllstandardQuotationsData(
        state.selEmployeeID,
        -1,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionCustomer(e)
    getAllstandardQuotationsData(
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
 //  console.log(keyword)
    // setMainLoading(true)
    if (keyword !== '') {
      getAllstandardQuotationsData(
        state.selEmployeeID,
        state.selCustomerID,
        keyword,
        state.employeeData,
        state.customerData
      )
    } else {
      getAllstandardQuotationsData(
        state.selEmployeeID,
        state.selCustomerID,
        '',
        state.employeeData,
        state.customerData
      )
    }
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.essentialQuotationsData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IEssentialQuotationsModel[] = state.essentialQuotationsData.slice(
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
              value={state.customerData[selectedOptionCustomer]}
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
              value={state.employeeData[selectedOptionEmployee]}
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
          <div
            className='card-toolbar mt-6'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/quotations/essential-quotation/add'
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
                  <th className='min-w-125px'>Project No.</th>
                  <th className='min-w-125px'>Customer Name</th>
                  <th className='min-w-125px'>Date</th>
                  <th className='min-w-125px'>Employee</th>
                  <th className='min-w-25px text-center'>View</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
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
                        <td className='text-center'>
                          <Link
                            to={`/quotations/essential-quotation/view/${data.quotationID}`}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
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
    </>
  )
}

export default EssentialQuotationListPage
