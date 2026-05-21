import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {Button, Modal} from 'react-bootstrap-v5'
import ExcelJS from 'exceljs'
import * as XLSX from 'xlsx'
import Search from 'antd/es/input/Search'
import {toast} from 'react-toastify'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IPurchaseAccountListModel} from '../../../models/Accounts-page/purchase-account-page/IPurchaseAccountModel'
import {
  deletePurchaseAccountDetails,
  getPurchaseAccountList,
  getPurchaseAccountListFilter,
  getPurchaseAccountList_Excel,
} from '../../../modules/account-page/purchase-account-master-page/PurchaseAccountCRUD'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {KTSVG} from '../../../../_Ecd/helpers'
import {getVenderWebList} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import moment from 'moment'

type Props = {}

interface IDesignation {
  loading: boolean
  purchaseActData: IPurchaseAccountListModel[]
  tmpPurchaseActData: IPurchaseAccountListModel[]
  vendorData: IVenderModel[]
  temVendorData: IVenderModel[]
  VendorID: number
  selPurchaseActID: number
  activeType: any
  CompanyName: string
  SearchText: string
  StartDate: string
  EndDate: string
}

const PurchaseReportList: React.FC<Props> = () => {
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IDesignation>({
    loading: false,
    purchaseActData: [] as IPurchaseAccountListModel[],
    tmpPurchaseActData: [] as IPurchaseAccountListModel[],
    vendorData: [] as IVenderModel[],
    temVendorData: [] as IVenderModel[],
    selPurchaseActID: 0,
    VendorID: 0,
    activeType: false,
    CompanyName: '',
    SearchText: '',
    StartDate: '',
    EndDate: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let VendorID: number = 0
      let StartDate: string = ''
      let EndDate: string = ''
      let SearchText: string = ''
      let VendorName: string = ''
      if (lc != undefined) {
        VendorID = lc.VendorID
        StartDate = lc.StartDate
        EndDate = lc.EndDate
        SearchText = lc.SearchText
        VendorName = lc.VendorName
      }
      getPurchaseAccountData(
        // state.VendorID,
        // state.StartDate,
        // state.EndDate,
        // state.SearchText,
        // state.CompanyName
        VendorID,
        StartDate,
        EndDate,
        SearchText,
        VendorName
      )
    }, 100)
  }, [])

  function getPurchaseAccountData(
    VendorID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string,
    CompanyName: string
  ) {
    getPurchaseAccountListFilter(VendorID, StartDate, EndDate, SearchText)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getVenderData(responseData, VendorID, StartDate, EndDate, SearchText, CompanyName)
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, purchaseActData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getVenderData(
    purchaseActData: IPurchaseAccountListModel[],
    VendorID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string,
    CompanyName: string
  ) {
    getVenderWebList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (SearchText !== '') {
            const results = purchaseActData.filter((user) => {
              //  console.log(user)
              return (
                user.vendorName.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.purchaseDate.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.cashAccountName.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.totalAmount.toString().includes(SearchText.toLowerCase()) ||
                user.paidAmount.toString().includes(SearchText.toLowerCase()) ||
                user.remainingAmount.toString().includes(SearchText.toLowerCase()) ||
                user.voucherNo.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.cashAccountName.toLowerCase().includes(SearchText.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              purchaseActData: results,
              vendorData: responseData,
              temVendorData: responseData,
              tmpPurchaseActData: purchaseActData,
              VendorID: VendorID,
              StartDate: StartDate,
              EndDate: EndDate,
              SearchText: SearchText,
              CompanyName: CompanyName,
              loading: false,
            })
            setTotal(results.length)
          } else {
            setState({
              ...state,
              vendorData: responseData,
              temVendorData: responseData,
              purchaseActData: purchaseActData,
              tmpPurchaseActData: purchaseActData,
              VendorID: VendorID,
              StartDate: StartDate,
              EndDate: EndDate,
              SearchText: SearchText,
              CompanyName: CompanyName,
              loading: false,
            })
            setTotal(purchaseActData.length)
            setPage(1)
          }
          setName(SearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }
  function handleShowVendor() {
    setShowVendor(true)
  }

  function selectVendor(tmpVendortData: IVenderModel) {
    let CompanyName = tmpVendortData.companyName
    getPurchaseAccountData(
      tmpVendortData.vendorID,
      state.StartDate,
      state.EndDate,
      state.SearchText,
      CompanyName
    )
    setShowVendor(false)
  }

  //   ------View on other tab --------------
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

  //------------------- the value of the search field----------------
  // ================= SerchText Function ===================
  const [name, setName] = useState<string>('')

  //------------------- the search result-----------------
  const searchFilter = (e: any) => {
    const keyword = e
    // setMainLoading(true)
    if (keyword !== '') {
      getPurchaseAccountData(
        state.VendorID,
        state.StartDate,
        state.EndDate,
        keyword,
        state.CompanyName
      )
    } else {
      getPurchaseAccountData(state.VendorID, state.StartDate, state.EndDate, '', state.CompanyName)
    }

    setName(keyword)
  }

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpPurchaseActData.filter((user) => {
        //  console.log(user)
        return (
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.purchaseDate.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.totalAmount.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.remainingAmount.toString().includes(keyword.toLowerCase()) ||
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, purchaseActData: results})
      setTotal(results.length)
    } else {
      setState({...state, purchaseActData: state.tmpPurchaseActData})
      // If the text field is empty, show all users
      setTotal(state.tmpPurchaseActData.length)
      setPage(1)
    }

    setName(keyword)
  }
  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.purchaseActData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IPurchaseAccountListModel[] = state.purchaseActData.slice(
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
      getPurchaseAccountData(
        state.VendorID,
        fmtMomentDate,
        state.EndDate,
        state.SearchText,
        state.CompanyName
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
      value={startDay ? `${startDay.day}-${startDay.month}-${startDay.year}` : state.StartDate}
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
      getPurchaseAccountData(
        state.VendorID,
        state.StartDate,
        fmtMomentDate,
        state.SearchText,
        state.CompanyName
      )
    }
    setMainLoading(true)
  }

  //=================== End Date Input Function ===================================
  const renderCustomEndInput = ({ref}: any) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder='Select a end date'
      value={endDay ? `${endDay.day}-${endDay.month}-${endDay.year}` : state.EndDate}
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

  function exportExcelData() {
    getPurchaseAccountList_Excel(state.VendorID, state.StartDate, state.EndDate, state.SearchText)
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
          // XLSX.writeFile(workbook, `Purchase_Report${moment(new Date()).format('YYYYMMDD')}.xlsx`)

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('PurchaseReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Voucher No', key: 'voucherNo', width: 15},
            {header: 'Purchase Date', key: 'purchaseDate', width: 15},
            {header: 'Vendor Name', key: 'vendorName', width: 20},
            {header: 'Vendor Type Name', key: 'vendorTypeName', width: 20},
            {header: 'Total Amount', key: 'totalAmount', width: 15},
            {header: 'Remaining Amount', key: 'remainingAmount', width: 20},
            {header: 'Paid Amount', key: 'paidAmount', width: 15},
            {header: 'Item Descr', key: 'itemDescr', width: 25},
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
              voucherNo: item.voucherNo,
              purchaseDate: item.purchaseDate,
              vendorName: item.vendorName,
              vendorTypeName: item.vendorTypeName,
              totalAmount: item.totalAmount,
              remainingAmount: item.remainingAmount,
              paidAmount: item.paidAmount,
              itemDescr: item.itemDescr,
            })
          })

          // Write to Excel file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `Purchase_Report${moment(new Date()).format('YYYYMMDD')}.xlsx`
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
  function ResetSelectedCalendarEndDate() {
    getPurchaseAccountData(state.VendorID, state.StartDate, '', state.SearchText, state.CompanyName)
    setEndDay(null)
    setStartDay(null)
  }
  function ResetSelectedCalendarStartDate() {
    getPurchaseAccountData(state.VendorID, '', state.EndDate, state.SearchText, state.CompanyName)
    setEndDay(null)
    setStartDay(null)
  }
  // ------------------------------reset button---------------------
  function resetFilter() {
    getPurchaseAccountData(0, '', '', '', '')
    setName('')
    setStartDay(null)
    setEndDay(null)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='d-flex'>
            <label className='text-white me-5 fs-5 mt-10'>Select Vendor :</label>
            <span className='mt-10 fw-bold text-primary d-flex align-item-center fs-5'>
              {state.CompanyName}
            </span>
            <div className='fv-row mt-8'>
              <div
                className='btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 p-5 ms-6'
                onClick={handleShowVendor}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen004.svg'
                  className='svg-icon-2 svg-icon-white'
                />
              </div>
            </div>
          </div>

          <div className='mb-2 col-xl-3 col-sm-6 px-1'>
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
                      onClick={ResetSelectedCalendarStartDate}
                      style={{
                        border: '#0fbcf9',
                        color: '#fff',
                        backgroundColor: 'red',
                        borderRadius: '2rem',
                        padding: '1rem 2rem',
                        fontSize: 12,
                      }}
                    >
                      Reset Value!
                    </button>
                  </div>
                )}
              />
            </div>
          </div>

          <div className='col-xl-3 col-sm-6 px-1'>
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
                      onClick={ResetSelectedCalendarEndDate}
                      style={{
                        border: '#0fbcf9',
                        color: '#fff',
                        backgroundColor: 'red',
                        borderRadius: '2rem',
                        padding: '1rem 2rem',
                        fontSize: 12,
                      }}
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

          <div className='mb-3 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value: any) => searchFilter(value)}
            />
          </div>
          <div className='mt-4 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div>
          <div className='col-1 mt-6'>
            <Link
              to={{
                pathname: `/account-reports/purchase/download`,
                state: {
                  VendorID: state.VendorID,
                  StartDate: state.StartDate,
                  EndDate: state.EndDate,
                  SearchText: name,
                  VendorName: state.CompanyName,
                },
              }}
              className='symbol symbol-40px cursor-pointer d-block justify-content-center text-center'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='View PDF'
            >
              <img src={'/media/img/download.png'} alt='' />
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
                  <th className='min-w-100px'>PO Date</th>
                  <th className='min-w-100px'>PO Number</th>
                  <th className='min-w-100px'>Vendor Name</th>
                  <th className='min-w-100px'>Amount</th>
                  <th className='min-w-100px'>Paid Amount</th>
                  <th className='min-w-100px'>Remain Amount</th>
                  <th className='min-w-100px'>View</th>
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
                                    {data.purchaseDate}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.voucherNo}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.vendorName}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.totalAmount}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.paidAmount}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.remainingAmount}
                              </span>
                            </td>
                            <td className='text-center'>
                              <td className='text-center'>
                                <Link
                                  to={{
                                    pathname: `/account-reports/purchase/view`,
                                    state: {
                                      purchaseID: data.purchaseID,
                                      purchaseDate: data.purchaseDate,
                                      voucherNo: data.voucherNo,
                                      vendorName: data.vendorName,
                                      totalAmount: data.totalAmount,
                                      paidAmount: data.paidAmount,
                                      remainingAmount: data.remainingAmount,
                                      VendorID: state.VendorID,
                                      StartDate: state.StartDate,
                                      EndDate: state.EndDate,
                                      SearchText: name,
                                      VendorName: state.CompanyName,
                                    },
                                  }}
                                  className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-success btn-sm me-1 text-primary text-hover-light'
                                  data-bs-toggle='tooltip'
                                  data-bs-placement='top'
                                  title='View'
                                >
                                  <span className='fa fa-eye fs-2'></span>
                                </Link>
                              </td>
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
      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
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
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Vendor Type Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Company Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.vendorData.length > 0 &&
                    state.vendorData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            data.vendorTypeID === 1
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary'
                          }
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {data.vendorTypeID === 2 ? (
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary fs-6'>
                                  {data.companyName}
                                </div>
                              </div>
                            ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )}
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={state.vendorData.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseVendor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PurchaseReportList
