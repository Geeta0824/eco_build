import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useLocation, useHistory, Link} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFLedger {
  loading: boolean
  objpdf: HTMLElement | null
  selDay: string
  searchText: string
}

const ProjectMissedDeadlinePDF: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IPDFLedger>({
    loading: false,
    objpdf: null,
    selDay: '',
    searchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let downloadLoader = lc.downloadLoader
      var searchText: any = ''
      var day: any = 'Today'
      if (lc != undefined) {
        searchText = lc.searchText
        day = lc.day
      }
      getProjectPDF(day, searchText, downloadLoader)
    }, 100)
  }, [])

  function getProjectPDF(selDay: string, searchText: string, downloadLoader: boolean) {
    var URL = process.env.REACT_APP_API_URL
    if (selDay === '') {
      URL = `${process.env.REACT_APP_API_URL}/AgencyWorkStage/Download_MissedDeadline_Report_By_TargateDate_PDF`
      downloadLoader = true
    } else {
      URL = `${process.env.REACT_APP_API_URL}/AgencyWorkStage/Download_MissedDeadline_Report_By_TargateDate_PDF`
      downloadLoader = true
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
      .post(URL, {
        targetDate: selDay,
        searchText: searchText,
      })
      .then((response) => response.data.pdfData)
      .then((blob) => {
        var b64 = blob
        var bin = atob(b64)
        var obj = document.createElement('object')
        obj.style.width = '100%'
        obj.style.height = '842pt'
        obj.type = 'application/pdf'
        obj.data = `data:application/pdf;base64,${b64}`
        var tmpdv = document.getElementById('dvviewpdf')
        tmpdv?.appendChild(obj)
        // -------------------------------------------------------------------------

        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        const fileName = 'Project_Missed_Deadline_Report_' + selDay + '_' + Tdate + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        downloadLoader = false
        // -------------------------------------------------------------------------
        setState({...state, loading: false, objpdf: tmpdv, selDay: selDay, searchText: searchText})
      })
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/reports/project-missed-deadline/list',
              state: {
                day: state.selDay,
                searchText: state.searchText,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div id='dvviewpdf'>
        {/* <h1>PDFLedger</h1> */}
        <Loader loading={state.loading} />
        {/* <div id='dvviewpdf'></div> */}
      </div>
    </>
  )
}

export default ProjectMissedDeadlinePDF
