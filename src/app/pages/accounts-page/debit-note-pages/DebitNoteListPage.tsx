import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IDebitNoteModel} from '../../../models/Accounts-page/debit-note-page/IDebitNoteModel'
import {GetDebitNoteListIPI} from '../../../modules/account-page/debit-note-master-page/DebitNoteCRUD'
import {DebitNoteListCard} from './DebitNoteListCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

type Props = {}

interface IDebit {
  loading: boolean
  debitNoteData: IDebitNoteModel[]
  tmpDebitNoteData: IDebitNoteModel[]
  SearchText: string
  selDebitNoteID: number
  activeID: number
  activeType: any
}

const DebitNoteListPage: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDebit>({
    loading: false,
    debitNoteData: [] as IDebitNoteModel[],
    tmpDebitNoteData: [] as IDebitNoteModel[],
    SearchText: '',
    selDebitNoteID: 0,
    activeID: 0,
    activeType: false,
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
      getAllDebitNoteData(SearchText)
    }, 100)
  }, [])

  function getAllDebitNoteData(SearchText: string) {
    GetDebitNoteListIPI()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          if (SearchText !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.purchaseOrderNo.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.debitVoucherNo.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.totalReturnAmt.toString().includes(SearchText.toLowerCase()) ||
                user.vendorName.toLowerCase().includes(SearchText.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              debitNoteData: results,
              tmpDebitNoteData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              debitNoteData: responseData,
              tmpDebitNoteData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(SearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, debitNoteData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, debitNoteData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (debitNoteID: number) => {
    setState({
      ...state,
      selDebitNoteID: debitNoteID,
      loading: false,
    })
    setShow(true)
  }

  function deleteBHKMasterItem(temDebitNoteID: number) {
    // deleteBHK(temDebitNoteID)
    //   .then((response) => {
    //     if (response.data.isSuccess == true) {
    //       toast.success('Deleted Successfully')
    //       getAllDebitNoteData()
    //       setShow(false)
    //     } else {
    //       toast.error(`${response.data.message}`)
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
      const results = state.tmpDebitNoteData.filter((user) => {
        return (
          user.purchaseOrderNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.debitVoucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.totalReturnAmt.toString().includes(keyword.toLowerCase()) ||
          user.vendorName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, debitNoteData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, debitNoteData: state.tmpDebitNoteData})
      // If the text field is empty, show all users
      setTotal(state.tmpDebitNoteData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.debitNoteData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDebitNoteModel[] = state.debitNoteData.slice(
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
          pathName={'/accounts/debit-note/add'}
          title='Click to add a Debit Note '
        />
        {/* <div className='card-header border-0 py-2 bg_dark' style={{backgroundColor: '#000000'}}>
          <div className='border-0 p-2' id=''>
            <form className='w-100 position-relative' autoComplete='off'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </form>
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link to='/accounts/debit-note/add' className='btn btn-sm btn-light-primary bg-white'>
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
                <tr className='fw-bolder fs-5'>
                  <th className='w-100px'>
                    <span className='d-block mb-1'>Voucher No.</span>
                    <span className='text-muted fw-bold d-block fs-6'>Date</span>
                  </th>
                  <th className='w-100px'>
                    <span className='d-block mb-1'>Vendor Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>PO No</span>
                  </th>
                  <th className='w-100px'>
                    <span className='d-block mb-1'>Return Qty</span>
                    <span className='text-muted fw-bold d-block fs-6'>Return Amount</span>
                  </th>
                  {/* <th className='w-25px text-left'>Vendor Type</th> */}
                  <th className='w-100px text-left'>Download</th>
                  <th className='w-75px'>Create By</th>
                  <th className='w-50px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <DebitNoteListCard
                        data={data}
                        downloadQuotationFile={() => downloadQuotationFile(data.filePath)}
                        handleShow={() => handleShow(data.debitNoteID)}
                        name={name}
                        EmployeeID={user.employeeID}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                      //         <span className='text-dark text-hover-primary fs-5'>
                      //           {data.debitVoucherNo}
                      //         </span>
                      //         <span className='text-muted d-block fs-7 mt-1'>
                      //           {data.debitNoteDate}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                      //         <span className='text-dark text-hover-primary fs-5'>
                      //           {data.vendorName}
                      //         </span>
                      //         <span className='text-muted d-block fs-7 mt-1'>
                      //           {data.purchaseOrderNo}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                      //         <span className='text-dark text-hover-primary fs-5'>
                      //           {data.returnQty}
                      //         </span>
                      //         <span className='text-muted d-block fs-7 mt-1'>
                      //           {data.totalReturnAmt}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td className='text-center'>
                      //     {data.filePath === '' ? (
                      //       <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                      //         N.A
                      //       </span>
                      //     ) : (
                      //       <span
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                      //         title='Download'
                      //         onClick={() => downloadQuotationFile(data.filePath)}
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
                      //         to={`/accounts/debit-note/edit/${data.debitNoteID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.debitNoteID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selDebitNoteID}
        pageName={'Debit Note'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteBHKMasterItem(state.selDebitNoteID)}
      />
    </>
  )
}

export default DebitNoteListPage
