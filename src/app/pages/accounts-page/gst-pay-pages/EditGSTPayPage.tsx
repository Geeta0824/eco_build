import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {MonthDropdownData, YearsDropdownData} from '../../other-dropDowns/otherDropDowns'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IPayFundModel,
  payFundInitValues as initialValues,
} from '../../../models/Accounts-page/pay-fund-page/IPayFundModel'
import {Pagination} from 'antd'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import moment from 'moment'
import {
  getGSTBreakupListApi,
  getGSTPayByGSTPayID,
  updateGstDetails,
} from '../../../modules/account-page/gst-pay-master-page/GSTPayCRUD'
import {IGSTBreakupModel} from '../../../models/Accounts-page/gst-pay-page/IGSTPayModel'

const profileDetailsSchema = Yup.object().shape({
  cashAccountID: Yup.number().required('Field is required').min(1, 'Field is required'),
  transactionModeID: Yup.number().required('Field is required').min(1, 'Field is required'),
  vendorInvoiceNo: Yup.string().required('Reference Field is required'),
})

interface IDepartment {
  loading: boolean
  selCashAccountTypeID: number
  selCustomerId: number
  selProjectID: number
  cashAccountData: ICashAccountModel[]
  vendorData: IVenderModel[]
  gstReceiveableBreakupData: IGSTBreakupModel[]
  gstPayableBreakupData: IGSTBreakupModel[]
  selVendorTypeID: number
  selpaymentID: number
  selEmployeeBankID: number
  selTypeID: number
  selEmpId: number
  selYearID: number
  selMonthID: number
  gstYear: number
  gstMonth: number
  selMonthName: string
  mainSearch: string
}

