import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IPDFPhotoMstModel} from '../../../models/master-page/IPDFPhotoMstModel'
import {
  deletePDFPhotosDataApi,
  getPDFPhotosListApi,
} from '../../../modules/master-page/pdf-photo-master-page/PDFPhotoCRUD'
import {PDFPhotoMasterCard} from './PDFPhotoMasterCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface IModularStage {
  loading: boolean
  pdfPhotoMstData: IPDFPhotoMstModel[]
  tmpPdfPhotoMstData: IPDFPhotoMstModel[]
  searchText: string
  imageShow1: string
  imageShow2: string
  imageShow3: string
  imageShow4: string
  page2ImageShow: string
  page3_OptionalImageShow: string
  page4_OptionalImageShow: string
  pdfPhotoID: number
}

const PDFPhotoMasterList: React.FC<Props> = () => {
  const location = useLocation()
  const {pdfPhotoID} = useParams<{pdfPhotoID: string}>()
  const [state, setState] = useState<IModularStage>({
    loading: false,
    pdfPhotoMstData: [] as IPDFPhotoMstModel[],
    tmpPdfPhotoMstData: [] as IPDFPhotoMstModel[],
    searchText: '',
    imageShow1: '',
    imageShow2: '',
    imageShow3: '',
    imageShow4: '',
    page2ImageShow: '',
    page3_OptionalImageShow: '',
    page4_OptionalImageShow: '',
    pdfPhotoID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getPDFPhotosData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getPDFPhotosData(mainSearch: string) {
    getPDFPhotosListApi(0)
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.responseObject.filter((user: any) => {
              return (
                user.quotationCategoryName.toLowerCase().startsWith(mainSearch.toLowerCase()) ||
                user.projectTypeName.toLowerCase().startsWith(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              pdfPhotoMstData: results,
              tmpPdfPhotoMstData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              pdfPhotoMstData: responseData.responseObject,
              tmpPdfPhotoMstData: responseData.responseObject,
              loading: false,
            })
            setTotal(responseData.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, pdfPhotoMstData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, pdfPhotoMstData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (pdfPhotoID: number) => {
    setState({
      ...state,
      pdfPhotoID: pdfPhotoID,
      loading: false,
    })
    setShow(true)
  }

  // ========================Delete DNC PAYMENT STRUCTURE=====================
  function deletePDFPhotosItem(pdfPhotoID: number) {
    deletePDFPhotosDataApi(pdfPhotoID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getPDFPhotosData(state.searchText)
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpPdfPhotoMstData.filter((user) => {
        return (
          user.quotationCategoryName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.projectTypeName.toLowerCase().startsWith(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, pdfPhotoMstData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, pdfPhotoMstData: state.tmpPdfPhotoMstData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpPdfPhotoMstData.length)
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
  const currentPosts: IPDFPhotoMstModel[] = state.pdfPhotoMstData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // ====================Image 1============
  const [showImage1, setShowImage1] = useState(false)
  const handleCloseImage1 = () => {
    setState({...state, imageShow1: '', loading: false})
    setShowImage1(false)
  }
  const handleShowImage1 = (selImg: string) => {
    setState({...state, imageShow1: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowImage1(true)
  }
  // ====================Image 2============
  const [showImage2, setShowImage2] = useState(false)
  const handleCloseImage2 = () => {
    setState({...state, imageShow2: '', loading: false})
    setShowImage2(false)
  }
  const handleShowImage2 = (selImg: string) => {
    setState({...state, imageShow2: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowImage2(true)
  }
  // ====================Image 3============
  const [showImage3, setShowImage3] = useState(false)
  const handleCloseImage3 = () => {
    setState({...state, imageShow3: '', loading: false})
    setShowImage3(false)
  }
  const handleShowImage3 = (selImg: string) => {
    setState({...state, imageShow3: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowImage3(true)
  }
  // ====================Image 4============
  const [showImage4, setShowImage4] = useState(false)
  const handleCloseImage4 = () => {
    setState({...state, imageShow4: '', loading: false})
    setShowImage4(false)
  }
  const handleShowImage4 = (selImg: string) => {
    setState({...state, imageShow4: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowImage4(true)
  }
  // ====================page2PhotoPath============
  const [showPage2Image, setShowPage2Image] = useState(false)
  const handleClosePage2Image = () => {
    setState({...state, page2ImageShow: '', loading: false})
    setShowPage2Image(false)
  }
  const handleShowPage2Image = (selImg: string) => {
    setState({...state, page2ImageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowPage2Image(true)
  }

  // ====================page3_OptionalPhoto============
  const [showPage3_OptionalImage, setShowPage3_OptionalImage] = useState(false)
  const handleClosePage3_OptionalImage = () => {
    setState({...state, page3_OptionalImageShow: '', loading: false})
    setShowPage3_OptionalImage(false)
  }
  const handleShowPage3_OptionalImage = (selImg: string) => {
    setState({
      ...state,
      page3_OptionalImageShow: process.env.REACT_APP_API_URL + selImg,
      loading: false,
    })
    setShowPage3_OptionalImage(true)
  }
  // ====================page4_OptionalPhoto============
  const [showPage4_OptionalImage, setShowPage4_OptionalImage] = useState(false)
  const handleClosePage4_OptionalImage = () => {
    setState({...state, page4_OptionalImageShow: '', loading: false})
    setShowPage4_OptionalImage(false)
  }
  const handleShowPage4_OptionalImage = (selImg: string) => {
    setState({
      ...state,
      page4_OptionalImageShow: process.env.REACT_APP_API_URL + selImg,
      loading: false,
    })
    setShowPage4_OptionalImage(true)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/pdf-photo-mst/add'}
          title='Click to add a PDF Photo Master'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}> */}
        {/* <h3 className='card-title align-items-start flex-column'> */}
        {/* <span className='card-label fw-bolder fs-3 mb-1'>Department</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
        {/* </h3> */}

        {/* <div className='border-0 pt-2' id='kt_chat_contacts_header'>
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
                // placeholder={intl.formatMessage({id: 'PEOPLE.SEARCH'})}
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
              to='/master/pdf-photo-mst/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div> */}
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
                  <th className='w-auto'>Quotation Category Type</th>
                  <th className='w-auto'>Project Type</th>
                  <th className='w-auto'>Page1 Photo</th>
                  <th className='w-auto'>Page2 Photo</th>
                  <th className='w-auto'>Page3_Opt Photo</th>
                  <th className='w-auto'>Page4_Opt Photo</th>
                  <th className='w-auto'>Page3_1 Photo</th>
                  <th className='w-auto'>Page3_2 Photo</th>
                  <th className='w-auto'>Page4 Photo</th>
                </tr>
                {/* <th className='min-w-100px text-end'>Edit | Delete</th> */}
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <PDFPhotoMasterCard
                        data={data}
                        handleShowImage1={() => handleShowImage1(data.photo1Path)}
                        handleShowImage2={() => handleShowImage2(data.photo2Path)}
                        handleShowImage3={() => handleShowImage3(data.photo3Path)}
                        handleShowImage4={() => handleShowImage4(data.photo4Path)}
                        handleShowPage2Image={() => handleShowPage2Image(data.page2PhotoPath)}
                        handleShowPage3OptionalImage={() =>
                          handleShowPage3_OptionalImage(data.page3_OptionalPath)
                        }
                        handleShowPage4OptionalImage={() =>
                          handleShowPage4_OptionalImage(data.page4_OptionalPath)
                        }
                        handleShow={() => handleShow(data.pdfPhotoID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>
                      //     {data.quotationCategoryName}
                      //   </td>

                      //   <td className='text-dark text-hover-primary fs-6'>
                      //     {data.quotationCategoryID === 1 ? (
                      //         <div>{data.projectTypeName}</div>
                      //         ) : (
                      //             <div className='text-dark text-hover-primary fs-6'>N.A</div>
                      //     )}
                      //   </td>
                      //   {/* <td className='text-dark text-hover-primary fs-6'>{data.imageNumber}</td> */}
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div
                      //         className='symbol symbol-45px me-5 cursor-pointer'
                      //         onClick={() => handleShowImage1(data.photo1Path)}
                      //       >
                      //         {data.photo1Path !== '' ? (
                      //           <img src={process.env.REACT_APP_API_URL + data.photo1Path} alt='' />
                      //         ) : (
                      //           <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                      //         )}
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div
                      //         className='symbol symbol-45px me-5 cursor-pointer'
                      //         onClick={() => handleShowImage2(data.photo2Path)}
                      //       >
                      //         {data.photo2Path !== '' ? (
                      //           <img src={process.env.REACT_APP_API_URL + data.photo2Path} alt='' />
                      //         ) : (
                      //           <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                      //         )}
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div
                      //         className='symbol symbol-45px me-5 cursor-pointer'
                      //         onClick={() => handleShowImage3(data.photo3Path)}
                      //       >
                      //         {data.photo3Path !== '' ? (
                      //           <img src={process.env.REACT_APP_API_URL + data.photo3Path} alt='' />
                      //         ) : (
                      //           <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                      //         )}
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div
                      //         className='symbol symbol-45px me-5 cursor-pointer'
                      //         onClick={() => handleShowImage4(data.photo4Path)}
                      //       >
                      //         {data.photo4Path !== '' ? (
                      //           <img src={process.env.REACT_APP_API_URL + data.photo4Path} alt='' />
                      //         ) : (
                      //           <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                      //         )}
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/pdf-photo-mst/edit/${data.pdfPhotoID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.pdfPhotoID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='ssvg-icon-3 svg-icon-danger'
                      //         />
                      //       </div>
                      //     </div>
                      //   </td>
                      // </tr>
                    )
                  })}
                {/* =====================Image 1 Model=================== */}
                <Modal
                  size='lg'
                  show={showImage1}
                  onHide={handleCloseImage1}
                  backdrop='true'
                  keyboard={false}
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Page1 Photo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='mb-5'>
                      <img
                        alt='image not found'
                        className='img-fluid'
                        src={
                          state.imageShow1 == ''
                            ? toAbsoluteUrl('/media/img/NoProductImage.png')
                            : toAbsoluteUrl(`${state.imageShow1}`)
                        }
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='danger' onClick={handleCloseImage1}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* =====================Image 2  Model=================== */}
                <Modal
                  size='lg'
                  show={showImage2}
                  onHide={handleCloseImage2}
                  backdrop='true'
                  keyboard={false}
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Page3_1 Photo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='mb-5'>
                      <img
                        alt='image not found'
                        className='img-fluid'
                        src={
                          state.imageShow2 == ''
                            ? toAbsoluteUrl('/media/img/NoProductImage.png')
                            : toAbsoluteUrl(`${state.imageShow2}`)
                        }
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='danger' onClick={handleCloseImage2}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* =====================Image 3 Model=================== */}
                <Modal
                  size='lg'
                  show={showImage3}
                  onHide={handleCloseImage3}
                  backdrop='true'
                  keyboard={false}
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Page3_2 Photo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='mb-5'>
                      <img
                        alt='image not found'
                        className='img-fluid'
                        src={
                          state.imageShow3 == ''
                            ? toAbsoluteUrl('/media/img/NoProductImage.png')
                            : toAbsoluteUrl(`${state.imageShow3}`)
                        }
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='danger' onClick={handleCloseImage3}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* =====================Image 4 Model=================== */}
                <Modal
                  size='lg'
                  show={showImage4}
                  onHide={handleCloseImage4}
                  backdrop='true'
                  keyboard={false}
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Page4 Photo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='mb-5'>
                      <img
                        alt='image not found'
                        className='img-fluid'
                        src={
                          state.imageShow4 == ''
                            ? toAbsoluteUrl('/media/img/NoProductImage.png')
                            : toAbsoluteUrl(`${state.imageShow4}`)
                        }
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='danger' onClick={handleCloseImage4}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* ===================== Page2 Image Model=================== */}
                <Modal
                  size='lg'
                  show={showPage2Image}
                  onHide={handleClosePage2Image}
                  backdrop='true'
                  keyboard={false}
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Page2 Image</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='mb-5'>
                      <img
                        alt='image not found'
                        className='img-fluid'
                        src={
                          state.page2ImageShow == ''
                            ? toAbsoluteUrl('/media/img/NoProductImage.png')
                            : toAbsoluteUrl(`${state.page2ImageShow}`)
                        }
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='danger' onClick={handleClosePage2Image}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* ===================== Page3_Optional Model=================== */}
                <Modal
                  size='lg'
                  show={showPage3_OptionalImage}
                  onHide={handleClosePage3_OptionalImage}
                  backdrop='true'
                  keyboard={false}
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Page3_Optional Image</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='mb-5'>
                      <img
                        alt='image not found'
                        className='img-fluid'
                        src={
                          state.page3_OptionalImageShow == ''
                            ? toAbsoluteUrl('/media/img/NoProductImage.png')
                            : toAbsoluteUrl(`${state.page3_OptionalImageShow}`)
                        }
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='danger' onClick={handleClosePage3_OptionalImage}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* ===================== Page4_Optional Model=================== */}
                <Modal
                  size='lg'
                  show={showPage4_OptionalImage}
                  onHide={handleClosePage4_OptionalImage}
                  backdrop='true'
                  keyboard={false}
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Page4_Optional Image</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='mb-5'>
                      <img
                        alt='image not found'
                        className='img-fluid'
                        src={
                          state.page4_OptionalImageShow == ''
                            ? toAbsoluteUrl('/media/img/NoProductImage.png')
                            : toAbsoluteUrl(`${state.page4_OptionalImageShow}`)
                        }
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='danger' onClick={handleClosePage4_OptionalImage}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* =================== Image no data ============== */}
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
        id={state.pdfPhotoID}
        pageName={'PDF Photos'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePDFPhotosItem(state.pdfPhotoID)}
      />
    </>
  )
}
export default PDFPhotoMasterList
