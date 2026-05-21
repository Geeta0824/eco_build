import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import ExcelJS from 'exceljs'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import moment from 'moment'
import * as XLSX from 'xlsx'
import Search from 'antd/es/transfer/search'
import {GetProjectStatusForDropDownListAPI} from '../../../modules/master-page/project-status-master-page/ProjectStatusCRUD'
import {IProjectStatusModel} from '../../../models/master-page/IProjectStatusModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {
  ExportExcelGetProjectProfitLossReportAPI,
  getProjectProfitLossReportListByFilterApi,
} from '../../../modules/accounts-reports/project-profit-loss-report/ProjectProfitLossReportCRUD'
import {IProjectProfitLossModel} from '../../../models/accounts-reports/IProjectProfitLossModel'
import {
  getAllProjectListAPI,
  getGetProjectDetailsList_ByProjectIDAPI,
} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'

interface IProjectReport {
  loading: boolean
  projectReportsData: IProjectProfitLossModel[]
  tmpProjectReportsData: IProjectProfitLossModel[]
  projectStatusData: IProjectStatusModel[]
  projectData: IProjectModel[]
  temProjectData: IProjectModel[]
  projectDtlData: IProjectModel[]
  pathUrl: any
  selPmcWorkStageID: number
  selTotalBalance: number
  selTotalExpenseAmount: number
  selTotalProjectAmount: number
  selProjectName: string
  selProjectID: number
  mainSearch: string
}

type Props = {}

