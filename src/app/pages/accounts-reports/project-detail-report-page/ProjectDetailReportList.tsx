import {Pagination} from 'antd'
import React, {useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IProjectReportModel} from '../../../models/accounts-reports/IProjectReportModel'
import {getCompanyProjectListByFilterApi} from '../../../modules/accounts-reports/project-detail-report-master/ProjectDetailReportCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {getAllProjectListAPI, getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import moment from 'moment'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import {ExportExcelProjectListByByFilterApi} from '../../../modules/accounts-reports/project-report-master/ProjectReportCRUD'
import { ProjectDetailsModel } from '../../common-pages/ProjectDetailsModel'

type Props = {}

interface IProject {
  loading: boolean
  projectReportData: IProjectReportModel[]
  temProjectReportData: IProjectReportModel[]
  projectData: IProjectModel[]
  selProjectData: IProjectModel[]
  tmpProjectData: IProjectModel
  projectDtlData: IProjectModel[]
  activeID: number
  activeType: any
  selProjectName: string
  selCustomerName: string
  selEmail: string
  selMobileNo: string
  selProjectID: number
  selProjectAmount: number
  selAdditionalAmount: any
  selFinalAmount: any
  selRemAmount: number
  selPaidAmount: number
  selStartDate: string
  selEndDate: string
}

