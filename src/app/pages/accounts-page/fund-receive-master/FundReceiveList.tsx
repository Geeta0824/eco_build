import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import Search from 'antd/es/input/Search'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  DeleteProjectDataAPI,
  getGetProjectDetailsList_ByProjectIDAPI,
} from '../../../modules/project-master-page/project-master/ProjectCRUD'

import {
  IFundRecListModel,
  IFundReceiveModel,
  IProjectDropDwnModel,
} from '../../../models/Accounts-page/fund-receive/IFundReceiveModel'
import {
  DeleteFundReceive,
  getAllProjectDropDwnList,
  getExcelFundReceiveListFilterAPI,
  GetFundReceiveList,
  getFundReceiveListFilterAPI,
} from '../../../modules/account-page/fund-receive-master-page/FundReciveCRUD'
import {FundReceiveCard} from './FundReceiveCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import moment from 'moment'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
type Props = {}

interface IProject {
  loading: boolean
  fundReceiveData: IFundRecListModel[]
  tmpFundReceiveData: IFundRecListModel[]
  projectData: IProjectModel[]
  projectDropDwnData: IProjectDropDwnModel[]
  selProjectIfD: number
  activeID: number
  selProjectDwnID: number
  activeType: any
  imageShow: string
  mainSearch: string
  selStartTime: string
  selEndTime: string
}

