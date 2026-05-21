import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useLocation, useParams, Link} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFCashAccount {
  loading: boolean
  objpdf: HTMLElement | null
  VendorID: number
  StartDate: string
  EndDate: string
  SearchText: string
  VendorName: string
}

const PurchasePDF: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IPDFCashAccount>({
    loading: false,
    objpdf: null,
    VendorID: 0,
    StartDate: '',
    EndDate: '',
    SearchText: '',
    VendorName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let VendorID: any = lc.VendorID
      let StartDate: any = lc.StartDate
      let EndDate: any = lc.EndDate
      let SearchText: any = lc.SearchText
      let VendorName: any = lc.VendorName
      getProjectPDF(VendorID, StartDate, EndDate, SearchText, VendorName)
    }, 100)
  }, [])

  function getProjectPDF(
    VendorID: number,
    StartDate: string,
    EndDate: string,
    SearchText: string,
    VendorName: string
  ) {
    var URL = process.env.REACT_APP_API_URL
    URL = `${process.env.REACT_APP_API_URL}/PurchaseMasters/Download_Purchase_PDF`
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
      .post(URL, {
        vendorID: VendorID,
        startDate: StartDate,
        endDate: EndDate,
        searchText: SearchText,
      })
      .then((response) => response.data.pdfData)
      .then((blob) => {
        var b64 = blob

        // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
        var bin = atob(b64)
        //console.log('File Size:', Math.round(bin.length / 1024), 'KB')

        // Embed the PDF into the HTML page and show it to the user
        var obj = document.createElement('object')
        obj.style.width = '100%'
        obj.style.height = '842pt'
        obj.type = 'application/pdf'
        obj.data = `data:application/pdf;base64,${b64}`
        //obj.title="Ledger Report";
        //  document.body.appendChild(obj)
        var tmpdv = document.getElementById('dvviewpdf')
        tmpdv?.appendChild(obj)
        // -------------------------------------------------------------------------
        // var fName = "example.pdf"
        // const shareLink = `https://web.whatsapp.com//send?text=${encodeURIComponent(`data:application/pdf;base64,${b64}`)}&filename=${fName}`
        // window.open(shareLink)
        // window.open(`https://api.whatsapp.com/send?phone=9712312188&amp;file=${tmpdv?.appendChild(obj)}`)

        // -------------------------------------------------------------------------

        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        let fileName: string = ''
        if (VendorID > 0) {
          fileName = 'Purchase_Report_' + VendorName + '_' + Tdate + '.pdf'
        } else {
          fileName = 'Purchase_Report_All_' + Tdate + '.pdf'
        }
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()

        // -------------------------------------------------------------------------

        // Insert a link that allows the user to download the PDF file
        // var link = document.createElement('a')
        // link.innerHTML = 'Download PDF file'
        // link.download = 'file.pdf'
        // link.href = 'data:application/octet-stream;base64,' + b64
        // document.body.appendChild(link)
        setState({
          ...state,
          loading: false,
          objpdf: tmpdv,
          VendorID,
          StartDate,
          EndDate,
          SearchText,
          VendorName,
        })
      })
  }

  return (
    <>
      <div className='text-end'>
        <Link
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          to={{
            pathname: '/account-reports/purchase/list',
            state: {
              VendorID: state.VendorID,
              StartDate: state.StartDate,
              EndDate: state.EndDate,
              SearchText: state.SearchText,
              VendorName: state.VendorName,
            },
          }}
        >
          Back To List
        </Link>
      </div>
      {/* <a
        href={`https://api.whatsapp.com/send?phone=9712312188&amp;file=${state.objpdf}`}
        data-action='share/whatsapp/share'
        target='_blank'
      >
        {' '}
        Share to WhatsApp{' '}
      </a> */}
      <div id='dvviewpdf'>
        {/* <h1>PDFLedger</h1> */}
        <Loader loading={state.loading} />
        {/* <div id='dvviewpdf'></div> */}
      </div>
    </>
  )
}

export default PurchasePDF
