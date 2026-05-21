import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import ExcelJS from 'exceljs'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import Search from 'antd/es/input/Search'
import {
  ICashAccountLedgerList,
  ICashReportLedgerModel,
} from '../../../models/accounts-reports/ICashAccountReportList'
import {
  ExportExcelCashAccountListApi,
  getCashAccountLedgerListByFilterApi,
} from '../../../modules/accounts-reports/cash-account-report/CashAccountReportCRUD'
import moment from 'moment'
import * as XLSX from 'xlsx'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'

type Props = {}

interface IProject {
  loading: boolean
  cashAccountLedgerData: ICashAccountLedgerList[]
  temCashAccountLedgerData: ICashAccountLedgerList[]
  cashAccontName: ICashReportLedgerModel
  projectData: IProjectModel[]
  cashAccountID: number
  selStartDate: string
  selEndDate: string
  startDate: string
  endDate: string
}

const CashAccountLedgerView: React.FC<Props> = () => {
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IProject>({
    loading: false,
    cashAccountLedgerData: [] as ICashAccountLedgerList[],
    temCashAccountLedgerData: [] as ICashAccountLedgerList[],
    cashAccontName: {} as ICashReportLedgerModel,
    projectData: [] as IProjectModel[],
    cashAccountID: 0,
    selStartDate: '',
    selEndDate: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    setState({
      ...state,
      loading: true,
    })
    setTimeout(() => {
      const lc: any = location.state
      const cashAccountID = lc.cashAccountID
      getCashAccountLedgerData(cashAccountID, state.startDate, state.endDate)
    }, 100)
  }, [])

  // //======================= Ledger Report List Api =============================

  function getCashAccountLedgerData(cashAccountID: number, startDate: string, endDate: string) {
    getCashAccountLedgerListByFilterApi(cashAccountID, startDate, endDate)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            cashAccountLedgerData: responseData,
            temCashAccountLedgerData: responseData,
            cashAccountID: cashAccountID,
            cashAccontName: response.data,
            loading: false,
            startDate: startDate,
            endDate: endDate,
          })
          setMainLoading(false)
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            cashAccountLedgerData: [],
            temCashAccountLedgerData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          cashAccountLedgerData: [],
          temCashAccountLedgerData: [],
          loading: false,
        })
      })
  }

  function exportExcelData() {
    ExportExcelCashAccountListApi(state.cashAccountID, state.startDate, state.endDate)
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
          // XLSX.writeFile(workbook, `_View_CashAccount_${moment(new Date()).format('YYYYMMDD')}.xlsx`)

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ViewCashAccount')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Voucher Date', key: 'voucherDate', width: 15},
            {header: 'Descriptions', key: 'descriptions', width: 40},
            {header: 'Credit', key: 'credit', width: 15},
            {header: 'Debit', key: 'debit', width: 15},
            {header: 'Balance', key: 'balance', width: 15},
            {header: 'Voucher Number', key: 'voucherNumber', width: 20},
            {header: 'Transaction Mode', key: 'transactionMode', width: 20},
            {header: 'Cash Account Name', key: 'cashAccountName', width: 25},
            {header: 'Customer Name', key: 'customerName', width: 20},
            {header: 'Project Name', key: 'projectName', width: 30},
            {header: 'Company Name', key: 'companyName', width: 20},
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
              voucherDate: item.voucherDate,
              descriptions: item.descriptions,
              credit: item.credit,
              debit: item.debit,
              balance: item.balance,
              voucherNumber: item.voucherNumber,
              transactionMode: item.transactionMode,
              cashAccountName: item.cashAccountName,
              customerName: item.customerName,
              projectName: item.projectName,
              companyName: item.companyName,
              contactPerson: item.contactPerson,
            })
          })

          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `_View_CashAccount_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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

  // ================= SerchText Function ===========
  const [name, setName] = useState<string>('')

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const {projectID} = useParams<{projectID: string}>()
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICashAccountLedgerList[] = state.cashAccountLedgerData.slice(
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
      getCashAccountLedgerData(state.cashAccountID, fmtMomentDate, state.endDate)
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(fmtMomentDate, state.selEndDate)
  }
  function resetFilterStartDate() {
    setMainLoading(true)
    setName('')
    setStartDay(null) // Reset startDay state
    getCashAccountLedgerData(state.cashAccountID, '', state.endDate)
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
      getCashAccountLedgerData(state.cashAccountID, state.startDate, fmtMomentDate)
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(state.selDate, fmtMomentDate)
  }
  function resetFilterEndDate() {
    setMainLoading(true)
    setName('')
    setEndDay(null) // Reset startDay state
    getCashAccountLedgerData(state.cashAccountID, state.startDate, '')
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
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-4 btn btn-rounded'
          onClick={() => {
            history.push('/account-reports/cash/list')
          }}
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 row g-2' style={{backgroundColor: '#000000'}}>
          <div className='col-5  text-start'>
            <label className='text-white fs-5 mt-3 fw-bold '>Cash Account Name : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.cashAccontName.accountName}</span>
          </div>
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
                      // onClick={() => {
                      //   // setStartDay(null)
                      //   setSelectedCalendarStartDate(null)
                      // }}

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
          {/* </div> */}
          <div className='col-1 mt-3 text-end mt-8'>
            <Link
              to={{
                pathname: `/account-reports/cash/download-view/${state.cashAccountID}`,
                state: {startDate: startDay, endDate: endDay},
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

export default CashAccountLedgerView
