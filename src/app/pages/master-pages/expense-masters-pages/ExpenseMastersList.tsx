import React, {useEffect, useState} from 'react'
import {Button, Modal, PaginationProps} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  deleteExpenseMastersData,
  getExpenseMastersList,
  getExpenseReportByFilter,
} from '../../../modules/master-page/expense-masters-page/ExpenseMasterCRUD'
import {IExpenseMastersModel} from '../../../models/master-page/IExpenseMastersMode'
import {ExpenseMastersCard} from './ExpenseMastersCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import moment from 'moment'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import Search from 'antd/es/input/Search'
import {IExpenseModel} from '../../../models/master-page/IExpenseTypeMode'
import {getExpenseTypeList} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

interface IExpenseMaster {
  loading: boolean
  expenseMasterData: IExpenseMastersModel[]
  tmpExpenseMasterData: IExpenseMastersModel[]
  expenseData: IExpenseModel[]
  PDFShow: string
  SearchText: string
  selExpMstID: number
  activeID: number
  activeType: any
  pathUrl: any
  expenseTypeID: number
  selStartTime: string
  selEndTime: string
  selExpenseTypeID: number
}

type Props = {}

const ExpenseMastersList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IExpenseMaster>({
    loading: false,
    expenseMasterData: [] as IExpenseMastersModel[],
    tmpExpenseMasterData: [] as IExpenseMastersModel[],
    expenseData: [] as IExpenseModel[],
    PDFShow: '',
    SearchText: '',
    selExpMstID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    expenseTypeID: 0,
    selStartTime: '',
    selEndTime: '',
    selExpenseTypeID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let selExpenseTypeID: number = 0
      let StartDate: string = ''
      let EndDate: string = ''
      let SearchText: string = ''
      if (lc != undefined) {
        selExpenseTypeID = lc.expenseTypeID
        StartDate = lc.startDate
        EndDate = lc.endDate
        SearchText = lc.search
      }
      getExpenseMasterData(selExpenseTypeID, StartDate, EndDate, SearchText)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getExpenseMasterData(
    ExpenseTypeID: number,
    StartTime: string,
    EndTime: string,
    SearchText: string
  ) {
    getExpenseReportByFilter(ExpenseTypeID, SearchText, StartTime, EndTime)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getExpenseTypeData(ExpenseTypeID, StartTime, EndTime, SearchText, responseData)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseMasterData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, expenseMasterData: [], loading: false})
      })
  }

  function getExpenseTypeData(
    ExpenseTypeID: number,
    StartTime: string,
    EndTime: string,
    SearchText: string,
    expenseMasterData: IExpenseMastersModel[]
  ) {
    getExpenseTypeList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (SearchText !== '') {
            const results = expenseMasterData.filter((user) => {
              return (
                user.voucherNo.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.amount.toString().includes(SearchText.toLowerCase()) ||
                user.title.toLowerCase().includes(SearchText.toLowerCase()) ||
                user.expenseTypeName.toLowerCase().includes(SearchText.toLowerCase())
              )
            })
            setState({
              ...state,
              expenseData: responseData,
              expenseMasterData: results,
              tmpExpenseMasterData: expenseMasterData,
              selExpenseTypeID: ExpenseTypeID,
              selStartTime: StartTime,
              selEndTime: EndTime,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              expenseData: responseData,
              expenseMasterData: expenseMasterData,
              tmpExpenseMasterData: expenseMasterData,
              selExpenseTypeID: ExpenseTypeID,
              selStartTime: StartTime,
              selEndTime: EndTime,
              loading: false,
            })
            setTotal(expenseMasterData.length)
            setPage(1)
          }
          setName(SearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, expenseData: [], loading: false})
      })
  }
  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (expenseMastersID: number) => {
    setState({
      ...state,
      selExpMstID: expenseMastersID,
      loading: false,
    })
    setShow(true)
  }

  const deleteCounteyItem = (expmstID: number) => {
    deleteExpenseMastersData(expmstID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getExpenseMasterData(
            state.selExpenseTypeID,
            state.selStartTime,
            state.selEndTime,
            state.SearchText
          )
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
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

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  //------------------- the value of the search field----------------
  // const [name, setName] = useState<string>('')
  // const searchFilter = (value: string) => {
  //   const keyword = value
  //   if (keyword !== '') {
  //     getExpenseMasterData(state.selExpenseTypeID, state.selStartTime, state.selEndTime,keyword)
  //   } else {
  //     getExpenseMasterData(state.selExpenseTypeID, state.selStartTime, state.selEndTime,'')
  //   }
  // }

  // ------------------------------reset button---------------------
  function resetFilter() {
    getExpenseMasterData(0, '', '', '')
    setName('')
    setStartDay(null)
    setEndDay(null)
  }

  // ----------Stage Select change Function------------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    getExpenseMasterData(parseInt(value), state.selStartTime, state.selEndTime, state.SearchText)
  }

  // ================= SerchText Function ===========
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpExpenseMasterData.filter((user) => {
        return (
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amount.toString().includes(keyword.toLowerCase()) ||
          user.title.toLowerCase().includes(keyword.toLowerCase()) ||
          user.expenseTypeName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, expenseMasterData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, expenseMasterData: state.tmpExpenseMasterData})
      // If the text field is empty, show all users
      setTotal(state.tmpExpenseMasterData.length)
      setPage(1)
    }

    setName(keyword)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IExpenseMastersModel[] = state.expenseMasterData.slice(
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
        state.selExpenseTypeID,
        fmtMomentDate,
        state.selEndTime,
        state.SearchText
      )
    }
    setMainLoading(true)
  }
  function resetStartDate() {
    setMainLoading(true)
    setName('')
    setStartDay(null)
    getExpenseMasterData(state.selExpenseTypeID, '', state.selEndTime, state.SearchText)
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
      getExpenseMasterData(
        state.selExpenseTypeID,
        state.selStartTime,
        fmtMomentDate,
        state.SearchText
      )
    }
    setMainLoading(true)
  }
  function resetEndDate() {
    setMainLoading(true)
    setName('')
    setEndDay(null)
    getExpenseMasterData(state.selExpenseTypeID, state.selStartTime, '', state.SearchText)
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

  return (
    <>
      <div className={`card `}>
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-4 col-sm-6 ps-0'>
            <label className='form-label fw-bold text-white'>Expense Type:</label>
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
                      selected={data.expenseTypeID === state.selExpenseTypeID ? true : false}
                    >
                      {data.expenseTypeName}
                    </option>
                  )
                })}
            </select>
          </div>
          <div className='mb-2 col-xl-3 col-sm-5 ps-0'>
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
                      onClick={resetStartDate}
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

          <div className='mb-2 col-xl-3 col-sm-5 ps-0'>
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
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a Expense Masters'
          >
            <Link
              to={{
                pathname: '/accounts/expenseMasters/add',
                state: {
                  searchText: name,
                  expenseTypeID: state.selExpenseTypeID,
                  startDate: state.selStartTime,
                  endDate: state.selEndTime,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white mt-5'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
          <div className='mt-2 col-xl-4 col-sm-6 ps-0'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                name='search'
                placeholder='Search'
                onChange={(e) => filter(e)}
                value={name}
              />
            </span>
          </div>
          {/* <div className='mb-3 col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear
              onChange={(e) => setName(e.target.value)}
              onSearch={(value: any) => searchFilter(value)}
            />
          </div> */}
          <div className=' mt-2 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div>
          <div className='col-1 text-end mt-2'>
            <Link
              to={{
                pathname: `/accounts/expenseMasters/download`,
                state: {
                  ExpenseTypeID: state.selExpenseTypeID,
                  StartDate: state.selStartTime,
                  EndTime: state.selEndTime,
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
                  <th className='w-150px'>Create By</th>
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
                          <ExpenseMastersCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.documentPath)}
                            handleShow={() => handleShow(data.expenseMastersID)}
                            expenseTypeID={state.selExpenseTypeID}
                            startDate={state.selStartTime}
                            endDate={state.selEndTime}
                            name={name}
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
      <ModelPopUpDelete
        id={state.selExpMstID}
        pageName={'Expense Masters'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCounteyItem(state.selExpMstID)}
      />

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

export default ExpenseMastersList
