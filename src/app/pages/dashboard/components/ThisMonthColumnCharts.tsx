import React, {useEffect, useRef, useState} from 'react'
import ReactApexChart from 'react-apexcharts'
import {Button, Modal, Table} from 'react-bootstrap-v5'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {getAllProjectListByRoleIDAndEmployeeIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useParams} from 'react-router-dom'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {Pagination} from 'antd'
import {ProjectListPopUp} from '../../../models/dashboard-page/IDashboardModel'
import {GetProjectListByStatusIDApi} from '../../../modules/dashboard-page/DashboardCRUD'

type Props = {
  className: string
  dailyCount: any
  lablesNames: any
  // statusID: any
  // projectData: IProjectModel[]
}

interface IState {
  loading: boolean
  options: any
  series: any
  projectData: ProjectListPopUp[]
  statusID: number
  totalProjAmount: number
  projStatusName: string
}

const ThisMonthColumnCharts: React.FC<Props> = ({className, dailyCount, lablesNames}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  // const colors = ['#F5B145', '#26E7A6', '#FF6178', '#8B75D7', '#6D848E', '#FEBC3B', '#D830EB']
  let [state, setState] = useState<IState>({
    loading: false,
    projectData: [] as ProjectListPopUp[],
    statusID: 0,
    totalProjAmount: 0,
    projStatusName: '',
    options: {
      chart: {
        type: 'bar',
        height: 350,
        events: {
          // dataPointSelection: (config: any) => {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            // console.log("Clicked on:", config.w.config.series[config.seriesIndex].name);
            console.log('Data point index:', config.dataPointIndex)
            // console.log("Value:", config.w.config.series[config.seriesIndex].data[config.dataPointIndex]);
            handleShow(config.dataPointIndex)
          },
        },
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
          text: 'No Of Projects',
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
            return val + ' Projects'
          },
        },
      },
    },
    series: [
      {
        name: 'Projects',
        data: dailyCount,
      },
    ],
  })
  // const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    if (!chartRef.current) {
      return
    }
  }, [chartRef])
  // ==================================

  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)
  const handleShow = (indexID: number) => {
    state.projectData = []
    let statusid = 0
    if (indexID == 0) {
      statusid = 0
    } else if (indexID == 1) {
      statusid = 2001
    } else if (indexID == 2) {
      statusid = 3001
    } else if (indexID == 3) {
      statusid = 1009
    } else if (indexID == 4) {
      statusid = 3002
    } else if (indexID == 5) {
      statusid = 1010
    } else {
      statusid = 0
    }
    setShowModal(true)
    setState({...state, loading: true})
    GetProjectListByStatusIDApi(statusid)
      .then((response) => {
        const responseData = response.data.responseObject
        let projStatusName =
          indexID == 0
            ? 'New Project'
            : indexID == 1
            ? 'Move To Execution'
            : indexID == 2
            ? 'Full Payment Done'
            : indexID == 3
            ? 'Hand Over Project'
            : indexID == 4
            ? 'On Hold'
            : indexID == 5
            ? 'Droped'
            : ''
        if (response.data.isSuccess === true) {
          let totalProAmt: any = 0
          for (let key in responseData) {
            totalProAmt = parseInt(totalProAmt) + parseInt(responseData[key].finalAmount)
          }
          setState({
            ...state,
            projectData: responseData,
            statusID: statusid,
            totalProjAmount: totalProAmt,
            projStatusName: projStatusName,
            loading: false,
          })
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectData: [], loading: false})
      })
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(15)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ProjectListPopUp[] = state.projectData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  return (
    <>
      <div className={`card ${className}`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          {/* begin::Title */}
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 text-warning'>This Month Project</span>
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
        {/* <div className='card-body text-start'>
          <div id='chart'>
            <ReactApexChart options={state.options} series={state.series} type='bar' width={355} />
          </div>
          <div id='html-dist'></div>
        </div> */}

        <div className='card-body' style={{maxWidth: '100%', overflow: 'hidden'}}>
          <div id='chart' style={{maxWidth: '150%', display: 'flex', justifyContent: 'center'}}>
            <ReactApexChart options={state.options} series={state.series} type='bar' width='125%' />
          </div>
          <div id='html-dist'></div>
        </div>
        {/* end::Body */}
      </div>

      <Modal size='xl' show={showModal} onHide={handleClose}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Project List:</Modal.Title>
          <div className='border-0 fs-5 fw-bolder text-white' id='kt_chat_contacts_header'>
            Project Status : &nbsp;
            <span className='text-primary fs-5 fw-bolder'>{state.projStatusName}</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* <div className='card-body '> */}
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  {' '}
                  <th className='min-w-150x text-start '>
                    <span className='d-block  mb-1  me-8'>Project Name </span>
                    <span className='text-muted fw-bold d-block  fs-6  me-8'>
                      Project Category Name
                    </span>
                  </th>
                  <th className='min-w-150x text-start '>
                    <span className='d-block  mb-1  me-8'>Customer Name </span>
                    <span className='text-muted fw-bold d-block  fs-6  me-8'>Mobile Number</span>
                  </th>
                  <th className='min-w-25px'>Sales Person</th>
                  <th className='min-w-50px'>Project Cost</th>
                  <th className='min-w-50px'>Project Date</th>
                </tr>
              </thead>
              <tbody className='border-bottom'>
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={9} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                {data.projectName}
                              </span>
                              <span className='text-muted d-block fs-7 text-start'>
                                {data.projectCategoryName}
                              </span>
                            </td>

                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                {data.firstName + ' ' + data.lastName}
                              </span>
                              <span className='text-muted d-block fs-7 text-start'>
                                {data.mobileNumber}
                              </span>
                            </td>

                            <td>
                              <span className=' text-hover-primary fs-6'>{data.employeeName}</span>
                            </td>

                            <td>
                              <span className=' text-hover-primary fs-6'>{data.finalAmount}</span>
                            </td>
                            <td>
                              <span className=' text-hover-primary fs-6'>{data.entryDate}</span>
                            </td>
                          </tr>
                        )
                      })}
                    <tr className='text-dark'>
                      <td className='text-start fw-bolder fs-6'>Total</td>
                      <td className='text-start'></td>
                      <td className='text-start'></td>
                      <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                        {state.totalProjAmount}
                      </td>
                      <td className='text-start' colSpan={5}></td>
                    </tr>
                    <BlankDataImageInTable
                      length={currentPosts.length}
                      loading={state.loading}
                      colSpan={9}
                    />
                  </>
                )}
              </tbody>
            </table>
          </div>
          {/* </div> */}
        </Modal.Body>
        <Modal.Footer>
          <div className='w-100 text-center'>
            <Pagination
              className='justify-content-center'
              size='small'
              onChange={(value) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            />
          </div>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export {ThisMonthColumnCharts}
