import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import moment from 'moment'
import * as XLSX from 'xlsx'
import {
  ExportExcelSundryCreditorsListApi,
  getSundryCreditorsListApi,
} from '../../../modules/accounts-reports/sundry-credit-report-pages/SundryCreditorsReportCRUD'
import {ISundryCreditorsModel} from '../../../models/accounts-reports/ISundryCreditorsModel'
import ExcelJS from 'exceljs'

interface ISundryCredit {
  loading: boolean
  sundryCreditorsReportData: ISundryCreditorsModel[]
  tmpSundryCreditorsReportData: ISundryCreditorsModel[]
  PDFShow: string
  SearchText: string
  activeID: number
  activeType: any
  pathUrl: any
}

type Props = {}

const SundryCreditorList: React.FC<Props> = () => {
  const location = useLocation()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<ISundryCredit>({
    loading: false,
    sundryCreditorsReportData: [] as ISundryCreditorsModel[],
    tmpSundryCreditorsReportData: [] as ISundryCreditorsModel[],
    PDFShow: '',
    SearchText: '',
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.mainSearch
      }

      getSundryCreditorData(mainSearch)
    }, 100)
  }, [])

  function getSundryCreditorData(mainSearch: string) {
    getSundryCreditorsListApi()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.vendorName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.remainingamount.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              sundryCreditorsReportData: results,
              tmpSundryCreditorsReportData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              sundryCreditorsReportData: responseData,
              tmpSundryCreditorsReportData: responseData,
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

  function exportExcelData() {
    ExportExcelSundryCreditorsListApi()
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
          // XLSX.writeFile(workbook, `SundryCreditor_${moment(new Date()).format('YYYY-MM-DD')}.xlsx`)

          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('SundryCreditor')

          // Define the columns with headers, keys, and manual widths
          worksheet.columns = [
            {header: 'Vendor Name', key: 'vendorName', width: 25},
            {header: 'Remaining Amount', key: 'remainingamount', width: 20},
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
              vendorName: item.vendorName,
              remainingamount: item.remainingamount,
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
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.remainingamount.toString().includes(keyword.toLowerCase())
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
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </span>
          </div>
          <div className='col-6 text-end mt-4'>
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
          <div className='col-1 text-end mt-4'>
            <Link
              to={{
                pathname: `/account-reports/sundry-creditor/download`,
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
                  <th className='min-w-125px ms-4'>Vendor Name</th>
                  <th className='min-w-125px '>Rem Amount</th>
                  <th className='min-w-40px'>View</th>
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
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.remainingamount}
                          </span>
                        </td>
                        <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/account-reports/sundry-creditor/view/list`,
                              state: {
                                vendorID: data.vendorid,
                                vendorName: data.vendorName,
                                mainSearch: name,
                              },
                            }}
                            className='d-flex btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
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

      {/* =====================Image Model=================== */}
    </>
  )
}

export default SundryCreditorList
