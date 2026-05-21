import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import Select from 'react-select'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IRoleModel} from '../../../models/otherDropDowns/IRoleModel'
import {IDepartmentModel} from '../../../models/organization-page/IDepartmentModel'
import Loader from '../../common-pages/Loader'
import {getDropDownDepartmentData} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import {getRoleApi} from '../../../modules/otherDropDowns/RoleCRUD'
import {
  IUserModel,
  userInitValues as initialValues,
} from '../../../models/organization-page/user/IUserModel'
import {IEmployeeSearchDDModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {
  editUser,
  getUserByUserID,
} from '../../../modules/organization-page/user-master-page/UserCRUD'

const profileDetailsSchema = Yup.object().shape({
  employeeID: Yup.number()
    .required('Employee Name is required')
    .min(1, 'Employee Name is required'),
  // departmentID: Yup.number()
  //   .required('Department Name is required')
  //   .min(1, 'Department Name is Required'),
  roleID: Yup.number().required('Role is required').min(1, 'Role is Required'),
})

interface IUser {
  loading: boolean
  employeeData: IEmployeeSearchDDModel[]
  tmpEmployeeData: IEmployeeSearchDDModel[]
  departmentData: IDepartmentModel[]
  roleData: IRoleModel[]
  selEmployeeID: number
  selEmpID: number
  selDepID: number
  selRoleID: number
  mainSearch: string
}

const EditUser: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IUserModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const {userid} = useParams<{userid: string}>()
  const [selectedOptionEmployee, setSelectedOptionEmployee] = useState<number>(-1)
  const [isClearableEmployee, setIsClearableEmployee] = useState(true)
  const [isSearchableEmployee, setIsSearchableEmployee] = useState(true)
  const updateData = (fieldsToUpdate: Partial<IUserModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()

  const [state, setState] = useState<IUser>({
    loading: false,
    employeeData: [] as IEmployeeSearchDDModel[],
    tmpEmployeeData: [] as IEmployeeSearchDDModel[],
    departmentData: [] as IDepartmentModel[],
    roleData: [] as IRoleModel[],
    selEmployeeID: 0,
    selEmpID: 0,
    selDepID: 0,
    selRoleID: 0,
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
      getDepartmentData(mainSearch)
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  function getAllUserDataByUserID(
    departmentData: IDepartmentModel[],
    roleData: IRoleModel[],
    temEmpData: IEmployeeSearchDDModel[],
    mainSearch: string
  ) {
    getUserByUserID(parseInt(userid))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('departmentID', response.data.departmentID)
          formik.setFieldValue('departmentName', response.data.departmentName)
          formik.setFieldValue('employeeID', response.data.employeeID)
          formik.setFieldValue('employeeName', response.data.employeeName)
          formik.setFieldValue('roleID', response.data.roleID)
          formik.setFieldValue('roleName', response.data.roleName)
          setIsActive(response.data.isActive)
          setState({
            ...state,
            departmentData: departmentData,
            roleData: roleData,
            employeeData: temEmpData,
            mainSearch: mainSearch,
            selDepID: response.data.departmentID,
            selEmpID: response.data.employeeID,
            selRoleID: response.data.roleID,
            loading: false,
            selEmployeeID: response.data.employeeID,
          })
          formik.setFieldValue('employeeID', response.data.employeeID)
          const interest = temEmpData
          const previously_selected_interests = interest.map((data, index) => ({
            _id: index,
            value: data.value,
            label: data.label,
            mobileNumber: data.mobileNumber,
          }))
          //  console.log(previously_selected_interests)
          const Rows = previously_selected_interests
          for (let key in Rows) {
            if (Rows[key].value === response.data.employeeID) {
              setSelectedOptionEmployee(Rows[key]._id)
            }
          }
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }
  // =========================Department Api=========================
  function getDepartmentData(mainSearch: string) {
    getDropDownDepartmentData()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          getRoleData(responseData, mainSearch)
        } else {
          toast.error(`${resp.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          departmentData: [],
          loading: false,
        })
      })
  }

  // =========================Role Api=========================
  function getRoleData(departmentData: IDepartmentModel[], mainSearch: string) {
    getRoleApi()
      .then((response) => {
        if (response.data.isSuccess === true) {
          let responseData = response.data.responseObject
          getAllEmployeeSearchDropdownData(departmentData, responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, departmentData: [], roleData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, departmentData: [], roleData: [], loading: false})
      })
  }

  function getAllEmployeeSearchDropdownData(
    departmentData: IDepartmentModel[],
    roleData: IRoleModel[],
    mainSearch: string
  ) {
    getEmployeeSearchDropDown()
      .then((response) => {
        const responseData = response.data
        getAllUserDataByUserID(departmentData, roleData, responseData, mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          departmentData: [],
          roleData: [],
          employeeData: [],
          loading: false,
        })
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'departmentID') {
      formik.setFieldValue('departmentID', parseInt(value))
    } else if (elementId === 'roleID') {
      formik.setFieldValue('roleID', parseInt(value))
    }
  }

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
  const formik = useFormik<IUserModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        editUser(
          parseInt(userid),
          values.employeeID,
          values.departmentID,
          values.roleID,
          isActive,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Updated Successfull!')
              history.push({pathname: '/organization/user/list', state: {search: state.mainSearch}})
            } else {
              toast.error(`${response.data.message}`)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
          })
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row'>
                <label className='col-lg-3 col-sm-6 col-form-label required fw-bold fs-6 mb-6'>
                  Select Employee:
                </label>
                <div className='col-lg-4 col-sm-6 fv-row'>
                  <Select
                    className='basic-single'
                    classNamePrefix='select'
                    isClearable={isClearableEmployee}
                    isSearchable={isSearchableEmployee}
                    value={state.employeeData[selectedOptionEmployee]}
                    isDisabled
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
              {/* <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Department:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='departmentID'
                  >
                    <option selected value='0'>
                      Select Department
                    </option>
                    {state.departmentData.length > 0 &&
                      state.departmentData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.departmentID}
                            selected={data.departmentID === state.selDepID ? true : false}
                          >
                            {data.departmentName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.departmentID && formik.errors.departmentID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.departmentID}</div>
                    </div>
                  )}
                </div>
                </div> */}
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Role :
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='roleID'
                  >
                    <option selected value='0'>
                      Select Role
                    </option>
                    {state.roleData.length > 0 &&
                      state.roleData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.roleID}
                            selected={data.roleID === state.selRoleID ? true : false}
                          >
                            {data.roleName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.roleID && formik.errors.roleID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.roleID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-4'
                      type='checkbox'
                      id='Checked'
                      checked={isActive}
                      onChange={(e) => checkedFunction(e)}
                    />
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
              </button>
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/organization/user/list', state: {search: state.mainSearch}}}
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

export {EditUser}
