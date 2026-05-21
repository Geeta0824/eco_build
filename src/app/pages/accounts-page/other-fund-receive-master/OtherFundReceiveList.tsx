import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IOtherFundRecListModel} from '../../../models/Accounts-page/other-fund-receive/IOtherFundReceiveModel'
import {
  DeleteOtherFundReceive,
  GetOtherFundReceiveListAPI,
} from '../../../modules/account-page/other-fund-receive-master-page/OtherFundReciveCRUD'
import {OtherFundReceiveCard} from './OtherFundReceiveCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

type Props = {}

interface IProject {
  loading: boolean
  otherFundReceiveData: IOtherFundRecListModel[]
  tmpOtherFundReceiveData: IOtherFundRecListModel[]
  selOtherPaymentID: number
  activeID: number
  activeType: any
  imageShow: string
  mainSearch: string
}

const OtherFundReceiveList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IProject>({
    loading: false,
    otherFundReceiveData: [] as IOtherFundRecListModel[],
    tmpOtherFundReceiveData: [] as IOtherFundRecListModel[],
    selOtherPaymentID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getOtherPaymenttData(mainSearch)
    }, 100)
  }, [])

  function getOtherPaymenttData(mainSearch: string) {
    GetOtherFundReceiveListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.vendorContactPerson.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.franchieseFirstName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.franchieseLastName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.transactionMode.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.cashAccountName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              otherFundReceiveData: results,
              tmpOtherFundReceiveData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              otherFundReceiveData: responseData,
              tmpOtherFundReceiveData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            otherFundReceiveData: [],
            tmpOtherFundReceiveData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          otherFundReceiveData: [],
          tmpOtherFundReceiveData: [],
          loading: false,
        })
      })
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (otherPaymentID: number) => {
    setState({
      ...state,
      selOtherPaymentID: otherPaymentID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(otherPaymentID: number) {
    DeleteOtherFundReceive(otherPaymentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getOtherPaymenttData(state.mainSearch)
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
    // const nameSplit = fullUrl.split('/')
    // const duplicateName = nameSplit.pop()
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
  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpOtherFundReceiveData.filter((user) => {
        return (
          user.vendorContactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.franchieseFirstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.franchieseLastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.transactionMode.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, otherFundReceiveData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, otherFundReceiveData: state.tmpOtherFundReceiveData})
      // If the text field is empty, show all users
      setTotal(state.tmpOtherFundReceiveData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const {projectID} = useParams<{projectID: string}>()
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IOtherFundRecListModel[] = state.otherFundReceiveData.slice(
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
          pathName={'/accounts/other-fund-receive/add'}
          title='Click to add a Other Fund Receive '
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
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
            <Link
              to='/accounts/other-fund-receive/add'
              className='btn btn-sm btn-light-primary bg-white'
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
                    <span className='d-block mb-1 '>Payment From</span>
                    <span className='text-muted fw-bold d-block fs-6'>Sender Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Transction Mode</span>
                  </th>

                  <th className='min-w-150px'>
                    <span className='d-block mb-7'>Cash Account</span>
                  </th>
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
                          <OtherFundReceiveCard
                            key={index}
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.filePath)}
                            handleShow={() => handleShow(data.otherPaymentID)}
                            name={name}
                            EmployeeID={user.employeeID}
                          />
                          // <tr key={index}>
                          //   <td>
                          //     <div className='d-flex align-items-center'>
                          //       <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //         <span className='text-dark text-hover-primary fs-5'>
                          //           {data.paymentDate}
                          //         </span>
                          //         <span className='text-muted d-block fs-7 mt-1'>
                          //           {data.voucherNo}
                          //         </span>
                          //       </div>
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.paymentFromID === 1 ? 'Vendor' : 'Franchise'}
                          //     </span>
                          //     <span className='text-muted d-block fs-7'>
                          //       {data.paymentFromID === 1
                          //         ? data.companyName + ' - ' + data.vendorContactPerson
                          //         : data.franchieseFirstName + ' ' + data.franchieseLastName}
                          //     </span>
                          //   </td>
                          //   <td>
                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.amount}
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
                          //         to={{
                          //           pathname: `/accounts/other-fund-receive/edit/${data.otherPaymentID}`,
                          //           // state: {
                          //           //   projName: data.vendorContactPerson,
                          //           //   projectID: data.projectID,
                          //           // },
                          //         }}
                          //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                          //       >
                          //         <KTSVG
                          //           path='/media/icons/duotune/art/art005.svg'
                          //           className='svg-icon-3 svg-icon-primary'
                          //         />
                          //       </Link>
                          //       <div
                          //         onClick={() => handleShow(data.otherPaymentID)}
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
        id={state.selOtherPaymentID}
        pageName={'Fund Receive'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.selOtherPaymentID)}
      />
    </>
  )
}

export default OtherFundReceiveList
