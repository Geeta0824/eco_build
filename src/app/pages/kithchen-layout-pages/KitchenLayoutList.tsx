import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../_Ecd/helpers'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import Search from 'antd/es/transfer/search'
import {IPayFundListModel} from '../../models/Accounts-page/pay-fund-page/IPayFundModel'
import {
  DeletePayFundDetails,
  GetPayFundList,
} from '../../modules/account-page/pay-fund-master-page/PayFundCRUD'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
type Props = {}

interface IDesignation {
  loading: boolean
  payFundlistData: IPayFundListModel[]
  tmpPayFundlistData: IPayFundListModel[]
  SearchText: string
  selVenderID: number
  activeID: number
  selPayFundID: number
  activeType: any
  vendorTypeID: number
}

const KitchenLayoutList: React.FC<Props> = () => {
  const [state, setState] = useState<IDesignation>({
    loading: false,
    payFundlistData: [] as IPayFundListModel[],
    tmpPayFundlistData: [] as IPayFundListModel[],
    SearchText: '',
    vendorTypeID: 0,
    selVenderID: 0,
    selPayFundID: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getVenderData()
    }, 100)
  }, [])

  function getVenderData() {
    setState({...state, loading: false})
    // GetPayFundList()
    //   .then((response) => {
    //     const responseData = response.data.responseObject
    //     if (response.data.isSuccess == true) {
    //       setState({
    //         ...state,
    //         payFundlistData: responseData,
    //         tmpPayFundlistData: responseData,
    //         loading: false,
    //       })
    //       setTotal(responseData.length)
    // setPage(1)
    //     } else {
    //       toast.error(`${response.data.message}`)
    //     }
    //   })
    //   .catch((error) => {
    //     setState({...state, payFundlistData: [], loading: false})
    //     toast.error(`${error}`)
    //   })
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
    // DeletePayFundDetails(projectPaymentID)
    //   .then((response) => {
    //     if (response.data.isSuccess == true) {
    //       toast.success('Deleted Successfully')
    //       getVenderData()
    //       setShow(false)
    //     } else {
    //       toast.error(`${response.data.massege}`)
    //       setShow(false)
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(`${error}`)
    //     setShow(false)
    //   })
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
      const results = state.tmpPayFundlistData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, payFundlistData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, payFundlistData: state.tmpPayFundlistData})
      // If the text field is empty, show all users
      setTotal(state.tmpPayFundlistData.length)
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
  const currentPosts: IPayFundListModel[] = state.payFundlistData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
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
              to='/kitchen-layout/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
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
                <tr className='fw-bolder fs-6'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Payment Date</span>
                    {/* <span className='text-muted fw-bold d-block fs-6'>Vouchar No.</span> */}
                  </th>
                  <th className='min-w-150px'>Vendor Name</th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Project Name</span>
                    {/* <span className='text-muted fw-bold d-block fs-6'>Customer Name</span> */}
                  </th>
                  <th className='min-w-25px text-left'>Download</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
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
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.paymentDate}
                                  </span>
                                  <span className='text-muted d-block fs-7 mt-1'>
                                    {data.voucherNo}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.vendorName}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.projectName}
                              </span>
                              <span className='text-muted d-block fs-7'>{data.customeName}</span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.amount}
                              </span>
                              <span className='text-muted d-block fs-7'>
                                {data.transactionMode}
                              </span>
                            </td>

                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.cashAccountName}
                              </span>
                            </td>
                            <td className='text-center'>
                              {data.filePath === '' ? (
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
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
                            </td>
                            <td>
                              <div className='d-flex justify-content-end flex-shrink-0'>
                                <Link
                                  to={{
                                    pathname: `/kitchen-layout/edit/${data.projectPaymentID}`,
                                  }}
                                  className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/art/art005.svg'
                                    className='svg-icon-3 svg-icon-primary'
                                  />
                                </Link>
                                <div
                                  onClick={() => handleShow(data.projectPaymentID)}
                                  className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/general/gen027.svg'
                                    className='ssvg-icon-3 svg-icon-danger'
                                  />
                                </div>
                              </div>
                            </td>
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

export default KitchenLayoutList
