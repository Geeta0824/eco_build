import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {Pagination} from 'antd'
import {Button, Modal} from 'react-bootstrap-v5'
import {
  ICustomerPageModel,
  customerInitValues as initialValues,
} from '../../../models/organization-page/customer/ICustomenrModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {addCustomerApi} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import Loader from '../../common-pages/Loader'
import {getBranchDropdownList} from '../../../modules/master-page/branch-master-page/BranchCRUD'
import {IBranchModel} from '../../../models/master-page/IBranchModel'
import {ITerminalTypeWebModel} from '../../../models/master-page/ITerminalTypeModel'
import {getTerminalTypeDropdownList} from '../../../modules/master-page/terminal-type-page/TerminalTypeCRUD'
import {KTSVG} from '../../../../_Ecd/helpers'
import {getAllEmployeeList} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {IEmployeePageModel} from '../../../models/organization-page/Employee/IEmployeeModel'

const profileDetailsSchema = Yup.object().shape({
  branchID: Yup.number().required('Branch is required').min(1, 'Branch is required'),
  // terminalTypeID: Yup.number()
  //   .required('Terminal Type is required')
  //   .min(1, 'Terminal Type is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  //middleName: Yup.string().required('Middle Name is required'),
  //mobileNumber: Yup.string().required('Mobile Number is required'),
  // terminalCode: Yup.string().required('Terminal Code is required'),
})

interface ICustomerPersonal {
  loading: boolean
  newCustomerID: number
  branchData: IBranchModel[]
  // terminalTypeData: ITerminalTypeWebModel[]
  employeeData: IEmployeePageModel[]
  tmpEmployeeData: IEmployeePageModel[]
  action: string
  mainSearch: string
  selEmployeeID: number
  mainBranchID: number
  selBranchID: number
  selLeadOwnerID: number
}

