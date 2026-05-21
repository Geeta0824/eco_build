import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import {IPayFundListModel} from '../../../models/Accounts-page/pay-fund-page/IPayFundModel'
import {
  DeletePayFundDetails,
  GetExcelPayFundListFilterAPI,
  GetPayFundList,
  GetPayFundListFilterAPI,
} from '../../../modules/account-page/pay-fund-master-page/PayFundCRUD'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {PayFundCard} from './PayFundCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import moment from 'moment'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {getVenderWebList} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import Search from 'antd/es/input/Search'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

type Props = {}

interface IDesignation {
  loading: boolean
  payFundlistData: IPayFundListModel[]
  tmpPayFundlistData: IPayFundListModel[]
  vendorData: IVenderModel[]
  projectData: IProjectModel[]
  SearchText: string
  selVenderID: number
  activeID: number
  selPayFundID: number
  activeType: any
  vendorTypeID: number
  selVendorID: number
  selStartTime: string
  selEndTime: string
}

const PayFundList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IDesignation>({
    loading: false,
    payFundlistData: [] as IPayFundListModel[],
    tmpPayFundlistData: [] as IPayFundListModel[],
    vendorData: [] as IVenderModel[],
    projectData: [] as IProjectModel[],
    SearchText: '',
    vendorTypeID: 0,
    selVenderID: 0,
    selPayFundID: 0,
    activeID: 0,
    activeType: false,
    selVendorID: 0,
    selStartTime: '',
    selEndTime: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let VendorID: number = 0
      let StartTime: string = ''
      let EndTime: string = ''
      let SearchText: string = ''
      if (lc !== undefined) {
        VendorID = lc.mainVenderID
        StartTime = lc.mainStartTime
        EndTime = lc.mainEndTime
        SearchText = lc.mainSearch
      }

      getPayFundData(VendorID, StartTime, EndTime, SearchText)
    }, 100)
  }, [])

  function getPayFundData(
    VendorID: number,
    StartTime: string,
    EndTime: string,
    SearchText: string
  ) {
    GetPayFundListFilterAPI(VendorID, SearchText, StartTime, EndTime)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getVendorData(responseData, VendorID, StartTime, EndTime, SearchText)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, payFundlistData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getVendorData(
    payFundlistData: IPayFundListModel[],
    VendorID: number,
    StartTime: string,
    EndTime: string,
    SearchText: string
  ) {
    getVenderWebList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            payFundlistData: payFundlistData,
            tmpPayFundlistData: payFundlistData,
            vendorData: responseData,
            selVenderID: VendorID,
            selStartTime: StartTime,
            selEndTime: EndTime,
            SearchText: SearchText,
            loading: false,
          })
          setName(SearchText)

          setTotal(payFundlistData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, payFundlistData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectPaymentID: number) => {
    setState({
      ...state,
      selPayFundID: projectPaymentID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(projectPaymentID: number) {
    DeletePayFundDetails(projectPaymentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getPayFundData(state.selVenderID, state.selStartTime, state.selEndTime, state.SearchText)
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

  // ----------Stage Select change Function------------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    getPayFundData(parseInt(value), state.selStartTime, state.selEndTime, state.SearchText)
  }

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
      getPayFundData(state.selVenderID, fmtMomentDate, state.selEndTime, state.SearchText)
    }
    setMainLoading(true)
  }
  function resetStartDay() {
    setMainLoading(true)
    setName('')
    setStartDay(null)
    getPayFundData(state.selVenderID, '', state.selEndTime, state.SearchText)
  }
  // ============Start Date OnClick Function =========================
  const renderCustomStartInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a start date'
      value={startDay ? `${startDay.day}-${startDay.month}-${startDay.year}` : state.selStartTime}
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
      getPayFundData(state.selVenderID, state.selStartTime, fmtMomentDate, state.SearchText)
    }
    setMainLoading(true)
  }
  function resetEndDay() {
    setMainLoading(true)
    setName('')
    setEndDay(null)
    getPayFundData(state.selVenderID, state.selStartTime, '', state.SearchText)
  }
  //=================== End Date Input Function ===================================
  const renderCustomEndInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a end date'
      value={endDay ? `${endDay.day}-${endDay.month}-${endDay.year}` : state.selEndTime}
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

  //   ------View on other tab --------------
  async function downloadQuotationFile(selURL: string) {
    var fullUrl = process.env.REACT_APP_API_URL + selURL
    //Split image name
    const nameSplit = fullUrl.split('/')
    const duplicateName = nameSplit.pop()
    // let url = window.URL.createObjectURL(new Blob([fullUrl]))
    // let a = document.createElement('a')
    // a.href = url
    // a.download = '' + duplicateName + ''
    // a.click()
    const link = document.createElement('a')
    // link.download = '' + duplicateName + ''
    link.target = '_blank'
    link.href = `${fullUrl}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    getPayFundData(0, '', '', '')
    setName('')
    setStartDay(null)
    setEndDay(null)
  }

  // ---------------------------------- Excel File ------------------------------------------------
  function exportExcelData() {
    GetExcelPayFundListFilterAPI(
      state.selVenderID,
      state.SearchText,
      state.selStartTime,
      state.selEndTime
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
          // XLSX.writeFile(workbook, `PayFund_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`)

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('PayFund_Report')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Payment Date', key: 'paymentDate', width: 13},
            {header: 'Voucher No', key: 'voucherNo', width: 13},
            {header: 'Vendor Name', key: 'vendorName', width: 25},
            {header: 'Project Name', key: 'projectName', width: 28},
            {header: 'Customer Name', key: 'customeName', width: 20},
            {header: 'Amount', key: 'amount', width: 10},
            {header: 'Transaction Mode', key: 'transactionMode', width: 16},
            {header: 'Cash Account Name', key: 'cashAccountName', width: 18},
            {header: 'Project Invoice No', key: 'projectInvoiceNo', width: 18},
            {header: 'File Path', key: 'filePath', width: 55},
            // {header: 'Pan Card Number', key: 'pancardNumber', width: 20},
            {header: 'Final Amount', key: 'finalAmount', width: 12},
            {header: 'Sub Total', key: 'subTotal', width: 10},
            {header: 'GST Type ID', key: 'gstTypeID', width: 11},
            {header: 'GST Type Name', key: 'gstTypeName', width: 15},
            {header: 'Is TDS Deducted', key: 'isTDSDeducted', width: 16},
            {header: 'Is GST', key: 'isGST', width: 8},
            {header: 'TDS Percentage', key: 'tdsPercentage', width: 14},
            {header: 'TDS Amount', key: 'tdsAmount', width: 11},
            {header: 'After GST Amount', key: 'afterGSTAmount', width: 16},
            {header: 'After TDS Amount', key: 'afterTDSAmount', width: 16},
            {header: 'GST Amount', key: 'gstAmount', width: 12},
            {header: 'Total Gst Per', key: 'totalGstPer', width: 12},
            {header: 'IGST Per', key: 'igstPer', width: 10},
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
              paymentDate: item.paymentDate,
              voucherNo: item.voucherNo,
              vendorName: item.vendorName,
              projectName: item.projectName,
              customeName: item.customeName,
              amount: item.amount,
              transactionMode: item.transactionMode,
              cashAccountName: item.cashAccountName,
              projectInvoiceNo: item.projectInvoiceNo,
              filePath: item.filePath,
              // pancardNumber: item.pancardNumber,
              finalAmount: item.finalAmount,
              subTotal: item.subTotal,
              gstTypeID: item.gstTypeID,
              gstTypeName: item.gstTypeName,
              isTDSDeducted: item.isTDSDeducted,
              isGST: item.isGST,
              tdsPercentage: item.tdsPercentage,
              tdsAmount: item.tdsAmount,
              afterGSTAmount: item.afterGSTAmount,
              afterTDSAmount: item.afterTDSAmount,
              gstAmount: item.gstAmount,
              totalGstPer: item.totalGstPer,
              igstPer: item.igstPer,
            })
          })
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `_PayFund_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getPayFundData(state.selVenderID, state.selStartTime, state.selEndTime, keyword)
    } else {
      getPayFundData(state.selVenderID, state.selStartTime, state.selEndTime, '')
    }
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.payFundlistData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IPayFundListModel[] = state.payFundlistData.slice(
    indexOfFirstPage,
    indexOfLastPage
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
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-4 col-sm-6 ps-0'>
            <label className='form-label fw-bold text-white'>Vendor:</label>
            <select
              className='form-select lineHeightByD'
              aria-label='Default select example'
              onChange={selectChange}
              id='VendorID'
              value={state.selVenderID}
            >
              <option selected={state.selVendorID === 0 ? true : false} value={0}>
                Select Vendor
              </option>
              {state.vendorData.length > 0 &&
                state.vendorData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.vendorID}
                      selected={data.vendorID == state.selVendorID ? true : false}
                    >
                      {data.companyName}
                    </option>
                  )
                })}
            </select>
          </div>
          <div className='mb-2 col-xl-4 col-sm-6 ps-0'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value) => searchFilter(value)}
            />
          </div>
          <div className='col-2 text-end mt-7 px-1'>
            <span
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

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: '/accounts/pay-for-project/add',
                state: {
                  VendorID: state.selVenderID,
                  StartDate: state.selStartTime,
                  EndTime: state.selEndTime,
                  SearchText: state.SearchText,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white mt-5'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
          <div className='mb-2 col-xl-3 col-sm-6 ps-0'>
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
                      onClick={resetStartDay}
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

          <div className='mb-2 col-xl-3 col-sm-6 ps-0'>
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
                      onClick={resetEndDay}
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
          <div className=' mt-6 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div>
          <div className='col-1 text-end mt-6'>
            <Link
              to={{
                pathname: `/accounts/pay-for-project/download`,
                state: {
                  VendorID: state.selVenderID,
                  StartDate: state.selStartTime,
                  EndTime: state.selEndTime,
                  SearchText: state.SearchText,
                },
              }}
              className='symbol symbol-40px cursor-pointer d-block justify-content-center text-end'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='View PDF'
            >
              <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
            </Link>
          </div>
          {/* <Header_Search_Add
            searchText={name}
            filter={(e) => filter(e)}
            pathName={'/accounts/pay-for-project/add'}
            title='Click to add a Pay Fund '
          /> */}
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
                    <span className='d-block mb-1'>Payment Date</span>
                    <span className='text-muted fw-bold d-block fs-6'>Vouchar No.</span>
                  </th>
                  <th className='min-w-150px'>Vendor Name</th>
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer Name</span>
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
                  <th className='w-175px'>Create By</th>
                  <th className='min-w-25px text-left'>Download</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <PayFundCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.filePath)}
                            handleShow={() => handleShow(data.projectPaymentID)}
                            handleShowProDtl={() => handleShowProDtl(data.projectID)}
                            VendorID={state.selVenderID}
                            StartDate={state.selStartTime}
                            EndTime={state.selEndTime}
                            SearchText={state.SearchText}
                            EmployeeID={user.employeeID}
                          />
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selPayFundID}
        pageName={'Pay Fund'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.selPayFundID)}
      />
      <ProjectDetailsModel
        data={state.projectData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
    </>
  )
}

export default PayFundList
