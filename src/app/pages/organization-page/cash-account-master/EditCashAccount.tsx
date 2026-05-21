import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {getCustomerList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {Button, Modal} from 'react-bootstrap-v5'
import {Pagination} from 'antd'
import {KTSVG} from '../../../../_Ecd/helpers'
import {
  ICashAccountModel,
  IOrganizationBankModel,
  employeePersonalIniValues as initialValues,
} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {
  UpdateCashAccountDetailsAPI,
  GetOrganizationBankDropdpwnAPI,
  GetCashAccountDataByCashAccountIDAPI,
  getMultiDropdownForCashAccountApi,
} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {getAllEmployeeList} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {IEmployeePageModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  cashAccountTypeID: Yup.number()
    .min(1, 'Account Type is required')
    .required('Account Type is required'),
  accountBalance: Yup.string().required('Blance is required'),
})

interface IPremium {
  loading: boolean
  employeeData: IEmployeePageModel[]
  tmpEmployeeDataData: IEmployeePageModel[]
  bankData: IOrganizationBankModel[]
  cashAccountData: ICashAccountModel[]
  selCashAccountTypeID: number
  selOrgBankID: number
  selEmployeeID: number
  selCashAccountRoleID: number
  fullName: string
  mainSearch: string
}

const EditCashAccount: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(true)
  const [data, setData] = useState<ICashAccountModel>(initialValues)
  const {cashAccoID} = useParams<{cashAccoID: string}>()
  const updateData = (fieldsToUpdate: Partial<ICashAccountModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IPremium>({
    loading: true,
    employeeData: [] as IEmployeePageModel[],
    tmpEmployeeDataData: [] as IEmployeePageModel[],
    bankData: [] as IOrganizationBankModel[],
    cashAccountData: [] as ICashAccountModel[],
    selCashAccountTypeID: 0,
    selOrgBankID: 0,
    selEmployeeID: 0,
    selCashAccountRoleID: 0,
    fullName: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      // getOrganizationBankData()
      getCashAccountDataByCashAccountID(mainSearch)
    }, 100)
  }, [])

  // function getOrganizationBankData() {
  //   GetOrganizationBankDropdpwnAPI()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getCashAccountDataByCashAccountID(responseData)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, bankData: [], loading: false})
  //     })
  // }

  // function getCashAccountDataByCashAccountID(organisationBankData:IOrganizationBankModel[]) {
  function getCashAccountDataByCashAccountID(mainSearch: string) {
    GetCashAccountDataByCashAccountIDAPI(parseInt(cashAccoID))
      .then((response) => {
        const responseData = response.data
        if (responseData.isSuccess === true) {
          formik.setFieldValue('cashAccountID', responseData.cashAccountID)
          formik.setFieldValue('employeeID', responseData.employeeID)
          formik.setFieldValue('cashAccountTypeID', responseData.cashAccountTypeID)
          formik.setFieldValue('cashAccountRoleID', responseData.cashAccountRoleID)
          formik.setFieldValue('organisationBankID', responseData.organisationBankID)
          formik.setFieldValue('accountBalance', responseData.accountBalance)
          setIsActive(responseData.isActive)
          getMultiDropdownForCashAccountData(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, bankData: [], employeeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bankData: [], employeeData: [], loading: false})
      })
  }

  function getMultiDropdownForCashAccountData(
    cashAccountData: ICashAccountModel,
    mainSearch: string
  ) {
    getMultiDropdownForCashAccountApi()
      .then((response) => {
        const orgBankData = response.data.orgBnkList
        const employeeListData = response.data.employeeList
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            bankData: orgBankData,
            selCashAccountTypeID: cashAccountData.cashAccountTypeID,
            selCashAccountRoleID: cashAccountData.cashAccountRoleID,
            selOrgBankID: cashAccountData.organisationBankID,
            selEmployeeID: cashAccountData.employeeID,
            mainSearch,
            employeeData: employeeListData,
            tmpEmployeeDataData: employeeListData,
            loading: false,
          })
          setTotal(employeeListData.length)
          setPage(1)
          // ======================================================
          if (cashAccountData.cashAccountTypeID === 2) {
            const temRows = []
            const Rows = employeeListData
            for (let key in Rows) {
              if (Rows[key].employeeID === cashAccountData.employeeID) {
                temRows.push(Rows[key])
              }
            }
            formik.setFieldValue('employeeID', temRows[0].employeeID)
            formik.setFieldValue('employeeName', temRows[0].firstName + ' ' + temRows[0].lastName)
            formik.setFieldValue('email', temRows[0].email)
            formik.setFieldValue('mobileNumber', temRows[0].contactNumber)
          }
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, employeeData: [], bankData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], bankData: [], loading: false})
      })
  }
  // function getAllEmployeeData(
  //   bankData: IOrganizationBankModel[],
  //   temEmpID: number,
  //   temCashAccID: number,
  //   temRoleID: number,
  //   cashAccountData: number
  // ) {
  //   getAllEmployeeList()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         setState({
  //           ...state,
  //           bankData: bankData,
  //           selCashAccountTypeID: temCashAccID,
  //           selCashAccountRoleID: temRoleID,
  //           selOrgBankID: temBankID,
  //           selEmployeeID: temEmpID,
  //           employeeData: responseData,
  //           tmpEmployeeDataData: responseData,
  //           loading: false,
  //         })
  //         setTotal(responseData.length)
  //         setPage(1)
  //         // ======================================================
  //         if (temCashAccID === 2) {
  //           const temRows = []
  //           const Rows = responseData
  //           for (let key in Rows) {
  //             if (Rows[key].employeeID === temEmpID) {
  //               temRows.push(Rows[key])
  //             }
  //           }
  //           formik.setFieldValue('employeeID', temRows[0].employeeID)
  //           formik.setFieldValue('employeeName', temRows[0].firstName + ' ' + temRows[0].lastName)
  //           formik.setFieldValue('email', temRows[0].email)
  //           formik.setFieldValue('mobileNumber', temRows[0].contactNumber)
  //         }
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, employeeData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, employeeData: [], loading: false})
  //     })
  // }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'cashAccountTypeID') {
      formik.setFieldValue('cashAccountTypeID', parseInt(value))
      if (parseInt(value) === 1) {
        formik.setFieldValue('employeeID', 0)
        formik.setFieldValue('employeeName', '')
        formik.setFieldValue('email', '')
        formik.setFieldValue('mobileNumber', '')
        setState({
          ...state,
          selEmployeeID: 0,
          selCashAccountTypeID: parseInt(value),
          selCashAccountRoleID: 0,
        })
      } else if (parseInt(value) === 2) {
        setState({...state, selOrgBankID: 0, selCashAccountTypeID: parseInt(value)})
      } else {
        setState({...state, selCashAccountTypeID: parseInt(value)})
      }
    } else if (elementId === 'organisationBankID') {
      formik.setFieldValue('organisationBankID', parseInt(value))
      setState({...state, selOrgBankID: parseInt(value)})
    } else if (elementId === 'cashAccountRoleID') {
      formik.setFieldValue('cashAccountRoleID', parseInt(value))
      setState({...state, selCashAccountRoleID: parseInt(value)})
    }
  }

  // -----------------Customer Select-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  // --------For Model Data onClick Function-------
  function selectCustomer(tmpCustomerData: IEmployeePageModel) {
    formik.setFieldValue('employeeID', tmpCustomerData.employeeID)
    formik.setFieldValue('employeeName', tmpCustomerData.firstName + ' ' + tmpCustomerData.lastName)
    formik.setFieldValue('email', tmpCustomerData.email)
    formik.setFieldValue('mobileNumber', tmpCustomerData.contactNumber)
    setState({...state, selEmployeeID: tmpCustomerData.employeeID})
    setShow(false)
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
        let temEmployeeID = 0
        let temBankID = 0
        let temRoleID = 0
        if (state.selCashAccountTypeID === 1) {
          temBankID = values.organisationBankID
        }
        if (state.selCashAccountTypeID === 2) {
          temEmployeeID = state.selEmployeeID
          temRoleID = values.cashAccountRoleID
        }
        UpdateCashAccountDetailsAPI(
          parseInt(cashAccoID),
          temEmployeeID,
          temRoleID,
          temBankID,
          values.cashAccountTypeID,
          `${values.accountBalance}`,
          isActive,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              history.push({
                pathname: '/organization/cashaccount/list',
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
      setPage(1)
    } else {
      setState({...state, employeeData: state.tmpEmployeeDataData})
      setTotal(state.tmpEmployeeDataData.length)
      setPage(1)
      setName(keyword)
    }
    setName(keyword)
  }

  return (
    <>
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          {state.loading ? (
            <Loader loading={state.loading} />
          ) : (
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
                      id='cashAccountTypeID'
                    >
                      <option selected={state.selCashAccountTypeID === 0 ? true : false} value={0}>
                        Select Account Type
                      </option>
                      <option selected={state.selCashAccountTypeID === 1 ? true : false} value={1}>
                        Bank
                      </option>
                      <option selected={state.selCashAccountTypeID === 2 ? true : false} value={2}>
                        Employee
                      </option>
                    </select>
                    {formik.touched.cashAccountTypeID && formik.errors.cashAccountTypeID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.cashAccountTypeID}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    state.selCashAccountTypeID === 0 || state.selCashAccountTypeID === 2
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
                      id='organisationBankID'
                    >
                      <option selected={state.selOrgBankID === 0 ? true : false} value={0}>
                        Select Bank
                      </option>
                      {state.bankData.length > 0 &&
                        state.bankData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.organisationBankID}
                              selected={
                                data.organisationBankID === state.selOrgBankID ? true : false
                              }
                            >
                              {data.bankName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.organisationBankID && formik.errors.organisationBankID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.organisationBankID}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    state.selCashAccountTypeID === 0 || state.selCashAccountTypeID === 1
                      ? 'd-none'
                      : 'row mb-6'
                  }
                >
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Select Employee:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg border-0 bg-white'
                      placeholder='Employee Name'
                      disabled
                      {...formik.getFieldProps('employeeName')}
                    />
                    {formik.touched.employeeName && formik.errors.employeeName && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.employeeName}</div>
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

                <div className={state.selEmployeeID === 0 ? 'd-none' : 'row mb-6'}>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Mobile Number:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg  border-0 bg-white'
                      placeholder='Mobile Number'
                      disabled
                      {...formik.getFieldProps('mobileNumber')}
                    />
                    {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.mobileNumber}</div>
                      </div>
                    )}
                  </div>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Email:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg  border-0 bg-white'
                      placeholder='Email'
                      disabled
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.email}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    state.selCashAccountTypeID === 0 || state.selCashAccountTypeID === 1
                      ? 'd-none'
                      : 'row mb-6'
                  }
                >
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Account Role:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='cashAccountRoleID'
                    >
                      <option selected={state.selCashAccountRoleID === 0 ? true : false} value={0}>
                        Select Account Role
                      </option>
                      <option selected={state.selCashAccountRoleID === 1 ? true : false} value={1}>
                        Admin
                      </option>
                      <option selected={state.selCashAccountRoleID === 2 ? true : false} value={2}>
                        Viewer
                      </option>
                    </select>
                    {formik.touched.cashAccountRoleID && formik.errors.cashAccountRoleID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.cashAccountRoleID}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    state.selCashAccountTypeID === 2 || state.selCashAccountTypeID === 0
                      ? 'd-none'
                      : 'row mb-6'
                  }
                >
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Opening Balance:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Opening Blance'
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
                    pathname: '/organization/cashaccount/list',
                    state: {search: state.mainSearch},
                  }}
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ----------------------------Customer Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Employee Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-light-primary'
                  // name='search'
                  placeholder='Search'
                  onChange={(e) => filter(e)}
                  value={name}
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
                      <span className='d-block mb-1 ps-2'>Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Mobile Number</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Email</span>
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
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary'
                          }
                          onClick={() => selectCustomer(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.firstName + ' ' + data.lastName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.email}
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
    </>
  )
}

export {EditCashAccount}
