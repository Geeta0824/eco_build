import React, {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import moment from 'moment'
import Search from 'antd/es/transfer/search'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {MonthDropdownData, YearsDropdownData} from '../../other-dropDowns/otherDropDowns'
import {ICompanyProfitLossModel} from '../../../models/accounts-reports/ICompanyProfitLossModel'
import {
  getCompanyProfitLossReportExcelApi,
  getCompanyProfitLossReportListByFilterApi,
} from '../../../modules/accounts-reports/company-profit-loss-report/CompanyProfitLossReportCRUD'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Link, useLocation} from 'react-router-dom'
import ExcelJS from 'exceljs'

interface IProjectReport {
  loading: boolean
  companyProfitLoss: ICompanyProfitLossModel[]
  tmpCompanyProfitLossData: ICompanyProfitLossModel[]
  projectData: IProjectModel[]
  temProjectData: IProjectModel[]
  pathUrl: any
  selTotalBalance: number
  selTotalExpenseAmount: number
  selTotalProjectAmount: number
  selProjectID: number
  searchText: string
  selMonthName: string
  selMonthID: number
  selYearID: number
}

type Props = {}

const CompanyProjectProfitLossReportList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IProjectReport>({
    loading: false,
    companyProfitLoss: [] as ICompanyProfitLossModel[],
    tmpCompanyProfitLossData: [] as ICompanyProfitLossModel[],
    projectData: [] as IProjectModel[],
    temProjectData: [] as IProjectModel[],
    pathUrl: process.env.REACT_APP_API_URL,
    selTotalBalance: 0,
    selTotalExpenseAmount: 0,
    selTotalProjectAmount: 0,
    selProjectID: 0,
    searchText: '',
    selMonthName: '',
    // selMonthID: moment().month() + 1,
    // selYearID: moment().year(),
    selMonthID: 0,
    selYearID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      // console.log(lc)
      let mainSearch: string = ''
      let tmpYear: number = 0
      let tmpMonth: number = 0
      if (lc != undefined) {
        mainSearch = lc.search
        tmpYear = lc.tmpYear
        tmpMonth = lc.tmpMonth
      }
      getProjectReportListData(tmpYear, tmpMonth, mainSearch, state.selMonthName)
    }, 100)
  }, [])

  // ======================List Api================================
  function getProjectReportListData(
    YearID: number,
    MonthID: number,
    mainSearch: string,
    selMonthName: string
  ) {
    getCompanyProfitLossReportListByFilterApi(YearID, MonthID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let tmpTotalBalance = response.data.totalBalance
          let tmpTotalExpenseAmount = response.data.totalExpenseAmount
          let tmpTotalProjectAmount = response.data.totalIncomeAmount
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.reportYear.toString().includes(mainSearch.toString()) ||
                user.reportMonth.toString().includes(mainSearch.toString()) ||
                user.monthName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })
            setState({
              ...state,
              companyProfitLoss: results,
              tmpCompanyProfitLossData: responseData,
              selTotalBalance: tmpTotalBalance,
              selTotalExpenseAmount: tmpTotalExpenseAmount,
              selTotalProjectAmount: tmpTotalProjectAmount,
              selYearID: YearID,
              selMonthID: MonthID,
              selMonthName,
              loading: false,
            })
          } else {
            setState({
              ...state,
              companyProfitLoss: responseData,
              tmpCompanyProfitLossData: responseData,
              selTotalBalance: tmpTotalBalance,
              selTotalExpenseAmount: tmpTotalExpenseAmount,
              selTotalProjectAmount: tmpTotalProjectAmount,
              selYearID: YearID,
              selMonthID: MonthID,
              selMonthName,
              loading: false,
            })
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, companyProfitLoss: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, companyProfitLoss: [], loading: false})
      })
  }

  // ----------------------------------------------------------------------------------
  function exportExcelData() {
    getCompanyProfitLossReportExcelApi(state.selYearID, state.selMonthID)
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
          //   `Company_Profit_Loss_Report_${moment(new Date()).format('YYYYMMDD')}.xlsx`
          // )

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('CompanyProfitLossReport')

          worksheet.columns = [
            {header: 'Report Year', key: 'reportYear', width: 15},
            {header: 'Month Name', key: 'monthName', width: 15},
            {header: 'Income', key: 'income', width: 15},
            {header: 'Expense', key: 'expense', width: 15},
            {header: 'Balance', key: 'balance', width: 15},
          ]

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
          let totalIncomeSum = 0
          let totalExpenseSum = 0
          let totalBalanceSum = 0
          responseData.forEach((item: any) => {
            worksheet.addRow({
              reportYear: item.reportYear,
              monthName: item.monthName,
              income: item.income,
              expense: item.expense,
              balance: item.balance,
            })
            totalIncomeSum += item.income
            totalExpenseSum += item.expense
            totalBalanceSum += item.balance
          })

          const totalRow = worksheet.addRow({
            reportYear: 'Total', // Label for total row
            monthName: '',
            income: totalIncomeSum, // The sum of total totalIncomeSum
            expense: totalExpenseSum, // The sum of total totalExpenseSum
            balance: totalBalanceSum, // The sum of total balances
          })

          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(2).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(3).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(4).font = {bold: true} // Bold the total balance sum
          totalRow.getCell(5).font = {bold: true} // Bold the total balance sum
          // totalRow.getCell(2).numFmt = '"₹"#,##0.00'; // Example: format as currency
          totalRow.getCell(3).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(4).numFmt = '#,##0.00' // Example: format as currency
          totalRow.getCell(5).numFmt = '#,##0.00' // Example: format as currency
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
            link.download = `Company_Profit_Loss_Report_${moment(new Date()).format(
              'YYYYMMDD'
            )}.xlsx`
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

  // ===================Year Mode Filter Function===========
  function YearModeValue(event: any) {
    const tmpYearModeID = event.target.value
    getProjectReportListData(tmpYearModeID, state.selMonthID, state.searchText, state.selMonthName)
  }

  // ===================Year Mode Filter Function===========
  function MonthModeValue(event: any) {
    const tmpMonthModeID = parseInt(event.target.value)
    const selMonthName = event.target.selectedOptions[0].text
    getProjectReportListData(state.selYearID, tmpMonthModeID, state.searchText, selMonthName)
  }

  // ------------------------------reset button---------------------
  function resetFilter() {
    getProjectReportListData(0, 0, '', '')
    setName('')
  }

  //------------------- the search result-----------------
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCompanyProfitLossData.filter((user) => {
        return (
          user.reportYear.toString().includes(keyword.toString()) ||
          user.reportMonth.toString().includes(keyword.toString()) ||
          user.monthName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, companyProfitLoss: results})
    } else {
      setState({...state, companyProfitLoss: state.tmpCompanyProfitLossData})
    }

    setName(keyword)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-2 col-sm-6 ps-0'>
            <label className='form-label pb-0 fw-bold text-white'>Year :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => YearModeValue(e)}
            >
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
          <div className='mb-2 col-xl-2 col-sm-6 ps-0'>
            <label className='form-label pb-0 fw-bold text-white'>Month :</label>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => MonthModeValue(e)}
            >
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
          <div className='mb-2 col-xl-3 col-sm-6 px-1'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
          </div>
          <div className=' mt-4 col-xl-1 col-sm-4 d-flex align-content-around flex-wrap justify-content-center'>
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
                pathname: `/account-reports/company-profit-loss/download`,
                state: {
                  YearID: state.selYearID,
                  MonthID: state.selMonthID,
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
                  <th className='min-w-125px ms-4'>Report Year</th>
                  <th className='min-w-125px '>Month Name</th>
                  <th className='min-w-125px '>Income</th>
                  <th className='min-w-125px '>Expense</th>
                  <th className='min-w-125px '>Balance</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {state.companyProfitLoss.length > 0 &&
                  state.companyProfitLoss.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.reportYear}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.monthName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.income}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.expense}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.balance}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                <tr className='text-dark'>
                  <td className='text-start fw-bolder fs-6'>Total</td>
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
                  length={state.companyProfitLoss.length}
                  loading={state.loading}
                  colSpan={5}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompanyProjectProfitLossReportList
