import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {I3dImagesModel} from '../../../../models/projects-page/I3dImagesModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {
  deleteProjectProject3dImageByID,
  getProjectProject3dImageList,
} from '../../../../modules/project-master-page/project-master/_3d-photos-master-pages/_3DPhotosCRUD'

type Props = {}

interface I3dImage {
  loading: boolean
  _3dImagesData: I3dImagesModel[]
  tmp_3dImagesData: I3dImagesModel[]
  selProjectAdditionalItemID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  projName: string
  customerName: string
  pathUrl: any
  projectID: number
}

const _3DPhotosListPage: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<I3dImage>({
    loading: false,
    _3dImagesData: [] as I3dImagesModel[],
    tmp_3dImagesData: [] as I3dImagesModel[],
    selProjectAdditionalItemID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    projName: '',
    customerName: '',
    pathUrl: process.env.REACT_APP_API_URL,
    projectID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      getAllProject3dImageData(projName, customerName, projectID)
    }, 100)
  }, [])

  function getAllProject3dImageData(projName: string, customerName: string, projectID: number) {
    getProjectProject3dImageList(projectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            _3dImagesData: responseData,
            tmp_3dImagesData: responseData,
            projName: projName,
            customerName: customerName,
            projectID: projectID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            _3dImagesData: [],
            tmp_3dImagesData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          _3dImagesData: [],
          tmp_3dImagesData: [],
          loading: false,
        })
      })
  }

  //==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectAdditionalItemID: number) => {
    setState({
      ...state,
      selProjectAdditionalItemID: projectAdditionalItemID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteProject3dImageItem(projectVendorID: number) {
    deleteProjectProject3dImageByID(projectVendorID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllProject3dImageData(state.projName, state.customerName, state.projectID)
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

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmp_3dImagesData.filter((user) => {
        return user.photoTitle.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, _3dImagesData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, _3dImagesData: state.tmp_3dImagesData})
      // If the text field is empty, show all users
      setTotal(state.tmp_3dImagesData.length)
      setPage(1)
    }

    setName(keyword)
  }

  const [downloading, setDownloading] = useState(false)
  async function downloadFile(selURL: string) {
    // console.log(imageUrl)
    setDownloading(false)
    try {
      const response = await fetch(
        `${state.pathUrl}/Document/DownloadImage/download?imageUrl=${selURL}`
      )
      if (!response.ok) {
        throw new Error('Failed to download image')
      }
      const blob = await response.blob()
      const fileName = getFileNameFromUrl(selURL)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setDownloading(false)
    } catch (error: any) {
      console.log(error.message)
      setDownloading(false)
    }
  }

  const getFileNameFromUrl = (url: any) => {
    const uri: any = new URL(url)
    return decodeURIComponent(uri.pathname.split('/').pop())
  }

  // ====================Images Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowFlag(true)
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
  const currentPosts: I3dImagesModel[] = state._3dImagesData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 row' style={{backgroundColor: '#000000'}}>
          <div className='text-end col-12 mt-3'>
            <Link
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
              to={{
                pathname: `/projects/project/photos/add`,
                state: {
                  projectID: state.projectID,
                  customerName: state.customerName,
                  projName: state.projName,
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
                  <th className='min-w-150px'>
                    <span className='d-block text-start'>Title</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Download</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>View</span>
                  </th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
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
                        <td>
                          <div className='d-flex align-items-center'>
                            <div
                              className='symbol symbol-45px me-5'
                              // onClick={() => handleShowFlag(data.photoPath)}
                            >
                              {data.photoPath !== '' ? (
                                <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                              ) : (
                                <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                              )}
                            </div>
                            <div className='d-flex justify-content-center flex-column'>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.photoTitle}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className=''>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary mx-2 text-primary text-hover-inverse-primary btn-sm'
                            onClick={() => downloadFile(state.pathUrl + data.photoPath)}
                          >
                            {/* <KTSVG
                              path='/media/icons/duotune/files/fil017.svg'
                              className='svg-icon-fluid svg-icon-primary'
                            /> */}
                            <span className='fa fa-download fs-2'></span>
                          </span>
                        </td>
                        <td className=''>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            onClick={() => handleShowFlag(data.photoPath)}
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </span>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/projects/project/photos/edit/${data.projectImageID}`,
                                state: {
                                  projectID: state.projectID,
                                  customerName: state.customerName,
                                  projName: state.projName,
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
                              onClick={() => handleShow(data.projectImageID)}
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
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
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
              <Modal.Title>
                <span className='d-block mb-1'>
                  <span className='text-muted text-light'>Project Name :- </span>
                  <span className='text-dark text-hover-primary '>{state.projName} </span>
                </span>
                <span className='text-dark d-block'>
                  <span className='text-muted text-light'>Customer Name :- </span>
                  <span className='text-dark text-hover-primary '>{state.customerName}</span>
                </span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mb-5'>
                <img
                  alt='image not found'
                  className='img-fluid'
                  src={
                    state.imageShow == ''
                      ? toAbsoluteUrl('/media/img/NoProductImage.png')
                      : toAbsoluteUrl(`${state.imageShow}`)
                  }
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={handleCloseFlag}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
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
        id={state.selProjectAdditionalItemID}
        pageName={'AdditionalItem'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProject3dImageItem(state.selProjectAdditionalItemID)}
      />
    </>
  )
}

export {_3DPhotosListPage}
