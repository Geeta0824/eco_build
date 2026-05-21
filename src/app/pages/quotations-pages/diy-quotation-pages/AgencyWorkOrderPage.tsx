import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'

import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {getProjectVendorListAPI} from '../../../modules/project-master-page/vendor-Master-page/ProjectVendorCRUD'

import {IAgencyWorkOrderModel} from '../../../models/quotations-page/diy-quotation-page/IAgencyWorkOrderModel'
import {getAgencyQuotationBreakupListApi} from '../../../modules/quotations-master-page/diy-quotation-master-page/DIYQuotationCRUD'
import axios from 'axios'
import {error} from 'console'
import {pathToFileURL} from 'url'

type Props = {}

interface IProjectVendor {
  loading: boolean
  agencyWorkOrderData: IAgencyWorkOrderModel[]
  tmpAgencyWorkOrderData: IAgencyWorkOrderModel[]
  selProjectAdditionalItemID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  projectNumber: string
  customerName: string
  quotationID: number
  mainEmployeeID: number
  mainCustomerID: number
  mainSearch: string
}

const AgencyWorkOrderPage: React.FC<Props> = () => {
  const {projectAdditionalItemID} = useParams<{projectAdditionalItemID: string}>()
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    agencyWorkOrderData: [] as IAgencyWorkOrderModel[],
    tmpAgencyWorkOrderData: [] as IAgencyWorkOrderModel[],
    selProjectAdditionalItemID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    projectNumber: '',
    customerName: '',
    quotationID: 0,
    mainEmployeeID: 0,
    mainCustomerID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let projectNumber: any = lc.projectNumber
      let quotationID: any = lc.quotationID
      let customerName: any = lc.customerName
      var mainEmployeeID: number = 0
      var mainCustomerID: number = 0
      var mainSearch: string = ''
      if (
        lc.mainEmployeeID !== undefined ||
        lc.mainCustomerID !== undefined ||
        lc.mainSearch !== undefined
      ) {
        mainEmployeeID = lc.mainEmployeeID
        mainCustomerID = lc.mainCustomerID
        mainSearch = lc.mainSearch
      }
      getAllAdditionalItemData(
        projectNumber,
        customerName,
        quotationID,
        mainEmployeeID,
        mainCustomerID,
        mainSearch
      )
    }, 100)
  }, [])

  function getAllAdditionalItemData(
    projectNumber: string,
    customerName: string,
    quotationID: number,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string
  ) {
    getAgencyQuotationBreakupListApi(quotationID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            agencyWorkOrderData: responseData,
            tmpAgencyWorkOrderData: responseData,
            projectNumber: projectNumber,
            customerName: customerName,
            quotationID: quotationID,
            mainEmployeeID,
            mainCustomerID,
            mainSearch,
            loading: false,
          })
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            agencyWorkOrderData: [],
            tmpAgencyWorkOrderData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          agencyWorkOrderData: [],
          tmpAgencyWorkOrderData: [],
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
      const results = state.tmpAgencyWorkOrderData.filter((user) => {
        return (
          user.agencyTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.adminCommissionPercentage.toLowerCase().includes(keyword.toLowerCase()) ||
          user.agencyCost.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, agencyWorkOrderData: results})
      setTotal(results.length)
    } else {
      setState({...state, agencyWorkOrderData: state.tmpAgencyWorkOrderData})
      // If the text field is empty, show all users
      setTotal(state.tmpAgencyWorkOrderData.length)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length

  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IAgencyWorkOrderModel[] = state.agencyWorkOrderData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // --------------------Download Pdf---------------------
  const [selDwID, setselDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  function getQuotationPdf(agencyTypeID: number) {
    var URL = process.env.REACT_APP_API_URL
    if (agencyTypeID == 0) {
      URL = `${process.env.REACT_APP_API_URL}/AgencyType/DownloadAgencyWorkOrder`
      setDownloadLoader(true)
      setselDwID(agencyTypeID)
    } else {
      URL = `${process.env.REACT_APP_API_URL}/AgencyType/DownloadAgencyWorkOrder`
      setDownloadLoader(true)
      setselDwID(agencyTypeID)
    }

    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      .post(URL, {agencyTypeID: agencyTypeID, quotationID: state.quotationID})
      .then((response) => response.data.pdfData)
      .then((blob) => {
        // The Base64 string of a simple PDF file
        var b64 = blob
        // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
        // var bin = atob(b64)
        // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
        // Embed the PDF into the HTML page and show it to the user
        // -------------------------------------------------------------------------
        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        const fileName = 'Agency Work Order' + state.quotationID + '_' + Tdate + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setDownloadLoader(false)
        setselDwID(0)
      })
  }

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          onClick={() => {
            const path =
              location.pathname === `/design/diy-addon/agency-work-order/${state.quotationID}`
                ? '/design/diy-addon/list' // If condition is true
                : '/quotations/diy-quotation/list' // If condition is false

            history.push({
              pathname: path,
              state: {
                employeeID: state.mainEmployeeID,
                customerID: state.mainCustomerID,
                mainSearch: state.mainSearch,
              },
            })
          }}
        >
          Back To Main List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='col-8 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Project Number : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.projectNumber}</span>
          </div>
          <div className='col-8 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Customer Name : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.customerName}</span>
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
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Agency Type Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Total Cost</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Admin(%)</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Admin Margin</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Agency Cost</span>
                  </th>
                  <th className='min-w-50px'>
                    <span className='d-flex mb-1'>Download</span>
                  </th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.agencyTypeName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.agencyWiseTotal}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.adminCommissionPercentage}
                            {'('}
                            <span>%</span>
                            {')'}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.profite}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.agencyCost}
                          </span>
                        </td>
                        <td className='text-center'>
                          <>
                            {downloadLoader && selDwID == data.agencyTypeID ? (
                              <span className='d-flex justify-content-center m-5 p-5'>
                                <span
                                  className='spinner-border text-primary'
                                  style={{width: '1rem', height: '1rem'}}
                                  role='status'
                                >
                                  <span className='visually-hidden'>Loading...</span>
                                </span>
                              </span>
                            ) : (
                              <span
                                onClick={() => getQuotationPdf(data.agencyTypeID)}
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                                data-bs-toggle='tooltip'
                                data-bs-placement='top'
                                title='Download'
                              >
                                <span className='fa fa-download fs-2'></span>
                              </span>
                            )}
                          </>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
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
    </>
  )
}

export {AgencyWorkOrderPage}
