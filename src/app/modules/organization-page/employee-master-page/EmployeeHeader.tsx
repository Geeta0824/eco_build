/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {useLocation} from 'react-router'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {employeePhotoApi} from './EmployeeCRUD'
import {toast} from 'react-toastify'

interface IEmployeeEdit {
  loading: boolean
  newEmployeeID: number
  mainBranchID: number
  selEmployeeName: string
  employeeCode: string
  mainSearch: string
}

const EmployeeHeader: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const {employeeID} = useParams<{employeeID: string}>()
  const {empDocMapID} = useParams<{empDocMapID: string}>()
  const [photo, setPhoto] = useState('')
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IEmployeeEdit>({
    loading: false,
    newEmployeeID: 0,
    mainBranchID: 0,
    selEmployeeName: '',
    employeeCode: '',
    mainSearch: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let employeeName: any = lc.empName
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc.mainBranchID !== undefined || lc.mainSearch !== undefined) {
        mainBranchID = lc.mainBranchID
        mainSearch = lc.mainSearch
      }

      // let empName = localStorage.getItem('editEmpName')!
      // let employeeName: string = JSON.parse(empName)
      getEmployeeData(employeeName, mainBranchID, mainSearch)
    }, 100)
  }, [])

  function getEmployeeData(selEmployeeName: string, mainBranchID: number, mainSearch: string) {
    employeePhotoApi(parseInt(employeeID))
      .then((response) => {
        let resultData = response.data
        setState({
          ...state,
          loading: false,
          newEmployeeID: parseInt(employeeID),
          selEmployeeName: selEmployeeName,
          employeeCode: resultData.employeeCode,
          mainBranchID,
          mainSearch,
        })
        setPhoto(resultData.photoPath)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  // -----------------upload photo----------------------
  const photoUpload = (e: any) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + `/Employee/SaveEmployeePhoto/${state.newEmployeeID}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setPhoto(data)
        getEmployeeData(state.selEmployeeName, state.mainBranchID, state.mainSearch)
      })
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/organization/employee/list',
              state: {branchId: state.mainBranchID, search: state.mainSearch},
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-body pt-7 pb-0'>
          <div className='d-flex flex-wrap flex-sm-nowrap mb-1'>
            <div className='symbol symbol-125px me-4'>
              <div
                className='symbol-label'
                style={
                  photo !== ''
                    ? {backgroundImage: `url(${process.env.REACT_APP_API_URL + photo})`}
                    : {backgroundImage: `url('${toAbsoluteUrl('/media/avatars/blank.png')}')`}
                }
              >
                {/* <!--begin::Image input--> */}
                <div className='image-input image-input-empty' data-kt-image-input='true'>
                  {/* <!--begin::Image preview wrapper--> */}
                  <div className='image-input-wrapper w-125px h-125px'></div>
                  {/* <!--end::Image preview wrapper--> */}
                  {/* <!--begin::Edit button--> */}
                  <label
                    className='btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h- 
                   25px bg-body shadow'
                    data-kt-image-input-action='change'
                    data-bs-toggle='tooltip'
                    data-bs-dismiss='click'
                    title='Change avatar'
                  >
                    <i className='bi bi-pencil-fill fs-7'></i>
                    {/* <!--begin::Inputs--> */}
                    <input
                      type='file'
                      onChange={photoUpload}
                      name='avatar'
                      accept='.png, .jpg, .jpeg'
                    />
                    {/* <!--end::Inputs--> */}
                  </label>
                  {/* <!--end::Edit button--> */}
                </div>
                {/* <!--end::Image input--> */}
              </div>
            </div>
            {/* <div className='me-7 mb-4'>
            <div className='symbol symbol-75px symbol-lg-120px symbol-fixed position-relative'>
              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='profile img' />
              {/* <div className='position-absolute translate-middle bottom-0 start-100 mb-15 bg-white 
               rounded-circle border border-4 border-white w-20px' onClick={photoUpload}>
                <KTSVG
                  path='/media/icons/duotune/art/art005.svg'
                  className='svg-icon-3 svg-icon-primary pt-0'
                />
              </div>
            </div>
          </div> */}
            <div className='flex-grow-1 ms-5'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column'>
                  <div className='d-flex align-items-center'>
                    <span className='text-primary text-hover-dark cursor-pointer fs-1 fw-bolder me-1'>
                      {state.selEmployeeName}
                    </span>
                  </div>
                  {/* <div className='d-flex align-items-center'>
                  <span className='text-primary text-hover-dark cursor-pointer fs-3 fw-bolder me-1'>
                    {state.employeeCode}
                  </span>
                </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className='d-flex overflow-auto h-55px'>
            {location.pathname === `/organization/employee/view/${state.newEmployeeID}/personal` ||
            location.pathname === `/organization/employee/view/${state.newEmployeeID}/address` ||
            location.pathname === `/organization/employee/view/${state.newEmployeeID}/bank/list` ||
            location.pathname ===
              `/organization/employee/view/${state.newEmployeeID}/education/list` ||
            location.pathname ===
              `/organization/employee/view/${state.newEmployeeID}/document/list` ? (
              <ul
                className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw- 
             bolder flex-nowrap'
              >
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/employee/view/${state.newEmployeeID}/personal` && 'active')
                    }
                    to={`/organization/employee/view/${state.newEmployeeID}/personal`}
                  >
                    Personal
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/employee/view/${state.newEmployeeID}/address` && 'active')
                    }
                    to={`/organization/employee/view/${state.newEmployeeID}/address`}
                  >
                    Address
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      ((location.pathname ===
                        `/organization/employee/view/${state.newEmployeeID}/bank/list` &&
                        'active') ||
                        (location.pathname ===
                          `/organization/employee/view/${state.newEmployeeID}/bank/add` &&
                          'active'))
                    }
                    to={`/organization/employee/view/${state.newEmployeeID}/bank/list`}
                  >
                    Bank Details
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      ((location.pathname ===
                        `/organization/employee/view/${state.newEmployeeID}/education/list` &&
                        'active') ||
                        (location.pathname ===
                          `/organization/employee/view/${state.newEmployeeID}/education/add` &&
                          'active'))
                    }
                    to={`/organization/employee/view/${state.newEmployeeID}/education/list`}
                  >
                    Education Details
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      ((location.pathname ===
                        `/organization/employee/view/${state.newEmployeeID}/document/list` &&
                        'active') ||
                        (location.pathname ===
                          `/organization/employee/view/${state.newEmployeeID}/document/add` &&
                          'active'))
                    }
                    to={`/organization/employee/view/${state.newEmployeeID}/document/list`}
                  >
                    Document Details
                  </Link>
                </li>
              </ul>
            ) : (
              <ul
                className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw- 
             bolder flex-nowrap'
              >
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/employee/edit/${state.newEmployeeID}/personal` && 'active')
                    }
                    to={{
                      pathname: `/organization/employee/edit/${state.newEmployeeID}/personal`,
                      state: {mainBranchID: state.mainBranchID, mainSearch: state.mainSearch},
                    }}
                  >
                    Personal
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        `/organization/employee/edit/${state.newEmployeeID}/address` && 'active')
                    }
                    to={{
                      pathname: `/organization/employee/edit/${state.newEmployeeID}/address`,
                      state: {mainBranchID: state.mainBranchID, mainSearch: state.mainSearch},
                    }}
                  >
                    Address
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      ((location.pathname ===
                        `/organization/employee/edit/${state.newEmployeeID}/bank/list` &&
                        'active') ||
                        (location.pathname ===
                          `/organization/employee/edit/${state.newEmployeeID}/bank/add` &&
                          'active'))
                    }
                    to={{
                      pathname: `/organization/employee/edit/${state.newEmployeeID}/bank/list`,
                       state: {mainBranchID: state.mainBranchID, mainSearch: state.mainSearch},
                    }}
                  >
                    Bank Details
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      ((location.pathname ===
                        `/organization/employee/edit/${state.newEmployeeID}/education/list` &&
                        'active') ||
                        (location.pathname ===
                          `/organization/employee/edit/${state.newEmployeeID}/education/add` &&
                          'active'))
                    }
                    to={{
                      pathname: `/organization/employee/edit/${state.newEmployeeID}/education/list`,
                       state: {mainBranchID: state.mainBranchID, mainSearch: state.mainSearch},
                    }}
                  >
                    Education Details
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      ((location.pathname ===
                        `/organization/employee/edit/${state.newEmployeeID}/document/list` &&
                        'active') ||
                        (location.pathname ===
                          `/organization/employee/edit/${state.newEmployeeID}/document/add` &&
                          'active'))
                    }
                    to={{
                      pathname: `/organization/employee/edit/${state.newEmployeeID}/document/list`,
                       state: {mainBranchID: state.mainBranchID, mainSearch: state.mainSearch},
                    }}
                  >
                    Document Details
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export {EmployeeHeader}
