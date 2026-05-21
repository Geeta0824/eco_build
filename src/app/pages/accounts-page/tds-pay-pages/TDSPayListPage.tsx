import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import Search from 'antd/es/transfer/search'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ITDSPayListModel} from '../../../models/Accounts-page/tds-pay-page/ITDSPayModel'
import {
  DeleteTDSDetailAPI,
  getTDSPayList,
} from '../../../modules/account-page/tds-pay-master-page/TDSPayCRUD'
import {TDSPayCard} from './TDSPayCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

type Props = {}

interface IDesignation {
  loading: boolean
  TDSPayData: ITDSPayListModel[]
  tmpTDSPayData: ITDSPayListModel[]
  SearchText: string
  selVenderID: number
  activeID: number
  tdsPaymentID: number
  activeType: any
  mainSearch: string
}

const TDSPayListPage: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    TDSPayData: [] as ITDSPayListModel[],
    tmpTDSPayData: [] as ITDSPayListModel[],
    SearchText: '',
    selVenderID: 0,
    tdsPaymentID: 0,
    activeID: 0,
    activeType: false,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.Search
      }
      getTDSPayData(mainSearch)
    }, 100)
  }, [])

  function getTDSPayData(mainSearch: string) {
    getTDSPayList()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.voucherNo.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.tdsAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.cashAccountName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              TDSPayData: results,
              tmpTDSPayData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              TDSPayData: responseData,
              tmpTDSPayData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, TDSPayData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (tdsPaymentID: number) => {
    setState({
      ...state,
      tdsPaymentID: tdsPaymentID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(tdsPaymentID: number) {
    DeleteTDSDetailAPI(tdsPaymentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getTDSPayData(state.mainSearch)
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }
  //   ------View on other tab --------------
  async function downloadQuotationFile(selURL: string) {
    var fullUrl = process.env.REACT_APP_API_URL + selURL
    //Split image name
    const nameSplit = fullUrl.split('/')
    const duplicateName = nameSplit.pop()
    // let url = window.URL.createObjectURL(new Blob([fullUrl]))
    // let a = document.createElement('a')
    // a.href = url
    // a.download = '' + duplicateName + ''
    // a.click()
    const link = document.createElement('a')
    // link.download = '' + duplicateName + ''
    link.target = '_blank'
    link.href = `${fullUrl}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpTDSPayData.filter((user) => {
        return (
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.tdsAmount.toString().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, TDSPayData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, TDSPayData: state.tmpTDSPayData})
      // If the text field is empty, show all users
      setTotal(state.tmpTDSPayData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ITDSPayListModel[] = state.TDSPayData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/accounts/tds/add'}
          title='Click to add a TDS '
        />
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-6'>
                  <th className='min-w-150px'>Payment Date</th>
                  <th className='min-w-150px'>Voucher No.</th>
                  <th className='min-w-150px'>Year/Month</th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>TDS Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Transction Mode</span>
                  </th>
                  <th className='min-w-150px'>Cash Account</th>
                  <th className='w-125px'>Create By</th>
                  <th className='min-w-25px text-left'>Download</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <TDSPayCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.documentPath)}
                            handleShow={() => handleShow(data.tdsPaymentID)}
                            name={name}
                            EmployeeID={user.employeeID}
                          />
                        )
                      })}
                  </>
                )}
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
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.tdsPaymentID}
        pageName={'TDS Pay'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.tdsPaymentID)}
      />
    </>
  )
}

export default TDSPayListPage