const ProjectDetailReportList: React.FC<Props> = () => {
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IProject>({
    loading: false,
    projectReportData: [] as IProjectReportModel[],
    temProjectReportData: [] as IProjectReportModel[],
    projectData: [] as IProjectModel[],
    selProjectData: [] as IProjectModel[],
    tmpProjectData: {} as IProjectModel,
    projectDtlData: [] as IProjectModel[],
    activeID: 0,
    activeType: false,
    selProjectName: '',
    selCustomerName: '',
    selEmail: '',
    selMobileNo: '',
    selProjectID: 0,
    selProjectAmount: 0,
    selAdditionalAmount: 0,
    selFinalAmount: 0,
    selRemAmount: 0,
    selPaidAmount: 0,
    selStartDate: '',
    selEndDate: '',
  })

  function getAllProjectDataByProjectID(
    tmpProjectData: IProjectModel,
    startDate: string,
    endDate: string
  ) {
    getCompanyProjectListByFilterApi(tmpProjectData.projectID, startDate, endDate)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectReportData: responseData,
            temProjectReportData: responseData,
            selProjectID: tmpProjectData.projectID,
            selProjectAmount: tmpProjectData.projectAmount,
            selAdditionalAmount: tmpProjectData.additionalAmount,
            selFinalAmount: tmpProjectData.finalAmount,
            selPaidAmount: tmpProjectData.paidAmount,
            selRemAmount: tmpProjectData.remainingAmount,
            selProjectName: tmpProjectData.projectName,
            selEmail: tmpProjectData.email,
            selMobileNo: tmpProjectData.mobileNumber,
            selStartDate: startDate,
            selEndDate: endDate,
            selCustomerName: tmpProjectData.firstName + ' ' + tmpProjectData.lastName,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectReportData: [],
            temProjectReportData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectReportData: [],
          temProjectReportData: [],
          loading: false,
        })
      })
  }
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }

  function getAllProjectData() {
    getAllProjectListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectData: responseData,
            selProjectData: responseData,
            loading: false,
          })
          setShow(true)
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          loading: false,
        })
      })
  }

  function exportExcelData() {
    ExportExcelProjectListByByFilterApi(state.selProjectID, state.selStartDate, state.selEndDate)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            loading: false,
          })
          // const worksheet = XLSX.utils.json_to_sheet(responseData)
          // const workbook = XLSX.utils.book_new()
          // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
          // XLSX.writeFile(workbook, `_ProjectDetails_${moment(new Date()).format('YYYYMMDD')}.xlsx`)

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ProjectDetails')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Amount', key: 'amount', width: 10},
            {header: 'Balance', key: 'balance', width: 10},
            {header: 'Payment Date', key: 'paymentDate', width: 15},
            {header: 'Project Invoice No', key: 'projectInvoiceNo', width: 15},
            {header: 'Voucher No', key: 'voucherNo', width: 15},
            {header: 'Project Name', key: 'projectName', width: 20},
            {header: 'Customer Name', key: 'customerName', width: 20},
            {header: 'Cash Account Name', key: 'cashAccountName', width: 20},
            {header: 'Transaction Mode', key: 'transactionMode', width: 16},
            {header: 'Cheque Bank Name', key: 'chequeBankName', width: 20},
            {header: 'Cheque Bank Branch', key: 'chequeBankBranch', width: 20},
            {header: 'Cheque Date', key: 'chequeDate', width: 15},
            {header: 'Cheque Amount', key: 'chequeAmount', width: 13},
            {header: 'Cheque Number', key: 'chequeNumber', width: 13},
            {header: 'Vendor Name', key: 'vendorName', width: 20},
            {header: 'Vendor Invoice RefNo', key: 'vendorInvoiceRefNo', width: 18},
            {header: 'Company Name', key: 'companyName', width: 22},
            {header: 'Description', key: 'description', width: 40},
            {header: 'Contact Person', key: 'contactPerson', width: 20},
          ]
          // Apply header styles (background color and bold font)
          const headerRow = worksheet.getRow(1)
          headerRow.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: '4F81BD'}, // Yellow background color
            }
            cell.font = {
              bold: true,
              color: {argb: 'FFFFFF'}, // Red text color
            }
            cell.alignment = {
              vertical: 'middle', // Align vertically
              horizontal: 'center', // Align horizontally (center)
            }
            cell.border = {
              // top: {style: 'thin', color: {argb: '000000'}}, // Optional: Top border
              //left: {style: 'thin', color: {argb: '000000'}}, // Optional: Left border
              //bottom: {style: 'thin', color: {argb: '000000'}}, // Optional: Bottom border
              right: {style: 'thin', color: {argb: '000000'}}, // Right border
            }
          })

          // Add data rows
          responseData.forEach((item: any) => {
            worksheet.addRow({
              projectName: item.projectName,
              customerName: item.customerName,
              cashAccountName: item.cashAccountName,
              transactionMode: item.transactionMode,
              voucherNo: item.voucherNo,
              projectInvoiceNo: item.projectInvoiceNo,
              paymentDate: item.paymentDate,
              balance: item.balance,
              amount: item.amount,
              chequeBankName: item.chequeBankName,
              chequeBankBranch: item.chequeBankBranch,
              chequeDate: item.chequeDate,
              chequeAmount: item.chequeAmount,
              chequeNumber: item.chequeNumber,
              vendorName: item.vendorName,
              vendorInvoiceRefNo: item.vendorInvoiceRefNo,
              companyName: item.companyName,
              description: item.description,
              contactPerson: item.contactPerson,
            })
          })
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `_ProjectDetails_${moment(new Date()).format('YYYYMMDD')}.xlsx`
            link.click()
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            // productCategory: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          // productCategory: [],
          loading: false,
        })
      })
  }

  function selectProject(tmpProjectData: IProjectModel) {
    getAllProjectDataByProjectID(tmpProjectData, state.selStartDate, state.selEndDate)
    setShow(false)
  }

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.selProjectData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.entryDate.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toString()) ||
          user.remainingAmount.toString().includes(keyword.toString()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectData: state.selProjectData})
      setTotal(state.selProjectData.length)
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
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)

  // ============ Start Date OnClick Function =========================
  function setSelectedCalendarStartDate(currentDate: DayValue) {
    var tmpCurrentDate: DayValue
    let fmtMomentDate: string = ''
    if (currentDate === null) {
      fmtMomentDate = ''
      setStartDay(null)
    } else {
      tmpCurrentDate = currentDate
      setStartDay(tmpCurrentDate)
      let momentDate = moment()
        .year(tmpCurrentDate?.year!)
        .month(tmpCurrentDate?.month! - 1)
        .date(tmpCurrentDate?.day!)
      fmtMomentDate = momentDate.format('DD-MMM-YYYY')
      getAllProjectDataByProjectID(state.tmpProjectData, fmtMomentDate, state.selEndDate)
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(fmtMomentDate, state.selEndDate)
  }

  // ============ End Date OnClick Function =========================
  const renderCustomStartInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a start date'
      value={startDay ? `${startDay.day}-${startDay.month}-${startDay.year}` : ''}
      style={{
        width: '100%',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        border: '1px solid #9c88ff',
        borderRadius: '7px',
        // boxShadow: '0 1.5rem 2rem rgba(156, 136, 255, 0.2)',
        // color: '#9c88ff',
        outline: 'none',
      }}
      className='my-custom-input-class' // a styling class
    />
  )

  //=================== End Date Input Function ===================================
  function setSelectedCalendarEndDate(currentDate: DayValue) {
    var tmpCurrentDate: DayValue
    let fmtMomentDate: string = ''
    if (currentDate === null) {
      fmtMomentDate = ''
      setEndDay(null)
    } else {
      tmpCurrentDate = currentDate
      setEndDay(tmpCurrentDate)
      let momentDate = moment()
        .year(tmpCurrentDate?.year!)
        .month(tmpCurrentDate?.month! - 1)
        .date(tmpCurrentDate?.day!)
      fmtMomentDate = momentDate.format('DD-MMM-YYYY')
      getAllProjectDataByProjectID(state.tmpProjectData, state.selStartDate, fmtMomentDate)
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(state.selDate, fmtMomentDate)
  }

  //=================== End Date Input Function ===================================
  const renderCustomEndInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a end date'
      value={endDay ? `${endDay.day}-${endDay.month}-${endDay.year}` : ''}
      style={{
        width: '100%',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        border: '1px solid #9c88ff',
        borderRadius: '7px',
        // boxShadow: '0 1.5rem 2rem rgba(156, 136, 255, 0.2)',
        // color: '#9c88ff',
        outline: 'none',
      }}
      className='my-custom-input-class' // a styling class
    />
  )

  // ------------------------- For Project Details ---------------------
  const [showProDtl, setShowProDtl] = useState(false)
  function handleCloseProDtl() {
    setShowProDtl(false)
  }

  function handleShowProDtl(temProjectID: number) {
    getGetProjectDetailsList_ByProjectIDAPI(temProjectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectDtlData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectDtlData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectDtlData: [],
          loading: false,
        })
      })
    setShowProDtl(true)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 row' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 d-flex'>
            <label className='text-white me-5 mt-5 fs-5'>Select Project : </label>
            <span className='mt-5 fw-bolder fs-6 text-primary d-flex align-item-center fs-5'>
              {state.selProjectName}
            </span>
            <div className='fv-row'>
              <div
                className='mt-3 btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 p-5 ms-6'
                onClick={getAllProjectData}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen004.svg'
                  className='svg-icon-2 svg-icon-white'
                />
              </div>
            </div>
            <label
              className={state.selProjectID === 0 ? 'd-none' : 'text-white me-5 mt-5 fs-5 ms-10'}
            >
              Customer Name :{' '}
            </label>
            <span
              className={
                state.selProjectID === 0
                  ? 'd-none'
                  : 'mt-5 fw-bolder fs-6 text-primary d-flex align-item-center fs-5'
              }
            >
              {state.selCustomerName}
            </span>
            <div className={state.selProjectID === 0 ? 'd-none' : 'position-absolute top-1 end-0'}>
              <Link
                to={{
                  pathname: `/account-reports/project/download/${state.selProjectID}`,
                  state: {ProjectName: state.selProjectName},
                }}
                className='symbol symbol-40px cursor-pointer d-block justify-content-center text-center'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='View PDF'
              >
                <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
              </Link>
            </div>
          </div>
          {/* <div className={state.selProjectID === 0 ? 'd-none' : 'mb-2 row'}>
            <div className='col-6 '>
              <label className='form-label text-white fs-5'>Mobile No : &nbsp;</label>
              <span className='text-primary fs-6'>{state.selMobileNo}</span>
            </div>
            <div className='col-6 '>
              <label className='form-label text-white fs-5'>Email : &nbsp;</label>
              <span className='text-primary fs-6'>{state.selEmail}</span>
            </div>
          </div> */}
          <div className={state.selProjectID === 0 ? 'd-none' : 'mb-2 row'}>
            <div className='col-4'>
              <label className='form-label text-white fs-5'>Project Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.selProjectAmount}</span>
            </div>
            <div className='col-4'>
              <label className='form-label text-white fs-5'>Additional Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.selAdditionalAmount}</span>
            </div>
            <div className='col-4'>
              <label className='form-label text-white fs-5'>Final Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.selFinalAmount}</span>
            </div>
            <div className='col-4'>
              <label className='form-label text-white fs-5'>Paid Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.selPaidAmount}</span>
            </div>
            <div className='col-4'>
              <label className='form-label text-white fs-5'>Remaining Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.selRemAmount}</span>
            </div>
            <div className='col-12 text-end mb-1'>
              <span
                // className='text-end col-xl-3 col-sm-6 mt-6'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='Click to export Excel sheet'
              >
                <span
                  className='btn btn-sm btn-light-primary bg-white'
                  onClick={() => exportExcelData()}
                >
                  <KTSVG path='/media/icons/duotune/files/fil002.svg' className='svg-icon-3' />
                  Export Excel
                </span>
              </span>
            </div>
            {/* <div className='mb-2 col-xl-3 col-sm-6'>
              <label className='form-label fw-bold text-white'>Start Date :</label>
              <div
                className='d-flex align-content-around flex-wrap rounded'
                style={{position: 'relative', zIndex: 2}}
              >
                <DatePicker
                  wrapperClassName='w-100'
                  value={startDay}
                  onChange={setSelectedCalendarStartDate}
                  inputPlaceholder='Select Start date'
                  calendarPopperPosition='bottom'
                  renderInput={renderCustomStartInput} // render a custom input
                  calendarClassName='responsive-calendar' // added this
                  maximumDate={utils('en').getToday()}
                  // here we go
                  renderFooter={() => (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <button
                        type='button'
                        onClick={() => {
                          // setStartDay(null)
                          setSelectedCalendarStartDate(null)
                        }}
                        style={{
                          border: '#0fbcf9',
                          color: '#fff',
                          backgroundColor: 'red',
                          borderRadius: '2rem',
                          padding: '1rem 2rem',
                        }}
                      >
                        Reset Value!
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
            <div className='mb-2 col-xl-3 col-sm-6'>
              <label className='form-label fw-bold text-white'>End Date :</label>
              <div
                className='d-flex align-content-around flex-wrap rounded justify-content-center'
                style={{position: 'relative', zIndex: 1}}
              >
                <DatePicker
                  wrapperClassName='w-100'
                  value={endDay}
                  onChange={setSelectedCalendarEndDate}
                  inputPlaceholder='Select End date'
                  calendarPopperPosition='bottom'
                  renderInput={renderCustomEndInput} // render a custom input
                  calendarClassName='responsive-calendar' // added this
                  maximumDate={utils('en').getToday()}
                  // minimumDate={utils('en').getToday()}
                  // here we go
                  renderFooter={() => (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <button
                        type='button'
                        onClick={() => {
                          // setStartDay(null)
                          setSelectedCalendarEndDate(null)
                        }}
                        style={{
                          border: '#0fbcf9',
                          color: '#fff',
                          backgroundColor: 'red',
                          borderRadius: '2rem',
                          padding: '1rem 2rem',
                        }}
                      >
                        Reset Value!
                      </button>
                    </div>
                  )}
                />
              </div>
            </div> */}
          </div>
          {/* <div className='flex-shrink-1 d-block p-2 text-center bg-white border border-secondary border border-2'>
            <div className='justify-content-center text-center my-5'>
           
            </div>
          </div> */}
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
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Date</span>
                    <span className='text-muted fw-bold d-block fs-6'>Voucher No</span>
                  </th>
                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer Name</span>
                  </th>
                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Cash Account</span>
                    <span className='text-muted fw-bold d-block fs-6'>Cash Mode</span>
                  </th>
                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Vendor Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Contact Person</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-7'>Credit</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-7'>Debit</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-7'>Balance</span>
                  </th>
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
                    {state.projectReportData.length > 0 &&
                      state.projectReportData.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.paymentDate}
                              </span>
                              <span className='text-muted fw-bold d-block fs-6'>
                                {data.voucherNo}
                              </span>
                            </td>
                            <td>
                              <span
                                className='text-dark text-hover-primary d-block mb-1 fs-6  cursor-pointer'
                                title='Click Hear'
                                onClick={() => handleShowProDtl(data.projectID)}
                              >
                                {data.projectName}
                              </span>
                              <span className='text-muted fw-bold d-block fs-6'>
                                {data.customerName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.cashAccountName}
                              </span>
                              <span className='text-muted fw-bold d-block fs-6'>
                                {data.transactionMode}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.companyName}
                              </span>
                              <span className='text-muted fw-bold d-block fs-6'>
                                {data.contactPerson}
                              </span>
                            </td>
                            <td>
                              <span className='text-success  text-hover-primary d-block mb-1 fs-6'>
                                {data.transactionTypeID === 1 ? data.amount : ''}
                              </span>
                            </td>
                            <td>
                              <span className='text-danger  text-hover-primary d-block mb-1 fs-6'>
                                {data.transactionTypeID === 2 ? data.amount : ''}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.balance}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </>
                )}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={state.projectReportData.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Project Data</Modal.Title>
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
                  <tr className='fw-bolder fs-5 text-center'>
                    <th className='min-w-150px'>
                      <span className='d-block text-primaryMain mb-1 ps-1'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='text-primary d-block mb-1'>Customer Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Category Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 text-primaryMain text-center'>
                        Project Amount
                      </span>
                    </th>
                    <th className='min-w-150px text-center fw-bold'>
                      <span className='text-success'>Additional Amount</span>
                      <span className='d-block text-info'>Final Amount</span>
                    </th>
                    <th className='min-w-150px text-center fw-bold'>
                      <span className='text-success'>Paid Amount</span>
                      <span className='d-block text-info'>Remaining Amount</span>
                    </th>
                    <th className='min-w-50px'>
                      <span className='mb-1'>Project Status</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary text-center'
                          }
                          onClick={() => selectProject(data)}
                        >
                          <td>
                            <span className='text-primaryMain text-hover-primary d-block ps-1'>
                              {data.projectName}
                            </span>
                          </td>
                          <td>
                            <span className='text-primary text-hover-primary d-block'>
                              {data.firstName + ' ' + data.lastName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block'>
                              {data.projectCategoryName}
                            </span>
                          </td>{' '}
                          <td className='text-center'>
                            <span className='text-primaryMain text-hover-primary d-block'>
                              {data.projectAmount}
                            </span>
                          </td>
                          <td className='text-center'>
                            <span className='text-success d-block mb-1'>
                              {data.additionalAmount}
                            </span>
                            <span className='text-info d-block'>{data.finalAmount}</span>
                          </td>
                          <td className='text-center'>
                            <span className='text-success d-block mb-1'>{data.paidAmount}</span>
                            <span className='text-info d-block'>{data.remainingAmount}</span>
                          </td>
                          <td className='min-w-50 pe-1'>
                            <span className='text-dark text-hover-primary'>
                              {data.projectStatusName}
                            </span>
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
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ProjectDetailsModel
        data={state.projectDtlData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
    </>
  )
}

export default ProjectDetailReportList
