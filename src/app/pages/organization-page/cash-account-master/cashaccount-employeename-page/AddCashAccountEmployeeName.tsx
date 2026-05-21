import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'

import {
  ICashAccountModel,
  employeePersonalIniValues as initialValues,
} from '../../../../models/organization-page/cashaccount/ICashAccountModel'

import {IEmployeePageModel} from '../../../../models/organization-page/Employee/IEmployeeModel'
import {IEmployeeBankDetailsModel} from '../../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getEmpBankDetailsByEmpID} from '../../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {AddCashSegmentAccount} from '../../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'

const profileDetailsSchema = Yup.object().shape({
  cashEmployeeSubTypeID: Yup.number()
    .min(1, 'Account Type is required')
    .required('Account Type is required'),
  accountBalance: Yup.string().required('Blance is required'),
  employeeBankID: Yup.number().required('Employee Bank is Required'),
})

interface IPremium {
  loading: boolean
  employeeData: IEmployeePageModel[]
  empBankData: IEmployeeBankDetailsModel[]
  tmpEmployeeDataData: IEmployeePageModel[]
  // bankData: IOrganizationBankModel[]
  selEmployeeBankID: number
  selOrgBankID: number
  selCashAccountID: number
  selEmployeeSubTypeID: number
  // selEmployeeID: number
  selEmpID: number
  fullName: string
  mainSearch: string
}

const AddCashAccountEmployeeName: React.FC = () => {
  const history = useHistory()
  // const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
  //   [] as IEmployeeBankDetailsModel[]
  // )
  const {cashAccoID} = useParams<{cashAccoID: string}>()
  const [isActive, setIsActive] = useState(true)
  const [data, setData] = useState<ICashAccountModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICashAccountModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  // console.log(location)
  const [state, setState] = useState<IPremium>({
    loading: true,
    employeeData: [] as IEmployeePageModel[],
    empBankData: [] as IEmployeeBankDetailsModel[],
    tmpEmployeeDataData: [] as IEmployeePageModel[],
    // bankData: [] as IOrganizationBankModel[],
    selEmployeeBankID: 0,
    selOrgBankID: 0,
    // selEmployeeID: 0,
    selCashAccountID: 0,
    selEmployeeSubTypeID: 0,
    selEmpID: 0,
    fullName: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let cashAccouID = lc.cashAccID
      let employeeID = lc.empID
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      // getAllEmployeeData()
      getAllEmpBankDetailsDataByEmpID(employeeID, cashAccouID, mainSearch)
    }, 100)
  }, [])
  function getAllEmpBankDetailsDataByEmpID(
    employeeID: number,
    cashAccouID: number,
    mainSearch: string
  ) {
    getEmpBankDetailsByEmpID(employeeID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            empBankData: responseData,
            selEmpID: employeeID,
            selCashAccountID: cashAccouID,
            // tmpEmpBankData: responseData,
            mainSearch,
            loading: false,
          })
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            empBankData: [],
            // tmpEmpBankData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, empBankData: [], loading: false})
      })
  }
  //
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'cashEmployeeSubTypeID') {
      formik.setFieldValue('cashEmployeeSubTypeID', parseInt(value))
      setState({...state, selEmployeeSubTypeID: parseInt(value)})
    } else if (elementId === 'employeeBankID') {
      formik.setFieldValue('employeeBankID', parseInt(value))
      setState({...state, selEmployeeBankID: parseInt(value)})
    }
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.employeeData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IEmployeePageModel[] = state.employeeData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICashAccountModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        AddCashSegmentAccount(
          parseInt(cashAccoID),
          state.selEmpID, //empid
          values.cashEmployeeSubTypeID,
          values.employeeBankID,
          values.accountBalance,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: `/organization/cashaccount/cashaccountemployeename/${parseInt(
                  cashAccoID
                )}/list`,
                state: {
                  // accountName: data.accountName,
                  employeeID: state.selEmpID,
                  cashAccouID: state.selCashAccountID,
                  search: state.mainSearch,
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

  //------------------- the search result-----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpEmployeeDataData.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.employeeCode.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setName(keyword)
      setState({...state, employeeData: results})
      setTotal(results.length)
    } else {
      setState({...state, employeeData: state.tmpEmployeeDataData})
      setTotal(state.tmpEmployeeDataData.length)
      setName(keyword)
    }
    setName(keyword)
  }

  return (
    <>
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Account Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cashEmployeeSubTypeID'
                  >
                    <option selected={state.selEmployeeSubTypeID === 0 ? true : false} value={0}>
                      Select Type
                    </option>
                    <option selected={state.selEmployeeSubTypeID === 1 ? true : false} value={1}>
                      Cash
                    </option>
                    <option selected={state.selEmployeeSubTypeID === 2 ? true : false} value={2}>
                      Bank
                    </option>
                  </select>
                  {formik.touched.cashEmployeeSubTypeID && formik.errors.cashEmployeeSubTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cashEmployeeSubTypeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={
                  state.selEmployeeSubTypeID === 0 || state.selEmployeeSubTypeID === 1
                    ? 'd-none'
                    : 'row mb-6'
                }
              >
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Bank:</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='employeeBankID'
                  >
                    <option selected={state.selEmployeeBankID === 0 ? true : false} value={0}>
                      Select Bank
                    </option>
                    {state.empBankData.length > 0 &&
                      state.empBankData.map((data, index) => {
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
                  {formik.touched.employeeBankID && formik.errors.employeeBankID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.employeeBankID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-5'>Balance:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Balance'
                    {...formik.getFieldProps('accountBalance')}
                  />
                  {formik.touched.accountBalance && formik.errors.accountBalance && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.accountBalance}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-9'>
              <button type='submit' className='btn btn-primary me-5' disabled={loading}>
                {!loading && 'Submit'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-5'></span>
                  </span>
                )}
              </button>
              <Link
                className='btn btn-danger'
                to={{
                  // pathname:'/organization/cashaccount/cashaccountemployeename/${data.cashAccountID}/list',

                  pathname: `/organization/cashaccount/cashaccountemployeename/${parseInt(
                    cashAccoID
                  )}/list`,
                  state: {
                    employeeID: state.selEmpID,
                    cashAccouID: state.selCashAccountID,
                    search: state.mainSearch,
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

export {AddCashAccountEmployeeName}
