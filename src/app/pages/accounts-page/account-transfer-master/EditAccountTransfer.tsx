import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {
  GetCashAccountListAPI,
  GetCashSubAccountByID,
} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IAccountTransferModel,
  ISubAccountTransferModel,
  accountTransferInitValues as initialValues,
} from '../../../models/Accounts-page/account-transfer-page/IAccountTreansfer'
import Loader from '../../common-pages/Loader'
import {
  GetAccountTranByID,
  updateAccountTransferDetails,
} from '../../../modules/account-page/account-transfer-master-page/AccountTransferCRUD'

const profileDetailsSchema = Yup.object().shape({
  transferDate: Yup.string().required('Cash Account is required'),
  amount: Yup.number().required('Amount is required').min(1, 'field is required'),
  fromAccountID: Yup.number().required('Amount is required').min(1, 'field is required'),
  toAccountID: Yup.number().required('Amount is required').min(1, 'field is required'),
  transactionModeID: Yup.number().required('Amount is required').min(1, 'field is required'),
})

interface IDepartment {
  selCashAccountTypeID: number
  loading: boolean
  selToEmpId: number
  selFromEmpId: number
  selToTypeID: number
  selFromTypeID: number
  accountTransferData: IAccountTransferModel[]
  cashAccountData: ICashAccountModel[]
  subAccountFromData: ISubAccountTransferModel[]
  subAccountToData: ISubAccountTransferModel[]
  selpaymentID: number
  selFromCashAccountID: number
  selToCashAccountID: number
  selFromSubAccountID: number
  selToSubAccountID: number
  FromCashAccountID: number
  ToCashAccountID: number
  StartDate: string
  EndDate: string
  SearchText: string
}

