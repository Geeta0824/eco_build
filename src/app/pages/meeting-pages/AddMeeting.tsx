import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import Select from 'react-select'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {IDepartmentModel} from '../../models/master-page/IDepartmentModel'
import {createDesignation} from '../../modules/master-page/designation-master-page/DesignationCRUD'
import {useHistory, useLocation} from 'react-router-dom'
import {venderTypeData} from '../other-dropDowns/otherDropDowns'
import {
  addVenderDetails,
  getAgencyGetListByVendorIDApi,
  getVenderListByVendorTypeID,
} from '../../modules/master-page/vender-master-page/VenderCRUD'
import {IEmployeePageModel} from '../../models/organization-page/Employee/IEmployeeModel'
import {Employee_Get_SearchDropdown_ForUserApi} from '../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {KTSVG} from '../../../_Ecd/helpers'
import {IProjectModel} from '../../models/projects-page/IProjectsModel'
import {getAllProjectListByRoleIDAndEmployeeIDAPI} from '../../modules/project-master-page/project-master/ProjectCRUD'
import {
  IAgencyModelDDL,
  IEmployeeMapkModel,
  IMediumModelDD,
  IMeetingModel,
  IMeetingTypeDd,
  meetingInitValue as initialValues,
  IStatusModelDD,
  IVenueModelDD,
} from '../../models/meeting-page/IMeetingModel'
import {Button, Modal} from 'react-bootstrap-v5'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import Loader from '../common-pages/Loader'
import {Col, Pagination} from 'antd'
import {IAgencyListModel, IVenderModel} from '../../models/master-page/IVenderModel'
import {
  AddMeetingDetailsApi,
  GetEmployeeMapListWithProject,
  GetMeetingMediumList,
  GetMeetingStatusList,
  GetMeetingTypeList,
  GetMeetingVenueList,
  GetVendorMapListWithProject,
} from '../../modules/meeting-mst-pages/MeetingCRUD'
import {GetAgencyWorkStageByTypeIDApi} from '../../modules/product-master-page/agency-type-master-page/AgenctWorkStageCRUD'
import {GetPurchaseListByVendorID} from '../../modules/account-page/pay-purchase-master-page/PayPurchaseCRUD'
import {IPurchasetModel} from '../../models/Accounts-page/pay-purchase-page copy/IPayPurchaseModel'
import LoaderInTable from '../common-pages/LoaderInTable'
import moment from 'moment'

const profileDetailsSchema = Yup.object().shape({
  description: Yup.string().required('Description is  Requerd'),
})

interface IDepartment {
  loading: boolean
  departmentData: IMeetingModel[]
  statusDDL: IStatusModelDD[]
  mediumsDDL: IMediumModelDD[]
  venueDDL: IVenueModelDD[]
  meetingTypeDdData: IMeetingTypeDd[]
  agencyData: IAgencyModelDDL[]
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel[]

  employeeData: IEmployeePageModel[]
  tmpEmployeeData: IEmployeePageModel[]
  employeeMapData: IEmployeeMapkModel[]
  tmpEmployeeMapData: IEmployeeMapkModel[]
  selVenderId: number
  selProjectID: number
  selVenueID: number
  selmediumID: number
  selEmployeeID: number
  selAgencyID: number
  selStatusID: number
  selMeetingTypeID: number
  selVendorID: number

  //   action: string
  // mainSearch: string
}

