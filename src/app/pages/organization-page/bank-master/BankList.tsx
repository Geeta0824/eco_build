import React, {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Link, useLocation} from 'react-router-dom'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IBankModel} from '../../../models/organization-page/bank/IBankModel'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {
  deleteOrganizationBank,
  getAllOrganizationBank,
  isActiveOrganizationBank,
} from '../../../modules/organization-page/bank-master-page/BankCRUD'
import {KTSVG} from '../../../../_Ecd/helpers/components/KTSVG'

type Props = {}

interface IBank {
  loading: boolean
  orgaBankData: IBankModel[]
  temOrgaBankData: IBankModel[]
  selOrgaBankId: number
  activeID: number
  mainSearch: string
  activeType: any
}
const BankList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IBank>({
    loading: false,
    orgaBankData: [] as IBankModel[],
    temOrgaBankData: [] as IBankModel[],
    selOrgaBankId: 0,
    activeID: 0,
    mainSearch: '',
    activeType: false,
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
      getOrganizationBankData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  const getOrganizationBankData = (mainSearch: string) => {
    setState({...state, loading: false})
    getAllOrganizationBank()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.accountHolderName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.bankName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.accountNumber.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.ifscCode.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.branchName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              orgaBankData: results,
              temOrgaBankData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              orgaBankData: responseData,
              temOrgaBankData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
        setTotal(responseData.length)
        setPage(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, orgaBankData: [], loading: false})
      })
  }

  // ================= Model For IsActive==================

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

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    isActiveOrganizationBank(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getOrganizationBankData(state.mainSearch)
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  // ================Model For Delete=====================

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (organisationBankID: number) => {
    setState({
      ...state,
      selOrgaBankId: organisationBankID,
      loading: false,
    })
    setShow(true)
  }

  // =============DELETE API CALL===================
  const deleteOrganizationBankItem = (orgaBankId: number) => {
    deleteOrganizationBank(orgaBankId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getOrganizationBankData(state.mainSearch)
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

  // ---------------- Pagination ----------------

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IBankModel[] = state.orgaBankData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temOrgaBankData.filter((user) => {
        return (
          user.accountHolderName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.bankName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.accountNumber.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.ifscCode.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.branchName.toLowerCase().startsWith(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, orgaBankData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, orgaBankData: state.temOrgaBankData})
      // If the text field is empty, show all users
      setTotal(state.temOrgaBankData.length)
      setPage(1)
    }
    setName(keyword)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ps-0' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
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
            </span>
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link to={{pathname:'/organization/bank/add',state:{mainSearch:name} }}className='btn btn-sm btn-light-primary bg-white'>
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
              <thead className='bg-primary'>
                <tr className='fw-bolder fs-5 text-white'>
                  <th className='min-w-140px'>Account Holder Name</th>
                  <th className='min-w-140px'>Bank Name</th>
                  <th className='min-w-140px'>Branch Name</th>
                  <th className='min-w-140px'>Account Number</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-100px text-end'>Edit|Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={5} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <a href='#' className='text-dark text-hover-primary fs-6'>
                                {data.accountHolderName}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
                            {data.bankName}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
                            {data.branchName}
                          </a>
                        </td>
                        <td>
                          <a href='#' className='text-dark text-hover-primary d-block fs-6'>
                            {data.accountNumber}
                          </a>
                        </td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              id={`${data.organisationBankID}`}
                              className='form-check-input'
                              type='checkbox'
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{pathname:`/organization/bank/edit/${data.organisationBankID}`,state:{mainSearch:name}}}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <a
                              onClick={() => handleShow(data.organisationBankID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
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
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selOrgaBankId}
        pageName={'Organization Bank'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteOrganizationBankItem(state.selOrgaBankId)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Organization Bank'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default BankList
