import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFLedger {
  loading: boolean
  objpdf: HTMLElement | null
}

const ProjectPDF: React.FC<Props> = () => {
  const {projectID} = useParams<{projectID: string}>()
  const location = useLocation()
  const [state, setState] = useState<IPDFLedger>({
    loading: false,
    objpdf: null,
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    let ProjectName = lc.ProjectName
    setTimeout(() => {
      getProjectPDF(ProjectName)
    }, 100)
  }, [])

  function getProjectPDF(ProjectName: string) {
    var URL = process.env.REACT_APP_API_URL
    if (parseInt(projectID) === 0) {
      URL = `${process.env.REACT_APP_API_URL}/AccountReport/Download_ProjectReport_PDF`
    } else {
      URL = `${process.env.REACT_APP_API_URL}/AccountReport/Download_ProjectReport_PDF`
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
      .post(URL, {
        projectID: parseInt(projectID),
      })
      .then((response) => response.data.pdfData)
      .then((blob) => {
        // console.log(blob)
        // The Base64 string of a simple PDF file
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
        const fileName = 'Project_Detail_Report_' + ProjectName + '.pdf'
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
        setState({...state, loading: false, objpdf: tmpdv})
      })
  }

  return (
    <>
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

export default ProjectPDF
