import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {
  IAgencyTypeModel,
  IProductCategoryTypeModel,
} from '../../../../models/product-page/IAgencyTypeModel'
import {ModelPopUpIsActive} from '../../../common-pages/ModelPopUpIsActive'
import {IAgencyWorkStageModel} from '../../../../models/product-page/IAgencyWorkStageModel'
import {
  DeleteAgencyWorkStage,
  GetAgencyWorkStageByTypeIDApi,
  isActiveAgencyWorkStage,
} from '../../../../modules/product-master-page/agency-type-master-page/AgenctWorkStageCRUD'
type Props = {}

interface IAgency {
  loading: boolean
  agencyWorkStageData: IAgencyWorkStageModel[]
  tmpAgencyWorkStageData: IAgencyWorkStageModel[]

  SearchText: string
  selAgencyTypeName: string
  mainSearch: string
  agencyTypeName: string
  selAgencyType: number
  activeID: number
  activeType: any
  mandatoryID: number
  selAgencyTypeID: number
  selAgencyWorkStageID: number
  mandatoryType: boolean
}

const AgencyWorkStageList: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const [state, setState] = useState<IAgency>({
    loading: false,
    agencyWorkStageData: [] as IAgencyWorkStageModel[],
    tmpAgencyWorkStageData: [] as IAgencyWorkStageModel[],

    SearchText: '',
    selAgencyTypeName: '',
    mainSearch: '',
    agencyTypeName: '',
    selAgencyType: 0,
    activeID: 0,
    activeType: false,
    mandatoryID: 0,
    selAgencyTypeID: 0,
    selAgencyWorkStageID: 0,
    mandatoryType: false,
  })

  const loadData = async () => {
    const locationState = location.state as any
    const {agencyTypeID, agencyTypeName, search, mainSearch} = locationState
    setState({
      ...state,
      mainSearch: mainSearch,
      SearchText: search,
      loading: true,
    })
    const response = await GetAgencyWorkStageByTypeIDApi(agencyTypeID)
    setLoading(false)

    if (response.data.isSuccess) {
      setName(search)
      if (search) {
        const results = response.data.responseObject.filter((user: any) => {
          user.stageName.toLowerCase().includes(search.toLowerCase()) ||
            user.percentage.toString().includes(search.toLowerCase()) ||
            user.seqNo.toString().includes(search.toLowerCase())
        })

        setState({
          ...state,
          agencyWorkStageData: results,
          tmpAgencyWorkStageData: response.data.responseObject,
          selAgencyTypeID: agencyTypeID,
          selAgencyTypeName: agencyTypeName,
          mainSearch,
          loading: false,
        })
        setTotal(results.length)
        setPage(1)
      } else {
        setState({
          ...state,
          agencyWorkStageData: response.data.responseObject,
          tmpAgencyWorkStageData: response.data.responseObject,
          selAgencyTypeID: agencyTypeID,
          selAgencyTypeName: agencyTypeName,
          mainSearch,
          loading: false,
        })
        setTotal(response.data.responseObject.length)
        setPage(1)
      }
      setName(search)
      setState({
        ...state,
        agencyWorkStageData: response.data.responseObject,
        tmpAgencyWorkStageData: response.data.responseObject,
        selAgencyTypeID: agencyTypeID,
        selAgencyTypeName: agencyTypeName,
        mainSearch: mainSearch,
        SearchText: search,
        loading: false,
      })
    } else {
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [location.state])

  // useEffect(() => {
  //   setState({...state, loading: true})
  //   setTimeout(() => {
  //     let lc: any = location.state
  //     var agencyTypeName: string = ''
  //     var AgencyTypeID: number = 0
  //     var mainSearch: string = ''
  //     var searchText: string = ''
  //     if (lc !== undefined) {
  //       searchText = lc.search
  //       agencyTypeName = lc.agencyTypeName
  //       AgencyTypeID = lc.agencyTypeID
  //       mainSearch = lc.mainSearch
  //     }
  //     getAllAgencyTypeData(AgencyTypeID, mainSearch, agencyTypeName, searchText)
  //   }, 100)
  // }, [])

  // function getAllAgencyTypeData(
  //   AgencyTypeID: number,
  //   mainSearch: string,
  //   agencyTypeName: string,
  //   searchText: string
  // ) {
  //   GetAgencyWorkStageByTypeIDApi(AgencyTypeID)
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess == true) {
  //         if (searchText !== '') {
  //           const results = responseData.filter((user: any) => {
  //             user.stageName.toLowerCase().includes(searchText.toLowerCase()) ||
  //               user.percentage.toString().includes(searchText.toLowerCase()) ||
  //               user.seqNo.toString().includes(searchText.toLowerCase())
  //           })

  //           setState({
  //             ...state,
  //             agencyWorkStageData: results,
  //             tmpAgencyWorkStageData: responseData,
  //             selAgencyTypeID: AgencyTypeID,
  //             selAgencyTypeName: agencyTypeName,
  //             loading: false,
  //           })
  //           setTotal(results.length)
  //           setPage(1)
  //         } else {
  //           setState({
  //             ...state,
  //             agencyWorkStageData: responseData,
  //             tmpAgencyWorkStageData: responseData,
  //             selAgencyTypeID: AgencyTypeID,
  //             selAgencyTypeName: agencyTypeName,
  //             mainSearch,
  //             loading: false,
  //           })
  //           setTotal(responseData.length)
  //           setPage(1)
  //         }
  //         setName(searchText)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, agencyWorkStageData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, agencyWorkStageData: [], loading: false})
  //     })
  // }

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
    isActiveAgencyWorkStage(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          // getAllAgencyTypeData(
          //   state.selAgencyTypeID,
          //   state.SearchText,
          //   state.selAgencyTypeName,
          //   state.SearchText
          // )
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
  //==================================================

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (agencyWorkStageID: number) => {
    setState({
      ...state,
      selAgencyWorkStageID: agencyWorkStageID,
      loading: false,
    })
    setShow(true)
  }

  function deleteAgencyWorkStageData(agencyWorkStageID: number) {
    DeleteAgencyWorkStage(agencyWorkStageID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          // getAllAgencyTypeData(
          //   state.selAgencyTypeID,
          //   state.SearchText,
          //   state.selAgencyTypeName,
          //   state.SearchText
          // )
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpAgencyWorkStageData.filter((user) => {
        return (
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.percentage.toString().includes(keyword.toLowerCase()) ||
          user.seqNo.toString().includes(keyword.toLowerCase())
        )

        // user.areaPrice.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, agencyWorkStageData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, agencyWorkStageData: state.tmpAgencyWorkStageData})
      // If the text field is empty, show all users
      setTotal(state.tmpAgencyWorkStageData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.agencyWorkStageData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IAgencyWorkStageModel[] = state.agencyWorkStageData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/p-product/agency-type/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To Main List
        </span>
      </div>
      <div className='d-flex flex-column mb-2'>
        <div className='d-flex align-items-center'>
          <label className='text-dark text-hover-primary cursor-pointer fs-2 fw-bolder'>
            Agency Type Name :
          </label>
          <span className='text-primary text-hover-dark cursor-pointer fs-3 fw-bolder ms-3'>
            {state.selAgencyTypeName}
          </span>
        </div>
      </div>
      <div className={`card `}>
        {/* begin::Header */}

        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
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
              to={{
                pathname: `/p-product/agency-type/${state.selAgencyTypeID}/add`,
                state: {
                  agencyTypeID: state.selAgencyTypeID,
                  agencyTypeName: state.selAgencyTypeName,
                  searchText: name,
                  mainSearch: state.mainSearch,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white'
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
                  <th className='min-w-120px'>Stage</th>
                  <th className='min-w-120px'>Work Details</th>
                  <th className='min-w-25px ms-2'>Percentage</th>
                  <th className='min-w-25px '>Sequence No.</th>
                  <th className='min-w-25px'>isActive</th>
                  <th className='min-w-25px'>Material</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.stageName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.workDetails}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.percentage} %
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>{data.seqNo} </span>
                        </td>

                        <td>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.agencyWorkStageID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td className=''>
                          <div>
                            <Link
                              to={{
                                pathname: `/p-product/agency-type/${state.selAgencyTypeID}/material/list`,
                                state: {
                                  agencyWorkStageID: data.agencyWorkStageID,
                                  agencyTypeName: state.selAgencyTypeName,
                                  agencyTypeID: state.selAgencyTypeID,
                                  stageName: data.stageName,
                                  searchText: name,
                                  mainSearch: state.mainSearch,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm m-1'
                              title='Material'
                            >
                              <KTSVG
                                path='/media/icons/duotune/maps/map004.svg'
                                className='svg-icon-2 svg-icon-success'
                              />
                            </Link>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/p-product/agency-type/${state.selAgencyTypeID}/edit`,
                                state: {
                                  agencyWorkStageID: data.agencyWorkStageID,
                                  agencyTypeName: state.selAgencyTypeName,
                                  agencyTypeID: state.selAgencyTypeID,
                                  searchText: name,
                                  mainSearch: state.mainSearch,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.agencyWorkStageID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
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
        id={state.selAgencyWorkStageID}
        pageName={'Agency Work Stage'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteAgencyWorkStageData(state.selAgencyWorkStageID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Agency Work Stage'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default AgencyWorkStageList
