import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {
  IExpenseMastersModel,
  expenseMastersInitValues as initialValues,
} from '../../../models/master-page/IExpenseMastersMode'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {addExpenseMasters} from '../../../modules/master-page/expense-masters-page/ExpenseMasterCRUD'
import {getExpenseTypeList} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
import {IExpenseModel} from '../../../models/master-page/IExpenseTypeMode'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {IEmployeePageModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import moment from 'moment'
import {gstTypeData} from '../../other-dropDowns/otherDropDowns'
import Select from 'react-select'

const profileDetailsSchema = Yup.object().shape({
  expenseTypeID: Yup.number()
    .required('Eexpense Name is required')
    .min(1, 'Eexpense Name is Required'),
  title: Yup.string().required('Title is Required'),
  expenseDate: Yup.string().required('Title is Required'),
  cashAccountID: Yup.number().required('Field is required').min(1, 'Field is required'),
  transactionModeID: Yup.number().required('Field is required').min(1, 'Field is required'),
})

interface ICountry {
  loading: boolean
  employeeData: IEmployeePageModel[]
  tmpEmployeeData: IEmployeePageModel[]
  expenseData: IExpenseModel[]
  selCashAccountTypeID: number
  cashAccountData: ICashAccountModel[]
  cashAccountID: number
  selpaymentID: number
  selTypeID: number
  selEmployeeBankID: number
  selEmpId: number
  selExpenseTypeID: number
  selEmployeeID: number
  selGstTypeID: number
  ExpenseTypeID: number
  StartDate: string
  EndDate: string
  SearchText: string
}

const AddExpenseMasters: React.FC = () => {
  const [data, setData] = useState<IExpenseMastersModel>(initialValues)
  const [fileLoader, setFileLoader] = useState(false)
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState(null)
  const [isClearableEmployee, setIsClearableEmployee] = useState(true)
  const [isSearchableEmployee, setIsSearchableEmployee] = useState(true)
  const [file, setFile] = useState('')
  const [Tds, setTds] = useState<string>('1')
  const [tdsAmount, setTdsAmount] = useState<string>('')
  const [afterTDSAmount, setAfterTDSAmount] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [cgstPer, setCgstPer] = useState<string>('')
  const [cgstVal, setCgstVal] = useState<string>('')
  const [sgstVal, setSgstVal] = useState<string>('')
  const [sgstPer, setSgstPer] = useState<string>('')
  const [igstVal, setIgstVal] = useState<string>('')
  const [igstPer, setIgstPer] = useState<string>('')
  const [gstAmount, setGstAmount] = useState<string>('')
  const [afterGstAmount, setAfterGstAmount] = useState<string>('')
  const [finalAmount, setFinalAmount] = useState<string>('')
  const [isgst, setIsgst] = useState(false)
  const [isTdsDeduct, setIsTdsDeduct] = useState(false)
  const updateData = (fieldsToUpdate: Partial<IExpenseMastersModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )

  const location = useLocation()
  const history = useHistory()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<ICountry>({
    loading: false,
    employeeData: [] as IEmployeePageModel[],
    tmpEmployeeData: [] as IEmployeePageModel[],
    expenseData: [] as IExpenseModel[],
    cashAccountData: [] as ICashAccountModel[],
    selCashAccountTypeID: 0,
    cashAccountID: 0,
    selpaymentID: 0,
    selTypeID: 0,
    selEmployeeBankID: 0,
    selEmpId: 0,
    selExpenseTypeID: 0,
    selEmployeeID: 0,
    selGstTypeID: 0,
    ExpenseTypeID: 0,
    StartDate: '',
    EndDate: '',
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let selExpenseTypeID: number = 0
      let StartDate: string = ''
      let EndDate: string = ''
      let SearchText: string = ''
      if (lc.searchText != undefined) {
        SearchText = lc.searchText
        selExpenseTypeID = lc.expenseTypeID
        StartDate = lc.startDate
        EndDate = lc.endDate
      }
      getExpenseTypeData(selExpenseTypeID, StartDate, EndDate, SearchText)
    }, 100)
  }, [])

  // -----------------upload file----------------------
  const fileUpload = (e: any) => {
    if (e.target.files[0].size > 20971520) {
      return toast.error('File size has exceeded it max limit of 20MB')
    }
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + `/ExpenseMasters/UploadExpenseMastersDocument`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setFile(data)
        setFileLoader(false)
      })
      .catch((err) => {
        //  console.log(err)
        setFileLoader(false)
      })
  }

  function getExpenseTypeData(
    ExpenseTypeID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string
  ) {
    getExpenseTypeList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getCashAccountData(responseData, ExpenseTypeID, StartDate, EndDate, SearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, expenseData: [], loading: false})
      })
  }

  function getCashAccountData(
    expenseData: IExpenseModel[],
    ExpenseTypeID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string
  ) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getAllEmployeeSearchDropdownData(
            expenseData,
            responseData,
            ExpenseTypeID,
            StartDate,
            EndDate,
            SearchText
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: [], expenseData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: [], expenseData: [], loading: false})
      })
  }

  function getAllEmployeeSearchDropdownData(
    expenseData: IExpenseModel[],
    cashAccountData: ICashAccountModel[],
    ExpenseTypeID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string
  ) {
    getEmployeeSearchDropDown()
      .then((response) => {
        const responseData = response.data
        setState({
          ...state,
          expenseData: expenseData,
          cashAccountData: cashAccountData,
          ExpenseTypeID,
          StartDate,
          EndDate,
          SearchText,
          employeeData: responseData,
          loading: false,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          expenseData: [],
          cashAccountData: [],
          employeeData: [],
          loading: false,
        })
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

  //-----------------------------------------------

  function handleChange(event: any) {
    const tmpValue = event.target.value
    // alert(tmpValue)
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      const tdsamount: any = (parseInt(amount) * parseInt(tmpValue)) / 100
      const afteramount: any = parseInt(amount) - tdsamount
      setTdsAmount(tdsamount)
      setAfterTDSAmount(afteramount)
      if (isgst === true) {
        const finalAmount: any = parseInt(afterGstAmount) - tdsamount
        setFinalAmount(finalAmount)
      } else {
        setFinalAmount(afteramount)
      }
      setTds(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      setTds('0')
    }
  }

  function handleAmtChange(event: any) {
    const tmpValue = event.target.value
    const tmpID = event.target.id
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      if (tmpID === 'amount') {
        if (tmpValue === '') {
          setAmount('')
          setTdsAmount('')
          setAfterTDSAmount('')
        } else {
          const tdsamount: any = (parseInt(tmpValue) * parseInt(Tds)) / 100
          const afteramount: any = parseInt(tmpValue) - tdsamount
          setAmount(tmpValue)
          setTdsAmount(tdsamount)
          setAfterTDSAmount(afteramount)
          setFinalAmount(tmpValue)

          if (isTdsDeduct === true) {
            if (isTdsDeduct === true) {
              const tdsamount: any = (parseInt(tmpValue) * parseInt(Tds)) / 100
              const afteramount: any = parseInt(tmpValue) - tdsamount
              setAmount(tmpValue)
              setTdsAmount(tdsamount)
              setAfterTDSAmount(afteramount)
              setFinalAmount(afteramount)
            }
          }
          if (isgst == true) {
            if (state.selGstTypeID === 1) {
              const tmpCgstVal: any = (parseInt(tmpValue) * parseInt(cgstPer)) / 100
              setCgstVal(tmpCgstVal)
              const tmpSgstVal: any = (parseInt(tmpValue) * parseInt(sgstPer)) / 100
              setSgstVal(tmpSgstVal)
              const tmpGstAmnt: any = tmpCgstVal + tmpSgstVal
              setGstAmount(tmpGstAmnt)
              const tmpAftGstAmnt: any = parseInt(tmpValue) + tmpGstAmnt
              setAfterGstAmount(tmpAftGstAmnt)
              setFinalAmount(tmpAftGstAmnt)
            } else if (state.selGstTypeID === 2) {
              const tmpIgstVal: any = (parseInt(tmpValue) * parseInt(igstPer)) / 100
              setIgstVal(tmpIgstVal)
              const tmpGstAmnt: any = tmpIgstVal
              setGstAmount(tmpGstAmnt)
              const tmpAftGstAmnt: any = parseInt(tmpValue) + tmpGstAmnt
              setAfterGstAmount(tmpAftGstAmnt)
              setFinalAmount(tmpAftGstAmnt)
            } else {
              setGstAmount('')
              setAfterGstAmount('')
              setCgstPer('')
              setCgstVal('')
              setSgstVal('')
              setSgstPer('')
              setIgstVal('')
              setIgstPer('')
            }
          }
        }
      } else if (tmpID === 'cgstPer') {
        setCgstPer(tmpValue)
        const tmpCgstVal: any = (parseInt(amount) * parseInt(tmpValue)) / 100
        setCgstVal(tmpCgstVal)
        setGstAmount(tmpCgstVal)
        const tmpAftGstAmnt: any = parseInt(amount) + tmpCgstVal
        setAfterGstAmount(tmpAftGstAmnt)
        if (isTdsDeduct == true) {
          const finalAmount: any = parseInt(tmpAftGstAmnt) - parseInt(tdsAmount)
          setFinalAmount(finalAmount)
        } else {
          setFinalAmount(tmpAftGstAmnt)
        }
      } else if (tmpID === 'sgstPer') {
        setSgstPer(tmpValue)
        const tmpSgstVal: any = (parseInt(amount) * parseInt(tmpValue)) / 100
        setSgstVal(tmpSgstVal)
        const tmpGstAmnt: any = tmpSgstVal + cgstVal
        setGstAmount(tmpGstAmnt)
        const tmpAftGstAmnt: any = parseInt(amount) + tmpGstAmnt
        setAfterGstAmount(tmpAftGstAmnt)
        // const tmpFinlAmnt: any = parseInt(amount) + tmpGstAmnt
        // setFinalAmount(tmpAftGstAmnt)
        if (isTdsDeduct == true) {
          const finalAmount: any = parseInt(tmpAftGstAmnt) - parseInt(tdsAmount)
          setFinalAmount(finalAmount)
        } else {
          setFinalAmount(tmpAftGstAmnt)
        }
      } else if (tmpID === 'igstPer') {
        setIgstPer(tmpValue)
        const tmpIgstVal: any = (parseInt(amount) * parseInt(tmpValue)) / 100
        setIgstVal(tmpIgstVal)
        const tmpGstAmnt: any = tmpIgstVal
        setGstAmount(tmpGstAmnt)
        const tmpAftGstAmnt: any = parseInt(amount) + tmpGstAmnt
        setAfterGstAmount(tmpAftGstAmnt)
        // setFinalAmount(tmpAftGstAmnt)
        if (isTdsDeduct == true) {
          const finalAmount: any = parseInt(tmpAftGstAmnt) - parseInt(tdsAmount)
          setFinalAmount(finalAmount)
        } else {
          setFinalAmount(tmpAftGstAmnt)
        }
      } else if (tmpValue === '') {
        setTdsAmount('')
        setAfterTDSAmount('')
        setAmount('')
        setFinalAmount('')
        setGstAmount('')
        setAfterGstAmount('')
        setCgstPer('')
        setCgstVal('')
        setSgstVal('')
        setSgstPer('')
        setIgstVal('')
        setIgstPer('')
      }
    } else {
      setTdsAmount('')
      setAfterTDSAmount('')
      setAmount('')
      setFinalAmount('')
      setGstAmount('')
      setAfterGstAmount('')
      setCgstPer('')
      setCgstVal('')
      setSgstVal('')
      setSgstPer('')
      setIgstVal('')
      setIgstPer('')
    }
  }

  function checkedFunction(event: any) {
    const elementId = event.target.id
    if (elementId === 'isTdsDeduct') {
      if (parseInt(amount) > 0.0) {
        setIsTdsDeduct(event.target.checked)
      } else {
        toast.error('Please Enter Amount')
      }
      if (event.target.checked === true) {
        const tdsamount: any = (parseInt(amount) * parseInt(Tds)) / 100
        const afteramount: any = parseInt(amount) - tdsamount
        setTdsAmount(tdsamount)
        setAfterTDSAmount(afteramount)
        if (isgst === true) {
          const tmpFinalAmnt: any = parseInt(afterGstAmount) - tdsamount
          setFinalAmount(tmpFinalAmnt)
        } else {
          setFinalAmount(afteramount)
        }
      }
      if (event.target.checked === false) {
        setTdsAmount('')
        setAfterTDSAmount('')
        setTds('0')
        if (isgst === true) {
          const tmpFinalAmnt: any = parseInt(afterGstAmount)
          setFinalAmount(tmpFinalAmnt)
        } else {
          setFinalAmount(amount)
        }
      }
    } else if (elementId === 'isgst') {
      if (parseInt(amount) > 0.0) {
        setIsgst(event.target.checked)
      } else {
        toast.error('Please Enter Amount')
      }
      if (event.target.checked === false) {
        setIsgst(event.target.checked)
        setState({...state, selGstTypeID: 0})
        setGstAmount('')
        setAfterGstAmount('')
        setCgstPer('')
        setCgstVal('')
        setSgstVal('')
        setSgstPer('')
        setIgstVal('')
        setIgstPer('')
        if (isTdsDeduct === true) {
          const tmpFinalAmnt: any = parseInt(amount) - parseInt(tdsAmount)
          setFinalAmount(tmpFinalAmnt)
        } else {
          setFinalAmount(amount)
        }
      }
    }
  }

  // ==========================================================================================================
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
        selEmployeeBankID: 0,
        selpaymentID: 0,
      })
      if (parseInt(value) === 0) {
        return
      } else {
        getAllEmpBankDetailsDataByEmpID(parseInt(empID))
      }
    } else if (elementId === 'transactionModeID') {
      formik.setFieldValue('transactionModeID', parseInt(value))
      setState({...state, selpaymentID: parseInt(value), selEmployeeBankID: 0})
    } else if (elementId === 'cashAccountBankID') {
      formik.setFieldValue('cashAccountBankID', parseInt(value))
      setState({...state, selEmployeeBankID: parseInt(value)})
    } else if (elementId === 'expenseTypeID') {
      formik.setFieldValue('expenseTypeID', parseInt(value))
      setState({...state, selExpenseTypeID: parseInt(value)})
    } else if (elementId === 'gstTypeID') {
      formik.setFieldValue('gstTypeID', parseInt(value))
      setCgstPer('')
      setCgstVal('')
      setGstAmount('')
      setAfterGstAmount('')
      setSgstPer('')
      setSgstVal('')
      setIgstPer('')
      setIgstVal('')
      setState({...state, selGstTypeID: parseInt(value)})
    }
  }

  // =================select Change function====================
  function employeeChange(e: any) {
    if (e === null) {
      setState({...state, selEmployeeID: 0})
      formik.setFieldValue('employeeID', 0)
      return
    }
    setState({...state, selEmployeeID: e.value})
    setSelectedOptionEmployee(e)
    formik.setFieldValue('employeeID', e.value)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IExpenseMastersModel>({
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
        let temSGSTVal: any = 0
        let temCGSTVal: any = 0
        let temIGSTVal: any = 0
        let temSGSTPer: any = 0
        let temCGSTPer: any = 0
        let temIGSTPer: any = 0
        let temGSTAmnt: any = 0
        let temAfteGSTAmnt: any = 0
        let temTdsPer: any = 0
        let temTdsAmnt: any = 0
        let temAfteTdsAmnt: any = 0

        if (values.expenseDate > moment(new Date()).format('YYYY-MM-DD')) {
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

        if (isgst === true) {
          if (state.selGstTypeID == 1) {
            temCGSTVal = cgstVal
            temSGSTVal = sgstVal
            temCGSTPer = cgstPer
            temSGSTPer = sgstPer
            temGSTAmnt = gstAmount
            temAfteGSTAmnt = afterGstAmount
          } else {
            temIGSTVal = igstVal
            temIGSTPer = igstPer
            temGSTAmnt = gstAmount
            temAfteGSTAmnt = afterGstAmount
          }
        }

        if (isTdsDeduct === true) {
          temTdsPer = Tds
          temTdsAmnt = tdsAmount
          temAfteTdsAmnt = afterTDSAmount
        }

        addExpenseMasters(
          values.expenseTypeID,
          values.title,
          values.expenseDate,
          file,
          parseFloat(amount),
          user.employeeID,
          '192.168.0.1',
          values.cashAccountID,
          values.transactionModeID,
          values.transactionID,
          temBankName,
          temBranchName,
          temCheckDate,
          temCheckAmnt,
          temCheckNo,
          values.cashAccountBankID,
          values.vendorInvoiceNo,
          values.employeeID,
          isgst,
          values.gstTypeID,
          temCGSTVal,
          temSGSTVal,
          temIGSTVal,
          temGSTAmnt,
          temSGSTPer,
          temCGSTPer,
          temIGSTPer,
          isTdsDeduct,
          temTdsPer,
          temTdsAmnt,
          temAfteTdsAmnt,
          temAfteGSTAmnt,
          parseFloat(finalAmount)
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/accounts/expenseMasters/list',
                state: {
                  search: state.SearchText,
                  expenseTypeID: state.ExpenseTypeID,
                  startDate: state.StartDate,
                  endDate: state.EndDate,
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
              pathname: '/accounts/expenseMasters/list',
              state: {
                search: state.SearchText,
                expenseTypeID: state.ExpenseTypeID,
                startDate: state.StartDate,
                endDate: state.EndDate,
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
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Title:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Title'
                    {...formik.getFieldProps('title')}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.title}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Expense Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='expenseTypeID'
                  >
                    <option selected={state.selExpenseTypeID === 0 ? true : false} value={0}>
                      Select Expense Type
                    </option>
                    {state.expenseData.length > 0 &&
                      state.expenseData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.expenseTypeID}
                            selected={data.expenseTypeID === state.selExpenseTypeID ? true : false}
                          >
                            {data.expenseTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.expenseTypeID && formik.errors.expenseTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.expenseTypeID}</div>
                    </div>
                  )}
                </div>
                <label
                  className={
                    state.selExpenseTypeID === 5
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  Select Employee:
                </label>
                <div
                  className={state.selExpenseTypeID === 5 ? 'col-lg-4 col-sm-6 fv-row' : 'd-none'}
                >
                  <Select
                    className='basic-single'
                    classNamePrefix='select'
                    isClearable={isClearableEmployee}
                    isSearchable={isSearchableEmployee}
                    // value={selectedOptionEmployee}
                    onChange={employeeChange}
                    options={state.employeeData}
                  />
                  {formik.touched.employeeID && formik.errors.employeeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.employeeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Sub Total:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Amount'
                    value={amount}
                    id='amount'
                    // {...formik.getFieldProps('amount')}
                    onChange={handleAmtChange}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.amount}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Date:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Date'
                    {...formik.getFieldProps('expenseDate')}
                  />
                  {formik.touched.expenseDate && formik.errors.expenseDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.expenseDate}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>IS GST:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='isgst'
                      checked={isgst}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
                <label
                  className={isgst === true ? 'col-lg-2 col-form-label  fw-bold fs-6' : 'd-none'}
                >
                  GST Type :
                </label>
                <div className={isgst === true ? 'col-lg-4 fv-row' : 'd-none'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='gstTypeID'
                  >
                    <option selected={state.selGstTypeID === 0 ? true : false} value={0}>
                      Select GST Type
                    </option>
                    {gstTypeData.length > 0 &&
                      gstTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.gstTypeID}
                            selected={state.selGstTypeID == data.gstTypeID ? true : false}
                          >
                            {data.gstTypeName}
                          </option>
                        )
                      })}
                  </select>
                </div>
                {formik.touched.gstTypeID && formik.errors.gstTypeID && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.gstTypeID}</div>
                  </div>
                )}
              </div>
              <div className={state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'}>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>CGST Percentage:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='CGST Percentage'
                    id='cgstPer'
                    value={cgstPer}
                    onChange={handleAmtChange}
                  />
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>CGST Amount:</label>
                <div className={'col-lg-4 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='CGST Amount'
                    id='cgstVal'
                    value={cgstVal}
                    disabled
                  />
                </div>
              </div>
              <div className={state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'}>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>SGST Percentage:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='SGST Percentage'
                    id='sgstPer'
                    value={sgstPer}
                    onChange={handleAmtChange}
                  />
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>SGST Amount:</label>
                <div className={'col-lg-4 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='SGST Amount'
                    id='sgstVal'
                    value={sgstVal}
                    disabled
                  />
                </div>
              </div>
              <div className={state.selGstTypeID === 2 && isgst === true ? 'row mb-6' : 'd-none'}>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>IGST Percentage:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='IGST Amount'
                    id='igstPer'
                    value={igstPer}
                    onChange={handleAmtChange}
                  />
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>IGST Amount:</label>
                <div className={'col-lg-4 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='IGST Amount'
                    id='igstVal'
                    value={igstVal}
                    disabled
                  />
                </div>
              </div>
              <div className={state.selGstTypeID > 0 ? 'row mb-6' : 'd-none'}>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>GST Amount:</label>
                <div className={'col-lg-4 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='GST Amount'
                    value={gstAmount}
                    disabled
                    id='gstAmount'
                  />
                </div>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>After GST Amount:</label>
                <div className={'col-lg-4 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='After GST Amount'
                    value={afterGstAmount}
                    disabled
                    id='afterGstAmount'
                  />
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>IS TDS Deduct:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='isTdsDeduct'
                      checked={isTdsDeduct}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
                <label
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  TDS:
                </label>
                <div className={isTdsDeduct === true ? 'col-lg-2 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='tdsAmount'
                    value={Tds}
                    onChange={handleChange}
                  />
                </div>
                <span
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'
                      : 'd-none'
                  }
                >
                  %
                </span>
              </div>
              <div className={isTdsDeduct === true ? 'row mb-6' : 'd-none'}>
                <label
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  TDS Amount:
                </label>
                <div className={isTdsDeduct === true ? 'col-lg-4 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='tdsAmount'
                    disabled
                    value={tdsAmount}
                  />
                </div>
                <label
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  After TDS:
                </label>
                <div className={isTdsDeduct === true ? 'col-lg-4 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='After TDS Amount'
                    value={afterTDSAmount}
                    disabled
                  />
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Final Amount:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Final Amount'
                    value={finalAmount}
                    disabled
                    id='finalAmount'
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Account:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cashAccountID'
                  >
                    <option selected={state.selCashAccountTypeID === 0 ? true : false} value={0}>
                      Select Cassh Account Type
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Mode:
                </label>
                <div className='col-lg-4 fv-row'>
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
              <div className={'row mb-6'}>
                <label
                  className={
                    state.selTypeID === 2 && (state.selpaymentID === 1 || state.selpaymentID === 2)
                      ? 'col-lg-2 col-form-label fw-bold fs-6 required'
                      : 'd-none'
                  }
                >
                  Select Employee Bank Name:
                </label>
                <div
                  className={
                    state.selTypeID === 2 && (state.selpaymentID === 1 || state.selpaymentID === 2)
                      ? 'col-lg-4 fv-row'
                      : 'd-none'
                  }
                >
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
                <label
                  className={
                    state.selpaymentID === 2 ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  <span className=''>Cheque Date:</span>
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
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Bank Name:</span>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Branch Name:</span>
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
                  <span className=''>Cheque Amount:</span>
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
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Vendor Invoice No.:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Vendor Invoice No'
                    {...formik.getFieldProps('vendorInvoiceNo')}
                  />
                  {formik.touched.vendorInvoiceNo && formik.errors.vendorInvoiceNo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.vendorInvoiceNo}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Document Attach:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='file'
                    accept='.pdf'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => fileUpload(e)}
                  />
                  <span className='text-danger'>Allow maximum 20MB file size </span>
                </div>
              </div>
              <div className={file !== '' ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''></span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <div className='symbol symbol-75px me-5'>
                    <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                  </div>
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
              </button>{' '}
              <Link
                className='btn btn-danger ms-3'
                to={{
                  pathname: '/accounts/expenseMasters/list',
                  state: {
                    search: state.SearchText,
                    expenseTypeID: state.ExpenseTypeID,
                    startDate: state.StartDate,
                    endDate: state.EndDate,
                  },
                }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {AddExpenseMasters}
