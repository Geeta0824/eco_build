import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {
  getExpenseTypeReportGroupByExcelList,
  getExpenseTypeReportGroupByList,
} from '../../../modules/accounts-reports/expense-type-report-master/ExpenseTypeReportCRUD'
import {IExpenseTypeReportModel} from '../../../models/accounts-reports/IExpenseTypeReportModel'
import {IExpenseModel} from '../../../models/master-page/IExpenseTypeMode'
import {GetExpenseTypeListByExpenseHeadIDList} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
import moment from 'moment'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import {getExpenseHeadList} from '../../../modules/account-page/expense-header-page/ExpenseHeaderCRUD'
import {IExpenseHeadModel} from '../../../models/Accounts-page/expense-header/ExpenseHeaderModel'

interface IExpenseType {
  loading: boolean
  expenseTypeReportData: IExpenseTypeReportModel[]
  tmpexpenseTypeReportData: IExpenseTypeReportModel[]
  expenseData: IExpenseModel[]
  expenseHeadData: IExpenseHeadModel[]
  PDFShow: string
  SearchText: string
  selExpMstID: number
  activeID: number
  activeType: any
  pathUrl: any
  selExpenseTypeID: number
  selExpenseHeadID: number
  selStartDate: string
  selExpHeadName: string
  selEndDate: string
}

type Props = {}

