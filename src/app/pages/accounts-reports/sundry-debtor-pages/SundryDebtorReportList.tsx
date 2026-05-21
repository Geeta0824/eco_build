import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import moment from 'moment'
import * as XLSX from 'xlsx'
import {ISundryDebtorsModel} from '../../../models/accounts-reports/ISundryDeptorsModel'
import {
  ExportExcelSundryDebtorsListApi,
  getSundryDebtorsListApi,
} from '../../../modules/accounts-reports/sundry-debt-reports-pages/SundryDebtorsReportCRUD'
import ExcelJS from 'exceljs'
import { ProjectDetailsModel } from '../../common-pages/ProjectDetailsModel'
import { getGetProjectDetailsList_ByProjectIDAPI } from '../../../modules/project-master-page/project-master/ProjectCRUD'
import { IProjectModel } from '../../../models/projects-page/IProjectsModel'

interface ISundryCredit {
  loading: boolean
  sundryDebtorsReportData: ISundryDebtorsModel[]
  tmpSundryDebtorsReportData: ISundryDebtorsModel[]
  projectDtlData: IProjectModel[]
  PDFShow: string
  SearchText: string
  selExpMstID: number
  activeID: number
  activeType: any
  pathUrl: any
}

type Props = {}

const SundryDebtorReportList: React.FC<Props> = () => {
  const location = useLocation()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<ISundryCredit>({
    loading: false,
    sundryDebtorsReportData: [] as ISundryDebtorsModel[],
    tmpSundryDebtorsReportData: [] as ISundryDebtorsModel[],
    projectDtlData: [] as IProjectModel[],
    PDFShow: '',
    SearchText: '',
    selExpMstID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getSundryCreditorData(mainSearch)
    }, 100)
  }, [])

  function getSundryCreditorData(mainSearch: string) {
    getSundryDebtorsListApi()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.projectAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.statusName.toString().includes(mainSearch.toLowerCase()) ||
                user.paidAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.remainingamount.toString().includes(mainSearch.toLowerCase()) ||
                user.customerName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              sundryDebtorsReportData: results,
              tmpSundryDebtorsReportData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              sundryDebtorsReportData: responseData,
              tmpSundryDebtorsReportData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }

          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, sundryDebtorsReportData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, sundryDebtorsReportData: [], loading: false})
      })
  }

  // ======================List Api================================

  function exportExcelData() {
    ExportExcelSundryDebtorsListApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            loading: false,
          })
          // const worksheet = XLSX.utils.json_to_sheet(responseData)
          // const workbook = XLSX.utils.book_new()
          // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
          // XLSX.writeFile(workbook, `SundryDebtors_${moment(new Date()).format('YYYYMMDD')}.xlsx`)

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('SundryDebtors')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Project Name', key: 'projectName', width: 30},
            {header: 'Customer Name', key: 'customerName', width: 25},
            {header: 'Project Amount', key: 'projectAmount', width: 20},
            {header: 'Addon Item Amount', key: 'addonItemTotalAmount', width: 20},
            {header: 'Final Amount', key: 'finalAmount', width: 20},
            {header: 'Paid Amount', key: 'paidAmount', width: 20},
            {header: 'Remaining Amount', key: 'remainingamount', width: 20},
            {header: 'Status Name', key: 'statusName', width: 35},
          ]

          // Apply header styles (background color and bold font)
          const headerRow = worksheet.getRow(1)
          headerRow.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: '4F81BD'}, // Yellow background color
            }
            cell.font = {
              bold: true,
              color: {argb: 'FFFFFF'}, // Red text color
            }
            cell.alignment = {
              vertical: 'middle', // Align vertically
              horizontal: 'center', // Align horizontally (center)
            }
            cell.border = {
              // top: {style: 'thin', color: {argb: '000000'}}, // Optional: Top border
              //left: {style: 'thin', color: {argb: '000000'}}, // Optional: Left border
              //bottom: {style: 'thin', color: {argb: '000000'}}, // Optional: Bottom border
              right: {style: 'thin', color: {argb: '000000'}}, // Right border
            }
          })

          // Add data rows
          responseData.forEach((item: any) => {
            worksheet.addRow({
              projectName: item.projectName,
              customerName: item.customerName,
              projectAmount: item.projectAmount,
              addonItemTotalAmount: item.addonItemTotalAmount,
              finalAmount: item.finalAmount,
              paidAmount: item.paidAmount,
              remainingamount: item.remainingamount,
              statusName: item.statusName,
            })
          })

          // Write to Excel file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `SundryDebtors_${moment(new Date()).format('YYYYMMDD')}.xlsx`
            link.click()
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            // productCategory: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          // productCategory: [],
          loading: false,
        })
      })
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ISundryDebtorsModel[] = state.sundryDebtorsReportData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpSundryDebtorsReportData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toLowerCase()) ||
          user.statusName.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.remainingamount.toString().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, sundryDebtorsReportData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, sundryDebtorsReportData: state.tmpSundryDebtorsReportData})
      // If the text field is empty, show all users
      setTotal(state.tmpSundryDebtorsReportData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ------------------------- For Project Details ---------------------
  const [showProDtl, setShowProDtl] = useState(false)
  function handleCloseProDtl() {
    setShowProDtl(false)
  }

  function handleShowProDtl(temProjectID: number) {
    getGetProjectDetailsList_ByProjectIDAPI(temProjectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectDtlData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectDtlData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectDtlData: [],
          loading: false,
        })
      })
    setShowProDtl(true)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='border-0 pt-4 ps-0 mb-4'>
            <span className='w-100 position-relative '>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </span>
          </div>
          <div className='col-6 text-end mt-4'>
            <span
              // className='text-end col-xl-3 col-sm-6 mt-6'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to export Excel sheet'
            >
              <span
                className='btn btn-sm btn-light-primary bg-white'
                onClick={() => exportExcelData()}
              >
                <KTSVG path='/media/icons/duotune/files/fil002.svg' className='svg-icon-3' />
                Export Excel
              </span>
            </span>
          </div>
          <div className='col-1 text-end mt-4'>
            <Link
              to={{
                pathname: `/account-reports/sundry-debtor/download`,
                state: {
                  // pmcWorkStageID: state.selPmcWorkStageID,
                  mainSearch: name,
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
                <tr className='fw-bolder fs-5 text-start'>
                  <th className='min-w-200px'>
                    <span className='d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Customer Name</span>
                  </th>
                  {/* <th className='min-w-125px'>Project Name</th>
                  <th className='min-w-125px'>Customer Name</th> */}
                  <th className='min-w-100px'>Project Amount</th>
                  <th className='min-w-100px'>Addon Amount</th>
                  <th className='min-w-100px'>Final Amount</th>
                  <th className='min-w-100px'>Paid Amount</th>
                  <th className='min-w-100px'>Remain Amount</th>
                  <th className='min-w-125px'>Status Name</th>
                  {/* <th className='min-w-40px'>View</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 cursor-pointer fs-6'
                          title='Click Hear'
                          onClick={() => handleShowProDtl(data.projectID)}
                          >
                            {data.projectName}
                          </span>
                          <span className='text-muted fw-bold d-block fs-6'>
                            {data.customerName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.projectAmount}
                          </span>
                        </td>

                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.addonItemTotalAmount}
                          </span>
                        </td>

                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.finalAmount}
                          </span>
                        </td>

                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.paidAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.remainingamount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.statusName}
                          </span>
                        </td>
                        {/* <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/account-reports/project-report/view/${data.projectID}`,
                              state: {
                                projectID: data.projectID,
                                customerName: data.customerName,
                                projectAmount: data.vendorCost,
                                paidAmount: data.paidAmount,
                                remainingAmount: data.remainingamount,
                              },
                            }}
                            className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td> */}
                      </tr>
                    )
                  })}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
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
      <ProjectDetailsModel
        data={state.projectDtlData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
      {/* =====================Image Model=================== */}
    </>
  )
}

export default SundryDebtorReportList
