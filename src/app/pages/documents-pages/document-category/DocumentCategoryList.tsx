import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Col, Container, Modal, Row} from 'react-bootstrap-v5'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {
  IDocumentCategoryModel,
  IUserMapWithDocCatgryModel,
} from '../../../models/documents/IDocumentCategoryModel'
import {
  deleteDocumentCategory,
  getDocumentCategory,
  getUpdateDocumentCatgryID,
  getUserWithDocumentCategoryIDApi,
  isActiveDocument,
  updateDocumentCategory,
} from '../../../modules/documents-mst-pages/document-category/DocumentCategoryCRUD'
import {ModelPopUpUserMap} from './ModelPopUpUserMap'
import {AddDocumentCategoryPopUp} from './AddDocumentCategoryPopUp'
import {Link, useHistory, useLocation} from 'react-router-dom'
type Props = {}

interface IDocCtgy {
  loading: boolean
  documentCategoryData: IDocumentCategoryModel[]
  temDocumentCategoryData: IDocumentCategoryModel[]
  objUserData: IUserMapWithDocCatgryModel[]
  objDocCategoryData: IDocumentCategoryModel
  SearchText: string
  selDocumentCategoryId: number
  activeID: number
  documentCategoryID: number
  activeType: any
}

const DocumentCategoryList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [docCategoryName, setDocCategoryName] = useState<string>('')
  const [isActive, setIsActive] = useState(false)
  const location = useLocation()
  const [state, setState] = useState<IDocCtgy>({
    loading: false,
    documentCategoryData: [] as IDocumentCategoryModel[],
    temDocumentCategoryData: [] as IDocumentCategoryModel[],
    objUserData: [] as IUserMapWithDocCatgryModel[],
    objDocCategoryData: {} as IDocumentCategoryModel,
    SearchText: '',
    selDocumentCategoryId: 0,
    activeID: 0,
    documentCategoryID: 0,
    activeType: false,
  })
  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.SearchText
      }
      getDocumentCategoryData(mainSearch)
    })
  }, [])

  function getDocumentCategoryData(temSearchText: string) {
    getDocumentCategory(user.roleID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (temSearchText !== '') {
            const results = responseData.filter((user: any) => {
              return (
                // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
                user.documentCategoryName.toLowerCase().includes(temSearchText.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              documentCategoryData: results,
              temDocumentCategoryData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              documentCategoryData: responseData,
              temDocumentCategoryData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(temSearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, documentCategoryData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, documentCategoryData: [], loading: false})
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
    isActiveDocument(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getDocumentCategoryData(state.SearchText)
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

  //----------------------------- User Map API Call And PopUP ----------------------
  const [showUserMap, setShowUserMap] = useState(false)
  const handleCloseUser = () => {
    setShowUserMap(false)
    setState({...state, loading: false})
  }

  function handleShowUserMap(objUserMdl: IDocumentCategoryModel) {
    getUserWithDocumentCategoryIDApi(objUserMdl.documentCategoryID)
      .then((response) => {
        const resUserMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            objUserData: resUserMapData,
            objDocCategoryData: objUserMdl,
            loading: false,
          })
        } else {
          setState({
            ...state,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, loading: false})
      })
    setShowUserMap(true)
  }
  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (documentCategoryID: number) => {
    setState({
      ...state,
      selDocumentCategoryId: documentCategoryID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDocumentCategoryItem(documentCategoryId: number) {
    deleteDocumentCategory(documentCategoryId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getDocumentCategoryData(state.SearchText)
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

  // -------------------------- For Document Category Add PopUp -----------------
  const [showCategory, setShowCategory] = useState(false)
  const handleCloseCategory = () => {
    setShowCategory(false)
    getDocumentCategoryData(state.SearchText)
  }

  function handleShowAddDocCate(temName: string) {
    // console.log('Nsmer' + temName)
    setState({...state, SearchText: temName})
    setShowCategory(true)
  }

  // -------------------------- For Document Category Update PopUp -----------------
  const [showCategoryEdit, setShowCategoryEdit] = useState(false)
  const handleCloseCategoryEdit = () => {
    setShowCategoryEdit(false)
    getDocumentCategoryData(state.SearchText)
  }

  //------------------- the search result-----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.temDocumentCategoryData.filter((user) => {
        return user.documentCategoryName.toLowerCase().includes(keyword.toLowerCase())
      })
      setState({...state, documentCategoryData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, documentCategoryData: state.temDocumentCategoryData})
      setTotal(state.temDocumentCategoryData.length)
      setPage(1)
    }

    setName(keyword)
  }

  const [loading, setLoading] = useState(false)
  function DocumentCategory(event: any) {
    setDocCategoryName(event.target.value)
  }

  function checkedFunctionIsActive(event: any) {
    setIsActive(event.target.checked)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDocumentCategoryModel[] = state.documentCategoryData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // -------------------------- Get Document Category By ID API Call -----------------
  function handleShowDocCateEdit(temDocmentCateID: number, temSearchText: string) {
    getUpdateDocumentCatgryID(temDocmentCateID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          setDocCategoryName(response.data.documentCategoryName)
          setIsActive(response.data.isActive)
          setState({
            ...state,
            loading: false,
            documentCategoryID: temDocmentCateID,
            SearchText: temSearchText,
          })
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
    setShowCategoryEdit(true)
  }

  // =================== Update Document Category API Call ==========================
  function UpdateDocumentCategory() {
    setTimeout(() => {
      if (docCategoryName == '') {
        return toast.error(`Please Enter Dcument Category`)
      }
      updateDocumentCategory(
        state.documentCategoryID,
        docCategoryName,
        isActive,
        user.employeeID,
        '192.168.0.1'
      )
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Updated Successfull')
            setLoading(false)
            handleCloseCategoryEdit()
            getDocumentCategoryData(state.SearchText)
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
      <div className={`card `}>
        {/* Header */}
        <div className='card-header border-0 ' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                name='search'
                placeholder='Search'
                onChange={(e) => filter(e)}
                value={name}
              />
            </span>
          </div>
          <div
            className={user.roleID == 1 || user.roleID == 2 ? 'card-toolbar' : 'd-none'}
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a Document Category'
          >
            <span
              onClick={() => handleShowAddDocCate(name)}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </span>
          </div>
        </div>
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
                        currentPosts.map((data, index) => (
                          <Col xs={2} md={2} key={index} className='g-5'>
                            <div className='d-flex justify-content-center align-items-center'>
                              <div className='fv-row  border border-primary border-hover border-2 rounded cursor-pointer'>
                                <div className='w-100 d-block'>
                                  <Link
                                    className='d-block symbol symbol-100px mt-1 ms-1 me-1 mb-1'
                                    title='Click View Document'
                                    to={{
                                      pathname: `/documents/document-ctgry/document/list`,
                                      state: {
                                        documentCategoryID: data.documentCategoryID,
                                        documentCategoryName: data.documentCategoryName,
                                        SearchText: name,
                                      },
                                    }}
                                  >
                                    <img src={toAbsoluteUrl('/media/img/folder_img.png')} />
                                    <span className='d-flex justify-content-center text-dark text-hover-primary'>
                                      <div>{data.documentCategoryName}</div>
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <div
                                className={
                                  user.roleID == 1 || user.roleID == 2 ? 'ms-2 d-block' : 'd-none'
                                }
                              >
                                <span
                                  onClick={() => handleShowUserMap(data)}
                                  className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                                  title='User Map'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/social/soc005.svg'
                                    className='svg-icon-2x svg-icon-primary'
                                  />
                                </span>
                                <span>
                                  <span
                                    onClick={() =>
                                      handleShowDocCateEdit(data.documentCategoryID, name)
                                    }
                                    className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary mt-2 btn-sm'
                                  >
                                    <KTSVG
                                      path='/media/icons/duotune/art/art005.svg'
                                      className='svg-icon-3 svg-icon-primary'
                                    />
                                  </span>
                                </span>
                                <span
                                  onClick={() => handleShow(data.documentCategoryID)}
                                  className='d-flex btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger mt-2 btn-sm'
                                  title='Delete'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/general/gen027.svg'
                                    className='ssvg-icon-3 svg-icon-danger'
                                  />
                                </span>
                              </div>
                            </div>
                          </Col>
                        ))}
                    </Row>
                  </Container>
                </div>
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
        id={state.selDocumentCategoryId}
        pageName={'Document Category'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDocumentCategoryItem(state.selDocumentCategoryId)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Document Category'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
      {/* ===================User Model=====================  */}
      <ModelPopUpUserMap
        show={showUserMap}
        handleClose={handleCloseUser}
        UserMapData={state.objUserData}
        DocumentCategoryID={state.objDocCategoryData.documentCategoryID}
        DocumentCategoryName={state.objDocCategoryData.documentCategoryName}
      />
      {/* ---------------------------- Add Document Category--------------------- */}
      <AddDocumentCategoryPopUp show={showCategory} handleClose={handleCloseCategory} />
      {/* ---------------------------- Update Document Category--------------------- */}
      <Modal size='lg' show={showCategoryEdit} onHide={handleCloseCategoryEdit} keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Update Document Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Document Category Name:
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='document Category name'
                  value={docCategoryName}
                  onChange={(e) => DocumentCategory(e)}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
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
          <Button variant='primary' onClick={() => UpdateDocumentCategory()}>
            Submit
          </Button>
          <Button variant='danger' onClick={handleCloseCategoryEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DocumentCategoryList
