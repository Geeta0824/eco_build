import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, Link, useLocation} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IFundReceiveModel,
  IPaymentFromModel,
  FundReceiveInitValues as initialValues,
} from '../../../models/Accounts-page/fund-receive/IFundReceiveModel'
import {Pagination} from 'antd'
import {ICustomerPageModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getAllProjectListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {
  AddProjectFundReciveAPI,
  getProjectInvoiceListByProjectIDForPayFund,
} from '../../../modules/account-page/fund-receive-master-page/FundReciveCRUD'
import moment from 'moment'
import {IInvoiceModel} from '../../../models/projects-page/IInvoiceModel'
import {getVenderListByVendorTypeID} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  cashAccountID: Yup.number()
    .required('Cash Account Type is required')
    .min(1, 'Cash Account Type is required'),
  transactionModeID: Yup.number()
    .required('Transaction Mode is Required')
    .min(1, 'Transaction Mode is Required'),
})

interface IDepartment {
  selCashAccountTypeID: number
  selCustomerId: number
  selProjectID: number
  cashAccountData: ICashAccountModel[]
  loading: boolean
  projectData: IProjectModel[]
  temProjectData: IProjectModel[]
  customerData: ICustomerPageModel[]
  invoiceData: IInvoiceModel[]
  temInvoiceData: IInvoiceModel[]
  vendorData: IVenderModel[]
  fromData: IPaymentFromModel[]
  selVendorID: number
  selpaymentID: number
  selTypeID: number
  selEmployeeBankID: number
  selEmpId: number
  selProjectInvoiceID: number
  selTotalAmount: number
  selVendorTypeID: number
  selFromID: number
  mainSearch: string
  mainProjectID: number
  mainStartTime: string
  mainEndTime: string
}

