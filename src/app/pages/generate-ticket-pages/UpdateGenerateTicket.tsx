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
  IGenerateTicketModel,
  generateTicketInitValue as initialValues,
} from '../../models/generate-ticket/GenerateTicketModel'
import {
  IDesignerEmployeeModel,
  IDesignerTicketCategoryModel,
} from '../../models/master-page/IDesignerTicketCategoryModel'
import {getAllDesignerTicketCategory} from '../../modules/master-page/designer-ticket-catgry-page/DesignerTicketCategoryCRUD'
import {
  AddGenerateTicketDetailsAPI,
  GetGenerateTicketByTicketIDAPI,
  UpdateGenerateTicketDetailsAPI,
  getDesignerEmployeeDropdownListAPI,
} from '../../modules/generate-ticket-master-page/GenerateTicketCRUD'
import {getAllProjectListByRoleIDAndEmployeeIDAPI} from '../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../models/projects-page/IProjectsModel'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {Pagination} from 'antd'

const profileDetailsSchema = Yup.object().shape({
  ticketRemarks: Yup.string().required('Task Name Field is required'),
  projectID: Yup.number().min(1, 'Please Select Project').required('Please Select Project'),
  categoryID: Yup.number()
    .min(1, 'Ticket Category Field is required')
    .required('Ticket Category Field is required'),
})

interface IDesignerTicketCategory {
  loading: boolean
  designerTicketCategoryData: IDesignerTicketCategoryModel[]
  roleDesignerEmployeeData: IDesignerEmployeeModel[]
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel[]
  selProjectID: number
  selCategoryID: number
  selAssignTo: number
  pathUrl: any
}

