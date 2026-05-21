import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {IPhotosProductModel} from '../../../../models/carpetry-page/IPhotosProductModel'
import {getAllAdditionalItemListAPI} from '../../../../modules/project-master-page/project-master/AdditionalItemServiceCRUD'
import {toast} from 'react-toastify'
import {
  deleteTurnkeyProductImageApi,
  getAllTurnkeyProductImageApi,
} from '../../../../modules/carpetry-master-page/carpetry-product-master-master-page/carpetry-product-photos-master/ProductPhotosCRUD'
import {Button, Modal} from 'react-bootstrap-v5'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'

type Props = {}

interface IProjectVendor {
  loading: boolean
  photosProductData: IPhotosProductModel[]
  tmpPhotosProductData: IPhotosProductModel[]
  selTurnkeyProductImageID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  description: string
  productName: string
  productID: number
  pathUrl: any
  mainSearch: string
  productCategoryID: number
  unitID: number
}

const PhotoCarpetryProduct: React.FC<Props> = () => {
  const history = useHistory()
  const {projectAdditionalItemID} = useParams<{projectAdditionalItemID: string}>()
  const location = useLocation()
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    photosProductData: [] as IPhotosProductModel[],
    tmpPhotosProductData: [] as IPhotosProductModel[],
    selTurnkeyProductImageID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    description: '',
    productName: '',
    productID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
    mainSearch: '',
    productCategoryID: 0,
    unitID: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let productID: number = 0
      let productName: string = ''
      let description: string = ''
      let mainSearch: string = ''
      let productCategoryID: number = 0
      let unitID: number = 0
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        productCategoryID = lc.mainProductCatgryID
        unitID = lc.mainUnitID
        productID = lc.productID
        productName = lc.productName
        description = lc.description
      }
      getAllAdditionalItemData(
        productID,
        productName,
        description,
        mainSearch,
        productCategoryID,
        unitID
      )
    }, 100)
  }, [])

  function getAllAdditionalItemData(
    productID: number,
    productName: string,
    description: string,
    mainSearch: string,
    productCategoryID: number,
    unitID: number
  ) {
    getAllTurnkeyProductImageApi(productID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            photosProductData: responseData,
            tmpPhotosProductData: responseData,
            productID: productID,
            productName: productName,
            description: description,
            mainSearch,
            productCategoryID,
            unitID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            photosProductData: [],
            tmpPhotosProductData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          photosProductData: [],
          tmpPhotosProductData: [],
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
      selTurnkeyProductImageID: projectAdditionalItemID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteTurnkeyProduct(turnkeyProductImageID: number) {
    deleteTurnkeyProductImageApi(turnkeyProductImageID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllAdditionalItemData(
            state.productID,
            state.productName,
            state.description,
            state.mainSearch,
            state.productCategoryID,
            state.unitID
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
      const results = state.tmpPhotosProductData.filter((user) => {
        return (
          //   user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectType.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, photosProductData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, photosProductData: state.tmpPhotosProductData})
      // If the text field is empty, show all users
      setTotal(state.tmpPhotosProductData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // async function downloadFile(selURL: string) {
  //   var fullUrl = state.pathUrl + selURL
  //   //Split image name
  //   const nameSplit = fullUrl.split('/')
  //   const duplicateName = nameSplit.pop()

  //   // let url = window.URL.createObjectURL(new Blob([fullUrl]))
  //   // let a = document.createElement('a')
  //   // a.href = url
  //   // a.download = '' + duplicateName + ''
  //   // a.click()
  //   const link = document.createElement('a')
  //   // link.download = '' + duplicateName + ''
  //   link.target = '_blank'
  //   link.href = `${fullUrl}`
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

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
  // const [showFlag, setShowFlag] = useState(false)
  // const handleCloseFlag = () => {
  //   setState({...state, fileShow: '', fileType: 0, empDocumentName: '', empDocumentNumber: ''})
  //   setShowFlag(false)
  // }
  // const handleShowFlag = (
  //   selImg: string,
  //   selType: number,
  //   selName: string,
  //   selempDocumentNumber: string
  // ) => {
  //   setState({
  //     ...state,
  //     fileType: selType,
  //     fileShow: state.pathUrl + selImg,
  //     empDocumentName: selName,
  //     empDocumentNumber: selempDocumentNumber,
  //   })
  //   setShowFlag(true)
  // }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length

  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IPhotosProductModel[] = state.photosProductData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/carpetry/product-master/list',
              state: {
                search: state.mainSearch,
                UnitID: state.unitID,
                ProductCategoryID: state.productCategoryID,
              },
            })
          }
        >
          Back To Main List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='col-8 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Product Name : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.productName}</span>
          </div>
          <div className='col-10 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Description : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.description}</span>
          </div>

          <div className='text-end mb-2'>
            <Link
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
              to={{
                pathname: `/carpetry/product-master/photos/${state.productID}/add`,
                state: {
                  productID: state.productID,
                  productName: state.productName,
                  description: state.description,
                  searchText: state.mainSearch,
                  mainUnitID: state.unitID,
                  mainProductCatgryID: state.productCategoryID,
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
                  <th className='min-w-120px'>
                    <span className='d-block mb-1 text-center me-2'>Project Type</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex mb-1'>Download</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex mb-1'>View</span>
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
                              // onClick={() => handleShowFlag(data.filePath)}
                            >
                              {data.filePath !== '' ? (
                                <img src={process.env.REACT_APP_API_URL + data.filePath} alt='' />
                              ) : (
                                <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                              )}
                            </div>
                            <div className='d-flex justify-content-center flex-column'>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.projectType}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* <td className=''>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                            onClick={() => downloadFile(data.filePath)}
                          >
                            <KTSVG
                              path='/media/icons/duotune/files/fil017.svg'
                              className='svg-icon-fluid svg-icon-primary'
                            />
                          </span>
                        </td> */}
                        {downloading && proDocID == data.turnkeyProductImageID ? (
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
                                  state.pathUrl + data.filePath,
                                  data.turnkeyProductImageID
                                )
                              }
                              title='Download'
                            >
                              <span className='fa fa-download fs-2 '></span>
                            </span>
                          </td>
                        )}
                        <td className=''>
                          <span
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            onClick={() => handleShowFlag(data.filePath)}
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </span>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/carpetry/product-master/photos/${state.productID}/edit/${data.turnkeyProductImageID}`,
                                state: {
                                  productID: state.productID,
                                  productName: state.productName,
                                  description: state.description,
                                  searchText: state.mainSearch,
                                  mainUnitID: state.unitID,
                                  mainProductCatgryID: state.productCategoryID,
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
                              onClick={() => handleShow(data.turnkeyProductImageID)}
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
                        <span className='text-muted text-light'>Product Name :- </span>
                        <span className='text-dark text-hover-primary '>{state.productName} </span>
                      </span>
                      <span className='text-dark d-block'>
                        <span className='text-muted text-light'>description :- </span>
                        <span className='text-dark text-hover-primary '>{state.description}</span>
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
        id={state.selTurnkeyProductImageID}
        pageName={'Turnkey Product'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteTurnkeyProduct(state.selTurnkeyProductImageID)}
      />
    </>
  )
}

export {PhotoCarpetryProduct}
