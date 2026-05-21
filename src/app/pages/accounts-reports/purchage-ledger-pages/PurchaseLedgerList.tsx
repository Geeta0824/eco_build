import {Pagination} from 'antd'
import React, {useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

import {getCompanyProjectListByFilterApi} from '../../../modules/accounts-reports/project-detail-report-master/ProjectDetailReportCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {getAllProjectListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {venderTypeData} from '../../other-dropDowns/otherDropDowns'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {
  getVenderListByVendorTypeID,
  getVenderWebList,
} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {
  IVendorReportModel,
  totalVendorReportModel,
} from '../../../models/accounts-reports/IVendorReportModel'
import {getVendorReportListByVendorIdApi} from '../../../modules/accounts-reports/vendor-report-master/VendortReportCRUD'

type Props = {}

interface IProject {
  loading: boolean
  vendorReportData: IVendorReportModel[]
  temVendorReportData: IVendorReportModel[]
  objVenReportData: totalVendorReportModel
  projectData: IProjectModel[]
  vendorData: IVenderModel[]
  activeID: number
  activeType: any
  selProjectName: string
  selCompanyName: string
  selContactPerson: string
  selContactNo: string
  selProjectID: number
  selProjectAmount: number
  selRemAmount: number
  selPaidAmount: number
  selVendorTypeID: number
  selVendorID: number
  totalVendor: number
  paidAmount: number
  totalAmt: number
  vendorTypeID: number
 
}

