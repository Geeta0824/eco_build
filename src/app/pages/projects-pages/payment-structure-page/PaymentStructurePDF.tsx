import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFLedger {
  loading: boolean
  objpdf: HTMLElement | null
  customerName: string
  projectName: string
}

const PaymentStructurePDF: React.FC<Props> = () => {
  const {projectID} = useParams<{projectID: string}>()
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IPDFLedger>({
    loading: false,
    objpdf: null,
    customerName: '',
    projectName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    let projName: any = lc.projName
    let customerName: any = lc.customerName
    setTimeout(() => {
      getProjectPaymentStructurePDF(projName, customerName)
    }, 100)
  }, [])

  function getProjectPaymentStructurePDF(projName: string, customerName: string) {
    var URL = process.env.REACT_APP_API_URL
    if (parseInt(projectID) === 0) {
      URL = `${process.env.REACT_APP_API_URL}/ProjectPaymentStructurePDFController/DownloadProjectPaymentStructurePDFForAdmin`
    } else {
      URL = `${process.env.REACT_APP_API_URL}/ProjectPaymentStructurePDFController/DownloadProjectPaymentStructurePDFForAdmin`
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      .post(URL, {
        projectID: parseInt(projectID),
      })
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
        const fileName = 'Ledger_' + customerName + '_' + projName + '.pdf'
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
          customerName: customerName,
          projectName: projName,
        })
      })
  }

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: `/projects/project/edit/${parseInt(projectID)}/paymentstructure/list`,
              state: {projName: state.projectName, customerName: state.customerName},
            })
          }
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

export default PaymentStructurePDF
