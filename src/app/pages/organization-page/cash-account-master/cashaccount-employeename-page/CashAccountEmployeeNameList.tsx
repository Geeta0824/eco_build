import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {ICashAccountModel} from '../../../../models/organization-page/cashaccount/ICashAccountModel'
import {IDepartmentModel} from '../../../../models/master-page/IDepartmentModel'
import {RootState} from '../../../../../setup'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {
  DeleteCashAccountSegment,
  GetCashAccountSegmentList,
} from '../../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {KTSVG} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {Pagination} from 'antd'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'

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
  selemployee: number
  mainSearch: string
}

const CashAccountEmployeeNameList: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  // console.log(location)
  const {cashAccoID} = useParams<{cashAccoID: string}>()

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
    selemployee: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let cashAccouID = lc.cashAccouID
      let employeeID = lc.employeeID
   
      var mainSearch: string = ''
      if (lc.search) {
        mainSearch = lc.search
      }
      getCashAccountData(employeeID, cashAccouID, mainSearch)
    }, 100)
  }, [])

  function getCashAccountData(employeeID: number, cashAccouID: number, mainSearch: string) {
    GetCashAccountSegmentList(cashAccouID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          let responseData = response.data.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.cashEmployeeSubTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.bankName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                // user.accountBalance.toString().includes(mainSearch.toLowerCase()) ||
                user.accountBalance.toString().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              cashAccountData: results,
              tmpCashAccountData: responseData,
              selemployee: employeeID,
              selCashAccountID: cashAccouID,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              cashAccountData: responseData,
              tmpCashAccountData: responseData,
              selemployee: employeeID,
              selCashAccountID: cashAccouID,
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

  //   -----------------Delete model----------------------
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (cashEmployeeBalanceID: number) => {
    setState({
      ...state,
      selCashAccountID: cashEmployeeBalanceID,
      loading: false,
    })
    setShow(true)
  }

  // ----------------------delete employee api-------------------------
  function deleteItem(temImpId: number) {
    DeleteCashAccountSegment(temImpId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getCashAccountData(state.selemployee, state.selCashAccountID, state.mainSearch)
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
          user.cashEmployeeSubTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.bankName.toLowerCase().includes(keyword.toLowerCase()) ||
          // user.accountBalance.toString().includes(keyword.toLowerCase()) ||
          user.accountBalance.toString().includes(keyword.toLowerCase())
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
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICashAccountModel[] = state.cashAccountData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

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
              to={{
                pathname: `/organization/cashaccount/cashaccountemployeename/${parseInt(
                  cashAccoID
                )}/add`,
                state: {cashAccID: cashAccoID, empID: state.selemployee, mainSearch: name},
              }}
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
                  <th className='min-w-120px'>Type</th>

                  <th className='min-w-100px'>Bank Name</th>

                  <th className='min-w-120px'>Balance</th>

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
                          {data.cashEmployeeSubTypeName}
                        </td>
                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.cashEmployeeSubTypeID === 2 ? (
                            <div className=''>{data.bankName}</div>
                          ) : (
                            <div className=''>N.A</div>
                          )}
                        </td>

                        <td className='text-dark text-hover-primary mb-1 fs-6'>
                          {data.accountBalance}
                        </td>

                        <td className=''>
                          <Link
                            to={{
                              pathname: `/organization/cashaccount/cashaccountemployeename/${parseInt(
                                cashAccoID
                              )}/edit/${data.cashEmployeeBalanceID}`,
                              state: {
                                // accountName: data.accountName,
                                employeeID: state.selemployee,
                                cashAccouID: state.selCashAccountID,
                                mainSearch: name,
                              },
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
                              onClick={() => handleShow(data.cashEmployeeBalanceID)}
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
    </>
  )
}

export default CashAccountEmployeeNameList
