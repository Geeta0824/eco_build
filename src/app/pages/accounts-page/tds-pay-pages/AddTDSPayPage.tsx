import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {MonthDropdownData, YearsDropdownData} from '../../other-dropDowns/otherDropDowns'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import moment from 'moment'
import {
  AddTDSPayApi,
  GetTDSBreakupData,
} from '../../../modules/account-page/tds-pay-master-page/TDSPayCRUD'
import {
  ITDSBreakupModel,
  ITDSPayModel,
  TDSPayInitValues as initialValues,
} from '../../../models/Accounts-page/tds-pay-page/ITDSPayModel'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  cashAccountID: Yup.number().required('Field is required').min(1, 'Field is required'),
  transactionModeID: Yup.number()
    .required('Transaction Mode is required')
    .min(1, 'Transaction Mode is required'),
  paymentDate: Yup.string().required('payment Date is required'),
})

interface IDepartment {
  selCashAccountTypeID: number
  loading: boolean
  cashAccountData: ICashAccountModel[]
  TDSBreakupData: ITDSBreakupModel[]
  tmpTDSBreakupData: ITDSBreakupModel[]
  selVendorTypeID: number
  selTraModeID: number
  selEmployeeBankID: number
  selTypeID: number
  selEmpId: number
  selYearID: number
  selMonthID: number
  tdsYear: number
  tdsMonth: number
  selgovTaxID: number
  tdsTotalAmount: number
  mainSearch: string
}

