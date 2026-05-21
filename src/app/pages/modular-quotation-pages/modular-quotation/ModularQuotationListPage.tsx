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
import Select from 'react-select'
import {IEmployeeSearchDDModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {ICustomerDropModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerDropSearchDownList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import Search from 'antd/es/input/Search'
import {Button, Card, Col, Form, Modal} from 'react-bootstrap-v5'
import axios from 'axios'
import {DiscountTypeData, modularTypeData} from '../../other-dropDowns/otherDropDowns'
import {IModularQuotationModel} from '../../../models/modular-quotation-page/IModularQuotationModel'
import {
  Booked_ModularQuotationApi,
  GenerateModularReqForExtraDiscountApi,
  GetModularQuotationListAPI,
  ModularQuotationIsactive,
} from '../../../modules/modular-quotation-master-page/diy-quotation-master-page/ModularQuotationCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
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
  modularQuotationData: IModularQuotationModel[]
  tmpModularQuotationData: IModularQuotationModel[]
  employeeData: IEmployeeSearchDDModel[]
  customerData: ICustomerDropModel[]
  projectData: IProjectModel[]
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
  isExtraDiscount: boolean
}

const ModularQuotationListPage: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState<any>(null)
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState<any>(null)
  const [state, setState] = useState<IDIY>({
    loading: false,
    modularQuotationData: [] as IModularQuotationModel[],
    tmpModularQuotationData: [] as IModularQuotationModel[],
    employeeData: [] as IEmployeeSearchDDModel[],
    customerData: [] as ICustomerDropModel[],
    projectData: [] as IProjectModel[],
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
    isExtraDiscount: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
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
        if (user.roleID !== 2) {
          tmpEmpId = user.employeeID
        }
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
        getAllmodularQuotationData(
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

  function getAllmodularQuotationData(
    tmpModularTypeID: number,
    selEmployeeID: number,
    selCustomerID: number,
    searchText: string,
    employeeData: IEmployeeSearchDDModel[],
    customerData: ICustomerDropModel[]
  ) {
    GetModularQuotationListAPI(tmpModularTypeID, selEmployeeID, selCustomerID, searchText)
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
            modularQuotationData: responseData,
            tmpModularQuotationData: responseData,
            loading: false,
          })
          // setName(searchText)
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, modularQuotationData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, modularQuotationData: [], loading: false})
      })
  }

  // ================Employee Selection dropdown ================
  function employeeChange(e: any) {
    console.log(e)
    if (e === null) {
      setSelectedOptionEmployee(null)
      return getAllmodularQuotationData(
        state.selModularTypeID,
        0,
        state.selCustomerID,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionEmployee(e)
    getAllmodularQuotationData(
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
      return getAllmodularQuotationData(
        state.selModularTypeID,
        state.selEmployeeID,
        0,
        state.searchText,
        state.employeeData,
        state.customerData
      )
    }
    setSelectedOptionCustomer(e)
    getAllmodularQuotationData(
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
      getAllmodularQuotationData(
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
      getAllmodularQuotationData(
        state.selModularTypeID,
        state.selEmployeeID,
        state.selCustomerID,
        keyword,
        state.employeeData,
        state.customerData
      )
    } else {
      getAllmodularQuotationData(
        state.selModularTypeID,
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

    GenerateModularReqForExtraDiscountApi(
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
            modularQuotationData: responseData,
            tmpModularQuotationData: responseData,
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
            modularQuotationData: responseData,
            tmpModularQuotationData: responseData,
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
    Booked_ModularQuotationApi(temQueID, user.employeeID, state.projName, bookingDate)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Booked Successfully')
          getAllmodularQuotationData(
            state.selModularTypeID,
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
  // ---------------------------Modular PDF Download  pop  up-----------------------------------------------------
  const [showModular, setShowModular] = useState(false)
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
  function handleShowModular(projectNumber: string, isExtraDiscount: boolean, quotationID: number) {
    setState({
      ...state,
      selProjectNo: projectNumber,
      isExtraDiscount,
      quotationID,
    })
    setShowModular(true)
  }

  function hancleCloseDIY() {
    setShowModular(false)
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

  // =======================================================
  const [selDwID, setselDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const [selAdmDwID, setselAdmDwID] = useState<number>(0)
  const [admindwnldLoader, setAdmindwnldLoader] = useState<boolean>(false)
  const [selAbrDwID, setselAbrDwID] = useState<number>(0)
  const [abrDwnldLoader, setAbrdwnldLoader] = useState<boolean>(false)
  const [selTeamDwID, setselTeamDwID] = useState<number>(0)
  const [teamDwnldLoader, setTeamdwnldLoader] = useState<boolean>(false)
  function getQuotationPdf(pathname: string, quotationID: number) {
    // var URL = ''
    // if (pathname == `/modular/modular-quotation/pdf/${quotationID}`) {
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

    if (pathname == `/modular/modular-quotation/pdf/${quotationID}`) {
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
      if (pathname == `/modular/modular-quotation/pdf/${quotationID}`) {
        if (selectedRadio === 'option1') {
          URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFWithClm`
        } else if (selectedRadio === 'option2') {
          URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFWithClmAreaWise`
        } else if (selectedRadio === 'option3') {
          URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFAreaWiseDiscclm`
        } else if (selectedRadio === 'option4') {
          URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFAreaWiseBreackupclm`
        } else if (selectedRadio === 'option5') {
          URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFwithBreackupclm`
        }
      }
      setDownloadLoader(true)
      setselDwID(quotationID)
      // URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDF`
    } else if (pathname == `/modular/modular-quotation/agency-breakup-pdf/${quotationID}`) {
      setAbrdwnldLoader(true)
      setselAbrDwID(quotationID)
      URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFForAgencyBreackup`
    } else if (pathname == `/modular/modular-quotation/admin-pdf/${quotationID}`) {
      setAdmindwnldLoader(true)
      setselAdmDwID(quotationID)
      URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDFForAdmin`
    } else if (pathname == `/modular/modular-quotation/Team-pdf/${quotationID}`) {
      setTeamdwnldLoader(true)
      setselTeamDwID(quotationID)
      URL = `${process.env.REACT_APP_API_URL}/ModularPDF/DownloadModularQuotationPDF_Designer`
    } else {
      alert('Error')
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    // axios.post(URL, {quotationID: quotationID, isDownload: 1}).then((response) => {
    axios.post(URL, payload || {quotationID: quotationID, isDownload: 1}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData
      // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
      // var bin = atob(b64)
      // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
      // Embed the PDF into the HTML page and show it to the user
      const linkSource = `data:application/pdf;base64,${b64}`
      const aPdfDownload = document.createElement('a')
      const fileName = 'MODULAR_Quotation_' + quotationID + '_' + Tdate + '.pdf'
      aPdfDownload.setAttribute('download', fileName)
      aPdfDownload.href = linkSource
      aPdfDownload.download = fileName
      document.body.append(aPdfDownload)
      aPdfDownload.click()
      aPdfDownload.remove()
      if (pathname == `/modular/modular-quotation/pdf/${quotationID}`) {
        setSelectedRadio('option1')
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
      } else if (pathname == `/modular/modular-quotation/admin-pdf/${quotationID}`) {
        setAdmindwnldLoader(false)
        setselAdmDwID(0)
      } else if (pathname == `/modular/modular-quotation/agency-breakup-pdf/${quotationID}`) {
        setAbrdwnldLoader(false)
        setselAbrDwID(0)
      } else if (pathname == `/modular/modular-quotation/Team-pdf/${quotationID}`) {
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
        setSelectedRadio('option1')
        setSelectedCheckboxes([
          'sqNo',
          'photo',
          'productName',
          'description',
          'unit',
          'length',
          'height',
        ])
      }
    })
    setShowModular(false)
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
    ModularQuotationIsactive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getAllmodularQuotationData(
            state.selModularTypeID,
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
  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.modularQuotationData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IModularQuotationModel[] = state.modularQuotationData.slice(
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
              Modulars
            </Link>
          </>
        </h1>
        {/* end::Title */}
        <ul className='breadcrumb breadcrumb-separatorless fw-bold fs-6 my-1'>
          <li className='breadcrumb-item'>
            <span className='h-20px border-dark border-start mx-4'></span>
            <span className='text-primary text-hover-primary'>
              {state.selModularTypeID == 3
                ? 'KWS'
                : state.selModularTypeID == 8
                ? 'Kitchen'
                : state.selModularTypeID == 9
                ? 'Wardrobe'
                : state.selModularTypeID == 10
                ? 'Storage'
                : ''}
            </span>
          </li>
        </ul>
      </div>

      <div className={`card `}>
        {/* begin::Header */}
        <div
          className='card-header border-0 py-2 row gx-5'
          style={{
            backgroundColor: '#000000',
            position: 'sticky',
            top: 120,
            // zIndex: 1000,
          }}
        >
          <div className='mb-2 col-xl-2 col-sm-6'>
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
          <div className='mb-2 col-xl-2 col-sm-6'>
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
            className='card-toolbar col-xl-2'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: '/modular/modular-quotation/add',
                state: {
                  modularTypeID: state.selModularTypeID,
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
                  <th className='min-w-25px text-center'>Is Default Discount</th>
                  {/* <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>Book</th> */}
                  <th className={user.roleID === 2 ? 'min-w-25px text-center' : 'd-none'}>
                    Team Download
                  </th>
                  <th className={'min-w-25px text-center'}>Book</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
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
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              <span
                                //title='Click Hear'
                                className='cursor-pointer text-dark text-hover-primary fs-5'
                                // onClick={() => handleShow(data.projectID)}
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
                                  // to={{pathname:`/modular/modular-quotation/pdf/${data.quotationID}`,state:{isDownload:1}}}
                                  // onClick={() =>
                                  //   getQuotationPdf(
                                  //     `/modular/modular-quotation/pdf/${data.quotationID}`,
                                  //     data.quotationID
                                  //   )
                                  onClick={() =>
                                    handleShowModular(
                                      data.projectNumber,
                                      data.isExtraDiscount,
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
                          {data.isBooked === true ? (
                            <span className='text-center me-1 text-dark text-hover-primary'>
                              N.A
                            </span>
                          ) : (
                            <Link
                              to={{
                                pathname: `/modular/modular-quotation/view-cart/${data.quotationID}`,
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
                                  //   pathname: `/modular/modular-quotation/admin-pdf/${data.quotationID}`,
                                  //   state: {isDownload: 1},
                                  // }}
                                  onClick={() =>
                                    getQuotationPdf(
                                      `/modular/modular-quotation/admin-pdf/${data.quotationID}`,
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
                                  //   pathname: `/modular/modular-quotation/agency-breakup-pdf/${data.quotationID}`,
                                  //   state: {isDownload: 1},
                                  // }}
                                  onClick={() =>
                                    getQuotationPdf(
                                      `/modular/modular-quotation/agency-breakup-pdf/${data.quotationID}`,
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
                                      `/modular/modular-quotation/Team-pdf/${data.quotationID}`,
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
                        {/* <td className={user.roleID === 2 ? 'text-center' : 'd-none'}> */}
                        <td className={'text-center'}>
                          {!data.isBooked && data.isCheckOut ? (
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
      {/* ========================================Download POpUP================================= */}
      <Modal show={showModular} onHide={hancleCloseDIY} size='lg' backdrop='true' keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Modular PDF Download</Modal.Title>
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
                `/modular/modular-quotation/pdf/${state.quotationID}`,
                state.quotationID // Ensure this is not 0
                // state.selIsModMerge
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

export default ModularQuotationListPage
