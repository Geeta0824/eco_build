import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFLedger {
  loading: boolean
  objpdf: HTMLElement | null
  pmcWorkStageID: number
  projectID: number
  searchText: string
  ProjectName: string
}

const ProjectProfitLossReportPDF: React.FC<Props> = () => {
  const {projectID} = useParams<{projectID: string}>()
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IPDFLedger>({
    loading: false,
    objpdf: null,
    pmcWorkStageID: 0,
    projectID: 0,
    searchText: '',
    ProjectName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let pmcWorkStageID: any = lc.pmcWorkStageID
      let projectID: any = lc.projectID
      let ProjectName: any = lc.ProjectName
      let searchText: any = lc.searchText
      getProjectPDF(pmcWorkStageID, projectID, ProjectName, searchText)
    }, 100)
  }, [])

  function getProjectPDF(
    pmcWorkStageID: number,
    projectID: number,
    ProjectName: string,
    searchText: string
  ) {
    var URL = process.env.REACT_APP_API_URL
    URL = `${process.env.REACT_APP_API_URL}/AccountReport/Download_ProjectProfitLossReport_PDF`
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
      .post(URL, {pmcWorkStageID: pmcWorkStageID, projectID: projectID})
      .then((response) => response.data.pdfData)
      .then((blob) => {
        var b64 = blob
        var obj = document.createElement('object')
        obj.style.width = '100%'
        obj.style.height = '842pt'
        obj.type = 'application/pdf'
        obj.data = `data:application/pdf;base64,${b64}`
        var tmpdv = document.getElementById('dvviewpdf')
        tmpdv?.appendChild(obj)
        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        let fileName: string = ''
        if (projectID > 0) {
          fileName = 'Project_Profit_Loss_Report' + ProjectName + Tdate + '.pdf'
        } else {
          fileName = 'Project_Profit_Loss_All_Reports' + Tdate + '.pdf'
        }
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setState({
          ...state,
          loading: false,
          objpdf: tmpdv,
          pmcWorkStageID,
          projectID,
          searchText,
          ProjectName,
        })
      })
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/account-reports/project-profit-loss/list',
              state: {
                pmcWorkStageID: state.pmcWorkStageID,
                projectID: state.projectID,
                search: state.searchText,
                projectName: state.ProjectName,
              },
            })
          }}
        >
          Back To List
        </span>
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

export default ProjectProfitLossReportPDF
