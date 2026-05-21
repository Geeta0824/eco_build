import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import {ICustomerKYCDocumentWebModel} from '../../../../models/organization-page/customer/ICustomerKYCDocumentModel'
import {
  deleteCustomerKYCDocument,
  getCustomerKYCDocument,
  isActiveCustomerKYCDocument,
} from '../../../../modules/organization-page/customer-master-page/KYC-document-details/CustomerKYCDocCRUD'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../../common-pages/ModelPopUpIsActive'
import {ModalPopUpImageView} from '../../../common-pages/ModalPopUpImageView'

type Props = {}
interface IEmpDocMap {
  loading: boolean
  empDocMapData: ICustomerKYCDocumentWebModel[]
  tmpEmpDocMapData: ICustomerKYCDocumentWebModel[]
  SearchText: string
  imageShow: string
  kYCDocName: string
  kYCDocNumber: string
  selDocMapId: number
  activeID: number
  activeType: any
  selCustomerID: number
  pathUrl: any
}

const CustomerKYCDocumentDetails: React.FC<Props> = () => {
  const {customerID} = useParams<{customerID: string}>()
  const [state, setState] = useState<IEmpDocMap>({
    loading: false,
    empDocMapData: [] as ICustomerKYCDocumentWebModel[],
    tmpEmpDocMapData: [] as ICustomerKYCDocumentWebModel[],
    SearchText: '',
    imageShow: '',
    kYCDocName: '',
    kYCDocNumber: '',
    selDocMapId: 0,
    activeID: 0,
    activeType: false,
    selCustomerID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      // let customerID = localStorage.getItem('editCustomerID')!
      // let finalCustomerID: number = JSON.parse(customerID)
      getAllCustomerKYCDocData(parseInt(customerID))
    }, 100)
  }, [])

  // ============================= GET Customer Document By CustomerId =============
  function getAllCustomerKYCDocData(finalCustomerID: number) {
    getCustomerKYCDocument(finalCustomerID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            empDocMapData: responseData,
            tmpEmpDocMapData: responseData,
            selCustomerID: finalCustomerID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, empDocMapData: [], loading: false})
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

  function checkedFunction(temCustomerId: number, temIsAct: boolean) {
    isActiveCustomerKYCDocument(temCustomerId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getAllCustomerKYCDocData(state.selCustomerID)
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
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
  const handleShow = (customerkycDocIMapD: number) => {
    setState({
      ...state,
      selDocMapId: customerkycDocIMapD,
      loading: false,
    })
    setShow(true)
  }

  function deleteCustomerKYCDocData(customerKYCDocId: number) {
    deleteCustomerKYCDocument(customerKYCDocId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getAllCustomerKYCDocData(state.selCustomerID)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', kYCDocName: '', kYCDocNumber: ''})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string, selName: string, selkYCDocNumber: string) => {
    setState({
      ...state,
      imageShow: state.pathUrl + selImg,
      kYCDocName: selName,
      kYCDocNumber: selkYCDocNumber,
    })
    setShowFlag(true)
  }

  function downloadFile(file: string) {
    // const blob = new Blob([file], {type: 'image/jpeg'})
    // const href = URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = href
    // link.download = 'your file name' + '.jpeg'
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)

    var link = document.createElement('a')
    link.href = file
    link.target = '_blank'
    link.click()
  }

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpEmpDocMapData.filter((user) => {
        return user.documentNumber.toLowerCase().includes(keyword.toLowerCase())
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
  const currentPosts: ICustomerKYCDocumentWebModel[] = state.empDocMapData.slice(
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
          {/* <span className='card-label fw-bolder fs-3 mb-1'>Customer Document Map</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Customer Document Map</span> */}
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
              to={`/organization/customer/edit/${state.selCustomerID}/document/add`}
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
                  <th className='min-w-140px'>Document Name</th>
                  <th className='min-w-140px'>Document Number</th>
                  <th className='min-w-50px'>Is Active</th>
                  <th className='w-50px'>Download</th>
                  <th className='w-50px'>View</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
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
                                  data.documentName,
                                  data.documentNumber
                                )
                              }
                            >
                              <img src={state.pathUrl + data.filePath} alt='img' />
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.documentName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.documentNumber}
                          </span>
                        </td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.customerkycDocIMapD}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                            onClick={() => downloadFile(state.pathUrl + data.filePath)}
                          >
                            <KTSVG
                              path='/media/icons/duotune/files/fil017.svg'
                              className='svg-icon-fluid svg-icon-primary'
                            />
                          </div>
                        </td>
                        <td className='text-center'>
                          <span
                            className='btn btn-icon btn-bg-light text-success bg-hover-success text-hover-inverse-success btn-sm'
                            onClick={() =>
                              handleShowFlag(data.filePath, data.documentName, data.documentNumber)
                            }
                          >
                            <span className='fa fa-eye fa-lg'></span>
                          </span>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={`/organization/customer/edit/${state.selCustomerID}/document/edit/${data.customerkycDocIMapD}`}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.customerkycDocIMapD)}
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
        pageName={'Customer Document'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCustomerKYCDocData(state.selDocMapId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Customer Document'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />

      {/* =====================Image Model=================== */}
      <ModalPopUpImageView
        pageName1={'Document Name'}
        title1={state.kYCDocName}
        pageName2={'Document Number'}
        title2={state.kYCDocNumber}
        show={showFlag}
        imageShow={state.imageShow}
        handleClose={handleCloseFlag}
      />
      {/* <Modal
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
              <span className='text-dark text-hover-primary '>{state.kYCDocName} </span>
            </span>
            <span className='text-dark d-block'>
              <span className='text-muted text-light'>Document Number :- </span>
              <span className='text-dark text-hover-primary '>{state.kYCDocNumber}</span>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5 text-center'>
            <img
              alt='Pic'
              className='object-fit-cover h-90'
              src={toAbsoluteUrl(`${state.imageShow}`)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}

export default CustomerKYCDocumentDetails