const PurchaseLedgerList: React.FC<Props> = () => {
 
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const {vendorID} = useParams<{vendorID: string}>()
  const [state, setState] = useState<IProject>({
    loading: false,
    vendorReportData: [] as IVendorReportModel[],
    temVendorReportData: [] as IVendorReportModel[],
    objVenReportData: {} as totalVendorReportModel,
    projectData: [] as IProjectModel[],
    vendorData: [] as IVenderModel[],
    activeID: 0,
    activeType: false,
    selProjectName: '',
    selCompanyName: '',
    selContactPerson: '',
    selContactNo: '',
    selProjectID: 0,
    selProjectAmount: 0,
    selRemAmount: 0,
    selPaidAmount: 0,
    selVendorTypeID: 0,
    selVendorID: 0,
    totalVendor: 0,
    paidAmount: 0,
    totalAmt: 0,
    vendorTypeID: 0,
   
  })

  function getAllProjectDataByProjectID(tmpVendortData: IVenderModel) {
    getVendorReportListByVendorIdApi(tmpVendortData.vendorID)
      .then((response) => {
        let responseData = response.data
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorReportData: responseData.responseObject,
            temVendorReportData: responseData.responseObject,
            selVendorID: tmpVendortData.vendorID,
            selCompanyName: tmpVendortData.companyName,
            selContactNo: tmpVendortData.contactNumber,
            selContactPerson: tmpVendortData.contactPerson,
            objVenReportData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            vendorReportData: [],
            temVendorReportData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          vendorReportData: [],
          temVendorReportData: [],
          loading: false,
        })
      })
  }

  function getVenderByVendorTypeIDData(temVendorTypeID: number) {
    getVenderListByVendorTypeID(temVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }
  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }

  function getVenderData() {
    getVenderWebList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorData: responseData,
            loading: false,
          })
          setShowVendor(true)
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function selectVendor(tmpVendortData: IVenderModel) {
    getAllProjectDataByProjectID(tmpVendortData)

    setShowVendor(false)
  }
  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temVendorReportData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorCost.toString().includes(keyword.toLowerCase()) ||
          user.remainingAmount.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase())
        )
      })
      setState({...state, vendorReportData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, vendorReportData: state.temVendorReportData})
      setTotal(state.temVendorReportData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IVendorReportModel[] = state.vendorReportData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const selectChange = (event: any) => {
    const value = event.target.value
    //  alert(value)
    const elementId = event.target.id
    if (elementId === 'vendorTypeID') {
      getVenderByVendorTypeIDData(parseInt(value))
    }
  }
 
  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 row' style={{backgroundColor: '#000000'}}>
          {/* <div className='row mb-4 '>
            <label className='col-lg-3  text-white fs-5 mt-4'>
              <span className=''> Select Vendor Type :</span>
            </label>
            <div className='col-lg-4 fv-row mt-4'>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='vendorTypeID'
              >
                <option selected value={0}>
                  Select Vendor Type
                </option>
                {venderTypeData.length > 0 &&
                  venderTypeData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.vendorTypeID}
                        selected={state.selVendorTypeID == data.vendorTypeID ? true : false}
                      >
                        {data.vendorTypeName}
                      </option>
                    )
                  })}
              </select>
            </div>
            <div className={state.selVendorID > 0 ? 'col-5 mt-3' : 'd-none'}>
              <Link
                to={`/account-reports/vendor/download/${state.selVendorID}`}
                className='symbol symbol-40px cursor-pointer d-block justify-content-center text-end'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='View PDF'
              >
                <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
              </Link>
            </div>
          </div>

          <div className='mb-4 d-flex'>
            <label className=' text-white me-5 mt-5 fs-5'>Select Vendor :</label>
            <span className='mt-5 fw-bold text-primary d-flex align-item-center fs-5'>
              {state.selCompanyName}
            </span>
            <div className='fv-row'>
              <div
                className='mt-3 btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 p-5 ms-6'
                onClick={getVenderData}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen004.svg'
                  className='svg-icon-2 svg-icon-white'
                />
              </div>
            </div>
          </div>
          <div className={state.selVendorID === 0 ? 'd-none' : 'row mb-4'}>
            <div className='col-4 '>
              <label className='text-white fs-5'>Contact Person : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>{state.selContactPerson}</span>
            </div>
            <div className='col-4'>
              <label className='text-white fs-5'>Contact Number : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>{state.selContactNo}</span>
            </div>
          </div>
          <div className='row mb-4'>
            <div className='col-4 '>
              <label className='text-white fs-5'>Vendors Tatal Cost : &nbsp;</label>
              <span className='text-primary fw-bold  fs-5'>
                {state.objVenReportData.totalVendorCost}
              </span>
            </div>
            <div className='col-4'>
              <label className='text-white fs-5'>Total Paid Amt : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>
                {state.objVenReportData.totalPaidAmount}
              </span>
            </div>
            <div className='col-4'>
              <label className='text-white fs-5'>Balance : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>
                {state.objVenReportData.totalRemainingAmount}
              </span>
            </div>
          </div>
         */}

          {/* end::Header */}
        </div>
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-6'>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>PO NO</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>PO Date</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>Item Name</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>Qty</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>Unit</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>Price Per Unit</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>Total</span>
                  </th>
                  {/* <th className='min-w-140px'>
                    <span className='d-block mb-1 text-center'>View</span>
                  </th> */}
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
                          <tr key={index}>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.projectName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.vendorCost}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.vendorCost}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.vendorCost}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.vendorCost}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark  text-hover-primary d-block mb-1 fs-6'>
                                {data.paidAmount}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.remainingAmount}
                              </span>
                            </td>
                            {/* <td className='text-center'>
                              <Link
                                to={{
                                  pathname: `/account-reports/vendor/view`,
                                  state: {
                                    projectData: data,
                                    vendorID: state.selVendorID,
                                    companyName: state.selCompanyName,
                                    contactPerson: state.selContactNo,
                                    vendorCost: data.vendorCost,
                                    paidAmount: data.paidAmount,
                                    remainingAmount: data.remainingAmount,
                                  },
                                }}
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-success btn-sm me-1 text-primary text-hover-light'
                                data-bs-toggle='tooltip'
                                data-bs-placement='top'
                                title='View'
                              >
                                <span className='fa fa-eye fs-2'></span>
                              </Link>
                            </td> */}
                          </tr>
                        )
                      })}
                  </>
                )}
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

      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  onChange={filter}
                  value={name}
                />
              </form>
            </div>
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
                      <span className='d-block mb-1 ps-1'>Vendor Type Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Company Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.vendorData.length > 0 &&
                    state.vendorData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary'
                          }
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? (
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary fs-6'>
                                  {data.companyName}
                                </div>
                              </div>
                            ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )}
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
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
          <Button variant='danger' onClick={handleCloseVendor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PurchaseLedgerList