const UpdateGenerateTicket: React.FC = () => {
  const [data, setData] = useState<IGenerateTicketModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const {ticketID} = useParams<{ticketID: string}>()
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [file, setFile] = useState('')
  const [searchName, setSearchName] = useState('')
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IGenerateTicketModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [state, setState] = useState<IDesignerTicketCategory>({
    loading: false,
    designerTicketCategoryData: [] as IDesignerTicketCategoryModel[],
    roleDesignerEmployeeData: [] as IDesignerEmployeeModel[],
    projectData: [] as IProjectModel[],
    tmpProjectData: [] as IProjectModel[],
    selProjectID: 0,
    selCategoryID: 0,
    selAssignTo: 0,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  const location = useLocation()

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      setSearchName(mainSearch)
      getRoleDesignerEmployeeData()
    }, 100)
  }, [])

  function getRoleDesignerEmployeeData() {
    getDesignerEmployeeDropdownListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getAllProjectByRoleIdData(responseData)
        } else {
          toast.error(`${response.data.massege}`)
          setState({
            ...state,
            designerTicketCategoryData: [],
            roleDesignerEmployeeData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          designerTicketCategoryData: [],
          roleDesignerEmployeeData: [],
          loading: false,
        })
      })
  }

  function getAllProjectByRoleIdData(temDesignEmpData: IDesignerEmployeeModel[]) {
    getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
      .then((response) => {
        let responseData = response.data
        let projectData = responseData.responseObject
        if (responseData.isSuccess == true) {
          getGenerateTicketByIDData(temDesignEmpData, projectData)
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

  function getGenerateTicketByIDData(
    temDesignEmpData: IDesignerEmployeeModel[],
    temProjectData: IProjectModel[]
  ) {
    GetGenerateTicketByTicketIDAPI(parseInt(ticketID))
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          const temProjectID = responseData.projectID
          const temAssignTo = responseData.assignTo
          const temCategoryID = responseData.categoryID
          formik.setFieldValue('projectID', responseData.projectID)
          formik.setFieldValue('assignTo', responseData.assignTo)
          formik.setFieldValue('categoryID', responseData.categoryID)
          formik.setFieldValue('dueDate', responseData.dueDate)
          formik.setFieldValue('ticketRemarks', responseData.ticketRemarks)
          formik.setFieldValue('projectName', responseData.projectName)
          formik.setFieldValue('customerName', responseData.customerName)
          setFile(responseData.photoPath)
          getDesignerTicketCategoryData(
            temDesignEmpData,
            temProjectData,
            temProjectID,
            temAssignTo,
            temCategoryID
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

  function getDesignerTicketCategoryData(
    temDesignEmpData: IDesignerEmployeeModel[],
    temProjectData: IProjectModel[],
    temProjectID: number,
    temAssignTo: number,
    temCategoryID: number
  ) {
    getAllDesignerTicketCategory()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          setState({
            ...state,
            designerTicketCategoryData: responseData.responseObject,
            roleDesignerEmployeeData: temDesignEmpData,
            projectData: temProjectData,
            tmpProjectData: temProjectData,
            selProjectID: temProjectID,
            selAssignTo: temAssignTo,
            selCategoryID: temCategoryID,
            loading: false,
          })
          setTotal(temProjectData.length)
        } else {
          toast.error(`${response.data.massege}`)
          setState({
            ...state,
            designerTicketCategoryData: [],
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
          designerTicketCategoryData: [],
          tmpProjectData: [],
          projectData: [],
          loading: false,
        })
      })
  }

  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(state.pathUrl + '/GenerateTicket/UploadGenerateTicketPhoto', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFile(data)
        setFileLoader(false)
      })
  }

  // ======================= Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'ticketCategoryID') {
      formik.setFieldValue('categoryID', parseInt(value))
    } else if (elementId === 'designarID') {
      formik.setFieldValue('assignTo', parseInt(value))
    }
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
    setState({...state, selProjectID: tmpProjectData.projectID})
    setShow(false)
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

  const formik = useFormik<IGenerateTicketModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        UpdateGenerateTicketDetailsAPI(
          parseInt(ticketID),
          state.selProjectID,
          values.assignTo,
          values.categoryID,
          file,
          values.ticketRemarks,
          values.dueDate,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Updated Successfull')
              history.push({pathname: '/generate-ticket/list', state: {mainSearch: searchName}})
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
            to={{pathname: '/generate-ticket/list', state: {mainSearch: searchName}}}
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
                  Ticket Category:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='ticketCategoryID'
                  >
                    <option selected value='0'>
                      Select Ticket Category
                    </option>
                    {state.designerTicketCategoryData.length > 0 &&
                      state.designerTicketCategoryData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.designerTicketCategoryID}
                            selected={data.designerTicketCategoryID == state.selCategoryID}
                          >
                            {data.title}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.categoryID && formik.errors.categoryID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.categoryID}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Assign To Designer:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='designarID'
                  >
                    <option selected value='0'>
                      Select Assign To Designer
                    </option>
                    {state.roleDesignerEmployeeData.length > 0 &&
                      state.roleDesignerEmployeeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.designerID}
                            selected={data.designerID == state.selAssignTo}
                          >
                            {data.designarName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.assignTo && formik.errors.assignTo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.assignTo}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Due Date:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    {...formik.getFieldProps('dueDate')}
                  />
                  {formik.touched.dueDate && formik.errors.dueDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.dueDate}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Upload File:</span>
                </label>
                <div className='col-lg-1 d-flex align-items-center'>
                  <div className='symbol symbol-45px me-5'>
                    <img src={state.pathUrl + file} alt='img' />
                  </div>
                </div>
                <div className='col-lg-9 fv-row'>
                  <input
                    type='file'
                    accept='image/*'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUploadQuotation(e)}
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
                    {...formik.getFieldProps('ticketRemarks')}
                  />
                  {formik.touched.ticketRemarks && formik.errors.ticketRemarks && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.ticketRemarks}</div>
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
                to={{pathname: '/generate-ticket/list', state: {mainSearch: searchName}}}
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
                    {/* <th className='min-w-150px'>
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
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            // data.isActive === false
                            //   ? 'd-none'
                            //   :
                            'bg-hover-light-primary text-hover-primary'
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
                          {/* <td className=''>
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

export {UpdateGenerateTicket}
