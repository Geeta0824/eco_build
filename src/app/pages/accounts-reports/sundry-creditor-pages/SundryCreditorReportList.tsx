import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Link, useLocation, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import ExcelJS from 'exceljs'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import moment from 'moment'
import * as XLSX from 'xlsx'
import {
  ExportExcelSundryCreditorsListByVendorIDApi,
  getSundryCreditorsListByVendorIDApi,
} from '../../../modules/accounts-reports/sundry-credit-report-pages/SundryCreditorsReportCRUD'
import {ISundryCreditorsModel} from '../../../models/accounts-reports/ISundryCreditorsModel'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {getVenderWebList} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'

interface ISundryCredit {
  loading: boolean
  sundryCreditorsReportData: ISundryCreditorsModel[]
  tmpSundryCreditorsReportData: ISundryCreditorsModel[]
  vendorData: IVenderModel[]
  projectDtlData: IProjectModel[]
  PDFShow: string
  SearchText: string
  selVendorName: string
  activeID: number
  selVendorID: number
  activeType: any
  pathUrl: any
  mainSearch: string
}

type Props = {}

const SundryCreditorReportList: React.FC<Props> = () => {
  const history = useHistory()
  const location = useLocation()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<ISundryCredit>({
    loading: false,
    sundryCreditorsReportData: [] as ISundryCreditorsModel[],
    tmpSundryCreditorsReportData: [] as ISundryCreditorsModel[],
    vendorData: [] as IVenderModel[],
    projectDtlData: [] as IProjectModel[],
    PDFShow: '',
    SearchText: '',
    selVendorName: '',
    activeID: 0,
    selVendorID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      const lc: any = location.state
      console.log(lc)
      let mainSearch = lc.mainSearch
      let mainSearchh = lc.mainSearchh
      let VendorID: number = 0
      let VendorName: string = ''

      if (lc !== undefined) {
        VendorID = lc.vendorID
        VendorName = lc.vendorName
      }
      getVenderData(VendorID, VendorName, mainSearch)
    }, 100)
  }, [])

  function getVenderData(vendorID: number, VendorName: string, mainSearch: string) {
    getVenderWebList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getSundryCreditorData(vendorID, responseData, VendorName, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getSundryCreditorData(
    vendorID: number,
    temVendorData: IVenderModel[],
    vendorName: string,
    mainSearch: string
  ) {
    getSundryCreditorsListByVendorIDApi(vendorID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.vendorName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.vendorCost.toString().includes(mainSearch.toLowerCase()) ||
                user.paidAmount.toString().includes(mainSearch.toLowerCase()) ||
                user.remainingamount.toString().includes(mainSearch.toLowerCase()) ||
                user.customerName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              sundryCreditorsReportData: responseData,
              tmpSundryCreditorsReportData: responseData,
              vendorData: temVendorData,
              selVendorID: vendorID,
              selVendorName: vendorName,
              mainSearch,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              sundryCreditorsReportData: responseData,
              tmpSundryCreditorsReportData: responseData,
              vendorData: temVendorData,
              selVendorID: vendorID,
              selVendorName: vendorName,
              mainSearch,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, sundryCreditorsReportData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, sundryCreditorsReportData: [], loading: false})
      })
  }

  // ======================List Api================================

  function exportExcelData(temVendorName: string) {
    ExportExcelSundryCreditorsListByVendorIDApi(state.selVendorID)
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
          // XLSX.writeFile(
          //   workbook,
          //   `SundryCreditor_${temVendorName}-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`
          // )

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('SundryCreditor')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Project Name', key: 'projectName', width: 30},
            {header: 'Vendor Name', key: 'vendorName', width: 25},
            {header: 'Customer Name', key: 'customerName', width: 25},
            {header: 'Vendor Cost', key: 'vendorCost', width: 20},
            {header: 'Paid Amount', key: 'paidAmount', width: 20},
            {header: 'Remaining Amount', key: 'remainingamount', width: 20},
            {header: 'Remarks', key: 'remarks', width: 35},
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
              vendorName: item.vendorName,
              customerName: item.customerName,
              vendorCost: item.vendorCost,
              paidAmount: item.paidAmount,
              remainingamount: item.remainingamount,
              remarks: item.remarks,
            })
          })

          // Write to Excel file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `SundryCreditor_${moment(new Date()).format('YYYYMMDD')}.xlsx`
            link.click()
          })
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

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'vendorID') {
      getVenderData(parseInt(value), state.selVendorName, state.mainSearch)
    }
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
  const currentPosts: ISundryCreditorsModel[] = state.sundryCreditorsReportData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpSundryCreditorsReportData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorCost.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.remainingamount.toString().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, sundryCreditorsReportData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, sundryCreditorsReportData: state.tmpSundryCreditorsReportData})
      // If the text field is empty, show all users
      setTotal(state.tmpSundryCreditorsReportData.length)
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
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/account-reports/sundry-creditor/list',
              state: {
                vendorID: state.selVendorID,
                mainSearch: state.mainSearch,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0' style={{backgroundColor: '#000000'}}>
          <div className='border-0 col-xl-3 mt-5'>
            <span className='w-100 position-relative '>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='lineHeightByD form-control form-control-solid px-15 bg-white'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </span>
          </div>
          <div className='col-xl-3 col-sm-6'>
            <label className='form-label fw-bold text-white'>Select Vendor :</label>
            <div className='col-11 fv-row'>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='vendorID'
              >
                <option selected={state.selVendorID === 0 ? true : false} value={0}>
                  Select Vendor
                </option>
                {state.vendorData.length > 0 &&
                  state.vendorData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.vendorID}
                        selected={data.vendorID == state.selVendorID ? true : false}
                      >
                        {data.companyName}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>
          <div className='col-xl-2 mt-6'>
            <span
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to export Excel sheet'
            >
              <span
                className='btn btn-sm btn-light-primary bg-white'
                onClick={() => exportExcelData(state.selVendorName)}
              >
                <KTSVG path='/media/icons/duotune/files/fil002.svg' className='svg-icon-3' />
                Export Excel
              </span>
            </span>
          </div>
          <div className='col-1 text-end mt-6'>
            <Link
              to={{
                pathname: `/account-reports/sundry-creditor/view/download`,
                state: {
                  vendorID: state.selVendorID,
                  vendorName: state.selVendorName,
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
                  <th className='min-w-125px ms-4'>Vendor Name</th>
                  <th className='min-w-125px '>Project Name</th>
                  <th className='min-w-125px '>Customer Name</th>
                  <th className='min-w-125px '>Vendor Cost</th>
                  <th className='min-w-125px '>Paid Amount</th>
                  <th className='min-w-125px '>Rem Amount</th>
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
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.vendorName}
                          </span>
                        </td>
                        <td>
                          <span
                            className='text-dark text-hover-primary cursor-pointer fs-6'
                            title='Click Hear'
                            onClick={() => handleShowProDtl(data.projectID)}
                          >
                            {data.projectName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.customerName}
                          </span>
                        </td>

                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.vendorCost}
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

export default SundryCreditorReportList
