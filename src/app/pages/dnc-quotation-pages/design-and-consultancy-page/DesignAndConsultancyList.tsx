import {Pagination} from 'antd'
import React, {useEffect, useRef, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IDIYQuotationModel} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import Select from 'react-select'
import {IEmployeeSearchDDModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {ICustomerDropModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerDropSearchDownList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import Search from 'antd/es/input/Search'
import {Button, Modal} from 'react-bootstrap-v5'
import axios from 'axios'
import {DiscountTypeData} from '../../other-dropDowns/otherDropDowns'
import {GetDNCQuotationListApi} from '../../../modules/dnc-quotation-page/design-and-consultancy/DesignAndConsultancyCRUD'
import {BookedDNCQuotationApi} from '../../../modules/dnc-quotation-page/design-and-consultancy/DesignAndConsultancyCRUD'
import {DNCQuotationIsactiveApi} from '../../../modules/dnc-quotation-page/design-and-consultancy/DesignAndConsultancyCRUD'
import {dncQuotaionDiscountApi} from '../../../modules/dnc-quotation-page/design-and-consultancy/DesignAndConsultancyCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import moment from 'moment'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {
  getAllProjectListAPI,
  getGetProjectDetailsList_ByProjectIDAPI,
} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'

type Props = {}

interface IDIY {
  loading: boolean
  dncQuotationData: IDIYQuotationModel[]
  tmpDIYQuotationData: IDIYQuotationModel[]
  employeeData: IEmployeeSearchDDModel[]
  customerData: ICustomerDropModel[]
  projectData: IProjectModel[]
  selCustomerID: number
  searchText: string
  selDIYQuotationID: number
  activeID: number
  activeType: any
  selEmployeeID: number
  selProjectNo: string
  selDiscountCondition: string
  selDiscountTypeID: number
  projectName: string
  projectNumber: string
  isBeforeDiscount: boolean
  quotationID: number
  projName: string
  mainCustomerID: number
  mainEmployrrID: number
  mainSearch: string
}

const DesignAndConsultancyList: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState<any>(null)
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState<any>(null)
  const [state, setState] = useState<IDIY>({
    loading: false,
    dncQuotationData: [] as IDIYQuotationModel[],
    tmpDIYQuotationData: [] as IDIYQuotationModel[],
    employeeData: [] as IEmployeeSearchDDModel[],
    customerData: [] as ICustomerDropModel[],
    projectData: [] as IProjectModel[],
    searchText: '',
    selDIYQuotationID: 0,
    activeID: 0,
    activeType: false,
    selEmployeeID: 0,
    selCustomerID: 0,
    selProjectNo: '',
    selDiscountCondition: '',
    selDiscountTypeID: 0,
    projectName: '',
    projectNumber: '',
    isBeforeDiscount: false,
    quotationID: 0,
    projName: '',
    mainCustomerID: 0,
    mainEmployrrID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    localStorage.setItem('totalCounts', '0')
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)

      let mainEmployeeID: number = 0
      let mainCustomerID: number = 0
      let mainSearch: string = ''
      if (lc !== undefined) {
        mainEmployeeID = lc.employeeID
        mainCustomerID = lc.customerID
        mainSearch = lc.mainSearch
      }
      getAllEmployeeSearchDropdownData(mainEmployeeID, mainCustomerID, mainSearch)
    }, 100)
  }, [])

  function getAllEmployeeSearchDropdownData(
    tmpEmpId: number,
    mainCustomerID: number,
    mainSearch: string
  ) {
    getEmployeeSearchDropDown()
      .then((response) => {
        // let tmpEmpId = 0
        if (user.roleID !== 2) {
          tmpEmpId = user.employeeID
        }
        const responseData = response.data
        getAllCustomerSearchDropdownData(tmpEmpId, mainCustomerID, mainSearch, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAllCustomerSearchDropdownData(
    tmpEmpId: number,
    mainCustomerID: number,
    mainSearch: string,
    employeeData: IEmployeeSearchDDModel[]
  ) {
    getCustomerDropSearchDownList()
      .then((response) => {
        const responseData = response.data

        // setState({
        //   ...state,
        //   selEmployeeID: selEmployeeID,
        //   selCustomerID: selCustomerID,
        //   searchText: searchText,
        //   employeeData: employeeData,
        //   customerData: responseData,
        //   dncQuotationData: responseData,
        //   tmpDIYQuotationData: responseData,
        //   loading: false,
        // })
        getAllDNCQuotationData(tmpEmpId, mainCustomerID, mainSearch, employeeData, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAllDNCQuotationData(
    selEmployeeID: number,
    selCustomerID: number,
    searchText: string,
    employeeData: IEmployeeSearchDDModel[],
    customerData: ICustomerDropModel[]
  ) {
    GetDNCQuotationListApi(selEmployeeID, selCustomerID, searchText)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          const interest = employeeData
          const previously_selected_interests = interest.map((data, index) => ({
            _id: index,
            value: data.value,
            label: data.label,
            mobileNumber: data.mobileNumber,
          }))
          const Rows = previously_selected_interests
          for (let key in Rows) {
            if (Rows[key].value == selEmployeeID) {
              setSelectedOptionEmployee(Rows[key]._id)
            }
          }
          const interest2 = customerData
          const previously_selected_interests2 = interest2.map((data, index) => ({
            _id: index,
            value: data.value,
            label: data.label,
          }))
          const Rows2 = previously_selected_interests2
          for (let key in Rows2) {
            if (Rows2[key].value == selCustomerID) {
              setSelectedOptionCustomer(Rows2[key]._id)
            }
          }
          setState({
            ...state,
            selEmployeeID: selEmployeeID,
            selCustomerID: selCustomerID,
            searchText: searchText,
            employeeData: employeeData,
            customerData: customerData,
            dncQuotationData: responseData,
            tmpDIYQuotationData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            selEmployeeID: 0,
            selCustomerID: 0,
            searchText: '',
            employeeData: [],
            customerData: [],
            dncQuotationData: [],
            tmpDIYQuotationData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          selEmployeeID: 0,
          selCustomerID: 0,
          searchText: '',
          employeeData: [],
          customerData: [],
          dncQuotationData: [],
          tmpDIYQuotationData: [],
          loading: false,
        })
      })
  }

  // ================Employee Selection dropdown ================
  function employeeChange(e: any) {
    //  console.log(e)
    if (e === null) {
      setSelectedOptionEmployee(null)
      return getAllDNCQuotationData(
        0,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionEmployee(e)
    getAllDNCQuotationData(
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
      return getAllDNCQuotationData(
        state.selEmployeeID,
        0,
        state.searchText,
        state.employeeData,

        state.customerData
      )
    }
    setSelectedOptionCustomer(e)
    getAllDNCQuotationData(
      state.selEmployeeID,
      e.value,
      state.searchText,
      state.employeeData,

      state.customerData
    )
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'discountTypeID') {
      // formik.setFieldValue('bhkid', parseInt(value))
      setState({...state, selDiscountTypeID: parseInt(value)})
    }
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getAllDNCQuotationData(
        state.selEmployeeID,
        state.selCustomerID,
        keyword,
        state.employeeData,
        state.customerData
      )
    } else {
      getAllDNCQuotationData(
        state.selEmployeeID,
        state.selCustomerID,
        '',
        state.employeeData,
        state.customerData
      )
    }
  }

  const [valueDiscount, setValueDiscount] = useState<any>()
  function handleDiscountChange(event: any) {
    if (!isNaN(event.target.value)) {
      const value = event.target.value
      const elementId = event.target.id
      setValueDiscount(value)
    }
  }

  // ==================Condition Model Function===============
  const [showCondition, setShowCondition] = useState(false)
  const handleCloseCondition = () => {
    setState({
      ...state,
      selDiscountCondition: '',
      loading: false,
    })
    setShowCondition(false)
  }

  const handleShowCondition = (tmpSelDiscountCondition: string) => {
    setState({
      ...state,
      selDiscountCondition: tmpSelDiscountCondition,
      loading: false,
    })
    setShowCondition(true)
  }

  // ==================Discount Model Function===============
  const [showDiscount, setShowDiscount] = useState(false)
  const handleCloseDiscount = () => {
    setValueDiscount('')
    setState({
      ...state,
      selDIYQuotationID: 0,
      selDiscountTypeID: 0,
      selProjectNo: '',
      loading: false,
    })
    setShowDiscount(false)
  }

  const handleShowDiscount = (
    tmpQuotationID: number,
    tmpSelProjectNo: string,
    temDiscountTypeID: number
  ) => {
    setState({
      ...state,
      selDIYQuotationID: tmpQuotationID,
      selProjectNo: tmpSelProjectNo,
      selDiscountTypeID: temDiscountTypeID,
      loading: false,
    })
    setShowDiscount(true)
  }

  function handleDiscounApi() {
    if (state.selDiscountTypeID === 0) {
      return toast.error('Please Select Discount Type')
    }
    if (valueDiscount === undefined || valueDiscount <= 0.01) {
      toast.error('Discount field is required')
    }

    dncQuotaionDiscountApi(
      state.selEmployeeID,
      state.selCustomerID,
      state.searchText,
      state.selDIYQuotationID,
      state.selDiscountTypeID,
      `${valueDiscount}`,
      user.employeeID
    )
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            selEmployeeID: state.selEmployeeID,
            selCustomerID: state.selCustomerID,
            searchText: state.searchText,
            dncQuotationData: responseData,
            tmpDIYQuotationData: responseData,
            loading: false,
          })
          setName(state.searchText)
          setTotal(responseData.length)
          setShowDiscount(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            selEmployeeID: state.selEmployeeID,
            selCustomerID: state.selCustomerID,
            searchText: state.searchText,
            dncQuotationData: responseData,
            tmpDIYQuotationData: responseData,
            loading: false,
          })
          setName(state.searchText)
          setTotal(responseData.length)
          setShowDiscount(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowDiscount(false)
      })
    setValueDiscount(0)
  }

  //======================== Booked Function ==================
  const [showBooked, setShowBooked] = useState(false)
  const handleCloseBooked = () => {
    setShowBooked(false)
  }

  const handleShowBooked = (tmpQuotationID: number, address1: string, projectNumber: string) => {
    setState({
      ...state,
      selDIYQuotationID: tmpQuotationID,
      projName: address1,
      projectNumber: projectNumber,
      loading: false,
    })
    setShowBooked(true)
  }

  function handleChangeProj(e: any) {
    const value = e.target.value
    setState({...state, projName: value})
  }

  const [bookingDate, setBookingDate] = useState<string>(moment(new Date()).format('YYYY-MM-DD'))

  function handleChangeDate(e: any) {
    const value = e.target.value
    setBookingDate(value)
  }

  function BookedQuotation(temQueID: number) {
    state.loading = true
    if (state.projName == '') {
      return toast.error('Please Enter Project Name')
    }
    BookedDNCQuotationApi(temQueID, user.employeeID, state.projName, bookingDate)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Booked Successfully')
          getAllDNCQuotationData(
            state.selEmployeeID,
            state.selCustomerID,
            state.searchText,
            state.employeeData,

            state.customerData
          )
          setShowBooked(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowBooked(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowBooked(false)
      })
  }

  // // -----------------Is Active model----------------------
  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)
  const handleShowActive = (event: any) => {
    const temEmpId = event.target.id
    const temIsAct = event.target.checked
    setState({
      ...state,
      quotationID: temEmpId,
      isBeforeDiscount: temIsAct,
    })
    setShowActive(true)
  }

  // ---------------------- Is Active employee api -------------------------
  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    DNCQuotationIsactiveApi(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getAllDNCQuotationData(
            state.selEmployeeID,
            state.selCustomerID,
            state.searchText,
            state.employeeData,

            state.customerData
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
  // ==============================Download============================
  const [selDwID, setselDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const [selAdmDwID, setselAdmDwID] = useState<number>(0)
  const [admindwnldLoader, setAdmindwnldLoader] = useState<boolean>(false)
  const [selAbrDwID, setselAbrDwID] = useState<number>(0)
  const [abrDwnldLoader, setAbrdwnldLoader] = useState<boolean>(false)
  function getQuotationPdf(pathname: string, quotationID: number) {
    var URL = ''
    if (pathname == `/dnc-quotation/civil-and-architect/pdf/${quotationID}`) {
      URL = `${process.env.REACT_APP_API_URL}/DNCPDF/DownloadDIYQuotationPDF`
      setDownloadLoader(true)
      setselDwID(quotationID)
    } else {
      alert('Error')
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios.post(URL, {quotationID: quotationID, isDownload: 1}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData
      // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
      // var bin = atob(b64)
      // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
      // Embed the PDF into the HTML page and show it to the user
      const linkSource = `data:application/pdf;base64,${b64}`
      const aPdfDownload = document.createElement('a')
      const fileName = 'DIY_Quotation_' + quotationID + '_' + Tdate + '.pdf'
      aPdfDownload.setAttribute('download', fileName)
      aPdfDownload.href = linkSource
      aPdfDownload.download = fileName
      document.body.append(aPdfDownload)
      aPdfDownload.click()
      aPdfDownload.remove()
      if (pathname == `/dnc-quotation/civil-and-architect/pdf/${quotationID}`) {
        setDownloadLoader(false)
        setselDwID(0)
      } else {
        setDownloadLoader(false)
        setselDwID(0)
        setAdmindwnldLoader(false)
        setselAdmDwID(0)
        setAbrdwnldLoader(false)
        setselAbrDwID(0)
      }
    })
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.dncQuotationData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDIYQuotationModel[] = state.dncQuotationData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // ------------------------- For Project Details ---------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }

  function handleShow(temProjectID: number) {
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
    setShow(true)
  }

  return (
    <>
      <div className={'page-title d-flex mb-3'}>
        {/* begin::Title */}
        <h1 className='d-flex align-items-center text-danger fw-bold my-1 fs-3'>
          Products
          <>
            <span className='h-20px border-dark border-start ms-3 mx-2'></span>
            <Link className='text-info fs-5 fw-bolder my-1 ms-1' to='/products-quotations'>
              Custom
            </Link>
          </>
        </h1>
        {/* end::Title */}
        <ul className='breadcrumb breadcrumb-separatorless fw-bold fs-6 my-1'>
          <li className='breadcrumb-item'>
            <span className='h-20px border-dark border-start mx-4'></span>
            <span className='text-primary text-hover-primary'>D&C</span>
          </li>
        </ul>
      </div>

      <div className={`card `}>
        {/* begin::Header */}
        <div
          className='card-header border-0 py-2 '
          style={{
            backgroundColor: '#000000',
            position: 'sticky',
            top: 120,
            // zIndex: 1000,
          }}
        >
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search by Customer:</label>
            <Select
              className='basic-single'
              classNamePrefix='select'
              isClearable={true}
              isSearchable={true}
              value={state.customerData[selectedOptionCustomer]}
              // value={selectedOptionCustomer}
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
              // value={selectedOptionEmployee}
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
              onSearch={(value: any) => searchFilter(value)}
            />
          </div>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: '/dnc-quotation/design-and-consultancy/add',
                state: {
                  mainEmployeeID: state.selEmployeeID,
                  mainCustomerID: state.selCustomerID,
                  mainSearch: state.searchText,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white mt-5'
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
                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Project No.</span>
                    <span className='text-muted fw-bold d-block fs-6'>Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Customer</span>
                    <span className='text-muted fw-bold d-block fs-6'>Mobile</span>
                  </th>
                  {/* <th className='min-w-125px text-center'>Project No.</th>
                  <th className='min-w-125px text-center'>Customer Name</th>
                  <th className='min-w-125px text-center'>Date</th> */}
                  <th className='min-w-125px text-center'>Employee</th>

                  <th className='min-w-25px text-center'>Request For Discount</th>
                  <th className='min-w-25px text-center'>Download</th>
                  <th className='min-w-25px text-center'>Is Default Discount</th>
                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>Book</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        let bgcolor = ''
                        if (data.discountStatusID === 1) {
                          bgcolor = 'primary'
                        } else if (data.discountStatusID === 2) {
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
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span
                                    //title='Click Hear'
                                    className='cursor-pointer text-dark text-hover-primary fs-5'
                                    //onClick={() => handleShow(data.projectID)}
                                  >
                                    {data.projectNumber == '' ? 'N.A' : data.projectNumber}
                                  </span>
                                  <span className='text-muted d-block fs-6 mt-1'>
                                    {data.quotationDate == '' ? 'N.A' : data.quotationDate}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'>
                                {data.customerName == '' ? 'N.A' : data.customerName}
                              </span>
                              <span className='text-muted d-block fs-6'>
                                {data.mobileNumber == '' ? 'N.A' : data.mobileNumber}
                              </span>
                            </td>
                            {/* <td
                              className='cursor-pointer text-center me-1 text-dark text-hover-primary mb-1 fs-6'
                              title='Click Hear'
                              onClick={() => handleShow(data.projectID)}
                            >
                              {data.projectNumber}
                            </td>
                            <td className='text-center me-1 text-dark text-hover-primary mb-1 fs-6'>
                              {data.customerName}
                            </td>
                            <td className='text-center me-1 text-dark text-hover-primary mb-1 fs-6'>
                              {data.quotationDate}
                            </td> */}
                            <td className='text-center me-1 text-dark text-hover-primary mb-1 fs-6'>
                              {data.employeeName}
                            </td>

                            <td className='text-center'>
                              {data.discountStatusID === 0 && data.isBooked ? (
                                <span className='text-center me-1 text-dark text-hover-primary'>
                                  N.A
                                </span>
                              ) : data.discountStatusID === 0 ? (
                                <div
                                  onClick={() =>
                                    handleShowDiscount(
                                      data.quotationID,
                                      data.projectNumber,
                                      data.discountTypeID
                                    )
                                  }
                                  className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/ecommerce/ecm003.svg'
                                    className='svg-icon-2x svg-icon-danger'
                                  />
                                </div>
                              ) : data.discountStatusID === 3 ? (
                                <span
                                  className={`badge badge-light-${bgcolor} fw-bold me-1 cursor-pointer`}
                                  onClick={() => handleShowCondition(data.discountCondition)}
                                >
                                  {data.extraDiscStatusName}
                                </span>
                              ) : (
                                <span className={`badge badge-light-${bgcolor} fw-bold me-1`}>
                                  {data.extraDiscStatusName}
                                </span>
                              )}
                              <span className='text-dark d-block mb-1 fs-6'>
                                {data.discountStatusID === 2 || data.discountStatusID === 3
                                  ? `${data.extraDiscount}${
                                      data.discountTypeID === 1 ? '(Fix Value)' : '%'
                                    }`
                                  : 'N.A.'}
                              </span>
                            </td>
                            <td className='text-center'>
                              {/* {data.isCheckOut === true ? (
                            <> */}
                              {downloadLoader && selDwID == data.quotationID ? (
                                <span className='d-flex justify-content-center m-5 p-5'>
                                  <span
                                    className='spinner-border text-primary'
                                    style={{width: '1rem', height: '1rem'}}
                                    role='status'
                                  >
                                    <span className='visually-hidden'>Loading...</span>
                                  </span>
                                </span>
                              ) : (
                                <span
                                  onClick={() =>
                                    getQuotationPdf(
                                      `/dnc-quotation/civil-and-architect/pdf/${data.quotationID}`,
                                      data.quotationID
                                    )
                                  }
                                  className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                                  data-bs-toggle='tooltip'
                                  data-bs-placement='top'
                                  title='Download'
                                >
                                  <span className='fa fa-download fs-2'></span>
                                </span>
                              )}
                              {/* </>
                          ) : (
                            <span className='text-center me-1 text-dark'>N.A.</span>
                          )} */}
                            </td>
                            <td className=''>
                              <div className='form-check form-switch ms-3 '>
                                <input
                                  className='form-check-input '
                                  type='checkbox'
                                  id={`${data.quotationID}`}
                                  checked={data.isBeforeDiscount}
                                  onChange={(e) => handleShowActive(e)}
                                />
                              </div>
                            </td>
                            <td className={'text-center'}>
                              {!data.isBooked ? (
                                <span
                                  className={`badge badge-light-success cursor-pointer fw-bold me-1`}
                                  onClick={() =>
                                    handleShowBooked(
                                      data.quotationID,
                                      data.address1,
                                      data.projectNumber
                                    )
                                  }
                                >
                                  Book
                                </span>
                              ) : (
                                <>
                                  {data.isBooked ? (
                                    <span className='text-center me-1 text-dark text-hover-primary'>
                                      Booked
                                    </span>
                                  ) : (
                                    <span className='text-center me-1 text-muted text-hover-primary'>
                                      N.A.
                                    </span>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    <BlankDataImageInTable
                      length={currentPosts.length}
                      loading={state.loading}
                      colSpan={10}
                    />{' '}
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>

      {/* ---------------------Discount modal popup------------ */}
      <Modal
        dialogClassName='modal-30w'
        centered
        scrollable={true}
        show={showDiscount}
        onHide={handleCloseDiscount}
        closeVariant='white'
      >
        <Modal.Header closeButton>
          <div className='d-block'>
            <Modal.Title>Extra Discount Request</Modal.Title>
          </div>
          <Modal.Title>{state.selProjectNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row mb-6 text-center'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Discount Type :</label>
            <div className='col-lg-7 fv-row d-flex'>
              <select
                className='  form-select form-select-white lineHeightByD'
                onChange={selectChange}
                id='discountTypeID'
              >
                <option selected={state.selDiscountTypeID === 0 ? true : false} value={0}>
                  Select Discount Type
                </option>
                {DiscountTypeData.length > 0 &&
                  DiscountTypeData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.discountTypeID}
                        selected={data.discountTypeID === state.selDiscountTypeID ? true : false}
                      >
                        {data.discountTypeName}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>
          <div className={state.selDiscountTypeID === 0 ? 'd-none' : 'row mb-6 text-center'}>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Discount :</label>
            <div className='col-lg-7 fv-row d-flex'>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                placeholder='Discount'
                value={valueDiscount}
                // tabIndex={1}
                // ref = {testRef}
                autoFocus
                onChange={(e) => handleDiscountChange(e)}
              />
              <span className={state.selDiscountTypeID === 2 ? 'mt-4 fs-3' : 'd-none'}>%</span>
              <span className={state.selDiscountTypeID === 1 ? 'mt-4 fs-6 col-lg-3' : 'd-none'}>
                Fix Value
              </span>
            </div>
          </div>
          <div className='text-center'>
            <Button variant='primary' className='text-center' onClick={() => handleDiscounApi()}>
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* ---------------------Condition modal popup------------ */}
      <Modal
        size='xl'
        scrollable={true}
        show={showCondition}
        onHide={handleCloseCondition}
        closeVariant='white'
      >
        <Modal.Header closeButton>
          <div className='d-block'>
            <Modal.Title>Approved With Condition</Modal.Title>
          </div>
          <Modal.Title>{state.selProjectNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row mb-6'>
            <label className='col-lg-2 self-align-center col-form-label fw-bold fs-6'>
              Conditions :
            </label>
            <div className='col-lg-10 fv-row d-flex text-start'>
              <span className='form-control form-control-lg form-control-solid bg-white'>
                {state.selDiscountCondition}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            className='text-center'
            onClick={() => handleCloseCondition()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ======================== Booked Model====================== */}
      <Modal show={showBooked} onHide={handleCloseBooked} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Booked Diy Quotation</Modal.Title>
          <div>{state.projectNumber}</div>
        </Modal.Header>
        <Modal.Body>
          <div className='row mb-5'>
            <label className='col-lg-3 col-form-label fw-bold fs-6'>Project Name:</label>
            <div className='col-lg-9 fv-row mb-5'>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                placeholder='project Name'
                value={state.projName}
                onChange={(e) => handleChangeProj(e)}
              />
            </div>
            <label className='col-lg-3 col-form-label fw-bold fs-6'>Booking Date:</label>
            <div className='col-lg-9 fv-row'>
              <input
                type='date'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                placeholder='Project Name'
                value={bookingDate}
                onChange={(e) => handleChangeDate(e)}
              />
            </div>
          </div>
          <h4>Are you sure you want to Booked Quotation</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={() => BookedQuotation(state.selDIYQuotationID)}>
            Booked
          </Button>
          <Button variant='secondary' onClick={handleCloseBooked}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.quotationID}
        activeType={state.isBeforeDiscount}
        pageName={'Modular Quotation'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.quotationID, state.isBeforeDiscount)}
      />
      <ProjectDetailsModel
        data={state.projectData}
        show={show}
        handleClose={handleClose}
        loading={state.loading}
      />
    </>
  )
}

export default DesignAndConsultancyList
