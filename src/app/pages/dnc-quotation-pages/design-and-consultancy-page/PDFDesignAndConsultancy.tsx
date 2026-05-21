import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFQuotation {
  loading: boolean
  objpdf: HTMLElement | null
  mainEmployeeID: number
  mainCustomerID: number
  mainSearch: string
}

const PDFDesignAndConsultancy: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const location = useLocation()
  const [state, setState] = useState<IPDFQuotation>({
    loading: false,
    objpdf: null,
    mainEmployeeID: 0,
    mainCustomerID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)

      let mainEmployeeID: number = 0
      let mainCustomerID: number = 0
      let mainSearch: string = ''
      if (
        lc.mainEmployeeID !== undefined ||
        lc.mainCustomerID !== undefined ||
        lc.mainSearch !== undefined
      ) {
        mainEmployeeID = lc.employeeID
        mainCustomerID = lc.customerID
        mainSearch = lc.mainSearch
      }
      // var lc: any = location.state
      // // var packageName = lc.packageName
      // var isDownload = lc.isDownload
      getQuotationPdf(mainEmployeeID, mainCustomerID, mainSearch)
    }, 100)
  }, [])

  function getQuotationPdf(mainEmployeeID: number, mainCustomerID: number, mainSearch: string) {
    var URL = ''
    if (location.pathname == `/quotations/diy-quotation/pdf/${parseInt(quotationID)}`) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDF`
    } else if (
      location.pathname == `/quotations/diy-quotation/agency-breakup-pdf/${parseInt(quotationID)}`
    ) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFForAdminWithAgency`
    } else if (
      location.pathname == `/quotations/diy-quotation/admin-pdf/${parseInt(quotationID)}`
    ) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFForAdmin`
    } else {
      alert('Error')
    }

    axios.post(URL, {quotationID: parseInt(quotationID), isDownload: 0}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData
      // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
      // var bin = atob(b64)
      // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
      // Embed the PDF into the HTML page and show it to the user
      //=============Show pdf======================
      var obj = document.createElement('object')
      obj.style.width = '100%'
      obj.style.height = '842pt'
      obj.type = 'application/pdf'
      obj.data = `data:application/pdf;base64,${b64}`
      //obj.title="Quotation Report";
      //  document.body.appendChild(obj)
      var tmpdv = document.getElementById('dvviewpdf')
      tmpdv?.appendChild(obj)

      setState({
        ...state,
        mainEmployeeID,
        mainCustomerID,
        mainSearch,
        loading: false,
        objpdf: tmpdv,
      })
    })
  }

  function getQuotationPdfIsDownload() {
    setDownloadLoader(true)
    var URL = ''
    if (location.pathname == `/quotations/diy-quotation/pdf/${parseInt(quotationID)}`) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDF`
    } else if (
      location.pathname == `/quotations/diy-quotation/agency-breakup-pdf/${parseInt(quotationID)}`
    ) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFForAdminWithAgency`
    } else if (
      location.pathname == `/quotations/diy-quotation/admin-pdf/${parseInt(quotationID)}`
    ) {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFForAdmin`
    } else {
      alert('Error')
    }

    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()

    axios.post(URL, {quotationID: parseInt(quotationID), isDownload: 1}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData
      // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
      // var bin = atob(b64)
      // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
      // Embed the PDF into the HTML page and show it to the user
      //=============Show pdf======================
      const linkSource = `data:application/pdf;base64,${b64}`
      const aPdfDownload = document.createElement('a')
      const fileName = 'PACKAGE_' + parseInt(quotationID) + '_' + Tdate + '.pdf'
      aPdfDownload.setAttribute('download', fileName)
      aPdfDownload.href = linkSource
      aPdfDownload.download = fileName
      document.body.append(aPdfDownload)
      aPdfDownload.click()
      aPdfDownload.remove()
      setDownloadLoader(false)
    })
  }

  return (
    <>
      <div className={state.loading === true ? 'd-none' : 'text-end'}>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 me-5 btn btn-rounded'
            to={{
              pathname: '/dnc-quotation/design-and-consultancy/list',
              state: {
                employeeID: state.mainEmployeeID,
                customerID: state.mainCustomerID,
                mainSearch: state.mainSearch,
              },
            }}
          >
            Back To List
          </Link>
        </span>
        {downloadLoader ? (
          <span className='d-flex justify-content-end me-15 mb-2'>
            <span
              className='spinner-border text-primary'
              style={{width: '2rem', height: '2rem'}}
              role='status'
            >
              <span className='visually-hidden'>Loading...</span>
            </span>
          </span>
        ) : (
          <span>
            <span
              className='btn btn-sm btn-light-primary bg-dark fs-5 mb-2 me-5 btn btn-rounded'
              onClick={getQuotationPdfIsDownload}
            >
              Download
            </span>
          </span>
        )}
      </div>
      <div id='dvviewpdf'>
        <Loader loading={state.loading} />
      </div>
    </>
  )
}

export default PDFDesignAndConsultancy
