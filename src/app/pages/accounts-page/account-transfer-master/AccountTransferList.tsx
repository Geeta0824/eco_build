import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IAccountTransferModel} from '../../../models/Accounts-page/account-transfer-page/IAccountTreansfer'
import {
  DeleteAccountTransfer,
  getAccountTransferListFilter,
} from '../../../modules/account-page/account-transfer-master-page/AccountTransferCRUD'
import {toast} from 'react-toastify'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {AccountTransferCard} from './AccountTransferCard'
import moment from 'moment'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import DatePicker, {DayValue, utils} from 'react-modern-calendar-datepicker'
import Search from 'antd/es/input/Search'

type Props = {}

interface IDesignation {
  loading: boolean
  accountTransferData: IAccountTransferModel[]
  temAccountTransferData: IAccountTransferModel[]
  cashAccountData: ICashAccountModel[]
  SearchText: string
  selAccoTransferID: number
  deleteBy: number
  activeID: number
  activeType: any
  vendorTypeID: number
  selFromCashAccountID: number
  selToCashAccountID: number
  selStartDate: string
  selEndDate: string
}

const AccountTransferList: React.FC<Props> = () => {
  const location = useLocation()
  const [startDay, setStartDay] = React.useState<DayValue>(null)
  const [endDay, setEndDay] = React.useState<DayValue>(null)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IDesignation>({
    loading: false,
    accountTransferData: [] as IAccountTransferModel[],
    temAccountTransferData: [] as IAccountTransferModel[],
    cashAccountData: [] as ICashAccountModel[],
    SearchText: '',
    vendorTypeID: 0,
    selFromCashAccountID: 0,
    selToCashAccountID: 0,
    selAccoTransferID: 0,
    deleteBy: 0,
    activeID: 0,
    activeType: false,
    selStartDate: '',
    selEndDate: '',
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let selFromCashAccountID: number = 0
      let selToCashAccountID: number = 0
      let StartDate: string = ''
      let EndDate: string = ''
      let SearchText: string = ''
      if (lc != undefined) {
        selFromCashAccountID = lc.selFromCashAccountID
        selToCashAccountID = lc.selToCashAccountID
        StartDate = lc.StartDate
        EndDate = lc.EndDate
        SearchText = lc.search
      }
      getAcoountTransferData(
        selFromCashAccountID,
        selToCashAccountID,
        StartDate,
        EndDate,
        SearchText
      )
    }, 100)
  }, [])

  function getAcoountTransferData(
    FromCashAccountID: number,
    ToCashAccountID: number,
    startDate: string,
    endDate: string,
    SearchText: string
  ) {
    getAccountTransferListFilter(FromCashAccountID, ToCashAccountID, SearchText, startDate, endDate)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getCashAccountData(
            responseData,
            FromCashAccountID,
            ToCashAccountID,
            startDate,
            endDate,
            SearchText
          )
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, accountTransferData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ======================Dropdown Api===========================
  function getCashAccountData(
    accountTransferData: IAccountTransferModel[],
    FromCashAccountID: number,
    ToCashAccountID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string
  ) {
    GetCashAccountListAPI()
      .then((response) => {
        const responseData = response.data.responseObject

        if (response.data.isSuccess == true) {
          setState({
            ...state,
            accountTransferData: accountTransferData,
            temAccountTransferData: accountTransferData,
            cashAccountData: responseData,
            selFromCashAccountID: FromCashAccountID,
            selToCashAccountID: ToCashAccountID,
            selStartDate: StartDate,
            selEndDate: EndDate,
            SearchText: SearchText,
            loading: false,
          })
          setTotal(accountTransferData.length)
          setPage(1)
          setName(SearchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (accountTransferID: number) => {
    setState({
      ...state,
      selAccoTransferID: accountTransferID,
      deleteBy: user.employeeID,
      loading: false,
    })
    setShow(true)
  }

  function deleteAccountTransfer(accountTransferID: number) {
    DeleteAccountTransfer(accountTransferID, state.deleteBy)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAcoountTransferData(
            state.selFromCashAccountID,
            state.selToCashAccountID,
            state.selStartDate,
            state.selEndDate,
            state.SearchText
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
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'fromAccountID') {
      setState({...state, selFromCashAccountID: parseInt(value)})
      getAcoountTransferData(
        parseInt(value),
        state.selToCashAccountID,
        state.selStartDate,
        state.selEndDate,
        state.SearchText
      )
    } else if (elementId === 'toAccountID') {
      setState({...state, selToCashAccountID: parseInt(value)})
      getAcoountTransferData(
        state.selFromCashAccountID,
        parseInt(value),
        state.selStartDate,
        state.selEndDate,
        state.SearchText
      )
    }
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')
  const searchFilter = (value: string) => {
    const keyword = value
    if (keyword !== '') {
      getAcoountTransferData(
        state.selFromCashAccountID,
        state.selToCashAccountID,
        state.selStartDate,
        state.selEndDate,
        keyword
      )
    } else {
      getAcoountTransferData(
        state.selFromCashAccountID,
        state.selToCashAccountID,
        state.selStartDate,
        state.selEndDate,
        ''
      )
    }
  }
  // ------------------------------reset button---------------------
  function resetFilter() {
    getAcoountTransferData(0, 0, '', '', '')
    setName('')
    setStartDay(null)
    setEndDay(null)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.accountTransferData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IAccountTransferModel[] = state.accountTransferData.slice(
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
      getAcoountTransferData(
        state.selFromCashAccountID,
        state.selToCashAccountID,
        fmtMomentDate,
        state.selEndDate,
        state.SearchText
      )
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(fmtMomentDate, state.selEndDate)
  }
  function resetFilterStartDate() {
    setMainLoading(true)
    setName('')
    setStartDay(null) // Reset End
    getAcoountTransferData(
      state.selFromCashAccountID,
      state.selToCashAccountID,
      '',
      state.selEndDate,
      state.SearchText
    )
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
      getAcoountTransferData(
        state.selFromCashAccountID,
        state.selToCashAccountID,
        state.selStartDate,
        fmtMomentDate,
        state.SearchText
      )
    }
    setMainLoading(true)
    // getDaywiseAccountingReportsFilterData(state.selDate, fmtMomentDate)
  }
  function resetFilterEndDate() {
    setMainLoading(true)
    setName('')
    setEndDay(null) // Reset End
    getAcoountTransferData(
      state.selFromCashAccountID,
      state.selToCashAccountID,
      state.selStartDate,
      '',
      state.SearchText
    )
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
  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6 ps-0'>
            <label className='form-label fw-bold text-white'>From Account:</label>
            <select
              className='form-select lineHeightByD'
              aria-label='Default select example'
              onChange={selectChange}
              id='fromAccountID'
            >
              <option selected={state.selFromCashAccountID === 0 ? true : false} value={0}>
                Select From Account
              </option>
              {state.cashAccountData.length > 0 &&
                state.cashAccountData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.cashAccountID}
                      selected={data.cashAccountID == state.selFromCashAccountID ? true : false}
                    >
                      {data.accountName}
                    </option>
                  )
                })}
            </select>
          </div>
          <div className='mb-2 col-xl-3 col-sm-6 ps-0'>
            <label className='form-label fw-bold text-white'>To Account:</label>
            <select
              className='form-select lineHeightByD'
              aria-label='Default select example'
              onChange={selectChange}
              id='toAccountID'
            >
              <option selected={state.selToCashAccountID === 0 ? true : false} value={0}>
                Select To Account
              </option>
              {state.cashAccountData.length > 0 &&
                state.cashAccountData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.cashAccountID}
                      selected={data.cashAccountID == state.selToCashAccountID ? true : false}
                    >
                      {data.accountName}
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
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a Account Transfer'
          >
            <Link
              to={{
                pathname: '/accounts/accounttransfer/add',
                state: {
                  FromCashAccountID: state.selFromCashAccountID,
                  ToCashAccountID: state.selToCashAccountID,
                  StartDate: state.selStartDate,
                  EndDate: state.selEndDate,
                  SearchText: name,
                },
              }}
              className='btn btn-sm btn-light-primary bg-white mt-5'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
          <div className='mb-2 col-xl-3 col-sm-4 ps-0'>
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
          <div className=' mt-6 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div>
          <div className='col-1 text-end mt-6'>
            <Link
              to={{
                pathname: `/accounts/accounttransfer/download`,
                state: {
                  FromCashAccountID: state.selFromCashAccountID,
                  ToCashAccountID: state.selToCashAccountID,
                  StartDate: state.selStartDate,
                  EndTime: state.selEndDate,
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
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Date</span>
                    <span className='text-muted fw-bold d-block fs-5'>Amount Transfer</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>From Account</span>
                    <span className='text-muted fw-bold d-block fs-5'>From Sub Account</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>To Account</span>
                    <span className='text-muted fw-bold d-block fs-5'>To Sub Account</span>
                  </th>

                  <th className='min-w-140px'>Payment Mode</th>
                  <th className='min-w-125px text-left'>Create By</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
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
                          <AccountTransferCard
                            data={data}
                            handleShow={() => handleShow(data.accountTransferID)}
                            FromCashAccountID={state.selFromCashAccountID}
                            ToCashAccountID={state.selToCashAccountID}
                            StartDate={state.selStartDate}
                            EndDate={state.selEndDate}
                            SearchText={name}
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
        id={state.selAccoTransferID}
        pageName={'Account Transfer'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteAccountTransfer(state.selAccoTransferID)}
      />
    </>
  )
}

export default AccountTransferList
