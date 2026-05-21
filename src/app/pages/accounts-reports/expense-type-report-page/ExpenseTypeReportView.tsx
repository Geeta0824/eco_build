import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {
  getExpenseTypeReportList,
  getExpenseTypeReportViewExcelList,
} from '../../../modules/accounts-reports/expense-type-report-master/ExpenseTypeReportCRUD'
import {IExpenseTypeReportModel} from '../../../models/accounts-reports/IExpenseTypeReportModel'
import {IExpenseModel} from '../../../models/master-page/IExpenseTypeMode'
import {getExpenseTypeList} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
import moment from 'moment'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'

interface IExpenseType {
  loading: boolean
  expenseTypeReportData: IExpenseTypeReportModel[]
  tmpexpenseTypeReportData: IExpenseTypeReportModel[]
  expenseData: IExpenseModel[]
  PDFShow: string
  SearchText: string
  selExpMstID: number
  activeID: number
  activeType: any
  pathUrl: any
  selExpenseTypeID: number
  selExpenseHeadID: number
  selStartDate: string
  selEndDate: string
}

type Props = {}

const ExpenseTypeReportView: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IExpenseType>({
    loading: false,
    expenseTypeReportData: [] as IExpenseTypeReportModel[],
    tmpexpenseTypeReportData: [] as IExpenseTypeReportModel[],
    expenseData: [] as IExpenseModel[],
    PDFShow: '',
    SearchText: '',
    selExpMstID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    selExpenseTypeID: 0,
    selExpenseHeadID: 0,
    selStartDate: '',
    selEndDate: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearchStartDay: string = ''
      var mainSearchEndDay: string = ''
      var mainExpenseTypeID: number = 0
      var mainExpenseHeadID: number = 0
      if (lc !== undefined) {
        mainExpenseTypeID = lc.expeseTypeID
        mainSearchStartDay = lc.mainStartDate
        mainSearchEndDay = lc.mainEndDate
        mainExpenseHeadID = lc.expenseHeadID
      }
      getExpenseMasterData(
        mainExpenseTypeID,
        mainSearchStartDay,
        mainSearchEndDay,
        mainExpenseHeadID
      )
    }, 100)
  }, [])

  // ======================Dropdown Api===========================
  function getExpenseMasterData(
    mainExpenseTypeID: number,
    mainSearchStartDay: string,
    mainSearchEndDay: string,
    mainExpenseHeadID: number
  ) {
    getExpenseTypeList()
      .then((response) => {
        const responseData = response.data.responseObject
        getExpenseMasterReportData(
          responseData,
          mainExpenseTypeID,
          mainSearchStartDay,
          mainSearchEndDay,
          mainExpenseHeadID
        )
        if (response.data.isSuccess == true) {
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, expenseData: [], loading: false})
      })
  }

  // ======================List Api================================
  function getExpenseMasterReportData(
    expenseData: IExpenseModel[],
    selExTypeId: number,
    startDate: string,
    endDate: string,
    mainExpenseHeadID: number
  ) {
    getExpenseTypeReportList(selExTypeId, startDate, endDate)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            expenseTypeReportData: responseData,
            expenseData: expenseData,
            selExpenseTypeID: selExTypeId,
            selStartDate: startDate,
            selEndDate: endDate,
            selExpenseHeadID: mainExpenseHeadID,
            loading: false,
          })
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseTypeReportData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, expenseTypeReportData: [], loading: false})
      })
  }

  // //   ------View on other tab --------------
  // async function downloadQuotationFile(selURL: string) {
  //   var fullUrl = process.env.REACT_APP_API_URL + selURL
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

  // ====================Country Flag============
  const [showDocument, setShowDocument] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, PDFShow: '', loading: false})
    setShowDocument(false)
  }
  const handleShowFlag = (selPathUrl: string) => {
    setState({
      ...state,
      PDFShow: toAbsoluteUrl('/media/svg/files/pdf.svg') + selPathUrl,
      loading: false,
    })
    setShowDocument(true)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'expenseTypeID') {
      setState({...state, selExpenseTypeID: parseInt(value)})
      getExpenseMasterReportData(
        state.expenseData,
        parseInt(value),
        state.selStartDate,
        state.selEndDate,
        state.selExpenseHeadID
      )
    }
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
  const currentPosts: IExpenseTypeReportModel[] = state.expenseTypeReportData.slice(
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
      getExpenseMasterReportData(
        state.expenseData,
        state.selExpenseTypeID,
        fmtMomentDate,
        state.selEndDate,
        state.selExpenseHeadID
      )
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(fmtMomentDate, state.selEndDate)
  }
  function resetFilterStartDate() {
    setMainLoading(true)
    setName('')
    setStartDay(null) // Reset startDay
    getExpenseMasterReportData(
      state.expenseData,
      state.selExpenseTypeID,
      '',
      state.selEndDate,
      state.selExpenseHeadID
    )
  }
  // ============Start Date OnClick Function =========================
  const renderCustomStartInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a start date'
      value={
        startDay ? `${startDay.day}-${startDay.month}-${startDay.year}` : `${state.selStartDate}`
      }
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
      getExpenseMasterReportData(
        state.expenseData,
        state.selExpenseTypeID,
        state.selStartDate,
        fmtMomentDate,
        state.selExpenseHeadID
      )
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(state.selDate, fmtMomentDate)
  }
  function resetFilterEndDate() {
    setMainLoading(true)
    setName('')
    setEndDay(null) // Reset End
    getExpenseMasterReportData(
      state.expenseData,
      state.selExpenseTypeID,
      state.selStartDate,
      '',
      state.selExpenseHeadID
    )
  }
  //=================== End Date Input Function ===================================
  const renderCustomEndInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a end date'
      value={endDay ? `${endDay.day}-${endDay.month}-${endDay.year}` : `${state.selEndDate}`}
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

  // ================================
  function exportExcelData() {
    getExpenseTypeReportViewExcelList(state.selExpenseTypeID, state.selStartDate, state.selEndDate)
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
          // XLSX.writeFile(
          //   workbook,
          //   `ExpenseType_Details_Reports${moment(new Date()).format('YYYY-MM-DD')}.xlsx`
          // )

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ViewExpenseTypeReports')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Expense Type Name', key: 'expenseTypeName', width: 20},
            {header: 'Title', key: 'title', width: 20},
            {header: 'Expense Date', key: 'expenseDate', width: 15},
            {header: 'Voucher No', key: 'voucherNo', width: 15},
            {header: 'Transaction Mode', key: 'transactionMode', width: 20},
            {header: 'Cash Account Name', key: 'cashAccountName', width: 25},
            {header: 'Employee Name', key: 'employeeName', width: 20},
            {header: 'Is TDS Deducted', key: 'isTDSDeducted', width: 18},
            {header: 'Is GST', key: 'isGST', width: 10},
            {header: 'Amount', key: 'amount', width: 15},
            {header: 'Final Amount', key: 'finalAmount', width: 15},
            {header: 'Tds Percentage', key: 'tdsPercentage', width: 14},
            {header: 'Tds Amount', key: 'tdsAmount', width: 15},
            {header: 'After GST Amount', key: 'afterGSTAmount', width: 16},
            {header: 'After TDS Amount', key: 'afterTDSAmount', width: 16},
            {header: 'Gst Amount', key: 'gstAmount', width: 15},
            {header: 'Gst Percentage', key: 'gstPer', width: 15},
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
          
          let totalAmount = 0
          let totalTdsAmount = 0
          let totalFinalAmount = 0
          let totalGstAmount = 0
          let totalAfterTDSAmount = 0
          let totalAfterGSTAmount = 0
          responseData.forEach((item: any) => {
            worksheet.addRow({
              expenseTypeName: item.expenseTypeName,
              title: item.title,
              expenseDate: item.expenseDate,
              amount: item.amount,
              voucherNo: item.voucherNo,
              transactionMode: item.transactionMode,
              cashAccountName: item.cashAccountName,
              employeeName: item.employeeName,
              finalAmount: item.finalAmount,
              isTDSDeducted: item.isTDSDeducted,
              isGST: item.isGST,
              tdsPercentage: item.tdsPercentage,
              tdsAmount: item.tdsAmount,
              afterGSTAmount: item.afterGSTAmount,
              afterTDSAmount: item.afterTDSAmount,
              gstAmount: item.gstAmount,
              gstPer: item.gstPer,
            })
            totalAmount += item.amount
            totalFinalAmount += item.finalAmount
            totalTdsAmount += item.tdsAmount
            totalGstAmount += item.gstAmount
            totalAfterTDSAmount += item.afterTDSAmount
            totalAfterGSTAmount += item.afterGSTAmount
          })
          const totalRow = worksheet.addRow({
            expenseTypeName: 'Total', // Label for total row
            title: '',
            expenseDate: '',
            voucherNo: '',
            transactionMode: '',
            cashAccountName: '',
            employeeName: '',
            isTDSDeducted:'',
            isGST: '',
            tdsPercentage: '',
            amount: totalAmount,
            finalAmount: totalFinalAmount,
            tdsAmount: totalTdsAmount,
            gstAmount: totalGstAmount,
            afterTDSAmount: totalAfterTDSAmount,
            afterGSTAmount: totalAfterGSTAmount,
            gstPer:''
          })
          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(10).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(11).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(12).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(13).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(14).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(15).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(16).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(10).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(11).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(12).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(13).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(14).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(15).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(16).numFmt = '#,##0.00' // Example: format as currency
          // totalRow.getCell(17).numFmt = '#,##0.00' // Example: format as currency
          totalRow.eachCell((cell) => {
            cell.alignment = {vertical: 'middle', horizontal: 'center'} // Center alignment
            cell.border = {
              top: {style: 'thin', color: {argb: '000000'}}, // Top border for total row
              right: {style: 'thin', color: {argb: '000000'}}, // Right border
              bottom: {style: 'thin', color: {argb: '000000'}}, // Right border
            }
          })
          // Write to Excel file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `View_Expense_Type_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`
            link.click()
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
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

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/account-reports/expense/type-list',
              state: {
                expeseTypeID: state.selExpenseTypeID,
                mainStartDate: state.selStartDate,
                mainEndDate: state.selEndDate,
                expenseHeadID: state.selExpenseHeadID,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Expense Type :</label>
            <div className='col-11 fv-row'>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='expenseTypeID'
              >
                <option selected={state.selExpenseTypeID === 0 ? true : false} value={0}>
                  Select Expense Type
                </option>
                {state.expenseData.length > 0 &&
                  state.expenseData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.expenseTypeID}
                        selected={data.expenseTypeID == state.selExpenseTypeID ? true : false}
                      >
                        {data.expenseTypeName}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>

          <div className='mb-2 col-xl-3 col-sm-6'>
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
                renderFooter={() => (
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button
                      type='button'
                      onClick={resetFilterStartDate}
                      // onClick={() => {
                      // setStartDay(null)
                      //   resetFilter()
                      // }}
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
          {/* </div> */}

          <div className='mb-2 col-xl-3 col-sm-6 ps-2'>
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
                      // onClick={() => {
                      //   // setStartDay(null)
                      //   setSelectedCalendarEndDate(null)
                      // }}
                      onClick={resetFilterEndDate}
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
          <div className='col-xl-2 mt-8 ps-2'>
            <span title='Click to export Excel sheet'>
              <span
                className='btn btn-sm btn-light-primary bg-white'
                onClick={() => exportExcelData()}
              >
                <KTSVG path='/media/icons/duotune/files/fil002.svg' className='svg-icon-3' />
                Export Excel
              </span>
            </span>
          </div>

          <div className='col-xl-1 mt-7'>
            <Link
              to={{
                pathname: `/account-reports/expense/download-view`,
                state: {
                  expenseTypeID: state.selExpenseTypeID,
                  startDate: state.selStartDate,
                  endDate: state.selEndDate,
                },
              }}
              className='symbol symbol-40px cursor-pointer justify-content-center'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='View PDF'
            >
              <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
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
              <thead className='bg-secondary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Expense Date</span>
                    <span className='text-muted fw-bold d-block fs-6'>Vouchar No.</span>
                  </th>

                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Expense Type</span>
                    <span className='text-muted fw-bold d-block fs-6'>Title</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Sub Total</span>
                    <span className='text-muted fw-bold d-block fs-6'>Transction Mode</span>
                  </th>

                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Is GST</span>
                    <span className='text-muted fw-bold d-block fs-6'>GST Amount (%)</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Is TDS</span>
                    <span className='text-muted fw-bold d-block fs-6'>TDS Amount (%)</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Final Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Cash Account</span>
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
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.expenseDate}
                                  </span>
                                  <span className='text-muted d-block fs-7 mt-1'>
                                    {data.voucherNo}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.expenseTypeName}
                                  </span>
                                  <span className='text-muted d-block fs-7 mt-1'>{data.title}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.amount}
                                  </span>
                                  <span className='text-muted d-block fs-7 mt-1'>
                                    {data.transactionMode}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.isGST === true ? 'Yes' : 'No'}
                                  </span>
                                  {data.isGST === true ? (
                                    <span className='text-muted d-block fs-7 mt-1'>
                                      {data.gstAmount}&nbsp; {'('}
                                      {data.gstPer + '%'}
                                      {' )'}
                                    </span>
                                  ) : (
                                    <span className='text-muted d-block fs-7 mt-1'>N.A</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.isTDSDeducted === true ? 'Yes' : 'No'}
                                  </span>
                                  {data.isTDSDeducted === true ? (
                                    <span className='text-muted d-block fs-7 mt-1'>
                                      {data.tdsAmount}&nbsp;{'('} {data.tdsPercentage + '%'}
                                      {')'}
                                    </span>
                                  ) : (
                                    <span className='text-muted d-block fs-7 mt-1'>N.A</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.finalAmount}
                                  </span>
                                  <span className='text-muted d-block fs-7 mt-1'>
                                    {data.cashAccountName}
                                  </span>
                                </div>
                              </div>
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
                  colSpan={15}
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
      {/* <ModelPopUpDelete
        id={state.selExpMstID}
        pageName={'Expense Masters'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCounteyItem(state.selExpMstID)}
      /> */}

      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showDocument}
        onHide={handleCloseFlag}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Attach Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img
              alt='Pic'
              className='img-fluid'
              src={toAbsoluteUrl(`/media/svg/files/pdf.svg+${state.PDFShow}`)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ExpenseTypeReportView
