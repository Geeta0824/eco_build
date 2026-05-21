import {Pagination} from 'antd'
import {useEffect, useState} from 'react'
import {Button, Modal, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {
  ICustomerComplainAndPhotoModel,
  ICustomerComplainModel,
  IComplainWorkModel,
} from '../../models/Customer-Complain/ICustomerComplainModel'
import {KTSVG, toAbsoluteUrl} from '../../../_Ecd/helpers'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {Link, useLocation} from 'react-router-dom'
import {
  GetComplainListAndPhotosByCustomerComplainMainIDAPI,
  GetComplainPhotoOfWorkAPI,
  getCustomerComplainListApi,
} from '../../modules/customer-complain-master-page/CustomerComplainCRUD'

interface ICustomer {
  loading: boolean
  CuctomerComplainData: ICustomerComplainModel[]
  tmpCuctomerComplainData: ICustomerComplainModel[]
  cuctomerComplainAndPhotoData: ICustomerComplainAndPhotoModel[]
  complainWorkPhotoData: IComplainWorkModel[]
  selComplainMainID: number
  selPhotoTypeID: number
  selProjectName: string
  selCustomerName: string
  imageShow: string
  mainSearch: string
}

const CustomerComplainListPage = () => {
  const location = useLocation()
  const [state, setState] = useState<ICustomer>({
    loading: false,
    CuctomerComplainData: [] as ICustomerComplainModel[],
    tmpCuctomerComplainData: [] as ICustomerComplainModel[],
    cuctomerComplainAndPhotoData: [] as ICustomerComplainAndPhotoModel[],
    complainWorkPhotoData: [] as IComplainWorkModel[],
    selComplainMainID: 0,
    selPhotoTypeID: 0,
    selProjectName: '',
    selCustomerName: '',
    imageShow: '',
    mainSearch: '',
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
      getCustomerComplainData(mainSearch)
    }, 100)
  }, [])

  function getCustomerComplainData(mainSearch: string) {
    getCustomerComplainListApi()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.customerName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.complainDate.toString().includes(mainSearch.toString()) ||
                user.agencyTypeName.toString().includes(mainSearch.toString()) ||
                user.vendorName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.complainStatusName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              CuctomerComplainData: results,
              tmpCuctomerComplainData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              CuctomerComplainData: responseData,
              tmpCuctomerComplainData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, CuctomerComplainData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, CuctomerComplainData: [], loading: false})
      })
  }

  const [showView, setShowView] = useState(false)
  function handleCloseView() {
    setShowView(false)
  }

  function handleShowView(
    temComplainMainID: number,
    temPorjecrtName: string,
    temCustomerName: string
  ) {
    GetComplainListAndPhotosByCustomerComplainMainIDAPI(temComplainMainID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            cuctomerComplainAndPhotoData: responseData,
            selComplainMainID: temComplainMainID,
            selProjectName: temPorjecrtName,
            selCustomerName: temCustomerName,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
    setShowView(true)
  }
  const [showWorkPhoto, setShowWorkPhoto] = useState(false)
  function handleCloseWorkPhoto() {
    setShowWorkPhoto(false)
    setShowView(true)
  }

  function handleShowWorkPhoto(
    temComplainMainID: number,
    temComplainID: number,
    temPhotoTypeID: number
  ) {
    GetComplainPhotoOfWorkAPI(temComplainMainID, temComplainID, temPhotoTypeID)
      .then((response) => {
        const responseData = response.data.lstPhoto
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            complainWorkPhotoData: responseData,
            selComplainMainID: temComplainMainID,
            selPhotoTypeID: temPhotoTypeID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
    setShowWorkPhoto(true)
    setShowView(false)
  }

  const [showImage, setShowImage] = useState(false)
  const handleCloseImage = () => {
    setState({...state, imageShow: '', loading: false})
    setShowImage(false)
  }
  const handleShowImage = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowImage(true)
  }

  // //------------------- the value of the search field----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCuctomerComplainData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.complainDate.toString().includes(keyword.toString()) ||
          user.agencyTypeName.toString().includes(keyword.toString()) ||
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.complainStatusName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, CuctomerComplainData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, CuctomerComplainData: state.tmpCuctomerComplainData})
      setTotal(state.tmpCuctomerComplainData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const [total, setTotal] = useState(state.CuctomerComplainData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICustomerComplainModel[] = state.CuctomerComplainData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
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
            className='card-toolbar mt-7'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{pathname: '/cust-complaint/add', state: {mainSearch: name}}}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3 text-center'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-160px'>
                    <span className='d-block mb-1'>Ticket No</span>
                    <span className='text-muted fw-bold d-block fs-6'>Complaint Date</span>
                  </th>
                  <th className='min-w-160px'>
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer Name</span>
                  </th>
                  <th className='min-w-160px'>
                    <span className='d-block mb-1'>Vendor Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Agency Type</span>
                  </th>
                  <th className='min-w-160px'>
                    <span className='d-block mb-1'>Complaint Create By</span>
                    <span className='text-muted fw-bold d-block fs-6'>Complaint Status</span>
                  </th>
                  <th className='min-w-40px'>View Complaint</th>
                  <th className='min-w-40px'>View Status</th>
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
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.vocuherNo}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.complainDate}</span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.projectName}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.customerName}</span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.vendorName}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.agencyTypeName}</span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.complainCreateByName}
                          </span>
                          <span className='text-muted d-block fs-7'>{data.complainStatusName}</span>
                        </td>
                        <td className='text-center'>
                          <span
                            onClick={() =>
                              handleShowView(
                                data.customerComplainMainID,
                                data.projectName,
                                data.customerName
                              )
                            }
                            className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View Customer Complain'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </span>
                        </td>
                        <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/cust-complaint/view/${data.customerComplainMainID}`,
                              state: {
                                customerName: data.customerName,
                                projectName: data.projectName,
                                customerComplainMainID: data.customerComplainMainID,
                                mainSearch: name,
                              },
                            }}
                            className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View Customer Complain Status'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
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
      {/* ----------------------------Complain Name And Photo Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showView} onHide={handleCloseView}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Complain Data</Modal.Title>
            <Modal.Title style={{color: 'white'}}>
              Project Name : <span className='text-primary'>{state.selProjectName}</span>
            </Modal.Title>
            <Modal.Title style={{color: 'white'}}>
              Customer Name : <span className='text-primary'>{state.selCustomerName}</span>
            </Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-120px'>
                      <span className='d-block mb-1'>Complain Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Complain Photo</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>View Before Work Photo</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>View After Work Photo</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.cuctomerComplainAndPhotoData.length > 0 &&
                    state.cuctomerComplainAndPhotoData.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.complainName}
                            </span>
                          </td>
                          <td className=''>
                            <div
                              className='symbol symbol-50px me-5 cursor-pointer'
                              onClick={() => handleShowImage(data.photoPath)}
                            >
                              {data.photoPath !== '' ? (
                                <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                              ) : (
                                <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                              )}
                            </div>
                          </td>
                          <td className='text-center'>
                            <span
                              onClick={() =>
                                handleShowWorkPhoto(
                                  data.customerComplainMainID,
                                  data.customerComplainID,
                                  1
                                )
                              }
                              className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='View Customer Complain'
                            >
                              <span className='fa fa-eye fs-2'></span>
                            </span>
                          </td>
                          <td className='text-center'>
                            <span
                              onClick={() =>
                                handleShowWorkPhoto(
                                  data.customerComplainMainID,
                                  data.customerComplainID,
                                  2
                                )
                              }
                              className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='View Customer Complain'
                            >
                              <span className='fa fa-eye fs-2'></span>
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  <BlankDataImageInTable
                    length={state.cuctomerComplainAndPhotoData.length}
                    loading={state.loading}
                    colSpan={5}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseView}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showImage}
        onHide={handleCloseImage}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Complain Photo</Modal.Title>
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
          <Button variant='danger' onClick={handleCloseImage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =====================Before And After Photo Model=================== */}
      <Modal
        size='xl'
        show={showWorkPhoto}
        onHide={handleCloseWorkPhoto}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          {state.selPhotoTypeID === 1 ? (
            <Modal.Title>Before Work Photo</Modal.Title>
          ) : (
            <Modal.Title>After Work Photo</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <div className={`card box-shadow-0`}>
            <Container>
              <Row>
                {state.complainWorkPhotoData.length > 0 &&
                  state.complainWorkPhotoData.map((data, index) => (
                    <Col xs={6} md={3} key={index}>
                      <div
                        className='symbol symbol-200px me-5 cursor-pointer mt-5'
                        onClick={() => handleShowImage(data.photoPath)}
                      >
                        {data.photoPath !== '' ? (
                          <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                        ) : (
                          <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                        )}
                      </div>
                    </Col>
                  ))}
                <BlankDataImageInTable
                  length={state.complainWorkPhotoData.length}
                  loading={state.loading}
                  colSpan={5}
                />
              </Row>
            </Container>
            {/* begin::Body */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseWorkPhoto}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CustomerComplainListPage
