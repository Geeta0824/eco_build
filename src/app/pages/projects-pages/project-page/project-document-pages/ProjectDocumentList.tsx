import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {IProjectDocumentModel} from '../../../../models/projects-page/IProjectDocumentModel'
import {
  DeleteProjectDocumentDataAPI,
  getAllProjectDocumentListAPI,
} from '../../../../modules/project-master-page/project-master/project-document-pages/ProjectDocumentCRUD'
import {Button, Modal} from 'react-bootstrap-v5'

type Props = {}

interface IProjectVendor {
  loading: boolean
  projectDocumentData: IProjectDocumentModel[]
  tmpProjectDocumentData: IProjectDocumentModel[]
  selProjDocumentID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  projName: string
  customerName: string
  documentName: string
  projectID: number
  pathUrl: any
}

const ProjectDocumentList: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    projectDocumentData: [] as IProjectDocumentModel[],
    tmpProjectDocumentData: [] as IProjectDocumentModel[],
    selProjDocumentID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    projName: '',
    customerName: '',
    documentName: '',
    projectID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      getAllProjectDocumentData(projName, customerName, projectID)
    }, 100)
  }, [])

  function getAllProjectDocumentData(projName: string, customerName: string, projectID: number) {
    getAllProjectDocumentListAPI(projectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            projectDocumentData: responseData,
            tmpProjectDocumentData: responseData,
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
            projectDocumentData: [],
            tmpProjectDocumentData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectDocumentData: [],
          tmpProjectDocumentData: [],
          loading: false,
        })
      })
  }

  //==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectDocumentID: number) => {
    setState({
      ...state,
      selProjDocumentID: projectDocumentID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteProjectDocument(projectDocumentID: number) {
    DeleteProjectDocumentDataAPI(projectDocumentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllProjectDocumentData(state.projName, state.customerName, state.projectID)
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
  
  const [downloading, setDownloading] = useState(false)
  const [proDocID, setProDocID] = useState(0)
  async function downloadDocumentFile(imageUrl: string, temProDocID: number) {
    setDownloading(true)
    setProDocID(temProDocID)
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
      setProDocID(0)
    } catch (error: any) {
      console.log(error.message)
      setDownloading(false)
      setProDocID(0)
    }
  }

  const getFileNameFromUrl = (url: any) => {
    const uri: any = new URL(url)
    return decodeURIComponent(uri.pathname.split('/').pop())
  }

  // ====================Country Doc============
  const [showDoc, setShowDoc] = useState(false)
  const handleCloseDocument = () => {
    setState({...state, imageShow: '', loading: false})
    setShowDoc(false)
  }
  const handleShowDocument = (selImg: string, documentName: string) => {
    setState({
      ...state,
      imageShow: process.env.REACT_APP_API_URL + selImg,
      documentName: documentName,
      loading: false,
    })
    setShowDoc(true)
  }
  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProjectDocumentData.filter((user) => {
        return user.docName.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, projectDocumentData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectDocumentData: state.tmpProjectDocumentData})
      // If the text field is empty, show all users
      setTotal(state.tmpProjectDocumentData.length)
      setPage(1)
    }

    setName(keyword)
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
  const currentPosts: IProjectDocumentModel[] = state.projectDocumentData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 row' style={{backgroundColor: '#000000'}}>
          <div className='text-end mt-3 col-12'>
            <Link
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a Document'
              to={{
                pathname: `/projects/project/proj-document/add`,
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
                    <span className='d-block mb-1'>Document Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex mb-1'>View</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex mb-1'>download</span>
                  </th>
                  {/* <th className='min-w-50px'>
                    <span className='d-flex mb-1'>Edit</span>
                  </th> */}
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
                              // onClick={() => handleShowFlag(data.attachFile)}
                            >
                              <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <a href='#' className='text-dark text-hover-primary fs-6'>
                                {data.docName}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className=''>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            onClick={() => handleShowDocument(data.docPath, data.docName)}
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </span>
                        </td>
                        {downloading && proDocID == data.projectDocID ? (
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
                          <td className=''>
                            <span
                              className='btn btn-icon btn-bg-light bg-hover-primary text-primary text-hover-inverse-primary btn-sm'
                              onClick={() =>
                                downloadDocumentFile(
                                  state.pathUrl + data.docPath,
                                  data.projectDocID
                                )
                              }
                              title='Download'
                            >
                              <span className='fa fa-download fs-2 '></span>
                            </span>
                          </td>
                        )}
                        <td>
                          <div className='d-flex justify-content-end ms-2 flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/projects/project/proj-document/edit/${data.projectDocID}`,
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
                              onClick={() => handleShow(data.projectDocID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger mx-2 text-hover-inverse-danger  btn-sm'
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
        id={state.selProjDocumentID}
        pageName={'Proj Document'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProjectDocument(state.selProjDocumentID)}
      />
      {/* =====================Image Model=================== */}
      <Modal
        size='xl'
        show={showDoc}
        onHide={handleCloseDocument}
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
            {/* <img alt='Pic' className='img-fluid' src={toAbsoluteUrl(`${state.imageShow}`)} /> */}

            <iframe src={state.imageShow} height={600} width='100%' />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseDocument}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {ProjectDocumentList}
