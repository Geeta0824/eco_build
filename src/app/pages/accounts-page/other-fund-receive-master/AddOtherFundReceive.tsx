import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import Search from 'antd/es/transfer/search'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IOtherFundReceiveModel,
  IFranchiseModel,
  otheerFundReceiveInitValues as initialValues,
} from '../../../models/Accounts-page/other-fund-receive/IOtherFundReceiveModel'
import {ICustomerPageModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {
  AddOtherFundReciveAPI,
  GetFranchiseListByFilterAPI,
} from '../../../modules/account-page/other-fund-receive-master-page/OtherFundReciveCRUD'
import moment from 'moment'
import {venderTypeData} from '../../other-dropDowns/otherDropDowns'
import {getVenderListByVendorTypeID} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {IVenderModel} from '../../../models/master-page/IVenderModel'

const profileDetailsSchema = Yup.object().shape({
  cashAccountID: Yup.number()
    .required('Cash Account Type is required')
    .min(1, 'Cash Account Type is required'),
  transactionModeID: Yup.number()
    .required('Transaction Mode is Required')
    .min(1, 'Transaction Mode is Required'),
  payFromTypeID: Yup.number()
    .required('Payment From is Required')
    .min(1, 'Payment From is Required'),
})

interface IOtherFundRecv {
  loading: boolean
  cashAccountData: ICashAccountModel[]
  customerData: ICustomerPageModel[]
  vendorData: IVenderModel[]
  temVendorData: IVenderModel[]
  franchiseData: IFranchiseModel[]
  selCashAccountTypeID: number
  selCustomerId: number
  selVendorID: number
  selpaymentID: number
  selTypeID: number
  selEmployeeBankID: number
  selEmpId: number
  selTotalAmount: number
  selVendorTypeID: number
  selPayFromTypeID: number
  selFranchiseID: number
  SearchText: string
  mainSearch: string
}

const AddOtherFundReceive: React.FC = () => {
  const [data, setData] = useState<IOtherFundReceiveModel>(initialValues)
  const [isTcs, setIsTcs] = useState(false)
  const [amount, setAmount] = useState<string>('0')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IOtherFundReceiveModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IOtherFundRecv>({
    loading: false,
    cashAccountData: [] as ICashAccountModel[],
    customerData: [] as ICustomerPageModel[],
    vendorData: [] as IVenderModel[],
    temVendorData: [] as IVenderModel[],
    franchiseData: [] as IFranchiseModel[],
    selCustomerId: 0,
    selCashAccountTypeID: 0,
    selVendorID: 0,
    selpaymentID: 0,
    selTypeID: 0,
    selEmployeeBankID: 0,
    selEmpId: 0,
    selTotalAmount: 0,
    selVendorTypeID: 0,
    selPayFromTypeID: 0,
    selFranchiseID: 0,
    SearchText: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      getCashAccountData(mainSearch)
    }, 100)
  }, [])

  function getCashAccountData(mainSearch: string) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            cashAccountData: responseData,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: [], loading: false})
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
            temVendorData: responseData,
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

  // =======================Staet From Model PopUp ======================
  const [showFranchise, setShowFranchise] = useState(false)
  function handleCloseFranchise() {
    setShowFranchise(false)
  }

  function handleShowFranchise(SearchText: string) {
    GetFranchiseListByFilterAPI(SearchText)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            franchiseData: responseData,
            SearchText: SearchText,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, franchiseData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, franchiseData: [], loading: false})
        toast.error(`${error}`)
      })
    setShowFranchise(true)
  }

  function selectFranchise(tmpFranchiseData: IFranchiseModel) {
    formik.setFieldValue('vendorID', 0)
    formik.setFieldValue('companyName', '')
    formik.setFieldValue('contactPerson', '')
    formik.setFieldValue('contactNumber', '')

    formik.setFieldValue('employeeID', tmpFranchiseData.employeeID)
    formik.setFieldValue('firstName', tmpFranchiseData.firstName)
    formik.setFieldValue('lastName', tmpFranchiseData.lastName)
    formik.setFieldValue('branchName', tmpFranchiseData.branchName)
    formik.setFieldValue('email', tmpFranchiseData.email)
    formik.setFieldValue('contactNumber', tmpFranchiseData.contactNumber)
    formik.setFieldValue(
      'franchiseName',
      tmpFranchiseData.firstName + ' ' + tmpFranchiseData.lastName
    )
    setState({...state, selFranchiseID: tmpFranchiseData.employeeID, selVendorID: 0})
    setShowFranchise(false)
  }

  // ======================= End From Model PopUp ======================

  // ======================= Start Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }
  function handleShowVendor() {
    if (state.selVendorTypeID > 0) {
      setShowVendor(true)
    } else {
      toast.error(`Please Select Vendor Type`)
    }
  }

  function selectVendor(tmpVendortData: IVenderModel) {
    formik.setFieldValue('employeeID', 0)
    formik.setFieldValue('firstName', '')
    formik.setFieldValue('lastName', '')
    formik.setFieldValue('branchName', '')
    formik.setFieldValue('email', '')
    formik.setFieldValue('contactNumber', '')
    formik.setFieldValue('franchiseName', '' + ' ' + '')

    formik.setFieldValue('vendorID', tmpVendortData.vendorID)
    formik.setFieldValue('companyName', tmpVendortData.companyName)
    formik.setFieldValue('contactPerson', tmpVendortData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendortData.contactNumber)
    setState({...state, selVendorID: tmpVendortData.vendorID, selFranchiseID: 0})
    setShowVendor(false)
  }
  // ======================= End Vendor Model PopUp ======================

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

  function handleAmtChange(event: any) {
    const tmpValue = event.target.value
    //const re = /^[0-9\b.]+$/
    const re = /^[0-9\b.\b-]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      setAmount(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tcsAmount', 0)
      formik.setFieldValue('tcsPercentage', 0)
      setAmount('')
      setIsTcs(false)
    } else if (tmpValue === '-') {
      formik.setFieldValue('tcsAmount', 0)
      formik.setFieldValue('tcsPercentage', 0)
      setAmount('-')
      setIsTcs(false)
    } else {
      // formik.setFieldValue('tcsAmount', 0)
      // formik.setFieldValue('tcsPercentage', 0)
      // setAmount('0')
      // setIsTcs(false)
    }
  }

  // -----------------upload File ----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/OtherFund/OtherFundReceiveFilePath', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
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
    } else if (elementId === 'payFromTypeID') {
      formik.setFieldValue('payFromTypeID', parseInt(value))
      setState({...state, selPayFromTypeID: parseInt(value), selVendorTypeID: 0})
      formik.setFieldValue('employeeID', 0)
      formik.setFieldValue('firstName', '')
      formik.setFieldValue('lastName', '')
      formik.setFieldValue('branchName', '')
      formik.setFieldValue('email', '')
      formik.setFieldValue('contactNumber', '')
      formik.setFieldValue('franchiseName', '')
      formik.setFieldValue('vendorID', 0)
      formik.setFieldValue('companyName', '')
      formik.setFieldValue('contactPerson', '')
      formik.setFieldValue('contactNumber', '')
    }
  }

  // ==================== Filter Franchise +++++++++++++++++++
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value
    handleShowFranchise(keyword)
    setName(keyword)
  }

  // ================= SerchText Function ===========
  const [vendor, setVendor] = useState('')

  //------------------- the search result-----------------
  const filterVendor = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temVendorData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, vendorData: results})
    } else {
      setState({...state, vendorData: state.temVendorData})
    }

    setVendor(keyword)
  }

  // ==================== API Call +++++++++++++++++++
  const formik = useFormik<IOtherFundReceiveModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let temCheckNo: string = ''
        let temBankName: string = ''
        let temBranchName: string = ''
        let temCheckDate: string = ''
        let temDescription: string = ''
        let temCheckAmnt: number = 0
        let temEmpCashBankID: number = 0

        if (values.paymentDate > moment(new Date()).format('YYYY-MM-DD')) {
          toast.error(`Date should be less than or Equal to today's date`)
          return setLoading(false)
        }

        if (state.selpaymentID === 2) {
          // if (values.chequeAmount === 0) {
          //   toast.error(`Check Amount is required.`)
          //   return setLoading(false)
          // } else {
          temCheckAmnt = values.chequeAmount
          // }
          // if (values.chequeBankName === '') {
          //   toast.error(`Bank Name is required.`)
          //   return setLoading(false)
          // } else {
          temBankName = values.chequeBankName
          // }
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
          // }
          if (values.chequeNumber === '') {
            toast.error(`Check Number is required.`)
            return setLoading(false)
          } else {
            temCheckNo = values.chequeNumber
          }
        }

        if (state.selPayFromTypeID === 3) {
          if (values.description === '') {
            toast.error(`Descriptio  is required`)
            return setLoading(false)
          } else {
            temDescription = values.description
          }
        }

        AddOtherFundReciveAPI(
          state.selVendorID,
          state.selFranchiseID,
          values.paymentDate,
          parseInt(amount),
          values.payFromTypeID,
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
          temDescription,
          quotationFilePath,
          user.employeeID,
          '192.168.0.1',
          isTcs,
          values.tcsPercentage,
          values.tcsAmount
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: `/accounts/other-fund-receive/list`,
                state: {search: state.mainSearch},
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='text-end'>
        <Link
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          to={{pathname: '/accounts/other-fund-receive/list', state: {search: state.mainSearch}}}
        >
          Back To List
        </Link>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'> Payment From:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='payFromTypeID'
                  >
                    <option selected={state.selPayFromTypeID === 0 ? true : false} value={0}>
                      Select Payment From Type
                    </option>
                    <option selected={state.selPayFromTypeID === 1 ? true : false} value={1}>
                      Vendor
                    </option>
                    <option selected={state.selPayFromTypeID === 2 ? true : false} value={2}>
                      Franchise
                    </option>
                    <option selected={state.selPayFromTypeID === 3 ? true : false} value={3}>
                      Staff
                    </option>
                  </select>
                  {formik.touched.payFromTypeID && formik.errors.payFromTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.payFromTypeID}</div>
                    </div>
                  )}
                </div>
                <label
                  className={
                    state.selPayFromTypeID === 1 ? 'col-lg-3 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  <span className='required ms-7'> Select Vendor Type:</span>
                </label>
                <div className={state.selPayFromTypeID === 1 ? 'col-lg-3 fv-row' : 'd-none'}>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='vendorTypeID'
                  >
                    <option selected value={0}>
                      Select Vendor Type
                    </option>
                    {venderTypeData.length > 0 &&
                      venderTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.vendorTypeID}
                            selected={state.selVendorTypeID == data.vendorTypeID ? true : false}
                          >
                            {data.vendorTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.vendorTypeID && formik.errors.vendorTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.vendorTypeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selPayFromTypeID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select From:
                </label>
                <div className={state.selFranchiseID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Select From'
                    disabled
                    {...formik.getFieldProps('franchiseName')}
                  />
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={() => handleShowFranchise(state.SearchText)}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
                <label
                  className={
                    state.selFranchiseID === 0
                      ? 'd-none'
                      : 'col-lg-2 col-form-label required fw-bold fs-6'
                  }
                >
                  Branch Name:
                </label>
                <div className={state.selFranchiseID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='From Name'
                    disabled
                    {...formik.getFieldProps('branchName')}
                  />
                </div>
              </div>

              <div className={state.selPayFromTypeID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Contact Number:
                </label>
                <div className={state.selFranchiseID === 0 ? 'd-none' : 'col-lg-4 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Contact Number'
                    disabled
                    {...formik.getFieldProps('contactNumber')}
                  />
                </div>
                <label
                  className={
                    state.selFranchiseID === 0
                      ? 'd-none'
                      : 'col-lg-2 col-form-label required fw-bold fs-6'
                  }
                >
                  Email:
                </label>
                <div className={state.selFranchiseID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Email'
                    disabled
                    {...formik.getFieldProps('email')}
                  />
                </div>
              </div>
              <div className={state.selPayFromTypeID === 1 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Vendor:
                </label>
                <div className={state.selVendorID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Select Vendor'
                    disabled
                    {...formik.getFieldProps('companyName')}
                  />
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShowVendor}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
              </div>
              <div className={state.selPayFromTypeID === 1 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Contact Person:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Contact Person'
                    disabled
                    {...formik.getFieldProps('contactPerson')}
                  />
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Contact Number:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Contact Number'
                    disabled
                    {...formik.getFieldProps('contactNumber')}
                  />
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
                  <span className=''>IS TCS :</span>
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
                  TCS:
                </label>
                <div className={isTcs === true ? 'col-lg-2 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Tcs Percentage'
                    {...formik.getFieldProps('tcsPercentage')}
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
                  TCS Amount:
                </label>
                <div className={isTcs === true ? 'col-lg-3 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Tcs Amount'
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
                  <span className=''>Bank Name:</span>
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
                  <span className=''>Branch Name:</span>
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
                  <span className=''>Cheque Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Cheque Amount'
                    {...formik.getFieldProps('chequeAmount')}
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
                  <span className=''>Cheque Date:</span>
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
                  <span className={state.selPayFromTypeID === 3 ? 'required' : ''}>
                    Description:
                  </span>
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
                  pathname: '/accounts/other-fund-receive/list',
                  state: {search: state.mainSearch},
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
      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
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
                  onChange={filterVendor}
                  value={vendor}
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
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary'
                          }
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseVendor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===================From Model =================================== */}
      <Modal size='xl' scrollable={true} show={showFranchise} onHide={handleCloseFranchise}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Franchise Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <div className='mb-3'>
                <label className='form-label fw-bold text-white'>Search :</label>
                <Search placeholder='input search text' onChange={filter} value={name} />
              </div>
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
                      <span className='d-block mb-1 ps-1'>First Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Last Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Branch Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Contact Number</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Email</span>
                    </th>
                    {/*  <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th> */}
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.franchiseData.length > 0 &&
                    state.franchiseData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            // data.isActive === false
                            //   ? 'd-none'
                            //   :
                            'bg-hover-light-primary text-hover-primary'
                          }
                          onClick={() => selectFranchise(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.firstName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.lastName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.branchName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.email}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFranchise}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default AddOtherFundReceive