const AddTDSPayPage: React.FC = () => {

  const [data, setData] = useState<ITDSPayModel>(initialValues)
  const [filePath, setFilePath] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const history = useHistory()
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )
  const updateData = (fieldsToUpdate: Partial<ITDSPayModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    selCashAccountTypeID: 0,
    loading: false,
    cashAccountData: [] as ICashAccountModel[],
    TDSBreakupData: [] as ITDSBreakupModel[],
    tmpTDSBreakupData: [] as ITDSBreakupModel[],
    selVendorTypeID: 0,
    selTraModeID: 0,
    selEmployeeBankID: 0,
    selTypeID: 0,
    selEmpId: 0,
    selMonthID: moment().month() + 1,
    selYearID: moment().year(),
    tdsYear: moment().year(),
    tdsMonth: moment().month() + 1,
    selgovTaxID: 0,
    tdsTotalAmount: 0,
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
          GetTDSBreakup(responseData, state.tdsYear, state.tdsMonth, mainSearch)
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

  function GetTDSBreakup(
    cashAccountData: ICashAccountModel[],
    tdsYear: number,
    tdsMonth: number,
    mainSearch: string
  ) {
    GetTDSBreakupData(tdsYear, tdsMonth)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setAmount(response.data.tdsTotalAmount)
          setState({
            ...state,
            cashAccountData: cashAccountData,
            TDSBreakupData: responseData,
            selYearID: tdsYear,
            selMonthID: tdsMonth,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, TDSBreakupData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, TDSBreakupData: [], loading: false})
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
    fetch(process.env.REACT_APP_API_URL + '/TDS/UploadTDSFilePath', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
        setFileLoader(false)
      })
  }

  const [amount, setAmount] = useState<string>('')
  function handleAmount(e: any) {
    let tmpAmount = e.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpAmount)) && re.test(tmpAmount)) {
      setAmount(tmpAmount)
    } else if (tmpAmount == '') {
      setAmount('')
    }
  }

  // -----------------TDS Breakup Api-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
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
      setState({...state, selTraModeID: parseInt(value)})
    } else if (elementId === 'cashAccountBankID') {
      formik.setFieldValue('cashAccountBankID', parseInt(value))
      setState({...state, selEmployeeBankID: parseInt(value)})
    } else if (elementId === 'YearID') {
      formik.setFieldValue('YearID', parseInt(value))
      GetTDSBreakup(state.cashAccountData, parseInt(value), state.selMonthID, state.mainSearch)
    } else if (elementId === 'MonthID') {
      formik.setFieldValue('MonthID', parseInt(value))
      GetTDSBreakup(state.cashAccountData, state.selYearID, parseInt(value), state.mainSearch)
    }
  }

  const formik = useFormik<ITDSPayModel>({
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
        let temTramsID: string = ''
        let tmpAmt: number = 0

        if (values.paymentDate > moment(new Date()).format('YYYY-MM-DD')) {
          toast.error(`Date should be less than or Equal to today's date`)
          return setLoading(false)
        }

        if (state.selTraModeID === 2) {
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

        if (state.selTraModeID === 1) {
          if (values.transactionID === '') {
            toast.error(`Check Date is required.`)
            return setLoading(false)
          } else {
            temTramsID = values.transactionID
          }
        }

        if (parseInt(amount) <= 0) {
          toast.error(`Amount Must be Grater Than 0 `)
          return setLoading(false)
        } else {
          tmpAmt = parseInt(amount)
        }
        AddTDSPayApi(
          values.paymentDate,
          tmpAmt,
          values.cashAccountID,
          values.transactionModeID,
          temTramsID,
          temBankName,
          temBranchName,
          temCheckDate,
          temCheckAmnt,
          temCheckNo,
          values.cashAccountBankID,
          values.description,
          filePath,
          values.referenceNo,
          state.selYearID,
          state.selMonthID,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname: '/accounts/tds/list', state: {Search: state.mainSearch}})
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
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Select Year :</label>
                <div className='mb-2 col-lg-3 col-sm-6 ps-0'>
                  <select
                    className='form-select form-select-white lineHeightByD'
                    id='YearID'
                    onChange={selectChange}
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
                  {formik.touched.YearID && formik.errors.YearID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.YearID}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Select Month :</label>
                <div className='mb-2 col-xl-3 col-sm-6 ps-0'>
                  <select
                    className='form-select form-select-white lineHeightByD'
                    onChange={selectChange}
                    id='MonthID'
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
                  {formik.touched.MonthID && formik.errors.MonthID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.MonthID}</div>
                    </div>
                  )}
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
                    placeholder='Amount'
                    value={amount}
                    id='amount'
                    onChange={(e) => handleAmount(e)}
                    // {...formik.getFieldProps('amount')}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.amount}</div>
                    </div>
                  )}
                </div>
                <div className='col-lg-2 fv-row pt-3 ms-4'>
                  <div
                    onClick={() => handleShow()}
                    className='col-form-label text-white text-hover-primary d-block fs-7 badge badge-success cursor-pointer ms-5 text-center'
                  >
                    View Breakup
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
                {/* </div>

              <div className='row mb-6'> */}
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
                    <option selected={state.selTraModeID === 0 ? true : false} value={0}>
                      Select Payment Mode
                    </option>
                    {state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selTraModeID === 1 ? true : false} value={1}>
                        Online
                      </option>
                    )}
                    {state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selTraModeID === 2 ? true : false} value={2}>
                        Cheque
                      </option>
                    )}
                    {state.selTypeID === 1 || state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selTraModeID === 3 ? true : false} value={3}>
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
              <div className={state.selTraModeID === 2 ? 'row mb-6' : 'd-none'}>
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
              <div className={state.selTraModeID === 2 ? 'row mb-6' : 'd-none'}>
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
                    {...formik.getFieldProps('chequeAmount')}
                  />
                  {formik.touched.chequeAmount && formik.errors.chequeAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selTraModeID === 2 ? 'row mb-6' : 'd-none'}>
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
              <div className={state.selTraModeID === 1 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
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
              <div
                className={
                  state.selTypeID === 2 && (state.selTraModeID === 1 || state.selTraModeID === 2)
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
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Reference No:</label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Reference No'
                    {...formik.getFieldProps('referenceNo')}
                  />
                  {formik.touched.referenceNo && formik.errors.referenceNo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.referenceNo}</div>
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
                <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5 cursor-pointer'>
                    {/* <img src={process.env.REACT_APP_API_URL + filePath} alt='img' /> */}
                    <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                  </div>
                </div>
                <div className={filePath === '' ? 'col-lg-9 fv-row mt-3' : 'col-lg-7 fv-row mt-3'}>
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
                to={{pathname: '/accounts/tds/list', state: {Search: state.mainSearch}}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
        {/* =========================================TDSBreakup POPUP=====================================*/}
        <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
          <div style={{backgroundColor: '#2a3952'}}>
            <Modal.Header closeButton>
              <Modal.Title style={{color: 'white'}}>TDS Breakup Data</Modal.Title>
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
                        <span className='d-block mb-1 ps-2'>Type</span>
                      </th>
                      <th className='min-w-150px'>
                        <span className='d-block mb-1'>Decription</span>
                      </th>
                      <th className='min-w-150px'>
                        <span className='d-block mb-1'>per(%)</span>
                      </th>
                      <th className='min-w-150px'>
                        <span className='d-block mb-1'>Text Value</span>
                      </th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className="border-bottom">
                    {state.TDSBreakupData.length > 0 &&
                      state.TDSBreakupData.map((data, index) => {
                        return (
                          <tr>
                            <td>
                              <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                                {data.taxdate}
                              </span>
                            </td>
                            <td className=''>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.ledgerRefTypeName}
                              </span>
                            </td>

                            <td className=''>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.taxDescription}
                              </span>
                            </td>
                            <td className=''>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.taxPercentage + '%'}
                              </span>
                            </td>
                            <td className=''>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.taxValue}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    {/* =================== Loading get Api Data ============== */}
                    <BlankDataImageInTable
                      length={state.TDSBreakupData.length}
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
      </div>
    </>
  )
}
export default AddTDSPayPage