const EditGSTPayPage: React.FC = () => {
  const [data, setData] = useState<IPayFundModel>(initialValues)
  const [amount, setAmount] = useState<string>('')
  const {gstPaymentID} = useParams<{gstPaymentID: string}>()
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDepartment>({
    loading: false,
    selCustomerId: 0,
    selCashAccountTypeID: 0,
    selProjectID: 0,
    cashAccountData: [] as ICashAccountModel[],
    vendorData: [] as IVenderModel[],
    gstReceiveableBreakupData: [] as IGSTBreakupModel[],
    gstPayableBreakupData: [] as IGSTBreakupModel[],
    selVendorTypeID: 0,
    selpaymentID: 0,
    selEmployeeBankID: 0,
    selTypeID: 0,
    selEmpId: 0,
    selMonthID: moment().month() + 1,
    selYearID: moment().year(),
    gstYear: moment().year(),
    gstMonth: moment().month() + 1,
    selMonthName: '',
    mainSearch: '',
  })

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
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
          getGSTDataByGSTPaymentID(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: []})
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: []})
        setLoading(false)
      })
  }
  function getGSTDataByGSTPaymentID(cashAccountData: ICashAccountModel[], mainSearch: string) {
    getGSTPayByGSTPayID(parseInt(gstPaymentID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          let temCasAccID = response.data.cashAccountID
          let temCasAccBankID = response.data.cashAccountBankID
          let temTrnsModeID = response.data.transactionModeID
          let temMonthID = response.data.gstMonth
          let temYearID = response.data.gstYear
          formik.setFieldValue('transactionModeID', response.data.transactionModeID)
          formik.setFieldValue('transactionMode', response.data.transactionMode)
          formik.setFieldValue('transactionID', response.data.transactionID)
          formik.setFieldValue('description', response.data.description)
          formik.setFieldValue('cashAccountBankID', response.data.cashAccountBankID)
          formik.setFieldValue('cashAccountID', response.data.cashAccountID)
          formik.setFieldValue('cashAccountName', response.data.cashAccountName)
          formik.setFieldValue('vendorInvoiceNo', response.data.referenceNo)
          formik.setFieldValue('voucherNo', response.data.voucherNo)
          formik.setFieldValue('chequeBankName', response.data.chequeBankName)
          formik.setFieldValue('chequeNumber', response.data.chequeNumber)
          formik.setFieldValue('chequeBankBranch', response.data.chequeBankBranch)
          formik.setFieldValue('chequeDate', response.data.chequeDate)
          formik.setFieldValue('chequeAmount', response.data.chequeAmount)
          formik.setFieldValue('paymentDate', response.data.gstPayDate)
          formik.setFieldValue('MonthID', response.data.gstMonth)
          formik.setFieldValue('YearID', response.data.gstYear)
          setAmount(response.data.gstAmount)
          setQuotationFilePath(response.data.documentPath)
          getGSTBreakupData(
            cashAccountData,
            mainSearch,
            temCasAccID,
            temCasAccBankID,
            temTrnsModeID,
            temMonthID,
            temYearID
          )
        } else {
          toast.error(`${response.data.message}`)
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setLoading(false)
      })
  }

  function getGSTBreakupData(
    cashAccountData: ICashAccountModel[],
    mainSearch: string,
    temCasAccID: number,
    temCasAccBankID: number,
    temTrnsModeID: number,
    temMonthID: number,
    temYearID: number
  ) {
    getGSTBreakupListApi(temYearID, temMonthID)
      .then((response) => {
        const respRecivalbeData = response.data.gstRecivalbeLst
        const respPaybleData = response.data.gstPaybleLst
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            cashAccountData: cashAccountData,
            mainSearch,
            selYearID: temYearID,
            selMonthID: temMonthID,
            selCashAccountTypeID: temCasAccID,
            selEmployeeBankID: temCasAccBankID,
            selpaymentID: temTrnsModeID,
            gstReceiveableBreakupData: respRecivalbeData,
            gstPayableBreakupData: respPaybleData,
          })
          setLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, gstReceiveableBreakupData: [], gstPayableBreakupData: []})
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, gstReceiveableBreakupData: [], gstPayableBreakupData: []})
        setLoading(false)
      })
  }

  function GetGSTBreakup(gstYear: number, gstMonth: number) {
    getGSTBreakupListApi(gstYear, gstMonth)
      .then((response) => {
        const respRecivalbeData = response.data.gstRecivalbeLst
        const respPaybleData = response.data.gstPaybleLst
        if (response.data.isSuccess === true) {
          setAmount(response.data.totalGST)
          setState({
            ...state,
            selYearID: gstYear,
            selMonthID: gstMonth,
            gstReceiveableBreakupData: respRecivalbeData,
            gstPayableBreakupData: respPaybleData,
          })
          setLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, gstReceiveableBreakupData: [], gstPayableBreakupData: []})
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, gstReceiveableBreakupData: [], gstPayableBreakupData: []})
        setLoading(false)
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

  // -----------------upload File ----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/GST/UploadGSTFilePath', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
  }

  // -----------------TDS Receive And PAyable Breakup -------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  const [showPayable, setShowPayable] = useState(false)
  function handleClosePayable() {
    setShowPayable(false)
  }
  function handleShowPayable() {
    setShowPayable(true)
  }

  function handleAmount(e: any) {
    let tmpAmount = e.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpAmount)) && re.test(tmpAmount)) {
      setAmount(tmpAmount)
    } else if (tmpAmount == '') {
      setAmount('')
    }
  }

  // ---------------------------
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
    } else if (elementId === 'YearID') {
      formik.setFieldValue('YearID', parseInt(value))
      GetGSTBreakup(parseInt(value), state.selMonthID)
    } else if (elementId === 'MonthID') {
      formik.setFieldValue('MonthID', parseInt(value))
      GetGSTBreakup(state.selYearID, parseInt(value))
    }
  }

  const formik = useFormik<IPayFundModel>({
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
        let temTrasID: string = ''
        let tmpAmt: number = 0

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

        if (state.selpaymentID === 1) {
          if (values.transactionID === '') {
            toast.error(`Transaction ID is required.`)
            return setLoading(false)
          } else {
            temTrasID = values.transactionID
          }
        }

        if (parseInt(amount) <= 0) {
          toast.error(`Amount Must be Grater Than 0 `)
          return setLoading(false)
        } else {
          tmpAmt = parseInt(amount)
        }

        updateGstDetails(
          parseInt(gstPaymentID),
          values.paymentDate,
          tmpAmt,
          values.cashAccountID,
          values.transactionModeID,
          values.transactionID,
          temBankName,
          temBranchName,
          temCheckDate,
          temCheckAmnt,
          temCheckNo,
          values.cashAccountBankID,
          values.description,
          quotationFilePath,
          values.vendorInvoiceNo,
          state.selYearID,
          state.selMonthID,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname: '/accounts/gst/list', state: {Search: state.mainSearch}})
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
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Select Year :</label>
                <div className='mb-2 col-lg-3 col-sm-6 ps-0'>
                  <select
                    className='form-select form-select-white lineHeightByD'
                    onChange={selectChange}
                    id='YearID'
                    disabled
                  >
                    <option selected={state.selYearID === 0 ? true : false} value={0}>
                      Select Year
                    </option>
                    {YearsDropdownData.length > 0 &&
                      YearsDropdownData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data}
                            selected={data === state.selYearID ? true : false}
                          >
                            {data}
                          </option>
                        )
                      })}
                  </select>
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Select Month :</label>
                <div className='mb-2 col-xl-3 col-sm-6 ps-0'>
                  <select
                    className='form-select form-select-white lineHeightByD'
                    onChange={selectChange}
                    id='MonthID'
                    disabled
                  >
                    <option selected={state.selMonthID === 0 ? true : false} value={0}>
                      Select Month
                    </option>
                    {MonthDropdownData.length > 0 &&
                      MonthDropdownData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.MonthID}
                            selected={data.MonthID === state.selMonthID ? true : false}
                          >
                            {data.MonthName}
                          </option>
                        )
                      })}
                  </select>
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Amount'
                    value={amount}
                    // {...formik.getFieldProps('amount')}
                    onChange={handleAmount}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.amount}</div>
                    </div>
                  )}
                </div>
                <div className='col-lg-3 pt-3'>
                  <div
                    onClick={() => handleShowPayable()}
                    className='col-form-label text-white text-hover-info d-block fs-7 badge badge-primary cursor-pointer text-center'
                  >
                    View GST Payable Breakup
                  </div>
                </div>
                <div className='col-lg-3 pt-3'>
                  <div
                    onClick={() => handleShow()}
                    className='col-form-label text-white text-hover-info d-block fs-7 badge badge-success cursor-pointer text-center'
                  >
                    View GST Receivable Breakup
                  </div>
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
                    <option selected={state.selpaymentID === 0 ? true : false} value={0}>
                      Select Payment Mode
                    </option>
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
                  <span className='required'>Transaction ID:</span>
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
              <div
                className={
                  state.selCashAccountTypeID === 2 &&
                  (state.selpaymentID === 1 || state.selpaymentID === 2)
                    ? 'row mb-6'
                    : 'd-none'
                }
              >
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  Select Employee Bank:
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
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Payment Date:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Vendor Invoice No'
                    {...formik.getFieldProps('paymentDate')}
                  />
                  {formik.touched.paymentDate && formik.errors.paymentDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.paymentDate}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className={'row mb-6'}> */}
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Reference No:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Reference No'
                    {...formik.getFieldProps('vendorInvoiceNo')}
                  />
                  {formik.touched.vendorInvoiceNo && formik.errors.vendorInvoiceNo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.vendorInvoiceNo}</div>
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
                    quotationFilePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'
                  }
                >
                  <div className='symbol symbol-45px me-5 cursor-pointer'>
                    {/* <img src={process.env.REACT_APP_API_URL + quotationFilePath} alt='img' /> */}
                    <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                  </div>
                </div>
                <div
                  className={
                    quotationFilePath === '' ? 'col-lg-9 fv-row mt-3' : 'col-lg-7 fv-row mt-3'
                  }
                >
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
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Save'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/accounts/gst/list', state: {Search: state.mainSearch}}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* =========================================TDS Break up POPUP=====================================*/}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>GST Receivable Breakup Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'></div>
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
                      <span className='d-block mb-1 ps-2'>Date</span>
                    </th>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Month</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Year</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>GST Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>GST(%)</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Voucher Type</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.gstReceiveableBreakupData.length > 0 &&
                    state.gstReceiveableBreakupData.map((data, index) => {
                      return (
                        <tr>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.invoiceDate}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.gstMonth}
                            </span>
                          </td>

                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.gstYear}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.totalGST}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.totalPer + '%'}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.voucherTypeName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={state.gstReceiveableBreakupData.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =========================================TDS Break up POPUP=====================================*/}
      <Modal size='xl' scrollable={true} show={showPayable} onHide={handleClosePayable}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>GST Payable Breakup Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'></div>
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
                      <span className='d-block mb-1 ps-2'>Date</span>
                    </th>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Month</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Year</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>GST Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>GST(%)</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Voucher Type</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.gstPayableBreakupData.length > 0 &&
                    state.gstPayableBreakupData.map((data, index) => {
                      return (
                        <tr>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.invoiceDate}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.gstMonth}
                            </span>
                          </td>

                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.gstYear}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.totalGST}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.totalPer + '%'}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.voucherTypeName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  <BlankDataImageInTable
                    length={state.gstPayableBreakupData.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClosePayable}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default EditGSTPayPage
