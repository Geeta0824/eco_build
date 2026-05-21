import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Button, Modal} from 'react-bootstrap-v5'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../modules/auth/models/UserModel'
import {RootState} from '../../../setup'
import {
  IGeneratePenaltyModel,
  generatePenaltyInitValue as initialValues,
} from '../../models/generate-penalty/GeneratePenaltyModel'
import {IDesignerEmployeeModel} from '../../models/master-page/IDesignerTicketCategoryModel'
import {
  GetHeadOfDepartment_Dropdwon_List_ByIDAPI,
  GetEmployee_DropdownListByProjectIDAndDepartmentIDAPI,
  GetVendor_DropdownListByProjectIDAPI,
} from '../../modules/generate-ticket-master-page/GenerateTicketCRUD'
import {getAllProjectListByRoleIDAndEmployeeIDAPI} from '../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../models/projects-page/IProjectsModel'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {Pagination} from 'antd'
import {
  GetGeneratePenaltyByTicketIDAPI,
  UpdateGeneratePenaltyDetailsAPI,
} from '../../modules/generate-penalty-master-page/GeneratePenaltyCRUD'
import {getAllPenaltyTypeList} from '../../modules/master-page/Penalty-Type-page/PenaltyTypeCRUD'
import {
  IEmpVendorModel,
  IHeadOfDepartmentModel,
  PenaltyTypeModel,
} from '../../models/master-page/PenaltyTypeModel'
import {penaltyForData} from '../other-dropDowns/otherDropDowns'
import {IDepartmentModel} from '../../models/master-page/IDepartmentModel'
import {getAllDepartmentData} from '../../modules/master-page/department-master-page/NewDepartmentCRUD'

const profileDetailsSchema = Yup.object().shape({
  remarks: Yup.string().required('Remarks Field is required'),
  projectID: Yup.number().min(1, 'Please Select Project').required('Please Select Project'),
  penaltyTypeID: Yup.number()
    .min(1, 'Penalty Type Field is required')
    .required('Penalty Type Field is required'),
  designerID: Yup.number()
    .min(1, 'Designer Field is required')
    .required('Designer Field is required'),
})

interface IDesignerTicketCategory {
  loading: boolean
  penaltyTypeData: PenaltyTypeModel[]
  headOfDepartmentData: IHeadOfDepartmentModel[]
  employeeData: IEmpVendorModel[]
  vendorData: IEmpVendorModel[]
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel[]
  departmentData: IDepartmentModel[]
  selProjectID: number
  selPenaltyForID: number
  selHeadOfDepartmentID: number
  selEmpVendorID: number
  selDepartmentID: number
  selPenaltyTypeID: number
  pathUrl: any
}

