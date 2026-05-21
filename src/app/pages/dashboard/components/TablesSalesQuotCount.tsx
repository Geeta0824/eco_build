/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  ISalePersonTotalModel,
  ISalesQutModel,
  projectDataPopUp,
} from '../../../models/dashboard-page/IDashboardModel'
import {
  Get_SalesPerson_Wise_Month_Year_QuotationCount_ExcelApi,
  Get_SalesPerson_Wise_Month_Year_QuotationCountApi,
  Get_SalesPerson_Wise_TodayQuotationCountApi,
  GetMonthYearEmpDNCQuotationMstBookApi,
  GetMonthYearEmpModularQuotationMstBookAPI,
  GetMonthYearEmpQuotationMstBookApi,
  GetMonthYearEmpTypeTurnkeyQuotationMstBookApi,
  GetProjectListByStatusIDApi,
} from '../../../modules/dashboard-page/DashboardCRUD'
import {toast} from 'react-toastify'
import {MonthDropdownData, YearsDropdownData} from '../../other-dropDowns/otherDropDowns'
import moment from 'moment'
import ExcelJS from 'exceljs'
import * as XLSX from 'xlsx'
import {Button, Modal} from 'react-bootstrap-v5'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Pagination} from 'antd'

const BASE_API_URL = process.env.REACT_APP_API_URL

type Props = {
  className: string
  lablesNames: any
}
interface IHISTORY {
  loading: boolean
  saleQutContData: ISalesQutModel[]
  projectData: projectDataPopUp[]
  salePersonData: ISalePersonTotalModel
  selYearID: number
  selMonthID: number
  selProjectTypeID: number
  labelId: number
  employeeName: string
  projCategorynm: string
  tmpProjectCateName: string
}

