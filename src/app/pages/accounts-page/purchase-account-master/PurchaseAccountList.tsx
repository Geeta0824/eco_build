import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import Search from 'antd/es/transfer/search'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IPurchaseAccountListModel} from '../../../models/Accounts-page/purchase-account-page/IPurchaseAccountModel'
import {
  deletePurchaseAccountDetails,
  getPurchaseAccountList,
} from '../../../modules/account-page/purchase-account-master-page/PurchaseAccountCRUD'
import {PurchaseAccountCard} from './PurchaseAccountCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

type Props = {}

interface IDesignation {
  loading: boolean
  purchaseActData: IPurchaseAccountListModel[]
  tmpPurchaseActData: IPurchaseAccountListModel[]

  activeID: number
  selPurchaseActID: number
  activeType: any
  mainSearch: string
}

const PurchaseAccountList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    purchaseActData: [] as IPurchaseAccountListModel[],
    tmpPurchaseActData: [] as IPurchaseAccountListModel[],

    selPurchaseActID: 0,
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
      getPurchaseAccountData(mainSearch)
    }, 100)
  }, [])

  function getPurchaseAccountData(mainSearch: string) {
    getPurchaseAccountList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.vendorName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.purchaseDate.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.itemDescr.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.totalAmount.toString().includes(mainSearch.toString()) ||
                user.paidAmount.toString().includes(mainSearch.toString()) ||
                user.remainingAmount.toString().includes(mainSearch.toString()) ||
                user.voucherNo.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              purchaseActData: results,
              tmpPurchaseActData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              purchaseActData: responseData,
              tmpPurchaseActData: responseData,
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
        setState({...state, purchaseActData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectPaymentID: number) => {
    setState({
      ...state,
      selPurchaseActID: projectPaymentID,
      loading: false,
    })
    setShow(true)
  }

  function deletePurchaseAccount(purchaseID: number) {
    deletePurchaseAccountDetails(purchaseID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getPurchaseAccountData(state.mainSearch)
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
      const results = state.tmpPurchaseActData.filter((user) => {
        //  console.log(user)
        return (
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.purchaseDate.toLowerCase().includes(keyword.toLowerCase()) ||
          user.itemDescr.toLowerCase().includes(keyword.toLowerCase()) ||
          user.totalAmount.toString().includes(keyword.toString()) ||
          user.paidAmount.toString().includes(keyword.toString()) ||
          user.remainingAmount.toString().includes(keyword.toString()) ||
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, purchaseActData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, purchaseActData: state.tmpPurchaseActData})
      // If the text field is empty, show all users
      setTotal(state.tmpPurchaseActData.length)
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
  const currentPosts: IPurchaseAccountListModel[] = state.purchaseActData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/accounts/purchase/add'}
          title='Click to add a purchase '
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-3 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/accounts/purchase/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div> */}
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
                  <th className='min-w-100px'>Purchase Date</th>
                  <th className='min-w-100px'>PO Number</th>
                  <th className='min-w-100px'>Vendor Name</th>
                  <th className='min-w-100px'>Amount</th>
                  <th className='min-w-100px'>Paid Amount</th>
                  <th className='min-w-100px'>Rem Amount</th>
                  <th className='w-125px'>Create By</th>
                  <th className='min-w-100px'>Download</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
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
                          <PurchaseAccountCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.documentPath)}
                            handleShow={() => handleShow(data.purchaseID)}
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
        id={state.selPurchaseActID}
        pageName={'Purchase Account'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePurchaseAccount(state.selPurchaseActID)}
      />
    </>
  )
}

export default PurchaseAccountList