const AddCustomer: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<ICustomerPageModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICustomerPageModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ICustomerPersonal>({
    loading: false,
    newCustomerID: 0,
    branchData: [] as IBranchModel[],
    // terminalTypeData: [] as ITerminalTypeWebModel[],
    employeeData: [] as IEmployeePageModel[],
    tmpEmployeeData: [] as IEmployeePageModel[],
    action: 'Personal',
    mainSearch: '',
    selEmployeeID: 0,
    mainBranchID: 0,
    selBranchID: 0,
    selLeadOwnerID: 0,
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc.mainBranchID == undefined || lc.mainSearch !== undefined) {
        mainBranchID = lc.mainBranchID
        mainSearch = lc.mainSearch
      }
      getBranchData(mainBranchID, mainSearch)
    }, 100)
  }, [])

  // =====================Branch Api==========================
  function getBranchData(mainBranchID: number, mainSearch: string) {
    getBranchDropdownList()
      .then((response) => {
        // let responseData = response.data.responseObject
        // if (response.data.isSuccess === true) {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          setState({
            ...state,
            branchData: responseData,
            mainBranchID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${resp.message}`)
          setState({...state, branchData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, branchData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getAllEmployeeData() {
    getAllEmployeeList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            employeeData: responseData,
            tmpEmployeeData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, employeeData: [], loading: false})
        }
        setTotal(responseData.length)
        setPage(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeData: [], loading: false})
      })
  }

  // -----------------Customer Select-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
    getAllEmployeeData()
  }

  // --------For Model Data onClick Function-------
  function selectEmployee(tmpemployeeData: IEmployeePageModel) {
    formik.setFieldValue('employeeID', tmpemployeeData.employeeID)
    formik.setFieldValue('employeeName', tmpemployeeData.firstName + ' ' + tmpemployeeData.lastName)
    formik.setFieldValue('email', tmpemployeeData.email)
    formik.setFieldValue('leadOwnerID', tmpemployeeData.firstName + ' ' + tmpemployeeData.lastName)
    formik.setFieldValue('contactNumber', tmpemployeeData.contactNumber)
    setState({
      ...state,
      selEmployeeID: tmpemployeeData.employeeID,
      selLeadOwnerID: tmpemployeeData.kylasID,
    })
    setShow(false)
  }

  // // =====================Terminal Type Api==========================
  // function getTerminalTypeData(branchData: IBranchModel[]) {
  //   getTerminalTypeDropdownList()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         setState({
  //           ...state,
  //           branchData: branchData,
  //           terminalTypeData: responseData,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, terminalTypeData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       setState({...state, terminalTypeData: [], loading: false})
  //       toast.error(`${error}`)
  //     })
  // }

  // =====================Is Active Check Box Function==========================
  function checkedFunction(event: any) {
    if (event.target.id === 'isActive') {
      setIsActive(event.target.checked)
    }
  }

  // =====================Drop Down Selection Function==========================
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'branchID') {
      formik.setFieldValue('branchID', parseInt(value))
      // getBranchData(parseInt(value), state.mainSearch)
    }
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpEmployeeData.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.kylasID.toString().includes(keyword.toString()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, employeeData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, employeeData: state.tmpEmployeeData})
      // If the text field is empty, show all users
      setTotal(state.tmpEmployeeData.length)
      setPage(1)
    }
    setName(keyword)
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
  // =====================Add Customer Personal Api==========================
  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICustomerPageModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to create ?')
        if (Edit) {
          if (state.action === 'Personal') {
            if (state.newCustomerID === 0) {
              addCustomerApi(
                // values.terminalTypeID,
                0,
                values.branchID,
                // values.terminalCode,
                '',
                values.firstName,
                values.middleName,
                values.lastName,
                values.email,
                values.mobileNumber,
                values.alternateMobNumber,
                values.phoneNumber,
                values.crmid,
                isActive,
                state.selLeadOwnerID,
                user.employeeID,
                '192.168.1.1'
              )
                .then((response) => {
                  if (response.data.isSuccess === true) {
                    toast.success('Created Successfull!')
                    // localStorage.setItem('editCustomerID', response.data.customerID)
                    // localStorage.setItem('newCustomerID', response.data.customerID)
                    history.push({
                      pathname: `/organization/customer/edit/${response.data.customerID}/personal`,
                      state: {
                        custName: values.firstName + ' ' + values.lastName,
                        mainBranchID: state.mainBranchID,
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
            }
          }
        } else {
          return setLoading(false)
        }
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  function setAction(action: string) {
    if (state.newCustomerID === 0) {
    } else {
      setState({
        ...state,
        action: action,
      })
    }
  }

  return (
    <React.Fragment>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-body pt-2 pb-1'>
          <div className='d-flex overflow-auto h-55px'>
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` +
                    (state.action === 'Personal' && 'active')
                  }
                  onClick={() => setAction('Personal')}
                >
                  Personal
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` +
                    (state.action === `Address` && 'active')
                  }
                  onClick={() => setAction(`Address`)}
                >
                  Address
                </div>
              </li>
              {/* <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` +
                    (state.action === 'Bank' && 'active')
                  }
                  onClick={() => setAction('Bank')}
                >
                  Bank Details
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` +
                    (state.action === 'Document' && 'active')
                  }
                  onClick={() => setAction('Document')}
                >
                  KYC Document Details
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` +
                    (state.action === 'Education' && 'active')
                  }
                  onClick={() => setAction('Education')}
                >
                  Terminal Details
                </div>
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------------start Personal tabs--------------------------- */}

      <div className={state.action === 'Personal' ? 'row g-5 g-xxl-8' : 'd-none'}>
        {state.loading === true ? (
          <Loader loading={state.loading} />
        ) : (
          <>
            <div className='col-xl-12'>
              <div className='card mb-5 mb-xxl-8'>
                {/* Personal */}
                <div className='d-flex flex-column-fluid py-5 mt-3'>
                  <div className='container'>
                    <form onSubmit={formik.handleSubmit} noValidate className='form' id='personal'>
                      <div className='card-body p-9'>
                        <div className='row mb-6'>
                          <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                            First Name:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='First Name'
                              {...formik.getFieldProps('firstName')}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.firstName}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                            Middle Name:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Middle Name'
                              {...formik.getFieldProps('middleName')}
                            />
                            {formik.touched.middleName && formik.errors.middleName && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.middleName}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='row mb-6'>
                          <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                            Last Name:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Last Name'
                              {...formik.getFieldProps('lastName')}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.lastName}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                            Branch:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <select
                              className='form-select bg-light-primary'
                              aria-label='Default select example'
                              onChange={selectChange}
                              id='branchID'
                            >
                              <option selected value='0'>
                                Select Branch
                              </option>
                              {state.branchData.length > 0 &&
                                state.branchData.map((data, index) => {
                                  return (
                                    <option key={index} value={data.branchID}>
                                      {data.branchName}
                                    </option>
                                  )
                                })}
                            </select>
                            {formik.touched.branchID && formik.errors.branchID && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.branchID}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='row mb-6'>
                          <label className='col-lg-2 col-form-label fw-bold fs-6'>Email:</label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Email'
                              {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.email}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                            Mobile Number:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Mobile Number'
                              {...formik.getFieldProps('mobileNumber')}
                            />
                            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.mobileNumber}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='row mb-6'>
                          <label className='col-lg-2 col-form-label fw-bold fs-6'>
                            Phone Number:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Phone Number'
                              {...formik.getFieldProps('phoneNumber')}
                            />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.phoneNumber}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6'>
                            GST Number:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Alternate Mobile Number'
                              {...formik.getFieldProps('alternateMobNumber')}
                            />
                            {formik.touched.alternateMobNumber && formik.errors.alternateMobNumber && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>
                                  {formik.errors.alternateMobNumber}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='row mb-6'>
                          <label className='col-lg-2 col-form-label fw-bold fs-6'>CRM ID:</label>
                          <div className='col-lg-3 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder=''
                              {...formik.getFieldProps('crmid')}
                            />
                            {formik.touched.crmid && formik.errors.crmid && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.crmid}</div>
                              </div>
                            )}
                          </div>
                          {/* </div>
                        <div className='row mb-6'> */}
                          <label className='col-lg-2 col-form-label fw-bold fs-6'>
                            Lead Owner:
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg border-0 bg-white'
                              placeholder='Lead Owner ID'
                              disabled
                              {...formik.getFieldProps('leadOwnerID')}
                            />
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

                        <div className='row mb-6'>
                          <label className='col-lg-2 col-form-label fw-bold fs-6'>
                            <span className=''>isActive:</span>
                          </label>
                          <div className='col-lg-4 fv-row'>
                            <div className='form-check form-switch'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                id='isActive'
                                onChange={(e) => checkedFunction(e)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='card-footer d-flex justify-content-end py-6 px-9'>
                        <button type='submit' className='btn btn-primary me-4' disabled={loading}>
                          {!loading && 'Save'}
                          {loading && (
                            <span className='indicator-progress' style={{display: 'block'}}>
                              Please wait...{' '}
                              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                          )}
                        </button>
                        <Link
                          className='btn btn-danger me-3'
                          to={{
                            pathname: '/organization/customer/list',
                            state: {BranchID: state.mainBranchID, search: state.mainSearch},
                          }}
                        >
                          Cancel
                        </Link>
                        {/* <span
                          className={
                            state.newCustomerID === 0
                              ? 'btn btn-primary disabled'
                              : 'btn btn-primary'
                          }
                        >
                          {!loading && 'Save'}
                      {state.newCustomerID === 0  && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                          Please wait...{' '}
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                          Next
                        </span> */}
                      </div>
                    </form>
                  </div>
                </div>
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
                            <span className='d-block mb-1 ps-2'>Employee Name</span>
                          </th>
                          <th className='min-w-150px'>
                            <span className='d-block mb-1'>Contact Number</span>
                          </th>
                          <th className='min-w-150px'>
                            <span className='d-block mb-1'>Email</span>
                          </th>
                          <th className='min-w-150px'>
                            <span className='d-block mb-1'>KylasID</span>
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
                                onClick={() => selectEmployee(data)}
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
                                <td className=''>
                                  <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                    {data.kylasID}
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
        )}
      </div>

      {/* ---------------------end Personal tabs--------------------------- */}
    </React.Fragment>
  )
}

export {AddCustomer}
