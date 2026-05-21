import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../../common-pages/ModelPopUpDelete'
import {IInvoiceModel} from '../../../../models/projects-page/IInvoiceModel'
import {
  deleteProjectInvoiceDataAPI,
  getAllProjectInvoiceListAPI,
} from '../../../../modules/project-master-page/project-master/invoice-master/InvoiceCRUD'
import axios from 'axios'

type Props = {}

interface IInvoice {
  loading: boolean
  invoiceData: IInvoiceModel[]
  tmpInvoiceData: IInvoiceModel[]
  projName: string
  customerName: string
  projectAmount: string
  paidAmount: number
  remainingAmount: number
  projectID: number
  selProjectInvoiceID: number
}

const InvoicePageList: React.FC<Props> = () => {
  const {projectInvoiceID} = useParams<{projectInvoiceID: string}>()
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IInvoice>({
    loading: false,
    invoiceData: [] as IInvoiceModel[],
    tmpInvoiceData: [] as IInvoiceModel[],
    projName: '',
    customerName: '',
    projectAmount: '',
    paidAmount: 0,
    remainingAmount: 0,
    projectID: 0,
    selProjectInvoiceID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      let projectAmount: any = lc.projectAmount
      let paidAmount: any = lc.paidAmount
      let remainingAmount: any = lc.remainingAmount
      getAllInvoiceData(
        projName,
        customerName,
        projectAmount,
        projectID,
        paidAmount,
        remainingAmount
      )
    }, 100)
  }, [])

  function getAllInvoiceData(
    projName: string,
    customerName: string,
    projectAmount: string,
    projectID: number,
    paidAmount: number,
    remainingAmount: number
  ) {
    getAllProjectInvoiceListAPI(projectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            invoiceData: responseData,
            tmpInvoiceData: responseData,
            projName: projName,
            customerName: customerName,
            projectAmount: projectAmount,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount,
            projectID: projectID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            invoiceData: [],
            tmpInvoiceData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          invoiceData: [],
          tmpInvoiceData: [],
          loading: false,
        })
      })
  }

  //==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectInvoiceID: number) => {
    setState({
      ...state,
      selProjectInvoiceID: projectInvoiceID,
      loading: false,
    })
    setShow(true)
  }

  // ==================Delete Api ============================
  function deleteProjectInvoice(projectInvoiceID: number) {
    deleteProjectInvoiceDataAPI(projectInvoiceID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllInvoiceData(
            state.projName,
            state.customerName,
            state.projectAmount,
            state.projectID,
            state.paidAmount,
            state.remainingAmount
          )
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpInvoiceData.filter((user) => {
        return (
          user.voucherNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.gstAmount.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.remainingAmount.toString().includes(keyword.toLowerCase()) ||
          user.totalAmount.toString().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, invoiceData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, invoiceData: state.tmpInvoiceData})
      // If the text field is empty, show all users
      setTotal(state.tmpInvoiceData.length)
      setPage(1)
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
  const currentPosts: IInvoiceModel[] = state.invoiceData.slice(indexOfFirstPage, indexOfLastPage)

  // --------------------Download Pdf--------------------
  const [selDwID, setselDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  function getQuotationPdf(isgst: boolean, projectInvoiceID: number) {
    var URL = process.env.REACT_APP_API_URL
    if (isgst === true) {
      URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadCustomerGSTInvoice`
      setDownloadLoader(true)
      setselDwID(projectInvoiceID)
    } else {
      URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadCustomerInvoice`
      setDownloadLoader(true)
      setselDwID(projectInvoiceID)
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      .post(URL, {projectInvoiceID: projectInvoiceID})
      .then((response) => response.data.responseObject)
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
        const fileName = 'Project_Invoice_' + projectInvoiceID + '_' + Tdate + '.pdf'
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
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='col-12 text-start me-2'>
            <div className='text-end mt-3'>
              <Link
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='Click to add a user'
                to={{
                  pathname: `/projects/project/invoice/add`,
                  state: {
                    projectID: state.projectID,
                    customerName: state.customerName,
                    projName: state.projName,
                    projectAmount: state.projectAmount,
                    paidAmount: state.paidAmount,
                    remainingAmount: state.remainingAmount,
                  },
                }}
                className='btn btn-sm btn-light-primary bg-white'
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                Add New
              </Link>
            </div>
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
                  <th className='min-w-125px text-center'>Invoice Date</th>
                  <th className='min-w-150px text-center'>Invoice Number</th>
                  <th className='min-w-125px text-center'>Amount</th>
                  <th className='min-w-125px text-center'>Is GST</th>
                  <th className='min-w-125px text-center'>GST Amount</th>
                  <th className='min-w-125px text-center'>Total Amount</th>
                  <th className='min-w-125px text-center'>Paid Amount</th>
                  <th className='min-w-125px text-center'>Remaining Amount</th>
                  <th className='min-w-125px text-center'>Download Invoice</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
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
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center'>
                            {data.invoiceDate}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center min-w-150px'>
                            {data.voucherNumber}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center'>
                            {data.projectAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center'>
                            {data.isgst === true ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center'>
                            {data.gstAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center'>
                            {data.totalAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center'>
                            {data.paidAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-center'>
                            {data.remainingAmount}
                          </span>
                        </td>
                        <td className='text-center'>
                          <>
                            {downloadLoader && selDwID == data.projectInvoiceID ? (
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
                                onClick={() => getQuotationPdf(data.isgst, data.projectInvoiceID)}
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                                data-bs-toggle='tooltip'
                                data-bs-placement='top'
                                title='Download Invoice'
                              >
                                <span className='fa fa-download fs-2'></span>
                              </span>
                            )}
                          </>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/projects/project/invoice/edit/${data.projectInvoiceID}`,
                                state: {
                                  projectID: state.projectID,
                                  customerName: state.customerName,
                                  projectAmount: state.projectAmount,
                                  projName: state.projName,
                                  paidAmount: state.paidAmount,
                                  remainingAmount: state.remainingAmount,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.projectInvoiceID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </div>
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selProjectInvoiceID}
        pageName={'AdditionalItem'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProjectInvoice(state.selProjectInvoiceID)}
      />
    </>
  )
}

export {InvoicePageList}
