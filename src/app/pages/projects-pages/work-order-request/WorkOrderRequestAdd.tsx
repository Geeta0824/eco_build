import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Button, Modal} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import Loader from '../../common-pages/Loader'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {getVenderWebList} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {venderTypeData} from '../../other-dropDowns/otherDropDowns'
import {Pagination} from 'antd'
import {
  IWorkOrderRequestModel,
  workOrderInitValues as initialValues,
} from '../../../models/projects-page/IWorkOrderRequestModel'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {getAllProjectListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectStageModel} from '../../../models/master-page/IProjectStatusModel'
import {
  AddWorkOrderRequestList_PMC_API,
  AddWorkOrderRequestListAPI,
  GetPMCStageList_ByProjectIDApi,
} from '../../../modules/project-master-page/work-order-request/WorkOrderRequestCRUD'
// import {
//   GetPMCWorkStatusDropDownListAPI,
//   AddWorkOrderRequestListAPI,
// } from '../../../modules/project-master-page/work-order-request/WorkOrderRequestCRUD'

const profileDetailsSchema = Yup.object().shape({
  vendorTypeID: Yup.string().required('Field Is Required').min(1, 'Field Is Required'),
  vendorID: Yup.string().required('Field Is Required').min(1, 'Field Is Required'),
  projectID: Yup.string().required('Field Is Required').min(1, 'Field Is Required'),
  assignDate: Yup.string().required('Field Is Required'),
  workCompleteDate: Yup.string().required('Field Is Required'),
})

interface IProjectVendor {
  loading: boolean
  vendorData: IVenderModel[]
  tmpVendorData: IVenderModel[]
  projectData: IProjectModel[]
  temProjectData: IProjectModel[]
  projectVendorData: IWorkOrderRequestModel[]
  projectStatusData: IProjectStageModel[]
  selVendorID: number
  selvendorTypeID: number
  selProjectID: number
  selProjStatusID: number
  mainSearch: string
}

