import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
import {IStandardQuotationModel} from '../../models/IStandardQuotationModel'
import {
  deleteStandardQuotation,
  getFilterAllStandardQuotation,
} from '../../modules/standard-quotation-master-page/StandardQuotationCRUD'
import {ModelPopUpIsActive} from '../common-pages/ModelPopUpIsActive'
import {Modal, Button} from 'react-bootstrap-v5'
import Search from 'antd/es/input/Search'
import {getAllCarpetArea} from '../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {getActiveBHKApi} from '../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {IBHKMasterModel} from '../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../models/master-page/ICarpetAreaModel'

type Props = {}

interface IStandard {
  loading: boolean
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  standardQuotationData: IStandardQuotationModel[]
  tmpStandardQuotationData: IStandardQuotationModel[]
  imageShow: string
  searchText: string
  selStandardQuotationID: number
  activeID: number
  activeType: any
  selCarpetAreaID: number
  selBhkID: number
  selProjectTypeID: number
  sortBy: number
  sortType: number
  mainBHKID: number
  mainCarpetAreaID: number
  mainSearch: string
}

const StandardQuotationListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IStandard>({
    loading: false,
    bhkData: [] as IBHKMasterModel[],
    carpetAreaData: [] as ICarpetAreaModel[],
    standardQuotationData: [] as IStandardQuotationModel[],
    tmpStandardQuotationData: [] as IStandardQuotationModel[],
    imageShow: '',
    searchText: '',
    selStandardQuotationID: 0,
    activeID: 0,
    activeType: false,
    selCarpetAreaID: 0,
    selBhkID: 0,
    selProjectTypeID: 0,
    sortBy: 0,
    sortType: 0,
    mainBHKID: 0,
    mainCarpetAreaID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    console.log(lc)
    var mainBHKID: number = 0
    var mainCarpetAreaID: number = 0
    var mainSearch: string = ''
    if (lc !== undefined) {
      mainBHKID = lc.BHKID
      mainCarpetAreaID = lc.CarpetAreaID
      mainSearch = lc.SearchText
    }
    setTimeout(() => {
      getBHKData(mainBHKID, mainCarpetAreaID, mainSearch)
    }, 100)
  }, [])

  function getBHKData(mainBHKID: number, mainCarpetAreaID: number, mainSearch: string) {
    getActiveBHKApi()
      .then((response) => {
        // let responseData = response.data.responseObject
        
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let responseData = resp.responseObject
        getCarpetAreaData(responseData, mainBHKID, mainCarpetAreaID, mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkData: [], loading: false})
      })
  }

  function getCarpetAreaData(
    bhkData: IBHKMasterModel[],
    mainBHKID: number,
    mainCarpetAreaID: number,
    mainSearch: string
  ) {
    getAllCarpetArea()
      .then((response) => {
        let responseData = response.data.responseObject
        getFilterStandardQuotationData(
          bhkData,
          responseData,
          mainCarpetAreaID,
          mainBHKID,
          state.selProjectTypeID,
          state.sortBy,
          state.sortType,
          mainSearch
        )
        setName(mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: [], loading: false})
      })
  }

  function getFilterStandardQuotationData(
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    selCarpetAreaID: number,
    selBhkID: number,
    selProjectTypeID: number,
    sortBy: number,
    sortType: number,
    searchText: string
  ) {
    getFilterAllStandardQuotation(
      selCarpetAreaID,
      selBhkID,
      selProjectTypeID,
      sortBy,
      sortType,
      searchText
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            bhkData: bhkData,
            carpetAreaData: carpetAreaData,
            standardQuotationData: responseData,
            tmpStandardQuotationData: responseData,
            selCarpetAreaID: selCarpetAreaID,
            selBhkID: selBhkID,
            selProjectTypeID: selProjectTypeID,
            sortBy: sortBy,
            sortType: sortType,
            searchText: searchText,
            loading: false,
          })
          // setName(searchText)
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, standardQuotationData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, standardQuotationData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (standardQuoID: number) => {
    setState({
      ...state,
      selStandardQuotationID: standardQuoID,
      loading: false,
    })
    setShow(true)
  }

  function deleteStandardQuotationItem(temStandardQuoID: number) {
    deleteStandardQuotation(temStandardQuoID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getFilterStandardQuotationData(
            state.bhkData,
            state.carpetAreaData,
            state.selCarpetAreaID,
            state.selBhkID,
            state.selProjectTypeID,
            state.sortBy,
            state.sortType,
            state.searchText
          )
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

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowFlag(true)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  //------------------- the search result-----------------
  const searchFilter = (value: string) => {
    const keyword = value
    // setMainLoading(true)
    if (keyword !== '') {
      getFilterStandardQuotationData(
        state.bhkData,
        state.carpetAreaData,
        state.selCarpetAreaID,
        state.selBhkID,
        state.selProjectTypeID,
        state.sortBy,
        state.sortType,
        keyword
      )
    } else {
      getFilterStandardQuotationData(
        state.bhkData,
        state.carpetAreaData,
        state.selCarpetAreaID,
        state.selBhkID,
        state.selProjectTypeID,
        state.sortBy,
        state.sortType,
        ''
      )
    }
  }

  // ===================BY SORT Filter Function===========
  function getDataBySorting(selSortBy: number) {
    let tmpSortType: number = 1
    if (state.sortBy === selSortBy) {
      if (state.sortType === 1) {
        tmpSortType = 2
      } else if (state.sortType === 2) {
        tmpSortType = 1
      }
    }
    setMainLoading(true)
    getFilterStandardQuotationData(
      state.bhkData,
      state.carpetAreaData,
      state.selCarpetAreaID,
      state.selBhkID,
      state.selProjectTypeID,
      selSortBy,
      tmpSortType,
      state.searchText
    )
  }

  // ===================BHK Filter Function===========
  function getBHKIdValue(event: any) {
    const tmpBHKId = event.target.value
    setMainLoading(true)
    getFilterStandardQuotationData(
      state.bhkData,
      state.carpetAreaData,
      state.selCarpetAreaID,
      tmpBHKId,
      state.selProjectTypeID,
      state.sortBy,
      state.sortType,
      state.searchText
    )
  }

  // ===================CarpetArea Filter Function===========
  function getCarpetAreaIdValue(event: any) {
    const tmpCarpetAreaId = event.target.value
    setMainLoading(true)
    getFilterStandardQuotationData(
      state.bhkData,
      state.carpetAreaData,
      tmpCarpetAreaId,
      state.selBhkID,
      state.selProjectTypeID,
      state.sortBy,
      state.sortType,
      state.searchText
    )
  }

  //   ------View on other tab --------------
  async function downloadFile(selURL: string) {
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

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.standardQuotationData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IStandardQuotationModel[] = state.standardQuotationData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  function resetFilter() {
    setMainLoading(true)
    setName('')
    getFilterStandardQuotationData(state.bhkData, state.carpetAreaData, 0, 0, 0, 0, 0, '')
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>BHK :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getBHKIdValue(e)}
            >
              <option selected value={0}>
                Select BHK
              </option>
              {state.bhkData.length > 0 &&
                state.bhkData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.bhkid}
                      selected={state.selBhkID == data.bhkid ? true : false}
                    >
                      {data.bhkName}
                    </option>
                  )
                })}
            </select>
          </div>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Carpet Area :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getCarpetAreaIdValue(e)}
            >
              <option selected value={0}>
                Select Carpet Area
              </option>
              {state.carpetAreaData.length > 0 &&
                state.carpetAreaData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.carpetAreaID}
                      selected={state.selCarpetAreaID == data.carpetAreaID ? true : false}
                    >
                      {data.carpetArea}
                    </option>
                  )
                })}
            </select>
          </div>

          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value: any) => searchFilter(value)}
            />
          </div>

          <div
            className='card-toolbar mt-8'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: '/standard-quotation/add',
                state: {
                  mainBHKID: state.selBhkID,
                  mainCarpetAreaID: state.selCarpetAreaID,
                  mainSearch: state.searchText,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
          <div className=' mt-7 col-xl-1 col-sm-6 d-flex align-content-around flex-wrap justify-content-center'>
            <button
              className='btn btn-sm btn-danger'
              type='button'
              title='Reset'
              onClick={resetFilter}
            >
              Reset
            </button>
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
                  <th className='min-w-25px'></th>
                  {/* <th className='min-w-100px cursor-pointer' onClick={() => getDataBySorting(1)}>
                    BHK Name
                    {state.sortType === 1 && state.sortBy === 1 ? (
                      <span className='bi bi-arrow-down ms-1'></span>
                    ) : state.sortType === 2 && state.sortBy === 1 ? (
                      <span className='bi bi-arrow-up ms-1'></span>
                    ) : (
                      <span className='bi bi-arrow-down-up ms-1'></span>
                    )}
                  </th>
                  <th className='min-w-100px cursor-pointer' onClick={() => getDataBySorting(2)}>
                    <span className='d-flex'>
                      Type
                      {state.sortType === 1 && state.sortBy === 2 ? (
                        <span className='bi bi-arrow-down ms-1'></span>
                      ) : state.sortType === 2 && state.sortBy === 2 ? (
                        <span className='bi bi-arrow-up ms-1'></span>
                      ) : (
                        <span className='bi bi-arrow-down-up ms-1'></span>
                      )}
                    </span>
                  </th>
                  <th className='min-w-100px cursor-pointer' onClick={() => getDataBySorting(3)}>
                    <span className='d-flex'>
                      Carpet Area
                      {state.sortType === 1 && state.sortBy === 3 ? (
                        <span className='bi bi-arrow-down ms-1'></span>
                      ) : state.sortType === 2 && state.sortBy === 3 ? (
                        <span className='bi bi-arrow-up ms-1'></span>
                      ) : (
                        <span className='bi bi-arrow-down-up ms-1'></span>
                      )}
                    </span>
                  </th> */}
                  <th className='min-w-100px'>BHK Name</th>
                  <th className='min-w-100px'>Project Type</th>
                  <th className='min-w-100px'>Carpet Area</th>
                  <th className='min-w-25px text-center'>Download</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
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
                          <div className='d-flex align-items-center'>
                            <div
                              className='symbol symbol-45px me-5 cursor-pointer'
                              onClick={() => handleShowFlag(data.filePath)}
                            >
                              {/* <img src={process.env.REACT_APP_API_URL + data.filePath} alt='' /> */}
                              <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                            </div>
                            {/* <div className='d-flex justify-content-start flex-column'>
                              <a href='#' className='text-dark text-hover-primary fs-6'>
                                {data.productName}
                              </a>
                            </div> */}
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.bhkName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.projectType}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.carpetArea}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                            title='Download'
                            onClick={() => downloadFile(data.filePath)}
                          >
                            <KTSVG
                              path='/media/icons/duotune/files/fil017.svg'
                              className='svg-icon-fluid svg-icon-primary'
                            />
                          </span>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/standard-quotation/edit/${data.standarQuotationPDFID}`,
                                state: {
                                  mainBHKID: state.selBhkID,
                                  mainCarpetAreaID: state.selCarpetAreaID,
                                  mainSearch: state.searchText,
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
                              onClick={() => handleShow(data.standarQuotationPDFID)}
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
                  colSpan={8}
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
        id={state.selStandardQuotationID}
        pageName={'StandardQuotation'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteStandardQuotationItem(state.selStandardQuotationID)}
      />

      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showFlag}
        onHide={handleCloseFlag}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Country Flag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <iframe src={state.imageShow} height={600} width='100%' />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default StandardQuotationListPage
