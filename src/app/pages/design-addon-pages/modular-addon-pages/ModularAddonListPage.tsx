import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import Select from 'react-select'
import {IEmployeeSearchDDModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {ICustomerDropModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerDropSearchDownList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import Search from 'antd/es/input/Search'
import {Button, Modal} from 'react-bootstrap-v5'
import axios from 'axios'
import {modularTypeData} from '../../other-dropDowns/otherDropDowns'
import {
  Booked_ModularQuotationApi,
  GetModularQuotationListAPI,
} from '../../../modules/modular-quotation-master-page/diy-quotation-master-page/ModularQuotationCRUD'
import {IDesignDIYAddonModel} from '../../../models/design-addon-page/IDIYAddonModel'
import {GetGetDegignAddon_DIY_QuotationList_ForAddAPI} from '../../../modules/design-addon/diy-addon/DIYAddonCRUD'
import {
  GetDegignAddon_Modular_QuotationList_ForAddAPI,
  GetDegignAddon_Modular_QuotationListAPI,
} from '../../../modules/design-addon/modular-addon/ModularAddonCRUD'

type Props = {}

interface IDIY {
  loading: boolean
  modularAddonData: IDesignDIYAddonModel[]
  tmpModularAddonData: IDesignDIYAddonModel[]
  employeeData: IEmployeeSearchDDModel[]
  customerData: ICustomerDropModel[]
  diyQuotationData: IDesignDIYAddonModel[]
  tmpDIYQuotationData: IDesignDIYAddonModel[]
  selCustomerID: number
  searchText: string
  selDIYQuotationID: number
  quotationID: number
  isBeforeDiscount: any
  selEmployeeID: number
  selProjectNo: string
  selDiscountCondition: string
  selDiscountTypeID: number
  selModularTypeID: number
  projName: string
  projectNumber: string
}

const ModularAddonListPage: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState<any>(null)
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState<any>(null)
  const [state, setState] = useState<IDIY>({
    loading: false,
    modularAddonData: [] as IDesignDIYAddonModel[],
    tmpModularAddonData: [] as IDesignDIYAddonModel[],
    employeeData: [] as IEmployeeSearchDDModel[],
    customerData: [] as ICustomerDropModel[],
    diyQuotationData: [] as IDesignDIYAddonModel[],
    tmpDIYQuotationData: [] as IDesignDIYAddonModel[],
    searchText: '',
    selDIYQuotationID: 0,
    quotationID: 0,
    isBeforeDiscount: false,
    selEmployeeID: 0,
    selCustomerID: 0,
    selProjectNo: '',
    selDiscountCondition: '',
    selDiscountTypeID: 0,
    selModularTypeID: 0,
    projName: '',
    projectNumber: '',
  })

  useEffect(() => {
    setState({...state, loading: false})
    localStorage.setItem('totalCounts', '0')
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let modularTypeID: any = 0
      let mainEmployeeID: number = 0
      let mainCustomerID: number = 0
      let mainSearch: string = ''
      if (lc !== undefined) {
        modularTypeID = lc.modularTypeID
        mainEmployeeID = lc.employeeID
        mainCustomerID = lc.customerID
        mainSearch = lc.mainSearch
      }
      getAllEmployeeSearchDropdownData(modularTypeID, mainEmployeeID, mainCustomerID, mainSearch)
    }, 100)
  }, [])

  function getAllEmployeeSearchDropdownData(
    tmpModularTypeID: number,
    tmpEmpId: number,
    mainCustomerID: number,
    mainSearch: string
  ) {
    getEmployeeSearchDropDown()
      .then((response) => {
        // let tmpEmpId = 0
        // if (user.roleID !== 2) {
        //   tmpEmpId = user.employeeID
        // }
        const responseData = response.data
        getAllCustomerSearchDropdownData(
          tmpModularTypeID,
          tmpEmpId,
          mainCustomerID,
          mainSearch,
          responseData
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAllCustomerSearchDropdownData(
    tmpModularTypeID: number,
    selEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string,
    employeeData: IEmployeeSearchDDModel[]
  ) {
    getCustomerDropSearchDownList()
      .then((response) => {
        const responseData = response.data
        getAllmodularAddonData(
          tmpModularTypeID,
          selEmployeeID,
          mainCustomerID,
          mainSearch,
          employeeData,
          responseData
        )
        setName(mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  function getAllmodularAddonData(
    tmpModularTypeID: number,
    selEmployeeID: number,
    selCustomerID: number,
    searchText: string,
    employeeData: IEmployeeSearchDDModel[],
    customerData: ICustomerDropModel[]
  ) {
    GetDegignAddon_Modular_QuotationListAPI(
      tmpModularTypeID,
      selEmployeeID,
      selCustomerID,
      searchText
    )
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
            selModularTypeID: tmpModularTypeID,
            selEmployeeID: selEmployeeID,
            selCustomerID: selCustomerID,
            searchText: searchText,
            employeeData: employeeData,
            customerData: customerData,
            modularAddonData: responseData,
            tmpModularAddonData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, modularAddonData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, modularAddonData: [], loading: false})
      })
  }

  // ================Employee Selection dropdown ================
  function employeeChange(e: any) {
    console.log(e)
    if (e === null) {
      setSelectedOptionEmployee(null)
      return getAllmodularAddonData(
        state.selModularTypeID,
        0,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionEmployee(e)
    getAllmodularAddonData(
      state.selModularTypeID,
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
      return getAllmodularAddonData(
        state.selModularTypeID,
        state.selEmployeeID,
        0,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionCustomer(e)
    getAllmodularAddonData(
      state.selModularTypeID,
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
    } else if (elementId === 'modularTypeID') {
      getAllmodularAddonData(
        parseInt(value),
        state.selEmployeeID,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getAllmodularAddonData(
        state.selModularTypeID,
        state.selEmployeeID,
        state.selCustomerID,
        keyword,
        state.employeeData,
        state.customerData
      )
    } else {
      getAllmodularAddonData(
        state.selModularTypeID,
        state.selEmployeeID,
        state.selCustomerID,
        '',
        state.employeeData,
        state.customerData
      )
    }
  }

  function BookedQuotation(temQueID: number) {
    // state.loading = true
    // if (state.projName == '') {
    //   return toast.error('Please Enter Project Name')
    // }
    // Booked_ModularQuotationApi(temQueID, user.employeeID, state.projName, '')
    //   .then((response) => {
    //     if (response.data.isSuccess == true) {
    //       toast.success('Booked Successfully')
    //       getAllmodularAddonData(
    //         state.selModularTypeID,
    //         state.selEmployeeID,
    //         state.selCustomerID,
    //         state.searchText,
    //         state.employeeData,
    //         state.customerData
    //       )
    //     } else {
    //       toast.error(`${response.data.message}`)
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(`${error}`)
    //   })
  }

  const [selDwID, setselDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const [selAdmDwID, setselAdmDwID] = useState<number>(0)
  const [admindwnldLoader, setAdmindwnldLoader] = useState<boolean>(false)
  const [selAbrDwID, setselAbrDwID] = useState<number>(0)
  const [abrDwnldLoader, setAbrdwnldLoader] = useState<boolean>(false)
  const [selTeamDwID, setselTeamDwID] = useState<number>(0)
  const [teamDwnldLoader, setTeamdwnldLoader] = useState<boolean>(false)
  function getQuotationPdf(pathname: string, quotationID: number) {
    var URL = ''
    if (pathname == `/design/modular-addon/pdf/${quotationID}`) {
      setDownloadLoader(true)
      setselDwID(quotationID)
      URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDF`
    } else if (pathname == `/design/modular-addon/agency-breakup-pdf/${quotationID}`) {
      setAbrdwnldLoader(true)
      setselAbrDwID(quotationID)
      URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFForAgencyBreackup`
    } else if (pathname == `/design/modular-addon/admin-pdf/${quotationID}`) {
      setAdmindwnldLoader(true)
      setselAdmDwID(quotationID)
      URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFForAdmin`
    } else if (pathname == `/design/modular-addon/Team-pdf/${quotationID}`) {
      setTeamdwnldLoader(true)
      setselTeamDwID(quotationID)
      URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDF_Designer`
    } else {
      alert('Error')
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios.post(URL, {quotationID: quotationID, isDownload: 1}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData
      const linkSource = `data:application/pdf;base64,${b64}`
      const aPdfDownload = document.createElement('a')
      const fileName = 'MODULAR_Quotation_' + quotationID + '_' + Tdate + '.pdf'
      aPdfDownload.setAttribute('download', fileName)
      aPdfDownload.href = linkSource
      aPdfDownload.download = fileName
      document.body.append(aPdfDownload)
      aPdfDownload.click()
      aPdfDownload.remove()
      if (pathname == `/design/modular-addon/pdf/${quotationID}`) {
        setDownloadLoader(false)
        setselDwID(0)
      } else if (pathname == `/design/modular-addon/admin-pdf/${quotationID}`) {
        setAdmindwnldLoader(false)
        setselAdmDwID(0)
      } else if (pathname == `/design/modular-addon/agency-breakup-pdf/${quotationID}`) {
        setAbrdwnldLoader(false)
        setselAbrDwID(0)
      } else if (pathname == `/design/modular-addon/Team-pdf/${quotationID}`) {
        setTeamdwnldLoader(false)
        setselTeamDwID(0)
      } else {
        setDownloadLoader(false)
        setselDwID(0)
        setAdmindwnldLoader(false)
        setselAdmDwID(0)
        setAbrdwnldLoader(false)
        setselAbrDwID(0)
        setTeamdwnldLoader(false)
        setselTeamDwID(0)
      }
    })
  }
  // ---------------------------------------------------------------------------

  function getMultipleDropdownListData() {
    GetDegignAddon_Modular_QuotationList_ForAddAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            diyQuotationData: responseData,
            tmpDIYQuotationData: responseData,
            loading: false,
          })
          setAddonTotal(responseData.length)
          setAddonPage(1)
          setShow(true)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            diyQuotationData: [],
            loading: false,
          })
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          diyQuotationData: [],
          loading: false,
        })
        setShow(false)
      })
  }
  // -----------------Customer Select-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }

  // --------For Model Data onClick Function-------
  function selectAddonQuotationData(tmpDIYQuotationData: IDesignDIYAddonModel) {
    history.push({
      pathname: `/design/modular-addon/view-cart/${tmpDIYQuotationData.quotationID}`,
      state: {
        quotationID: tmpDIYQuotationData.quotationID,
        customerName: tmpDIYQuotationData.customerName,
        projectName: tmpDIYQuotationData.projectName,
        bhkName: tmpDIYQuotationData.bhkName,
        projectNumber: tmpDIYQuotationData.projectNumber,
        carpetAreaName: tmpDIYQuotationData.carpetArea,
        mainEmployeeID: state.selEmployeeID,
        mainCustomerID: state.selCustomerID,
        mainSearch: state.searchText,
      },
    })
    setShow(false)
  }

  // ===================== For Customer Filter =====================
  const [addonName, setAddonName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDIYQuotationData.filter((user) => {
        return (
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.quotationNumber.toString().includes(keyword.toString()) ||
          user.projectNumber.toString().includes(keyword.toString()) ||
          user.salesPerson.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, diyQuotationData: results})
      setAddonTotal(results.length)
      setAddonPage(1)
    } else {
      setState({...state, diyQuotationData: state.tmpDIYQuotationData})
      setAddonTotal(state.tmpDIYQuotationData.length)
      setAddonPage(1)
    }
    setAddonName(keyword)
  }

  //-------------------------- Pagination --------------------------
  const [addonTotal, setAddonTotal] = useState(0) //  length
  const [addonPage, setAddonPage] = useState(1)
  const [addonPostPerPage, setAddonPostPerPage] = useState(10)
  const addonIndexOfLastPage = addonPage * addonPostPerPage
  const addonIndexOfFirstPage = addonIndexOfLastPage - addonPostPerPage
  const addonCurrentPosts: IDesignDIYAddonModel[] = state.diyQuotationData.slice(
    addonIndexOfFirstPage,
    addonIndexOfLastPage
  )
  const addonOnShowSizeChange = (current: any, pageSize: any) => {
    setAddonPostPerPage(pageSize)
  }
  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.modularAddonData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDesignDIYAddonModel[] = state.modularAddonData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 row gx-5' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Modular Type:</label>
            <select
              className='form-select bg-light-primary lineHeightByD'
              aria-label='Default select example'
              onChange={selectChange}
              id='modularTypeID'
            >
              <option selected={state.selModularTypeID === 0 ? true : false} value={0}>
                Select Modular Type
              </option>
              {modularTypeData.length > 0 &&
                modularTypeData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.modularTypeID}
                      selected={data.modularTypeID === state.selModularTypeID ? true : false}
                    >
                      {data.modularTypeName}
                    </option>
                  )
                })}
            </select>
          </div>
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
              onSearch={(value) => searchFilter(value)}
            />
          </div>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <div
              onClick={getMultipleDropdownListData}
              className='btn btn-sm btn-light-primary bg-white mt-5'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </div>
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
                  <th className='min-w-125px text-start'>Project Name</th>
                  <th className='min-w-125px text-start'>Quotation Name</th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Customer Name</span>
                    {/* <span className='text-muted fw-bold d-block fs-5'>Mobile Number</span> */}
                  </th>
                  <th className='min-w-125px text-start'>Employee Name</th>
                  <th className='min-w-25px text-center'>Download</th>
                  <th className='min-w-25px text-center'>View Cart</th>

                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>
                    Cost BreakUp
                  </th>

                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>
                    Agency BreakUp
                  </th>
                  <th className={'min-w-25px text-center'}>Book</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
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
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.projectName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.quotationNumber}
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              <span className='text-dark text-hover-primary fs-5'>
                                {data.customerName}
                              </span>
                              {/* <span className='text-muted d-block fs-7 mt-1'>
                                {data.mobileNumber}
                              </span> */}
                            </div>
                          </div>
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.salesPerson}
                        </td>
                        <td className='text-center'>
                          {data.isCheckOut === true ? (
                            <>
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
                                      `/design/modular-addon/pdf/${data.quotationID}`,
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
                            </>
                          ) : (
                            <span className='text-center me-1 text-dark'>N.A.</span>
                          )}
                        </td>

                        <td className='text-center'>
                          {data.isDesignBooked === true ? (
                            <span className='text-center me-1 text-dark text-hover-primary'>
                              N.A
                            </span>
                          ) : (
                            <Link
                              to={{
                                pathname: `/design/modular-addon/view-cart/${data.quotationID}`,
                                state: {
                                  quotationID: data.quotationID,
                                  customerName: data.customerName,
                                  projectName: data.projectName,
                                  bhkName: data.bhkName,
                                  carpetAreaName: data.carpetArea,
                                  projectNumber: data.projectNumber,
                                  modularTypeID: state.selModularTypeID,
                                  mainEmployeeID: state.selEmployeeID,
                                  mainCustomerID: state.selCustomerID,
                                  mainSearch: state.searchText,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1 text-success text-hover-light'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='View'
                            >
                              <span className='fa fa-eye fs-2'></span>
                            </Link>
                          )}
                        </td>

                        <td className={user.roleID === 2 ? 'text-center' : 'd-none'}>
                          {data.isCheckOut === true ? (
                            <>
                              {abrDwnldLoader && selAbrDwID == data.quotationID ? (
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
                                      `/design/modular-addon/agency-breakup-pdf/${data.quotationID}`,
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
                            </>
                          ) : (
                            <span className='text-center me-1 text-dark'>N.A.</span>
                          )}
                        </td>
                        <td className='text-center'>
                          {!data.isBooked && data.isCheckOut ? (
                            <span className='text-center me-1 text-dark'>N.A.</span>
                          ) : (
                            <>
                              {teamDwnldLoader && selTeamDwID == data.quotationID ? (
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
                                      `/design/modular-addon/Team-pdf/${data.quotationID}`,
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
                            </>
                          )}
                        </td>
                        <td className={'text-center'}>
                          {!data.isDesignBooked && data.isCheckOut ? (
                            <span
                              className={`badge badge-light-success cursor-pointer fw-bold me-1`}
                              onClick={() => BookedQuotation(data.quotationID)}
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
      {/* ----------------------------Addon Quotation List Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Addon Quotation Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-light-primary'
                  placeholder='Search'
                  onChange={(e) => filter(e)}
                  value={addonName}
                />
              </span>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Quotation Number</span>
                    </th>

                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Sales Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Name</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="border-bottom">
                  {addonCurrentPosts.length > 0 &&
                    addonCurrentPosts.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          onClick={() => selectAddonQuotationData(data)}
                          className='cursor-pointer'
                          title='Click For Addon Quotation'
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.customerName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectNumber}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.salesPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.projectName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setAddonPage(value)}
                pageSize={addonPostPerPage}
                total={addonTotal}
                current={addonPage}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={addonOnShowSizeChange}
                showTotal={(addonTotal) => `Total ${addonTotal} items`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModularAddonListPage
