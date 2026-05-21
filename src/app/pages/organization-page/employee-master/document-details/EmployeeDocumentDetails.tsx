import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {IEmpDocMapModel} from '../../../../models/organization-page/Employee/EmpDocMapModel'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {
  deleteEmpDocMap,
  getEmpDocMap,
  isActiveEmpDocMap,
} from '../../../../modules/organization-page/employee-master-page/document-details/EmpDocMapCRUD'
import {Pagination} from 'antd'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import axios from 'axios'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../../common-pages/ModelPopUpIsActive'

type Props = {}
interface IEmpDocMap {
  loading: boolean
  empDocMapData: IEmpDocMapModel[]
  tmpEmpDocMapData: IEmpDocMapModel[]
  SearchText: string
  selDocMapId: number
  activeID: number
  activeType: any
  selEmpID: number
  pathUrl: any
  fileShow: string
  mainSearch: string
  fileType: number
  empDocumentName: string
  empDocumentNumber: string
}

const EmployeeDocumentDetails: React.FC<Props> = () => {
  const location = useLocation()
  const {employeeID} = useParams<{employeeID: string}>()
  const [state, setState] = useState<IEmpDocMap>({
    loading: false,
    empDocMapData: [] as IEmpDocMapModel[],
    tmpEmpDocMapData: [] as IEmpDocMapModel[],
    SearchText: '',
    selDocMapId: 0,
    activeID: 0,
    activeType: false,
    selEmpID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
    fileShow: '',
    mainSearch: '',
    fileType: 0,
    empDocumentName: '',
    empDocumentNumber: '',
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
      // let empID = localStorage.getItem('editEmpID')!
      // let finalempID: number = JSON.parse(empID)
      getAllEmpDocMapData(parseInt(employeeID), mainSearch)
    }, 100)
  }, [])

  // ============================= GET Employee Document By EmployeeId =============
  function getAllEmpDocMapData(finalempID: number, mainSearch: string) {
    getEmpDocMap(finalempID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.documentTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.docNumber.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.description.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              empDocMapData: results,
              tmpEmpDocMapData: responseData,
              selEmpID: finalempID,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              empDocMapData: responseData,
              tmpEmpDocMapData: responseData,
              selEmpID: finalempID,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          setTotal(responseData.length)
          setPage(1)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, empDocMapData: [], loading: false})
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
    isActiveEmpDocMap(temEmpId, temIsAct)
      .then((response) => {
        getAllEmpDocMapData(state.selEmpID, state.mainSearch)
        setShowActive(false)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (employeeDocID: number) => {
    setState({
      ...state,
      selDocMapId: employeeDocID,
      loading: false,
    })
    setShow(true)
  }

  function deleteEmpDocMapData(EmptemDocMapId: number) {
    deleteEmpDocMap(EmptemDocMapId)
      .then((response) => {
        toast.success('Deleted Successfully')
        getAllEmpDocMapData(state.selEmpID, state.mainSearch)
        setShow(false)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  const [downloading, setDownloading] = useState(false)
  const [selEmpDocID, setSelEmpDocID] = useState<number>(0)
  async function downloadFile(imageUrl: string, temEmpDocID: number) {
    setDownloading(true)
    setSelEmpDocID(temEmpDocID)
    try {
      const response = await fetch(
        `${state.pathUrl}/Document/DownloadImage/download?imageUrl=${imageUrl}`
      )
      if (!response.ok) {
        throw new Error('Failed to download image')
      }
      const blob = await response.blob()
      const fileName = getFileNameFromUrl(imageUrl)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setDownloading(false)
      setSelEmpDocID(0)
    } catch (error: any) {
      console.log(error.message)
      setDownloading(false)
      setSelEmpDocID(0)
    }
  }

  const getFileNameFromUrl = (url: any) => {
    const uri: any = new URL(url)
    return decodeURIComponent(uri.pathname.split('/').pop())
  }

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, fileShow: '', fileType: 0, empDocumentName: '', empDocumentNumber: ''})
    setShowFlag(false)
  }
  const handleShowFlag = (
    selImg: string,
    selType: number,
    selName: string,
    selempDocumentNumber: string
  ) => {
    setState({
      ...state,
      fileType: selType,
      fileShow: state.pathUrl + selImg,
      empDocumentName: selName,
      empDocumentNumber: selempDocumentNumber,
    })
    setShowFlag(true)
  }

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpEmpDocMapData.filter((user) => {
        return (
          user.documentTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.docNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.description.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, empDocMapData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, empDocMapData: state.tmpEmpDocMapData})
      // If the text field is empty, show all users
      setTotal(state.tmpEmpDocMapData.length)
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
  const currentPosts: IEmpDocMapModel[] = state.empDocMapData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <div className='card-header border-0 py-2' style={{backgroundColor: '#2a3952'}}> */}
          {/* <h3 className='card-title align-items-start flex-column'> */}
          {/* <span className='card-label fw-bolder fs-3 mb-1'>Employee Document Map</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Employee Document Map</span> */}
          {/* </h3> */}

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
                placeholder='Search Document'
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
                pathname: `/organization/employee/edit/${state.selEmpID}/document/add`,
                state: {mainSearch: name},
              }}
              className='btn btn-sm btn-light-primary'
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
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-140px'>Document Type</th>
                  <th className='min-w-140px'>Document Number</th>
                  <th className='min-w-50px'>Active</th>
                  <th className='w-50px'>Download</th>
                  <th className='w-50px'>View</th>
                  <th className='min-w-75px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading get Api Data ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div
                              className='symbol symbol-45px me-5 cursor-pointer'
                              onClick={() =>
                                handleShowFlag(
                                  data.filePath,
                                  data.mediaTypeID,
                                  data.documentTypeName,
                                  data.docNumber
                                )
                              }
                            >
                              {data.mediaTypeID === 2 ? (
                                <img src={state.pathUrl + data.filePath} alt='img' />
                              ) : (
                                <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                              )}
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.documentTypeName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.docNumber}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.employeeDocID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          {downloading && selEmpDocID == data.employeeDocID ? (
                            <span className='d-block justify-content-center m-5 p-5'>
                              <span
                                className='spinner-border text-primary'
                                style={{width: '2rem', height: '2rem'}}
                                role='status'
                              >
                                <span className='visually-hidden'>Loading...</span>
                              </span>
                            </span>
                          ) : (
                            <span
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                              onClick={() =>
                                downloadFile(state.pathUrl + data.filePath, data.employeeDocID)
                              }
                            >
                              <KTSVG
                                path='/media/icons/duotune/files/fil017.svg'
                                className='svg-icon-fluid svg-icon-primary'
                              />
                            </span>
                          )}
                        </td>
                        <td className='text-center'>
                          <span
                            className='btn btn-icon btn-bg-light text-success bg-hover-success text-hover-inverse-success btn-sm'
                            onClick={() =>
                              handleShowFlag(
                                data.filePath,
                                data.mediaTypeID,
                                data.documentTypeName,
                                data.docNumber
                              )
                            }
                          >
                            <span className='fa fa-eye lg'></span>
                          </span>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/organization/employee/edit/${state.selEmpID}/document/edit/${data.employeeDocID}`,
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
                              onClick={() => handleShow(data.employeeDocID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
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

                {/* =================== Blank Api Data ============== */}
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
        id={state.selDocMapId}
        pageName={'Employee Document'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteEmpDocMapData(state.selDocMapId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Employee Document'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
      {/* =====================Image Model=================== */}
      <Modal
        size='xl'
        show={showFlag}
        onHide={handleCloseFlag}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className='d-block mb-1'>
              <span className='text-muted text-light'>Document Name :- </span>
              <span className='text-dark text-hover-primary '>{state.empDocumentName} </span>
            </span>
            <span className='text-dark d-block'>
              <span className='text-muted text-light'>Document Number :- </span>
              <span className='text-dark text-hover-primary '>{state.empDocumentNumber}</span>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5 text-center'>
            {state.fileType === 2 ? (
              <img
                alt='Pic'
                className='object-fit-cover h-50 w-50'
                src={toAbsoluteUrl(`${state.fileShow}`)}
              />
            ) : (
              <iframe src={state.fileShow} height={600} width='100%' />
            )}
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

export default EmployeeDocumentDetails
