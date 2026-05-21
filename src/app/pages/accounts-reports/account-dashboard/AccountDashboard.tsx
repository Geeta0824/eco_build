/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import {toast} from 'react-toastify'
import {List} from 'antd'
import {IAccountDashboardModel} from '../../../models/dashboard-page/IDashboardModel'
import {GetAccountDashboardApi} from '../../../modules/dashboard-page/DashboardCRUD'
import {useHistory} from 'react-router-dom'

interface IState {
  loading: boolean
  list: IAccountDashboardModel
  todayTotal: number
  totalYest: number
  totalThismnthg: number
  totalLastmnthg: number
}

const AccountDashboard: React.FC = () => {
  const history = useHistory()
  let [state, setState] = useState<IState>({
    loading: false,
    list: {} as IAccountDashboardModel,
    todayTotal: 0,
    totalYest: 0,
    totalThismnthg: 0,
    totalLastmnthg: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      fetchAdminCountList()
    }, 100)
  }, [])

  function fetchAdminCountList() {
    GetAccountDashboardApi()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess === true) {
          let temTodayCredit: any = responseData.todayCredit
          let temTodayDebit: any = responseData.todayDebit
          let todayTotal: any = (temTodayCredit - temTodayDebit).toFixed(2)

          let teystrCredit: any = responseData.yestCredit
          let teystrDebit: any = responseData.yestDebit
          let ystrTotal: any = (teystrCredit - teystrDebit).toFixed(2)

          let temmonthCredit: any = responseData.monthCredit
          let temmonthDebit: any = responseData.monthDebit
          let monthTotal: any = (temmonthCredit - temmonthDebit).toFixed(2)

          let temlastmnthCredit: any = responseData.lastMonthCredit
          let temlastmnthDebit: any = responseData.lastMonthDebit
          let lstMonthTotal: any = (temlastmnthCredit - temlastmnthDebit).toFixed(2)
          setState({
            ...state,
            list: responseData,
            todayTotal: todayTotal,
            totalYest: ystrTotal,
            totalThismnthg: monthTotal,
            totalLastmnthg: lstMonthTotal,
            loading: false,
          })
        } else {
          toast.error(`${responseData.message}`)
          setState({...state, list: {} as IAccountDashboardModel, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, list: {} as IAccountDashboardModel, loading: false})
      })
  }

  const {list} = state

  return (
    <>
      <div className='row gx-5 gx-xl-8'>
        <div className='col-12 col-sm-12 col-md-12'>
          <div className='row gx-5 gx-xl-8'>
            <div className=' col-6 col-sm-12 col-md-6'>
              <div className='card mb-2 mb-xl-4'>
                <div className='card-header'>
                  <h3 className='card-title fw-bolder text-primary fs-3'>Payment DayWise:</h3>
                </div>
                <div className='card-body py-0'>
                  <div className='row gx-10'>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-6 text-gray-800'>
                            <th className='text-center fs-5'>Today</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>Credit :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.todayCredit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Debit :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.todayDebit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Blance :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {state.todayTotal}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-6 text-gray-800'>
                            <th className='text-center'>Yesterday</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>Credit :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.yestCredit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Debit :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.yestDebit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Blance :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {state.totalYest}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=' col-6 col-sm-12 col-md-6'>
              <div className='card mb-2 mb-xl-4'>
                <div className='card-header'>
                  <h3 className='card-title fw-bolder text-primary fs-3'>Payment MonthWise:</h3>
                </div>
                <div className='card-body py-0'>
                  <div className='row gx-10'>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-6 text-gray-800'>
                            <th className='text-center fs-5'>Current Month</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>Credit :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.monthCredit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Debit :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.monthDebit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Blance :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {state.totalThismnthg}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-6 text-gray-800'>
                            <th className='text-center'>Last Month</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>Credit :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.lastMonthCredit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Debit :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.lastMonthDebit}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Blance :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {state.totalLastmnthg}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-5 col-sm-12 col-md-5'>
          <div className='card mb-2 mb-xl-4'>
            <div className='card-header'>
              <h3 className='card-title fw-bolder text-primary fs-3'>Capital Account :</h3>
            </div>
            <div className='card-body py-0'>
              <div className='row gx-10'>
                {/* <div className='col-6 col-sm-12 col-md-6'> */}
                <table className='table table-row-dashed table-row-gray-500 gy-3'>
                  {/* <thead>
                      <tr className='fw-bolder fs-6 text-gray-800'>
                        <th className='text-center fs-5'>Today</th>
                      </tr>
                    </thead> */}
                  <tbody className="border-bottom">
                    <tr>
                      <th className='fw-bold fs-6'>Company Balance :</th>
                      <td className='display-6 text-bold text-info text-end'>
                        {list.companyBalance}
                      </td>
                    </tr>
                    <tr>
                      <th className='fw-bold fs-6'>Sundry Creditor :</th>
                      <td
                        className='display-6 text-bold text-danger text-end cursor-pointer'
                        onClick={() => history.push('/account-reports/sundry-creditor/list')}
                      >
                        {list.totalSundryCreditors}
                      </td>
                    </tr>
                    <tr>
                      <th className='fw-bold fs-6'>Sundry Debtors :</th>
                      <td
                        className='display-6 text-bold text-success text-end cursor-pointer'
                        onClick={() => history.push('/account-reports/sundry-debtor/list')}
                      >
                        {list.totalSundryDetors}
                      </td>
                    </tr>
                    <tr>
                      <th className='fw-bold fs-6'>Fix Assets :</th>
                      <td className='display-6 text-bold text-success text-end'>
                        {list.fixedTotalAssets}
                      </td>
                    </tr>
                    <tr>
                      <th className='fw-bold fs-6'>Current Assets :</th>
                      <td className='display-6 text-bold text-success text-end'>
                        {list.currentAssets}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className=' col-6 col-sm-12 col-md-7'>
          <div className='card mb-2 mb-xl-4'>
            <div className='card-header'>
              <h3 className='card-title fw-bolder text-primary fs-3 text-center'>TDS & GST:</h3>
            </div>
            <div className='card-body py-0'>
              <div className='row gx-10'>
                <div className='col-6 col-sm-12 col-md-6'>
                  <table className='table table-row-dashed table-row-gray-500 gy-3'>
                    <thead>
                      <tr className='fw-bolder fs-6 text-gray-800'>
                        <th className='text-center fs-5'>Current Month</th>
                      </tr>
                    </thead>
                    <tbody className="border-bottom">
                      <tr>
                        <th className='fw-bold fs-6'>TDS To Gov. :</th>
                        <td className='display-6 text-bold text-info text-end'>{list.cMonthTDS}</td>
                      </tr>
                      <tr>
                        <th className='fw-bold fs-6'>GST Receivable :</th>
                        <td className='display-6 text-bold text-danger text-end'>
                          {list.cMonthGSTRec}
                        </td>
                      </tr>
                      <tr>
                        <th className='fw-bold fs-6'>GST Payble :</th>
                        <td className='display-6 text-bold text-success text-end'>
                          {list.cMonthGSTPay}
                        </td>
                      </tr>
                      <tr>
                        <th className='fw-bold fs-6'>Balance GST:</th>
                        <td className='display-6 text-bold text-success text-end'>
                          {list.cMonthGSTBal}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='col-6 col-sm-12 col-md-6'>
                  <table className='table table-row-dashed table-row-gray-500 gy-3'>
                    <thead>
                      <tr className='fw-bolder fs-6 text-gray-800'>
                        <th className='text-center'>Last Month</th>
                      </tr>
                    </thead>
                    <tbody className="border-bottom">
                      <tr>
                        <th className='fw-bold fs-6'>TDS To Gov. :</th>
                        <td className='display-6 text-bold text-info text-end'>{list.lMonthTDS}</td>
                      </tr>
                      <tr>
                        <th className='fw-bold fs-6'>GST Receivable :</th>
                        <td className='display-6 text-bold text-danger text-end'>
                          {list.lMonthGSTRec}
                        </td>
                      </tr>
                      <tr>
                        <th className='fw-bold fs-6'>GST Payble :</th>
                        <td className='display-6 text-bold text-success text-end'>
                          {list.lMonthGSTPay}
                        </td>
                      </tr>
                      <tr>
                        <th className='fw-bold fs-6'>Balance GST:</th>
                        <td className='display-6 text-bold text-success text-end'>
                          {list.lMonthGSTBal}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-sm-12 col-md-12'>
          <div className='row gx-5 gx-xl-8'>
            <div className='col-6 col-sm-12 col-md-6'>
              <div className='card mb-2 mb-xl-4'>
                <div className='card-header'>
                  <h3 className='card-title fw-bolder text-primary'>Project :</h3>
                </div>
                <div className='card-body py-0'>
                  <div className='row'>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-6 text-gray-800'>
                            <th className='text-center'>Today</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>New Project :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.todayNewProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Move To Execution :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.todayMoveToExectuionProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Full Payment Done :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.todayFullPaymentDoneProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Hand Over Project :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.todayHandOverProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>On Hold :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.todayOnHoldProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Droped :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.todayDropedProject}
                            </td>
                          </tr>
                          {/* <tr>
                        <th className='fw-bold fs-6'>Blance :</th>
                        <td className='display-6 text-bold text-success text-end'>{list.todayNewProject - list.todayNewProject}</td>
                      </tr> */}
                        </tbody>
                      </table>
                    </div>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-5 text-gray-800'>
                            <th className='text-center'>This Month</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>New Project :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.monthNewProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Move To Execution :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.monthMoveToExectuionProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Full Payment Done :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.monthFullPaymentDoneProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Hand Over Project :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.monthHandOverProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>On Hold :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.monthOnHoldProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Droped :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.monthDropedProject}
                            </td>
                          </tr>
                          {/* <tr>
                        <th className='fw-bold fs-6'>Blance :</th>
                        <td className='display-6 text-bold text-success text-end'>100</td>
                      </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-6 col-sm-12 col-md-6'>
              <div className='card mb-2 mb-xl-4'>
                <div className='card-header'>
                  <h3 className='card-title fw-bolder text-primary'>Project :</h3>
                </div>
                <div className='card-body py-0'>
                  <div className='row'>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-6 text-gray-800'>
                            <th className='text-center'>Last Month</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>New Project :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.lastMonthNewProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Move To Execution :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.lastMonthMoveToExectuionProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Full Payment Done :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.lastMonthFullPaymentDoneProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Hand Over Project :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.lastMonthHandOverProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>On Hold :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.lastMonthOnHoldProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Droped :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.lastMonthDropedProject}
                            </td>
                          </tr>
                          {/* <tr>
                        <th className='fw-bold fs-6'>Blance :</th>
                        <td className='display-6 text-bold text-success text-end'>{list.todayNewProject - list.todayNewProject}</td>
                      </tr> */}
                        </tbody>
                      </table>
                    </div>
                    <div className='col-6 col-sm-12 col-md-6'>
                      <table className='table table-row-dashed table-row-gray-500 gy-3'>
                        <thead>
                          <tr className='fw-bolder fs-5 text-gray-800'>
                            <th className='text-center'>This Year</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom">
                          <tr>
                            <th className='fw-bold fs-6'>New Project :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.yearNewProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Move To Execution :</th>
                            <td className='display-6 text-bold text-info text-end'>
                              {list.yearMoveToExectuionProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Full Payment Done :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.yearFullPaymentDoneProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Hand Over Project :</th>
                            <td className='display-6 text-bold text-success text-end'>
                              {list.yearHandOverProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>On Hold :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.yearOnHoldProject}
                            </td>
                          </tr>
                          <tr>
                            <th className='fw-bold fs-6'>Droped :</th>
                            <td className='display-6 text-bold text-danger text-end'>
                              {list.yearDropedProject}
                            </td>
                          </tr>
                          {/* <tr>
                        <th className='fw-bold fs-6'>Blance :</th>
                        <td className='display-6 text-bold text-success text-end'>100</td>
                      </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export {AccountDashboard}
