/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_Ecd/layout/core'
import {
  // MixedWidget2,
  MixedWidget10,
  MixedWidget11,
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget5,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
} from '../../../_Ecd/partials/widgets'
import {MixedWidget2} from './components/MixedWidget2'
import {ListsWidget2_2} from './components/ListsWidget2_2'
import {ListsWidget6_2} from './components/ListsWidget6_2'
import {ListsWidget4_2} from './components/ListsWidget4_2'
import {ListsWidget3_2} from './components/ListsWidget3_2'
import {AdminCount} from './components/for-admin/AdminCount'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {SalesCountPage} from './components/for-sales/SalesCountPage'
import {PieChartjs} from './components/PieChartjs'
import {ColumnChartjs} from './components/ColumnChartjs'
import {TablesSalesQuotCount} from './components/TablesSalesQuotCount'
import {Get_Chart_QuotationCountApi} from '../../modules/dashboard-page/DashboardCRUD'
import {toast} from 'react-toastify'
import {ThisMonthColumnCharts} from './components/ThisMonthColumnCharts'
import {ThisYearPieChartjs} from './components/ThisYearPieChartjs'
import {SalesNameQuotCountTotal} from './components/SalesNameQuotCountTotal'

const DashboardPage: FC = () => (
  <>
    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='danger'
          chartHeight='100px'
          strokeColor='#cb1e46'
        />
      </div>

      <div className='row gy-5 g-xl-8'>
        <div className='col-xl-6'>
          <ListsWidget6_2 className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-6'>
          <ListsWidget4_2 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
          {/* {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5'  */}
        </div>
      </div>

      <div className='row gy-5 gx-xl-8'>
        <div className='col-xl-6'>
          <ListsWidget3_2 className='card-xxl-stretch mb-xl-1' />
        </div>
        <div className='col-xl-6'>
          <ListsWidget2_2 className='card-xl-stretch mb-xl-8' />
        </div>
      </div>

      {/* <div className='col-xxl-4'>
        <ListsWidget5 className='card-xxl-stretch' />
      </div> */}
      {/* <div className='col-xxl-4'>
        <MixedWidget10
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='primary'
          chartHeight='150px'
        />
        <MixedWidget11
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='primary'
          chartHeight='175px'
        />
      </div> */}
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    {/* <div className='row gy-5 gx-xl-8'>
      <div className='col-xxl-4'>
        <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
      </div>
      <div className='col-xl-8'>
        <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
      </div>
    </div> */}
    {/* end::Row */}

    {/* begin::Row */}
    {/* <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ListsWidget2 className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ListsWidget6 className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
        {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' ---
      </div>
    </div> */}
    {/* end::Row */}

    {/* <div className='row g-5 gx-xxl-8'>
      <div className='col-xxl-4'>
        <MixedWidget8
          className='card-xxl-stretch mb-xl-3'
          chartColor='success'
          chartHeight='150px'
        />
      </div>
      <div className='col-xxl-8'>
        <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
      </div>
    </div> */}
  </>
)

interface IState {
  loading: boolean
  dailyCount: any
  lablesNames: any
  totalCnt: any
  statusNames: any
  montCount: any
  yearCnt: any
}