const ExpenseTypeReportList: React.FC<Props> = () => {
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
    expenseHeadData: [] as IExpenseHeadModel[],
    PDFShow: '',
    SearchText: '',
    selExpMstID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    selExpenseTypeID: 0,
    selExpenseHeadID: 0,
    selStartDate: '',
    selExpHeadName: '',
    selEndDate: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearchStartDay: string = ''
      var mainSearchEndDay: string = ''
      var mainExpHeadName: string = ''
      var mainExpenseHeadID: number = 0
      var mainExpenseTypeID: number = 0
      if (lc !== undefined) {
        mainExpenseHeadID = lc.expenseHeadID
        mainSearchStartDay = lc.mainStartDate
        mainSearchEndDay = lc.mainEndDate
        mainExpenseTypeID = lc.expeseTypeID
        mainExpHeadName = lc.expenseHeadName
      }
      getExpenseHeaderData(
        mainExpenseHeadID,
        mainSearchStartDay,
        mainSearchEndDay,
        mainExpenseTypeID,
        mainExpHeadName
      )
    }, 100)
  }, [])

  function getExpenseHeaderData(
    mainExpenseHeadID: number,
    mainSearchStartDay: string,
    mainSearchEndDay: string,
    mainExpenseTypeID: number,
    mainExpHeadName: string
  ) {
    getExpenseHeadList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getExpenseMasterData(
            mainExpenseHeadID,
            mainSearchStartDay,
            mainSearchEndDay,
            mainExpenseTypeID,
            mainExpHeadName,
            responseData
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseHeadData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, expenseHeadData: [], loading: false})
      })
  }

  // ======================Dropdown Api===========================
  function getExpenseMasterData(
    mainExpenseHeadID: number,
    mainSearchStartDay: string,
    mainSearchEndDay: string,
    mainExpenseTypeID: number,
    mainExpHeadName: string,
    expenseHeadData: IExpenseHeadModel[]
  ) {
    GetExpenseTypeListByExpenseHeadIDList(mainExpenseHeadID)
      .then((response) => {
        const responseData = response.data.responseObject
        getExpenseMasterReportData(
          mainExpenseHeadID,
          mainSearchStartDay,
          mainSearchEndDay,
          mainExpenseTypeID,
          mainExpHeadName,
          expenseHeadData,
          responseData
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
    selExpHeadID: number,
    startDate: string,
    endDate: string,
    selExTypeID: number,
    mainExpHeadName: string,
    expenseHeadData: IExpenseHeadModel[],
    expenseData: IExpenseModel[]
  ) {
    getExpenseTypeReportGroupByList(selExTypeID, selExpHeadID, startDate, endDate)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            expenseTypeReportData: responseData,
            expenseData: expenseData,
            selExpenseTypeID: selExTypeID,
            selStartDate: startDate,
            selEndDate: endDate,
            expenseHeadData: expenseHeadData,
            selExpenseHeadID: selExpHeadID,
            selExpHeadName: mainExpHeadName,
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

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'expenseTypeID') {
      getExpenseMasterData(
        state.selExpenseHeadID,
        state.selStartDate,
        state.selEndDate,
        parseInt(value),
        state.selExpHeadName,
        state.expenseHeadData
      )
    } else if (elementId === 'expenseHeadID') {
      getExpenseMasterData(
        parseInt(value),
        state.selStartDate,
        state.selEndDate,
        state.selExpenseTypeID,
        state.selExpHeadName,
        state.expenseHeadData
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
      getExpenseMasterData(
        state.selExpenseHeadID,
        fmtMomentDate,
        state.selEndDate,
        state.selExpenseTypeID,
        state.selExpHeadName,
        state.expenseHeadData
      )
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(fmtMomentDate, state.selEndDate)
  }
  function resetFilterStartDate() {
    setMainLoading(true)
    setStartDay(null) // Reset startDay
    getExpenseMasterData(
      state.selExpenseHeadID,
      '',
      state.selEndDate,
      state.selExpenseTypeID,
      state.selExpHeadName,
      state.expenseHeadData
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
      getExpenseMasterData(
        state.selExpenseHeadID,
        state.selStartDate,
        fmtMomentDate,
        state.selExpenseTypeID,
        state.selExpHeadName,
        state.expenseHeadData
      )
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(state.selDate, fmtMomentDate)
  }
  function resetFilterEndDate() {
    setMainLoading(true)
    setEndDay(null) // Reset End
    getExpenseMasterData(
      state.selExpenseHeadID,
      state.selStartDate,
      '',
      state.selExpenseTypeID,
      state.selExpHeadName,
      state.expenseHeadData
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
  function exportExcelData(temExpHeadName: string) {
    getExpenseTypeReportGroupByExcelList(
      state.selExpenseTypeID,
      state.selExpenseHeadID,
      state.selStartDate,
      state.selEndDate
    )
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
          //   `ExpenseType_Reports_${temExpHeadName}-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`
          // )

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ExpenseTypeReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Expense Head Name', key: 'expenseHeadName', width: 22},
            {header: 'Expense Type Name', key: 'expenseTypeName', width: 20},
            {header: 'Amount', key: 'amount', width: 15},
            {header: 'Final Amount', key: 'finalAmount', width: 15},
            {header: 'Tds Amount', key: 'tdsAmount', width: 15},
            {header: 'Gst Amount', key: 'gstAmount', width: 15},
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
          let totalAmountSum = 0
          let totalFinalAmountSum = 0
          let totalTdsAmountSum = 0
          let totalgstAmountSum = 0
          responseData.forEach((item: any) => {
            worksheet.addRow({
              expenseHeadName: item.expenseHeadName,
              expenseTypeName: item.expenseTypeName,
              amount: item.amount,
              finalAmount: item.finalAmount,
              tdsAmount: item.tdsAmount,
              gstAmount: item.gstAmount,
            })
            totalAmountSum += item.amount
            totalFinalAmountSum += item.finalAmount
            totalTdsAmountSum += item.tdsAmount
            totalgstAmountSum += item.gstAmount
          })

          const totalRow = worksheet.addRow({
            expenseHeadName: 'Total', // Label for total row
            expenseTypeName: '', // Label for total row
            amount: totalAmountSum, // The sum of total balances
            finalAmount: totalFinalAmountSum, // The sum of total balances
            tdsAmount: totalTdsAmountSum, // The sum of total balances
            gstAmount: totalgstAmountSum, // The sum of total balances
          })

          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(2).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(3).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(4).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(5).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(6).font = {bold: true} // Bold the total balance sum
          // totalRow.getCell(2).numFmt = '"₹"#,##0.00'; // Example: format as currency
          totalRow.getCell(2).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(3).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(4).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(5).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(6).numFmt = '#,##0.00' // Example: format as currency
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
            link.download = `${temExpHeadName}Expense_Type_Report_${moment(new Date()).format(
              'YYYYMMDD'
            )}.xlsx`
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
              pathname: '/account-reports/expense/header/list',
              state: {
                expenseHeadID: state.selExpenseHeadID,
                mainStartDate: state.selStartDate,
                mainEndDate: state.selEndDate,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Expense Head :</label>
            <div className='col-11 fv-row'>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='expenseHeadID'
              >
                <option selected={state.selExpenseHeadID === 0 ? true : false} value={0}>
                  Select Expense Head
                </option>
                {state.expenseHeadData.length > 0 &&
                  state.expenseHeadData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.expenseHeadID}
                        selected={data.expenseHeadID == state.selExpenseHeadID ? true : false}
                      >
                        {data.expenseHeadName}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>
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
          <div className='col-xl-3 col-sm-6'>
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
          <div className='col-xl-3 col-sm-6 ps-4'>
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
                renderFooter={() => (
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button
                      type='button'
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
          <div className='col-xl-2 col-sm-6 mt-5'>
            <span title='Click to export Excel sheet'>
              <span
                className='btn btn-sm btn-light-primary bg-white'
                onClick={() => exportExcelData(state.selExpHeadName)}
              >
                <KTSVG path='/media/icons/duotune/files/fil002.svg' className='svg-icon-3' />
                Export Excel
              </span>
            </span>
          </div>
          <div className='col-xl-1 mt-5'>
            <Link
              to={{
                pathname: `/account-reports/expense/download`,
                state: {
                  expenseTypeID: state.selExpenseTypeID,
                  expenseHeadID: state.selExpenseHeadID,
                  startDate: state.selStartDate,
                  endDate: state.selEndDate,
                  expenseHeadName: state.selExpHeadName,
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
          <div className='col-xl-6 col-sm-6'></div>
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
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Expense Type</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Amount</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>GST Amount</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>TDS Amount</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Final Amount</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1 text-end'>View</span>
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
                                    {data.expenseTypeName}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.amount}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.gstAmount}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.tdsAmount}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.finalAmount}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className='text-end'>
                              <Link
                                to={{
                                  pathname: `/account-reports/expense/view`,
                                  state: {
                                    expeseTypeID: data.expenseTypeID,
                                    expenseHeadID: data.expenseHeadID,
                                    mainStartDate: state.selStartDate,
                                    mainEndDate: state.selEndDate,
                                    // mainExpenseTypeID: state.selExpenseTypeID,
                                    // mainExpenseHeadID: state.selExpenseHeadID,
                                  },
                                }}
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
                                data-bs-toggle='tooltip'
                                data-bs-placement='top'
                                title='View'
                              >
                                <span className='fa fa-eye fs-2'></span>
                              </Link>
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
    </>
  )
}

export default ExpenseTypeReportList