const EditAccountTransfer: React.FC = () => {
  const [data, setData] = useState<IAccountTransferModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const {accountTransferID} = useParams<{accountTransferID: string}>()
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const updateData = (fieldsToUpdate: Partial<IAccountTransferModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDepartment>({
    loading: false,
    selCashAccountTypeID: 0,
    selToEmpId: 0,
    selFromEmpId: 0,
    accountTransferData: [] as IAccountTransferModel[],
    cashAccountData: [] as ICashAccountModel[],
    subAccountFromData: [] as ISubAccountTransferModel[],
    subAccountToData: [] as ISubAccountTransferModel[],
    selpaymentID: 0,
    selToTypeID: 0,
    selFromTypeID: 0,
    selFromCashAccountID: 0,
    selToCashAccountID: 0,
    selFromSubAccountID: 0,
    selToSubAccountID: 0,
    FromCashAccountID: 0,
    ToCashAccountID: 0,
    StartDate: '',
    EndDate: '',
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let selFromCashAccountID: number = 0
      let selToCashAccountID: number = 0
      let StartDate: string = ''
      let EndDate: string = ''
      let SearchText: string = ''
      if (lc != undefined) {
        selFromCashAccountID = lc.FromCashAccountID
        selToCashAccountID = lc.ToCashAccountID
        StartDate = lc.StartDate
        EndDate = lc.EndDate
        SearchText = lc.SearchText
      }
      getCashAccountData(selFromCashAccountID, selToCashAccountID, StartDate, EndDate, SearchText)
    }, 100)
  }, [])

  function getCashAccountData(
    selFromCashAccountID: number,
    selToCashAccountID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string
  ) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getProjectDataByProjectID(
            responseData,
            selFromCashAccountID,
            selToCashAccountID,
            StartDate,
            EndDate,
            SearchText
          )
          // setState({
          //   ...state,
          //   cashAccountData: responseData,
          //   loading: false,
          // })
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

  function getSubDataBycashAccountID(
    cashAccountID: number,
    typeId: number,
    empID: number,
    tmpType: string
  ) {
    GetCashSubAccountByID(cashAccountID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          if (tmpType === 'to') {
            setState({
              ...state,
              subAccountToData: responseData,
              loading: false,
              selToCashAccountID: cashAccountID,
              selToTypeID: typeId,
              selToEmpId: empID,
            })
          } else if (tmpType === 'from') {
            setState({
              ...state,
              subAccountFromData: responseData,
              loading: false,
              selFromCashAccountID: cashAccountID,
              selFromTypeID: typeId,
              selFromEmpId: empID,
            })
          }
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            subAccountFromData: [],
            loading: false,
            selToCashAccountID: cashAccountID,
            selToTypeID: typeId,
            selToEmpId: empID,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  function getProjectDataByProjectID(
    cashAccountData: ICashAccountModel[],
    mainFromCashAccountID: number,
    mainToCashAccountID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string
  ) {
    GetAccountTranByID(parseInt(accountTransferID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('amount', response.data.amount)
          formik.setFieldValue('transferDate', response.data.transferDate)
          formik.setFieldValue('fromAccountID', response.data.fromAccountID)
          formik.setFieldValue('fromSubAccountID', response.data.fromSubAccountID)
          formik.setFieldValue('toAccountID', response.data.toAccountID)
          formik.setFieldValue('toSubAccountID', response.data.toSubAccountID)
          formik.setFieldValue('transactionModeID', response.data.transactionModeID)
          formik.setFieldValue('transactionID', response.data.transactionID)
          formik.setFieldValue('description', response.data.description)
          formik.setFieldValue('chequeBankName', response.data.chequeBankName)
          formik.setFieldValue('chequeBankBranch', response.data.chequeBankBranch)
          formik.setFieldValue('chequeDate', response.data.chequeDate)
          formik.setFieldValue('chequeAmount', response.data.chequeAmount)
          formik.setFieldValue('chequeNumber', response.data.chequeNumber)
          setQuotationFilePath(response.data.filePath)

          setState({
            ...state,
            selFromCashAccountID: response.data.fromAccountID,
            selpaymentID: response.data.transactionModeID,
            selFromSubAccountID: response.data.fromSubAccountID,
            selToCashAccountID: response.data.toAccountID,
            selToSubAccountID: response.data.toSubAccountID,
            cashAccountData: cashAccountData,
            FromCashAccountID: mainFromCashAccountID,
            ToCashAccountID: mainToCashAccountID,
            StartDate,
            EndDate,
            SearchText,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'toAccountID') {
      const typeId = event.target.selectedOptions[0].id
      const empID = event.target.selectedOptions[0].lang
      formik.setFieldValue('toAccountID', parseInt(value))
      if (parseInt(value) === 0) {
        setState({
          ...state,
          selToCashAccountID: parseInt(value),
          selToTypeID: parseInt(typeId),
          selToEmpId: parseInt(empID),
        })
        return
      } else {
        getSubDataBycashAccountID(parseInt(value), parseInt(typeId), parseInt(empID), 'to')
      }
    } else if (elementId === 'fromAccountID') {
      const typeId = event.target.selectedOptions[0].id
      const empID = event.target.selectedOptions[0].lang
      formik.setFieldValue('fromAccountID', parseInt(value))
      if (parseInt(value) === 0) {
        setState({
          ...state,
          selFromCashAccountID: parseInt(value),
          selFromTypeID: parseInt(typeId),
          selFromEmpId: parseInt(empID),
        })
        return
      } else {
        getSubDataBycashAccountID(parseInt(value), parseInt(typeId), parseInt(empID), 'from')
      }
    } else if (elementId === 'transactionModeID') {
      formik.setFieldValue('transactionModeID', parseInt(value))
      setState({...state, selpaymentID: parseInt(value)})
    } else if (elementId === 'fromSubAccountID') {
      formik.setFieldValue('fromSubAccountID', parseInt(value))
      setState({...state, selFromSubAccountID: parseInt(value)})
    } else if (elementId === 'toSubAccountID') {
      formik.setFieldValue('toSubAccountID', parseInt(value))
      setState({...state, selToSubAccountID: parseInt(value)})
    }
  }
  const formik = useFormik<IAccountTransferModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let temCheckNo: string = ''

        if (state.selpaymentID === 2) {
          if (values.chequeNumber === '') {
            toast.error(`Check Number is required.`)
            return setLoading(false)
          } else {
            temCheckNo = values.chequeNumber
          }
        }

        updateAccountTransferDetails(
          parseInt(accountTransferID),
          values.transferDate,
          values.amount,
          values.fromAccountID,
          values.fromSubAccountID,
          values.toAccountID,
          values.toSubAccountID,
          values.transactionModeID,
          values.transactionID,
          values.chequeBankName,
          values.chequeBankBranch,
          values.chequeDate,
          values.chequeAmount,
          temCheckNo,
          values.description,
          quotationFilePath,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/accounts/accounttransfer/list',
                state: {
                  selFromCashAccountID: state.FromCashAccountID,
                  selToCashAccountID: state.ToCashAccountID,
                  StartDate: state.StartDate,
                  EndDate: state.EndDate,
                  search: state.SearchText,
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

  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }
  // function handleShow(event: MouseEvent<HTMLDivElement, MouseEvent>): void {
  //     throw new Error('Function not implemented.')
  // }
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/AccountTransfer/AddAccountTransferFile', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
  }

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          {state.loading ? (
            <Loader loading={state.loading} />
          ) : (
            <form onSubmit={formik.handleSubmit} noValidate className='form'>
              <div className='card-body border-top p-9 ms-6'>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'> Date:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='date'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Payment Date'
                      {...formik.getFieldProps('transferDate')}
                    />
                    {formik.touched.transferDate && formik.errors.transferDate && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.transferDate}</div>
                      </div>
                    )}
                  </div>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'>Amount Transfer:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Amount'
                      {...formik.getFieldProps('amount')}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.amount}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    From Account:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='fromAccountID'
                    >
                      <option selected={state.selFromCashAccountID === 0 ? true : false} value={0}>
                        Select Account
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
                                data.cashAccountID === state.selFromCashAccountID ? true : false
                              }
                            >
                              {data.accountName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.fromAccountID && formik.errors.fromAccountID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.fromAccountID}</div>
                      </div>
                    )}
                  </div>
                  <label
                    className={
                      state.selFromTypeID === 2 ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                    }
                  >
                    <span className=''>From Sub Account:</span>
                  </label>
                  <div className={state.selFromTypeID === 2 ? 'col-lg-4 fv-row' : 'd-none'}>
                    {/* <div className='row mb-6'> */}
                    <select
                      className='form-select'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='fromSubAccountID'
                    >
                      <option selected={state.selFromSubAccountID == 0 ? true : false} value={0}>
                        Select Sub Account
                      </option>
                      {state.subAccountFromData.length > 0 &&
                        state.subAccountFromData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.cashEmployeeBalanceID}
                              selected={
                                data.cashEmployeeBalanceID == state.selFromSubAccountID
                                  ? true
                                  : false
                              }
                            >
                              {data.cashSubAccountName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.fromSubAccountID && formik.errors.fromSubAccountID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.fromSubAccountID}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    To Account:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='toAccountID'
                    >
                      <option selected={state.selToCashAccountID === 0 ? true : false} value={0}>
                        Select Account
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
                                data.cashAccountID === state.selToCashAccountID ? true : false
                              }
                            >
                              {data.accountName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.toAccountID && formik.errors.toAccountID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.toAccountID}</div>
                      </div>
                    )}
                  </div>
                  <label
                    className={
                      state.selToTypeID === 2 ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                    }
                  >
                    <span className=''>To Sub Account:</span>
                  </label>
                  <div className={state.selToTypeID === 2 ? 'col-lg-4 fv-row' : 'd-none'}>
                    <select
                      className='form-select'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='toSubAccountID'
                    >
                      <option selected={state.selToSubAccountID === 0 ? true : false} value={0}>
                        Select Sub Account
                      </option>
                      {state.subAccountToData.length > 0 &&
                        state.subAccountToData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.cashEmployeeBalanceID}
                              selected={
                                data.cashEmployeeBalanceID == state.selToSubAccountID ? true : false
                              }
                            >
                              {data.cashSubAccountName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.toSubAccountID && formik.errors.toSubAccountID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.toSubAccountID}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Select Payment Mode:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='transactionModeID'
                    >
                      <option>Select Payment Mode</option>

                      <option selected={state.selpaymentID === 1 ? true : false} value={1}>
                        Online
                      </option>

                      <option selected={state.selpaymentID === 2 ? true : false} value={2}>
                        Cheque
                      </option>

                      <option selected={state.selpaymentID === 3 ? true : false} value={3}>
                        Cash
                      </option>
                    </select>
                    {formik.touched.transactionModeID && formik.errors.transactionModeID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.transactionModeID}</div>
                      </div>
                    )}
                  </div>

                  <label
                    className={
                      state.selpaymentID === 2 ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                    }
                  >
                    <span>Cheque Date:</span>
                  </label>
                  <div className={state.selpaymentID === 2 ? 'col-lg-4 fv-row' : 'd-none'}>
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Transaction ID:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
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

                <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'>Cheque No:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span>Bank Name:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span>Branch Name:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span>Cheque Amount:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
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

                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Remarks:</span>
                  </label>
                  <div className='col-lg-10 fv-row'>
                    <textarea
                      rows={2}
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Remarks'
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
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
                  <div
                    className={quotationFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'}
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
                  to={{
                    pathname: '/accounts/accounttransfer/list',
                    state: {
                      selFromCashAccountID: state.FromCashAccountID,
                      selToCashAccountID: state.ToCashAccountID,
                      StartDate: state.StartDate,
                      EndDate: state.EndDate,
                      search: state.SearchText,
                    },
                  }}
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
export default EditAccountTransfer