const WorkOrderRequestAdd: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  const [projectFilePath, setProjectFilePath] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [data, setData] = useState<IWorkOrderRequestModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IWorkOrderRequestModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IProjectVendor>({
    loading: true,
    vendorData: [] as IVenderModel[],
    projectData: [] as IProjectModel[],
    temProjectData: [] as IProjectModel[],
    tmpVendorData: [] as IVenderModel[],
    projectVendorData: [] as IWorkOrderRequestModel[],
    projectStatusData: [] as IProjectStageModel[],
    selVendorID: 0,
    selvendorTypeID: 0,
    selProjectID: 0,
    selProjStatusID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getSearchVenderData(mainSearch)
    }, 100)
  }, [])

  function getSearchVenderData(mainSearch: string) {
    setState({...state, loading: false, mainSearch})
  }

  function getVenderData() {
    getVenderWebList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorData: responseData,
            tmpVendorData: responseData,
            loading: false,
          })
          setTotalVender(responseData.length)
          setPageVender(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
        setShowVendor(true)
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getAllProjectData() {
    getAllProjectListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectData: responseData,
            temProjectData: responseData,
            loading: false,
          })
          setTotalProject(responseData.length)
          setTotalProject(1)

          setTotalProject(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectData: [],
            loading: false,
          })
        }
        setShowProject(true)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          loading: false,
        })
      })
  }

  function getProjectStatusData(selProjectID: number) {
    GetPMCStageList_ByProjectIDApi(selProjectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectStatusData: responseData,
            selProjectID,
            loading: false,
          })
          setShowProject(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectStatusData: [],
            selProjectID,
            loading: false,
          })
          setShowProject(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectStatusData: [],
          loading: false,
        })
      })
  }
  function handleChange(e: any) {
    let id = e.target.id
    let value = e.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(value)) && re.test(value)) {
      formik.setFieldValue(`${id}`, parseInt(value))
    } else if (value == 0) {
      formik.setFieldValue(`${id}`, '')
    }
  }

  // -----------------upload photo----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/WorkOrderRequest/SaveWorkOrderReqDoc', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProjectFilePath(data)
        setFileLoader(false)
      })
    setFileLoader(false)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'vendorTypeID') {
      formik.setFieldValue('vendorTypeID', parseInt(value))
      setState({...state, selvendorTypeID: parseInt(value)})
    } else if (elementId === 'pmcWorkStageID') {
      formik.setFieldValue('pmcWorkStageID', parseInt(value))
      setState({...state, selProjStatusID: parseInt(value)})
    }
  }

  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }

  // --------For Model Data onClick Function-------
  function selectVendor(tmpVendorData: IVenderModel) {
    formik.setFieldValue('vendorID', tmpVendorData.vendorID)
    formik.setFieldValue('companyName', tmpVendorData.companyName)
    formik.setFieldValue('contactPerson', tmpVendorData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendorData.contactNumber)
    setState({...state, selVendorID: tmpVendorData.vendorID})
    setShowVendor(false)
  }

  // ======================= Project Model PopUp ======================
  const [showProject, setShowProject] = useState(false)
  function handleCloseProject() {
    setShowProject(false)
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
    if (state.selvendorTypeID == 1) {
      getProjectStatusData(tmpProjectData.projectID)
    } else {
      setState({...state, selProjectID: tmpProjectData.projectID})
      setShowProject(false)
    }
  }

  // ===================== For vendor Filter =====================
  const [nameVender, setNameVender] = useState('')
  const filterVender = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpVendorData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, vendorData: results})
      setTotalVender(results.length)
      setPageVender(1)
    } else {
      setState({...state, vendorData: state.tmpVendorData})
      setTotalVender(state.tmpVendorData.length)
      setPageVender(1)
    }
    setNameVender(keyword)
  }

  // --------Search For Project -------
  const [nameProject, setNameProject] = useState('')
  const filterProject = (e: any) => {
    const keyword = e.target.value
    let fullName: string = ''
    if (keyword !== '') {
      const results = state.temProjectData.filter((user) => {
        fullName = user.firstName + ' ' + user.lastName
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toString()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          fullName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectData: results})
      setTotalProject(results.length)
      setPageProject(1)
    } else {
      setState({...state, projectData: state.temProjectData})
      setTotalProject(state.temProjectData.length)
      setPageProject(1)
    }
    setNameProject(keyword)
  }

  // ------------------ Pagination Vender ---------------------
  // const [posts, setPosts] = useState([])  // data
  const [totalVender, setTotalVender] = useState(0) //  length
  const [pageVender, setPageVender] = useState(1)
  const [postPerPageVender, setPostPerPageVender] = useState(10)
  const indexOfLastPageVender = pageVender * postPerPageVender
  const indexOfFirstPageVender = indexOfLastPageVender - postPerPageVender
  const currentPostsVender: IVenderModel[] = state.vendorData.slice(
    indexOfFirstPageVender,
    indexOfLastPageVender
  )
  const onShowSizeChangeVender = (current: any, pageSize: any) => {
    setPostPerPageVender(pageSize)
  }

  const [totalProject, setTotalProject] = useState(state.projectData.length) //  length
  const [pageProject, setPageProject] = useState(1)
  const [postPerPageProject, setPostPerPageProject] = useState(10)
  const indexOfLastPageProject = pageProject * postPerPageProject
  const indexOfFirstPageProject = indexOfLastPageProject - postPerPageProject
  const currentPostsProject: IProjectModel[] = state.projectData.slice(
    indexOfFirstPageProject,
    indexOfLastPageProject
  )
  const onShowSizeChangeProject = (current: any, pageSize: any) => {
    setPostPerPageProject(pageSize)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IWorkOrderRequestModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.vendorTypeID == 1) {
          if (state.selProjStatusID == 0) {
            return toast.error(`Please Select Project Stage.`)
          } else {
            AddWorkOrderRequestList_PMC_API(
              values.assignDate,
              values.projectID,
              values.vendorID,
              `${values.vendorTypeID}`,
              values.pmcWorkStageID,
              values.description,
              projectFilePath,
              parseInt(values.amount),
              values.workCompleteDate,
              user.employeeID,
              '192.66.22'
            )
              .then((response) => {
                if (response.data.isSuccess == true) {
                  toast.success('Created Successfull')
                  history.push({
                    pathname: `/projects/work-order-request/list`,
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
          }
        } else {
          AddWorkOrderRequestListAPI(
            values.assignDate,
            values.projectID,
            values.vendorID,
            `${values.vendorTypeID}`,
            values.description,
            projectFilePath,
            parseInt(values.amount),
            values.workCompleteDate,
            user.employeeID,
            '192.66.22'
          )
            .then((response) => {
              if (response.data.isSuccess == true) {
                toast.success('Created Successfull')
                history.push({
                  pathname: `/projects/work-order-request/list`,
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
        }
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: `/projects/work-order-request/list`,
              state: {search: state.mainSearch},
            })
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <>
            <div className='card mb-5 mb-xl-10'>
              <div id='kt_account_profile_details' className='collapse show'>
                <form onSubmit={formik.handleSubmit} noValidate className='form'>
                  <div className='card-body border-top p-9 ms-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className='required'>Vendor Type:</span>
                      </label>
                      <div className='col-lg-4 fv-row'>
                        <select
                          className='form-select'
                          aria-label='Default select example'
                          onChange={selectChange}
                          id='vendorTypeID'
                        >
                          <option selected value={0}>
                            Select Vendor Type
                          </option>
                          {venderTypeData.length > 0 &&
                            venderTypeData.map((data, index) => {
                              return (
                                <option
                                  key={index}
                                  value={data.vendorTypeID}
                                  selected={
                                    state.selvendorTypeID == data.vendorTypeID ? true : false
                                  }
                                >
                                  {data.vendorTypeName}
                                </option>
                              )
                            })}
                        </select>
                        {formik.touched.vendorTypeID && formik.errors.vendorTypeID && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.vendorTypeID}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* ---------- Vendor ------------- */}
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Select Vendor:
                      </label>
                      <div className='col-lg-3 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg border-0 bg-white'
                          placeholder='Select Vendor'
                          disabled
                          {...formik.getFieldProps('companyName')}
                        />
                      </div>
                      <div className='col-lg-1 fv-row'>
                        <div
                          className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                          onClick={getVenderData}
                        >
                          <KTSVG
                            path='/media/icons/duotune/general/gen004.svg'
                            className='svg-icon-3 svg-icon-white'
                          />
                        </div>
                      </div>
                    </div>
                    {/* ---------- Project ------------- */}
                    <div className={'row mb-6'}>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Select Project:
                      </label>
                      <div className={'col-lg-3 fv-row'}>
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
                          onClick={getAllProjectData}
                        >
                          <KTSVG
                            path='/media/icons/duotune/general/gen004.svg'
                            className='svg-icon-3 svg-icon-white'
                          />
                        </div>
                      </div>
                    </div>
                    {/* ---------- Stage ------------- */}
                    <div className={state.selvendorTypeID === 1 ? 'row mb-6' : 'd-none'}>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Stage Type:
                      </label>
                      <div className='col-lg-6 fv-row'>
                        <select
                          className='form-select bg-light-primary'
                          aria-label='Default select example'
                          onChange={selectChange}
                          id='pmcWorkStageID'
                        >
                          <option selected={state.selProjStatusID === 0 ? true : false} value={0}>
                            Select Stage Type
                          </option>
                          {state.projectStatusData.length > 0 &&
                            state.projectStatusData.map((data, index) => {
                              return (
                                <option
                                  key={index}
                                  value={data.pmcWorkStageID}
                                  selected={
                                    data.pmcWorkStageID === state.selProjStatusID ? true : false
                                  }
                                >
                                  {data.stageName}
                                </option>
                              )
                            })}
                        </select>
                      </div>
                    </div>
                    {/* ---------- Desc ------------- */}
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className=''>Work Description:</span>
                      </label>
                      <div className='col-lg-10 fv-row'>
                        <textarea
                          rows={2}
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Work Description'
                          {...formik.getFieldProps('description')}
                        />
                        {formik.touched.description && formik.errors.description && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.description}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* ---------- Amt ------------- */}
                    {/* <div className={state.selvendorTypeID === 1 ? 'row mb-6' : 'd-none'}> */}
                    <div className={'row mb-6'}>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>Amount:</label>
                      <div className={'col-lg-2 fv-row'}>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Amount'
                          id='amount'
                          {...formik.getFieldProps('amount')}
                          onChange={handleChange}
                        />
                        {formik.touched.amount && formik.errors.amount && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.amount}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={'row mb-6'}>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Assign Date:
                      </label>
                      <div className='col-lg-3 fv-row'>
                        <input
                          type='date'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          {...formik.getFieldProps('assignDate')}
                        />
                        {formik.touched.assignDate && formik.errors.assignDate && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.assignDate}</div>
                          </div>
                        )}
                      </div>
                      <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                        Work Order Complete Date:
                      </label>
                      <div className='col-lg-3 fv-row'>
                        <input
                          type='date'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          {...formik.getFieldProps('workCompleteDate')}
                        />
                        {formik.touched.workCompleteDate && formik.errors.workCompleteDate && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.workCompleteDate}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className='d-block'>Attached Document:</span>
                        <p className='text-muted fs-7'> (allow only .pdf files)</p>
                      </label>
                      <div
                        className={
                          projectFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                        }
                      >
                        <div className='symbol symbol-45px me-5 cursor-pointer'>
                          {/* <img src={process.env.REACT_APP_API_URL + file} alt='img' /> */}
                          <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                        </div>
                      </div>
                      <div
                        className={projectFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'}
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

                  {/* ---------- btn ------------- */}
                  <div className='card-footer d-flex justify-content-end py-9'>
                    <button type='submit' className='btn btn-success me-5' disabled={loading}>
                      {!loading && 'Submit'}
                      {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...{' '}
                          <span className='spinner-border spinner-border-sm align-middle ms-5'></span>
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        history.push({
                          pathname: `/projects/work-order-request/list`,
                          state: {search: state.mainSearch},
                        })
                      }
                      className='btn btn-danger ms-3'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        </div>
      </div>

      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
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
                  onChange={(e) => filterVender(e)}
                  value={nameVender}
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Vendor Type Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Company Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPostsVender.length > 0 &&
                    currentPostsVender.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isActive === false
                          //     ? 'd-none'
                          //     : 'bg-hover-light-primary text-hover-primary'
                          // }
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {/* {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? ( */}
                            <div className='d-flex align-items-center'>
                              <div className='text-dark text-hover-primary fs-6'>
                                {data.companyName}
                              </div>
                            </div>
                            {/* ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )} */}
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
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
                onChange={(value: any) => setPageVender(value)}
                pageSize={postPerPageVender}
                total={totalVender}
                current={pageVender}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeVender}
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseVendor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ----------------------------Project Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={showProject} onHide={handleCloseProject}>
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
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  onChange={filterProject}
                  value={nameProject}
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Category Name</span>
                    </th>
                    {/* <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Paid Amount</span>
                    </th>
                    <th className='min-w-155px'>
                      <span className='d-block mb-1'>Remaining Amount</span>
                    </th> */}
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Status</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPostsProject.length > 0 &&
                    currentPostsProject.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary'
                          }
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

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectCategoryName}
                            </span>
                          </td>
                          {/* <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.paidAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.remainingAmount}
                            </span>
                          </td> */}
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectStatusName}
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
                onChange={(value: any) => setPageProject(value)}
                pageSize={postPerPageProject}
                total={totalProject}
                current={pageProject}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeProject}
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseProject}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {WorkOrderRequestAdd}
