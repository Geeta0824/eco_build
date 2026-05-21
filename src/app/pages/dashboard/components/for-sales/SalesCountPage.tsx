/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {Dropdown1} from '../../../../../_Ecd/partials/content/dropdown/Dropdown1'
import {getCSSVariableValue} from '../../../../../_Ecd/assets/ts/_utils'
import {KTSVG} from '../../../../../_Ecd/helpers'
import {Link} from 'react-router-dom'
import {ISalesDashboardModel} from '../../../../models/dashboard-page/IDashboardModel'
import {getSalesCountApi} from '../../../../modules/dashboard-page/DashboardCRUD'
import {toast} from 'react-toastify'
import {List} from 'antd'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'

type Props = {
  className: string
  chartColor: string
  strokeColor: string
  chartHeight: string
}
interface IState {
  loading: boolean
  list: ISalesDashboardModel
}

const SalesCountPage: React.FC<Props> = ({className, chartColor, chartHeight, strokeColor}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  let [state, setState] = useState<IState>({
    loading: false,
    list: {} as ISalesDashboardModel,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      fetchSalesCountList()
    }, 100)
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(
      chartRef.current,
      chartOptions(chartHeight, chartColor, strokeColor)
    )
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef])

  function fetchSalesCountList() {
    getSalesCountApi(user.employeeID)
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess === true) {
          setState({...state, list: responseData, loading: false})
        } else {
          toast.error(`${responseData.message}`)
          setState({...state, list: {} as ISalesDashboardModel, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, list: {} as ISalesDashboardModel, loading: false})
      })
  }

  const {list} = state

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className={`card-header border-0 py-5 bg-${chartColor}`}>
        <h3 className='card-title fw-bolder text-white'>ECD Statistics</h3>
        {/* <div className='card-toolbar'>
          {/* begin::Menu ----
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-white btn-active-white btn-active-color- border-0 me-n3'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          <Dropdown1 />
          {/* end::Menu ----
        </div> */}
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body p-0'>
        {/* begin::Chart */}
        <div
          ref={chartRef}
          className={`mixed-widget-2-chart card-rounded-bottom bg-${chartColor}`}
        ></div>
        {/* end::Chart */}
        {/* begin::Stats */}
        <div className='card-p mt-n20 position-relative'>
          {/* begin::Row */}
          <div className='row g-5'>
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className='bg-light-warning px-6 py-8 rounded-2 mb-3'>
                <p className='display-6 text-bold text-warning'>{list.cntQuotTotal}</p>
                <span className='text-warning fw-bold fs-6'>Total Quotation</span>
              </div>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className=' bg-light-primary px-6 py-8 rounded-2 mb-3'>
                <p className='display-6 text-bold text-primary'>{list.cntQuotDIY}</p>
                <span className='text-primary fw-bold fs-6'>DIY Quotation</span>
              </div>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className=' bg-light-dark px-6 py-8 rounded-2 mb-3'>
                <p className='display-6 text-bold text-dark'>{list.cntQuotPrem}</p>
                <span className='text-dark fw-bold fs-6'>Premium Quotation</span>
              </div>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className=' bg-light-dark px-6 py-8 rounded-2 mb-3'>
                <p className='display-6 text-bold text-dark'>{list.cntQuotStand}</p>
                <span className='text-dark fw-bold fs-6'>Standard Quotation</span>
              </div>
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}
          {/* begin::Row */}
          <div className='row g-5 mb-4'>
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className='bg-light-danger px-6 py-8 rounded-2'>
                <p className='display-6 text-bold text-danger'>{list.cntQuotEsst}</p>
                <span className='text-success fw-bold fs-6 mt-2'>Essential Quotation</span>
              </div>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className='bg-light-danger px-6 py-8 rounded-2'>
                <p className='display-6 text-bold text-danger'>{list.cntProduct}</p>
                <span className='text-success fw-bold fs-6 mt-2'>Product</span>
              </div>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className=' bg-light-success px-6 py-8 rounded-2'>
                <p className='display-6 text-bold text-success'>{list.cntCategory}</p>
                <span className='text-success fw-bold fs-6 mt-2'>Category</span>
              </div>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col-6 col-sm-6 col-md-3'>
              <div className=' bg-light-info px-6 py-8 rounded-2'>
                <p className='display-6 text-bold text-info'>{list.cntplanArea}</p>
                <span className='text-info fw-bold fs-6 mt-2'>Plan Area</span>
              </div>
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}
        </div>
        {/* end::Stats */}
      </div>
      {/* end::Body */}
    </div>
  )
}

const chartOptions = (
  chartHeight: string,
  chartColor: string,
  strokeColor: string
): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const color = getCSSVariableValue('--bs-' + chartColor)

  return {
    // series: [
    //   {
    //     name: 'Net Profit',
    //     data: [30, 45, 32, 70, 40, 40, 40],
    //   },
    // ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '$' + val + ' thousands'
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ['transparent'],
    markers: {
      colors: [color],
      strokeColors: [strokeColor],
      strokeWidth: 3,
    },
  }
}

export {SalesCountPage}
