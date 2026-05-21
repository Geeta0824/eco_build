import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import Search from 'antd/es/transfer/search'
import {DeletePayFundDetails} from '../../../modules/account-page/pay-fund-master-page/PayFundCRUD'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IPayPurchasetModel} from '../../../models/Accounts-page/pay-purchase-page copy/IPayPurchaseModel'
import {GetPayPurchaseFundListApi} from '../../../modules/account-page/pay-purchase-master-page/PayPurchaseCRUD'
import {PayPurchaseCard} from './PayPurchaseCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

type Props = {}

interface IDesignation {
  loading: boolean
  PayPurchaseData: IPayPurchasetModel[]
  tmpPayPurchaseData: IPayPurchasetModel[]
  SearchText: string
  mainSearch: string
  selVenderID: number
  activeID: number
  selPayFundID: number
  activeType: any
  vendorTypeID: number
}

const PayPurchaseList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    PayPurchaseData: [] as IPayPurchasetModel[],
    tmpPayPurchaseData: [] as IPayPurchasetModel[],
    SearchText: '',
    mainSearch: '',
    vendorTypeID: 0,
    selVenderID: 0,
    selPayFundID: 0,
    activeID: 0,
    activeType: false,
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
      getPayPurchaseListData(mainSearch)
    }, 100)
  }, [])

  function getPayPurchaseListData(mainSearch: string) {
    GetPayPurchaseFundListApi()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.paymentDate.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.vendorName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.contactPerson.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.transactionMode.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.amount.toString().includes(mainSearch.toString()) ||
                user.voucherNo.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.cashAccountName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              PayPurchaseData: results,
              tmpPayPurchaseData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              PayPurchaseData: responseData,
              tmpPayPurchaseData: responseData,
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
        setState({...state, PayPurchaseData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectPaymentID: number) => {
    setState({
      ...state,
      selPayFundID: projectPaymentID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(projectPaymentID: number) {
    DeletePayFundDetails(projectPaymentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getPayPurchaseListData(state.mainSearch)
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
      const results = state.tmpPayPurchaseData.filter((user) => {
        return (
          user.paymentDate.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.transactionMode.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amount.toString().includes(keyword.toString()) ||
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, PayPurchaseData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, PayPurchaseData: state.tmpPayPurchaseData})
      // If the text field is empty, show all users
      setTotal(state.tmpPayPurchaseData.length)
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
  const currentPosts: IPayPurchasetModel[] = state.PayPurchaseData.slice(
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
          pathName={'/accounts/pay-for-purchase/add'}
          title='Click to add a Pay Purchase '
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
              to='/accounts/pay-for-purchase/add'
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
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Payment Date</span>
                    <span className='text-muted fw-bold d-block fs-6'>Vouchar No.</span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>PO No.</span>
                    <span className='text-muted fw-bold d-block fs-6'>PO Amount</span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Vendor Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Contact Person</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Cash Account</span>
                    <span className='text-muted fw-bold d-block fs-6'>Transction Mode</span>
                  </th>

                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Is GST</span>
                    <span className='text-muted fw-bold d-block fs-6'>GST Amount (%)</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Is TDS</span>
                    <span className='text-muted fw-bold d-block fs-6'>TDS Amount (%)</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Final Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Sub Total</span>
                  </th>
                  <th className='min-w-125px'>Create By</th>
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
                          <PayPurchaseCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.filePath)}
                            handleShow={() => handleShow(data.purchasePaymentID)}
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
        id={state.selPayFundID}
        pageName={'Pay Fund'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.selPayFundID)}
      />
    </>
  )
}

export default PayPurchaseList
