import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {getProjectListByProjVendorIdApi} from '../../../modules/accounts-reports/vendor-report-master/VendortReportCRUD'
import {
  IProjListVendorProjReportModel,
  IVendorReportModel,
} from '../../../models/accounts-reports/IVendorReportModel'
import moment from 'moment'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'

type Props = {}

interface IDesignation {
  loading: boolean
  vendorReportVeiwData: IProjListVendorProjReportModel[]
  tmpVendorReportVeiwData: IProjListVendorProjReportModel[]
  SearchText: string
  projectData: IVendorReportModel
  vendorID: number
  companyName: string
  contactPerson: string
  vendorCost: number
  paidAmount: number
  remainingAmount: number
  startDate: string
  endDate: string
}

const VendorReportView: React.FC<Props> = () => {
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    vendorReportVeiwData: [] as IProjListVendorProjReportModel[],
    tmpVendorReportVeiwData: [] as IProjListVendorProjReportModel[],
    SearchText: '',
    projectData: {} as IVendorReportModel,
    vendorID: 0,
    companyName: '',
    contactPerson: '',
    vendorCost: 0,
    paidAmount: 0,
    remainingAmount: 0,
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    let lc: any = location.state
    let project = lc.projectData
    let vendorID = lc.vendorID
    let companyName = lc.companyName
    let contactPerson = lc.contactPerson
    let vendorCost = lc.vendorCost
    let paidAmount = lc.paidAmount
    let remainingAmount = lc.remainingAmount

    setState({...state, loading: true})
    setTimeout(() => {
      getVenderData(
        project,
        vendorID,
        state.startDate,
        state.endDate,
        companyName,
        contactPerson,
        vendorCost,
        paidAmount,
        remainingAmount
      )
    }, 100)
  }, [])

  function getVenderData(
    projectData: IVendorReportModel,
    vendorID: number,
    startDate: string,
    endDate: string,
    companyName: string,
    contactPerson: string,
    vendorCost: number,
    paidAmount: number,
    remainingAmount: number
  ) {
    getProjectListByProjVendorIdApi(projectData.projectID, vendorID, startDate, endDate)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorReportVeiwData: responseData,
            tmpVendorReportVeiwData: responseData,
            companyName: companyName,
            contactPerson: contactPerson,
            projectData: projectData,
            vendorCost: vendorCost,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount,
            vendorID: vendorID,
            loading: false,
            startDate: startDate,
            endDate: endDate,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, vendorReportVeiwData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjListVendorProjReportModel[] = state.vendorReportVeiwData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
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
      getVenderData(
        state.projectData,
        state.vendorID,
        fmtMomentDate,
        state.endDate,
        state.companyName,
        state.contactPerson,
        state.vendorCost,
        state.paidAmount,
        state.remainingAmount
      )
    }
    setMainLoading(true)
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
        outline: 'none',
      }}
      className='my-custom-input-class'
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
      getVenderData(
        state.projectData,
        state.vendorID,
        state.startDate,
        fmtMomentDate,
        state.companyName,
        state.contactPerson,
        state.vendorCost,
        state.paidAmount,
        state.remainingAmount
      )
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
      <div className='text-end'>
        <Link
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          to={{pathname: '/account-reports/vendor/list', state: {vendorID: state.vendorID}}}
        >
          Back To List
        </Link>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='d-flex' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 py-2 row gx-xl-8 gx-sm-5 p-3'>
            {/* <div className='d-block '> */}
            <div className='d-flex'>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Vendor Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.companyName}
                </div>
              </div>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Contact Person : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.contactPerson}
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Project Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.projectName}
                </div>
              </div>
              <div className='col-lg-6 text-white cursor-pointer fs-6 d-flex'>
                Customer Name : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.projectData.customerName}
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Vendor Cost : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.vendorCost}
                </div>
              </div>
              <div className='col-lg-4 text-white cursor-pointer fs-6 d-flex'>
                Paid Amount : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.paidAmount}
                </div>
              </div>
              <div className='col-lg-5 text-white cursor-pointer fs-6 d-flex'>
                Remaining Amount : &nbsp;
                <div className='text-primary text-hover-danger cursor-pointer fs-6'>
                  {state.remainingAmount}
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
          <div className='mb-2 col-xl-2 col-sm-3'>
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
                      onClick={() => {
                        setSelectedCalendarStartDate(null)
                      }}
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
            <label className='form-label fw-bold text-white mb-1'>End Date :</label>
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
                      onClick={() => {
                        // setStartDay(null)
                        setSelectedCalendarEndDate(null)
                      }}
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
          <div className='flex-shrink-1 p-2 text-center' style={{backgroundColor: '#000000'}}>
            <div className='justify-content-center text-center my-5'>
              <Link
                to={{
                  pathname: `/account-reports/vendor/download-view/${state.vendorID}`,
                  state: {
                    projectID: state.projectData.projectID,
                    projectName: state.projectData.projectName,
                  },
                }}
                className='symbol symbol-30px cursor-pointer d-block justify-content-center text-center'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='View PDF'
              >
                <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
              </Link>
            </div>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className=''>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-6'>
                  <th className='min-w-150px'>Payment</th>
                  <th className='min-w-150px'>Vouchar No.</th>
                  <th className='min-w-150px'>Sub Total</th>
                  <th className='min-w-150px'>Transction Mode</th>
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
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.paymentDate}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.voucherNo}
                              </span>
                            </td>

                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.amount}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary mb-1 fs-6'>
                                {data.transactionMode}
                              </span>
                            </td>

                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  <span className='text-dark text-hover-primary fs-5'>
                                    {data.isGST === true ? 'Yes' : 'No'}
                                  </span>
                                  {data.isGST === true && data.gstTypeID === 1 ? (
                                    <span className='text-muted d-block fs-7 mt-1'>
                                      {data.gstAmount}&nbsp;{'('}
                                      {data.totalGstPer + '%'}
                                      {')'}
                                    </span>
                                  ) : data.isGST === true && data.gstTypeID === 2 ? (
                                    <span className='text-muted d-block fs-7 mt-1'>
                                      {data.gstAmount}&nbsp;{'('}
                                      {data.igstPer + '%'}
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
                                    {data.isTDSDeducted === true ? 'Yes' : 'No'}
                                  </span>
                                  {data.isTDSDeducted === true ? (
                                    <span className='text-muted d-block fs-7 mt-1'>
                                      {data.tdsAmount}&nbsp;{'('}
                                      {data.tdsPercentage + '%'}
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

export default VendorReportView
