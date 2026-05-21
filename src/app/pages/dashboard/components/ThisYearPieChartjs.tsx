import React, {useEffect, useRef, useState} from 'react'
import ReactApexChart from 'react-apexcharts'

type Props = {
  className: string
  totalCnt: any
  lablesNames: any
}

interface IState {
  loading: boolean
  options: any
  series: any
}

const ThisYearPieChartjs: React.FC<Props> = ({className, totalCnt, lablesNames}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  let [state, setState] = useState<IState>({
    loading: false,
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
    if (!chartRef.current) {
      return
    }
  }, [chartRef])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        {/* begin::Title */}
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 text-info'>This Year Project</span>
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
      {/* <div className='card-body justify-content-start'>
        <div id='chart'>
          <ReactApexChart options={state.options} series={state.series} type='pie' width={360} />
        </div>
        <div id='html-dist'></div> */}

      <div className='card-body' style={{maxWidth: '100%', overflow: 'hidden'}}>
        <div id='chart' style={{maxWidth: '150%', display: 'flex', justifyContent: 'center'}}>
          <ReactApexChart options={state.options} series={state.series} type='pie' width='125%' />
        </div>
        <div id='html-dist'></div>

        {/* <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '350px'}} /> */}
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ThisYearPieChartjs}
