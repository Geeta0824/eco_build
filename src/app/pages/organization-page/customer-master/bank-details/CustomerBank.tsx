import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {Pagination} from 'antd'
import {ICustomerBankModel} from '../../../../models/organization-page/customer/ICustomerBankModel'
import {
  deleteCustomerBank,
  getCustomerBankByCustomerID,
  isActiveCustomerBank,
} from '../../../../modules/organization-page/customer-master-page/bank-details/CustomerBankCRUD'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../../common-pages/ModelPopUpIsActive'

type Props = {}

interface ICustomerBank {
  loading: boolean
  customerBankData: ICustomerBankModel[]
  tmpCustomerBankData: ICustomerBankModel[]
  selCustomerBankData: ICustomerBankModel
  selcustomerID: number
  SearchText: string
  selBankId: number
  activeID: number
  activeType: any
}

const CustomerBank: React.FC<Props> = () => {
  const location = useLocation()
  const {customerID} = useParams<{customerID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<ICustomerBank>({
    loading: false,
    customerBankData: [] as ICustomerBankModel[],
    tmpCustomerBankData: [] as ICustomerBankModel[],
    selCustomerBankData: {} as ICustomerBankModel,
    selcustomerID: 0,
    SearchText: '',
    selBankId: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      getCustomerBankDataByCustomerID()
    }, 100)
  }, [])

  function getCustomerBankDataByCustomerID() {
    getCustomerBankByCustomerID(parseInt(customerID))
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            customerBankData: responseData,
            tmpCustomerBankData: responseData,
            loading: false,
            selcustomerID: parseInt(customerID),
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            customerBankData: [],
            tmpCustomerBankData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, customerBankData: [], loading: false})
      })
  }

  // =================Is Active Function Model Call==============

  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  function handleShowActive(event: any) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: Cid,
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  function checkedFunction(temCustomerBankId: number, temCustomerBankIsAct: boolean) {
    isActiveCustomerBank(temCustomerBankId, temCustomerBankIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getCustomerBankDataByCustomerID()
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (customerBankID: number) => {
    setState({
      ...state,
      selBankId: customerBankID,
      loading: false,
    })
    setShow(true)
  }

  function deleteCustomerBankDetail(customerBankId: number) {
    deleteCustomerBank(customerBankId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getCustomerBankDataByCustomerID()
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

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCustomerBankData.filter((user) => {
        return (
          user.bankName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.accountNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.branchName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, customerBankData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, customerBankData: state.tmpCustomerBankData})
      // If the text field is empty, show all users
      setTotal(state.tmpCustomerBankData.length)
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
  const currentPosts: ICustomerBankModel[] = state.customerBankData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Customer Bank </span>
            <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Customer Bank</span>
          </h3> */}

          <div className='card-header border-0 pt-4 px-0' id='kt_chat_contacts_header'>
            <span className='position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search Bank'
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
              to={`/organization/customer/edit/${parseInt(customerID)}/bank/add`}
              className='btn btn-sm btn-light-primary'
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
                  <th className='min-w-150px'>Account Number</th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Bank Name</span>
                    <span className='text-muted fw-bold d-block fs-7'>Branch Name</span>
                  </th>
                  <th className='min-w-100px'>IFSC Code</th>
                  <th className='min-w-100px'>MICR Code</th>
                  <th className='min-w-25px'>isActive</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <div className={state.loading === true ? 'card mb-5 mb-xl-10 h-100' : 'd-none'}>
                  <div className='card-body border-top p-9 ms-10'>
                    <div className='d-flex justify-content-center m-5 p-5'>
                      <div
                        className='spinner-border'
                        style={{width: '3rem', height: '3rem'}}
                        role='status'
                      >
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.accountNumber}
                          </span>
                        </td>
                        <td className=''>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.bankName}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.branchName}</span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block fs-6'>
                            {data.ifscCode}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block fs-6'>
                            {data.micrCode}
                          </span>
                        </td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.customerBankID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            {/* <span
                              className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm me-1 text-success text-hover-light'
                              onClick={() => (data)}
                            >
                              <span className='fa fa-eye lg'></span> */}
                            {/* <KTSVG
                                path='/media/icons/duotune/art/art008.svg'
                                className='svg-icon-3'
                              /> */}
                            {/* </span> */}
                            <Link
                              to={`/organization/customer/edit/${parseInt(customerID)}/bank/edit/${
                                data.customerBankID
                              }`}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={(e) => handleShow(data.customerBankID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
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
                {/* =================== Blank Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selBankId}
        pageName={'Customer Bank'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCustomerBankDetail(state.selBankId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Customer Bank'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default CustomerBank
