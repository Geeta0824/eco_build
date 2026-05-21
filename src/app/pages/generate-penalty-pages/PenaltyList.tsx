import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import {RootState} from '../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../modules/auth/models/UserModel'
import LoaderInTable from '../common-pages/LoaderInTable'
import Header_Search_Add from '../../../components/table-header/Header_Search_Add'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../common-pages/ModelPopUpDelete'
import {PenaltyCard} from './PenaltyCard'
import {
  IGeneratePenaltyModel,
  IPenaltyStatusModel,
} from '../../models/generate-penalty/GeneratePenaltyModel'
import {
  ApprovePenalty_ByDesigner_DM_AdminAPI,
  DeleteGeneratePenaltyAPI,
  GetPenaltyStatusListAPI,
  getGetGeneratePenaltyListAPI,
} from '../../modules/generate-penalty-master-page/GeneratePenaltyCRUD'
import {stat} from 'fs'

interface Isupport {
  loading: boolean
  ticketData: IGeneratePenaltyModel[]
  tmpTicketData: IGeneratePenaltyModel[]
  penaltyStatusData: IPenaltyStatusModel[]
  imageShow: string
  SearchText: string
  selPenaltyID: number
  selPenaltyStatusID: number
}

type Props = {}

const PenaltyList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<Isupport>({
    loading: false,
    ticketData: [] as IGeneratePenaltyModel[],
    tmpTicketData: [] as IGeneratePenaltyModel[],
    penaltyStatusData: [] as IPenaltyStatusModel[],
    imageShow: '',
    SearchText: '',
    selPenaltyID: 0,
    selPenaltyStatusID: 0,
  })

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
      getPenaltyStatusData(mainSearch)
    }, 100)
  }, [])

  function getPenaltyStatusData(mainSearch: string) {
    GetPenaltyStatusListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getPenaltyData(mainSearch, responseData)
        } else {
          setState({
            ...state,
            penaltyStatusData: [],
            loading: false,
          })
          toast.error(`${responseData.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // --------------------------------------------------------------------
  function getPenaltyData(mainSearch: string, temPenaltyStatusData: IPenaltyStatusModel[]) {
    getGetGeneratePenaltyListAPI(user.roleID, user.designationID, user.employeeID)
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
              penaltyStatusData: temPenaltyStatusData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              ticketData: responseData,
              tmpTicketData: responseData,
              penaltyStatusData: temPenaltyStatusData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ticketData: [], penaltyStatusData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, ticketData: [], loading: false})
      })
  }

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (temPenaltyID: number) => {
    setState({
      ...state,
      selPenaltyID: temPenaltyID,
      loading: false,
    })
    setShow(true)
  }

  function deletePenaltyData(temPenaltyID: number) {
    DeleteGeneratePenaltyAPI(temPenaltyID)
      .then((response) => {
        let resp = response.data.responseObject
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getPenaltyStatusData(state.SearchText)
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

  // ----------Stage Select change Function------------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'penaltyStatusID') {
      setState({...state, selPenaltyStatusID: parseInt(value)})
    }
  }

  const [showApprove, setShowApprove] = useState(false)
  const handleCloseApprove = () => setShowApprove(false)
  const handleShowApprove = (temPenaltyID: number) => {
    setState({
      ...state,
      selPenaltyStatusID: 0,
      selPenaltyID: temPenaltyID,
      loading: false,
    })
    setShowApprove(true)
  }

  // -----------------------------------------------------------------
  function penaltyApprove(temPenaltyID: number) {
    ApprovePenalty_ByDesigner_DM_AdminAPI(
      temPenaltyID,
      user.employeeID,
      state.selPenaltyStatusID,
      '192.33.66'
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Approved Successfull')
          getPenaltyStatusData(state.SearchText)
          setShowApprove(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowApprove(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowApprove(false)
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpTicketData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.penaltyTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.remarks.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amount.toString().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase())
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
  const currentPosts: IGeneratePenaltyModel[] = state.ticketData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        {user.roleID == 6 ||
          (user.roleID == 2 && (
            <Header_Search_Add
              searchText={name}
              filter={(e) => filter(e)}
              pathName={'/generate-penalty/add'}
              title='Click to add a Generate Ticket'
            />
          ))}
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
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer</span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1'>Penalty Type</span>
                    <span className='text-muted fw-bold d-block fs-6'>HOD Approve For</span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1'>Penalty For</span>
                    <span className='text-muted fw-bold d-block fs-6'>Penalty For Name</span>
                  </th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1'>Department</span>
                    <span className='text-muted fw-bold d-block fs-6'>Amount</span>
                  </th>
                  {/* <th className='min-w-75px'>Amount</th> */}
                  <th className='min-w-300px'>Remarks</th>
                  <th className='min-w-100px text-center'>Approve</th>
                  <th className='min-w-25px text-end'>Edit | Delete</th>
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
                          <PenaltyCard
                            data={data}
                            handleShow={() => handleShow(data.penaltyID)}
                            handleShowApprove={() => handleShowApprove(data.penaltyID)}
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
        id={state.selPenaltyID}
        pageName={'Generate Ticket'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePenaltyData(state.selPenaltyID)}
      />
      {/* =====================Approval Model PopUp=============== */}
      <Modal show={showApprove} onHide={handleCloseApprove} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Penalty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4>Are you sure you want to Approve</h4> */}
          <div className='card-body py-3'>
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                <tbody className="border-bottom">
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Penalty Status:
                    </label>
                    <div className='col-lg-7 fv-row'>
                      <select
                        className='form-select bg-light-primary'
                        aria-label='Default select example'
                        onChange={selectChange}
                        id='penaltyStatusID'
                      >
                        <option selected={state.selPenaltyStatusID === 0 ? true : false} value={0}>
                          Select Status
                        </option>
                        {state.penaltyStatusData.length > 0 &&
                          state.penaltyStatusData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.penaltyStatusID}
                                selected={
                                  data.penaltyStatusID === state.selPenaltyStatusID ? true : false
                                }
                              >
                                {data.penaltyStatusName}
                              </option>
                            )
                          })}
                      </select>
                    </div>
                    {/* <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>Stage Date:</label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='date'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          value={stageDate}
                          onChange={handleChangeStageDate}
                        />
                      </div>
                    </div> */}
                  </div>

                  {/* <div className='d-flex justify-content-end py-8'>
                    <Button
                      variant='success'
                      onClick={() => addStageData(state.selProjectID, state.selPenaltyStatusID)}
                    >
                      Save
                    </Button>
                    <Button variant='danger' onClick={handleCloseChange} className='ms-2'>
                      Close
                    </Button>
                  </div> */}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='success' onClick={() => penaltyApprove(state.selPenaltyID)}>
            Approve
          </Button>
          <Button variant='secondary' onClick={handleCloseApprove}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PenaltyList
