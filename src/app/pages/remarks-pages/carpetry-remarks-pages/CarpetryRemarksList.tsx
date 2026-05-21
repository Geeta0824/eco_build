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
  UpdateQuotationRemarksIsactive,
} from '../../../modules/remarks-master-pages/carpetry-remarks-master-page/CarpetryRemarksCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'

interface ICountry {
  loading: boolean
  carpetryRemarksData: ICarpetryRemarksModel[]
  tmpCarpetryRemarksData: ICarpetryRemarksModel[]
  imageShow: string
  SearchText: string
  mainSearch: string
  selQuotationRemarksID: number
  activeID: number
  activeType: any
  // pathUrl: any
}

type Props = {}

const CarpetryRemarksList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ICountry>({
    loading: false,
    carpetryRemarksData: [] as ICarpetryRemarksModel[],
    tmpCarpetryRemarksData: [] as ICarpetryRemarksModel[],
    imageShow: '',
    SearchText: '',
    mainSearch: '',
    selQuotationRemarksID: 0,
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
      getcarpetryRemarksData(mainSearch)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getcarpetryRemarksData(mainSearch: string) {
    getAllQuotationRemarksApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.remarks.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.projectType.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              carpetryRemarksData: results,
              tmpCarpetryRemarksData: responseData,
              loading: false,
            })
            setTotal(results.length)
            // setPage(1)
          } else {
            setState({
              ...state,
              carpetryRemarksData: responseData,
              tmpCarpetryRemarksData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            // setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, carpetryRemarksData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetryRemarksData: [], loading: false})
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
    UpdateQuotationRemarksIsactive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getcarpetryRemarksData(state.mainSearch)
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

  const handleShow = (quotationRemarksID: number) => {
    setState({
      ...state,
      selQuotationRemarksID: quotationRemarksID,
      loading: false,
    })
    setShow(true)
  }

  const deleteExpenseTypeItem = (quotationRemarksID: number) => {
    deleteQuotationRemarksApi(quotationRemarksID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getcarpetryRemarksData(state.mainSearch)
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
      const results = state.tmpCarpetryRemarksData.filter((user) => {
        return (
          // user.expenseTypeName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.remarks.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectType.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, carpetryRemarksData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, carpetryRemarksData: state.tmpCarpetryRemarksData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpCarpetryRemarksData.length)
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
  const currentPosts: ICarpetryRemarksModel[] = state.carpetryRemarksData.slice(
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
              to={{pathname: '/remarks/carpetry-rmk/add', state: {mainSearch: name}}}
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
                  <th className='min-w-150px'>Project Type</th>
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
                        <td className='text-dark text-hover-primary fs-6'>{data.projectType}</td>
                        <td className='text-dark text-hover-primary fs-6'>{data.remarks}</td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              id={`${data.quotationRemarksID}`}
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
                                pathname: `/remarks/carpetry-rmk/edit/${data.quotationRemarksID}`,
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
                              onClick={() => handleShow(data.quotationRemarksID)}
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
        id={state.selQuotationRemarksID}
        pageName={'Carpetry Remarks'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteExpenseTypeItem(state.selQuotationRemarksID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Carpetry Remarks'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default CarpetryRemarksList
