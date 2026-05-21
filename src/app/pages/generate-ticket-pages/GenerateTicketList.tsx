import React, {useEffect, useState} from 'react'
import {Button, Modal, Form} from 'react-bootstrap-v5'
import {useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import {RootState} from '../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../modules/auth/models/UserModel'
import LoaderInTable from '../common-pages/LoaderInTable'
import Header_Search_Add from '../../../components/table-header/Header_Search_Add'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {toAbsoluteUrl} from '../../../_Ecd/helpers'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
import {GenerateTicketCard} from './GenerateTicketCard'
import {IGenerateTicketModel} from '../../models/generate-ticket/GenerateTicketModel'
import {
  DeleteGenerateTicketAPI,
  ResponseGenerateTicket_ByDesignerAPI,
  getGetGenerateTicketListAPI,
} from '../../modules/generate-ticket-master-page/GenerateTicketCRUD'
import Header_Add from '../../../components/table-header/Header_Add'
import Header_Search from '../../../components/table-header/Header_Search'

interface Isupport {
  loading: boolean
  ticketData: IGenerateTicketModel[]
  tmpTicketData: IGenerateTicketModel[]
  imageShow: string
  SearchText: string
  responseRemark: string
  selTicketID: number
  pathUrl: any
}

type Props = {}

const GenerateTicketList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<Isupport>({
    loading: false,
    ticketData: [] as IGenerateTicketModel[],
    tmpTicketData: [] as IGenerateTicketModel[],
    imageShow: '',
    SearchText: '',
    responseRemark: '',
    selTicketID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [file, setFile] = useState('')
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.mainSearch
      }
      getTicketData(mainSearch)
    }, 100)
  }, [])

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (ticketID: number) => {
    setState({
      ...state,
      selTicketID: ticketID,
      loading: false,
    })
    setShow(true)
  }

  function getTicketData(mainSearch: string) {
    getGetGenerateTicketListAPI(user.employeeID, user.roleID, user.designationID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.ticketCategory.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.ticketRemarks.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.customerName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.photoPath.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })
            setState({
              ...state,
              ticketData: results,
              tmpTicketData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              ticketData: responseData,
              tmpTicketData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ticketData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, ticketData: [], loading: false})
      })
  }

  function deleteGenerateItem(temBHKId: number) {
    DeleteGenerateTicketAPI(temBHKId)
      .then((response) => {
        let resp = response.data.responseObject
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getTicketData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${resp.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }
  // ==================== Get Country API Call===================

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowFlag(true)
  }

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpTicketData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.ticketCategory.toLowerCase().includes(keyword.toLowerCase()) ||
          user.ticketRemarks.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.photoPath.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, ticketData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, ticketData: state.tmpTicketData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpTicketData.length)
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
  const currentPosts: IGenerateTicketModel[] = state.ticketData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(state.pathUrl + '/GenerateTicket/UploadGenerateTicketPhoto', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFile(data)
        setFileLoader(false)
      })
      .catch((err) => {
        setFileLoader(false)
      })
  }

  // --------------------------------------------
  const [showDesign, setDesignShow] = useState(false)
  const handleDesignShow = (temTicketID: number) => {
    setState({...state, selTicketID: temTicketID})
    setDesignShow(true)
  }

  const handleDesignClose = () => {
    setDesignShow(false)
    setFile('')
    setState({...state, responseRemark: ''})
  }

  function handleChangeStage(e: any) {
    const value = e.target.value
    const name = e.target.name
    if (name == 'responseRemark') {
      setState({...state, responseRemark: value})
    } else {
      setState({...state, responseRemark: ''})
    }
  }

  function NewDesingResponse(temTicketID: number) {
    if (state.responseRemark == '') {
      return toast.error('Please Enter Remark')
    }
    setDesignShow(false)
    ResponseGenerateTicket_ByDesignerAPI(
      temTicketID,
      user.employeeID,
      file,
      state.responseRemark,
      '192.33.66'
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Response Successfull')
          getTicketData(state.SearchText)
          setState({...state, responseRemark: ''})
          setFile('')
          setDesignShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setDesignShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setDesignShow(false)
      })
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <Header_Search searchText={name} filter={filter} />
          {user.roleID == 6 ||
            (user.roleID == 2 && (
              <Header_Add
                searchText={name}
                pathName={'/generate-ticket/add'}
                title='Click to add a Generate Ticket'
              />
            ))}
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
                  <th className='min-w-50px'></th>
                  <th className='min-w-150px'>Project Name</th>
                  <th className='min-w-140px'>Customer</th>
                  <th className='min-w-40px'>Designer</th>
                  <th className='min-w-150px'>Ticket Category</th>
                  <th className='min-w-40px'>Remarks</th>
                  <th className='min-w-50px'>Response</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <GenerateTicketCard
                            key={index}
                            data={data}
                            handleShowFlag={() => handleShowFlag(data.photoPath)}
                            handleShow={() => handleShow(data.ticketID)}
                            handleShowDesign={() => handleDesignShow(data.ticketID)}
                            name={name}
                          />
                        )
                      })}
                    {/* =================== Loading get Api Data ============== */}
                    <BlankDataImageInTable
                      length={currentPosts.length}
                      loading={state.loading}
                      colSpan={5}
                    />
                  </>
                )}
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
      <ModelPopUpDelete
        id={state.selTicketID}
        pageName={'Generate Ticket'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteGenerateItem(state.selTicketID)}
      />
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
          <Modal.Title>Generate Ticket Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img alt='Pic' className='img-fluid' src={toAbsoluteUrl(`${state.imageShow}`)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ---------------------------- */}
      <Modal show={showDesign} onHide={handleDesignClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Design</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row mb-5'>
            <label className='col-lg-3 col-form-label fw-bold fs-6 required'>Remark:</label>
            <div className='col-lg-9 fv-row mb-5'>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                placeholder='Remark'
                name='responseRemark'
                value={state.responseRemark}
                onChange={(e) => handleChangeStage(e)}
              />
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 col-form-label fw-bold fs-6'>Upload Photo:</label>
            <div className={file !== '' ? 'col-lg-1 fv-row mb-5' : 'd-none'}>
              <div className='symbol symbol-45px me-5'>
                <img src={state.pathUrl + file} />
              </div>
            </div>
            <div className={file !== '' ? 'col-lg-8 fv-row' : 'col-lg-9 fv-row'}>
              <input
                type='file'
                accept='image/*'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                onChange={(e) => imageUpload(e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => NewDesingResponse(state.selTicketID)}>
            Submit
          </Button>
          <Button variant='danger' onClick={handleDesignClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GenerateTicketList