const AdminDashboardPage: FC = () => {
  let [state, setState] = useState<IState>({
    loading: false,
    dailyCount: [],
    lablesNames: [],
    totalCnt: [],
    statusNames: [],
    montCount: [],
    yearCnt: [],
  })

  useEffect(() => {
    // setTimeout(() => {
    fetchAdminCountList()
    // })
  }, [])

  const fetchAdminCountList = () => {
    Get_Chart_QuotationCountApi()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess === true) {
          setState({
            ...state,
            dailyCount: responseData.dailyCount,
            lablesNames: responseData.lablesNames,
            totalCnt: responseData.totalCnt,
            statusNames: responseData.statusName,
            montCount: responseData.monthlyStatusCnt,
            yearCnt: responseData.yearStatusCnt,
            loading: false,
          })
        } else {
          toast.error(`${responseData.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  return (
    <>
      <div className='row gy-3 gx-xl-5'>
        <div className='col-xl-6'>
          {state.lablesNames.length > 0 && (
            <PieChartjs
              className='card-xl-stretch mb-xl-8'
              totalCnt={state.totalCnt}
              lablesNames={state.lablesNames}
            />
          )}
        </div>
        <div className='col-xl-6'>
          {state.lablesNames.length > 0 && (
            <ColumnChartjs
              className='card-xl-stretch mb-xl-8'
              dailyCount={state.dailyCount}
              lablesNames={state.lablesNames}
            />
          )}
        </div>
        <div className='col-xl-4'>
          {state.lablesNames.length > 0 && (
            <ThisYearPieChartjs
              className='card-xl-stretch'
              totalCnt={state.yearCnt}
              lablesNames={state.statusNames}
            />
          )}
        </div>
        <div className='col-xl-4'>
          {state.lablesNames.length > 0 && (
            <ThisMonthColumnCharts
              className='card-xl-stretch'
              dailyCount={state.montCount}
              lablesNames={state.statusNames}
            />
          )}
        </div>
        <div className='col-xl-4'>
          {state.lablesNames.length > 0 && (
            <SalesNameQuotCountTotal className='card-xl-stretch' lablesNames={state.lablesNames} />
          )}
        </div>
      </div>
      <div className='row gy-5 g-xl-8'>
        <div className='col-xxl-12 col-12'>
          {state.lablesNames.length > 0 && (
            <TablesSalesQuotCount
              className='card-xl-stretch mb-xl-8'
              lablesNames={state.lablesNames}
            />
          )}
        </div>
      </div>
      <div className='row gy-5 g-xl-8'>
        <div className='col-xxl-12 col-12'>
          <AdminCount
            className='card-xl-stretch mb-xl-8'
            chartColor='danger'
            chartHeight='100px'
            strokeColor='#cb1e46'
          />
        </div>
      </div>
    </>
  )
}

const SalesManagerDashboardPage: FC = () => {
  let [state, setState] = useState<IState>({
    loading: false,
    dailyCount: [],
    lablesNames: [],
    totalCnt: [],
    statusNames: [],
    montCount: [],
    yearCnt: [],
  })

  useEffect(() => {
    // setTimeout(() => {
    fetchAdminCountList()
    // })
  }, [])

  const fetchAdminCountList = () => {
    Get_Chart_QuotationCountApi()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess === true) {
          setState({
            ...state,
            dailyCount: responseData.dailyCount,
            lablesNames: responseData.lablesNames,
            totalCnt: responseData.totalCnt,
            statusNames: responseData.statusName,
            montCount: responseData.monthlyStatusCnt,
            yearCnt: responseData.yearStatusCnt,
            loading: false,
          })
        } else {
          toast.error(`${responseData.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }
  return (
    <>
      <div className='row gy-5 g-xl-8'>
        <div className='col-xl-6'>
          {state.lablesNames.length > 0 && (
            <PieChartjs
              className='card-xl-stretch mb-xl-8'
              totalCnt={state.totalCnt}
              lablesNames={state.lablesNames}
            />
          )}
        </div>
        <div className='col-xl-6'>
          {state.lablesNames.length > 0 && (
            <ColumnChartjs
              className='card-xl-stretch mb-xl-8'
              dailyCount={state.dailyCount}
              lablesNames={state.lablesNames}
            />
          )}
        </div>
        <div className='col-xl-6'>
          {state.lablesNames.length > 0 && (
            <ThisYearPieChartjs
              className='card-xl-stretch mb-xl-8'
              totalCnt={state.yearCnt}
              lablesNames={state.statusNames}
            />
          )}
        </div>
        <div className='col-xl-6'>
          {state.lablesNames.length > 0 && (
            <ThisMonthColumnCharts
              className='card-xl-stretch mb-xl-8'
              dailyCount={state.montCount}
              lablesNames={state.statusNames}
            />
          )}
        </div>
        <div className='col-xxl-12 col-12'>
          <SalesCountPage
            className='card-xl-stretch mb-xl-8'
            chartColor='danger'
            chartHeight='100px'
            strokeColor='#cb1e46'
          />
        </div>
      </div>
    </>
  )
}
// =============================
const SalesDashboardPage: FC = () => (
  <>
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-12 col-12'>
        <SalesCountPage
          className='card-xl-stretch mb-xl-8'
          chartColor='danger'
          chartHeight='100px'
          strokeColor='#cb1e46'
        />
      </div>
    </div>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      {/* <DashboardPage /> */}
      {/* {user.roleID === 2 ? <AdminDashboardPage /> : <SalesDashboardPage />} */}
      {/* {user.roleID === 2 ? (
        <AdminDashboardPage />
      ) : user.designationID === 1009 ? (
        <SalesManagerDashboardPage />
      ) : (
        <SalesDashboardPage />
      )} */}
    </>
  )
}

export {DashboardWrapper}
