import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IExpenseHeadModel} from '../../../models/Accounts-page/expense-header/ExpenseHeaderModel'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {ExpenseHeaderCard} from './ExpenseHeaderCard'
import {
  deleteExpenseHeadData,
  getExpenseHeadList,
} from '../../../modules/account-page/expense-header-page/ExpenseHeaderCRUD'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

interface ICountry {
  loading: boolean
  expenseHeadData: IExpenseHeadModel[]
  tmpExpenseHeadData: IExpenseHeadModel[]
  imageShow: string
  SearchText: string
  selExpenseTypeID: number
  activeID: number
  activeType: any
  pathUrl: any
}

type Props = {}

const ExpenseHeaderListPage: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<ICountry>({
    loading: false,
    expenseHeadData: [] as IExpenseHeadModel[],
    tmpExpenseHeadData: [] as IExpenseHeadModel[],
    imageShow: '',
    SearchText: '',
    selExpenseTypeID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let SearchText: string = ''
      if (lc != undefined) {
        SearchText = lc.search
      }
      getExpenseHeaderData(SearchText)
    }, 100)
  }, [])

  function getExpenseHeaderData(SearchText: string) {
    getExpenseHeadList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (SearchText !== '') {
            const results = responseData.filter((user: any) => {
              return user.expenseHeadName.toLowerCase().startsWith(SearchText.toLowerCase())
            })
            setState({
              ...state,
              expenseHeadData: results,
              tmpExpenseHeadData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              expenseHeadData: responseData,
              tmpExpenseHeadData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(SearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseHeadData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, expenseHeadData: [], loading: false})
      })
  }

  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (expenseTypeID: number) => {
    setState({
      ...state,
      selExpenseTypeID: expenseTypeID,
      loading: false,
    })
    setShow(true)
  }

  const deleteExpenseTypeItem = (expenseID: number) => {
    deleteExpenseHeadData(expenseID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getExpenseHeaderData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ============== Search Function =======================
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpExpenseHeadData.filter((user) => {
        return (
          // user.expenseTypeName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.expenseHeadName.toLowerCase().startsWith(keyword.toLowerCase())
        )
      })
      setState({...state, expenseHeadData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, expenseHeadData: state.tmpExpenseHeadData, loading: false})
      setTotal(state.tmpExpenseHeadData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IExpenseHeadModel[] = state.expenseHeadData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/accounts/expense-head/add'}
          title='Click to add a Expense Type'
        />
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-secondary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Expense Head Name</th>
                  <th className='min-w-150px'>Create By</th>
                  <th className='min-w-100px text-center'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <ExpenseHeaderCard
                        key={index}
                        data={data}
                        handleShow={() => handleShow(data.expenseHeadID)}
                        name={name}
                        EmployeeID={user.employeeID}
                      />
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={15}
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
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selExpenseTypeID}
        pageName={'Expense Type'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteExpenseTypeItem(state.selExpenseTypeID)}
      />
    </>
  )
}

export default ExpenseHeaderListPage
