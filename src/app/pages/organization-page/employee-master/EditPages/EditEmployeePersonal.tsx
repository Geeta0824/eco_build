import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {
  IEmployeeWebModel,
  employeeIniValues as initialValues,
  IEmployeePersonalModel,
} from '../../../../models/organization-page/Employee/IEmployeeModel'
import {useEffect, useState} from 'react'
import {getAllDepartmentData} from '../../../../modules/master-page/department-master-page/DepartmentCRUD'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {useSelector, shallowEqual} from 'react-redux'
import {RootState} from '../../../../../setup'
import {IDepartmentModel} from '../../../../models/organization-page/IDepartmentModel'
import {IDesignationModel} from '../../../../models/organization-page/IDesignationModel'
import {IBloodGroupModel} from '../../../../models/otherDropDowns/IBloodGroupModel'
import {INationalityWebModel} from '../../../../models/master-page/INationalityModel'
import {IGenderModel} from '../../../../models/otherDropDowns/IGenderModel'
import {IRoleModel} from '../../../../models/otherDropDowns/IRoleModel'
import {
  UpdateEmployeePersonalDetails,
  employeePersonalApi,
  getMultiDropdownForEmployeeApi,
} from '../../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {getRoleApi} from '../../../../modules/otherDropDowns/RoleCRUD'
import {getGenderApi} from '../../../../modules/otherDropDowns/GenderCRUD'
import {getBloodGroupApi} from '../../../../modules/otherDropDowns/BloodGroupCRUD'
import {getAllNationality} from '../../../../modules/master-page/nationality-master-page/NationalityCRUD'
import {GetDropDownDesignationList} from '../../../../modules/master-page/designation-master-page/DesignationCRUD'
import {toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {IBranchModel} from '../../../../models/master-page/IBranchModel'
import {getBranchDropdownList} from '../../../../modules/master-page/branch-master-page/BranchCRUD'
import moment from 'moment'

const profileDetailsSchema = Yup.object().shape({
  firstName: Yup.string().required('Employee First Name is required'),
  joinDate: Yup.string().required('join Date is required'),
  lastName: Yup.string().required('Employee Last Name is required'),
  middleName: Yup.string().required('Employee Middle Name is required'),
  contactNumber: Yup.string().required('Contact Number is required'),
  designationID: Yup.number().required('Designation is required').min(1, 'Designation is required'),
  departmentID: Yup.number().required('Department is required').min(1, 'Department is required'),
  genderID: Yup.number().required('Gender is required').min(1, 'Gender is required'),
  nationalityID: Yup.number().required('Nationality is required').min(1, 'Nationality is required'),
  //kylasID: Yup.string().required('KylasID is required'),
  // roleID: Yup.number().required('Employee Role is required').min(1, 'Employee Role is required'),
  branchID: Yup.number().required('Branch is required').min(1, 'Branch is required'),
})

interface IEmployeePersonal {
  loading: boolean
  employeeData: IEmployeePersonalModel
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
  selRoleID: number
  selBranchID: number
  selBloodGroupID: number
  selGenderID: number
  selNationalityID: number
  selEmergencyRelationID: number
  mainBranchID: number
  mainSearch: string
}

const EditEmployeePersonal: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const {employeeID} = useParams<{employeeID: string}>()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<IEmployeeWebModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IEmployeeWebModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IEmployeePersonal>({
    loading: false,
    employeeData: {} as IEmployeePersonalModel,
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
    selRoleID: 0,
    selBranchID: 0,
    selBloodGroupID: 0,
    selGenderID: 0,
    selNationalityID: 0,
    selEmergencyRelationID: 0,
    mainBranchID: 0,
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
      if (lc.mainBranchID !== undefined || lc.mainSearch !== undefined) {
        mainBranchID = lc.mainBranchID
        mainSearch = lc.mainSearch
      }
      getEmployeeDataByemployeeID(mainBranchID, mainSearch)
    }, 100)
  }, [])

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

  // =================Is Active Check Box Function=============
  function checkedFunction(event: any) {
    if (event.target.id === 'isActive') {
      setIsActive(event.target.checked)
    }
  }

  // =========================Multiple Dropdown Api=========================
  function getMultiDropdownForEmployeeData(
    employeeData: IEmployeePersonalModel,
    selDepartmentID: number,
    mainBranchID: number,
    mainSearch: string
  ) {
    getMultiDropdownForEmployeeApi()
      .then((response) => {
        if (response.data.isSuccess === true) {
          let depmntListData = response.data.depmntList
          let genderListData = response.data.genderList
          let bloodGroupListData = response.data.blodGrList
          let nationalityListData = response.data.natltList
          let roleListData = response.data.roleList
          let branchListData = response.data.branchList
          let designationListData = response.data.degnList
          setState({
            ...state,
            loading: false,
            departmentData: depmntListData,
            roleData: roleListData,
            genderData: genderListData,
            bloodGroupData: bloodGroupListData,
            nationalityData: nationalityListData,
            employeeData: employeeData,
            designationData: designationListData,
            branchData: branchListData,
            newEmployeeID: parseInt(employeeID),
            selDepartmentID: selDepartmentID,
            selDesignationID: employeeData.designationID,
            selRoleID: employeeData.roleID,
            selBranchID: employeeData.branchID,
            selBloodGroupID: employeeData.bloodGroupID,
            selGenderID: employeeData.genderID,
            selNationalityID: employeeData.nationalityID,
            mainBranchID,
            mainSearch,
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
  // // =========================Department Api=========================
  // function getDepartmentData(employeeData: IEmployeePersonalModel, selDepartmentID: number) {
  //   getAllDepartmentData()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getRoleData(employeeData, responseData, selDepartmentID)
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

  // // =========================Role Api=========================
  // function getRoleData(
  //   employeeData: IEmployeePersonalModel,
  //   departmentData: IDepartmentModel[],
  //   selDepartmentID: number
  // ) {
  //   getRoleApi()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getGenderData(employeeData, departmentData, responseData, selDepartmentID)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({
  //         ...state,
  //         roleData: [],
  //         loading: false,
  //       })
  //     })
  // }

  // // =========================Gender Api=========================
  // function getGenderData(
  //   employeeData: IEmployeePersonalModel,
  //   departmentData: IDepartmentModel[],
  //   roleData: IRoleModel[],
  //   selDepartmentID: number
  // ) {
  //   getGenderApi()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getBloodGroupData(employeeData, departmentData, roleData, responseData, selDepartmentID)
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
  // function getBloodGroupData(
  //   employeeData: IEmployeePersonalModel,
  //   departmentData: IDepartmentModel[],
  //   roleData: IRoleModel[],
  //   genderData: IGenderModel[],
  //   selDepartmentID: number
  // ) {
  //   getBloodGroupApi()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getNationalityData(
  //         employeeData,
  //         departmentData,
  //         roleData,
  //         genderData,
  //         responseData,
  //         selDepartmentID
  //       )
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
  //   employeeData: IEmployeePersonalModel,
  //   departmentData: IDepartmentModel[],
  //   roleData: IRoleModel[],
  //   genderData: IGenderModel[],
  //   bloodGroupData: IBloodGroupModel[],
  //   selDepartmentID: number
  // ) {
  //   getAllNationality()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getDesignationByDepartmentIdData(
  //         employeeData,
  //         departmentData,
  //         roleData,
  //         genderData,
  //         bloodGroupData,
  //         responseData,
  //         selDepartmentID
  //       )
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

  // // =========================Designation By Department ID Api=========================
  // function getDesignationByDepartmentIdData(
  //   employeeData: IEmployeePersonalModel,
  //   departmentData: IDepartmentModel[],
  //   roleData: IRoleModel[],
  //   genderData: IGenderModel[],
  //   bloodGroupData: IBloodGroupModel[],
  //   nationalityData: INationalityWebModel[],
  //   selDepartmentID: number
  // ) {
  //   GetDropDownDesignationList()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getBranchData(
  //         employeeData,
  //         departmentData,
  //         roleData,
  //         genderData,
  //         bloodGroupData,
  //         nationalityData,
  //         responseData,
  //         selDepartmentID
  //       )
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

  // // =====================Branch Api==========================
  // function getBranchData(
  //   employeeData: IEmployeePersonalModel,
  //   departmentData: IDepartmentModel[],
  //   roleData: IRoleModel[],
  //   genderData: IGenderModel[],
  //   bloodGroupData: IBloodGroupModel[],
  //   nationalityData: INationalityWebModel[],
  //   designationData: IDesignationModel[],
  //   selDepartmentID: number
  // ) {
  //   getBranchDropdownList()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         setState({
  //           ...state,
  //           loading: false,
  //           departmentData: departmentData,
  //           roleData: roleData,
  //           genderData: genderData,
  //           bloodGroupData: bloodGroupData,
  //           nationalityData: nationalityData,
  //           employeeData: employeeData,
  //           designationData: designationData,
  //           branchData: responseData,
  //           newEmployeeID: parseInt(employeeID),
  //           selDepartmentID: selDepartmentID,
  //           selDesignationID: employeeData.designationID,
  //           selRoleID: employeeData.roleID,
  //           selBranchID: employeeData.branchID,
  //           selBloodGroupID: employeeData.bloodGroupID,
  //           selGenderID: employeeData.genderID,
  //           selNationalityID: employeeData.nationalityID,
  //         })
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

  // =========================Employee By Employee ID Api=========================
  function getEmployeeDataByemployeeID(mainBranchID: number, mainSearch: string) {
    employeePersonalApi(parseInt(employeeID))
      .then((response) => {
        let resultData = response.data
        // getDepartmentData(resultData, resultData.departmentID)
        getMultiDropdownForEmployeeData(
          resultData,
          resultData.departmentID,
          mainBranchID,
          mainSearch
        )
        formik.setFieldValue('employeeID', resultData.employeeID)
        formik.setFieldValue('employeeCode', resultData.employeeCode)
        formik.setFieldValue('firstName', resultData.firstName)
        formik.setFieldValue('middleName', resultData.middleName)
        formik.setFieldValue('lastName', resultData.lastName)
        formik.setFieldValue('email', resultData.email)
        formik.setFieldValue('contactNumber', resultData.contactNumber)
        formik.setFieldValue('bloodGroupID', resultData.bloodGroupID)
        formik.setFieldValue('genderID', resultData.genderID)
        formik.setFieldValue('nationalityID', resultData.nationalityID)
        formik.setFieldValue('roleID', resultData.roleID)
        formik.setFieldValue('departmentID', resultData.departmentID)
        formik.setFieldValue('designationID', resultData.designationID)
        formik.setFieldValue('branchID', resultData.branchID)
        formik.setFieldValue('kylasID', resultData.kylasID)
        if (resultData.anniversaryDate !== null) {
          formik.setFieldValue('anniversaryDate', resultData.anniversaryDate)
        }
        if (resultData.joinDate !== null) {
          formik.setFieldValue('joinDate', resultData.joinDate)
        }
        if (resultData.birthDate !== null) {
          formik.setFieldValue('birthDate', resultData.birthDate)
        }
        setIsActive(resultData.isActive)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  // =========================Update Employee Personal Api=========================
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IEmployeeWebModel>({
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
        const Edit = window.confirm('Are you sure you want to update selected record ?')
        if (Edit) {
          if (state.newEmployeeID !== 0) {
            UpdateEmployeePersonalDetails(
              state.newEmployeeID,
              values.departmentID,
              values.designationID,
              values.branchID,
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
                if (response.data.isSuccess === true) {
                  history.push({
                    pathname: '/organization/employee/list',
                    state: {branchId: state.mainBranchID, search: state.mainSearch},
                  })
                  toast.success('Updated Successfull!')
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
          } else {
            toast.error('...comming soon update...')
            setLoading(false)
          }
        } else {
          return setLoading(false)
        }
      }, 1000)
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      {/* <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Update Personal Details</h3>
        </div>
      </div> */}
      {state.loading === true ? (
        <div className='card-body p-9'>
          <div className='text-center mt-5 pt-5'>
            <div className='spinner-border' style={{width: '3rem', height: '3rem'}} role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div id='kt_account_profile_details' className='collapse show'>
            <form onSubmit={formik.handleSubmit} noValidate className='form' id='personal'>
              <div className='card-body p-9'>
                {/* <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6 mb-6'>Avatar</label>
                  <div className='col-lg-8'>
                    <div
                      className='image-input image-input-outline'
                      data-kt-image-input='true'
                      style={{backgroundImage: `url(${toAbsoluteUrl('/media/avatars/blank.png')})`}}
                    >
                      <div
                        className='image-input-wrapper w-125px h-125px'
                        style={{backgroundImage: `url(${toAbsoluteUrl(state.employeeData.photoPath)})`}}
                      ></div>
                    </div>
                  </div>
                </div> */}
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                    Department:
                  </label>
                  <div className='col-lg-4 fv-row mb-6'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='departmentID'
                    >
                      <option selected={state.selDepartmentID === 0 ? true : false} value={0}>
                        Select Department
                      </option>
                      {state.departmentData.length > 0 &&
                        state.departmentData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.departmentID}
                              selected={state.selDepartmentID === data.departmentID ? true : false}
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
                      <option selected={state.selDesignationID === 0 ? true : false} value={0}>
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
                      <option selected={state.selRoleID === 0 ? true : false} value={0}>
                        Select Role
                      </option>
                      {state.roleData.length > 0 &&
                        state.roleData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.roleID}
                              selected={state.selRoleID === data.roleID ? true : false}
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

                  {/* <div className='row mb-6'>
                      <label className='col-lg-3 col-form-label required fw-bold fs-6 mb-6'>
                        Emergency Contact Name:
                      </label>
                      <div className='col-lg-3 fv-row mb-6'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Emergency Contact Name'
                          {...formik.getFieldProps('emergenecyContactName')}
                        />
                        {formik.touched.emergenecyContactName && formik.errors.emergenecyContactName && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.emergenecyContactName}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='row mb-6'> 
                      <label className='col-lg-3 col-form-label required fw-bold fs-6 mb-6'>
                        Emergency Contact Number:
                      </label>
                      <div className='col-lg-3 fv-row mb-6'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Emergency Contact Number '
                          {...formik.getFieldProps('emergencyContactNumber')}
                        />
                        {formik.touched.emergencyContactNumber && formik.errors.emergencyContactNumber && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.emergencyContactNumber}</div>
                          </div>
                        )}
                      </div>
                    </div> */}

                  <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>Email:</label>
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
                      <option selected={state.selNationalityID === 0 ? true : false} value={0}>
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

                  <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>Blood Group :</label>
                  <div className='col-lg-4 fv-row mb-6'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='bloodGroupID'
                    >
                      <option selected={state.selBloodGroupID === 0 ? true : false} value={0}>
                        Select Blood Group
                      </option>
                      {state.bloodGroupData.length > 0 &&
                        state.bloodGroupData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.bloodGroupID}
                              selected={state.selBloodGroupID === data.bloodGroupID ? true : false}
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

                  <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>Birth Date:</label>
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

                  <label className='col-lg-2 col-form-label fw-bold fs-6 required'>
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
                  <div className='col-lg-4 fv-row mb-6'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input mt-3'
                        type='checkbox'
                        id='isActive'
                        checked={isActive}
                        onChange={(e) => checkedFunction(e)}
                      />
                    </div>
                  </div>
                  <label className='col-lg-2 col-form-label fw-bold fs-6 mb-6'>Kylas ID:</label>
                  <div className='col-lg-4 fv-row mb-6'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Kylas ID'
                      {...formik.getFieldProps('kylasID')}
                    />
                    {formik.touched.kylasID && formik.errors.kylasID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.kylasID}</div>
                      </div>
                    )}
                  </div>
                  {/* </div> */}
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
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export {EditEmployeePersonal}