const TablesSalesQuotCount: React.FC<Props> = ({className, lablesNames}) => {
  const [state, setState] = useState<IHISTORY>({
    loading: false,
    saleQutContData: [] as ISalesQutModel[],
    projectData: [] as projectDataPopUp[],
    salePersonData: {} as ISalePersonTotalModel,
    selMonthID: moment().month() + 1,
    selProjectTypeID: 0,
    labelId: 0,
    employeeName: '',
    projCategorynm: '',
    tmpProjectCateName: '',
    selYearID: moment().year(),
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      SalesPersonWiseMonthYearQuotationCountData(state.selMonthID, state.selYearID)
    }, 100)
  }, [])

  function SalesPersonWiseMonthYearQuotationCountData(selMonthID: number, selYearID: number) {
    Get_SalesPerson_Wise_Month_Year_QuotationCountApi(selMonthID, selYearID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            saleQutContData: responseData,
            selMonthID: selMonthID,
            salePersonData: response.data,
            selYearID: selYearID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, saleQutContData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, saleQutContData: [], loading: false})
      })
  } // ===================Year Mode Filter Function===========
  function YearModeValue(event: any) {
    const tmpPaymentModeID = event.target.value

    SalesPersonWiseMonthYearQuotationCountData(state.selMonthID, tmpPaymentModeID)
  }
  // ===================Month Mode Filter Function===========
  function MonthModeValue(event: any) {
    const tmpPaymentModeID = event.target.value

    SalesPersonWiseMonthYearQuotationCountData(tmpPaymentModeID, state.selYearID)
  }

  function exportExcelData() {
    Get_SalesPerson_Wise_Month_Year_QuotationCount_ExcelApi(state.selMonthID, state.selYearID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          console.log(responseData)
          setState({
            ...state,
            loading: false,
          })
          // try {
          //   // Map data keys to custom headers
          //   const worksheetData = responseData.map((item: any) => {
          //     const newItem: any = {}
          //     for (const [key, value] of Object.entries(customHeaders)) {
          //       newItem[value] = item[key]
          //     }
          //     return newItem
          //   })

          //   const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
          //     header: Object.values(customHeaders),
          //   })
          //   const workbook = XLSX.utils.book_new()
          //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
          //   XLSX.writeFile(
          //     workbook,
          //     `Employee Quotations ${moment(new Date()).format('YYYYMMDD')}.xlsx`
          //   )
          // } catch (error) {
          //   console.error('Error generating Excel file:', error)
          // }

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('EmployeeQuotations')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Employee Name', key: 'employeeName', width: 18}, // Manually setting width to 40
            {header: 'Standard Quotation', key: 'cntStd', width: 18}, // Manually setting width to 18
            {header: 'Premuim Quotation', key: 'cntPrm', width: 18}, // Manually setting width to 18
            {header: 'Essential Quotation', key: 'cntEss', width: 18}, // Manually setting width to 18
            {header: 'Premuim Plus Quotation', key: 'cntPremPlus', width: 21}, // Manually setting width to 18
            {header: 'Super Saver Quotation', key: 'cntSuperSav', width: 21}, // Manually setting width to 18
            {header: 'DIY Quotation', key: 'cntDIY', width: 18}, // Manually setting width to 18
            {header: 'Modular Quotation', key: 'cntModular', width: 18}, // Manually setting width to 18
            {header: 'Total Quotation', key: 'totalSaleWise', width: 18}, // Manually setting width to 18
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
          let totalStdSum = 0
          let totalPrmSum = 0
          let totalEssSum = 0
          let totalPrmPluSum = 0
          let totalSupSavSum = 0
          let totalDiySum = 0
          let totalModuSum = 0
          let totalSalSum = 0
          responseData.forEach((item: any) => {
            worksheet.addRow({
              employeeName: item.employeeName,
              cntStd: item.cntStd,
              cntPrm: item.cntPrm,
              cntEss: item.cntEss,
              cntPremPlus: item.cntPremPlus,
              cntSuperSav: item.cntSuperSav,
              cntDIY: item.cntDIY,
              cntModular: item.cntModular,
              totalSaleWise: item.totalSaleWise,
            })
            totalStdSum += item.cntStd
            totalPrmSum += item.cntPrm
            totalEssSum += item.cntEss
            totalPrmPluSum += item.cntPremPlus
            totalSupSavSum += item.cntSuperSav
            totalDiySum += item.cntDIY
            totalModuSum += item.cntModular
            totalSalSum += item.totalSaleWise
          })

          const totalRow = worksheet.addRow({
            employeeName: 'Total', // Label for total row
            cntStd: totalStdSum, // The sum of total balances
            cntPrm: totalPrmSum, // The sum of total balances
            cntEss: totalEssSum, // The sum of total balances
            cntPremPlus: totalPrmPluSum, // The sum of total balances
            cntSuperSav: totalSupSavSum, // The sum of total balances
            cntDIY: totalDiySum, // The sum of total balances
            cntModular: totalModuSum, // The sum of total balances
            totalSaleWise: totalSalSum, // The sum of total balances
          })

          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(2).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(3).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(4).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(5).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(6).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(7).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(8).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(9).font = {bold: true} // Bold the total balance sum
          // totalRow.getCell(2).numFmt = '"₹"#,##0.00'; // Example: format as currency
          totalRow.getCell(2).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(3).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(4).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(5).numFmt = '#,##0.00' // Example: format as currency
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
          // Write to Excel file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `Employee Quotations${moment(new Date()).format('YYYYMMDD')}.xlsx`
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
          // productCategory: [],
          loading: false,
        })
      })
  }

  // Custom headers mapping: original key -> new header name
  const customHeaders = {
    employeeName: 'Employee Name',
    cntStd: 'Standard Quotation',
    cntPrm: 'Premuim Quotation',
    cntEss: 'Essential Quotation',
    cntPremPlus: 'Premuim Plus Quotation',
    cntSuperSav: 'Super Saver Quotation',
    cntDIY: 'DIY Quotation',
    cntModular: 'Modular Quotation',
    totalSaleWise: 'Total Quotation',
  }
  // ========================================================
  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)
  const handleShow = (projectTypeId: number, employeeID: number, label: number) => {
    setShowModal(true)
    setState({...state, loading: true})
    let projCategorynm =
      label == 4
        ? // ? 'DIY'
          // : label == 2
          // ? 'Modular'
          // : label == 3
          // ? 'DNC'
          // : label == 4
          'Standard Plus'
        : label == 5
        ? 'Premium'
        : label == 6
        ? 'Essential'
        : label == 7
        ? 'Premium Plus'
        : label == 8
        ? 'Super Saver'
        : ''
    GetMonthYearEmpTypeTurnkeyQuotationMstBookApi(
      employeeID,
      state.selMonthID,
      state.selYearID,
      projectTypeId
    )
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          let tmpProjectCateName: any
          for (let key in responseData) {
            tmpProjectCateName = responseData[key].projectCategoryName
          }
          setState({
            ...state,
            projectData: responseData,
            selProjectTypeID: projectTypeId,
            projCategorynm: projCategorynm,
            tmpProjectCateName: tmpProjectCateName,
            labelId: label,
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
  // ============================DIY======================================

  const mpQuotationMst = (employeeID: number, label: number) => {
    setShowModal(true)
    setState({...state, loading: true})
    let projCategorynm = label == 1 ? 'DIY' : ''
    GetMonthYearEmpQuotationMstBookApi(employeeID, state.selMonthID, state.selYearID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          let tmpProjectCateName: any
          for (let key in responseData) {
            tmpProjectCateName = responseData[key].projectCategoryName
          }
          setState({
            ...state,
            projectData: responseData,
            projCategorynm: projCategorynm,
            tmpProjectCateName: tmpProjectCateName,
            labelId: label,
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
  // ============================MODULAR======================================

  const GetMonthYearEmpModularQuotationMstBook = (employeeID: number, label: number) => {
    setShowModal(true)
    setState({...state, loading: true})
    let projCategorynm = label == 2 ? 'Modular' : ''
    GetMonthYearEmpModularQuotationMstBookAPI(employeeID, state.selMonthID, state.selYearID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          let tmpProjectCateName: any
          for (let key in responseData) {
            tmpProjectCateName = responseData[key].projectCategoryName
          }
          setState({
            ...state,
            projectData: responseData,
            projCategorynm: projCategorynm,
            tmpProjectCateName: tmpProjectCateName,
            labelId: label,
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
  // ============================DNC======================================

  const GetMonthYearEmpDNCQuotationMstBook = (employeeID: number, label: number) => {
    setShowModal(true)
    setState({...state, loading: true})
    let projCategorynm = label == 3 ? 'DNC' : ''
    GetMonthYearEmpDNCQuotationMstBookApi(employeeID, state.selMonthID, state.selYearID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          let tmpProjectCateName: any
          for (let key in responseData) {
            tmpProjectCateName = responseData[key].projectCategoryName
          }
          setState({
            ...state,
            projectData: responseData,
            projCategorynm: projCategorynm,
            tmpProjectCateName: tmpProjectCateName,
            labelId: label,
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
  const currentPosts: projectDataPopUp[] = state.projectData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card ${className}`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1 text-info'>Employee Quotations</span>
            <span className='text-muted mt-1 fw-bold fs-6'>
              {state.saleQutContData.length} Employees
            </span>
          </h3>
          <div className='d-flex flex-row align-items-center mb-2'>
            <div className='me-3'>
              <label className='form-label fw-bold text-success fs-5'>Year:</label>
              <select className='form-select form-select-white' onChange={(e) => YearModeValue(e)}>
                <option selected={state.selYearID === 0 ? true : false} value={0}>
                  Select Year
                </option>
                {YearsDropdownData.length > 0 &&
                  YearsDropdownData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data}
                        selected={data === state.selYearID ? true : false}
                      >
                        {data}
                      </option>
                    )
                  })}
              </select>
            </div>
            <div className='me-3'>
              <label className='form-label pb-0 fw-bold text-success fs-5'>Month:</label>
              <select className='form-select form-select-white' onChange={(e) => MonthModeValue(e)}>
                <option selected={state.selMonthID === 0 ? true : false} value={0}>
                  Select Month
                </option>
                {MonthDropdownData.length > 0 &&
                  MonthDropdownData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.MonthID}
                        selected={data.MonthID === state.selMonthID ? true : false}
                      >
                        {data.MonthName}
                      </option>
                    )
                  })}
              </select>
            </div>
            <span
              className='text-end mt-7'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to export Excel sheet'
            >
              <span
                className='btn btn-sm btn-light-primary bg-white border border-primary'
                onClick={() => exportExcelData()}
              >
                <KTSVG path='/media/icons/duotune/files/fil002.svg' className='svg-icon-3' />
                Export Excel
              </span>
            </span>
          </div>
        </div>

        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-dashed table-row-gray-300 table-bordered align-middle gs-0 gy-2'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bolder text-muted'>
                  <th className='min-w-200px'>Employee Name</th>
                  <th className='min-w-50px text-center'>{lablesNames[0]}</th>
                  <th className='min-w-50px text-center'>{lablesNames[1]}</th>
                  <th className='min-w-50px text-center'>{lablesNames[2]}</th>
                  <th className='min-w-50px text-center'>{lablesNames[3]}</th>
                  <th className='min-w-50px text-center'>{lablesNames[4]}</th>
                  <th className='min-w-50px text-center'>{lablesNames[5]}</th>
                  <th className='min-w-50px text-center'>{lablesNames[6]}</th>
                  <th className='min-w-50px text-center'>{lablesNames[7]}</th>
                  {/* <th className='min-w-50px text-center'>DIY</th>
                <th className='min-w-50px text-center'>Standard</th>
                <th className='min-w-50px text-center'>Premuim</th>
                <th className='min-w-50px text-center'>Essential</th>
                <th className='min-w-50px text-center'>Modular</th>
                <th className='min-w-50px text-center'>Premuim Plus</th>
                <th className='min-w-50px text-center'>Super Saver</th> */}
                  <th className='min-w-50px text-center'>Total</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='text-center'>
                {state.saleQutContData.length > 0 &&
                  state.loading == false &&
                  state.saleQutContData.map((data, index) => {
                    return (
                      <tr key={data.employeeID}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='symbol symbol-45px me-5'>
                              {/* <img src={toAbsoluteUrl(`${BASE_API_URL}${data.photoPath}`)} alt='' /> */}
                              {data.photoPath !== '' ? (
                                <img
                                  src={toAbsoluteUrl(`${BASE_API_URL}${data.photoPath}`)}
                                  alt=''
                                  width={45}
                                />
                              ) : (
                                <img
                                  src={toAbsoluteUrl('/media/logos/logoslogo-Final-C2C-1.png')}
                                  alt=''
                                  width={45}
                                />
                              )}
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark fw-bolder text-hover-primary fs-6'>
                                {data.employeeName}
                              </span>
                              {/* <span className='text-muted fw-bold text-muted d-block fs-6'>
                              HTML, JS, ReactJS
                            </span> */}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className='fw-bolder text-hover-primary d-block fs-6'>
                            <span
                              className='cursor-pointer text-hover-warning text-success'
                              onClick={() => mpQuotationMst(data.employeeID, 1)} // Add onClick here
                            >
                              {data.bkcntDIY}
                            </span>
                            <span className='text-dark'>/</span>

                            <span className='text-danger'>{data.cntDIY}</span>
                          </span>
                        </td>
                        <td>
                          <span className='  fw-bolder text-hover-primary d-block fs-6'>
                            {/* <span className='text-success '>{data.bkcntModular}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning text-success '
                              onClick={() =>
                                GetMonthYearEmpModularQuotationMstBook(data.employeeID, 2)
                              } // Add onClick here
                            >
                              {data.bkcntModular}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.cntModular}</span>
                          </span>
                        </td>
                        <td>
                          <span className=' fw-bolder text-hover-primary d-block fs-6'>
                            {/* <span className='text-success '>{data.bkcntDNC}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning text-success'
                              onClick={() => GetMonthYearEmpDNCQuotationMstBook(data.employeeID, 3)}
                            >
                              {data.bkcntDNC}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.cntDNC}</span>
                          </span>
                        </td>
                        <td>
                          <span className='  fw-bolder text-hover-primary d-block fs-6'>
                            {/* <span className='text-success '>{data.bkcntStd}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning  text-success'
                              onClick={() => handleShow(2, data.employeeID, 4)}
                            >
                              {data.bkcntStd}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.cntStd}</span>
                          </span>
                        </td>
                        <td>
                          <span className='  fw-bolder text-hover-primary d-block fs-6'>
                            {/* <span className='text-success '>{data.bkcntPrm}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning  text-success'
                              onClick={() => handleShow(3, data.employeeID, 5)}
                            >
                              {data.bkcntPrm}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.cntPrm}</span>
                          </span>
                        </td>
                        <td>
                          <span className='  fw-bolder text-hover-primary d-block fs-6'>
                            {/* <span className='text-success '>{data.bkcntEss}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning  text-success'
                              onClick={() => handleShow(4, data.employeeID, 6)}
                            >
                              {data.bkcntEss}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.cntEss}</span>
                          </span>
                        </td>
                        <td>
                          <span className='  fw-bolder text-hover-primary d-block fs-6'>
                            {/* <span className='text-success '>{data.bkcntPremPlus}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning  text-success'
                              onClick={() => handleShow(5, data.employeeID, 7)}
                            >
                              {data.bkcntPremPlus}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.cntPremPlus}</span>
                          </span>
                        </td>
                        <td>
                          <span className='  fw-bolder text-hover-primary d-block fs-6'>
                            {/* <span className='text-success '>{data.bkcntSuperSav}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning  text-success'
                              onClick={() => handleShow(6, data.employeeID, 8)}
                            >
                              {data.bkcntSuperSav}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.cntSuperSav}</span>
                          </span>
                        </td>
                        <td>
                          <span className='fw-bolder text-hover-primary d-block fs-5'>
                            {/* <span className='text-success '>{data.bkTotalSaleWise}</span> */}
                            <span
                              className=' cursor-pointer text-hover-warning  text-success'
                              // onClick={() => handleShow(state.selProjectTypeID)}
                            >
                              {data.bkTotalSaleWise}
                            </span>
                            <span className='text-dark'>/</span>
                            <span className='text-danger'>{data.totalSaleWise}</span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
              <tr className='text-dark'>
                <td className='border-top border-bottom border-dark text-center fw-bolder fs-5'>
                  Total
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntDIYTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => mpQuotationMst(0, 1)} // Add onClick here
                    >
                      {state.salePersonData.bkcntDIYTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntDIYTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntModularTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => GetMonthYearEmpModularQuotationMstBook(0, 2)}
                    >
                      {state.salePersonData.bkcntModularTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntModularTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntDNCTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => GetMonthYearEmpDNCQuotationMstBook(0, 3)}
                    >
                      {state.salePersonData.bkcntDNCTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntDNCTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntStdTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => handleShow(2, 0, 4)}
                    >
                      {state.salePersonData.bkcntStdTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntStdTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntPrmTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => handleShow(3, 0, 5)}
                    >
                      {state.salePersonData.bkcntPrmTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntPrmTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntEssTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => handleShow(4, 0, 6)}
                    >
                      {state.salePersonData.bkcntEssTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntEssTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntPremPlusTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => handleShow(5, 0, 7)}
                    >
                      {state.salePersonData.bkcntPremPlusTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntPremPlusTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>{state.salePersonData.bkcntSuperSavTotal}</span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      onClick={() => handleShow(6, 0, 8)}
                    >
                      {state.salePersonData.bkcntSuperSavTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.cntSuperSavTotal}</span>
                  </span>
                </td>
                <td className='border-top border-bottom border-dark text-center fw-bolder'>
                  <span className='fw-bolder text-hover-primary d-block fs-5'>
                    {/* <span className='text-success '>
                      {state.salePersonData.bkTotalSaleWiseTotal}
                    </span> */}
                    <span
                      className=' cursor-pointer text-hover-warning  text-success'
                      // onClick={() => handleShow(state.salePersonData.bkTotalSaleWiseTotal)}
                    >
                      {state.salePersonData.bkTotalSaleWiseTotal}
                    </span>
                    <span className='text-dark'>/</span>
                    <span className='text-danger'>{state.salePersonData.totalSaleWiseTotal}</span>
                  </span>
                </td>
                <td className='text-start' colSpan={8}></td>
              </tr>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
      <Modal size='xl' show={showModal} onHide={handleClose}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>Project List</Modal.Title>{' '}
          <div
            className={state.labelId > 0 ? 'border-0 fs-5 fw-bolder text-white' : 'd-none'}
            id='kt_chat_contacts_header'
          >
            Project Type : &nbsp;
            <span className='text-primary fs-5 fw-bolder'>
              {state.labelId > 0 ? state.projCategorynm : ''}
            </span>
            {/* </div> */}
            {/* <div className='border-0 fs-5 fw-bolder text-white' id='kt_chat_contacts_header'> */}
            <span className='text-white fs-5 fw-bolder ms-5'>Project Category : &nbsp;</span>
            <span className='text-success fs-5 fw-bolder'>{state.tmpProjectCateName}</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* <div className='card-body '> */}
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
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
                                {data.customerName}
                              </span>
                              <span className='text-muted d-block fs-7 text-start'>
                                {data.mobileNumber}
                              </span>
                            </td>

                            <td>
                              <span className=' text-hover-primary fs-6'>{data.employeeName}</span>
                            </td>

                            <td>
                              <span className=' text-hover-primary fs-6'>
                                {data.quotationAmount}
                              </span>
                            </td>
                            <td>
                              <span className=' text-hover-primary fs-6'>{data.bookDate}</span>
                            </td>
                          </tr>
                        )
                      })}
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

export {TablesSalesQuotCount}
