import React, {useEffect, useState} from 'react'
import {Button, Modal, PaginationProps} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ICarpetryRemarksModel} from '../../../models/remarks-page/ICarpetryRemarksModel'
import {
  deleteQuotationRemarksApi,
  getAllQuotationRemarksApi,
} from '../../../modules/remarks-master-pages/carpetry-remarks-master-page/CarpetryRemarksCRUD'
import {
  AgencyRemarksGetListApi,
  deleteAgencyRemarksApi,
  UpdateAgencyRemarksIsactive,
} from '../../../modules/remarks-master-pages/agency-remarks-master-page/AgencyRemarksCRUD'
import {IAgencyRemarksModel} from '../../../models/remarks-page/IAgencyRemarksModel'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'

interface ICountry {
  loading: boolean
  agencyRemarksData: IAgencyRemarksModel[]
  tmpAgencyRemarksData: IAgencyRemarksModel[]
  imageShow: string
  SearchText: string
  mainSearch: string
  selagencyRemarksID: number
  activeID: number
  activeType: any
  // pathUrl: any
}

type Props = {}

const AgencyRemarksList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ICountry>({
    loading: false,
    agencyRemarksData: [] as IAgencyRemarksModel[],
    tmpAgencyRemarksData: [] as IAgencyRemarksModel[],
    imageShow: '',
    SearchText: '',
    mainSearch: '',
    selagencyRemarksID: 0,
    activeID: 0,
    activeType: false,
    // pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getagencyRemarksData(mainSearch)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getagencyRemarksData(mainSearch: string) {
    AgencyRemarksGetListApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.remarks.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.remarksTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.agencyTypeName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              agencyRemarksData: results,
              tmpAgencyRemarksData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              agencyRemarksData: responseData,
              tmpAgencyRemarksData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyRemarksData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyRemarksData: [], loading: false})
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

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    UpdateAgencyRemarksIsactive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getagencyRemarksData(state.mainSearch)
          setShowActive(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }
  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (agencyRemarksID: number) => {
    setState({
      ...state,
      selagencyRemarksID: agencyRemarksID,
      loading: false,
    })
    setShow(true)
  }

  const deleteExpenseTypeItem = (agencyRemarksID: number) => {
    deleteAgencyRemarksApi(agencyRemarksID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getagencyRemarksData(state.mainSearch)
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

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpAgencyRemarksData.filter((user) => {
        return (
          // user.expenseTypeName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.remarks.toLowerCase().includes(keyword.toLowerCase()) ||
          user.remarksTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.agencyTypeName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, agencyRemarksData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, agencyRemarksData: state.tmpAgencyRemarksData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpAgencyRemarksData.length)
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
  const currentPosts: IAgencyRemarksModel[] = state.agencyRemarksData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 bg-dark'>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
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
            <Link
              to={{pathname: '/remarks/agency-rmk/add', state: {mainSearch: name}}}
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
              <thead className='bg-secondary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Agency Type</th>
                  <th className='min-w-40px'>Category Type</th>
                  <th className='min-w-40px'>Remarks</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary fs-6'>{data.agencyTypeName}</td>
                        <td className='text-dark text-hover-primary fs-6'>
                          {data.remarksTypeName}
                        </td>
                        <td className='text-dark text-hover-primary fs-6'>{data.remarks}</td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              id={`${data.agencyRemarksID}`}
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
                              to={{
                                pathname: `/remarks/agency-rmk/edit/${data.agencyRemarksID}`,
                                state: {mainSearch: name},
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.agencyRemarksID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
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
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={15}
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
        id={state.selagencyRemarksID}
        pageName={'Agency Remarks'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteExpenseTypeItem(state.selagencyRemarksID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Agency Remarks'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default AgencyRemarksList