const AddMeeting: React.FC = () => {
  const [data, setData] = useState<IMeetingModel>(initialValues)
  const [mainSearch, setMainSearch] = useState('')
  const [modalLoader, setModalLoader] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isAgency, setIsAgency] = useState(false)

  const history = useHistory()
  const location = useLocation()

  const updateData = (fieldsToUpdate: Partial<IMeetingModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    loading: false,
    departmentData: [] as IMeetingModel[],
    statusDDL: [] as IStatusModelDD[],
    mediumsDDL: [] as IMediumModelDD[],
    venueDDL: [] as IVenueModelDD[],
    meetingTypeDdData: [] as IMeetingTypeDd[],
    agencyData: [] as IAgencyModelDDL[],

    projectData: [] as IProjectModel[],
    tmpProjectData: [] as IProjectModel[],

    employeeData: [] as IEmployeePageModel[],
    tmpEmployeeData: [] as IEmployeePageModel[],

    employeeMapData: [] as IEmployeeMapkModel[],
    tmpEmployeeMapData: [] as IEmployeeMapkModel[],
    selVenderId: 0,
    selProjectID: 0,
    selVenueID: 0,
    selmediumID: 0,
    selEmployeeID: 0,
    selAgencyID: 0,
    selStatusID: 1,
    selMeetingTypeID: 0,
    selVendorID: 0,

    // action: 'Vendor',
    // mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      // let mainSearch: string = ''
      // if (lc.mainSearch != undefined) {
      //   mainSearch = lc.mainSearch
      // }
      getAllProjectData()
      // getAllProjectData(mainSearch)
    }, 100)
  }, [])

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    console.log(value) // Check the value being selected
    console.log(elementId) // Check if the correct element ID is being captured

    if (elementId === 'venueID') {
      formik.setFieldValue('venueID', parseInt(value))
      setState({...state, selVenueID: parseInt(value)})
    } else if (elementId === 'mediumID') {
      formik.setFieldValue('mediumID', parseInt(value))
      setState({...state, selmediumID: parseInt(value)})
    } else if (elementId === 'meetingTypeID') {
      // Fixed typo here (extra space)
      formik.setFieldValue('meetingTypeID', parseInt(value))
      setState({...state, selMeetingTypeID: parseInt(value)})
    } else if (elementId === 'statusID') {
      // Fixed typo here (extra space)
      formik.setFieldValue('statusID', parseInt(value))
      setState({...state, selStatusID: parseInt(value)})
    } else if (elementId === 'vendorID') {
      // Fixed typo here (extra space)
      formik.setFieldValue('vendorID', parseInt(value))
      setState({...state, selVendorID: parseInt(value)})
    }
  }

  function checkedClientFunc(event: any) {
    setIsClient(event.target.checked)
  }

  function checkedAgencyFunc(event: any) {
    setIsAgency(event.target.checked)
    if (event.target.checked === false) {
      setState({...state, selVendorID: 0})
    }
  }
  //  ================== Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  function getAllProjectData() {
    // function getAllProjectData(mainSearch: string) {
    // state.loading = true
    {
      state.tmpProjectData.length == 0 &&
        getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
          .then((response) => {
            const responseData = response.data.responseObject
            if (response.data.isSuccess === true) {
              // setState({
              //   ...state,
              //   projectData: responseData,
              //   tmpProjectData: responseData,
              //   mainSearch: mainSearch,
              //   loading: false,
              // })
              setTotal(responseData.length)
              setPage(1)
              // GetMeetingTypeListData(mainSearch, responseData)
              GetMeetingTypeListData(responseData)
            } else {
              toast.error(`${response.data.message}`)
              setState({...state, projectData: [], loading: false})
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
            setState({...state, projectData: [], loading: false})
          })
    }
    // setShow(false)
  }

  // --------For Model Data onClick Function-------
  function selectProject(tmpProjectData: IProjectModel) {
    formik.setFieldValue('projectID', tmpProjectData.projectID)
    formik.setFieldValue('projectName', tmpProjectData.projectName)
    formik.setFieldValue('customerName', tmpProjectData.firstName)
    formik.setFieldValue('projectCategoryName', tmpProjectData.projectCategoryName)
    formik.setFieldValue('projectType', tmpProjectData.projectType)
    setState({...state, selProjectID: tmpProjectData.projectID})
    setSelectedEmployeeNames([])
    GetEmployeeMapListWithProjectData(tmpProjectData.projectID)
    // VendorMapListWithProjectData(tmpProjectData.projectID)
    setShow(false)
  }
  // =================-------------------------- Pagination Project--------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProjectData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectType.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, projectData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectData: state.tmpProjectData})
      // If the text field is empty, show all users
      setTotal(state.tmpProjectData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // -----------------Employee Select-------------------============================================================================
  const [showEmp, setShowEmp] = useState(false)
  function handleCloseEmp() {
    setShowEmp(false)
  }
  function handleShowEmp() {
    if (state.selProjectID == 0) {
      return toast.error(`Please Setect Project`)
    } else {
      setShowEmp(true)
    }
  }

  function GetEmployeeMapListWithProjectData(projectID: number) {
    GetEmployeeMapListWithProject(projectID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          // setState({
          //   ...state,
          //   employeeMapData: responseData,
          //   selProjectID: projectID,
          //   loading: false,
          // })
          VendorMapListWithProjectData(responseData, projectID)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, employeeMapData: [], loading: false})
        }
        setTotalemp(responseData.length)
        setPageemp(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, employeeMapData: [], loading: false})
      })
  }
  function VendorMapListWithProjectData(employeeMapData: IEmployeeMapkModel[], projectID: number) {
    GetVendorMapListWithProject(projectID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            agencyData: responseData,
            employeeMapData: employeeMapData,
            selProjectID: projectID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyData: [], loading: false})
        }
        // setTotalemp(responseData.length)
        // setPageemp(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyData: [], loading: false})
      })
  }

  // =================== For Asseccories ==============

  const [selectedEmployeeNames, setSelectedEmployeeNames] = useState<string[]>([])

  function SetStatus(e: any) {
    const uid = parseInt(e.target.id)
    const isChecked = e.target.checked
    let tmpTechno = [...state.employeeMapData]

    for (let k in tmpTechno) {
      if (uid === tmpTechno[k].employeeID) {
        tmpTechno[k].isMember = isChecked ? 1 : 0
        break
      }
    }

    const updatedSelectedNames = tmpTechno
      .filter((employee) => employee.isMember === 1)
      .map((employee) => employee.employeeName)

    setSelectedEmployeeNames(updatedSelectedNames)

    setState({
      ...state,
      employeeMapData: tmpTechno,
    })
  }

  // ================================Employee=====================================
  const [totalemp, setTotalemp] = useState(state.employeeMapData.length) //  length
  const [pageemp, setPageemp] = useState(1)
  const [postPerPageemp, setPostPerPageemp] = useState(10)
  const indexOfLastPageemp = pageemp * postPerPageemp
  const indexOfFirstPageemp = indexOfLastPageemp - postPerPageemp
  const currentPostsemp: IEmployeeMapkModel[] = state.employeeMapData.slice(
    indexOfFirstPageemp,
    indexOfLastPageemp
  )
  const onShowSizeChangeEmployee = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  // --------For Model Data onClick Function Employee-------

  // const [selectedEmployees, setSelectedEmployees] = useState([])
  // function selectEmployee(tmpEmployeeMapData: IEmployeeMapkModel) {
  //   formik.setFieldValue('employeeID', tmpEmployeeMapData.employeeID)
  //   formik.setFieldValue('employeeName', tmpEmployeeMapData.employeeName)
  //   formik.setFieldValue('roleName', tmpEmployeeMapData.roleName)
  //   formik.setFieldValue('designationName', tmpEmployeeMapData.designationName)
  //   formik.setFieldValue('departmentName', tmpEmployeeMapData.departmentName)

  // setShowEmp(false)
  // }

  // ===================================Meeting Type DD==============================================

  // function GetMeetingTypeListData(mainSearch: string, projectData: IProjectModel[]) {
  function GetMeetingTypeListData(projectData: IProjectModel[]) {
    // state.loading = true
    {
      GetMeetingTypeList()
        .then((response) => {
          const responseData = response.data.responseObject
          if (response.data.isSuccess === true) {
            // setState({
            //   ...state,
            //   meetingTypeDdData: responseData,
            //   // mainSearch,
            //   projectData: projectData,

            //   loading: false,
            // })
            GetMeetingStatusListData(projectData, responseData)
          } else {
            toast.error(`${response.data.message}`)
            setState({...state, meetingTypeDdData: [], loading: false})
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
          setState({...state, meetingTypeDdData: [], loading: false})
        })
    }
    setShow(false)
  }
  function GetMeetingStatusListData(
    projectData: IProjectModel[],
    meetingTypeDdData: IMeetingTypeDd[]
  ) {
    GetMeetingStatusList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          // setState({
          //   ...state,
          //   statusDDL: responseData,
          //   meetingTypeDdData: meetingTypeDdData,
          //   projectData: projectData,
          //   loading: false,
          // })
          formik.setFieldValue('statusID', 1)
          GetMeetingMediumListData(projectData, meetingTypeDdData, responseData)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, statusDDL: [], loading: false})
        }
        setTotalemp(responseData.length)
        setPageemp(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, statusDDL: [], loading: false})
      })
  }
  function GetMeetingMediumListData(
    projectData: IProjectModel[],
    meetingTypeDdData: IMeetingTypeDd[],
    statusDDL: IStatusModelDD[]
  ) {
    GetMeetingMediumList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          // setState({
          //   ...state,
          //   mediumsDDL: responseData,
          //   statusDDL: statusDDL,
          //   meetingTypeDdData: meetingTypeDdData,
          //   projectData: projectData,
          //   loading: false,
          // })
          GetMeetingVenueListData(projectData, meetingTypeDdData, statusDDL, responseData)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, mediumsDDL: [], loading: false})
        }
        setTotalemp(responseData.length)
        setPageemp(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, mediumsDDL: [], loading: false})
      })
  }

  function GetMeetingVenueListData(
    projectData: IProjectModel[],
    meetingTypeDdData: IMeetingTypeDd[],
    statusDDL: IStatusModelDD[],
    mediumsDDL: IMediumModelDD[]
  ) {
    GetMeetingVenueList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          //
          // GetVendorMapListWithProjectData(
          //   responseData,
          //   projectData,
          //   meetingTypeDdData,
          //   statusDDL,
          //   mediumsDDL,
          //   state.selProjectID
          // )
          setState({
            ...state,

            venueDDL: responseData,
            projectData: projectData,
            meetingTypeDdData: meetingTypeDdData,
            statusDDL: statusDDL,
            mediumsDDL: mediumsDDL,
            // selProjectID: projectID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, venueDDL: [], loading: false})
        }
        setTotalemp(responseData.length)
        setPageemp(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, venueDDL: [], loading: false})
      })
  }
  // function GetVendorMapListWithProjectData(
  //   venueDDL: IVenueModelDD[],
  //   projectData: IProjectModel[],
  //   meetingTypeDdData: IMeetingTypeDd[],
  //   statusDDL: IStatusModelDD[],
  //   mediumsDDL: IMediumModelDD[],
  //   projectID: number
  // ) {
  //   GetVendorMapListWithProject(projectID)
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess == true) {
  //         setState({
  //           ...state,
  //           agencyData: responseData,
  //           venueDDL: venueDDL,
  //           mediumsDDL: mediumsDDL,
  //           statusDDL: statusDDL,
  //           meetingTypeDdData: meetingTypeDdData,
  //           projectData: projectData,
  //           selProjectID: projectID,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, agencyData: [], loading: false})
  //       }
  //       setTotalemp(responseData.length)
  //       setPageemp(1)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, agencyData: [], loading: false})
  //     })
  // }

  // //   ------------------Add Api---------------------------=========================================================================
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IMeetingModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let tmpTech = state.employeeMapData
        // let strSelTechid: string = ''
        // for (let k in tmpTech) {
        //   if (tmpTech[k].isMember === 1) {
        //     if (strSelTechid == '') {
        //       strSelTechid = `${tmpTech[k].employeeID}`
        //     } else {
        //       strSelTechid = strSelTechid + ',' + `${tmpTech[k].employeeID}`
        //     }
        //   }
        // }

        let strSelTechid: any = []
        for (let k in tmpTech) {
          if (tmpTech[k].isMember === 1) {
            strSelTechid.push(tmpTech[k].employeeID)
          }
        }
        console.log(strSelTechid)
        AddMeetingDetailsApi(
          values.projectID,
          isClient,
          isAgency,
          values.vendorID,
          values.description,
          values.meetingDate,
          values.startTime,
          values.endTime,
          values.venueID,
          user.employeeID,
          values.statusID,
          values.mediumID,
          values.meetingTypeID,
          // JSON.stringify( strSelTechid)
          strSelTechid
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname: '/meeting/list'})
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Project:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Project Name'
                    disabled
                    {...formik.getFieldProps('projectName')}
                  />
                  {formik.touched.projectID && formik.errors.projectID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectID}</div>
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
                <label
                  className={
                    state.selProjectID === 0 ? 'd-none' : 'col-lg-3 col-form-label fw-bold fs-6'
                  }
                >
                  <span className=''>Customer Name:</span>
                </label>
                <div className={state.selProjectID == 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Customer Name '
                    disabled
                    {...formik.getFieldProps('customerName')}
                  />
                </div>
              </div>
              {/* <div
                      className={
                        state.selVenderId === 1 || state.selVenderId === 2 ? 'row mb-6' : 'd-none'
                      }
                    >
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className='required'>Company Name:</span>
                      </label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Enter Company Name'
                          {...formik.getFieldProps('companyName')}
                        />
                        {formik.touched.companyName && formik.errors.companyName && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.companyName}</div>
                          </div>
                        )}
                      </div>
                    </div> */}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Is Client:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      checked={isClient}
                      className='form-check-input mt-3'
                      type='checkbox'
                      onChange={(e) => checkedClientFunc(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Is Agency:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      checked={isAgency}
                      className='form-check-input mt-3'
                      type='checkbox'
                      onChange={(e) => checkedAgencyFunc(e)}
                    />
                  </div>
                </div>{' '}
              </div>
              <div className={isAgency === true ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label  fw-bold fs-6'>
                  Select Agency(Vendor):
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='vendorID'
                  >
                    <option selected={state.selProjectID === 0 ? true : false} value={0}>
                      Select Agency
                    </option>
                    {state.agencyData.length > 0 &&
                      state.agencyData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.vendorID}
                            selected={state.selProjectID == data.vendorID ? true : false}
                          >
                            {data.companyName}
                          </option>
                        )
                      })}
                  </select>
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Employee:
                </label>
                <div className='col-lg-4 fv-row'>
                  {/* Conditionally render input or selected employees box */}
                  {selectedEmployeeNames.length > 0 ? (
                    // Box to display selected employees with horizontal overflow
                    <div
                      className='selected-employees-box mt-2'
                      style={{
                        border: '1px solid #ddd',
                        padding: '10px',
                        // backgroundColor: '#f9f9f9',
                        borderRadius: '5px',
                        maxHeight: '100px',
                        overflowX: 'auto', // Enable horizontal scrolling
                        // whiteSpace: 'nowrap', // Prevent line breaks so names overflow horizontally
                      }}
                    >
                      {selectedEmployeeNames.map((employee, index) => (
                        <span
                          key={index}
                          style={{
                            display: 'inline-block',
                            padding: '5px 10px',
                            marginRight: '5px',
                            marginBottom: '5px',
                            // border: '1px solid #007bff', // Border color for employee names
                            border: '1px solid black',
                            color: 'black', // Text color for employee names
                            borderRadius: '4px',
                            fontSize: '14px',
                          }}
                        >
                          {employee}
                        </span>
                      ))}
                    </div>
                  ) : (
                    // Input box with employee names
                    <input
                      className='form-control form-control-lg border-0 bg-white'
                      placeholder='Select Employee'
                      {...formik.getFieldProps('employeeID')}
                      value={selectedEmployeeNames.join(',  ')} // Join names with a comma and space
                      readOnly
                    />
                  )}
                </div>

                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShowEmp}
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
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Date:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    {...formik.getFieldProps('meetingDate')}
                    // min={new Date().toISOString().split('T')[0]} // Sets the minimum date to today
                    // min={moment(new Date()).format('YYYY-MM-DD')}
                  />
                  {formik.touched.meetingDate && formik.errors.meetingDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.meetingDate}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'> Start Time:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='time'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    {...formik.getFieldProps('startTime')}
                    min={moment(new Date()).format('HH:mm')}
                  />
                  {formik.touched.startTime && formik.errors.startTime && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.startTime}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'> End Time:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='time'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    {...formik.getFieldProps('endTime')}
                    min={moment(new Date()).format('HH:mm')}
                  />
                  {formik.touched.endTime && formik.errors.endTime && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.endTime}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label  fw-bold fs-6 required'>Status :</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-white'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='statusID'
                    disabled
                  >
                    <option selected={state.selStatusID === 0 ? true : false} value={0}>
                      Select Status
                    </option>
                    {state.statusDDL.length > 0 &&
                      state.statusDDL.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.meetingStatusID}
                            selected={state.selStatusID == data.meetingStatusID ? true : false}
                          >
                            {data.meetingStatusName}
                          </option>
                        )
                      })}
                  </select>
                </div>
                <label className='col-lg-2 col-form-label  fw-bold fs-6 required'>
                  Meeting Type :
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='meetingTypeID'
                  >
                    <option selected={state.selMeetingTypeID === 0 ? true : false} value={0}>
                      Select Meeting Type
                    </option>
                    {state.meetingTypeDdData.length > 0 &&
                      state.meetingTypeDdData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.meetingTypeID}
                            selected={state.selMeetingTypeID == data.meetingTypeID ? true : false}
                          >
                            {data.meetingTypeName}
                          </option>
                        )
                      })}
                  </select>
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Venue:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='venueID'
                  >
                    <option selected={state.selVenueID === 0 ? true : false} value={0}>
                      Select Venue
                    </option>
                    {state.venueDDL.length > 0 &&
                      state.venueDDL.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.meetingVenueID}
                            selected={state.selVenueID == data.meetingVenueID ? true : false}
                          >
                            {data.meetingVenueName}
                          </option>
                        )
                      })}
                  </select>
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Medium:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='mediumID'
                  >
                    <option selected={state.selmediumID === 0 ? true : false} value={0}>
                      Select Medium
                    </option>
                    {state.mediumsDDL.length > 0 &&
                      state.mediumsDDL.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.meetingMediumID}
                            selected={state.selmediumID == data.meetingMediumID ? true : false}
                          >
                            {data.meetingMediumName}
                          </option>
                        )
                      })}
                  </select>
                </div>
              </div>
              {/* <div className={'row mb-6'}>
                <label
                  className={
                    state.selmediumID == 1 ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  <span className='required'>Meeting Place:</span>
                </label>
                <div className={state.selmediumID == 1 ? 'col-lg-4 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    {...formik.getFieldProps('place')}
                  />
                  {/* {formik.touched.place && formik.errors. && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.}</div>
                    </div>
                  )} */}
              {/* </div>
                <label
                  className={
                    state.selmediumID == 2 ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  <span className='required'>Meeting Link:</span>
                </label>
                <div className={state.selmediumID == 2 ? 'col-lg-4 fv-row' : 'd-none'}>
                  <input
                    type='link'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    {...formik.getFieldProps('link')}
                  /> */}
              {/* {formik.touched.endTime && formik.errors.endTime && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.endTime}</div>
                    </div>
                  )} */}
              {/* </div>
              </div> */}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Meeting Purpose:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Meeting Purpose'
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
                    </div>
                  )}
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
              <button
                onClick={() =>
                  history.push({
                    // pathname: '/master/vender/list',
                    pathname: '/meeting/list',
                    // state: {search: mainSearch},
                  })
                }
                className='btn btn-danger ms-3'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>{' '}
      {/* ----------------------------Project Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Project Data</Modal.Title>
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
                      <span className='d-block mb-1 ps-2'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Customer Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Category</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Type</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>BHK (Carpet)</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.loading === true ? (
                    <Loader loading={state.loading} />
                  ) : (
                    <>
                      {currentPosts.length > 0 &&
                        currentPosts.map((data, index) => {
                          return (
                            <tr
                              key={index}
                              className={
                                // data.isAgency === false
                                //   ? 'd-none'
                                //   :
                                'bg-hover-light-primary text-hover-primary'
                              }
                              onClick={() => selectProject(data)}
                            >
                              <td>
                                <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                                  {data.projectName}
                                </span>
                              </td>
                              <td className=''>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.firstName} {data.lastName}
                                </span>
                              </td>
                              <td className=''>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.projectCategoryName}
                                </span>
                              </td>
                              <td className=''>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.projectType}
                                </span>
                              </td>
                              <td className=''>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.bhkName}
                                  {'('}
                                  {data.carpetArea}
                                  {')'}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={currentPosts.length}
                        loading={state.loading}
                        colSpan={9}
                      />
                    </>
                  )}
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
      {/* ----------------------------Employee Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={showEmp} onHide={handleCloseEmp}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Employee Data</Modal.Title>
            {/* <div className='border-0 pt-4' id='kt_chat_contacts_header'>
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
                //   onChange={(e) => filter(e)}
                //   value={nameEmp}
                />
              </span>
            </div> */}
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body p-0'>
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                <thead className='bg-light-primary'>
                  <tr className='fw-bolder fs-5'>
                    {/* <th className='min-w-50px'>Sr.No.</th> */}
                    <th className='min-w-150px'>Employee Name</th>
                    <th className='min-w-50px'>Role Name</th>
                    <th className='min-w-25px'>Designation Name</th>
                    <th className='min-w-50px'>Department Name</th>
                  </tr>
                </thead>
                <tbody className="border-bottom">
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {currentPostsemp.length > 0 &&
                        currentPostsemp.map((data, index) => {
                          return (
                            <tr
                              key={index}
                              // className={data.isComplete === true ? 'text-success' : ''}
                              className={'bg-hover-light-primary text-hover-primary'}
                              // onClick={() => selectEmployee(data)}
                            >
                              <td>
                                <div className='form-check form-check-custom form-check-solid mb-3'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id={`${data.employeeID}`}
                                    value={data.employeeID}
                                    name={data.employeeName}
                                    checked={data.isMember === 1 ? true : false}
                                    // disabled={data.isComplete == true ? true : false}
                                    onChange={(e) => SetStatus(e)}
                                  />
                                  <span className=' text-hover-primary fs-6 ms-5'>
                                    {data.employeeName}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>{data.roleName}</span>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.designationName}
                                </span>
                              </td>

                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.departmentName}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={state.employeeMapData.length}
                        loading={state.loading}
                        colSpan={9}
                      />
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPage(value)}
                pageSize={postPerPageemp}
                total={totalemp}
                current={pageemp}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeEmployee}
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-primary ms-3' onClick={handleCloseEmp}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default AddMeeting
