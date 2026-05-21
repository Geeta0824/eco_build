import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IProjectReportModel} from '../../../models/accounts-reports/IProjectReportModel'
import {
  ExportExcelProjectReportListApi,
  getCompanyProjectListByFilterApi,
} from '../../../modules/accounts-reports/project-detail-report-master/ProjectDetailReportCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {getAllProjectListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import moment from 'moment'
import ExcelJS from 'exceljs'
import * as XLSX from 'xlsx'

type Props = {}

interface IProject {
  loading: boolean
  projectReportData: IProjectReportModel[]
  temProjectReportData: IProjectReportModel[]
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel
  projectID: number
  projectAmount: number
  paidAmount: number
  remainingAmount: number
  selStartDate: string
  selEndDate: string
  customerName: string
  pmcWorkStageID: number
  mainStartDate: string
  mainEndDate: string
  searchText: string
}

const ViewProjectReport: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IProject>({
    loading: false,
    projectReportData: [] as IProjectReportModel[],
    temProjectReportData: [] as IProjectReportModel[],
    projectData: [] as IProjectModel[],
    tmpProjectData: {} as IProjectModel,
    projectID: 0,
    projectAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    selStartDate: '',
    selEndDate: '',
    customerName: '',
    pmcWorkStageID: 0,
    mainStartDate: '',
    mainEndDate: '',
    searchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      let projectAmount: any = lc.projectAmount
      let paidAmount: any = lc.paidAmount
      let remainingAmount: any = lc.remainingAmount
      let pmcWorkStageID: any = lc.pmcWorkStageID
      let startDate: any = lc.startDate
      let endDate: any = lc.endDate
      let searchText: any = lc.searchText
      getAllProjectDataByProjectID(
        projectID,
        customerName,
        projectAmount,
        paidAmount,
        remainingAmount,
        state.selStartDate,
        state.selEndDate,
        pmcWorkStageID,
        startDate,
        endDate,
        searchText
      )
    }, 100)
  }, [])

  function getAllProjectDataByProjectID(
    projectID: number,
    customerName: string,
    projectAmount: number,
    paidAmount: number,
    remainingAmount: number,
    startDate: string,
    endDate: string,
    pmcWorkStageID: number,
    mainStartDate: string,
    mainEndDate: string,
    searchText: string
  ) {
    getCompanyProjectListByFilterApi(projectID, startDate, endDate)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectReportData: responseData,
            temProjectReportData: responseData,
            projectID: projectID,
            projectAmount: projectAmount,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount,
            selStartDate: startDate,
            selEndDate: endDate,
            customerName: customerName,
            pmcWorkStageID,
            mainStartDate,
            mainEndDate,
            searchText,
            loading: false,
          })
          setTotal(responseData.length)
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

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temProjectReportData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectReportData: results})
      setTotal(results.length)
    } else {
      setState({...state, projectReportData: state.temProjectReportData})
      setTotal(state.temProjectReportData.length)
    }

    setName(keyword)
  }

  function exportExcelData() {
    ExportExcelProjectReportListApi(state.projectID, state.selStartDate, state.selEndDate)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          //  console.log(responseData)
          setState({
            ...state,
            // excelmodularProductMasterData: responseData,
            loading: false,
          })
          // const worksheet = XLSX.utils.json_to_sheet(responseData)
          // const workbook = XLSX.utils.book_new()
          // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
          // XLSX.writeFile(workbook, `ProjectReport_${moment(new Date()).format('YYYYMMDD')}.xlsx`)

          // const headers = [
          //   {header: 'Amount', key: 'amount'},
          //   {header: 'Balance', key: 'balance'},
          //   {header: 'Payment Date', key: 'paymentDate'},
          //   {header: 'Project Invoice No', key: 'projectInvoiceNo'},
          //   {header: 'Voucher No', key: 'voucherNo'},
          //   {header: 'Project Name', key: 'projectName'},
          //   {header: 'Customer Name', key: 'customerName'},
          //   {header: 'Cash Account Name', key: 'cashAccountName'},
          //   {header: 'Transaction Mode', key: 'transactionMode'},
          // ]

          // // Create worksheet data with headers
          // const worksheetData = responseData.map((item: any) =>
          //   headers.reduce((acc, header) => ({...acc, [header.header]: item[header.key]}), {})
          // )

          // // Create worksheet from the worksheet data
          // const ws = XLSX.utils.json_to_sheet(worksheetData)

          // // Add custom headers manually
          // const headerRow = headers.reduce((acc, header, index) => {
          //   const cellAddress = XLSX.utils.encode_cell({r: 0, c: index})
          //   acc[cellAddress] = {v: header.header} // Apply header style
          //   return acc
          // }, {} as any)

          // // Merge header row with worksheet data
          // Object.assign(ws, headerRow)

          // // Set auto-width for each column
          // const wsCols = [
          //   {wpx: 80}, // Width for "amount"
          //   {wpx: 80}, // Width for "balance"
          //   {wpx: 90}, // Width for "paymentDate"
          //   {wpx: 100}, // Width for "projectInvoiceNo"
          //   {wpx: 100}, // Width for "voucherNo"
          //   {wpx: 160}, // Width for "projectName"
          //   {wpx: 120}, // Width for "customerName"
          //   {wpx: 160}, // Width for "cashAccountName"
          //   {wpx: 150}, // Width for "transactionMode"
          // ]
          // ws['!cols'] = wsCols

          // // Create a new workbook
          // const wb = XLSX.utils.book_new()

          // // Append the worksheet to the workbook
          // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

          // // Export to Excel file
          // XLSX.writeFile(wb, `ProjectReport_${moment(new Date()).format('YYYYMMDD')}.xlsx`)
          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ProjectReport')

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

          let totalBalance = 0
          let totalAmount = 0
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
              balance: parseInt(item.balance),
              amount: parseInt(item.amount),
            })
            totalBalance += parseInt(item.balance)
            totalAmount += parseInt(item.amount)
          })

          const totalRow = worksheet.addRow({
            projectName: '',
            customerName: '',
            cashAccountName: '',
            transactionMode: '',
            voucherNo: '',
            projectInvoiceNo: '',
            paymentDate: '',
            balance: totalBalance,
            amount: totalAmount,
          })

          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(2).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(1).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(2).numFmt = '#,##0.00' // Example: format as currency
          // totalRow.getCell(4).numFmt = '#,##0.00' // Example: format as currency
          // totalRow.getCell(5).numFmt = '#,##0.00' // Example: format as currency
          totalRow.eachCell((cell) => {
            cell.alignment = {vertical: 'middle', horizontal: 'center'} // Center alignment
            cell.border = {
              top: {style: 'thin', color: {argb: '000000'}}, // Top border for total row
              right: {style: 'thin', color: {argb: '000000'}}, // Right border
              bottom: {style: 'thin', color: {argb: '000000'}}, // Right border
            }
          })
          
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `Project_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectReportModel[] = state.projectReportData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

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
      getAllProjectDataByProjectID(
        state.projectID,
        state.customerName,
        state.projectAmount,
        state.paidAmount,
        state.remainingAmount,
        fmtMomentDate,
        state.selEndDate,
        state.pmcWorkStageID,
        state.mainStartDate,
        state.mainEndDate,
        state.searchText
      )
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
      //   getAllProjectDataByProjectID(state.tmpProjectData, state.selStartDate, fmtMomentDate)
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

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/account-reports/project-report/list',
              state: {
                search: state.searchText,
                startDate: state.mainStartDate,
                endDate: state.mainEndDate,
                mainPmcWorkStageID: state.pmcWorkStageID,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 row' style={{backgroundColor: '#000000'}}>
          <div className={state.projectID === 0 ? 'd-none' : 'mb-2 row'}>
            <div className='col-4'>
              <label className='form-label text-white fs-5'>Customer Name : &nbsp;</label>
              <span className='text-primary fs-6'>{state.customerName}</span>
            </div>
            <div className='col-5'>
              <label className='form-label text-white fs-5'>Project Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.projectAmount}</span>
            </div>
            <div className='col-3 text-end mt-1'>
              <span
                // className='col-2 col-sm-6 d-block  justify-content-end text-end'
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
          </div>
          <div className={state.projectID === 0 ? 'd-none' : 'mb-2 row'}>
            <div className='col-4'>
              <label className='form-label text-white fs-5'>Paid Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.paidAmount}</span>
            </div>
            <div className='col-6'>
              <label className='form-label text-white fs-5'>Remaining Amount : &nbsp;</label>
              <span className='text-primary fs-6'>{state.remainingAmount}</span>
            </div>
            <Link
              to={`/account-reports/project/download/${state.projectID}`}
              className='symbol symbol-40px cursor-pointer d-block justify-content-end text-end  col-2 '
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='View PDF'
            >
              <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
            </Link>
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
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
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
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
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
    </>
  )
}

export default ViewProjectReport
