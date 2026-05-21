import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {Button, Modal} from 'react-bootstrap-v5'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {IEmployeeEducationModel} from '../../../../models/organization-page/Employee/IEmployeeEducationModel'
import {
  deleteEmpEducation,
  getAllEmpEducationByEmpID,
  isActiveEmpEducation,
} from '../../../../modules/organization-page/employee-master-page/education-details/EmployeeEducationCRUD'
import {Pagination} from 'antd'
import {ModelPopUpIsActive} from '../../../common-pages/ModelPopUpIsActive'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'

type Props = {}

interface IEmpEducation {
  loading: boolean
  empEducationData: IEmployeeEducationModel[]
  tmpEmpEducationData: IEmployeeEducationModel[]
  empEducation: IEmployeeEducationModel
  selEmployeeID: number
  selEmpEdu: number
  activeID: number
  activeType: any
  mainSearch: string
}

const EmployeeEducationDetails: React.FC<Props> = () => {
  const location = useLocation()
  const {employeeID} = useParams<{employeeID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IEmpEducation>({
    loading: false,
    empEducationData: [] as IEmployeeEducationModel[],
    tmpEmpEducationData: [] as IEmployeeEducationModel[],
    empEducation: {} as IEmployeeEducationModel,
    selEmployeeID: 0,
    selEmpEdu: 0,
    activeID: 0,
    activeType: false,
    mainSearch: '',
  })

  const [show, setShow] = useState(false)

  function handleClose() {
    setShow(false)
  }

  function handleShow(data: IEmployeeEducationModel) {
    setState({...state, empEducation: data})
    setShow(true)
  }

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)

      var mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      // let empID = localStorage.getItem('editEmpID')!
      // let finalempID: number = JSON.parse(empID)
      getEmpEducationDataByEmpID(parseInt(employeeID), mainSearch)
    }, 100)
  }, [])

  function getEmpEducationDataByEmpID(finalempID: number, mainSearch: string) {
    getAllEmpEducationByEmpID(finalempID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.eduDepartmentName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.instituteName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.passingYear.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              empEducationData: results,
              tmpEmpEducationData: responseData,
              selEmployeeID: finalempID,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              empEducationData: responseData,
              tmpEmpEducationData: responseData,
              selEmployeeID: finalempID,

              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          setTotal(responseData.length)
          setPage(1)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, empEducationData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [showDelete, setShowDelete] = useState(false)
  const handleCloseDelete = () => setShowDelete(false)
  const handleShowDelete = (employeeEducationID: number) => {
    setState({
      ...state,
      selEmpEdu: employeeEducationID,
      loading: false,
    })
    setShowDelete(true)
  }

  function deleteEducationDetails(empEduId: any) {
    deleteEmpEducation(empEduId)
      .then((response) => {
        toast.success('Deleted Successfully')
        getEmpEducationDataByEmpID(state.selEmployeeID, state.mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =================Is Active Function Model Call==============

  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  function handleShowActive(event: any) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: Cid,
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    isActiveEmpEducation(temEmpId, temIsAct)
      .then((response) => {
        getEmpEducationDataByEmpID(state.selEmployeeID, state.mainSearch)
        setShowActive(false)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpEmpEducationData.filter((user) => {
        return (
          user.eduDepartmentName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.instituteName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.passingYear.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, empEducationData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, empEducationData: state.tmpEmpEducationData})
      // If the text field is empty, show all users
      setTotal(state.tmpEmpEducationData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.empEducationData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IEmployeeEducationModel[] = state.empEducationData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  return (
    <>
      <React.Fragment>
        <div className={`card `}>
          {/* begin::Header */}
          <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
            {/* <h3 className='card-title align-items-start flex-column'> */}
            {/*  <span className='card-label fw-bolder fs-3 mb-1'>Employee Education Details</span>
            <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Employee</span> */}
            {/* </h3> */}

            <div className='card-header border-0 pt-4 px-0' id='kt_chat_contacts_header'>
              <span className='position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search Education'
                  onChange={filter}
                  value={name}
                />
              </span>
            </div>

            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
            >
              <Link
                to={{
                  pathname: `/organization/employee/edit/${state.selEmployeeID}/education/add`,
                  state: {mainSearch: name},
                }}
                className='btn btn-sm btn-light-primary'
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                Add New
              </Link>
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-150px'>Institute Name</th>
                    <th className='min-w-140px'>Subject Name</th>
                    <th className='min-w-140px'>Category Name</th>
                    <th className='min-w-140px'>Passing Year&nbsp;(%)</th>
                    <th className='min-w-140px'>isActive</th>
                    <th className='min-w-100px text-end'>Edit | Delete</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {/* =================== Loading ============== */}
                  <tr className={state.loading === true ? '' : 'd-none'}>
                    <td colSpan={8}>
                      <div className='d-flex justify-content-center mt-5 pt-5'>
                        <div
                          className='spinner-border'
                          style={{width: '3rem', height: '3rem'}}
                          role='status'
                        >
                          <span className='visually-hidden'>Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.instituteName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {/* {data.eduDepartmentName} */}
                              {data.subjectName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.eduCategoryName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.passingYear}&nbsp;({data.percentage}%)
                            </span>
                          </td>
                          <td>
                            <div className='form-check form-switch'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                id={`${data.employeeEducationID}`}
                                checked={data.isActive}
                                onChange={(e) => handleShowActive(e)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className='d-flex justify-content-end flex-shrink-0'>
                              {/* <span
                                className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1 text-success text-hover-light'
                                onClick={() => handleShow(data)}
                              >
                                <span className='fa fa-eye lg'></span>
                              </span> */}
                              <Link
                                // to={`/employees/edit/education/${data.employeeEducationID}`}
                                to={{
                                  pathname: `/organization/employee/edit/${state.selEmployeeID}/education/edit/${data.employeeEducationID}`,
                                  state: {mainSearch: name},
                                }}
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/art/art005.svg'
                                  className='svg-icon-3 svg-icon-primary'
                                />
                              </Link>
                              <div
                                onClick={() => handleShowDelete(data.employeeEducationID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='svg-icon-3 svg-icon-danger'
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  {/* =================== Image no data ============== */}
                  <tr
                    className={currentPosts.length === 0 && state.loading === false ? '' : 'd-none'}
                  >
                    <td colSpan={9}>
                      <div className='d-flex justify-content-center mt-3 pt-3 fs-5'>
                        No data found
                      </div>
                      <div className='d-flex justify-content-center mt-2 pt-2'>
                        <img
                          className='w-25'
                          src={toAbsoluteUrl('/media/illustrations/sigma-1/13-dark.png')}
                          alt=''
                        />
                      </div>
                    </td>
                  </tr>
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
        </div>
        {/* =====================Delete Model PopUp=============== */}
        <ModelPopUpDelete
          id={state.selEmpEdu}
          pageName={'Employee Education'}
          show={show}
          handleClose={handleClose}
          deleteData={() => deleteEducationDetails(state.selEmpEdu)}
        />

        {/* ===================Is Active Model===================== */}
        <ModelPopUpIsActive
          activeID={state.activeID}
          activeType={state.activeType}
          pageName={'Employee Education'}
          showActive={showActive}
          handleCloseActive={handleCloseActive}
          IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
        />
        {/* -------------------- View -------------------- */}
        <Modal size='lg' scrollable={true} show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>View Education Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='card-body pt-2'>
              <div className='row g-4'>
                <span className='col-6 col-sm-4 text-gray-800 text-hover-primary fw-bold'>
                  Education Category Name :
                </span>
                <span className='col-6 col-sm-4 fw-bolder fs-4'>
                  {state.empEducation.eduCategoryName}
                </span>
              </div>
              <div className='row g-4'>
                <span className='col-6 col-sm-4 text-gray-800 text-hover-primary fw-bold'>
                  Institute Name :
                </span>
                <span className='col-6 col-sm-4 fw-bolder fs-4'>
                  {state.empEducation.instituteName}
                </span>
              </div>
              <div className='w-100 border-bottom d-md-block my-1'></div>
              <div className='row g-4'>
                <span className='col-6 col-sm-4 text-gray-800 text-hover-primary fw-bold'>
                  Education Department Name :
                </span>
                <span className='col-6 col-sm-4 fw-bolder fs-4'>
                  {state.empEducation.eduDepartmentName}
                </span>
              </div>
              <div className='w-100 border-bottom d-md-block my-1'></div>
              <div className='row g-4'>
                <span className='col-6 col-sm-4 text-gray-800 text-hover-primary fw-bold'>
                  Passing Year :
                </span>
                <span className='col-6 col-sm-4 fw-bolder fs-4'>
                  {state.empEducation.passingYear}
                </span>
              </div>
              <div className='w-100 border-bottom d-md-block my-1'></div>
              <div className='row g-4'>
                <span className='col-6 col-sm-4 text-gray-800 text-hover-primary fw-bold'>
                  Percentage :
                </span>
                <span className='col-6 col-sm-4 fw-bolder fs-4'>
                  {state.empEducation.percentage}
                </span>
              </div>
              <div className='w-100 border-bottom d-md-block my-1'></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    </>
  )
}

export default EmployeeEducationDetails
