import {Pagination} from 'antd'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IDIYQuotationModel} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {
  BookedDiyQuotationApi,
  GetDiyQuotationListApi,
  GetDiyQuotationListApi_Pagination,
  DIYQuotationIsactive,
  diyQuotaionDiscountApi,
  GetModularQuotationListByCustomerID,
  MergeDIYWithModularApi,
  BookedDIYWithModualarQuotationApi,
} from '../../../modules/quotations-master-page/diy-quotation-master-page/DIYQuotationCRUD'
import Select from 'react-select'
import {IEmployeeSearchDDModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {ICustomerDropModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerDropSearchDownList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import Search from 'antd/es/input/Search'
import {Button, Card, Col, Form, Modal} from 'react-bootstrap-v5'
import axios from 'axios'
import {DiscountTypeData} from '../../other-dropDowns/otherDropDowns'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {IModularQuotationModel} from '../../../models/modular-quotation-page/IModularQuotationModel'
import moment from 'moment'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {
  getAllProjectListAPI,
  getGetProjectDetailsList_ByProjectIDAPI,
} from '../../../modules/project-master-page/project-master/ProjectCRUD'

type Props = {}

interface IDIY {
  loading: boolean
  dIYLoading: boolean
  diyQuotationData: IDIYQuotationModel[]
  tmpDIYQuotationData: IDIYQuotationModel[]
  employeeData: IEmployeeSearchDDModel[]
  customerData: ICustomerDropModel[]
  modularQuotationData: IModularQuotationModel[]
  tmpModularQuotationData: IModularQuotationModel[]
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
  quotationID: number
  isBeforeDiscount: any
  modularQuotationID: number
  projName: string
  projectNumber: string
  selIsModMerge: boolean
  isExtraDiscount: boolean
}

const DIYQuotationListPage: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState<any>(null)
  const {modularQuotationID} = useParams<{modularQuotationID: string}>()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState<any>(null)
  const [state, setState] = useState<IDIY>({
    loading: false,
    dIYLoading: false,
    diyQuotationData: [] as IDIYQuotationModel[],
    tmpDIYQuotationData: [] as IDIYQuotationModel[],
    employeeData: [] as IEmployeeSearchDDModel[],
    customerData: [] as ICustomerDropModel[],
    modularQuotationData: [] as IModularQuotationModel[],
    tmpModularQuotationData: [] as IModularQuotationModel[],
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
    quotationID: 0,
    isBeforeDiscount: false,
    modularQuotationID: 0,
    projName: '',
    projectNumber: '',
    selIsModMerge: false,
    isExtraDiscount: false,
  })

  useEffect(() => {
    setMainLoading(true)
    localStorage.setItem('totalCounts', '0')
    setTimeout(() => {
      var lc: any = location.state
      console.log(lc)
      var mainEmployeeID: number = 0
      var mainCustomerID: number = 0
      var mainSearch: string = ''

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
    selEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string,
    employeeData: IEmployeeSearchDDModel[]
  ) {
    getCustomerDropSearchDownList()
      .then((response) => {
        const responseData = response.data
        getAllDIYQuotationData(
          selEmployeeID,
          mainCustomerID,
          mainSearch,
          employeeData,
          responseData
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  // function getAllDIYQuotationData(
  //   selEmployeeID: number,
  //   selCustomerID: number,
  //   searchText: string,
  //   employeeData: IEmployeeSearchDDModel[],
  //   customerData: ICustomerDropModel[]
  // ) {
  //   GetDiyQuotationListApi(selEmployeeID, selCustomerID, searchText)
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         const responseData = response.data.responseObject
  //         const interest = employeeData
  //         const previously_selected_interests = interest.map((data, index) => ({
  //           _id: index,
  //           value: data.value,
  //           label: data.label,
  //           mobileNumber: data.mobileNumber,
  //         }))
  //         const Rows = previously_selected_interests
  //         for (let key in Rows) {
  //           if (Rows[key].value == selEmployeeID) {
  //             setSelectedOptionEmployee(Rows[key]._id)
  //           }
  //         }
  //         const interest2 = customerData
  //         const previously_selected_interests2 = interest2.map((data, index) => ({
  //           _id: index,
  //           value: data.value,
  //           label: data.label,
  //         }))
  //         const Rows2 = previously_selected_interests2
  //         for (let key in Rows2) {
  //           if (Rows2[key].value == selCustomerID) {
  //             setSelectedOptionCustomer(Rows2[key]._id)
  //           }
  //         }
  //         setState({
  //           ...state,
  //           selEmployeeID: selEmployeeID,
  //           selCustomerID: selCustomerID,
  //           searchText: searchText,
  //           employeeData: employeeData,
  //           customerData: customerData,
  //           diyQuotationData: responseData,
  //           tmpDIYQuotationData: responseData,
  //           loading: false,
  //         })
  //         setName(searchText)
  //         setTotal(responseData.length)
  //         setPage(1)
  //         setMainLoading(false)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, diyQuotationData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, diyQuotationData: [], loading: false})
  //     })
  // }

  function getAllDIYQuotationData(
    selEmployeeID: number,
    selCustomerID: number,
    searchText: string,
    employeeData: IEmployeeSearchDDModel[],
    customerData: ICustomerDropModel[],
    currentPage: number = page
  ) {
    GetDiyQuotationListApi_Pagination(
      selEmployeeID,
      selCustomerID,
      searchText,
      currentPage,
      postPerPage
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          setTotal(response.data.totalRecords || 0)
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
            diyQuotationData: responseData,
            tmpDIYQuotationData: responseData,
            loading: false,
          })
          setName(searchText)
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, diyQuotationData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, diyQuotationData: [], loading: false})
      })
  }

  // Pagination Change
  const onPageChange = useCallback(
    (value: number) => {
      setMainLoading(true)
      setPage(value)
      getAllDIYQuotationData(
        0,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData,
        value
      )
    },
    [state]
  )

  const onShowSizeChange = useCallback(
    (current: number, size: number) => {
      setMainLoading(true)
      setPostPerPage(size)
      setPage(1) // Reset to first page when page size changes
      getAllDIYQuotationData(
        0,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData,
        1
      )
    },
    [state]
  )

  // ================Employee Selection dropdown ================
  function employeeChange(e: any) {
    //  console.log(e)
    if (e === null) {
      setSelectedOptionEmployee(null)
      return getAllDIYQuotationData(
        0,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionEmployee(e)
    getAllDIYQuotationData(
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
      return getAllDIYQuotationData(
        state.selEmployeeID,
        0,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionCustomer(e)
    getAllDIYQuotationData(
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
      getAllDIYQuotationData(
        state.selEmployeeID,
        state.selCustomerID,
        keyword,
        state.employeeData,
        state.customerData
      )
    } else {
      getAllDIYQuotationData(
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

  const testRef = useRef()
  const handleShowDiscount = (
    tmpQuotationID: number,
    tmpSelProjectNo: string,
    temDiscountTypeID: number
  ) => {
    // testRef.current.getInputDOMNode().focus()
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

    diyQuotaionDiscountApi(
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
            diyQuotationData: responseData,
            tmpDIYQuotationData: responseData,
            loading: false,
          })
          setName(state.searchText)
          setTotal(responseData.length)

          setPage(1)
          setShowDiscount(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            selEmployeeID: state.selEmployeeID,
            selCustomerID: state.selCustomerID,
            searchText: state.searchText,
            diyQuotationData: responseData,
            tmpDIYQuotationData: responseData,
            loading: false,
          })
          setName(state.searchText)
          setTotal(responseData.length)

          setPage(1)
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

  const handleShowBooked = (
    tmpQuotationID: number,
    address1: string,
    projectNumber: string,
    temIsModMerge: boolean
  ) => {
    setState({
      ...state,
      selDIYQuotationID: tmpQuotationID,
      projName: address1,
      projectNumber: projectNumber,
      selIsModMerge: temIsModMerge,
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

  function BookedQuotation(temQueID: number, temIsModuMerge: Boolean) {
    if (temIsModuMerge == true) {
      if (state.projName == '') {
        return toast.error('Please Enter Project Name')
      }
      BookedDIYWithModualarQuotationApi(temQueID, user.employeeID, state.projName, bookingDate)
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Booked Successfully')
            getAllDIYQuotationData(
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
    } else {
      if (state.projName == '') {
        return toast.error('Please Enter Project Name')
      }
      BookedDiyQuotationApi(temQueID, user.employeeID, state.projName, bookingDate)
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Booked Successfully')
            getAllDIYQuotationData(
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
  }
  // ---------------------------Diy PDF Download -----------------------------------------------------
  const [showDIY, setShowDIY] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState('option1')

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    'sqNo',
    'photo',
    'productName',
    'description',
    'unit',
    'length',
    'height',
    'amount',
    'beforeDiscount',
    'afterDiscount',
  ])

  function handleCheckboxChange(id: string) {
    setSelectedCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function handleRadioChange(value: string) {
    setSelectedRadio(value)

    if (value === 'option1') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
      ])
    } else if (value === 'option2') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
      ])
    } else if (value === 'option3') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
        'amount',
        'beforeDiscount',
        'afterDiscount',
      ])
    } else if (value === 'option4') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
        'amount',
      ])
    } else if (value === 'option5') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
        'amount',
      ])
    }
  }

  const isCheckboxDisabled = (checkboxId: string) => {
    return (
      (selectedRadio === 'option3' || selectedRadio === 'option4' || selectedRadio === 'option5') &&
      ['amount', 'beforeDiscount', 'afterDiscount'].includes(checkboxId)
    )
  }
  function handleShowDIY(projectNumber: string, isExtraDiscount: boolean, quotationID: number) {
    setState({
      ...state,
      selProjectNo: projectNumber,
      isExtraDiscount,
      quotationID,
    })
    setShowDIY(true)
  }

  function hancleCloseDIY() {
    setShowDIY(false)
    setSelectedCheckboxes([
      'sqNo',
      'photo',
      'productName',
      'description',
      'unit',
      'length',
      'height',
    ])
    setSelectedRadio('option1')
  }

  const essentialCheckboxes = [
    'sqNo',
    'photo',
    'productName',
    'description',
    'unit',
    'length',
    'height',
  ]

  const radioOptions = [
    {label: 'Regular', value: 'option1', defaultChecked: true},
    {label: 'With Breakup ', value: 'option5', defaultChecked: false},
    {label: 'Area Wise', value: 'option2', defaultChecked: false},
    {label: 'Area Wise With Breakup ', value: 'option4', defaultChecked: false},
    ...(state.isExtraDiscount
      ? [{label: 'Discount Wise', value: 'option3', defaultChecked: false}]
      : []),
  ]
  const checkboxOptions = [
    {label: 'Sq No.', id: 'sqNo'},
    {label: 'Photo', id: 'photo'},
    {label: 'Product Name', id: 'productName'},
    {label: 'Description', id: 'description'},
    {label: 'Unit', id: 'unit'},
    {label: 'Length', id: 'length'},
    {label: 'Height', id: 'height'},

    {label: 'Amount', id: 'amount'},
    {label: 'Before Discount', id: 'beforeDiscount'},
    {label: 'After Discount', id: 'afterDiscount'},
  ]
  const checkboxOptions2 = checkboxOptions.filter((item) => item.id !== 'Amount')
  const displayedCheckboxes =
    selectedRadio === 'option3'
      ? checkboxOptions2
      : checkboxOptions.slice(0, selectedRadio === 'option4' || selectedRadio === 'option5' ? 8 : 7)

  // ----------------------------------------------------------------------------------------
  const [selDwID, setselDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const [selAdmDwID, setselAdmDwID] = useState<number>(0)
  const [admindwnldLoader, setAdmindwnldLoader] = useState<boolean>(false)
  const [selAbrDwID, setselAbrDwID] = useState<number>(0)
  const [abrDwnldLoader, setAbrdwnldLoader] = useState<boolean>(false)
  const [selTeamDwID, setselTeamDwID] = useState<number>(0)
  const [teamDwnldLoader, setTeamdwnldLoader] = useState<boolean>(false)
  // function getQuotationPdf(pathname: string, quotationID: number, isModularMerge: boolean) {
  //   var URL = ''
  //   if (pathname == `/quotations/diy-quotation/pdf/${quotationID}`) {
  //     if (isModularMerge) {
  //       URL = `${process.env.REACT_APP_API_URL}/DIYModular/DownloadDIYWithModularQuotationPDF`
  //     } else {
  //       URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDF`
  //     }
  //     setDownloadLoader(true)
  //     setselDwID(quotationID)

  function getQuotationPdf(pathname: string, quotationID: number, isModularMerge: boolean) {
    console.log('pdf dwnld', quotationID)
    var URL = ''
    let payload = null
    if (selectedRadio === 'option1' || selectedRadio === 'option2') {
      const selectedEssentialCheckboxes = selectedCheckboxes.filter((id) =>
        essentialCheckboxes.includes(id)
      )

      if (selectedEssentialCheckboxes.length === 0) {
        alert(
          'Please select at least one checkbox to proceed with the download. This is required to continue.'
        )
        return
      }
    }

    if (pathname == `/quotations/diy-quotation/pdf/${quotationID}`) {
      payload = {
        quotationID,
        skipID: 0,
        isDownload: 1,
        isSrNo: selectedCheckboxes.includes('sqNo'),
        isPhoto: selectedCheckboxes.includes('photo'),
        isProductName: selectedCheckboxes.includes('productName'),
        isDescription: selectedCheckboxes.includes('description'),
        isUnit: selectedCheckboxes.includes('unit'),
        isLength: selectedCheckboxes.includes('length'),
        isHeight: selectedCheckboxes.includes('height'),
        isAmount: selectedCheckboxes.includes('amount'),

        isDiscount: selectedCheckboxes.includes('beforeDiscount'),
        isAfterDisc: selectedCheckboxes.includes('afterDiscount'),
      }
      if (pathname == `/quotations/diy-quotation/pdf/${quotationID}`) {
        if (isModularMerge) {
          URL = `${process.env.REACT_APP_API_URL}/DIYModular/DownloadDIYWithModularQuotationPDF`
        }

        if (selectedRadio === 'option1') {
          URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFWithClm`
        } else if (selectedRadio === 'option2') {
          URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFAreaWiseWithClm`
        } else if (selectedRadio === 'option3') {
          URL = `${process.env.REACT_APP_API_URL}/pdf/DownloadDIYQuotationPDFAreaWiseDiscclm`
        } else if (selectedRadio === 'option4') {
          URL = `${process.env.REACT_APP_API_URL}/pdf/DownloadDIYQuotationPDFAreaWiseBreackupclm`
        } else if (selectedRadio === 'option5') {
          URL = `${process.env.REACT_APP_API_URL}/pdf/DownloadDIYQuotationPDFwithBreackupclm`
        } else {
          URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDF`
        }
      }
      setDownloadLoader(true)
      setselDwID(quotationID)
      console.log('payload Cheking', payload)
    } else if (pathname == `/quotations/diy-quotation/agency-breakup-pdf/${quotationID}`) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFForAdminWithAgency`
      setAbrdwnldLoader(true)
      setselAbrDwID(quotationID)
    } else if (pathname == `/quotations/diy-quotation/admin-pdf/${quotationID}`) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFForAdmin`
      setAdmindwnldLoader(true)
      setselAdmDwID(quotationID)
    } else if (pathname == `/quotations/diy-quotation/team-pdf/${quotationID}`) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDF_For_Designer`
      setTeamdwnldLoader(true)
      setselTeamDwID(quotationID)
    } else {
      alert('Error')
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      // .post(URL, {quotationID: quotationID, isDownload: 1, selectedRadio, selectedCheckboxes})
      // .post(URL, payload)
      .post(URL, payload || {quotationID: quotationID, isDownload: 1}) // Send payload only if defined
      .then((response) => {
        console.log('URL Cheking', URL)
        console.log('API Response:', response.data)
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
        if (pathname == `/quotations/diy-quotation/pdf/${quotationID}`) {
          setSelectedRadio('option1') // Different API for option3
          setSelectedCheckboxes([
            'sqNo',
            'photo',
            'productName',
            'description',
            'unit',
            'length',
            'height',
          ])
          setDownloadLoader(false)
          setselDwID(0)
        } else if (pathname == `/quotations/diy-quotation/admin-pdf/${quotationID}`) {
          setAdmindwnldLoader(false)
          setselAdmDwID(0)
        } else if (pathname == `/quotations/diy-quotation/agency-breakup-pdf/${quotationID}`) {
          setAbrdwnldLoader(false)
          setselAbrDwID(0)
        } else if (pathname == `/quotations/diy-quotation/team-pdf/${quotationID}`) {
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
      .catch((err) => {
        //  console.log(err)
        setDownloadLoader(false)
        setselDwID(0)
        setAdmindwnldLoader(false)
        setselAdmDwID(0)
        setAbrdwnldLoader(false)
        setselAbrDwID(0)
        setTeamdwnldLoader(false)
        setselTeamDwID(0)
        setSelectedRadio('option1') // Different API for option3
          setSelectedCheckboxes([
            'sqNo',
            'photo',
            'productName',
            'description',
            'unit',
            'length',
            'height',
          ])
      })
    setShowDIY(false)
  }

  // -----------------Is Active model----------------------
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
    DIYQuotationIsactive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getAllDIYQuotationData(
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
  //  // ================== Offer PopUp Start Offer Block =====================
  const [showUpModular, setShowUpModular] = useState(false)
  function handleCloseModular() {
    setShowUpModular(false)
  }
  // ========================== For select Modular API ==========================
  function MergeDIYWithModularData(tmpquotationID: number, tmpmodularQuotationID: number) {
    setMainLoading(true)
    MergeDIYWithModularApi(tmpquotationID, tmpmodularQuotationID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success(`Selected Successfull`)
          getAllDIYQuotationData(
            state.selEmployeeID,
            state.selCustomerID,
            state.searchText,
            state.employeeData,
            state.customerData
          )
          setMainLoading(false)
          handleCloseModular()
        } else {
          toast.error(`${response.data.message}`)
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setMainLoading(false)
      })
  }
  // ========================== For List Modular ====================

  function getModularQuotationListByCustomerIDData(tmpCustomerID: number, qutationID: number) {
    state.modularQuotationData = []
    GetModularQuotationListByCustomerID(tmpCustomerID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            modularQuotationData: responseData,
            tmpModularQuotationData: responseData,
            selDIYQuotationID: qutationID,
            loading: false,
          })
          setTotalm(responseData.length)
          setPagem(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, modularQuotationData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, modularQuotationData: [], loading: false})
      })
    setShowUpModular(true)
  }

  // ================Pagination Modular PopUp ================
  const onShowSizeChangeModular = (current: any, pageSize: any) => {
    setPostPerPagem(pageSize)
  }
  const [totalm, setTotalm] = useState(state.modularQuotationData.length) //  length
  const [pagem, setPagem] = useState(1)
  const [postPerPagem, setPostPerPagem] = useState(10)
  const indexOfLastPagem = pagem * postPerPagem
  const indexOfFirstPagem = indexOfLastPagem - postPerPagem
  const currentPostsm: IModularQuotationModel[] = state.modularQuotationData.slice(
    indexOfFirstPagem,
    indexOfLastPagem
  )
  // ================Pagination ================
  // const onShowSizeChange = (current: any, pageSize: any) => {
  //   setPostPerPage(pageSize)
  // }
  const [total, setTotal] = useState(state.diyQuotationData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  // const indexOfFirstPage = indexOfLastPage - postPerPage
  // const currentPosts: IDIYQuotationModel[] = state.diyQuotationData.slice(
  //   indexOfFirstPage,
  //   indexOfLastPage
  // )

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
            <span className='text-primary text-hover-primary'>DIY</span>
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
            <Link
              to={{
                pathname: '/quotations/diy-quotation/add',
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
                  <th className='min-w-25px text-center'>View Cart</th>
                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>
                    Cost BreakUp
                  </th>
                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>
                    Agency BreakUp
                  </th>

                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>
                    Agency Work Order
                  </th>
                  <th className='w-25px'>Is Default Discount</th>
                  <th className='w-25px'>Merge Modular</th>
                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>
                    Team Download
                  </th>
                  {/* <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>Book</th> */}
                  <th className='min-w-25px text-center'>Book</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {mainLoading ? (
                  <LoaderInTable loading={mainLoading} column={15} />
                ) : (
                  <>
                    {state.diyQuotationData.length > 0 &&
                      state.diyQuotationData.map((data, index) => {
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
                          className='cursor-pointer text-dark text-hover-primary mb-1 fs-6'
                          onClick={() => handleShow(data.projectID)}
                        >
                          {data.projectNumber}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.customerName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.quotationDate}
                        </td> */}
                            <td className='text-dark text-hover-primary mb-1 fs-6'>
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
                                      // to={{pathname:`/quotations/diy-quotation/pdf/${data.quotationID}`,state:{isDownload:1}}}
                                      onClick={
                                        () =>
                                          handleShowDIY(
                                            data.projectNumber,
                                            data.isExtraDiscount,
                                            data.quotationID
                                          )
                                        //   `/quotations/diy-quotation/pdf/${data.quotationID}`,
                                        //   data.quotationID,
                                        //   data.isModularMerge
                                        // )
                                        // getQuotationPdf(
                                        //   `/quotations/diy-quotation/pdf/${data.quotationID}`,
                                        //   data.quotationID,
                                        //   data.isModularMerge
                                        // )
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
                                <span className='text-center me-1 text-muted'>N.A.</span>
                              )}
                            </td>

                            <td className='text-center'>
                              {data.isBooked === true ? (
                                <span className='text-center me-1 text-dark text-hover-primary'>
                                  N.A
                                </span>
                              ) : (
                                <Link
                                  to={{
                                    pathname: `/quotations/diy-quotation/view-cart/${data.quotationID}`,
                                    state: {
                                      quotationID: data.quotationID,
                                      customerName: data.customerName,
                                      bhkName: data.bhkName,
                                      carpetAreaName: data.carpetArea,
                                      projectName: data.projectName,
                                      projectNumber: data.projectNumber,
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
                                  {admindwnldLoader && selAdmDwID == data.quotationID ? (
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
                                      // to={{
                                      //   pathname: `/quotations/diy-quotation/admin-pdf/${data.quotationID}`,
                                      //   state: {isDownload: 1},
                                      // }}
                                      onClick={() =>
                                        getQuotationPdf(
                                          `/quotations/diy-quotation/admin-pdf/${data.quotationID}`,
                                          data.quotationID,
                                          data.isModularMerge
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
                                <span className='text-center me-1 text-muted'>N.A.</span>
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
                                      // to={{
                                      //   pathname: `/quotations/diy-quotation/agency-breakup-pdf/${data.quotationID}`,
                                      //   state: {isDownload: 1},
                                      // }}
                                      onClick={() =>
                                        getQuotationPdf(
                                          `/quotations/diy-quotation/agency-breakup-pdf/${data.quotationID}`,
                                          data.quotationID,
                                          data.isModularMerge
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
                                <span className='text-center me-1 text-muted'>N.A.</span>
                              )}
                            </td>

                            <td className={user.roleID === 2 ? 'text-center' : 'd-none'}>
                              {data.isCheckOut === true ? (
                                <Link
                                  to={{
                                    pathname: `/quotations/diy-quotation/agency-work-order/${data.quotationID}`,
                                    state: {
                                      projectNumber: data.projectNumber,
                                      customerName: data.customerName,
                                      quotationID: data.quotationID,
                                      mainEmployeeID: state.selEmployeeID,
                                      mainCustomerID: state.selCustomerID,
                                      mainSearch: state.searchText,
                                    },
                                  }}
                                  className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                                  title='Agency Work Order'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/ecommerce/ecm009.svg'
                                    className='svg-icon-3 svg-icon-primary'
                                  />
                                </Link>
                              ) : (
                                <span className='text-center me-1 text-muted'>N.A.</span>
                              )}
                            </td>
                            <td className=''>
                              <div className='form-check form-switch ms-2'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  id={`${data.quotationID}`}
                                  checked={data.isBeforeDiscount}
                                  onChange={(e) => handleShowActive(e)}
                                />
                              </div>
                            </td>

                            <td>
                              <span>
                                <div
                                  onClick={() =>
                                    getModularQuotationListByCustomerIDData(
                                      data.customerID,
                                      data.quotationID
                                    )
                                  }
                                  className='btn btn-icon btn-bg-light bg-hover-info text-hover-inverse-info btn-sm me-1'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/social/soc005.svg'
                                    className='svg-icon-2 svg-icon-info'
                                  />
                                </div>
                              </span>
                            </td>

                            <td className='text-center'>
                              {!data.isBooked && data.isCheckOut ? (
                                <span className='text-center me-1 text-muted'>N.A.</span>
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
                                          `/quotations/diy-quotation/team-pdf/${data.quotationID}`,
                                          data.quotationID,
                                          data.isModularMerge
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

                            {/* <td className={user.roleID === 2 ? 'text-center' : 'd-none'}> */}
                            <td className='text-center'>
                              {!data.isBooked && data.isCheckOut ? (
                                <span
                                  className={`badge badge-light-success cursor-pointer fw-bold me-1`}
                                  onClick={() =>
                                    handleShowBooked(
                                      data.quotationID,
                                      data.address1,
                                      data.projectNumber,
                                      data.isModularMerge
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
                            {/* <td className={user.roleID === 2 ? 'text-center' : 'd-none'}>
                          {!data.isBooked && data.isCheckOut ? (
                            <span className='text-center me-1 text-dark text-hover-primary'>
                              N.A
                            </span>
                          ) : (
                            <span
                              className={`badge badge-light-success cursor-pointer fw-bold me-1`}
                              onClick={() => handleShowBooked(data.quotationID)}
                            >
                              Book
                            </span>
                          )}
                        </td> */}
                          </tr>
                        )
                      })}
                  </>
                )}
                <BlankDataImageInTable
                  length={state.diyQuotationData.length}
                  loading={mainLoading}
                  colSpan={10}
                />
              </tbody>
            </table>
          </div>
          <div className='text-center'>
            <Pagination
              onChange={onPageChange}
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
                <LoaderInTable loading={mainLoading} column={15} />
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
      {/* ========================================Modular POpUP================================= */}
      <Modal
        size='xl'
        show={showUpModular}
        onHide={handleCloseModular}
        backdrop='true'
        keyboard={false}
      >
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Modular Quotation List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`card `}>
            {/* begin::Body */}
            <div className='py-3'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table table-bordered align-middle g-2'>
                  {/* begin::Table head */}
                  <thead className='bg-secondary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-150px '>Select</th>
                      <th className='min-w-150px'>project Number</th>
                      <th className='min-w-150px'>customer Name</th>
                      <th className='min-w-150px'>quotation Date</th>
                      <th className='min-w-150px'> employee Name</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className='border-bottom'>
                    <LoaderInTable loading={state.loading} column={15} />
                    {currentPostsm.length > 0 &&
                      currentPostsm.map((data, index) => {
                        return (
                          <tr>
                            <td>
                              <span
                                className=' text-success text-hover-info  mb-1 fs-7 badge badge-secondary   fw-bolder cursor-pointer text-center btn btn-sm btn-light-primary bg-white border border-primary  py-2 px-5'
                                onClick={() =>
                                  MergeDIYWithModularData(state.selDIYQuotationID, data.quotationID)
                                }
                              >
                                Select
                              </span>
                            </td>
                            <td className='text-dark fs-4'>{data.projectNumber}</td>
                            <td className='text-dark fs-6'>{data.customerName}</td>
                            <td className='text-dark fs-6'>{data.quotationDate}</td>
                            <td className='text-dark fs-6'>{data.employeeName}</td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
              <div className='text-center'>
                <Pagination
                  onChange={(value: any) => setPagem(value)}
                  pageSize={postPerPagem}
                  total={totalm}
                  current={pagem}
                  showSizeChanger
                  showQuickJumper
                  onShowSizeChange={onShowSizeChangeModular}
                  // itemRender={itemRender}
                  showTotal={(total) => `Total ${total} items`}
                ></Pagination>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => handleCloseModular()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ========================================Download POpUP================================= */}
      <Modal show={showDIY} onHide={hancleCloseDIY} size='lg' backdrop='true' keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>DIY PDF Download</Modal.Title>
          <Modal.Title className='text-white'>Project No: {state.selProjectNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-between'>
            {/* Left Side: Radio Buttons */}
            <Card style={{width: '48%'}} className='shadow-sm border-0'>
              <Card.Body>
                <h5 className='mb-3'>Select Option</h5>

                {radioOptions.map((option, index) => (
                  <Form.Check
                    type='radio'
                    key={index}
                    label={option.label}
                    name='radioGroup'
                    value={option.value}
                    defaultChecked={option.defaultChecked}
                    className='mb-6 text-hover-primary min-w-150px'
                    onChange={() => handleRadioChange(option.value)}
                  />
                ))}
              </Card.Body>
            </Card>

            {/* Right Side: Checkboxes */}
            <Card style={{width: '48%'}} className='shadow-sm border-0'>
              <Col xs={6} md={4}>
                {displayedCheckboxes.map((option, index) => (
                  <div
                    className='form-check form-check-custom form-check-solid mt-5 ms-3'
                    key={index}
                  >
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id={option.id}
                      // disabled={selectedRadio == 'option3'}
                      // disabled={selectedCheckboxes == ''}

                      checked={selectedCheckboxes.includes(option.id)} // Check if the checkbox is selected
                      onChange={() => handleCheckboxChange(option.id)} // Update selection state
                      disabled={isCheckboxDisabled(option.id)}
                    />
                    <label className='form-check-label min-w-150px' htmlFor={option.id}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </Col>
            </Card>
          </div>

          {/* Pagination */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() =>
              getQuotationPdf(
                `/quotations/diy-quotation/pdf/${state.quotationID}`,
                state.quotationID, // Ensure this is not 0
                state.selIsModMerge
              )
            }
          >
            Download
          </Button>

          <Button variant='secondary' onClick={hancleCloseDIY}>
            Close
          </Button>
        </Modal.Footer>
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
                placeholder='Project Name'
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
          <Button
            variant='danger'
            onClick={() => BookedQuotation(state.selDIYQuotationID, state.selIsModMerge)}
          >
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
        pageName={'DIY Quotation'}
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

export default DIYQuotationListPage
