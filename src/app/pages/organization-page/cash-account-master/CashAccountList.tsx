import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RootState} from '../../../../setup'
import {IDepartmentModel} from '../../../models/organization-page/IDepartmentModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {
  DeleteCashAccountAPI,
  GetCashAccountListAPI,
  IsActiveCashAccountAPI,
} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'

type Props = {}

interface IEmployee {
  loading: boolean
  cashAccountData: ICashAccountModel[]
  tmpCashAccountData: ICashAccountModel[]
  departmentData: IDepartmentModel[]
  activeID: number
  activeType: any
  selCashAccountID: number
  selCashAccountTypeID: number
  mainSearch: string
}

const CashAccountList: React.FC<Props> = () => {
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IEmployee>({
    loading: false,
    cashAccountData: [] as ICashAccountModel[],
    tmpCashAccountData: [] as ICashAccountModel[],
    departmentData: [] as IDepartmentModel[],
    activeID: 0,
    activeType: false,
    selCashAccountID: 0,
    selCashAccountTypeID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getCashAccountData(mainSearch)
    }, 100)
  }, [])

  function getCashAccountData(mainSearch: string) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.accountName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.cashAccountTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.accountBalance.toString().includes(mainSearch.toLowerCase()) ||
                user.cashAccountRoleName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })
            setState({
              ...state,
              cashAccountData: results,
              tmpCashAccountData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              cashAccountData: responseData,
              tmpCashAccountData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: [], tmpCashAccountData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: [], tmpCashAccountData: [], loading: false})
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
    IsActiveCashAccountAPI(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getCashAccountData(state.mainSearch)
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
  const handleShow = (cashAccountID: number) => {
    setState({
      ...state,
      selCashAccountID: cashAccountID,
    })
    setShow(true)
  }

  // ----------------------delete employee api-------------------------
  function deleteItem(temImpId: number) {
    DeleteCashAccountAPI(temImpId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getCashAccountData(state.mainSearch)
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

  //------------------- the search result-----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpCashAccountData.filter((user) => {
        return (
          user.accountName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.accountBalance.toString().includes(keyword.toLowerCase()) ||
          user.cashAccountRoleName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setName(keyword)
      setState({...state, cashAccountData: results})
      setTotal(results.length)
    } else {
      setState({...state, cashAccountData: state.tmpCashAccountData})
      setTotal(state.tmpCashAccountData.length)
      setName(keyword)
    }
    setName(keyword)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.cashAccountData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICashAccountModel[] = state.cashAccountData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
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
              to={{pathname: '/organization/cashaccount/add', state: {mainSearch: name}}}
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
                  <th className='min-w-120px'>Account Name</th>
                  {/* <th className='min-w-120px'>Bank Name</th> */}
                  {/* <th className='min-w-120px'>Employee Name</th> */}
                  <th className='min-w-120px'>Account Type</th>
                  <th className='min-w-120px'>Role Name</th>
                  <th className='min-w-120px'>Balance</th>
                  <th className='min-w-120px'>Balance Config</th>
                  <th className='w-25px'>Active</th>
                  {/* <th className='w-25px'>View</th> */}
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
                          {data.accountName}
                        </td>

                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.cashAccountTypeName}
                        </td>
                        {data.cashAccountRoleID === 0 ? (
                          <td className='text-dark text-hover-primary mb-1 fs-6'>N.A</td>
                        ) : (
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.cashAccountRoleName}
                          </td>
                        )}

                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.accountBalance}
                        </td>

                        {data.cashAccountTypeID === 2 ? (
                          <td className='text-center'>
                            <Link
                              to={{
                                pathname: `/organization/cashaccount/cashaccountemployeename/${data.cashAccountID}/list`,
                                state: {
                                  accountName: data.accountName,
                                  employeeID: data.employeeID,
                                  cashAccouID: data.cashAccountID,
                                  mainSearchConfig: name
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='View'
                            >
                              <span className='fa fa-eye fs-2'></span>
                            </Link>
                          </td>
                        ) : (
                          <td className='text-center'>N.A</td>
                        )}

                        <td className=''>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.cashAccountID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        {/* <td className=''>
                          <Link
                            to={`/organization/cash-account/view/${data.cashAccountID}`}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td> */}
                        <td className=''>
                          <Link
                            to={{
                              pathname: `/organization/cashaccount/edit/${data.cashAccountID}`,
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
                              onClick={() => handleShow(data.cashAccountID)}
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
        id={state.selCashAccountID}
        pageName={'Cash Account'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteItem(state.selCashAccountID)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Cash Account'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default CashAccountList
