import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RootState} from '../../../../setup'
import {IDepartmentModel} from '../../../models/organization-page/IDepartmentModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {getDropDownDepartmentData} from '../../../modules/master-page/department-master-page/DepartmentCRUD'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {IUserModel} from '../../../models/organization-page/user/IUserModel'
import {
  deleteUser,
  getAllUserList,
  isActiveUser,
} from '../../../modules/organization-page/user-master-page/UserCRUD'

type Props = {}

interface IEmployee {
  loading: boolean
  userData: IUserModel[]
  tmpUserData: IUserModel[]
  departmentData: IDepartmentModel[]
  activeID: number
  activeType: any
  selDeprtId: number
  selUserId: number
  mainSearch: string
}

const User: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IEmployee>({
    loading: false,
    userData: [] as IUserModel[],
    tmpUserData: [] as IUserModel[],
    departmentData: [] as IDepartmentModel[],
    activeID: 0,
    activeType: false,
    selDeprtId: 0,
    selUserId: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getUserData(mainSearch)
    }, 100)
  }, [])

  function getUserData(mainSearch: string) {
    getAllUserList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.userName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.departmentName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.roleName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.employeeName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              userData: results,
              tmpUserData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              userData: responseData,
              tmpUserData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, userData: [], tmpUserData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, userData: [], tmpUserData: [], loading: false})
      })
  }

  // -----------------Is Active model----------------------
  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)
  const handleShowActive = (event: any) => {
    const temEmpId = event.target.id
    const temIsAct = event.target.checked
    setState({
      ...state,
      activeID: temEmpId,
      activeType: temIsAct,
    })
    setShowActive(true)
  }

  // ---------------------- Is Active employee api -------------------------
  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    isActiveUser(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getUserData(state.mainSearch)
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  // -----------------Delete model----------------------
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (userID: number) => {
    setState({
      ...state,
      selUserId: userID,
    })
    setShow(true)
  }

  // ----------------------delete employee api-------------------------
  function deleteItem(temImpId: number) {
    deleteUser(temImpId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getUserData(state.mainSearch)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ---------------------------getDepartmentIdValue filter--------------
  function getDepartmentIdValue(event: any) {
    const departValue = event.target.value
    filtergetDepartmentIdValue(departValue)
  }

  function filtergetDepartmentIdValue(departValue: number) {
    const tmprows = []
    const Rows = tmpUserData
    let tmpSelDeprtId = 0
    for (let key in Rows) {
      if (Rows[key].departmentID == departValue) {
        tmpSelDeprtId = Rows[key].departmentID
        tmprows.push(Rows[key])
      }
      // if (state.selBranchId != 0 && state.selDesignId != 0) {
      //   if (
      //     Rows[key].branchID == state.selBranchId &&
      //     Rows[key].departmentID == departValue &&
      //     Rows[key].designationID == state.selDesignId
      //   ) {
      //     tmprows.push(Rows[key])
      //   }
      // } else if (state.selBranchId != 0 || state.selDesignId != 0) {
      //   if (state.selBranchId != 0) {
      //     if (Rows[key].branchID == state.selBranchId && Rows[key].departmentID == departValue) {
      //       tmprows.push(Rows[key])
      //     }
      //   } else if (state.selDesignId != 0) {
      //     if (Rows[key].departmentID == departValue && Rows[key].designationID == state.selDesignId) {
      //       tmprows.push(Rows[key])
      //     }
      //   }
      // } else {
      //   if (Rows[key].departmentID == departValue) {
      //     tmprows.push(Rows[key])
      //   }
      // }
    }
    if (departValue == 0) {
      setState({
        ...state,
        selDeprtId: tmpSelDeprtId,
      })
      setTotal(tmpUserData.length)
      setPage(1)
    } else {
      // setState({...state, employeeData: temRows, selDeprtId: tmpSelDeprtId})
    }
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpUserData.filter((user) => {
        return (
          user.userName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.departmentName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.roleName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.employeeName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, userData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, userData: tmpUserData})
      setTotal(tmpUserData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    setState({
      ...state,
      selDeprtId: 0,
    })
    // setCurrentPage(1)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.userData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IUserModel[] = state.userData.slice(indexOfFirstPage, indexOfLastPage)

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  let {tmpUserData, userData} = state

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <div className='pt-4'>
            <select
              className='form-select form-select-white bg-white'
              onChange={(e) => getDepartmentIdValue(e)}
            >
              <option selected value={0}>
                Select Department
              </option>
              {departmentData.length > 0 &&
                departmentData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.departmentID}
                      selected={selDeprtId == data.departmentID ? true : false}
                    >
                      {data.departmentName}
                    </option>
                  )
                })}
            </select>
          </div> */}

          {/* <div className='col-xl-1 col-sm-6 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div> */}

          <div className='card-header border-0 pt-4 p-0' id='kt_chat_contacts_header'>
            <span className='position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-20 bg-white'
                // name='search'
                placeholder='Search employee'
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
              to={{pathname: '/organization/user/add', state: {mainSearch: name}}}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-120px'>Employee Name</th>
                  <th className='min-w-120px'>User Name</th>
                  <th className='min-w-120px'>Department</th>
                  <th className='min-w-120px'>Role</th>
                  <th className='min-w-120px'>Reset PWD</th>
                  <th className='w-25px'>Active</th>
                  <th className='w-25px'>View</th>
                  <th className='w-25px'>Edit</th>
                  <th className='w-25px text-end'>Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.employeeName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>{data.userName}</td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.departmentName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>{data.roleName}</td>
                        <td className=''>
                          <Link
                            to={{
                              pathname: `/organization/user/resetPassword/${data.userID}`,
                              state: {mainSearch: name},
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-key fs-2'></span>
                          </Link>
                        </td>
                        <td className=''>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.userID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td className=''>
                          <Link
                            to={{
                              pathname: `/organization/user/view/${data.userID}`,
                              state: {mainSearch: name},
                            }}
                            // to={`/organization/user/view/${data.userID}`}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                        <td className=''>
                          <Link
                            to={{
                              pathname: `/organization/user/edit/${data.userID}`,
                              state: {mainSearch: name},
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Edit'
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/art005.svg'
                              className='svg-icon-3 svg-icon-primary'
                            />
                          </Link>
                        </td>
                        <td className=''>
                          <div className='justify-content-end flex-shrink-0'>
                            <div
                              onClick={() => handleShow(data.userID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Delete'
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
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
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
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selUserId}
        pageName={'Employee'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteItem(state.selUserId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Employee'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default User
