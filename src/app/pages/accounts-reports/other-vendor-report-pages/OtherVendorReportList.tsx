import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import {getVenderListByVendorTypeID} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {
  IVendorReportModel,
  totalVendorReportModel,
} from '../../../models/accounts-reports/IVendorReportModel'
import {
  ExportExcelVendorReportListApi,
  getOtherVendorReportListByVendorIdApi,
} from '../../../modules/accounts-reports/vendor-report-master/VendortReportCRUD'
import moment from 'moment'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'

type Props = {}

interface IProject {
  loading: boolean
  vendorReportData: IVendorReportModel[]
  temVendorReportData: IVendorReportModel[]
  objVenReportData: totalVendorReportModel
  projectData: IProjectModel[]
  vendorData: IVenderModel[]
  temVendorData: IVenderModel[]
  projectDtlData: IProjectModel[]
  activeID: number
  activeType: any
  selProjectName: string
  selCompanyName: string
  selContactPerson: string
  selContactNo: string
  selProjectID: number
  selProjectAmount: number
  selRemAmount: number
  selPaidAmount: number
  selVendorTypeID: number
  selVendorID: number
  totalVendor: number
  paidAmount: number
  totalAmt: number
  vendorTypeID: number
}

const OtherVendorReportList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IProject>({
    loading: false,
    vendorReportData: [] as IVendorReportModel[],
    temVendorReportData: [] as IVendorReportModel[],
    objVenReportData: {} as totalVendorReportModel,
    projectData: [] as IProjectModel[],
    vendorData: [] as IVenderModel[],
    temVendorData: [] as IVenderModel[],
    projectDtlData: [] as IProjectModel[],
    activeID: 0,
    activeType: false,
    selProjectName: '',
    selCompanyName: '',
    selContactPerson: '',
    selContactNo: '',
    selProjectID: 0,
    selProjectAmount: 0,
    selRemAmount: 0,
    selPaidAmount: 0,
    selVendorTypeID: 0,
    selVendorID: 0,
    totalVendor: 0,
    paidAmount: 0,
    totalAmt: 0,
    vendorTypeID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    let vendorID = 0
    let vendorTypeID = 0
    if (lc !== undefined) {
      vendorID = lc.vendorID
      vendorTypeID = lc.vendorTypeID
    }
    setTimeout(() => {
      if (vendorID == 0 && vendorTypeID == 0) {
        getVenderByVendorTypeIDData(vendorTypeID)
      } else {
        getVenderByVendorTypeIDDataFromEye(vendorID, vendorTypeID)
      }
    }, 100)
  }, [])

  function getVenderByVendorTypeIDDataFromEye(vendorID: number, vendorTypeID: number) {
    getVenderListByVendorTypeID(vendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (vendorID !== 0) {
            let tmpVdData = [] as IVenderModel[]
            tmpVdData = responseData
            for (let k in tmpVdData) {
              if (vendorID == tmpVdData[k].vendorID) {
                getAllProjectDataByProjectID(tmpVdData[k], responseData)
                // tmpVdData[k].workCompleteDate = tmpValue
                break
              }
            }
          }
          // setState({
          //   ...state,
          //   vendorData: responseData,
          //   temVendorData: responseData,
          //   loading: false,
          // })
          // setTotalVendor(responseData.length)
          // setPageVendor(1)
          setName('')
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

  function getAllProjectDataByProjectID(tmpVendortData: IVenderModel, vendorData: IVenderModel[]) {
    getOtherVendorReportListByVendorIdApi(tmpVendortData.vendorID)
      .then((response) => {
        let responseData = response.data
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorReportData: responseData.responseObject,
            temVendorReportData: responseData.responseObject,
            selVendorID: tmpVendortData.vendorID,
            selVendorTypeID: tmpVendortData.vendorTypeID,
            selCompanyName: tmpVendortData.companyName,
            selContactNo: tmpVendortData.contactNumber,
            selContactPerson: tmpVendortData.contactPerson,
            objVenReportData: responseData,
            temVendorData: vendorData,
            vendorData: vendorData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            vendorReportData: [],
            temVendorReportData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          vendorReportData: [],
          temVendorReportData: [],
          loading: false,
        })
      })
  }

  function getVenderByVendorTypeIDData(temVendorTypeID: number) {
    getVenderListByVendorTypeID(temVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorData: responseData,
            temVendorData: responseData,
            selVendorTypeID: temVendorTypeID,
            loading: false,
          })
          setTotalVendor(responseData.length)
          setPageVendor(1)
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
  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }
  function handleShowVendor() {
    if (state.selVendorTypeID == 0) {
      toast.error(`Please Select Vendor Type`)
    } else {
      setShowVendor(true)
    }
  }
  function selectVendor(tmpVendortData: IVenderModel) {
    getAllProjectDataByProjectID(tmpVendortData, state.temVendorData)

    setShowVendor(false)
  }

  // --------------------------------------------------------------
  function exportExcelData() {
    ExportExcelVendorReportListApi(state.selVendorID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            loading: false,
          })

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('OtherVendorReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Project Name', key: 'projectName', width: 26},
            {header: 'Project Category Name', key: 'projectCategoryName', width: 25},
            {header: 'Customer Name', key: 'customerName', width: 20},
            {header: 'Mobile Number', key: 'mobileNumber', width: 13},
            {header: 'Email', key: 'email', width: 26},
            {header: 'Vendor Cost', key: 'vendorCost', width: 15},
            {header: 'Paid Amount', key: 'paidAmount', width: 15},
            {header: 'Remaining Amount', key: 'remainingAmount', width: 20},
            {header: 'Due Amount', key: 'dueAmount', width: 15},
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

          let totalVendorCost = 0
          let totalPaidAmount = 0
          let totalRemainingAmount = 0
          let totalDueAmount = 0
          // Add data rows
          responseData.forEach((item: any) => {
            worksheet.addRow({
              projectName: item.projectName,
              projectCategoryName: item.projectCategoryName,
              customerName: item.customerName,
              mobileNumber: item.mobileNumber,
              email: item.email,
              vendorCost: item.vendorCost,
              paidAmount: item.paidAmount,
              remainingAmount: item.remainingAmount,
              dueAmount: item.dueAmount,
            })
            totalVendorCost += item.vendorCost
            totalPaidAmount += item.paidAmount
            totalRemainingAmount += item.remainingAmount
            totalDueAmount += item.dueAmount
          })

          const totalRow = worksheet.addRow({
            projectName: 'Total',
            projectCategoryName: '',
            customerName: '',
            mobileNumber: '',
            email: '',
            vendorCost: totalVendorCost,
            paidAmount: totalPaidAmount,
            remainingAmount: totalRemainingAmount,
            dueAmount: totalDueAmount,
          })
          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          // totalRow.getCell(5).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(6).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(7).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(8).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(9).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(6).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(7).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(8).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(9).numFmt = '#,##0.00' // Example: format as currency
          totalRow.eachCell((cell) => {
            cell.alignment = {vertical: 'middle', horizontal: 'center'} // Center alignment
            cell.border = {
              top: {style: 'thin', color: {argb: '000000'}}, // Top border for total row
              right: {style: 'thin', color: {argb: '000000'}}, // Right border
              bottom: {style: 'thin', color: {argb: '000000'}}, // Right border
            }
          })
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `Other_Vendor_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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
  // ====================Pagination==============
  const onShowSizeChangeVendor = (current: any, pageSizeVendor: any) => {
    setPostPerPageVendor(pageSizeVendor)
  }
  const [totalVendor, setTotalVendor] = useState(0)
  const [pageVendor, setPageVendor] = useState(1)
  const [postPerPageVendor, setPostPerPageVendor] = useState(10)
  const indexOfLastPageVendor = pageVendor * postPerPageVendor
  const indexOfFirstPageVendor = indexOfLastPageVendor - postPerPageVendor
  const currentPostsVendor: IVenderModel[] = state.vendorData.slice(
    indexOfFirstPageVendor,
    indexOfLastPageVendor
  )
  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.temVendorData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.address.toLowerCase().includes(keyword.toLowerCase()) ||
          user.aboutVendor.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, vendorData: results})
      setTotalVendor(results.length)
      setPageVendor(1)
    } else {
      setState({...state, vendorData: state.temVendorData})
      setTotalVendor(state.temVendorData.length)
      setPageVendor(1)
    }

    setName(keyword)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'vendorTypeID' && elementId !== 1) {
      getVenderByVendorTypeIDData(parseInt(value))
    }
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
        <div className='card-header border-0 row' style={{backgroundColor: '#000000'}}>
          <div className='row mb-2 '>
            <label className='col-lg-3  text-white fs-5 mt-4'>
              <span className=''> Select Vendor Type :</span>
            </label>
            <div className='col-lg-3 fv-row mt-4'>
              <select
                className='form-select lineHeightByD'
                aria-label='Default select example'
                onChange={selectChange}
                id='vendorTypeID'
              >
                <option selected={state.selVendorTypeID == 0 ? true : false} value={0}>
                  Select Vendor Type
                </option>
                <option selected={state.selVendorTypeID == 2 ? true : false} value={2}>
                  Supplier
                </option>
                <option selected={state.selVendorTypeID == 3 ? true : false} value={3}>
                  Individual
                </option>
                {/* {venderTypeData.length > 0 &&
                  venderTypeData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.vendorTypeID}
                        selected={state.selVendorTypeID == data.vendorTypeID ? true : false}
                      >
                        {data.vendorTypeName}
                      </option>
                    )
                  })} */}
              </select>
            </div>
            <div className={state.selVendorID > 0 ? 'col-sm-5 mt-3 text-end' : 'd-none'}>
              <span
                className='text-end mt-6'
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
            <div className={state.selVendorID > 0 ? 'col-1 mt-3' : 'd-none'}>
              <Link
                to={{
                  pathname: `/account-reports/other-vendor/download/${state.selVendorID}`,
                  state: {
                    vendorID: state.selVendorID,
                    companyName: state.selCompanyName,
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

          <div className='d-flex'>
            <label className=' text-white me-5 mt-3 fs-5'>Select Vendor :</label>
            <span className='mt-3 fw-bold text-primary d-flex align-item-center fs-5'>
              {state.selCompanyName}
            </span>
            <div className='fv-row'>
              <div
                className='mb-2 btn btn-icon btn-bg-primary bg-hover-dark text-hover-inverse-dark btn-sm me-1 ms-6'
                onClick={handleShowVendor}
              >
                <KTSVG
                  path='/media/icons/duotune/general/gen004.svg'
                  className='svg-icon-2 svg-icon-white'
                />
              </div>
            </div>
          </div>
          <div className={state.selVendorID === 0 ? 'd-none' : 'row mb-2'}>
            <div className='col-4 '>
              <label className='text-white fs-5'>Contact Person : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>{state.selContactPerson}</span>
            </div>
            <div className='col-4'>
              <label className='text-white fs-5'>Contact Number : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>{state.selContactNo}</span>
            </div>
            <div className='col-4 '>
              <label className='text-white fs-5'>Vendors Tatal Cost : &nbsp;</label>
              <span className='text-primary fw-bold  fs-5'>
                {state.objVenReportData.totalVendorCost}
              </span>
            </div>
          </div>
          <div className='row mb-4'>
            <div className='col-4'>
              <label className='text-white fs-5'>Total Paid Amt : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>
                {state.objVenReportData.totalPaidAmount}
              </span>
            </div>
            <div className='col-4'>
              <label className='text-white fs-5'>Balance : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>
                {state.objVenReportData.totalRemainingAmount}
              </span>
            </div>
            <div className='col-4'>
              <label className='text-white fs-5'>Due Amount : &nbsp;</label>
              <span className='text-primary fw-bold fs-5'>
                {state.objVenReportData.totalDueAmount}
              </span>
            </div>
          </div>

          {/* end::Header */}
        </div>
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-6'>
                  <th className='min-w-150px'>
                    <span className=' text-dark d-block mb-1'>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-7'>Project Category Name</span>
                  </th>
                  <th className='min-w-140px'>
                    <span className='d-block mb-1'>Customer Name</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-block mb-1'>Vendor Amount</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-block mb-1'>Paid Amount</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-block mb-1'>Balance</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-block mb-1'>Due Amount</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-block mb-1 text-center'>View</span>
                  </th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {state.vendorReportData.length > 0 &&
                      state.vendorReportData.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <span
                                className='text-dark text-hover-primary d-block mb-1 fs-6  cursor-pointer'
                                title='Click Hear'
                                onClick={() => handleShowProDtl(data.projectID)}
                              >
                                {data.projectName}
                              </span>
                              <span className='text-muted text-hover-primary d-block mb-1 fs-6'>
                                {data.projectCategoryName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.customerName}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.vendorCost}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark  text-hover-primary d-block mb-1 fs-6'>
                                {data.paidAmount}
                              </span>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.remainingAmount}
                              </span>
                            </td>
                            <td className='text-center'>
                              {data.projectCategoryID === 1 ? (
                                <>
                                  {data.dueAmount > 0 ? (
                                    <Link
                                      to={{
                                        pathname: `/account-reports/other-vendor/amount-due-details`,
                                        state: {
                                          projectData: data,
                                          vendorID: state.selVendorID,
                                          vendorTypeID: state.vendorTypeID,
                                          companyName: state.selCompanyName,
                                          contactPerson: state.selContactPerson,
                                          vendorCost: data.vendorCost,
                                          paidAmount: data.paidAmount,
                                          remainingAmount: data.remainingAmount,
                                        },
                                      }}
                                      className='text-hover-success mb-1 fs-7 badge badge-secondary fw-bolder cursor-pointer text-center'
                                      data-bs-toggle='tooltip'
                                      data-bs-placement='top'
                                      title='Click To See Amount Due Details'
                                    >
                                      <span className='text-info text-hover-success'>
                                        <u>{data.dueAmount}</u>
                                      </span>
                                    </Link>
                                  ) : (
                                    <span className='text-hover-success mb-1 fs-7 badge badge-secondary fw-bolder cursor-pointer text-center text-info'>
                                      <u>{data.dueAmount}</u>
                                    </span>
                                  )}
                                </>
                              ) : data.projectCategoryID === 2 ? (
                                <>
                                  {data.dueAmount > 0 ? (
                                    <Link
                                      to={{
                                        pathname: `/account-reports/other-vendor/diy-amount-due-details`,
                                        state: {
                                          projectData: data,
                                          vendorID: state.selVendorID,
                                          vendorTypeID: state.vendorTypeID,
                                          companyName: state.selCompanyName,
                                          contactPerson: state.selContactPerson,
                                          vendorCost: data.vendorCost,
                                          paidAmount: data.paidAmount,
                                          remainingAmount: data.remainingAmount,
                                        },
                                      }}
                                      className='text-hover-dark mb-1 fs-7 badge badge-secondary fw-bolder cursor-pointer text-center'
                                      data-bs-toggle='tooltip'
                                      data-bs-placement='top'
                                      title='Click To See Amount DIY Due Details'
                                    >
                                      <span className='text-primaryMain text-hover-dark'>
                                        <u>{data.dueAmount}</u>
                                      </span>
                                    </Link>
                                  ) : (
                                    <span className='text-primaryMain text-hover-dark mb-1 fs-7 badge badge-secondary fw-bolder cursor-pointer text-center'>
                                      <u>{data.dueAmount}</u>
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  {data.dueAmount > 0 ? (
                                    <Link
                                      to={{
                                        pathname: `/account-reports/other-vendor/modular-amount-due-details`,
                                        state: {
                                          projectData: data,
                                          vendorID: state.selVendorID,
                                          vendorTypeID: state.vendorTypeID,
                                          companyName: state.selCompanyName,
                                          contactPerson: state.selContactPerson,
                                          vendorCost: data.vendorCost,
                                          paidAmount: data.paidAmount,
                                          remainingAmount: data.remainingAmount,
                                        },
                                      }}
                                      className='text-hover-danger mb-1 fs-7 badge badge-secondary fw-bolder cursor-pointer text-center'
                                      data-bs-toggle='tooltip'
                                      data-bs-placement='top'
                                      title='Click To See Amount Modular Due Details'
                                    >
                                      <span className='text-success text-hover-danger'>
                                        <u>{data.dueAmount}</u>
                                      </span>
                                    </Link>
                                  ) : (
                                    <span className='text-success text-hover-danger mb-1 fs-7 badge badge-secondary fw-bolder cursor-pointer text-center'>
                                      <u>{data.dueAmount}</u>
                                    </span>
                                  )}
                                </>
                              )}
                            </td>
                            {/* <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                {data.dueAmount}
                              </span>
                            </td> */}
                            <td className='text-center'>
                              <Link
                                to={{
                                  pathname: `/account-reports/other-vendor/view`,
                                  state: {
                                    projectData: data,
                                    vendorID: state.selVendorID,
                                    vendorTypeID: state.selVendorTypeID,
                                    companyName: state.selCompanyName,
                                    contactPerson: state.selContactPerson,
                                    vendorCost: data.vendorCost,
                                    paidAmount: data.paidAmount,
                                    remainingAmount: data.remainingAmount,
                                  },
                                }}
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-success btn-sm me-1 text-primary text-hover-light'
                                data-bs-toggle='tooltip'
                                data-bs-placement='top'
                                title='View'
                              >
                                <span className='fa fa-eye fs-2'></span>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                  </>
                )}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={state.vendorReportData.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
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
                  onChange={filter}
                  value={name}
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
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Vendor Type Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Company Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPostsVendor.length > 0 &&
                    currentPostsVendor.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            // data.vendorTypeID === 1
                            //   ? 'd-none'
                            // :
                            'bg-hover-light-primary text-hover-primary'
                          }
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {data.vendorTypeID === 2 ? (
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary fs-6'>
                                  {data.companyName}
                                </div>
                              </div>
                            ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )}
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={currentPostsVendor.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPageVendor(value)}
                pageSize={postPerPageVendor}
                total={totalVendor}
                current={pageVendor}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeVendor}
                showTotal={(totalVendor) => `Total ${totalVendor} vendors`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseVendor}>
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

export default OtherVendorReportList
