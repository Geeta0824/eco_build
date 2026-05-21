import React, {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {
  ExcelcashAccountReportListApi,
  getcashAccountReportListApi,
} from '../../../modules/accounts-reports/cash-account-report/CashAccountReportCRUD'
import {
  ICashAccountReportList,
  ITotalBalanceModel,
} from '../../../models/accounts-reports/ICashAccountReportList'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import ExcelJS from 'exceljs'
import moment from 'moment'

type Props = {}

interface IProject {
  loading: boolean
  cartListData: ICashAccountReportList[]
  temCartListData: ICashAccountReportList[]
  totalamt: ITotalBalanceModel
}

const CashAccountReportList: React.FC<Props> = () => {
  const [cartLength, setCartLength] = useState<number>(0)
  const [state, setState] = useState<IProject>({
    loading: false,
    cartListData: [] as ICashAccountReportList[],
    temCartListData: [] as ICashAccountReportList[],
    totalamt: {} as ITotalBalanceModel,
  })
  useEffect(() => {
    setState({
      ...state,
      loading: true,
    })
    setTimeout(() => {
      getCashAccountData()
    }, 100)
  }, [])
  function getCashAccountData() {
    getcashAccountReportListApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          let prvTmpAreaID: number = 0
          const temRows = []
          const Rows: ICashAccountReportList[] = responseData
          for (let key in Rows) {
            //  console.log(Rows)
            if (Rows[key] == Rows[0] && Rows[key].cashAccountTypeID == 2) {
              Rows[key].titleName = Rows[key].employeeName
              Rows[key].titleID = 0
              prvTmpAreaID = Rows[key].cashAccountID
            } else if (Rows[key] == Rows[0] && Rows[key].cashAccountTypeID == 1) {
              Rows[key].titleName = Rows[key].cashAccountName
              Rows[key].titleID = 0
              prvTmpAreaID = Rows[key].cashAccountID
            } else {
              if (prvTmpAreaID == Rows[key].cashAccountID) {
                Rows[key].titleName = ''
                Rows[key].titleID = 1
              } else if (Rows[key].cashAccountTypeID == 1) {
                Rows[key].titleName = Rows[key].cashAccountName
                Rows[key].titleID = 0
                prvTmpAreaID = Rows[key].cashAccountID
              } else if (Rows[key].cashAccountTypeID == 2) {
                Rows[key].titleName = Rows[key].employeeName
                Rows[key].titleID = 0
                prvTmpAreaID = Rows[key].cashAccountID
              }
            }
            temRows.push(Rows[key])
          }
          //  console.log(temRows)
          setState({
            ...state,
            cartListData: temRows,
            temCartListData: temRows,
            totalamt: response.data,

            loading: false,
          })

          setCartLength(responseData.length)
          localStorage.setItem('totalCounts', responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cartListData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cartListData: [], loading: false})
      })
  }

  function exportExcelData() {
    ExcelcashAccountReportListApi()
      .then((response) => {
        if (response.data.isSuccess === true) {
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
          //   `CashAccountReport_${moment(new Date()).format('YYYYMMDD')}.xlsx`
          // )

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('CashAccountReport')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Cash Account Name', key: 'cashAccountName', width: 20}, // Manually setting width to 40
            {header: 'Total Balance', key: 'totalBalance', width: 15}, // Manually setting width to 20
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
          let totalBalanceSum = 0
          responseData.forEach((item: any) => {
            worksheet.addRow({
              cashAccountName: item.cashAccountName,
              totalBalance: item.totalBalance,
            })
            totalBalanceSum += item.totalBalance
          })

          const totalRow = worksheet.addRow({
            cashAccountName: 'Total', // Label for total row
            totalBalance: totalBalanceSum, // The sum of total balances
          })

          totalRow.getCell(1).font = {bold: true} // Bold the 'Total' label
          totalRow.getCell(2).font = {bold: true} // Bold the total balance sum
          // totalRow.getCell(2).numFmt = '"₹"#,##0.00'; // Example: format as currency
          totalRow.getCell(2).numFmt = '#,##0.00' // Example: format as currency
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
            link.download = `CashAccountReport_${moment(new Date()).format('YYYYMMDD')}.xlsx`
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

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temCartListData.filter((user) => {
        // return (
        //   user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
        //   user.vendorCost.toString().includes(keyword.toLowerCase()) ||
        //   user.remainingAmount.toString().includes(keyword.toLowerCase()) ||
        //   user.paidAmount.toString().includes(keyword.toLowerCase())
        // )
      })
      setState({...state, cartListData: results})
      // setTotal(results.length)
    } else {
      setState({...state, cartListData: state.temCartListData})
      // setTotal(state.temCartListData.length)
    }

    setName(keyword)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 row' style={{backgroundColor: '#000000'}}>
          <div className='col-6  text-start'>
            <label className='text-white fs-5 mt-6 fw-bold '>Tatal Balance : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.totalamt.totalBalance}</span>
          </div>
          <div className='col-3 text-end mt-5'>
            <Link
              to={`/account-reports/cash/download/:cashAccountID`}
              className='symbol symbol-40px cursor-pointer d-block justify-content-center text-end'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='View PDF'
            >
              <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
            </Link>
          </div>
          <div className='col-3 text-end mt-5'>
            <span
              className='text-end col-xl-3 col-sm-6 mt-6'
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
        </div>

        {/* end::Header */}

        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered table-rounded align-middle border g-4'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-75px text-start'>Cash Account Name</th>
                  {/* <th className='min-w-75px text-start'>Sub Cash Account Name</th> */}
                  <th className='min-w-75px text-start'>Account Balance</th>
                  <th className='min-w-75px text-center'>View</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={3} />
                {state.cartListData.length > 0 &&
                  state.cartListData.map((data, index) => {
                    return (
                      <>
                        <tr className={data.titleID == 0 ? '' : 'd-none'} key={data.cashAccountID}>
                          <td className='text-dark text-hover-primary fs-6 fw-bold'>
                            {data.titleName}
                          </td>
                          {/* <td></td> */}

                          <td className='text-dark text-hover-primary fs-6 fw-bold'>
                            {data.totalBalance}
                          </td>
                          <td className='text-center'>
                            <Link
                              to={{
                                pathname: `/account-reports/cash/view`,
                                state: {
                                  cashAccountID: data.cashAccountID,
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

                        {/* <tr className={data.cashAccountTypeID == 2 ? 'border-bottom' : 'd-none'}>
                          <td></td>
                          <td className='d-flex justify-content-s'>
                            {data.cashEmployeeSubTypeID == 1 ? (
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.cashEmployeeSubTypeName}
                              </span>
                            ) : (
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.cashAccountName}
                              </span>
                            )}
                          </td>

                          <td className='text-dark text-start mb-1 fs-6'>{data.accountBalance}</td>
                          <td></td>
                        </tr> */}
                      </>
                    )
                  })}
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  colSpan={13}
                  length={state.cartListData.length}
                  loading={state.loading}
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
    </>
  )
}
export default CashAccountReportList