const ProjectProjectProfitLossReportList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IProjectReport>({
    loading: false,
    projectReportsData: [] as IProjectProfitLossModel[],
    tmpProjectReportsData: [] as IProjectProfitLossModel[],
    projectStatusData: [] as IProjectStatusModel[],
    projectData: [] as IProjectModel[],
    temProjectData: [] as IProjectModel[],
    projectDtlData: [] as IProjectModel[],
    pathUrl: process.env.REACT_APP_API_URL,
    selPmcWorkStageID: 0,
    selTotalBalance: 0,
    selTotalExpenseAmount: 0,
    selTotalProjectAmount: 0,
    selProjectName: '',
    selProjectID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      let projectName: string = ''
      let projectID: number = 0
      let pmcWorkStageID: number = 0
      if (lc != undefined) {
        mainSearch = lc.search
        projectName = lc.projectName
        projectID = lc.projectID
        pmcWorkStageID = lc.pmcWorkStageID
      }
      getPMCWorkWorkStageData(mainSearch, projectName, projectID, pmcWorkStageID)
    }, 100)
  }, [])

  function getPMCWorkWorkStageData(
    mainSearch: string,
    projectName: string,
    projectID: number,
    pmcWorkStageID: number
  ) {
    GetProjectStatusForDropDownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getProjectReportListData(
            responseData,
            // state.selPmcWorkStageID,
            // state.selProjectID,
            pmcWorkStageID,
            projectID,
            projectName,
            // state.selProjectName,
            mainSearch
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectStatusData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, projectStatusData: [], loading: false})
      })
  }

  // ======================List Api================================
  function getProjectReportListData(
    projectStatusData: IProjectStatusModel[],
    PmcWorkStageID: number,
    ProjectID: number,
    ProjectName: string,
    mainSearch: string
  ) {
    getProjectProfitLossReportListByFilterApi(PmcWorkStageID, ProjectID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let tmpTotalBalance = response.data.totalBalance
          let tmpTotalExpenseAmount = response.data.totalExpenseAmount
          let tmpTotalProjectAmount = response.data.totalProjectAmount
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.projectAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.projectStatusName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.expenseAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.customerName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })
            setState({
              ...state,
              projectReportsData: results,
              tmpProjectReportsData: responseData,
              selTotalBalance: tmpTotalBalance,
              selTotalExpenseAmount: tmpTotalExpenseAmount,
              selTotalProjectAmount: tmpTotalProjectAmount,
              projectStatusData: projectStatusData,
              selProjectID: ProjectID,
              selProjectName: ProjectName,
              selPmcWorkStageID: PmcWorkStageID,
              loading: false,
            })
          } else {
            setState({
              ...state,
              projectReportsData: responseData,
              tmpProjectReportsData: responseData,
              selTotalBalance: tmpTotalBalance,
              selTotalExpenseAmount: tmpTotalExpenseAmount,
              selTotalProjectAmount: tmpTotalProjectAmount,
              projectStatusData: projectStatusData,
              selProjectID: ProjectID,
              selProjectName: ProjectName,
              selPmcWorkStageID: PmcWorkStageID,
              loading: false,
            })
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectReportsData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, projectReportsData: [], loading: false})
      })
  }

  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }

  function getAllProjectData() {
    getAllProjectListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectData: responseData,
            temProjectData: responseData,
            loading: false,
          })
          setShow(true)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          loading: false,
        })
      })
  }

  function selectProject(tmpProjectData: IProjectModel) {
    getProjectReportListData(
      state.projectStatusData,
      state.selPmcWorkStageID,
      tmpProjectData.projectID,
      tmpProjectData.projectName,
      state.mainSearch
    )
    setShow(false)
  }

  // ================= SerchText Project Filter ===========

  const [projectName, setProjectName] = useState('')

  // ------------------- the search result-----------------
  const ProjectFilter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temProjectData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.entryDate.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toString()) ||
          user.remainingAmount.toString().includes(keyword.toString()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectData: results})
    } else {
      setState({...state, projectData: state.temProjectData})
    }
    setProjectName(keyword)
  }

  // ----------------------------------------------------------------------------------
  function exportExcelData() {
    ExportExcelGetProjectProfitLossReportAPI(state.selPmcWorkStageID, state.selProjectID)
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
          // if (state.selProjectID > 0) {
          //   XLSX.writeFile(
          //     workbook,
          //     `Project_Profit_Loss_Report_${state.selProjectName}${moment(new Date()).format(
          //       'YYYYMMDD'
          //     )}.xlsx`
          //   )
          // } else {
          //   XLSX.writeFile(
          //     workbook,
          //     `Project_Profit_Loss_Report_All${moment(new Date()).format('YYYYMMDD')}.xlsx`
          //   )
          // }

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('ProjectProfitLossReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Project Name', key: 'projectName', width: 35},
            {header: 'Create Date', key: 'createDate', width: 15},
            {header: 'Project Status Name', key: 'projectStatusName', width: 35},
            {header: 'Customer Name', key: 'customerName', width: 25},
            {header: 'Project Amount', key: 'projectAmount', width: 20},
            {header: 'Expense Amount', key: 'expenseAmount', width: 20},
            {header: 'Balance Amount', key: 'balanceAmount', width: 20},
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
          let totalProjectAmountSum = 0
          let totalExpenseAmountSum = 0
          let totalBalanceAmountSum = 0
          responseData.forEach((item: any) => {
            worksheet.addRow({
              projectName: item.projectName,
              createDate: item.createDate,
              projectStatusName: item.projectStatusName,
              customerName: item.customerName,
              projectAmount: item.projectAmount,
              expenseAmount: item.expenseAmount,
              balanceAmount: item.balanceAmount,
            })
            totalProjectAmountSum += item.projectAmount
            totalExpenseAmountSum += item.expenseAmount
            totalBalanceAmountSum += item.balanceAmount
          })

          const totalRow = worksheet.addRow({
            projectName: 'Total', // Label for total row
            createDate: '', // Label for total row
            projectStatusName: '', // Label for total row
            customerName: '', // Label for total row
            projectAmount: totalProjectAmountSum, // The sum of total balances
            expenseAmount: totalExpenseAmountSum, // The sum of total balances
            balanceAmount: totalBalanceAmountSum, // The sum of total balances
          })

          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(2).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(3).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(4).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(5).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(6).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(7).font = {bold: true} // Bold the total balance sum
          // totalRow.getCell(2).numFmt = '"₹"#,##0.00'; // Example: format as currency
          totalRow.getCell(1).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(2).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(3).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(4).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(5).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(6).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(7).numFmt = '#,##0.00' // Example: format as currency
          totalRow.eachCell((cell) => {
            cell.alignment = {vertical: 'middle', horizontal: 'center'} // Center alignment
            cell.border = {
              top: {style: 'thin', color: {argb: '000000'}}, // Top border for total row
              right: {style: 'thin', color: {argb: '000000'}}, // Right border
              bottom: {style: 'thin', color: {argb: '000000'}}, // Right border
            }
          })

          // Write to Excel file
          if (state.selProjectID > 0) {
            workbook.xlsx.writeBuffer().then((buffer) => {
              const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              })

              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.download = `Project_Profit_Loss_Report_${moment(new Date()).format(
                'YYYYMMDD'
              )}.xlsx`
              link.click()
            })
          } else {
            workbook.xlsx.writeBuffer().then((buffer) => {
              const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              })

              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.download = `Project_Profit_Loss_Report_All${moment(new Date()).format(
                'YYYYMMDD'
              )}.xlsx`
              link.click()
            })
          }
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          loading: false,
        })
      })
  }

  // ----------Stage Select change Function------------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    getProjectReportListData(
      state.projectStatusData,
      parseInt(value),
      state.selProjectID,
      state.selProjectName,
      state.mainSearch
    )
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    getProjectReportListData(state.projectStatusData, 0, 0, '', '')
    setName('')
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProjectReportsData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toLowerCase()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.expenseAmount.toString().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectReportsData: results})
    } else {
      setState({...state, projectReportsData: state.tmpProjectReportsData})
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
          <label className='text-white me-5 mt-6 fs-5'>Select Project : </label>
          <span className='mt-6 fw-bolder text-primary d-flex align-item-center fs-5'>
            {state.selProjectName}
          </span>
          <div className='fv-row'>
            <div
              className='mt-6 btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 p-5 ms-6'
              onClick={getAllProjectData}
            >
              <KTSVG
                path='/media/icons/duotune/general/gen004.svg'
                className='svg-icon-2 svg-icon-white'
              />
            </div>
          </div>
          <div className='mb-2 col-xl-2 col-sm-6 px-1'>
            <label className='form-label fw-bold text-white'>Stage :</label>
            <div className='col-12 fv-row'>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='pmcWorkStageData'
              >
                <option selected={state.selPmcWorkStageID === 0 ? true : false} value={0}>
                  Stage Type
                </option>
                {state.projectStatusData.length > 0 &&
                  state.projectStatusData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.projectStatusID}
                        selected={data.projectStatusID == state.selPmcWorkStageID ? true : false}
                      >
                        {data.projectStatusName}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>
          <div className='mb-2 col-xl-3 col-sm-6 px-1'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
          </div>
          <div className=' mt-6 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
            <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
              Reset
            </button>
          </div>

          <div className='col-2 text-end mt-7 px-1'>
            <span
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
          <div className='col-1 text-end mt-6'>
            <Link
              to={{
                pathname: `/account-reports/project-profit-loss/download`,
                state: {
                  pmcWorkStageID: state.selPmcWorkStageID,
                  projectID: state.selProjectID,
                  ProjectName: state.selProjectName,
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

          {/* </div> */}
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
                  <th className='min-w-125px ms-4'>Project Date</th>
                  <th className='min-w-125px '>Project Name</th>
                  <th className='min-w-125px '>Customer Name</th>
                  <th className='min-w-125px '>Project Amount</th>
                  <th className='min-w-125px '>Total Expense</th>
                  <th className='min-w-125px '>Total Profit |Loss</th>
                  <th className='min-w-25px '>Project Status</th>
                  {/* <th className='min-w-125px '>Balance</th>
                  <th className='min-w-125px'>Stage Name</th>
                  <th className='min-w-40px'>View</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {state.projectReportsData.length > 0 &&
                  state.projectReportsData.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.createDate}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span
                                className='text-dark text-hover-primary fs-6 cursor-pointer'
                                title='Click Hear'
                                onClick={() => handleShowProDtl(data.projectID)}
                              >
                                {data.projectName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.customerName}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.projectAmount}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.expenseAmount}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.balanceAmount}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.paidAmount}
                              </span>
                            </div>
                          </div>
                        </td> */}
                        {/* <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.remainingAmount}
                              </span>
                            </div>
                          </div>
                        </td> */}
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.projectStatusName}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/account-reports/project-report/view/${data.projectID}`,
                              state: {
                                projectID: data.projectID,
                                customerName: data.customerName,
                                projectAmount: data.projectAmount,
                                paidAmount: data.paidAmount,
                                remainingAmount: data.remainingAmount,
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

                <tr className='text-dark'>
                  <td className='text-start fw-bolder fs-6'>Total</td>
                  <td className='text-start'></td>
                  <td className='text-start'></td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.selTotalProjectAmount}
                  </td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.selTotalExpenseAmount}
                  </td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.selTotalBalance}
                  </td>
                  <td className='text-start' colSpan={5}></td>
                </tr>
                <BlankDataImageInTable
                  length={state.projectReportsData.length}
                  loading={state.loading}
                  colSpan={5}
                />
              </tbody>
            </table>
          </div>
          {/* <div className='text-center'>
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
          </div> */}
        </div>
      </div>

      {/* =====================Image Model=================== */}

      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Project Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  onChange={ProjectFilter}
                  value={projectName}
                />
              </form>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder fs-5 text-center'>
                    <th className='min-w-150px'>
                      <span className='d-block text-primaryMain mb-1 ps-1'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='text-primary d-block mb-1'>Customer Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Category Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 text-primaryMain text-center'>
                        Project Amount
                      </span>
                    </th>
                    <th className='min-w-150px text-center fw-bold'>
                      <span className='text-success'>Additional Amount</span>
                      <span className='d-block text-info'>Final Amount</span>
                    </th>
                    <th className='min-w-150px text-center fw-bold'>
                      <span className='text-success'>Paid Amount</span>
                      <span className='d-block text-info'>Remaining Amount</span>
                    </th>
                    <th className='min-w-50px'>
                      <span className='mb-1'>Project Status</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.projectData.length > 0 &&
                    state.projectData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary text-center'
                          }
                          onClick={() => selectProject(data)}
                        >
                          <td>
                            <span className='text-primaryMain text-hover-primary d-block ps-1'>
                              {data.projectName}
                            </span>
                          </td>
                          <td>
                            <span className='text-primary text-hover-primary d-block'>
                              {data.firstName + ' ' + data.lastName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block'>
                              {data.projectCategoryName}
                            </span>
                          </td>{' '}
                          <td className='text-center'>
                            <span className='text-primaryMain text-hover-primary d-block'>
                              {data.projectAmount}
                            </span>
                          </td>
                          <td className='text-center'>
                            <span className='text-success d-block mb-1'>
                              {data.additionalAmount}
                            </span>
                            <span className='text-info d-block'>{data.finalAmount}</span>
                          </td>
                          <td className='text-center'>
                            <span className='text-success d-block mb-1'>{data.paidAmount}</span>
                            <span className='text-info d-block'>{data.remainingAmount}</span>
                          </td>
                          <td className='min-w-50 pe-1'>
                            <span className='text-dark text-hover-primary'>
                              {data.projectStatusName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ProjectDetailsModel
        data={state.projectDtlData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
    </>
  )
}

export default ProjectProjectProfitLossReportList