const AddFundReceive: React.FC = () => {
  const [data, setData] = useState<IFundReceiveModel>(initialValues)
  const [isTcs, setIsTcs] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [chequeAmount, setChequeAmount] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IFundReceiveModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IDepartment>({
    loading: false,
    selCustomerId: 0,
    selCashAccountTypeID: 0,
    selProjectID: 0,
    cashAccountData: [] as ICashAccountModel[],
    projectData: [] as IProjectModel[],
    temProjectData: [] as IProjectModel[],
    customerData: [] as ICustomerPageModel[],
    invoiceData: [] as IInvoiceModel[],
    temInvoiceData: [] as IInvoiceModel[],
    vendorData: [] as IVenderModel[],
    fromData: [] as IPaymentFromModel[],
    selVendorID: 0,
    selpaymentID: 0,
    selTypeID: 0,
    selEmployeeBankID: 0,
    selEmpId: 0,
    selProjectInvoiceID: 0,
    selTotalAmount: 0,
    selVendorTypeID: 0,
    selFromID: 0,
    mainSearch: '',
    mainProjectID: 0,
    mainStartTime: '',
    mainEndTime: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainProjectID: any = lc.ProjectID
      let mainStartTime: any = lc.StartDate
      let mainEndTime: any = lc.EndTime
      let mainSearch: any = lc.SearchText

      getAllProjectData(mainProjectID, mainStartTime, mainEndTime, mainSearch)
    }, 100)
  }, [])

  function getAllProjectData(
    mainProjectID: number,
    mainStartTime: string,
    mainEndTime: string,
    mainSearch: string
  ) {
    getAllProjectListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getCashAccountData(responseData, mainProjectID, mainStartTime, mainEndTime, mainSearch)
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
  }

  function getCashAccountData(
    projectData: IProjectModel[],
    mainProjectID: number,
    mainStartTime: string,
    mainEndTime: string,
    mainSearch: string
  ) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            cashAccountData: responseData,
            projectData: projectData,
            temProjectData: projectData,
            mainProjectID,
            mainStartTime,
            mainEndTime,
            mainSearch,
            loading: false,
          })
          setTotal(projectData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: [], projectData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: [], projectData: [], loading: false})
      })
  }
  // ===============Invoice Api ========================
  function getAllProjectInvoiceListByProjectID(projecctID: number) {
    getProjectInvoiceListByProjectIDForPayFund(projecctID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            invoiceData: responseData,
            temInvoiceData: responseData,
            selProjectID: projecctID,
            loading: false,
          })
          setTotalInvoice(responseData.length)
          setPageInvoice(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, invoiceData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, invoiceData: [], loading: false})
      })
  }

  function getAllEmpBankDetailsDataByEmpID(empID: number) {
    getEmpBankDetailsByEmpID(empID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          setEmpBankData(responseData)
        } else {
          toast.error(`${response.data.message}`)
          setEmpBankData([])
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setEmpBankData([])
      })
  }

  // ============Vendor Api ======================
  function getVenderByVendorTypeIDData(temVendorTypeID: number) {
    state.selVendorTypeID = 0
    getVenderListByVendorTypeID(temVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorData: responseData,
            selVendorTypeID: temVendorTypeID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }
  // -----------------upload File ----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/Fund/FundReceiveFilePath', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
  }

  // ======================= From Model PopUp ======================
  const [showFrom, setShowFrom] = useState(false)
  function handleCloseFrom() {
    setShowFrom(false)
  }

  // --------For Model Data onClick Function-------
  function selectFrom(tmpFromData: IPaymentFromModel) {
    formik.setFieldValue('fromID', tmpFromData.fromID)
    formik.setFieldValue('fromCode', tmpFromData.fromCode)
    formik.setFieldValue('fromName', tmpFromData.fromName)
    setState({...state, selFromID: tmpFromData.fromID})
    setShowFrom(false)
  }
  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }

  // --------For Model Data onClick Function-------
  function selectVendor(tmpVendortData: IVenderModel) {
    formik.setFieldValue('vendorCost', '')
    formik.setFieldValue('paidAmount', '')
    formik.setFieldValue('remeningAmount', '')
    formik.setFieldValue('vendorID', tmpVendortData.vendorID)
    formik.setFieldValue('companyName', tmpVendortData.companyName)
    formik.setFieldValue('contactPerson', tmpVendortData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendortData.contactNumber)
    setState({...state, selVendorID: tmpVendortData.vendorID})
    setShowVendor(false)
  }

  // ======================= Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  // --------For Model Data onClick Function-------
  function selectProject(tmpProjectData: IProjectModel) {
    formik.setFieldValue('projectID', tmpProjectData.projectID)
    formik.setFieldValue('projectName', tmpProjectData.projectName)
    formik.setFieldValue('customerName', tmpProjectData.firstName + ' ' + tmpProjectData.lastName)
    formik.setFieldValue('projectCategoryName', tmpProjectData.projectCategoryName)
    formik.setFieldValue('projectAmount', tmpProjectData.projectAmount)
    formik.setFieldValue('paidAmount', tmpProjectData.paidAmount)
    formik.setFieldValue('remainigAmt', tmpProjectData.remainingAmount)
    formik.setFieldValue('projectStatusName', tmpProjectData.projectStatusName)
    getAllProjectInvoiceListByProjectID(tmpProjectData.projectID)
    setShow(false)
  }
  // ======================= Invoice Model PopUp ======================
  const [showInvoice, setShowInvoice] = useState(false)
  function handleCloseInvoice() {
    setShowInvoice(false)
  }

  function handleShowInvoice() {
    if (state.selProjectID == 0) {
      return toast.error(`Please Setect Project`)
    } else {
      setShowInvoice(true)
    }
  }

  // --------Invoice For Model Data onClick Function-------
  function selectInvoice(tmpInvoiceData: IInvoiceModel) {
    formik.setFieldValue('projectInvoiceID', tmpInvoiceData.projectInvoiceID)
    formik.setFieldValue('projectInvoiceAmount', tmpInvoiceData.projectAmount)
    formik.setFieldValue('totalAmount', tmpInvoiceData.totalAmount)
    formik.setFieldValue('gstAmount', tmpInvoiceData.gstAmount)
    formik.setFieldValue('invoicePaidAmount', tmpInvoiceData.paidAmount)
    formik.setFieldValue('remainingAmount', tmpInvoiceData.remainingAmount)
    formik.setFieldValue('voucherNumber', tmpInvoiceData.voucherNumber)
    formik.setFieldValue('invoiceDate', tmpInvoiceData.invoiceDate)
    setState({
      ...state,
      selProjectInvoiceID: tmpInvoiceData.projectInvoiceID,
      selTotalAmount: tmpInvoiceData.totalAmount,
    })
    setShowInvoice(false)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [totalInvoice, setTotalInvoice] = useState(state.invoiceData.length) //  length
  const [pageInvoice, setPageInvoice] = useState(1)
  const [postPerPageInvoice, setPostPerPageInvoice] = useState(10)

  const [total, setTotal] = useState(state.projectData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const indexOfLastPageInvoice = pageInvoice * postPerPageInvoice
  const indexOfFirstPageInvoice = indexOfLastPageInvoice - postPerPageInvoice
  const currentPostsInvoice: IInvoiceModel[] = state.invoiceData.slice(
    indexOfFirstPageInvoice,
    indexOfLastPageInvoice
  )
  const onShowSizeChangeInvoice = (current: any, pageSizeInvoice: any) => {
    setPostPerPageInvoice(pageSizeInvoice)
  }

  // ===================== For Project Filter =====================
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temProjectData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toString()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectData: state.temProjectData})
      setTotal(state.temProjectData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ===================== For Invoice Filter =====================
  const [nameInvoice, setNameInvoice] = useState('')

  const filterInvoice = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temInvoiceData.filter((user) => {
        return (
          user.voucherNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toLowerCase()) ||
          user.totalAmount.toString().includes(keyword.toString()) ||
          user.gstAmount.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.invoiceDate.toString().includes(keyword.toLowerCase()) ||
          user.remainingAmount.toString().includes(keyword.toLowerCase())
        )
      })
      setState({...state, invoiceData: results})
      setTotalInvoice(results.length)
      setPageInvoice(1)
    } else {
      setState({...state, invoiceData: state.temInvoiceData})
      setTotalInvoice(state.temInvoiceData.length)
      setPageInvoice(1)
    }
    setNameInvoice(keyword)
  }

  function checkedFunction(event: any) {
    const elementId = event.target.checked
    if (elementId === true) {
      if (parseInt(amount) > 0.0) {
        setIsTcs(event.target.checked)
      } else {
        toast.error('Please Enter Amount')
      }
    } else {
      formik.setFieldValue('tcsAmount', 0)
      formik.setFieldValue('tcsPercentage', 0)
      setIsTcs(event.target.checked)
    }
  }

  function handleChequeAmtChange(event: any) {
    const tmpCheValue = event.target.value
    const re = /^[0-9\b.\b-]+$/
    if (!isNaN(parseInt(tmpCheValue)) && re.test(tmpCheValue)) {
      setChequeAmount(tmpCheValue)
    } else if (tmpCheValue === '') {
      setChequeAmount('')
    }
  }

  function handleAmtChange(event: any) {
    const tmpValue = event.target.value
    const re = /^[0-9\b.\b-]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      setAmount(tmpValue)
      setChequeAmount(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tcsAmount', 0)
      formik.setFieldValue('tcsPercentage', 0)
      setAmount('')
      setChequeAmount('')
      setIsTcs(false)
    } else if (tmpValue === '-') {
      formik.setFieldValue('tcsAmount', 0)
      formik.setFieldValue('tcsPercentage', 0)
      setAmount('-')
      setChequeAmount('-')
      setIsTcs(false)
    } else {
      // formik.setFieldValue('tcsAmount', 0)
      // formik.setFieldValue('tcsPercentage', 0)
      // setAmount('')
      // setIsTcs(false)
    }
  }

  function handleTCSChange(event: any) {
    const tmpValue = event.target.value
    const tmpid = event.target.id
    let tmpTcsAmt: number = 0
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      formik.setFieldValue('tcsPercentage', tmpValue)
      tmpTcsAmt = (parseInt(amount) * parseInt(tmpValue)) / 100
      formik.setFieldValue('tcsAmount', tmpTcsAmt)
      setChequeAmount(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tcsPercentage', '')
      formik.setFieldValue('tcsAmount', 0)
    } else {
    }
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'cashAccountID') {
      const typeId = event.target.selectedOptions[0].id
      const empID = event.target.selectedOptions[0].lang
      formik.setFieldValue('cashAccountID', parseInt(value))
      setState({
        ...state,
        selCashAccountTypeID: parseInt(value),
        selTypeID: parseInt(typeId),
        selEmpId: parseInt(empID),
      })
      if (parseInt(value) === 0) {
        return
      } else {
        getAllEmpBankDetailsDataByEmpID(parseInt(empID))
      }
    } else if (elementId === 'transactionModeID') {
      formik.setFieldValue('transactionModeID', parseInt(value))
      setState({...state, selpaymentID: parseInt(value)})
    } else if (elementId === 'cashAccountBankID') {
      formik.setFieldValue('cashAccountBankID', parseInt(value))
      setState({...state, selEmployeeBankID: parseInt(value)})
    } else if (elementId === 'vendorTypeID') {
      formik.setFieldValue('vendorTypeID', parseInt(value))
      setState({...state, selVendorTypeID: parseInt(value)})
      getVenderByVendorTypeIDData(parseInt(value))
    } else if (elementId === 'fromID') {
      formik.setFieldValue('fromID', parseInt(value))
      setState({...state, selFromID: parseInt(value)})
    }
  }

  // ==================== API Call +++++++++++++++++++
  const formik = useFormik<IFundReceiveModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let temCheckNo: string = ''
        let temBankName: string = ''
        let temBranchName: string = ''
        let temCheckDate: string = ''
        let temCheckAmnt: number = 0
        if (values.paymentDate > moment(new Date()).format('YYYY-MM-DD')) {
          toast.error(`Date should be less than or Equal to today's date`)
          return setLoading(false)
        }
        if (parseInt(amount) === 0) {
          toast.error(`Please Enter Amount`)
          return setLoading(false)
        }
        if (state.selpaymentID === 2) {
          // if (values.chequeAmount === 0) {
          //   toast.error(`Check Amount is required.`)
          //   return setLoading(false)
          // }
          // else {
          temCheckAmnt = parseInt(chequeAmount)
          //}
          // if (values.chequeBankName === '') {
          //   toast.error(`Bank Name is required.`)
          //   return setLoading(false)
          // } else {
          temBankName = values.chequeBankName
          //  }
          // if (values.chequeBankBranch === '') {
          //   toast.error(`Branch Name is required.`)
          //   return setLoading(false)
          // } else {
          temBranchName = values.chequeBankBranch
          // }
          // if (values.chequeDate === '') {
          //   toast.error(`Check Date is required.`)
          //   return setLoading(false)
          // } else {
          temCheckDate = values.chequeDate
          //}
          if (values.chequeNumber === '') {
            toast.error(`Check Number is required.`)
            return setLoading(false)
          } else {
            temCheckNo = values.chequeNumber
          }
        }

        if (parseInt(amount) > values.totalAmount) {
          toast.error(`Please Enter Amount Less Then Equal Total Amount`)
          return setLoading(false)
        }

        AddProjectFundReciveAPI(
          state.selProjectID,
          state.selProjectInvoiceID,
          values.paymentDate,
          parseInt(amount),
          values.cashAccountID,
          values.transactionModeID,
          values.transactionID,
          temBankName,
          temBranchName,
          temCheckDate,
          temCheckAmnt,
          temCheckNo,
          values.cashAccountBankID,
          values.projectInvoiceNo,
          values.description,
          quotationFilePath,
          isTcs,
          values.tcsPercentage,
          values.tcsAmount,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/accounts/fundreceive/list',
                state: {
                  mainProjectID: state.mainProjectID,
                  mainStartTime: state.mainStartTime,
                  mainEndTime: state.mainEndTime,
                  mainSearch: state.mainSearch,
                },
              })
              setLoading(false)
            } else {
              toast.error(`${response.data.message}`)
              setLoading(false)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
            setLoading(false)
          })
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/accounts/fundreceive/list',
              state: {
                mainProjectID: state.mainProjectID,
                mainStartTime: state.mainStartTime,
                mainEndTime: state.mainEndTime,
                mainSearch: state.mainSearch,
              },
            }}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Project:
                </label>
                <div className={state.selProjectID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Project Name'
                    disabled
                    {...formik.getFieldProps('projectName')}
                  />
                  {formik.touched.projectName && formik.errors.projectName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectName}</div>
                    </div>
                  )}
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShow}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
              </div>
              <div className={state.selProjectID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Customer Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Customer Name '
                    disabled
                    {...formik.getFieldProps('customerName')}
                  />
                  {formik.touched.customerName && formik.errors.customerName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.customerName}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Category Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Paid Amount'
                    disabled
                    {...formik.getFieldProps('projectCategoryName')}
                  />
                  {formik.touched.projectCategoryName && formik.errors.projectCategoryName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectCategoryName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selProjectID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Project Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Project Amount'
                    disabled
                    {...formik.getFieldProps('projectAmount')}
                  />
                  {formik.touched.projectAmount && formik.errors.projectAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectAmount}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Paid Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Paid Amount'
                    disabled
                    {...formik.getFieldProps('paidAmount')}
                  />
                  {formik.touched.paidAmount && formik.errors.paidAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.paidAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selProjectID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Remaining Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Remaining Amount'
                    disabled
                    {...formik.getFieldProps('remainigAmt')}
                  />
                  {formik.touched.remainigAmt && formik.errors.remainigAmt && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.remainigAmt}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Project Status:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Project Status'
                    disabled
                    {...formik.getFieldProps('projectStatusName')}
                  />
                  {formik.touched.projectStatusName && formik.errors.projectStatusName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectStatusName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Invoice:
                </label>
                <div className={state.selProjectInvoiceID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Invoice Number'
                    disabled
                    {...formik.getFieldProps('voucherNumber')}
                  />
                  {formik.touched.voucherNumber && formik.errors.voucherNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.voucherNumber}</div>
                    </div>
                  )}
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShowInvoice}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
              </div>
              <div className={state.selProjectInvoiceID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Invoice Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Project Amount '
                    disabled
                    {...formik.getFieldProps('projectInvoiceAmount')}
                  />
                  {formik.touched.projectInvoiceAmount && formik.errors.projectInvoiceAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectInvoiceAmount}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>GST Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='GST Amount'
                    disabled
                    {...formik.getFieldProps('gstAmount')}
                  />
                  {formik.touched.gstAmount && formik.errors.gstAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.gstAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selProjectInvoiceID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Total Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Total Amount'
                    disabled
                    {...formik.getFieldProps('totalAmount')}
                  />
                  {formik.touched.totalAmount && formik.errors.totalAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.totalAmount}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Paid Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Paid Amount'
                    disabled
                    {...formik.getFieldProps('invoicePaidAmount')}
                  />
                  {formik.touched.invoicePaidAmount && formik.errors.invoicePaidAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.invoicePaidAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selProjectInvoiceID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Remaining Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Remaining Amount'
                    disabled
                    {...formik.getFieldProps('remainingAmount')}
                  />
                  {formik.touched.remainingAmount && formik.errors.remainingAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.remainingAmount}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Invoice Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Invoice Date'
                    disabled
                    {...formik.getFieldProps('invoiceDate')}
                  />
                  {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.invoiceDate}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Payment Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Payment Date'
                    {...formik.getFieldProps('paymentDate')}
                  />
                  {formik.touched.paymentDate && formik.errors.paymentDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.paymentDate}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required ms-7'>Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Amount'
                    value={amount}
                    // {...formik.getFieldProps('amount')}
                    onChange={handleAmtChange}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.amount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>IS TDS :</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='isTcs'
                      checked={isTcs}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
              </div>
              <div className={isTcs === true ? 'row mb-6' : 'd-none'}>
                <label
                  className={
                    isTcs === true ? 'col-lg-3 col-form-label required fw-bold fs-6' : 'd-none'
                  }
                >
                  TDS:
                </label>
                <div className={isTcs === true ? 'col-lg-2 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Tds Percentage'
                    // value={Tcs}
                    {...formik.getFieldProps('tcsPercentage')}
                    onChange={handleTCSChange}
                  />
                  {formik.touched.tcsPercentage && formik.errors.tcsPercentage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.tcsPercentage}</div>
                    </div>
                  )}
                </div>
                <span
                  className={
                    isTcs === true
                      ? 'col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'
                      : 'd-none'
                  }
                >
                  %
                </span>
                <label
                  className={
                    isTcs === true ? 'col-lg-3 col-form-label required fw-bold fs-6' : 'd-none'
                  }
                >
                  TDS Amount:
                </label>
                <div className={isTcs === true ? 'col-lg-3 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='TDS Amount'
                    // disabled
                    {...formik.getFieldProps('tcsAmount')}
                  />
                  {formik.touched.tcsAmount && formik.errors.tcsAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.tcsAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Cash Account:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cashAccountID'
                  >
                    <option selected={state.selCashAccountTypeID === 0 ? true : false} value={0}>
                      Select Account Type
                    </option>
                    {state.cashAccountData.length > 0 &&
                      state.cashAccountData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.cashAccountID}
                            id={`${data.cashAccountTypeID}`}
                            lang={`${data.employeeID}`}
                            selected={
                              data.cashAccountID === state.selCashAccountTypeID ? true : false
                            }
                          >
                            {data.accountName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.cashAccountID && formik.errors.cashAccountID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cashAccountID}</div>
                    </div>
                  )}
                </div>

                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Payment Mode:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='transactionModeID'
                  >
                    <option>Select Payment Mode</option>
                    {state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selpaymentID === 1 ? true : false} value={1}>
                        Online
                      </option>
                    )}
                    {state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selpaymentID === 2 ? true : false} value={2}>
                        Cheque
                      </option>
                    )}
                    {state.selTypeID === 1 || state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selpaymentID === 3 ? true : false} value={3}>
                        Cash
                      </option>
                    )}
                  </select>
                  {formik.touched.transactionModeID && formik.errors.transactionModeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.transactionModeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={
                  state.selTypeID === 2 && (state.selpaymentID === 1 || state.selpaymentID === 2)
                    ? 'row mb-6'
                    : 'd-none'
                }
              >
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  Select Employee Bank Name:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cashAccountBankID'
                  >
                    <option selected={state.selEmployeeBankID === 0 ? true : false} value={0}>
                      Select Employee Bank
                    </option>
                    {empBankData.length > 0 &&
                      empBankData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.employeeBankID}
                            selected={
                              data.employeeBankID === state.selEmployeeBankID ? true : false
                            }
                          >
                            {data.bankName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.cashAccountBankID && formik.errors.cashAccountBankID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cashAccountBankID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Cheque No:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Cheque No'
                    {...formik.getFieldProps('chequeNumber')}
                  />
                  {formik.touched.chequeNumber && formik.errors.chequeNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeNumber}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Bank Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Bank Name'
                    {...formik.getFieldProps('chequeBankName')}
                  />
                  {formik.touched.chequeBankName && formik.errors.chequeBankName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeBankName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Branch Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Branch Name'
                    {...formik.getFieldProps('chequeBankBranch')}
                  />
                  {formik.touched.chequeBankBranch && formik.errors.chequeBankBranch && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeBankBranch}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Cheque Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Cheque Amount'
                    value={chequeAmount}
                    onChange={handleChequeAmtChange}
                  />
                  {formik.touched.chequeAmount && formik.errors.chequeAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Cheque Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Cheque Date'
                    {...formik.getFieldProps('chequeDate')}
                  />
                  {formik.touched.chequeDate && formik.errors.chequeDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeDate}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 1 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Transaction ID:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Transaction ID'
                    {...formik.getFieldProps('transactionID')}
                  />
                  {formik.touched.transactionID && formik.errors.transactionID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.transactionID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Project Invoice No.:</label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Invoice No'
                    {...formik.getFieldProps('projectInvoiceNo')}
                  />
                  {formik.touched.projectInvoiceNo && formik.errors.projectInvoiceNo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectInvoiceNo}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Description:</span>
                </label>
                <div className='col-lg-9 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Description'
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Select File:</span>
                  <p className='text-muted fs-7'> (allow only .pdf files)</p>
                </label>
                <div
                  className={
                    quotationFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                  }
                >
                  <div className='symbol symbol-45px me-5 cursor-pointer'>
                    {/* <img src={process.env.REACT_APP_API_URL + quotationFilePath} alt='img' /> */}
                    <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                  </div>
                </div>
                <div className={quotationFilePath === '' ? 'col-lg-9 fv-row' : 'col-lg-7 fv-row'}>
                  <input
                    type='file'
                    accept='.pdf'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUploadQuotation(e)}
                  />
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <Link
                className='btn btn-danger me-2'
                to={{
                  pathname: '/accounts/fundreceive/list',
                  state: {
                    mainProjectID: state.mainProjectID,
                    mainStartTime: state.mainStartTime,
                    mainEndTime: state.mainEndTime,
                    mainSearch: state.mainSearch,
                  },
                }}
              >
                Cancel
              </Link>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Save'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* ----------------------------Project Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Project Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  onChange={filter}
                  value={name}
                />
              </form>
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Category Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Paid Amount</span>
                    </th>
                    <th className='min-w-155px'>
                      <span className='d-block mb-1'>Remaining Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Status</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={'bg-hover-light-primary text-hover-primary'}
                          onClick={() => selectProject(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.projectName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.firstName + ' ' + data.lastName}
                            </span>
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectCategoryName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.paidAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.remainingAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectStatusName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {/* =================== Loading get Api Data ============== */}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ----------------------------Invoice Select  Model---------------------- */}
      <Modal size='xl' scrollable={true} show={showInvoice} onHide={handleCloseInvoice}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Invoice Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  onChange={filterInvoice}
                  value={nameInvoice}
                />
              </form>
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Invoice Number</span>
                    </th>
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Invoice Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Total Amount</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>GST Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Paid Amount</span>
                    </th>
                    <th className='min-w-155px'>
                      <span className='d-block mb-1'>Remaining Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Invoice Date</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPostsInvoice.length > 0 &&
                    currentPostsInvoice.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isgst === false
                          //     ? 'd-none'
                          //     : 'bg-hover-light-primary text-hover-primary'
                          // }
                          onClick={() => selectInvoice(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.voucherNumber}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.projectAmount}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.totalAmount}
                            </span>
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.gstAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.paidAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.remainingAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.invoiceDate}
                            </span>
                          </td>
                          {/* <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectStatusName}
                            </span>
                          </td> */}
                        </tr>
                      )
                    })}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={currentPostsInvoice.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPageInvoice(value)}
                pageSize={postPerPageInvoice}
                total={totalInvoice}
                current={pageInvoice}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeInvoice}
                showTotal={(totalInvoice) => `Total ${totalInvoice} invoice`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseInvoice}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
            {/* <div className='border-0 pt-4' id='kt_chat_contacts_header'>
        <form className='w-100 position-relative' autoComplete='off'>
          <KTSVG
            path='/media/icons/duotune/general/gen021.svg'
            className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
          />
          <input
            type='text'
            className='form-control form-control-solid px-15 bg-white'
            // name='search'
            placeholder='Search'
            onChange={filter}
            value={name}
          />
        </form>
      </div> */}
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Vendor Type Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Company Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.vendorData.length > 0 &&
                    state.vendorData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={'bg-hover-light-primary text-hover-primary'}
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? (
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary fs-6'>
                                  {data.companyName}
                                </div>
                              </div>
                            ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )}
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            {/* <div className='text-center'>
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
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseVendor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===================From Model =================================== */}
      <Modal size='xl' scrollable={true} show={showFrom} onHide={handleCloseFrom}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>From Data</Modal.Title>
            {/* <div className='border-0 pt-4' id='kt_chat_contacts_header'>
        <form className='w-100 position-relative' autoComplete='off'>
          <KTSVG
            path='/media/icons/duotune/general/gen021.svg'
            className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
          />
          <input
            type='text'
            className='form-control form-control-solid px-15 bg-white'
            // name='search'
            placeholder='Search'
            onChange={filter}
            value={name}
          />
        </form>
      </div> */}
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>From Code</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>From Name</span>
                    </th>
                    {/* <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th> */}
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.fromData.length > 0 &&
                    state.fromData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            // data.isActive === false
                            //   ? 'd-none'
                            //   :
                            'bg-hover-light-primary text-hover-primary'
                          }
                          onClick={() => selectFrom(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.fromCode}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.fromName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            {/* <div className='text-center'>
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
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFrom}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default AddFundReceive
