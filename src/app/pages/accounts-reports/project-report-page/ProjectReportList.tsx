import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IProjectReportsmodel} from '../../../models/accounts-reports/IProjectReportsmodel'
import moment from 'moment'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import {
  ExportExcelProjectListByByFilterApi,
  getProjectListByFilterApi,
} from '../../../modules/accounts-reports/project-report-master/ProjectReportCRUD'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import Search from 'antd/es/transfer/search'
import {GetProjectStatusForDropDownListAPI} from '../../../modules/master-page/project-status-master-page/ProjectStatusCRUD'
import {IProjectStatusModel} from '../../../models/master-page/IProjectStatusModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'

interface IProjectReport {
  loading: boolean
  projectReportsData: IProjectReportsmodel[]
  tmpProjectReportsData: IProjectReportsmodel[]
  // pmcWorkStageData: IPMCWorkStageModel[]
  projectStatusData: IProjectStatusModel[]
  projectData: IProjectModel[]
  PDFShow: string
  SearchText: string
  selExpMstID: number
  activeID: number
  activeType: any
  pathUrl: any
  selPmcWorkStageID: number
  selStartDate: string
  selEndDate: string
  selStageID: number
  projectID: number
  selNoOfProjects: number
  selTotalProjectAmount: number
  selTotalAddonAmoun: number
  selTotalFinalAmount: number
  selTotalRemainingAmount: number
  selTotalPaidAmount: number
  selStageName: string
}

type Props = {}

