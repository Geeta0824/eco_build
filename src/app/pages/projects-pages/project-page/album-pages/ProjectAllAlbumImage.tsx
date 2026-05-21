import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {Button, Col, Container, Modal, Row} from 'react-bootstrap-v5'
import {IAlbumImageModel} from '../../../../models/projects-page/IAlbumImageModel'
import {
  deleteProjectAlbumPhotosDtls,
  getProjectAlbumPhotosListByProjAlbumId,
} from '../../../../modules/project-master-page/project-master/photo-album-pages/PhotoAlbumCRUD'

type Props = {}

interface I3dImage {
  loading: boolean
  albumImagesData: IAlbumImageModel[]
  tmpAlbumImagesData: IAlbumImageModel[]
  selProjAlbumID: number
  selAlbumImgDtlID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  projName: string
  customerName: string
  albumName: string
  pathUrl: any
  projectID: number
}

const ProjectAllAlbumImage: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<I3dImage>({
    loading: false,
    albumImagesData: [] as IAlbumImageModel[],
    tmpAlbumImagesData: [] as IAlbumImageModel[],
    selProjAlbumID: 0,
    selAlbumImgDtlID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    projName: '',
    customerName: '',
    albumName: '',
    pathUrl: process.env.REACT_APP_API_URL,
    projectID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let customerName: any = lc.customerName
      let projectID: any = lc.projectID
      let projectAlbumID: any = lc.projectAlbumID
      let albumName: any = lc.albumName
      getAllProjectAlbumPhotosData(projName, customerName, albumName, projectID, projectAlbumID)
    }, 100)
  }, [])

  function getAllProjectAlbumPhotosData(
    projName: string,
    customerName: string,
    albumName: string,
    projectID: number,
    projectAlbumID: number
  ) {
    getProjectAlbumPhotosListByProjAlbumId(projectAlbumID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            albumImagesData: responseData,
            tmpAlbumImagesData: responseData,
            projName: projName,
            customerName: customerName,
            albumName: albumName,
            projectID: projectID,
            selProjAlbumID: projectAlbumID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            albumImagesData: [],
            tmpAlbumImagesData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          albumImagesData: [],
          tmpAlbumImagesData: [],
          loading: false,
        })
      })
  }

  //==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projAlbumDtlID: number) => {
    setState({
      ...state,
      selAlbumImgDtlID: projAlbumDtlID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteProjectAlbumPhotosItem(projAlbumDtlID: number) {
    deleteProjectAlbumPhotosDtls(projAlbumDtlID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllProjectAlbumPhotosData(
            state.projName,
            state.customerName,
            state.albumName,
            state.projectID,
            state.selProjAlbumID
          )
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
      const results = state.tmpAlbumImagesData.filter((user) => {
        return user.photoTitle.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, albumImagesData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, albumImagesData: state.tmpAlbumImagesData})
      // If the text field is empty, show all users
      setTotal(state.tmpAlbumImagesData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Images Photo============
  const [showPhoto, setShowPhoto] = useState(false)
  const handleClosePhoto = () => {
    setState({...state, imageShow: '', loading: false})
    setShowPhoto(false)
  }
  const handleShowPhoto = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowPhoto(true)
  }

  // ================Download============
  const [downloading, setDownloading] = useState(false)
  async function downloadFile(imageUrl: string) {
    // console.log(imageUrl)
    setDownloading(false)
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
    } catch (error: any) {
      console.log(error.message)
      setDownloading(false)
    }
  }

  const getFileNameFromUrl = (url: any) => {
    const uri: any = new URL(url)
    return decodeURIComponent(uri.pathname.split('/').pop())
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
  const currentPosts: IAlbumImageModel[] = state.albumImagesData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2' style={{backgroundColor: '#000000'}}>
          <div className='col-8 text-start mt-3'>
            <label className='text-white fs-5 fw-bold '>Album Name : &nbsp;</label>
            {/* <span className='text-primary fw-bold  fs-5 '>{state.projName}</span> */}
            <span className='text-primary fw-bold fs-5 '>{state.albumName}</span>
          </div>

          <div className='text-end mt-3'>
            <Link
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
              to={{
                pathname: `/projects/project/album/addImg`,
                state: {
                  projectID: state.projectID,
                  projectAlbumID: state.selProjAlbumID,
                  albumName: state.albumName,
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
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                <div className={`card  box-shadow-0`}>
                  <Container>
                    <Row>
                      {currentPosts.length > 0 &&
                        currentPosts.map((data, index) => (
                          <Col xs={8} md={3} key={index}>
                            <div className='d-flex align-items-center mb-2 mx-15 text-center'>
                              <div
                                className='symbol symbol-100px'
                                // onClick={() => handleShowPhoto(data.photoPath)}
                              >
                                {data.photoPath !== '' ? (
                                  <img
                                    src={process.env.REACT_APP_API_URL + data.photoPath}
                                    alt=''
                                  />
                                ) : (
                                  <img
                                    src={toAbsoluteUrl('/media/img/NoProductImage.png')}
                                    alt=''
                                  />
                                )}
                              </div>
                            </div>
                            <div className='mb-10 ms-6 '>
                              <span
                                className='btn btn-icon btn-bg-light bg-hover-primaryMain text-hover-inverse-primaryMain btn-sm me-1 text-primaryMain text-hover-light'
                                onClick={() => handleShowPhoto(data.photoPath)}
                                title='View Photo'
                              >
                                <span className='fa fa-eye fs-2'></span>
                              </span>
                              {downloading ? (
                                'Downloading...'
                              ) : (
                                <span
                                  className='btn btn-icon btn-bg-light bg-hover-primary mx-2 text-primary text-hover-inverse-primary btn-sm'
                                  onClick={() => downloadFile(state.pathUrl + data.photoPath)}
                                  title='Download'
                                >
                                  <span className='fa fa-download fs-2 '></span>
                                </span>
                              )}
                              <div
                                onClick={() => handleShow(data.projectAlbumDtlID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger mx-1 text-hover-inverse-danger  btn-sm'
                                title='Delete'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='ssvg-icon-3 svg-icon-danger'
                                />
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
        id={state.selAlbumImgDtlID}
        pageName={'Album Photos'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProjectAlbumPhotosItem(state.selAlbumImgDtlID)}
      />
      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showPhoto}
        onHide={handleClosePhoto}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className='text-muted text-light'>Album Photo</span>
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
          <Button variant='danger' onClick={handleClosePhoto}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {ProjectAllAlbumImage}
