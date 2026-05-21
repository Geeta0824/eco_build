import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Button, Col, Container, Modal, Row} from 'react-bootstrap-v5'
import {IDocumentMstModel} from '../../../models/documents/IDocumentMstModel'
import {
  deleteDocumentMst,
  getHRDocumentByRoleID,
  getUpdateDocumentMst,
  isActiveDocumentMst,
  updateDocumentByID,
} from '../../../modules/documents-mst-pages/document-mst-pages/DocumentCRUD'
import {AddDocumentPopUp} from './AddDocumentPopUp'

type Props = {}

interface IDocument {
  loading: boolean
  documentMstData: IDocumentMstModel[]
  tmpDocumentMstData: IDocumentMstModel[]
  imageShow: string
  SearchText: string
  MainSearch: string
  selDocumentCategoryID: number
  selDocumentID: number
  activeID: number
  activeType: any
  pathUrl: any
  documentName: string
  selDocumentCategoryName: string
}

const DocumentMstList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [documentName, setDocumentName] = useState<string>('')
  const [filePath, setFilePath] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [isActive, setIsActive] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IDocument>({
    loading: false,
    documentMstData: [] as IDocumentMstModel[],
    tmpDocumentMstData: [] as IDocumentMstModel[],
    imageShow: '',
    SearchText: '',
    MainSearch: '',
    selDocumentCategoryID: 0,
    selDocumentID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    documentName: '',
    selDocumentCategoryName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    const lc: any = location.state
    const documentCategoryID = lc.documentCategoryID
    const selDocumentCategoryName = lc.documentCategoryName
    const SearchText = lc.SearchText
    setTimeout(() => {
      getAllDocumentMst(selDocumentCategoryName, documentCategoryID, SearchText, state.MainSearch)
    }, 100)
  }, [])

  function getAllDocumentMst(
    temDocumentCategoryName: string,
    temDocumentCategoryID: number,
    temSearchText: string,
    temMainSearch: string
  ) {
    getHRDocumentByRoleID(user.roleID, temDocumentCategoryID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (temMainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
                user.documentName.toLowerCase().includes(temMainSearch.toLowerCase()) ||
                user.documentCategoryName.toLowerCase().includes(temMainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              documentMstData: results,
              tmpDocumentMstData: responseData,
              selDocumentCategoryName: temDocumentCategoryName,
              selDocumentCategoryID: temDocumentCategoryID,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              documentMstData: responseData,
              tmpDocumentMstData: responseData,
              selDocumentCategoryName: temDocumentCategoryName,
              selDocumentCategoryID: temDocumentCategoryID,
              SearchText: temSearchText,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(temMainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, documentMstData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, documentMstData: [], loading: false})
      })
  }
  // --------------------------------------------

  // -----------------upload photo----------------------
  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    const file = e.target.files[0]
    if (file) {
      const fileType = file.type

      if (fileType === 'application/pdf') {
        setFileType('PDF')
      } else if (fileType.startsWith('image/')) {
        setFileType('Image')
      } else {
        setFileType('Unknown')
      }
    }
    fetch(process.env.REACT_APP_API_URL + '/Document/SaveDocumentFile', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
        setFileLoader(false)
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
    isActiveDocumentMst(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getAllDocumentMst(
            state.selDocumentCategoryName,
            state.selDocumentCategoryID,
            state.SearchText,
            state.MainSearch
          )
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
  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (temDocumentID: number) => {
    setState({
      ...state,
      selDocumentID: temDocumentID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDocumentMstData(temDocumentID: number) {
    deleteDocumentMst(temDocumentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllDocumentMst(
            state.selDocumentCategoryName,
            state.selDocumentCategoryID,
            state.SearchText,
            state.MainSearch
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

  // -------------------------- For Document Category Update PopUp -----------------
  const [showDocumentEdit, setShowDocumentEdit] = useState(false)
  const handleCloseDocumentEdit = () => {
    setShowDocumentEdit(false)
    getAllDocumentMst(
      state.selDocumentCategoryName,
      state.selDocumentCategoryID,
      state.SearchText,
      state.MainSearch
    )
  }

  // -------------------------------------------

  const [loading, setLoading] = useState(false)
  function DocumentCategory(event: any) {
    setDocumentName(event.target.value)
  }

  function checkedFunctionIsActive(event: any) {
    setIsActive(event.target.checked)
  }

  // ================Download============
  const [downloading, setDownloading] = useState(false)
  const [docID, setDocID] = useState(0)
  async function downloadDocumentFile(imageUrl: string, temDocID: number) {
    setDownloading(true)
    setDocID(temDocID)
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
      setDocID(0)
    } catch (error: any) {
      console.log(error.message)
      setDownloading(false)
      setDocID(0)
    }
  }

  const getFileNameFromUrl = (url: any) => {
    const uri: any = new URL(url)
    return decodeURIComponent(uri.pathname.split('/').pop())
  }

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string, documentName: string) => {
    setState({
      ...state,
      imageShow: process.env.REACT_APP_API_URL + selImg,
      documentName: documentName,
      loading: false,
    })
    setShowFlag(true)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDocumentMstData.filter((user) => {
        return (
          // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.documentName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.documentCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, documentMstData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, documentMstData: state.tmpDocumentMstData})
      // If the text field is empty, show all users
      setTotal(state.tmpDocumentMstData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.documentMstData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDocumentMstModel[] = state.documentMstData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  // --------------------------------------------------------------------

  const [showDocumentAdd, setShowDocumentAdd] = useState(false)
  const handleCloseDocumentAdd = () => {
    setShowDocumentAdd(false)
    getAllDocumentMst(
      state.selDocumentCategoryName,
      state.selDocumentCategoryID,
      state.SearchText,
      state.MainSearch
    )
  }

  function handleShowDocumentAdd(temName: string) {
    setState({...state, MainSearch: temName})
    setShowDocumentAdd(true)
  }

  // -------------------------- Get Document By ID API Call -----------------
  function handleShowDocCateEdit(temDocmentID: number, temName: string) {
    updateDocumentByID(temDocmentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          setDocumentName(response.data.documentName)
          setIsActive(response.data.isActive)

          let fileType: any
          let url: any = response.data.attachFile
          let extension: any = url.split('.').pop().toLowerCase()
          if (extension === 'pdf') {
            setFilePath(response.data.attachFile)
            fileType = 'PDF'
            setFileType(fileType)
          } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
            setFilePath(response.data.attachFile)
            fileType = 'Image'
            setFileType(fileType)
          } else {
            fileType = 'Unknown'
          }

          setState({...state, loading: false, selDocumentID: temDocmentID, MainSearch: temName})
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
    setShowDocumentEdit(true)
  }

  // =================== Update Document API Call ==========================
  function UpdateDocument() {
    setTimeout(() => {
      if (documentName == '') {
        return toast.error(`Please Enter Dcument Category`)
      }
      getUpdateDocumentMst(
        state.selDocumentID,
        state.selDocumentCategoryID,
        documentName,
        filePath,
        isActive,
        user.employeeID,
        '192.168.0.1'
      )
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Updated Successfull')
            setLoading(false)
            handleCloseDocumentEdit()
            getAllDocumentMst(
              state.selDocumentCategoryName,
              state.selDocumentCategoryID,
              state.SearchText,
              state.MainSearch
            )
          } else {
            toast.error(`${response.data.message}`)
            setLoading(false)
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
          setLoading(false)
        })
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      <div className='row me-1'>
        <span className='col-10 text-primary text-dark cursor-pointer fs-4 fw-bolder'>
          Document Category Name : &nbsp;
          <span className='text-primary text-hover-danger cursor-pointer fs-4 fw-bolder'>
            {state.selDocumentCategoryName}
          </span>
        </span>
        <span
          className='col-2 btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: `/documents/document-ctgry/list`,
              state: {SearchText: state.SearchText},
            })
          }
          title='vendor List'
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
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
            title='Click to add a Document Category'
          >
            <span
              onClick={() => handleShowDocumentAdd(name)}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </span>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                <div className={`card  box-shadow-0`}>
                  <Container>
                    <Row>
                      {currentPosts.length > 0 &&
                        currentPosts.map((data, index) => {
                          let fileType: any
                          let url: any = data.attachFile
                          let extension: any = url.split('.').pop().toLowerCase()
                          if (extension === 'pdf') {
                            fileType = 'PDF'
                          } else if (
                            ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)
                          ) {
                            fileType = 'Image'
                          } else {
                            fileType = 'Unknown'
                          }
                          return (
                            <Col xs={2} md={3} key={index} className='g-5'>
                              <div className='d-flex justify-content-center rounded align-items-center border border-primary border-2'>
                                <div
                                  className='ms-3 mt-1 w-100 d-block cursor-pointer'
                                  title='Download'
                                  onClick={() =>
                                    downloadDocumentFile(
                                      state.pathUrl + data.attachFile,
                                      data.documentID
                                    )
                                  }
                                >
                                  <span className='d-flex symbol symbol-150px'>
                                    {fileType == 'Image' ? (
                                      <img
                                        src={process.env.REACT_APP_API_URL + data.attachFile}
                                        alt='img'
                                      />
                                    ) : fileType == 'PDF' ? (
                                      <img
                                        src={toAbsoluteUrl('/media/svg/files/pdf.svg')}
                                        alt='pdf'
                                      />
                                    ) : (
                                      'N.A.'
                                    )}
                                  </span>
                                  <span className='d-flex justify-content-center align-items-center text-dark text-hover-primary'>
                                    <div className='text-center'>{data.documentName}</div>
                                  </span>
                                </div>
                                <div className='flex-shrink-1 d-block gy-2'>
                                  <span
                                    onClick={() =>
                                      handleShowFlag(data.attachFile, data.documentName)
                                    }
                                    className='btn btn-icon btn-bg-light bg-hover-primary text-primary text-hover-inverse-primary btn-sm my-1'
                                    title='View'
                                  >
                                    <span className='fa fa-eye fs-2'></span>
                                  </span>
                                  <span
                                    onClick={() =>
                                      downloadDocumentFile(
                                        state.pathUrl + data.attachFile,
                                        data.documentID
                                      )
                                    }
                                    className='btn btn-icon btn-bg-light bg-hover-primary text-primary text-hover-inverse-primary btn-sm'
                                    title='Download'
                                  >
                                    <span className='fa fa-download fs-2'></span>
                                  </span>
                                  {user.roleID == 1 || user.roleID == 2 ? (
                                    <span>
                                      <span
                                        onClick={() => handleShowDocCateEdit(data.documentID, name)}
                                        className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm my-1'
                                      >
                                        <KTSVG
                                          path='/media/icons/duotune/art/art005.svg'
                                          className='svg-icon-3 svg-icon-primary'
                                        />
                                      </span>
                                    </span>
                                  ) : (
                                    <span className='d-none'></span>
                                  )}
                                  {user.roleID == 1 || user.roleID == 2 ? (
                                    <span
                                      onClick={() => handleShow(data.documentID)}
                                      className='d-flex btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm mb-1'
                                      title='Delete'
                                    >
                                      <KTSVG
                                        path='/media/icons/duotune/general/gen027.svg'
                                        className='svg-icon-3 svg-icon-danger'
                                      />
                                    </span>
                                  ) : (
                                    <span className='d-none'></span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          )
                        })}
                    </Row>
                  </Container>
                </div>
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
        id={state.selDocumentCategoryID}
        pageName={'Document'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDocumentMstData(state.selDocumentID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Document'}
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
            {' '}
            <span className='d-block mb-1'>
              <span className='text-muted text-light'>Document Name :- </span>
              <span className='text-dark text-hover-primary '>{state.documentName} </span>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <iframe src={state.imageShow} height={600} width='100%' />
            {/* <img alt='Pic' className='img-fluid' src={toAbsoluteUrl(`${state.imageShow}`)} /> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ---------------------------- Add Document --------------------- */}
      <AddDocumentPopUp
        show={showDocumentAdd}
        handleClose={handleCloseDocumentAdd}
        documentCategoryID={state.selDocumentCategoryID}
        documentCategoryName={state.selDocumentCategoryName}
      />
      {/* ---------------------------- Update Document --------------------- */}
      <Modal size='lg' show={showDocumentEdit} onHide={handleCloseDocumentEdit} keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Update Document</Modal.Title>
          <h3 className='card-title align-items-start'>
            <span className='text-white card-label fs-5 mb-1'>Document Category Name : </span>
            <span className='text-primary card-label fw-bolder fs-5 mb-1'>
              {state.selDocumentCategoryName}
            </span>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                Document Name:
              </label>

              <div className='col-lg-9 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='document name'
                  value={documentName}
                  onChange={(e) => DocumentCategory(e)}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-3 col-form-label fw-bold fs-6'>
                <span className=''>Upload File:</span>
              </label>
              <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                <div className='symbol symbol-45px me-5'>
                  {fileType == 'Image' ? (
                    <img src={process.env.REACT_APP_API_URL + filePath} alt='img' />
                  ) : fileType == 'PDF' ? (
                    <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className={filePath === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
                <input
                  type='file'
                  accept='image/*,.pdf'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  onChange={(e) => imageUpload(e)}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-3 col-form-label fw-bold fs-6'>
                <span className=''>isActive:</span>
              </label>
              <div className='col-lg-8 fv-row'>
                <div className='form-check form-switch'>
                  <input
                    className='form-check-input mt-3'
                    type='checkbox'
                    checked={isActive}
                    onChange={(e) => checkedFunctionIsActive(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => UpdateDocument()}>
            Submit
          </Button>
          <Button variant='danger' onClick={handleCloseDocumentEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default DocumentMstList
