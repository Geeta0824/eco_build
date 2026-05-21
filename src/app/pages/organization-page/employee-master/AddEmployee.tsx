import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation} from 'react-router-dom'
import {
  IEmployeePersonalModel,
  employeePersonalIniValues as initialValues,
} from '../../../models/organization-page/Employee/IEmployeeModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {getDropDownDepartmentData} from '../../../modules/master-page/department-master-page/DepartmentCRUD'
import {IDepartmentModel} from '../../../models/organization-page/IDepartmentModel'
import {IDesignationModel} from '../../../models/organization-page/IDesignationModel'
import {INationalityWebModel} from '../../../models/master-page/INationalityModel'
import {IGenderModel} from '../../../models/otherDropDowns/IGenderModel'
import {
  addEmployeeApi,
  getMultiDropdownForEmployeeApi,
} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {GetDropDownDesignationList} from '../../../modules/master-page/designation-master-page/DesignationCRUD'
import {getBloodGroupApi} from '../../../modules/otherDropDowns/BloodGroupCRUD'
import {IBloodGroupModel} from '../../../models/otherDropDowns/IBloodGroupModel'
import {getGenderApi} from '../../../modules/otherDropDowns/GenderCRUD'
import {getAllNationality} from '../../../modules/master-page/nationality-master-page/NationalityCRUD'
import {IRoleModel} from '../../../models/otherDropDowns/IRoleModel'
import {getRoleApi} from '../../../modules/otherDropDowns/RoleCRUD'
import {getBranchDropdownList} from '../../../modules/master-page/branch-master-page/BranchCRUD'
import {IBranchModel} from '../../../models/master-page/IBranchModel'
import moment from 'moment'

const profileDetailsSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  joinDate: Yup.string().required('join Date is required'),
  lastName: Yup.string().required('Last Name is required'),
  middleName: Yup.string().required('Middle Name is required'),
  contactNumber: Yup.string().required('Contact Number is required'),
  designationID: Yup.number().required('Designation is required').min(1, 'Designation is required'),
  departmentID: Yup.number().required('Department is required').min(1, 'Department is required'),
  genderID: Yup.number().required('Gender is required').min(1, 'Gender is required'),
  nationalityID: Yup.number().required('Nationality is required').min(1, 'Nationality is required'),
  //kylasID: Yup.string().required('Kylas ID is required'),
  // roleID: Yup.number().required('Role is required').min(1, 'Role is required'),
})

interface IEmployeePersonal {
  loading: boolean
  departmentData: IDepartmentModel[]
  designationData: IDesignationModel[]
  // EmergencyRelation: IRelationModel[]
  bloodGroupData: IBloodGroupModel[]
  genderData: IGenderModel[]
  nationalityData: INationalityWebModel[]
  roleData: IRoleModel[]
  branchData: IBranchModel[]
  newEmployeeID: number
  selDepartmentID: number
  selDesignationID: number
  selBloodGroupID: number
  selGenderID: number
  selNationalityID: number
  selEmergencyRelationID: number
  selRoleID: number
  selBranchID: number
  mainBranchID: number
  action: string
  mainSearch: string
}

