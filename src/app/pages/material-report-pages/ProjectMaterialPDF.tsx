import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import Loader from '../common-pages/Loader'

type Props = {}

interface IPDFLedger {
  loading: boolean
  objpdf: HTMLElement | null
}

const ProjectMaterialPDF: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IPDFLedger>({
    loading: false,
    objpdf: null,
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    let ProjectName = lc.ProjectName
    let ProjectID = lc.ProjectID
    let ProjectCategoryID = lc.ProjectCategoryID
    let downloadLoader = lc.downloadLoader
    setTimeout(() => {
      getProjectPDF(ProjectName, ProjectID, ProjectCategoryID, downloadLoader)
    }, 100)
  }, [])

  function getProjectPDF(
    ProjectName: string,
    ProjectID: number,
    ProjectCategoryID: number,
    downloadLoader: boolean
  ) {
    var URL = process.env.REACT_APP_API_URL
    if (ProjectID === 0) {
      URL = `${process.env.REACT_APP_API_URL}/PMCWorkStageStructure/Download_ProjectWise_MaterialInfo_Report_PDF`
      downloadLoader = true
    } else {
      URL = `${process.env.REACT_APP_API_URL}/PMCWorkStageStructure/Download_ProjectWise_MaterialInfo_Report_PDF`
      downloadLoader = true
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
      .post(URL, {
        projectID: ProjectID,
        projectCategoryID: ProjectCategoryID,
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
        const fileName = 'Project_Detail_Report_' + ProjectName + '_' + Tdate + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        downloadLoader = false
        // -------------------------------------------------------------------------
        setState({...state, loading: false, objpdf: tmpdv})
      })
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push('/reports/project-material/list')
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

export default ProjectMaterialPDF
