/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import {getCSS} from '../../../../_Ecd/assets/ts/_utils'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Dropdown1} from '../../../../_Ecd/partials'
import {
  Get_Chart_QuotationCountApi,
  getAdminCountApi,
} from '../../../modules/dashboard-page/DashboardCRUD'
import {IAdminDashboardModel} from '../../../models/dashboard-page/IDashboardModel'
import {toast} from 'react-toastify'
import ReactApexChart from 'react-apexcharts'
import {IProjectTypeodel} from '../../../models/projects-page/IProjectsModel'
import {getAllProjectTypeMasterApi} from '../../../modules/quo-mst/QuotationMstCRUD'

type Props = {
  className: string
  totalCnt: any
  lablesNames: any
}

interface IState {
  loading: boolean
  list: IAdminDashboardModel
  ProjectTypeData: IProjectTypeodel[]
  options: any
  series: any
}

const PieChartjs: React.FC<Props> = ({className, totalCnt, lablesNames}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  let [state, setState] = useState<IState>({
    loading: false,
    list: {} as IAdminDashboardModel,
    ProjectTypeData: [] as IProjectTypeodel[],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#F28675',
        '#CEB019',
        '#E32E63',
      ],
      labels: lablesNames,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
    series: totalCnt,
  })

  useEffect(() => {
    // fetchAdminCountList()
    console.log('Call PieChartjs')
    console.log(lablesNames)
    console.log(totalCnt)

    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    // if (chart) {
    //   chart.render()
    // }

    // return () => {
    //   if (chart) {
    //     chart.destroy()
    //   }
    // }
  }, [chartRef])

  const fetchAdminCountList = () => {
    Get_Chart_QuotationCountApi()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess === true) {
          //  console.log(responseData)
          let labels2: any
          labels2 = responseData.lablesNames
          // labels2 = ['DIY','Standard','Premium','Essential','Premium Plus','Super Saver','Modular','DNC',]
          const series = responseData.totalCnt
          // const series = [
          //   parseInt(responseData.cntQuotDIY),
          //   parseInt(responseData.cntQuotStand),
          //   parseInt(responseData.cntQuotPrem),
          //   parseInt(responseData.cntQuotEsst),
          //   parseInt(responseData.cntQuotPremiumPlus),
          //   parseInt(responseData.cntQuotSuperSaver),
          //   parseInt(responseData.cntQuotModular),
          //   parseInt(responseData.cntQuotDNC),
          // ]
          //  console.log(series)
          setState({
            ...state,
            list: responseData,
            loading: false,
            series: series,
            options: {...state.options, labels: labels2},
          })
        } else {
          toast.error(`${responseData.message}`)
          setState({...state, list: {} as IAdminDashboardModel, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, list: {} as IAdminDashboardModel, loading: false})
      })
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        {/* begin::Title */}
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 text-primary'>Quotation Statistics</span>
          {/* <span className='text-muted fw-bold fs-7'>More than 400 new members</span> */}
        </h3>
        {/* end::Title */}

        {/* begin::Toolbar */}
        {/* <div className='card-toolbar'> */}
        {/* begin::Menu */}
        {/* <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          <Dropdown1 /> */}
        {/* end::Menu */}
        {/* </div> */}
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div id='chart'>
          <ReactApexChart options={state.options} series={state.series} type='pie' width={380} />
        </div>
        <div id='html-dist'></div>
        {/* <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '350px'}} /> */}
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {PieChartjs}