const AddEmployee: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<IEmployeePersonalModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IEmployeePersonalModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IEmployeePersonal>({
    loading: false,
    departmentData: [] as IDepartmentModel[],
    designationData: [] as IDesignationModel[],
    // EmergencyRelation: [] as IRelationModel[],
    bloodGroupData: [] as IBloodGroupModel[],
    genderData: [] as IGenderModel[],
    nationalityData: [] as INationalityWebModel[],
    roleData: [] as IRoleModel[],
    branchData: [] as IBranchModel[],
    newEmployeeID: 0,
    selDepartmentID: 0,
    selDesignationID: 0,
    selBloodGroupID: 0,
    selGenderID: 0,
    selNationalityID: 0,
    selEmergencyRelationID: 0,
    selRoleID: 0,
    selBranchID: 0,
    mainBranchID: 0,
    action: 'Personal',
    mainSearch: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc.mainSearchID !== undefined || lc.mainSearch !== undefined) {
        mainBranchID = lc.mainBranchID
        mainSearch = lc.mainSearch
      }
      // getDepartmentData()
      getMultiDropdownForEmployeeData(mainBranchID, mainSearch)
    }, 100)
  }, [])

  // =========================Multiple Dropdown Api=========================
  function getMultiDropdownForEmployeeData(mainBranchID: number, mainSearch: string) {
    getMultiDropdownForEmployeeApi()
      .then((response) => {
        if (response.data.isSuccess === true) {
          let depmntListData = response.data.depmntList
          let genderListData = response.data.genderList
          let bloodGroupListData = response.data.blodGrList
          let nationalityListData = response.data.natltList
          let roleListData = response.data.roleList
          let branchListData = response.data.branchList
          let degnListData = response.data.degnList
          setState({
            ...state,
            departmentData: depmntListData,
            genderData: genderListData,
            bloodGroupData: bloodGroupListData,
            nationalityData: nationalityListData,
            roleData: roleListData,
            branchData: branchListData,
            designationData: degnListData,
            mainBranchID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            designationData: [],
            genderData: [],
            departmentData: [],
            bloodGroupData: [],
            nationalityData: [],
            roleData: [],
            branchData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          designationData: [],
          genderData: [],
          departmentData: [],
          bloodGroupData: [],
          nationalityData: [],
          roleData: [],
          branchData: [],
          loading: false,
        })
      })
  }

  // =================Is Active Check Box Function=============
  function checkedFunction(event: any) {
    if (event.target.id === 'isActive') {
      setIsActive(event.target.checked)
    }
  }

  // =========================Drop Down Selection Function======================
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'departmentID') {
      // getdesignationData(parseInt(value))
      formik.setFieldValue('departmentID', parseInt(value))
    } else if (elementId === 'designationID') {
      formik.setFieldValue('designationID', parseInt(value))
      setState({...state, selDesignationID: parseInt(value)})
    } else if (elementId === 'bloodGroupID') {
      formik.setFieldValue('bloodGroupID', parseInt(value))
      setState({...state, selBloodGroupID: parseInt(value)})
    } else if (elementId === 'genderID') {
      formik.setFieldValue('genderID', parseInt(value))
      setState({...state, selGenderID: parseInt(value)})
    } else if (elementId === 'nationalityID') {
      formik.setFieldValue('nationalityID', parseInt(value))
      setState({...state, selNationalityID: parseInt(value)})
    } else if (elementId === 'emergencyRelationID') {
      formik.setFieldValue('emergencyRelationID', parseInt(value))
      setState({...state, selEmergencyRelationID: parseInt(value)})
    } else if (elementId === 'roleID') {
      formik.setFieldValue('roleID', parseInt(value))
      setState({...state, selRoleID: parseInt(value)})
    } else if (elementId === 'branchID') {
      formik.setFieldValue('branchID', parseInt(value))
      setState({...state, selBranchID: parseInt(value)})
    }
  }

  // // =========================Department Api=========================
  // function getDepartmentData() {
  //   getDropDownDepartmentData()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getGenderData(responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({
  //         ...state,
  //         departmentData: [],
  //         loading: false,
  //       })
  //     })
  // }

  // // =========================Gender Api=========================
  // function getGenderData(departmentData: IDepartmentModel[]) {
  //   getGenderApi()
  //     .then((response) => {
  //       if (response.data.isSuccess === true) {
  //         let responseData = response.data.responseObject
  //         getBloodGroupData(departmentData, responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, genderData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({
  //         ...state,
  //         genderData: [],
  //         loading: false,
  //       })
  //     })
  // }

  // // =========================Blood Group Api=========================
  // function getBloodGroupData(departmentData: IDepartmentModel[], genderData: IGenderModel[]) {
  //   getBloodGroupApi()
  //     .then((response) => {
  //       if (response.data.isSuccess === true) {
  //         let responseData = response.data.responseObject
  //         getNationalityData(departmentData, genderData, responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, bloodGroupData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({
  //         ...state,
  //         bloodGroupData: [],
  //         loading: false,
  //       })
  //     })
  // }

  // // =========================Nationality Api=========================
  // function getNationalityData(
  //   departmentData: IDepartmentModel[],
  //   genderData: IGenderModel[],
  //   bloodGroupData: IBloodGroupModel[]
  // ) {
  //   getAllNationality()
  //     .then((response) => {
  //       if (response.data.isSuccess === true) {
  //         let responseData = response.data.responseObject
  //         getRoleData(departmentData, genderData, bloodGroupData, responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, nationalityData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({
  //         ...state,
  //         nationalityData: [],
  //         loading: false,
  //       })
  //     })
  // }

  // // =========================Role Api=========================
  // function getRoleData(
  //   departmentData: IDepartmentModel[],
  //   genderData: IGenderModel[],
  //   bloodGroupData: IBloodGroupModel[],
  //   nationalityData: INationalityWebModel[]
  // ) {
  //   getRoleApi()
  //     .then((response) => {
  //       if (response.data.isSuccess === true) {
  //         let responseData = response.data.responseObject
  //         getBranchData(departmentData, genderData, bloodGroupData, nationalityData, responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, roleData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, roleData: [], loading: false})
  //     })
  // }

  // // =====================Branch Api==========================
  // function getBranchData(
  //   departmentData: IDepartmentModel[],
  //   genderData: IGenderModel[],
  //   bloodGroupData: IBloodGroupModel[],
  //   nationalityData: INationalityWebModel[],
  //   roleData: IRoleModel[]
  // ) {
  //   getBranchDropdownList()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getdesignationData(
  //           departmentData,
  //           genderData,
  //           bloodGroupData,
  //           nationalityData,
  //           roleData,
  //           responseData
  //         )
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, branchData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       setState({...state, branchData: [], loading: false})
  //       toast.error(`${error}`)
  //     })
  // }

  // // =========================Designation Api=========================
  // function getdesignationData(
  //   departmentData: IDepartmentModel[],
  //   genderData: IGenderModel[],
  //   bloodGroupData: IBloodGroupModel[],
  //   nationalityData: INationalityWebModel[],
  //   roleData: IRoleModel[],
  //   branchData: IBranchModel[]
  // ) {
  //   GetDropDownDesignationList()
  //     .then((response) => {
  //       if (response.data.isSuccess === true) {
  //         let responseData = response.data.responseObject
  //         setState({
  //           ...state,
  //           departmentData: departmentData,
  //           genderData: genderData,
  //           bloodGroupData: bloodGroupData,
  //           nationalityData: nationalityData,
  //           roleData: roleData,
  //           branchData: branchData,
  //           designationData: responseData,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, designationData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({
  //         ...state,
  //         designationData: [],
  //         loading: false,
  //       })
  //     })
  // }

  // =========================Add Employee Personal Api=========================
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IEmployeePersonalModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let birthDate: any
        let anniversaryDate: any
        let joinDate: any
        if (values.birthDate === '') {
          birthDate = null
        } else {
          birthDate = values.birthDate
        }
        if (values.anniversaryDate === '') {
          anniversaryDate = null
        } else {
          anniversaryDate = values.anniversaryDate
        }
        if (values.joinDate === '') {
          joinDate = null
        } else {
          joinDate = values.joinDate
        }
        const Edit = window.confirm('Are you sure you want to create ?')
        if (Edit) {
          if (state.action === 'Personal') {
            if (state.newEmployeeID === 0) {
              addEmployeeApi(
                values.branchID,
                values.departmentID,
                values.designationID,
                values.firstName,
                values.middleName,
                values.lastName,
                values.email,
                values.contactNumber,
                values.bloodGroupID,
                values.genderID,
                birthDate,
                values.nationalityID,
                values.roleID,
                anniversaryDate,
                joinDate,
                isActive,
                user.employeeID,
                values.kylasID,
                '192.168.1.1'
              )
                .then((response) => {
                  toast.success('Created Successfull!')
                  // localStorage.setItem('editEmpID', response.data.employeeID)
                  // localStorage.setItem('newEmployeeID', response.data.employeeID)
                  history.push({
                    pathname: `/organization/employee/edit/${response.data.employeeID}/personal`,
                    state: {
                      empName: values.firstName + ' ' + values.lastName,
                      mainBranchID: state.mainBranchID,
                      mainSearch: state.mainSearch,
                      
                    },
                  })
                  setLoading(false)
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
    if (state.newEmployeeID === 0) {
    } else {
      setState({
        ...state,
        action: action,
      })
    }
  }

  return (
    <React.Fragment>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({pathname:'/organization/employee/list',state:{branchId:state.mainBranchID,search:state.mainSearch}})
          }}
        >
          Back To List
        </span>
      </div>
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
                    (state.action === 'Organization' && 'active')
                  }
                  onClick={() => setAction('Organization')}
                >
                  Organization
                </div>
              </li> */}
              <li className='nav-item'>
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
                    (state.action === 'Education' && 'active')
                  }
                  onClick={() => setAction('Education')}
                >
                  Education Details
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
                  Document Details
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------------start Personal tabs--------------------------- */}

      <div className={state.action === 'Personal' ? 'row g-5 g-xxl-8' : 'd-none'}>
        {state.loading === true ? (
          <div className='text-center mt-5 pt-5'>
            <div className='spinner-border' style={{width: '3rem', height: '3rem'}} role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
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
                            Department:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <select
                              className='form-select bg-light-primary'
                              aria-label='Default select example'
                              onChange={selectChange}
                              id='departmentID'
                            >
                              <option
                                selected={state.selDepartmentID === 0 ? true : false}
                                value='0'
                              >
                                Select Department
                              </option>
                              {state.departmentData.length > 0 &&
                                state.departmentData.map((data, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={data.departmentID}
                                      selected={
                                        state.selDepartmentID === data.departmentID ? true : false
                                      }
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
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Designation:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <select
                              className='form-select bg-light-primary'
                              aria-label='Default select example'
                              onChange={selectChange}
                              id='designationID'
                            >
                              <option
                                selected={state.selDesignationID === 0 ? true : false}
                                value={0}
                              >
                                Select Designation
                              </option>
                              {state.designationData.length > 0 &&
                                state.designationData.map((data, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={data.designationID}
                                      selected={
                                        state.selDesignationID === data.designationID ? true : false
                                      }
                                    >
                                      {data.designationName}
                                    </option>
                                  )
                                })}
                            </select>
                            {formik.touched.designationID && formik.errors.designationID && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.designationID}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Branch:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <select
                              className='form-select bg-light-primary'
                              aria-label='Default select example'
                              onChange={selectChange}
                              id='branchID'
                            >
                              <option selected={state.selBranchID === 0 ? true : false} value={0}>
                                Select Branch
                              </option>
                              {state.branchData.length > 0 &&
                                state.branchData.map((data, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={data.branchID}
                                      selected={state.selBranchID === data.branchID ? true : false}
                                    >
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
                          {/* <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Role :
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
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
                                    <option key={index} value={data.roleID}>
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
                          </div> */}
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            First Name:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
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
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Middle Name:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
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
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Last Name:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
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
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Contact Number:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Contact Number'
                              {...formik.getFieldProps('contactNumber')}
                            />
                            {formik.touched.contactNumber && formik.errors.contactNumber && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.contactNumber}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>
                            Email:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
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
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Nationality :
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <select
                              className='form-select bg-light-primary'
                              aria-label='Default select example'
                              onChange={selectChange}
                              id='nationalityID'
                            >
                              <option
                                selected={state.selNationalityID === 0 ? true : false}
                                value={0}
                              >
                                Select Nationality
                              </option>
                              {state.nationalityData.length > 0 &&
                                state.nationalityData.map((data, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={data.nationalityID}
                                      selected={
                                        state.selNationalityID === data.nationalityID ? true : false
                                      }
                                    >
                                      {data.nationalityName}
                                    </option>
                                  )
                                })}
                            </select>
                            {formik.touched.nationalityID && formik.errors.nationalityID && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.nationalityID}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>
                            Blood Group :
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <select
                              className='form-select bg-light-primary'
                              aria-label='Default select example'
                              onChange={selectChange}
                              id='bloodGroupID'
                            >
                              <option
                                selected={state.selBloodGroupID === 0 ? true : false}
                                value={0}
                              >
                                Select Blood Group
                              </option>
                              {state.bloodGroupData.length > 0 &&
                                state.bloodGroupData.map((data, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={data.bloodGroupID}
                                      selected={
                                        state.selBloodGroupID === data.bloodGroupID ? true : false
                                      }
                                    >
                                      {data.bloodGroupName}
                                    </option>
                                  )
                                })}
                            </select>
                            {formik.touched.bloodGroupID && formik.errors.bloodGroupID && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.bloodGroupID}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                            Gender :
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <select
                              className='form-select bg-light-primary'
                              aria-label='Default select example'
                              onChange={selectChange}
                              id='genderID'
                            >
                              <option selected={state.selGenderID === 0 ? true : false} value={0}>
                                Select Gender
                              </option>
                              {state.genderData.length > 0 &&
                                state.genderData.map((data, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={data.genderID}
                                      selected={state.selGenderID === data.genderID ? true : false}
                                    >
                                      {data.genderName}
                                    </option>
                                  )
                                })}
                            </select>
                            {formik.touched.genderID && formik.errors.genderID && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.genderID}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>
                            Birth Date:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <input
                              type='date'
                              max={moment(new Date()).format('YYYY-MM-DD')}
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Birth Date'
                              {...formik.getFieldProps('birthDate')}
                            />
                            {formik.touched.birthDate && formik.errors.birthDate && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.birthDate}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>
                            Anniversary Date:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <input
                              type='date'
                              max={moment(new Date()).format('YYYY-MM-DD')}
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Anniversary Date'
                              {...formik.getFieldProps('anniversaryDate')}
                            />
                            {formik.touched.anniversaryDate && formik.errors.anniversaryDate && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.anniversaryDate}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6 required'>
                            Join Date:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <input
                              type='date'
                              max={moment(new Date()).format('YYYY-MM-DD')}
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='Join Date'
                              {...formik.getFieldProps('joinDate')}
                            />
                            {formik.touched.joinDate && formik.errors.joinDate && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.joinDate}</div>
                              </div>
                            )}
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>
                            <span className=''>isActive:</span>
                          </label>
                          <div className='col-lg-4 fv-row mt-4'>
                            <div className='form-check form-switch'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                id='isActive'
                                onChange={(e) => checkedFunction(e)}
                              />
                            </div>
                          </div>
                          <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>
                            Kylas ID:
                          </label>
                          <div className='col-lg-4 fv-row mb-6'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              placeholder='KylasID'
                              {...formik.getFieldProps('kylasID')}
                            />
                            {formik.touched.kylasID && formik.errors.kylasID && (
                              <div className='fv-plugins-message-container text-danger'>
                                <div className='fv-help-block'>{formik.errors.kylasID}</div>
                              </div>
                            )}
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
                        <span
                          className={
                            state.newEmployeeID === 0
                              ? 'btn btn-primary disabled'
                              : 'btn btn-primary'
                          }
                        >
                          {/* {!loading && 'Save'}
                      {state.newEmployeeID === 0  && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                          Please wait...{' '}
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )} */}
                          Next
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---------------------end Personal tabs--------------------------- */}
    </React.Fragment>
  )
}

export {AddEmployee}