const UpdatePenalty: React.FC = () => {
  const [data, setData] = useState<IGeneratePenaltyModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const {penaltyID} = useParams<{penaltyID: string}>()
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [file, setFile] = useState('')
  const [amount, setAmount] = useState('')
  const [searchName, setSearchName] = useState('')
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IGeneratePenaltyModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [state, setState] = useState<IDesignerTicketCategory>({
    loading: false,
    penaltyTypeData: [] as PenaltyTypeModel[],
    headOfDepartmentData: [] as IHeadOfDepartmentModel[],
    employeeData: [] as IEmpVendorModel[],
    vendorData: [] as IEmpVendorModel[],
    projectData: [] as IProjectModel[],
    tmpProjectData: [] as IProjectModel[],
    departmentData: [] as IDepartmentModel[],
    selProjectID: 0,
    selPenaltyForID: 0,
    selHeadOfDepartmentID: 0,
    selEmpVendorID: 0,
    selDepartmentID: 0,
    selPenaltyTypeID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  const location = useLocation()

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      //console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      setSearchName(mainSearch)
      getAllProjectByRoleIdData()
    }, 100)
  }, [])

  function getAllProjectByRoleIdData() {
    getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
      .then((response) => {
        let responseData = response.data
        let projectData = responseData.responseObject
        if (responseData.isSuccess == true) {
          getDepartmentData(projectData)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, projectData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectData: [], loading: false})
      })
  }

  function getDepartmentData(temProjectData: IProjectModel[]) {
    getAllDepartmentData()
      .then((response) => {
        // let responseData = response.data
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let respObj = resp.responseObject
        if (resp.isSuccess == true) {
          getDesignerTicketCategoryData(temProjectData, respObj)
        } else {
          toast.error(`${resp.massege}`)
          setState({...state, departmentData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, departmentData: [], loading: false})
      })
  }

  function getDesignerTicketCategoryData(
    temProjectData: IProjectModel[],
    temDepData: IDepartmentModel[]
  ) {
    getAllPenaltyTypeList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getGenerateTicketByIDData(temProjectData, temDepData, responseData)
        } else {
          toast.error(`${response.data.massege}`)
          setState({
            ...state,
            penaltyTypeData: [],
            tmpProjectData: [],
            projectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          penaltyTypeData: [],
          tmpProjectData: [],
          projectData: [],
          loading: false,
        })
      })
  }

  function getGenerateTicketByIDData(
    temProjectData: IProjectModel[],
    temDepData: IDepartmentModel[],
    temPenaltyTypeData: PenaltyTypeModel[]
  ) {
    GetGeneratePenaltyByTicketIDAPI(parseInt(penaltyID))
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          const temProjectID = responseData.projectID
          const temEmpVendorID = responseData.designerID
          const temPenaltyTypeID = responseData.penaltyTypeID
          const temApprovalForID = responseData.approvalForID
          const temPenaltyForID = responseData.penaltyForID
          const temDepartmentID = responseData.departmentID
          formik.setFieldValue('projectID', responseData.projectID)
          formik.setFieldValue('designerID', responseData.designerID)
          formik.setFieldValue('penaltyTypeID', responseData.penaltyTypeID)
          setAmount(responseData.amount)
          formik.setFieldValue('remarks', responseData.remarks)
          formik.setFieldValue('projectName', responseData.projectName)
          formik.setFieldValue('customerName', responseData.customerName)
          formik.setFieldValue('approvalForID', responseData.approvalForID)
          formik.setFieldValue('penaltyForID', responseData.penaltyForID)
          formik.setFieldValue('departmentID', responseData.departmentID)
          setFile(responseData.photoPath)
          getEmployeeListByDepartmentIDDataList(
            temProjectData,
            temDepData,
            temPenaltyTypeData,
            temProjectID,
            temEmpVendorID,
            temPenaltyTypeID,
            temApprovalForID,
            temPenaltyForID,
            temDepartmentID
          )
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, projectData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectData: [], loading: false})
      })
  }

  function getEmployeeListByDepartmentIDDataList(
    temProjectData: IProjectModel[],
    temDepData: IDepartmentModel[],
    temPenaltyTypeData: PenaltyTypeModel[],
    temProjectID: number,
    temEmpVendorID: number,
    temPenaltyTypeID: number,
    temApprovalForID: number,
    temPenaltyForID: number,
    temDepartmentID: number
  ) {
    state.selDepartmentID = 0
    GetEmployee_DropdownListByProjectIDAndDepartmentIDAPI(temProjectID, temDepartmentID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getVendorDataListByProjectIDList(
            temProjectData,
            temDepData,
            temPenaltyTypeData,
            responseData,
            temProjectID,
            temEmpVendorID,
            temPenaltyTypeID,
            temApprovalForID,
            temPenaltyForID,
            temDepartmentID
          )
        } else {
          toast.error(`${response.data.massege}`)
          setState({
            ...state,
            employeeData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          employeeData: [],
          selDepartmentID: 0,
          loading: false,
        })
      })
  }

  function getVendorDataListByProjectIDList(
    temProjectData: IProjectModel[],
    temDepData: IDepartmentModel[],
    temPenaltyTypeData: PenaltyTypeModel[],
    temEmployeeData: IEmpVendorModel[],
    temProjectID: number,
    temEmpVendorID: number,
    temPenaltyTypeID: number,
    temApprovalForID: number,
    temPenaltyForID: number,
    temDepartmentID: number
  ) {
    GetVendor_DropdownListByProjectIDAPI(temProjectID).then((response) => {
      let responseData = response.data.responseObject
      if (response.data.isSuccess == true) {
        getHeadOfDepartmentDataByDepartmentIDList(
          temProjectData,
          temDepData,
          temPenaltyTypeData,
          temEmployeeData,
          responseData,
          temProjectID,
          temEmpVendorID,
          temPenaltyTypeID,
          temApprovalForID,
          temPenaltyForID,
          temDepartmentID
        )
      } else {
        toast.error(`${response.data.massege}`)
        setState({
          ...state,
          vendorData: [],
          loading: false,
        })
      }
    })
  }

  function getHeadOfDepartmentDataByDepartmentIDList(
    temProjectData: IProjectModel[],
    temDepData: IDepartmentModel[],
    temPenaltyTypeData: PenaltyTypeModel[],
    temEmployeeData: IEmpVendorModel[],
    temVendorData: IEmpVendorModel[],
    temProjectID: number,
    temEmpVendorID: number,
    temPenaltyTypeID: number,
    temApprovalForID: number,
    temPenaltyForID: number,
    temDepartmentID: number
  ) {
    GetHeadOfDepartment_Dropdwon_List_ByIDAPI(temProjectID, temDepartmentID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            penaltyTypeData: temPenaltyTypeData,
            projectData: temProjectData,
            tmpProjectData: temProjectData,
            departmentData: temDepData,
            selEmpVendorID: temEmpVendorID,
            selHeadOfDepartmentID: temApprovalForID,
            selDepartmentID: temDepartmentID,
            selPenaltyForID: temPenaltyForID,
            selProjectID: temProjectID,
            selPenaltyTypeID: temPenaltyTypeID,
            headOfDepartmentData: responseData,
            employeeData: temEmployeeData,
            vendorData: temVendorData,
            loading: false,
          })
          setTotal(temProjectData.length)
        } else {
          toast.error(`${response.data.massege}`)
          setState({
            ...state,
            headOfDepartmentData: [],
            vendorData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          vendorData: [],
          headOfDepartmentData: [],
          loading: false,
        })
      })
  }

  // -----------------------------------
  function getEmployeeListByDepartmentIDData(temDepartmentID: number) {
    state.selDepartmentID = 0
    GetEmployee_DropdownListByProjectIDAndDepartmentIDAPI(state.selProjectID, temDepartmentID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getHeadOfDepartmentDataByDepartmentID(temDepartmentID, responseData)
        } else {
          toast.error(`${response.data.massege}`)
          setState({
            ...state,
            employeeData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          employeeData: [],
          selDepartmentID: 0,
          loading: false,
        })
      })
  }

  function getHeadOfDepartmentDataByDepartmentID(
    temDepartmentID: number,
    temEmployeeData: IEmpVendorModel[]
  ) {
    GetHeadOfDepartment_Dropdwon_List_ByIDAPI(state.selProjectID, temDepartmentID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            employeeData: temEmployeeData,
            headOfDepartmentData: responseData,
            selDepartmentID: temDepartmentID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.massege}`)
          setState({
            ...state,
            headOfDepartmentData: [],
            vendorData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          vendorData: [],
          headOfDepartmentData: [],
          loading: false,
        })
      })
  }

  // --------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target
    const isValidNumber = /^[0-9]*\.?[0-9]*$/ // Allows numbers and one decimal point

    if (id === 'penaltyAmount' && isValidNumber.test(value)) {
      setAmount(value)
    }
  }

  // ======================= Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }

  function handleShow() {
    setShow(true)
  }

  function getVendorDataListByProjectID(temProjectID: number) {
    state.selPenaltyForID = 0
    state.selHeadOfDepartmentID = 0
    GetVendor_DropdownListByProjectIDAPI(temProjectID).then((response) => {
      let responseData = response.data.responseObject
      if (response.data.isSuccess == true) {
        setState({
          ...state,
          vendorData: responseData,
          selProjectID: temProjectID,
          loading: false,
        })
      } else {
        toast.error(`${response.data.massege}`)
        setState({
          ...state,
          vendorData: [],
          loading: false,
        })
      }
    })
  }

  // --------For Model Data onClick Function-------
  function selectProject(tmpProjectData: IProjectModel) {
    formik.setFieldValue('projectID', tmpProjectData.projectID)
    formik.setFieldValue('projectName', tmpProjectData.projectName)
    formik.setFieldValue('customerName', tmpProjectData.firstName + ' ' + tmpProjectData.lastName)
    formik.setFieldValue('projectCategoryName', tmpProjectData.projectCategoryName)
    formik.setFieldValue('projectAmount', tmpProjectData.projectAmount)
    formik.setFieldValue('paidAmount', tmpProjectData.paidAmount)
    formik.setFieldValue('remainigAmt', tmpProjectData.remainingAmount)
    formik.setFieldValue('projectStatusName', tmpProjectData.projectStatusName)
    getVendorDataListByProjectID(tmpProjectData.projectID)
    // setState({...state, selProjectID: tmpProjectData.projectID})
    setShow(false)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'penaltyTypeID') {
      formik.setFieldValue('penaltyTypeID', parseInt(value))
    } else if (elementId === 'designerID') {
      formik.setFieldValue('designerID', parseInt(value))
      setState({...state, selEmpVendorID: parseInt(value)})
    } else if (elementId === 'headOfDepartmentID') {
      formik.setFieldValue('approvalForID', parseInt(value))
      setState({...state, selHeadOfDepartmentID: parseInt(value)})
    } else if (elementId === 'penaltyForID') {
      formik.setFieldValue('penaltyForID', parseInt(value))
      setState({
        ...state,
        selPenaltyForID: parseInt(value),
        selDepartmentID: 0,
        selHeadOfDepartmentID: 0,
        selEmpVendorID: 0,
      })
    } else if (elementId === 'departmentID') {
      formik.setFieldValue('departmentID', parseInt(value))
      getEmployeeListByDepartmentIDData(parseInt(value))
    }
  }

  // ------------Pagintion ------------
  const [total, setTotal] = useState(state.projectData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // --------Search For Project -------
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProjectData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toString()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectData: state.tmpProjectData})
      setTotal(state.tmpProjectData.length)
      setPage(1)
    }
    setName(keyword)
  }

  const formik = useFormik<IGeneratePenaltyModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (amount == '') {
          setLoading(false)
          return toast.error('Please Enter Amount')
        }
        UpdateGeneratePenaltyDetailsAPI(
          parseInt(penaltyID),
          state.selProjectID,
          values.designerID,
          values.penaltyTypeID,
          parseInt(amount),
          values.remarks,
          '192.168.0.1',
          values.penaltyForID,
          values.approvalForID,
          values.departmentID
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Updated Successfull')
              history.push({pathname: '/generate-penalty/list', state: {mainSearch: searchName}})
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
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{pathname: '/generate-penalty/list', state: {mainSearch: searchName}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Project:
                </label>
                <div className={state.selProjectID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Project Name'
                    disabled
                    {...formik.getFieldProps('projectName')}
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
                <label
                  className={
                    state.selProjectID > 0
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  Customer Name:
                </label>
                <div className={state.selProjectID > 0 ? 'col-lg-4 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Customer Name'
                    disabled
                    {...formik.getFieldProps('customerName')}
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Penalty Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='penaltyTypeID'
                  >
                    <option selected value='0'>
                      Select Penalty Type
                    </option>
                    {state.penaltyTypeData.length > 0 &&
                      state.penaltyTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.penaltyTypeID}
                            selected={data.penaltyTypeID == state.selPenaltyTypeID}
                          >
                            {data.penaltyTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.penaltyTypeID && formik.errors.penaltyTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.penaltyTypeID}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Penalty For:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='penaltyForID'
                  >
                    <option selected value='0'>
                      Select Penalty For
                    </option>
                    {penaltyForData.length > 0 &&
                      penaltyForData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.penaltyForID}
                            selected={data.penaltyForID == state.selPenaltyForID}
                          >
                            {data.penaltyForName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.penaltyForID && formik.errors.penaltyForID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.penaltyForID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label
                  className={
                    state.selPenaltyForID == 1
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  Department:
                </label>
                <div className={state.selPenaltyForID == 1 ? 'col-lg-4 fv-row' : 'd-none'}>
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
                            selected={data.departmentID == state.selDepartmentID}
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
                <label
                  className={
                    state.selPenaltyForID == 1
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  Employee:
                </label>

                <div className={state.selPenaltyForID == 1 ? 'col-lg-4 fv-row' : 'd-none'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='designerID'
                  >
                    <option value='0'>Select Employee</option>
                    {state.employeeData.length > 0 &&
                      state.employeeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.empVendorID}
                            selected={data.empVendorID == state.selEmpVendorID}
                          >
                            {data.empVendorName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.designerID && formik.errors.designerID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.designerID}</div>
                    </div>
                  )}
                </div>
                <label
                  className={
                    state.selPenaltyForID == 2
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  Vendor:
                </label>

                <div className={state.selPenaltyForID == 2 ? 'col-lg-4 fv-row' : 'd-none'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='designerID'
                  >
                    <option value='0'>Select Vendor</option>
                    {state.vendorData.length > 0 &&
                      state.vendorData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.empVendorID}
                            selected={data.empVendorID == state.selEmpVendorID}
                          >
                            {data.empVendorName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.designerID && formik.errors.designerID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.designerID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label
                  className={
                    state.selPenaltyForID == 1
                      ? 'col-lg-2 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  HOD Approval:
                </label>
                <div className={state.selPenaltyForID == 1 ? 'col-lg-4 fv-row' : 'd-none'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='headOfDepartmentID'
                  >
                    <option selected value='0'>
                      Select Approval For HOD
                    </option>
                    {state.headOfDepartmentData.length > 0 &&
                      state.headOfDepartmentData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.headOfDepartmentID}
                            selected={data.headOfDepartmentID == state.selHeadOfDepartmentID}
                          >
                            {data.headOfDepartmentName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.approvalForID && formik.errors.approvalForID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.approvalForID}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Penalty Amount:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Penalty Amount'
                    id='penaltyAmount'
                    value={amount}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Remarks:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={4}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Ticket Remarks...'
                    {...formik.getFieldProps('remarks')}
                  />
                  {formik.touched.remarks && formik.errors.remarks && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.remarks}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading || fileLoader}>
                {!loading && !fileLoader && 'Save'}
                {(loading || fileLoader) && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>{' '}
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/generate-penalty/list', state: {mainSearch: searchName}}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* ----------------------------Project Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Project Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  onChange={filter}
                  value={name}
                />
              </form>
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Mobile Number</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Category Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="border-bottom">
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={'bg-hover-light-primary text-hover-primary'}
                          onClick={() => selectProject(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.projectName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.firstName + ' ' + data.lastName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.mobileNumber}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectCategoryName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectStatusName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={currentPosts.length}
                    loading={state.loading}
                    colSpan={9}
                  />
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

export {UpdatePenalty}
