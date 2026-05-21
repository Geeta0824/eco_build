import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFLedger {
  loading: boolean
  objpdf: HTMLElement | null
  startDate: string
  endDate: string
}

const ExpenseHeadReportPdf: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IPDFLedger>({
    loading: false,
    objpdf: null,
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let startDate: any = lc.startDate
      let endDate: any = lc.endDate
      getProjectPDF(startDate, endDate)
    }, 100)
  }, [])

  function getProjectPDF(startDate: string, endDate: string) {
    var URL = process.env.REACT_APP_API_URL
    URL = `${process.env.REACT_APP_API_URL}/ExpenseMasters/Download_ExpenseHeadList_PDF`
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
      .post(URL, {
        startDate: startDate,
        endDate: endDate,
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
        const fileName = 'Expense_Head_Report_' + Tdate + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setState({...state, loading: false, objpdf: tmpdv, startDate, endDate})
      })
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/account-reports/expense/header/list',
              state: {mainStartDate: state.startDate, mainEndDate: state.endDate},
            })
          }}
        >
          Back To List
        </span>
      </div>
      <div id='dvviewpdf'>
        <Loader loading={state.loading} />
      </div>
    </>
  )
}

export default ExpenseHeadReportPdf
