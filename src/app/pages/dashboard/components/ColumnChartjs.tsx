/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import {getCSS} from '../../../../_Ecd/assets/ts/_utils'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Dropdown1} from '../../../../_Ecd/partials'
import {
  Get_Chart_QuotationCountApi,
  Get_Today_QuotationCountApi,
} from '../../../modules/dashboard-page/DashboardCRUD'
import {IAdminDashboardModel} from '../../../models/dashboard-page/IDashboardModel'
import {toast} from 'react-toastify'
import ReactApexChart from 'react-apexcharts'
import {IProjectTypeodel} from '../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'

type Props = {
  className: string
  dailyCount: any
  lablesNames: any
}

interface IState {
  loading: boolean
  list: IAdminDashboardModel
  projectTypeForTreeData: IProjectTypeodel[]
  options: any
  series: any
}

const ColumnChartjs: React.FC<Props> = ({className, dailyCount, lablesNames}) => {
  // const [projectTypeForTreeData, setProjectTypeForTreeData] = useState<IProjectTypeodel[]>(
  //   [] as IProjectTypeodel[]
  // )
  const chartRef = useRef<HTMLDivElement | null>(null)
  // const colors = ['#F5B145', '#26E7A6', '#FF6178', '#8B75D7', '#6D848E', '#FEBC3B', '#D830EB']
  let [state, setState] = useState<IState>({
    loading: false,
    list: {} as IAdminDashboardModel,
    projectTypeForTreeData: [] as IProjectTypeodel[],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      // colors: colors,
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          // distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: string) {
          return val
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#00008B'],
        },
      },
      legend: {
        show: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: lablesNames,
        labels: {
          style: {
            // colors: colors,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'No Of Quotations',
        },
        min: 0,
        max: 50,
        tickAmount: 5,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return val + ' Quotations'
          },
        },
      },
    },
    series: [
      {
        name: 'Quotations',
        data: dailyCount,
      },
      // {
      //   name: 'Revenue',
      //   data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      // },
      // {
      //   name: 'Free Cash Flow',
      //   data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      // },
    ],
  })

  useEffect(() => {
    // fetchAdminCountList()
    console.log('Call ColumnChartjs')
    console.log(lablesNames)
    console.log(dailyCount)
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
          console.log(responseData)
          let labels2: any
          labels2 = responseData.lablesNames
          // labels2 = ['DIY','Standard','Premuim','Essential','Modular','Premuim Plus','Super Saver']
          const series = [
            {
              name: 'Quotations',
              data: responseData.dailyCount,
              // data: [
              //   parseInt(responseData.cntDiy),
              //   parseInt(responseData.cntStd),
              //   parseInt(responseData.cntPrm),
              //   parseInt(responseData.cntEss),
              //   parseInt(responseData.cntModular),
              //   parseInt(responseData.cntPremPlus),
              //   parseInt(responseData.cntSuperSav),
              // ],
            },
          ]
          //  console.log(series)
          setState({
            ...state,
            list: responseData,
            loading: false,
            series: series,
            options: {
              ...state.options,
              xaxis: {
                ...state.options.xaxis,
                categories: labels2,
              },
            },
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
          <span className='card-label fw-bolder fs-3 text-primaryMain'>Today's Quotation</span>
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
          <ReactApexChart options={state.options} series={state.series} type='bar' width={380} />
        </div>
        <div id='html-dist'></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ColumnChartjs}
