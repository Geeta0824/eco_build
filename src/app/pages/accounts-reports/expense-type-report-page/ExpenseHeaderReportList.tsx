import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IExpenseTypeReportModel} from '../../../models/accounts-reports/IExpenseTypeReportModel'
import moment from 'moment'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import {
  getExpenseHeadReportExcelList,
  getExpenseHeadReportList,
} from '../../../modules/accounts-reports/expense-type-report-master/ExpenseTypeReportCRUD'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'

interface IExpenseType {
  loading: boolean
  expenseTypeReportData: IExpenseTypeReportModel[]
  selStartDate: string
  selEndDate: string
}

type Props = {}

const ExpenseHeaderReportList: React.FC<Props> = () => {
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IExpenseType>({
    loading: false,
    expenseTypeReportData: [] as IExpenseTypeReportModel[],
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
      if (lc !== undefined) {
        mainSearchStartDay = lc.mainStartDate
        mainSearchEndDay = lc.mainEndDate
      }
      getExpenseMasterData(mainSearchStartDay, mainSearchEndDay)
    }, 100)
  }, [])

  // ======================Dropdown Api===========================
  function getExpenseMasterData(mainSearchStartDay: string, mainSearchEndDay: string) {
    getExpenseHeadReportList(mainSearchStartDay, mainSearchEndDay)
      .then((response) => {
        const responseData = response.data.responseObject
        setState({
          ...state,
          expenseTypeReportData: responseData,
          selStartDate: mainSearchStartDay,
          selEndDate: mainSearchEndDay,
          loading: false,
        })
        setTotal(responseData.length)
        if (response.data.isSuccess == true) {
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
      getExpenseMasterData(fmtMomentDate, state.selEndDate)
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(fmtMomentDate, state.selEndDate)
  }

  function resetFilterStartDate() {
    setMainLoading(true)
    setStartDay(null) // Reset startDay
    getExpenseMasterData('', state.selEndDate)
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
      getExpenseMasterData(state.selStartDate, fmtMomentDate)
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(state.selDate, fmtMomentDate)
  }

  function resetFilterEndDate() {
    setMainLoading(true)
    setEndDay(null) // Reset End
    getExpenseMasterData(state.selStartDate, '')
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
    getExpenseHeadReportExcelList(state.selStartDate, state.selEndDate)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            loading: false,
          })
          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ExpenseHeaderReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Expense Head Name', key: 'expenseHeadName', width: 22},
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
          // totalRow.getCell(2).numFmt = '"₹"#,##0.00'; // Example: format as currency
          totalRow.getCell(2).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(3).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(4).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(5).numFmt = '#,##0.00' // Example: format as currency
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
            link.download = `Expense_Header_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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
      <div className={`card `}>
        <div className='card-header border-0' style={{backgroundColor: '#000000'}}>
          <div className='mb-1 col-xl-3 col-sm-6'>
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

          <div className='mb-1 col-xl-3 col-sm-6 ps-2'>
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
          <div className='col-xl-3 col-sm-6 ps-2 mt-8'>
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
          <div className='col-xl-2 mt-7'>
            <Link
              to={{
                pathname: `/account-reports/expense/head/download`,
                state: {
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
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Expense Head</span>
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
                                    {data.expenseHeadName}
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
                                  pathname: `/account-reports/expense/type-list`,
                                  state: {
                                    expenseHeadID: data.expenseHeadID,
                                    mainStartDate: state.selStartDate,
                                    mainEndDate: state.selEndDate,
                                    expenseHeadName: data.expenseHeadName,
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

export default ExpenseHeaderReportList
