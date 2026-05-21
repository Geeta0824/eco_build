import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFQuotation {
  loading: boolean
  packageName: string
  objpdf: HTMLElement | null
}

const PDFCarpetryPackage: React.FC<Props> = () => {
  const {packageID} = useParams<{packageID: string}>()
  const location = useLocation()
  const [state, setState] = useState<IPDFQuotation>({
    loading: false,
    packageName: '',
    objpdf: null,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      var lc: any = location.state
      var packageName = lc.packageName
      var isDownload = lc.isDownload
      getQuotationPdf(packageName, isDownload)
    }, 100)
  }, [])

  function getQuotationPdf(packageName: string, isDownload: number) {
    var URL = ''
    if (location.pathname === `/carpetry/carpetry-pkg-mst/admin-pdf/${parseInt(packageID)}`) {
      URL = `${process.env.REACT_APP_API_URL}/TurnkeyPDF/DownloadPackagePDFForAdmin`
    } else {
      URL = `${process.env.REACT_APP_API_URL}/TurnkeyPDF/DownloadPackagePDF`
    }
    axios.post(URL, {packageID: parseInt(packageID), isDownload: isDownload}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData

      // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
      var bin = atob(b64)
      // console.log('File Size:', Math.round(bin.length / 1024), 'KB')

      // Embed the PDF into the HTML page and show it to the user
      if (isDownload == 0) {
        var obj = document.createElement('object')
        obj.style.width = '100%'
        obj.style.height = '842pt'
        obj.type = 'application/pdf'
        obj.data = `data:application/pdf;base64,${b64}`
        //obj.title="Quotation Report";
        //  document.body.appendChild(obj)
        var tmpdv = document.getElementById('dvviewpdf')
        tmpdv?.appendChild(obj)
        setState({...state, loading: false, objpdf: tmpdv, packageName: packageName})
      }
      // ------------------------download-------------------------------------
      if (isDownload == 1) {
        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        var fileName1 = ''
        if (location.pathname === `/carpetry/carpetry-pkg-mst/admin-pdf/${parseInt(packageID)}`) {
          fileName1 = `${packageName}_admin`
        } else {
          fileName1 = `${packageName}`
        }
        const fileName = fileName1 + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setState({...state, loading: false, packageName: packageName})
      }
      // -------------------------------------------------------------------------
    })
  }

  return (
    <>
      <div id='dvviewpdf'>
        <Loader loading={state.loading} />
      </div>
    </>
  )
}

export default PDFCarpetryPackage
