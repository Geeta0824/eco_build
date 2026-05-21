import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {
  getAllProjectTypeMasterApi,
  isActiveProjectTypeApi,
} from '../../../modules/quo-mst/QuotationMstCRUD'
import {IProjectTypeodel} from '../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'

interface IQuoMst {
  loading: boolean
  projectTypeMstData: IProjectTypeodel[]
  tmpProjectTypeMstData: IProjectTypeodel[]
  activeID: number
  activeType: boolean
  SearchText: string
}

type Props = {}

const ProjectTypeListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IQuoMst>({
    loading: false,
    projectTypeMstData: [] as IProjectTypeodel[],
    tmpProjectTypeMstData: [] as IProjectTypeodel[],
    activeID: 0,
    activeType: false,
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getProjectTypeMstData(mainSearch)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getProjectTypeMstData(mainSearch: string) {
    getAllProjectTypeMasterApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.projectType.toLowerCase().includes(mainSearch.toLowerCase())
            })
            setState({
              ...state,
              projectTypeMstData: results,
              tmpProjectTypeMstData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              projectTypeMstData: responseData,
              tmpProjectTypeMstData: responseData,
              loading: false,
            })
            // If the text field is empty, show all users
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectTypeMstData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectTypeMstData: [], loading: false})
      })
  }
  // ============== Search Function =======================
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpProjectTypeMstData.filter((user) => {
        return user.projectType.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, projectTypeMstData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectTypeMstData: state.tmpProjectTypeMstData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpProjectTypeMstData.length)
      setPage(1)
    }
    setName(keyword)
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
    isActiveProjectTypeApi(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getProjectTypeMstData(state.SearchText)
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

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectTypeodel[] = state.projectTypeMstData.slice(
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
            title='Click to add a Quotation'
          >
            <Link
              to={{pathname: '/master/project-type-mst/add', state: {mainSearch: name}}}
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
                  <th className='min-w-125px'>Quotaion Category Name</th>
                  <th className='min-w-40px'>Quotation Level</th>
                  <th className='min-w-25px'>Is Active</th>
                  {/* <th className='min-w-40px'>Category Type</th>
                  <th className='min-w-40px'>Remarks</th> */}
                  <th className='w-50px text-center me-1'>Edit</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary fs-6'>{data.projectType}</td>
                        <td className='text-dark text-hover-primary fs-6'>
                          {data.quotationLevelName}
                        </td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.projectTypeID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td className='text-end'>
                          {/* <div className='d-flex flex-shrink-0'> */}
                          <Link
                            to={{
                              pathname: `/master/project-type-mst/edit/${data.projectTypeID}`,
                              state: {mainSearch: name},
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/art005.svg'
                              className='svg-icon-3 svg-icon-primary'
                            />
                          </Link>
                          {/* <div
                              onClick={() => handleShow(data.agencyRemarksID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='svg-icon-3 svg-icon-danger'
                              />
                            </div> */}
                          {/* </div> */}
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
          {/* <div className='text-center'>
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
          </div> */}
        </div>
      </div>
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Project Type Master'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default ProjectTypeListPage
