import React, {useEffect, useState} from 'react'
import {Pagination} from 'antd'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {DayValue} from 'react-modern-calendar-datepicker'
import {getPurchaseAccountDataByPurchaseID} from '../../../modules/account-page/purchase-account-master-page/PurchaseAccountCRUD'
import {IPurchaseAccCheckModel} from '../../../models/Accounts-page/purchase-account-page/IPurchaseAccountModel'
import Search from 'antd/es/input/Search'

type Props = {}

interface IDesignation {
  loading: boolean
  lstItemsData: IPurchaseAccCheckModel[]
  temLstItemsData: IPurchaseAccCheckModel[]
  SearchText: string
  purchaseID: number
  vendorName: string
  vendorCost: number
  paidAmount: number
  remainingAmount: number
  purchaseDate: string
  voucherNo: string
  VendorID: number
  StartDate: string
  EndDate: string
  VendorName: string
}

const ViewPurchaseReport: React.FC<Props> = () => {
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    lstItemsData: [] as IPurchaseAccCheckModel[],
    temLstItemsData: [] as IPurchaseAccCheckModel[],
    SearchText: '',
    purchaseID: 0,
    vendorName: '',
    vendorCost: 0,
    paidAmount: 0,
    remainingAmount: 0,
    purchaseDate: '',
    voucherNo: '',
    VendorID: 0,
    StartDate: '',
    EndDate: '',
    VendorName: '',
  })

  useEffect(() => {
    let lc: any = location.state
    console.log(lc)
    let purchaseID = lc.purchaseID
    let purchaseDate = lc.purchaseDate
    let voucherNo = lc.voucherNo
    let vendorName = lc.vendorName
    let totalAmount = lc.totalAmount
    let paidAmount = lc.paidAmount
    let remainingAmount = lc.remainingAmount
    let VendorID = lc.VendorID
    let StartDate = lc.StartDate
    let EndDate = lc.EndDate
    let SearchText = lc.SearchText
    let VendorName = lc.VendorName

    setState({...state, loading: true})
    setTimeout(() => {
      getVenderData(
        purchaseID,
        purchaseDate,
        voucherNo,
        vendorName,
        totalAmount,
        paidAmount,
        remainingAmount,
        VendorID,
        StartDate,
        EndDate,
        SearchText,
        VendorName
      )
    }, 100)
  }, [])

  function getVenderData(
    purchaseID: number,
    purchaseDate: string,
    voucherNo: string,
    vendorName: string,
    totalAmount: number,
    paidAmount: number,
    remainingAmount: number,
    VendorID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string,
    VendorName: string
  ) {
    getPurchaseAccountDataByPurchaseID(purchaseID)
      .then((response) => {
        const responseData = response.data
        const temlstItems = responseData.lstItems
        if (responseData.isSuccess == true) {
          setState({
            ...state,
            lstItemsData: temlstItems,
            temLstItemsData: temlstItems,
            vendorName: vendorName,
            vendorCost: totalAmount,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount,
            purchaseID: purchaseID,
            loading: false,
            purchaseDate: purchaseDate,
            voucherNo: voucherNo,
            VendorID,
            StartDate,
            EndDate,
            SearchText,
            VendorName,
          })
          setTotal(temlstItems.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, lstItemsData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  //------------------- the search result-----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temLstItemsData.filter((user) => {
        return (
          user.itemName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.itemQty.toString().includes(keyword.toString()) ||
          user.pricePerUnit.toString().includes(keyword.toString()) ||
          user.lineTotal.toString().includes(keyword.toString())
        )
      })
      setState({...state, lstItemsData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, lstItemsData: state.temLstItemsData})
      // If the text field is empty, show all users
      setTotal(state.temLstItemsData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.lstItemsData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IPurchaseAccCheckModel[] = state.lstItemsData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/account-reports/purchase/list',
              state: {
                VendorID: state.VendorID,
                StartDate: state.StartDate,
                EndDate: state.EndDate,
                SearchText: state.SearchText,
                VendorName: state.VendorName,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='d-flex' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 py-2 row gx-xl-8 gx-sm-5 p-3'>
            {/* <div className='d-block '> */}
            <div className='d-flex'>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                PO Number : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.voucherNo}
                </div>
              </div>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                PO Date : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.purchaseDate}
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Vender Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.vendorName}
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Vendor Cost : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.vendorCost}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Paid Amount : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.paidAmount}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Remaining Amount : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.remainingAmount}
                </div>
              </div>
            </div>
          </div>

          <div className='col-3 mt-3 me-5'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
          </div>

          <div className='d-flex mt-10 me-5'>
            <Link
              to={{
                pathname: `/account-reports/purchase/item/pdf`,
                state: {
                  PurchaseID: state.purchaseID,
                  VendorID: state.VendorID,
                  StartDate: state.StartDate,
                  EndDate: state.EndDate,
                  SearchText: state.SearchText,
                  VendorName: state.VendorName,
                },
              }}
              className='symbol symbol-30px cursor-pointer d-block justify-content-center text-center'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='View PDF'
            >
              <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
            </Link>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className=''>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-6'>
                  <th className='min-w-150px'>Item Name</th>
                  <th className='min-w-150px'>Quantity</th>
                  <th className='min-w-150px'>Unit</th>
                  <th className='min-w-150px'> Unit Price</th>
                  <th className='min-w-150px'>Total</th>
                  {/* <th className='min-w-25px text-center'>Download</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.itemName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.itemQty}
                              </span>
                            </td>

                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.unitName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.pricePerUnit}
                              </span>
                            </td>

                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.lineTotal}
                              </span>
                            </td>
                            {/* <td className='text-center'>
                              {data.filePath === '' ? (
                                <span className='text-dark text-hover-primary mb-1 fs-6 text-center'>
                                  N.A
                                </span>
                              ) : (
                                <span
                                  className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                                  title='Download'
                                  onClick={() => downloadQuotationFile(data.filePath)}
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/files/fil017.svg'
                                    className='svg-icon-fluid svg-icon-primary'
                                  />
                                </span>
                              )}
                            </td> */}
                          </tr>
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
    </>
  )
}

export default ViewPurchaseReport
