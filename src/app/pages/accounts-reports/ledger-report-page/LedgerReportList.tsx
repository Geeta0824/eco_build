import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import Search from 'antd/es/input/Search'
import {ILedgerReportModel} from '../../../models/accounts-reports/ILedgerReportModel'
import {
  ExportExcelCompanyLedgerReportApi,
  getCompanyLedgerListByFilterApi,
} from '../../../modules/accounts-reports/ledger-report/LedgerReportCRUD'
import moment from 'moment'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
type Props = {}

interface IProject {
  loading: boolean
  ledgerReportData: ILedgerReportModel[]
  temLedgerReportData: ILedgerReportModel[]
  projectData: IProjectModel[]
  selProjectIfD: number
  activeID: number
  activeType: any
  imageShow: string
  selVendorID: number
  selProjectID: number
  cashAccountID: number
  searchText: string
  setTransactionTypeID: number
  startDate: string
  endDate: string
}

const LedgerReportList: React.FC<Props> = () => {
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IProject>({
    loading: false,
    ledgerReportData: [] as ILedgerReportModel[],
    temLedgerReportData: [] as ILedgerReportModel[],
    projectData: [] as IProjectModel[],
    selProjectIfD: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selVendorID: 0,
    selProjectID: 0,
    cashAccountID: 0,
    searchText: '',
    setTransactionTypeID: 0,
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    setState({
      ...state,
      loading: true,
    })
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      let startDate: string = ''
      let endDate: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
        startDate = lc.startDate
        endDate = lc.endDate
      }
      getCompanyLedgerData(mainSearch, startDate, endDate)
    }, 100)
  }, [])

  // //======================= Ledger Report List Api =============================

  function getCompanyLedgerData(searchText: string, startDate: string, endDate: string) {
    getCompanyLedgerListByFilterApi(searchText, startDate, endDate)
      .then((response) => {
        let responseData = response.data.responseObject

        if (response.data.isSuccess == true) {
          setState({
            ...state,
            ledgerReportData: responseData,
            temLedgerReportData: responseData,
            startDate: startDate,
            endDate: endDate,
            searchText: searchText,
            loading: false,
          })
          setMainLoading(false)
          setTotal(responseData.length)
          setPage(1)
          setName(searchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            ledgerReportData: [],
            temLedgerReportData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          ledgerReportData: [],
          temLedgerReportData: [],
          loading: false,
        })
      })
  }

  // ================= SerchText Function ===================
  const [name, setName] = useState<string>('')

  //------------------- the search result-----------------
  const searchFilter = (e: any) => {
    const keyword = e
    // setMainLoading(true)
    if (keyword !== '') {
      getCompanyLedgerData(keyword, state.startDate, state.endDate)
    } else {
      getCompanyLedgerData('', state.startDate, state.endDate)
    }

    setName(keyword)
  }
  // ------------------------------reset button---------------------
  function resetFilter() {
    getCompanyLedgerData('', '', '')
    setName('')
    setStartDay(null)
    setEndDay(null)
  }
  // ====================Pagination===========================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.ledgerReportData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ILedgerReportModel[] = state.ledgerReportData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // ================================
  function exportExcelData() {
    ExportExcelCompanyLedgerReportApi(state.searchText, state.startDate, state.endDate)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            loading: false,
          })
          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('LedgerReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Voucher Date', key: 'voucherDate', width: 15},
            {header: 'Descriptions', key: 'descriptions', width: 40},
            {header: 'Credit', key: 'credit', width: 15},
            {header: 'Debit', key: 'debit', width: 15},
            {header: 'Balance', key: 'balance', width: 15},
            {header: 'Voucher No', key: 'voucherNumber', width: 15},
            {header: 'Transaction Mode', key: 'transactionMode', width: 20},
            {header: 'Cash Account Name', key: 'cashAccountName', width: 25},
            {header: 'Customer Name', key: 'customerName', width: 20},
            {header: 'Project Name', key: 'projectName', width: 25},
            {header: 'Company Name', key: 'companyName', width: 25},
            {header: 'Contact Person', key: 'contactPerson', width: 25},
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
          // let totalCredit = 0
          // let totalDebit = 0
          // Add data rows
          responseData.forEach((item: any) => {
            worksheet.addRow({
              voucherDate: item.voucherDate,
              descriptions: item.descriptions,
              debit: item.debit,
              credit: item.credit,
              balance: parseInt(item.balance),
              voucherNumber: item.voucherNumber,
              transactionMode: item.transactionMode,
              cashAccountName: item.cashAccountName,
              customerName: item.customerName,
              projectName: item.projectName,
              companyName: item.companyName,
              contactPerson: item.contactPerson,
            })
            totalBalance += parseInt(item.balance)
            // totalCredit += parseInt(item.credit)
            // totalDebit += parseInt(item.debit)
          })

          const totalRow = worksheet.addRow({
            voucherDate: 'Total',
            descriptions: '',
            balance: totalBalance,
            debit: '',
            credit: '',
            voucherNumber: '',
            transactionMode: '',
            cashAccountName: '',
            customerName: '',
            projectName: '',
            companyName: '',
            contactPerson: '',
          })
          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(2).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(3).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(4).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(5).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(2).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(3).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(4).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(5).numFmt = '#,##0.00' // Example: format as currency
          // totalRow.getCell(17).numFmt = '#,##0.00' // Example: format as currency
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
            link.download = `LedgerReport_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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

  // =============== Start Date OnClick Function ================
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
      getCompanyLedgerData(state.searchText, fmtMomentDate, state.endDate)
    }
    setMainLoading(true)
  }
  function resetFilterStartDate() {
    setMainLoading(true)
    setName('')
    setStartDay(null) // Reset startDay state
    getCompanyLedgerData(state.searchText, '', state.endDate)
  }
  // ============Start Date OnClick Function =====================
  const renderCustomStartInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a start date'
      value={startDay ? `${startDay.day}-${startDay.month}-${startDay.year}` : state.startDate}
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
      getCompanyLedgerData(state.searchText, state.startDate, fmtMomentDate)
    }
  }
  function resetEndDate() {
    setMainLoading(true)
    setName('')
    setEndDay(null)
    getCompanyLedgerData(state.searchText, state.startDate, '')
  }
  //=================== End Date Input Function ===================================
  const renderCustomEndInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a end date'
      value={endDay ? `${endDay.day}-${endDay.month}-${endDay.year}` : state.endDate}
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
            projectData: responseData,
            loading: false,
          })
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
    setShowProDtl(true)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 row g-3' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-2 col-sm-6'>
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
                      onClick={resetFilterStartDate}
                      // onClick={() => {
                      //   // setStartDay(null)
                      //   setSelectedCalendarStartDate(null)
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

          <div className='mb-2 col-xl-2 col-sm-6'>
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
                      onClick={resetEndDate}
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
          <div className='mb-2 col-xl-3 col-sm-6 ps-1'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value: any) => searchFilter(value)}
            />
          </div>
          {/* </div> */}
          <div className='col-2 text-end mt-9'>
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
          <div className='mt-7 ps-1 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div>
          <div className='col-1 text-end mt-7 ps-1'>
            <Link
              to={{
                pathname: `/account-reports/ledger/download`,
                state: {
                  searchText: state.searchText,
                  startDate: state.startDate,
                  endDate: state.endDate,
                },
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
        {/* end::Header */}
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
                  <th className='min-w-150px '>
                    <span className='d-block mb-1'>Cash Account Name</span>
                  </th>

                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Description</span>
                  </th>
                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer Name</span>
                  </th>
                  <th className='min-w-150px'>
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
                                {data.voucherDate}
                              </span>
                              <span className='text-muted fw-bold d-block fs-6'>
                                {data.voucherNumber}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.cashAccountName}
                              </span>
                            </td>

                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.descriptions}
                              </span>
                            </td>
                            <td>
                              <span
                                className='text-dark text-hover-primary d-block mb-1 fs-6 cursor-pointer'
                                title='Click Hear'
                                onClick={() => handleShowProDtl(data.projectID)}
                              >
                                {data.projectName}
                              </span>
                              <span className='text-muted fw-bold d-block mb-1 fs-6'>
                                {data.customerName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.companyName}
                              </span>
                              <span className='text-muted fw-bold d-block mb-1 fs-6'>
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
      <ProjectDetailsModel
        data={state.projectData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
    </>
  )
}

export default LedgerReportList