const ProjectReportLIst: React.FC<Props> = () => {
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IProjectReport>({
    loading: false,
    projectReportsData: [] as IProjectReportsmodel[],
    tmpProjectReportsData: [] as IProjectReportsmodel[],
    // pmcWorkStageData: [] as IPMCWorkStageModel[],
    projectStatusData: [] as IProjectStatusModel[],
    projectData: [] as IProjectModel[],
    PDFShow: '',
    SearchText: '',
    selExpMstID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    selPmcWorkStageID: 0,
    selStartDate: '',
    selEndDate: '',
    selStageID: 0,
    projectID: 0,
    selNoOfProjects: 0,
    selTotalProjectAmount: 0,
    selTotalAddonAmoun: 0,
    selTotalFinalAmount: 0,
    selTotalRemainingAmount: 0,
    selTotalPaidAmount: 0,
    selStageName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      let startDate: string = ''
      let endDate: string = ''
      let pmcWorkStageID: number = 0
      if (lc != undefined) {
        mainSearch = lc.search
        startDate = lc.startDate
        endDate = lc.endDate
        pmcWorkStageID = lc.mainPmcWorkStageID
      }
      getPMCWorkWorkStageData(mainSearch, startDate, endDate, pmcWorkStageID)
    }, 100)
  }, [])

  function getPMCWorkWorkStageData(
    mainSearch: string,
    startDate: string,
    endDate: string,
    pmcWorkStageID: number
  ) {
    GetProjectStatusForDropDownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getProjectReportListData(
            responseData,
            // state.selPmcWorkStageID,
            // state.selStartDate,
            // state.selEndDate
            pmcWorkStageID,
            startDate,
            endDate,
            mainSearch
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectStatusData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, projectStatusData: [], loading: false})
      })
  }

  // ======================List Api================================
  function getProjectReportListData(
    projectStatusData: IProjectStatusModel[],
    selPmcWorkStageID: number,
    selStartDate: string,
    selEndDate: string,
    mainSearch: string
  ) {
    getProjectListByFilterApi(selPmcWorkStageID, selStartDate, selEndDate)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let tmpNoOfProjects = response.data.noOfProjects
          let tmpTotalProjectAmount = response.data.totalProjectAmount
          let tmpTotalAddonAmount = response.data.totalAddonAmount
          let selTotalFinalAmount = response.data.totalFinalAmount
          let tmpTotalRemainingAmount = response.data.totalRemainingAmount
          let tmpTotalPaidAmount = response.data.totalPaidAmount
          // let TmpselStageName = response.data.selStageName
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.finalAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.projectAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.customerName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              projectReportsData: results,
              tmpProjectReportsData: responseData,
              projectStatusData: projectStatusData,
              selNoOfProjects: tmpNoOfProjects,
              selTotalProjectAmount: tmpTotalProjectAmount,
              selTotalAddonAmoun: tmpTotalAddonAmount,
              selTotalFinalAmount: selTotalFinalAmount,
              selTotalRemainingAmount: tmpTotalRemainingAmount,
              selTotalPaidAmount: tmpTotalPaidAmount,
              selStartDate,
              selEndDate,
              selPmcWorkStageID,
              loading: false,
            })
            setTotal(results.length)
          } else {
            setState({
              ...state,
              projectReportsData: responseData,
              tmpProjectReportsData: responseData,
              selNoOfProjects: tmpNoOfProjects,
              selTotalProjectAmount: tmpTotalProjectAmount,
              selTotalAddonAmoun: tmpTotalAddonAmount,
              selTotalFinalAmount: selTotalFinalAmount,
              selTotalRemainingAmount: tmpTotalRemainingAmount,
              selTotalPaidAmount: tmpTotalPaidAmount,
              // selStageName: TmpselStageName,
              projectStatusData: projectStatusData,
              selStartDate,
              selEndDate,
              selPmcWorkStageID,
              // SearchText: mainSearch,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectReportsData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, projectReportsData: [], loading: false})
      })
  }

  function exportExcelData() {
    ExportExcelProjectListByByFilterApi(
      state.selPmcWorkStageID,
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
          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ProjectReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Amount', key: 'amount', width: 15},
            {header: 'Balance', key: 'balance', width: 15},
            {header: 'Payment Date', key: 'paymentDate', width: 15},
            {header: 'Project Invoice No', key: 'projectInvoiceNo', width: 15},
            {header: 'Voucher No', key: 'voucherNo', width: 15},
            {header: 'Project Name', key: 'projectName', width: 35},
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

  // ----------Stage Select change Function------------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    getProjectReportListData(
      state.projectStatusData,
      parseInt(value),
      state.selStartDate,
      state.selEndDate,
      state.SearchText
    )
  }
  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(state.projectReportsData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectReportsmodel[] = state.projectReportsData.slice(
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
      getProjectReportListData(
        state.projectStatusData,
        state.selPmcWorkStageID,
        fmtMomentDate,
        state.selEndDate,
        state.SearchText
      )
    }
    setMainLoading(true)
  }

  // ============Start Date OnClick Function =========================
  const renderCustomStartInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a start date'
      value={startDay ? `${startDay.day}-${startDay.month}-${startDay.year}` : state.selStartDate}
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
      getProjectReportListData(
        state.projectStatusData,
        state.selPmcWorkStageID,
        state.selStartDate,
        fmtMomentDate,
        state.SearchText
      )
    }
    setMainLoading(true)
  }
  // ================ Reset Date Value ===========
  function ResetSelectedCalendarStartDate() {
    getProjectReportListData(
      state.projectStatusData,
      state.selPmcWorkStageID,
      '',
      state.selEndDate,
      state.SearchText
    )

    setStartDay(null)
    setEndDay(null)
  }
  // ------------------------------
  function ResetSelectedCalendarEndDate() {
    getProjectReportListData(
      state.projectStatusData,
      state.selPmcWorkStageID,
      state.selStartDate,
      '',
      state.SearchText
    )
    setStartDay(null)
    setEndDay(null)
  }
  //=================== End Date Input Function ===================================
  const renderCustomEndInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a end date'
      value={endDay ? `${endDay.day}-${endDay.month}-${endDay.year}` : state.selEndDate}
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProjectReportsData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.finalAmount.toString().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, projectReportsData: results})
      setTotal(results.length)
    } else {
      setState({...state, projectReportsData: state.tmpProjectReportsData})
      // If the text field is empty, show all users
      setTotal(state.tmpProjectReportsData.length)
    }

    setName(keyword)
  }

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
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-2 col-sm-6 px-1'>
            <label className='form-label fw-bold text-white'>Stage :</label>
            <div className='col-12 fv-row'>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='pmcWorkStageData'
              >
                <option selected={state.selPmcWorkStageID === 0 ? true : false} value={0}>
                  Stage Type
                </option>
                {state.projectStatusData.length > 0 &&
                  state.projectStatusData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.projectStatusID}
                        selected={data.projectStatusID == state.selPmcWorkStageID ? true : false}
                      >
                        {data.projectStatusName}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>
          <div className='mb-2 col-xl-3 col-sm-6 px-1'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
          </div>

          <div className='mb-2 col-xl-2 col-sm-6 px-1'>
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
                      style={{
                        border: '#0fbcf9',
                        color: '#fff',
                        backgroundColor: 'red',
                        borderRadius: '2rem',
                        padding: '1rem 2rem',
                        fontSize: 12,
                      }}
                      onClick={ResetSelectedCalendarStartDate}
                    >
                      Reset Value!
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
          {/* </div> */}

          <div className='ms- col-xl-2 col-sm-6 px-1'>
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
                      style={{
                        border: '#0fbcf9',
                        color: '#fff',
                        backgroundColor: 'red',
                        borderRadius: '2rem',
                        padding: '1rem 2rem',
                        fontSize: 12,
                      }}
                      onClick={ResetSelectedCalendarEndDate}
                    >
                      Reset Value!
                    </button>
                  </div>
                )}
              />
            </div>
          </div>

          <div className='col-2 text-end mt-7 px-1'>
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
          <div className='col-1 text-end mt-6'>
            <Link
              to={{
                pathname: `/account-reports/project-report/download`,
                state: {
                  pmcWorkStageID: state.selPmcWorkStageID,
                  startDate: state.selStartDate,
                  endDate: state.selEndDate,
                  searchText: name,
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

          {/* </div> */}
        </div>
        <div className='py-1'>
          <div className='card-header border-0 py-2 bg-success'>
            <div className='row mb-6'>
              <div className='col-lg-6'>
                <label className='fw-bolder fs-5'>No. Of Projects: &nbsp;</label>
                <span className='col-lg-8 fv-row text-white fw-bold fs-5'>
                  {state.selNoOfProjects}
                </span>
              </div>

              <div className='text-end col-lg-6'>
                <label className='fw-bolder fs-5'>Project Amount: &nbsp;</label>
                <span className='col-lg-8 fv-row text-white fw-bold fs-4'>
                  {state.selTotalProjectAmount}
                </span>
              </div>

              <div className='col-lg-6'>
                <label className='fw-bolder fs-5'>Addon Amount: &nbsp;</label>
                <span className='col-lg-8 fv-row text-white fw-bold fs-5'>
                  {state.selTotalAddonAmoun}
                </span>
              </div>

              <div className='text-end  col-lg-6'>
                <label className='fw-bolder fs-5'>Final Amount: &nbsp;</label>
                <span className='col-lg-8 fv-row text-white fw-bold fs-5'>
                  {state.selTotalFinalAmount}
                </span>
              </div>

              <div className='col-lg-6'>
                <label className='fw-bolder fs-5'>Paid Amount: &nbsp;</label>
                <span className='col-lg-8 fv-row text-white fw-bold fs-5'>
                  {state.selTotalPaidAmount}
                </span>
              </div>
              <div className='text-end col-lg-6'>
                <label className='fw-bolder fs-5'>Remaining Amount: &nbsp;</label>
                <span className='col-lg-8 fv-row text-white fw-bold fs-5'>
                  {state.selTotalRemainingAmount}
                </span>
              </div>
              {/* </div> */}
              {/* </div> */}
              {/* <div className='row mb-5'> */}
            </div>
            {/* </div> */}
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
                  <th className='min-w-125px ms-4'>Date</th>
                  <th className='min-w-125px '>Project Name</th>
                  <th className='min-w-125px '>Customer Name</th>
                  <th className='min-w-125px '>Project Amount</th>
                  <th className='min-w-125px '>Addition Amount</th>
                  <th className='min-w-125px '>Final Amount</th>
                  <th className='min-w-25px '>Remain Amount</th>
                  <th className='min-w-125px '>Balance</th>
                  <th className='min-w-125px'>Stage Name</th>
                  <th className='min-w-40px'>View</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.createDate}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span
                                className='text-dark text-hover-primary fs-6   cursor-pointer'
                                title='Click Hear'
                                onClick={() => handleShowProDtl(data.projectID)}
                              >
                                {data.projectName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.customerName}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.projectAmount}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.additionalAmount}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.finalAmount}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.paidAmount}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.remainingAmount}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.stageName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/account-reports/project-report/view/${data.projectID}`,
                              state: {
                                projectID: data.projectID,
                                customerName: data.customerName,
                                projectAmount: data.projectAmount,
                                paidAmount: data.paidAmount,
                                remainingAmount: data.remainingAmount,
                                pmcWorkStageID: state.selPmcWorkStageID,
                                startDate: state.selStartDate,
                                endDate: state.selEndDate,
                                searchText: name,
                              },
                            }}
                            className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
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
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
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
      {/* =====================Image Model=================== */}
    </>
  )
}

export default ProjectReportLIst
