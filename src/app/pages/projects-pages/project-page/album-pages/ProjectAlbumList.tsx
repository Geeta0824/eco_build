import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {Button, Modal} from 'react-bootstrap-v5'
import {IProjectAlbumModel} from '../../../../models/projects-page/IProjectDocumentModel'
import {
  deleteProjectAlbumByID,
  getProjectAlbumListByProjId,
} from '../../../../modules/project-master-page/project-master/photo-album-pages/PhotoAlbumCRUD'

type Props = {}

interface IAlbum {
  loading: boolean
  projectAlbumData: IProjectAlbumModel[]
  tmpProjectAlbumData: IProjectAlbumModel[]
  selProjectAlbumID: number
  activeID: number
  activeType: any
  imageShow: string
  selAlbumTypeID: number
  projName: string
  customerName: string
  pathUrl: any
  projectID: number
}

const ProjectAlbumList: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IAlbum>({
    loading: false,
    projectAlbumData: [] as IProjectAlbumModel[],
    tmpProjectAlbumData: [] as IProjectAlbumModel[],
    selProjectAlbumID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selAlbumTypeID: 0,
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
      getAllProjectAlbumData(projName, customerName, projectID)
    }, 100)
  }, [])

  function getAllProjectAlbumData(projName: string, customerName: string, projectID: number) {
    getProjectAlbumListByProjId(projectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            projectAlbumData: responseData,
            tmpProjectAlbumData: responseData,
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
            projectAlbumData: [],
            tmpProjectAlbumData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectAlbumData: [],
          tmpProjectAlbumData: [],
          loading: false,
        })
      })
  }

  //==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectAlbumID: number) => {
    setState({
      ...state,
      selProjectAlbumID: projectAlbumID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteProjectAlbumDt(projectAlbumID: number) {
    deleteProjectAlbumByID(projectAlbumID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllProjectAlbumData(state.projName, state.customerName, state.projectID)
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

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length

  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectAlbumModel[] = state.projectAlbumData.slice(
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
                pathname: `/projects/project/album/add`,
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
                    <span className='d-block text-start'>Album Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex'>Photo</span>
                  </th>

                  <th className='min-w-25px'>Edit </th>
                  <th className='min-w-25px text-end'> Delete</th>
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
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.albumName}
                          </span>
                        </td>
                        <td className=''>
                          <Link
                            to={{
                              pathname: `/projects/project/album/imgList`,
                              state: {
                                projectAlbumID: data.projectAlbumID,
                                albumName: data.albumName,
                                projectID: state.projectID,
                                customerName: state.customerName,
                                projName: state.projName,
                              },
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            title='Album Photos'
                          >
                            <span className='fa fa-images fs-1'></span>
                          </Link>
                        </td>
                        <td>
                          <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            <Link
                              to={{
                                pathname: `/projects/project/album/edit/${data.projectAlbumID}`,
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
                          </div>
                        </td>
                        <td className='text-dark text-hover-primary d-block mb-1 fs-6 text-end'>
                          <div
                            onClick={() => handleShow(data.projectAlbumID)}
                            className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                          >
                            <KTSVG
                              path='/media/icons/duotune/general/gen027.svg'
                              className='ssvg-icon-3 svg-icon-danger'
                            />
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
          {/* <Modal
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
          </Modal> */}
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
        id={state.selProjectAlbumID}
        pageName={'Album'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProjectAlbumDt(state.selProjectAlbumID)}
      />
    </>
  )
}

export {ProjectAlbumList}