const FundReceiveList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IProject>({
    loading: false,
    fundReceiveData: [] as IFundRecListModel[],
    tmpFundReceiveData: [] as IFundRecListModel[],
    projectData: [] as IProjectModel[],
    projectDropDwnData: [] as IProjectDropDwnModel[],
    selProjectIfD: 0,
    activeID: 0,
    selProjectDwnID: 0,
    activeType: false,
    imageShow: '',
    mainSearch: '',
    selStartTime: '',
    selEndTime: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      // let lc: any = location.state
      // console.log(lc)
      // var mainSearch: string = ''
      // if (lc != undefined) {
      //   mainSearch = lc.search
      // }

      // getAllProjectData(mainSearch)

      let lc: any = location.state
      console.log(lc)
      let ProjectFltrID: number = 0
      let StartTime: string = ''
      let EndTime: string = ''
      let SearchText: string = ''
      if (lc !== undefined) {
        ProjectFltrID = lc.mainProjectID
        StartTime = lc.mainStartTime
        EndTime = lc.mainEndTime
        SearchText = lc.mainSearch
      }
      getFundReceiveData(ProjectFltrID, StartTime, EndTime, SearchText)
    }, 100)
  }, [])

  // function getAllProjectData(mainSearch: string) {
  //   GetFundReceiveList()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess == true) {
  //         if (mainSearch !== '') {
  //           const results = responseData.filter((user: any) => {
  //             return (
  //               user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
  //               user.customeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
  //               user.amount.toString().includes(mainSearch.toString()) ||
  //               user.transactionMode.toLowerCase().includes(mainSearch.toLowerCase()) ||
  //               user.paymentDate.toLowerCase().includes(mainSearch.toLowerCase()) ||
  //               user.voucherNo.toLowerCase().includes(mainSearch.toLowerCase()) ||
  //               user.cashAccountName.toLowerCase().includes(mainSearch.toLowerCase())
  //             )
  //           })

  //           setState({
  //             ...state,
  //             fundReceiveData: results,
  //             tmpFundReceiveData: responseData,
  //             loading: false,
  //           })
  //           setTotal(results.length)
  //           setPage(1)
  //         } else {
  //           setState({
  //             ...state,
  //             fundReceiveData: responseData,
  //             tmpFundReceiveData: responseData,
  //             loading: false,
  //           })
  //           setTotal(responseData.length)
  //           setPage(1)
  //         }
  //         setName(mainSearch)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({
  //           ...state,
  //           fundReceiveData: [],
  //           tmpFundReceiveData: [],
  //           loading: false,
  //         })
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({
  //         ...state,
  //         fundReceiveData: [],
  //         tmpFundReceiveData: [],
  //         loading: false,
  //       })
  //     })
  // }

  function getFundReceiveData(
    ProjectID: number,
    StartTime: string,
    EndTime: string,
    SearchText: string
  ) {
    getFundReceiveListFilterAPI(ProjectID, SearchText, StartTime, EndTime)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getAllProjectDropDwnData(responseData, ProjectID, StartTime, EndTime, SearchText)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, fundReceiveData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getAllProjectDropDwnData(
    fundReceiveData: IFundRecListModel[],
    ProjectID: number,
    StartTime: string,
    EndTime: string,
    SearchText: string
  ) {
    getAllProjectDropDwnList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            fundReceiveData: fundReceiveData,
            tmpFundReceiveData: fundReceiveData,
            projectDropDwnData: responseData,
            selProjectDwnID: ProjectID,
            selStartTime: StartTime,
            selEndTime: EndTime,
            mainSearch: SearchText,
            loading: false,
          })
          setName(SearchText)
          setTotal(fundReceiveData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, fundReceiveData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectPaymentID: number) => {
    setState({
      ...state,
      selProjectIfD: projectPaymentID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(projectPaymentID: number) {
    DeleteFundReceive(projectPaymentID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getFundReceiveData(
            state.selProjectDwnID,
            state.selStartTime,
            state.selEndTime,
            state.mainSearch
          )
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
    getFundReceiveData(parseInt(value), state.selStartTime, state.selEndTime, state.mainSearch)
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
      getFundReceiveData(state.selProjectDwnID, fmtMomentDate, state.selEndTime, state.mainSearch)
    }
    setMainLoading(true)
  }
  function resetStartDay() {
    setMainLoading(true)
    setName('')
    setStartDay(null)
    getFundReceiveData(state.selProjectDwnID, '', state.selEndTime, state.mainSearch)
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
      getFundReceiveData(state.selProjectDwnID, state.selStartTime, fmtMomentDate, state.mainSearch)
    }
    setMainLoading(true)
  }
  function resetEndDay() {
    setMainLoading(true)
    setName('')
    setEndDay(null)
    getFundReceiveData(state.selProjectDwnID, state.selStartTime, '', state.mainSearch)
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

  // ------------------------------reset button---------------------
  function resetFilter() {
    getFundReceiveData(0, '', '', '')
    setName('')
    setStartDay(null)
    setEndDay(null)
  }

  // ---------------------------------- Excel File ------------------------------------------------
  function exportExcelData() {
    getExcelFundReceiveListFilterAPI(
      state.selProjectDwnID,
      state.selStartTime,
      state.selEndTime,
      state.mainSearch
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          //  console.log(responseData)
          setState({
            ...state,
            loading: false,
          })
          // const worksheet = XLSX.utils.json_to_sheet(responseData)
          // const workbook = XLSX.utils.book_new()
          // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
          // XLSX.writeFile(workbook, `Fund_Receive_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`)

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('FundReceive_Report')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Payment Date', key: 'paymentDate', width: 13},
            {header: 'Voucher No', key: 'voucherNo', width: 13},
            {header: 'Project Name', key: 'projectName', width: 30},
            {header: 'Customer Name', key: 'customerName', width: 20},
            {header: 'Amount', key: 'amount', width: 10},
            {header: 'Transaction Mode', key: 'transactionMode', width: 16},
            {header: 'Cash Account Name', key: 'cashAccountName', width: 20},
            {header: 'Project Invoice No', key: 'projectInvoiceNo', width: 18},
            {header: 'File Path', key: 'filePath', width: 55},
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
              projectName: item.projectName,
              customerName: item.customeName,
              amount: item.amount,
              transactionMode: item.transactionMode,
              cashAccountName: item.cashAccountName,
              projectInvoiceNo: item.projectInvoiceNo,
              filePath: item.filePath,
            })
          })
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `_FundReceive_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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
  // ================= SerchText Function ===========
  const [name, setName] = useState('')
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getFundReceiveData(state.selProjectDwnID, state.selStartTime, state.selEndTime, keyword)
    } else {
      getFundReceiveData(state.selProjectDwnID, state.selStartTime, state.selEndTime, '')
    }
  }

  //------------------- the search result-----------------
  // const filter = (e: any) => {
  //   const keyword = e.target.value

  //   if (keyword !== '') {
  //     const results = state.tmpFundReceiveData.filter((user) => {
  //       return (
  //         user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
  //         user.customeName.toLowerCase().includes(keyword.toLowerCase()) ||
  //         user.amount.toString().includes(keyword.toString()) ||
  //         user.transactionMode.toLowerCase().includes(keyword.toLowerCase()) ||
  //         user.paymentDate.toLowerCase().includes(keyword.toLowerCase()) ||
  //         user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
  //         user.cashAccountName.toLowerCase().includes(keyword.toLowerCase())
  //       )
  //     })
  //     setState({...state, fundReceiveData: results})
  //     setTotal(results.length)
  //     setPage(1)
  //   } else {
  //     setState({...state, fundReceiveData: state.tmpFundReceiveData})
  //     // If the text field is empty, show all users
  //     setTotal(state.tmpFundReceiveData.length)
  //     setPage(1)
  //   }

  //   setName(keyword)
  // }

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
  const currentPosts: IFundRecListModel[] = state.fundReceiveData.slice(
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
        {/* begin::Header */}
        {/* <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/accounts/fundreceive/add'}
          title='Click to add a Fund Receive '
        /> */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-4 col-sm-6 ps-0'>
            <label className='form-label fw-bold text-white'>Project:</label>
            <select
              className='form-select lineHeightByD'
              aria-label='Default select example'
              onChange={selectChange}
              id='ProjectFltrID'
              value={state.selProjectDwnID}
            >
              <option selected={state.selProjectDwnID === 0 ? true : false} value={0}>
                Select Project
              </option>
              {state.projectDropDwnData.length > 0 &&
                state.projectDropDwnData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.projectID}
                      selected={data.projectID == state.selProjectDwnID ? true : false}
                    >
                      {data.projectName}
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
                pathname: '/accounts/fundreceive/add',
                state: {
                  ProjectID: state.selProjectDwnID,
                  StartDate: state.selStartTime,
                  EndTime: state.selEndTime,
                  SearchText: state.mainSearch,
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
                pathname: `/accounts/fundreceive/download`,
                state: {
                  ProjectID: state.selProjectDwnID,
                  StartDate: state.selStartTime,
                  EndTime: state.selEndTime,
                  SearchText: state.mainSearch,
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
                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Transction Mode</span>
                  </th>

                  <th className='min-w-150px'>
                    <span className='d-block mb-7'>Cash Account</span>
                  </th>
                  <th className='min-w-25px text-left'>Download</th>
                  <th className='w-125px'>Create By</th>
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
                          <FundReceiveCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.filePath)}
                            handleShow={() => handleShow(data.projectPaymentID)}
                            handleShowProDtl={() => handleShowProDtl(data.projectID)}
                            ProjectID={state.selProjectDwnID}
                            StartDate={state.selStartTime}
                            EndTime={state.selEndTime}
                            SearchText={state.mainSearch}
                            EmployeeID={user.employeeID}
                          />
                          // <tr key={index}>
                          //   <td>
                          //     <div className='d-flex align-items-center'>
                          //       <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //         <span className='text-dark text-hover-primary fs-5'>
                          //           {data.paymentDate}
                          //         </span>
                          //         <span className='text-muted d-block fs-7 mt-1'>
                          //           {data.voucherNo}
                          //         </span>
                          //       </div>
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.projectName}
                          //     </span>
                          //     <span className='text-muted d-block fs-7'>{data.customeName}</span>
                          //   </td>
                          //   <td>
                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.amount}
                          //     </span>
                          //     <span className='text-muted d-block fs-7'>
                          //       {data.transactionMode}
                          //     </span>
                          //   </td>

                          //   <td>
                          //     {/* <span className='text-dark text-hover-primary d-block mb-1 fs-6'>

                          //   </span> */}

                          //     <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //       {data.cashAccountName}
                          //     </span>
                          //   </td>
                          //   <td className='text-center'>
                          //     {data.filePath === '' ? (
                          //       <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                          //         N.A
                          //       </span>
                          //     ) : (
                          //       <span
                          //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
                          //         title='Download'
                          //         onClick={() => downloadQuotationFile(data.filePath)}
                          //       >
                          //         <KTSVG
                          //           path='/media/icons/duotune/files/fil017.svg'
                          //           className='svg-icon-fluid svg-icon-primary'
                          //         />
                          //       </span>
                          //     )}
                          //   </td>
                          //   <td>
                          //     <div className='d-flex justify-content-end flex-shrink-0'>
                          //       <Link
                          //         to={{
                          //           pathname: `/accounts/fundreceive/edit/${data.projectPaymentID}`,
                          //           // state: {
                          //           //   projName: data.projectName,
                          //           //   projectID: data.projectID,
                          //           // },
                          //         }}
                          //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                          //       >
                          //         <KTSVG
                          //           path='/media/icons/duotune/art/art005.svg'
                          //           className='svg-icon-3 svg-icon-primary'
                          //         />
                          //       </Link>
                          //       <div
                          //         onClick={() => handleShow(data.projectPaymentID)}
                          //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                          //       >
                          //         <KTSVG
                          //           path='/media/icons/duotune/general/gen027.svg'
                          //           className='ssvg-icon-3 svg-icon-danger'
                          //         />
                          //       </div>
                          //     </div>
                          //   </td>
                          // </tr>
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
        id={state.selProjectIfD}
        pageName={'Fund Receive'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.selProjectIfD)}
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

export default FundReceiveList
