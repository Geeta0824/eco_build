import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {IVendorReductionItemModel} from '../../../../models/projects-page/IVendorReductionItemModel'
import {Button, Modal} from 'react-bootstrap-v5'
import AddReductionItem from './AddReductionItem'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  deleteVendorReductionDataAPI,
  EditVendorReductionDetailsAPI,
  getVendorReductionByVendorReductionIdAPI,
} from '../../../../modules/project-master-page/vendor-Master-page/reduction-item-page/ReductionItemCRUD'
import moment from 'moment'

type Props = {
  showReduction: boolean
  handleCloseReduction: () => void
  vendorID: number
  projectID: number
  vendorReductionItemData: IVendorReductionItemModel[]
  projectVendorID: number
  vendorName: string
  allVendorReductionDescListFunc: (
    vendorID: number,
    projectVendorID: number,
    vendorName: string
  ) => void
}

interface IReduction {
  loading: boolean
  selProjectVendorReductionID: number
}

const ReductionItemList: React.FC<Props> = ({
  showReduction,
  handleCloseReduction,
  vendorID,
  projectID,
  vendorReductionItemData,
  projectVendorID,
  vendorName,
  allVendorReductionDescListFunc,
}) => {
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<IReduction>({
    loading: false,
    selProjectVendorReductionID: 0,
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  function getProjVendorReductionDataByID(projectVendorReductionID: number) {
    getVendorReductionByVendorReductionIdAPI(projectVendorReductionID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          setRemarks(response.data.remarks)
          setReductionCost(response.data.reductionCost)
          setReductionDate(response.data.reductionDate)
          setState({
            ...state,
            selProjectVendorReductionID: projectVendorReductionID,
            loading: false,
          })
          setShowReductionEdit(true)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  function saveEditReductionDesc() {
    setTimeout(() => {
      if (reductionCost == '') {
        return toast.error('Reduction Cost Feild is Required')
      }
      if (remarks == '') {
        return toast.error('Description Feild is Required')
      }
      EditVendorReductionDetailsAPI(
        state.selProjectVendorReductionID,
        projectID,
        vendorID,
        projectVendorID,
        remarks,
        parseInt(reductionCost),
        reductionDate,
        user.employeeID,
        '192.168.0.1'
      )
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Updated Successfully')
            allVendorReductionDescListFunc(vendorID, projectVendorID, vendorName)
            setShowReductionEdit(false)
            setRemarks('')
            setReductionCost('')
            setReductionDate('')
            setLoading(false)
          } else {
            toast.error(`${response.data.message}`)
            setLoading(false)
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
          setLoading(false)
        })
      setLoading(false)
    }, 1000)
  }

  // ===================Edit Reduction===============
  const [remarks, setRemarks] = useState<string>('')
  function ReductionDescription(event: any) {
    setRemarks(event.target.value)
  }
  const [reductionCost, setReductionCost] = useState<string>('')
  function ReductionCost(event: any) {
    setReductionCost(event.target.value)
  }
  const [reductionDate, setReductionDate] = useState<string>(
    moment(new Date()).format('YYYY-MM-DD')
  )
  function ReductionDate(event: any) {
    setReductionDate(event.target.value)
  }

  const [showReductionEdit, setShowReductionEdit] = useState(false)
  const handleCloseReductionEdit = () => {
    setShowReductionEdit(false)
    setRemarks('')
    setReductionCost('')
    setReductionDate(moment(new Date()).format('YYYY-MM-DD'))
  }
  const handleShowReductionEdit = () => {
    // setShowReductionEdit(true)
  }

  // ===================Add Reduction===============
  const [showReductionAdd, setShowReductionAdd] = useState(false)
  const handleCloseReductionAdd = () => setShowReductionAdd(false)
  const handleShowReductionAdd = () => {
    setShowReductionAdd(true)
  }

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectVendorReductionID: number) => {
    setState({
      ...state,
      selProjectVendorReductionID: projectVendorReductionID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteVendorReductionDesc(projectVendorReductionID: number) {
    deleteVendorReductionDataAPI(projectVendorReductionID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          allVendorReductionDescListFunc(vendorID, projectVendorID, vendorName)
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
  const currentPosts: IVendorReductionItemModel[] = vendorReductionItemData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <Modal
        size='xl'
        show={showReduction}
        onHide={handleCloseReduction}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            {/* <Modal.Title className='text-primary'>Reduction List</Modal.Title> */}
            <div className='ms-5 d-flex col-9'>
              <span className='text-white text-center fw-bolder fs-5  text-light'>
                Vendor Name :{' '}
              </span>
              <span className='text-primary text-start fs-5 text-hover-success px-5'>
                {vendorName}
              </span>
            </div>
            {/* <div className='text-end col-7'>
              </div> */}
            <div className='col-2 ms-10'>
              <span className=''>
                <div
                  className='card-toolbar'
                  data-bs-toggle='tooltip'
                  data-bs-placement='top'
                  data-bs-trigger='hover'
                  title='Click to add a Vendor Reduction'
                >
                  <span
                    onClick={handleShowReductionAdd}
                    className='btn btn-sm btn-light-primary bg-white'
                  >
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                    Add New
                  </span>
                </div>
              </span>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
            <div className='card-body py-1'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                  {/* begin::Table head */}
                  <thead className='bg-light-primary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-150px'>
                        <span className='d-block mb-1'>Description</span>
                      </th>
                      <th className='min-w-150px'>
                        <span className='d-flex mb-1'>Amount</span>
                      </th>
                      <th className='min-w-150px'>
                        <span className='d-flex mb-1'>Date</span>
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
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.remarks}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.reductionCost}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.reductionDate}
                              </span>
                            </td>
                            <td>
                              <div className='d-flex justify-content-end flex-shrink-0 '>
                                <span
                                  onClick={() =>
                                    getProjVendorReductionDataByID(data.projectVendorReductionID)
                                  }
                                  className='d-flex btn mb-2 btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm my-1'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/art/art005.svg'
                                    className='svg-icon-3 svg-icon-primary'
                                  />
                                </span>
                                <div
                                  onClick={() => handleShow(data.projectVendorReductionID)}
                                  className='btn btn-icon mx-2 btn-bg-light bg-hover-danger mt-1 text-hover-inverse-danger  btn-sm'
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
              {/* <div className='text-center'>
                <Pagination
                  onChange={(value: any) => setPage(value)}
                  pageSize={postPerPage}
                  total={total}
                  current={page}
                  showSizeChanger
                  showQuickJumper
                  onShowSizeChange={onShowSizeChange}
                  showTotal={(total) => `Total ${total} items`}
                />
              </div> */}
            </div>
          </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseReduction}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ====================== Reduction Edit ========= */}
      <Modal size='lg' show={showReductionEdit} onHide={handleCloseReductionEdit} keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-primary'>Edit Reduction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className='required'>Description:</span>
              </label>
              <div className='col-lg-10 fv-row'>
                <textarea
                  rows={2}
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Description...'
                  onChange={(e) => ReductionDescription(e)}
                  value={remarks}
                />
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Amount:</label>
              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='amount'
                  value={reductionCost}
                  onChange={(e) => ReductionCost(e)}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>Date:</label>
              <div className='col-lg-3 fv-row ps-4'>
                <input
                  type='date'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  value={reductionDate}
                  onChange={(e) => ReductionDate(e)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => saveEditReductionDesc()}>
            Submit
          </Button>
          <Button variant='danger' onClick={handleCloseReductionEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selProjectVendorReductionID}
        pageName={'Reduction Item'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteVendorReductionDesc(state.selProjectVendorReductionID)}
      />
      {/* ========== Reduction ============= */}

      <AddReductionItem
        ShowReductionAdd={showReductionAdd}
        HandleCloseReductionAdd={handleCloseReductionAdd}
        vendorID={vendorID}
        projectID={projectID}
        projectVendorID={projectVendorID}
        vendorName={vendorName}
        allVendorReductionDescListFunc={allVendorReductionDescListFunc}
      />
    </>
  )
}

export {ReductionItemList}
