import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import Search from 'antd/es/transfer/search'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IGSTPayListModel} from '../../../models/Accounts-page/gst-pay-page/IGSTPayModel'
import {
  deleteGstDetails,
  getGSTPayList,
} from '../../../modules/account-page/gst-pay-master-page/GSTPayCRUD'
import {GSTPayCard} from './GSTPayCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

type Props = {}

interface IDesignation {
  loading: boolean
  GSTPayData: IGSTPayListModel[]
  tmpGSTPayData: IGSTPayListModel[]
  SearchText: string
  mainSearch: string
  selVenderID: number
  activeID: number
  selGstPayID: number
  activeType: any
  vendorTypeID: number
}

const GSTPayListPage: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    GSTPayData: [] as IGSTPayListModel[],
    tmpGSTPayData: [] as IGSTPayListModel[],
    SearchText: '',
    mainSearch: '',
    vendorTypeID: 0,
    selVenderID: 0,
    selGstPayID: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.Search
      }

      getVenderData(mainSearch)
    }, 100)
  }, [])

  function getVenderData(mainSearch: string) {
    getGSTPayList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.voucherNo.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.cashAccountName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.gstMonth.toString().includes(mainSearch.toLowerCase()) ||
                user.gstYear.toString().includes(mainSearch.toLowerCase()) ||
                user.gstAmount.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({...state, GSTPayData: results, tmpGSTPayData: responseData, loading: false})
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              GSTPayData: responseData,
              tmpGSTPayData: responseData,
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
        setState({...state, GSTPayData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (gstPaymentID: number) => {
    setState({
      ...state,
      selGstPayID: gstPaymentID,
      loading: false,
    })
    setShow(true)
  }

  function deleteGstData(gstPaymentID: number) {
    deleteGstDetails(gstPaymentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getVenderData(state.mainSearch)
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
      const results = state.tmpGSTPayData.filter((user) => {
        return (
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.gstMonth.toString().includes(keyword.toLowerCase()) ||
          user.gstYear.toString().includes(keyword.toLowerCase()) ||
          user.gstAmount.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, GSTPayData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, GSTPayData: state.tmpGSTPayData})
      // If the text field is empty, show all users
      setTotal(state.tmpGSTPayData.length)
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
  const currentPosts: IGSTPayListModel[] = state.GSTPayData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/accounts/gst/add'}
          title='Click to add a GST '
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
              to='/accounts/gst/add'
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
                  <th className='min-w-150px'>Payment Date</th>
                  <th className='min-w-150px'>Reference No</th>
                  <th className='min-w-150px'>Month/Year</th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Transction Mode</span>
                  </th>
                  <th className='min-w-150px'>Cash Account</th>
                  <th className='w-150px'>Create By</th>
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
                          <GSTPayCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.documentPath)}
                            handleShow={() => handleShow(data.projectPaymentID)}
                            name={name}
                            EmployeeID={user.employeeID}
                          />
                          // <tr key={index}>
                          //   <td>
                          //     <div className='d-flex align-items-center'>
                          //       <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //         <span className='text-dark text-hover-primary fs-5'>
                          //           {data.gstPayDate}
                          //         </span>
                          //       </div>
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <div className='d-flex align-items-center'>
                          //       <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //         <span className='text-dark text-hover-primary fs-5'>
                          //           {data.voucherNo}
                          //         </span>
                          //       </div>
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.gstMonth}  {'/'} {data.gstYear}
                          //     </span>
                          //   </td>
                          //   <td>
                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.gstAmount}
                          //     </span>
                          //     <span className='text-muted d-block fs-7'>
                          //       {data.transactionMode}
                          //     </span>
                          //   </td>
                          //   <td>
                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.cashAccountName}
                          //     </span>
                          //   </td>
                          //   <td className='text-center'>
                          //     {data.documentPath === '' ? (
                          //       <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //         N.A
                          //       </span>
                          //     ) : (
                          //       <span
                          //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                          //         title='Download'
                          //         onClick={() => downloadQuotationFile(data.documentPath)}
                          //       >
                          //         <KTSVG
                          //           path='/media/icons/duotune/files/fil017.svg'
                          //           className='svg-icon-fluid svg-icon-primary'
                          //         />
                          //       </span>
                          //     )}
                          //   </td>
                          //   <td>
                          //     <div className='d-flex justify-content-end flex-shrink-0'>
                          //       <Link
                          //         to={{
                          //           pathname:`/accounts/gst/edit/${data.gstPaymentID}`
                          //         }}
                          //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                          //       >
                          //         <KTSVG
                          //           path='/media/icons/duotune/art/art005.svg'
                          //           className='svg-icon-3 svg-icon-primary'
                          //         />
                          //       </Link>
                          //       <div
                          //         onClick={() => handleShow(data.gstPaymentID)}
                          //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                          //       >
                          //         <KTSVG
                          //           path='/media/icons/duotune/general/gen027.svg'
                          //           className='ssvg-icon-3 svg-icon-danger'
                          //         />
                          //       </div>
                          //     </div>
                          //   </td>
                          // </tr>
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
        id={state.selGstPayID}
        pageName={'Pay Fund'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteGstData(state.selGstPayID)}
      />
    </>
  )
}

export default GSTPayListPage
