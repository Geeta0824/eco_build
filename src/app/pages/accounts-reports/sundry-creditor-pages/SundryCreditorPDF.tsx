import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'

type Props = {}

interface IPDFLedger {
  loading: boolean
  objpdf: HTMLElement | null
  mainSearch: string
}

const SundryCreditorPDF: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState<IPDFLedger>({
    loading: false,
    objpdf: null,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      const lc: any = location.state
      console.log(lc)

      let mainSearch = lc.mainSearch
      getSundryDebtorPDF(mainSearch)
    }, 100)
  }, [])

  function getSundryDebtorPDF(mainSearch: string) {
    var URL = process.env.REACT_APP_API_URL
    URL = `${process.env.REACT_APP_API_URL}/ProjectStatus/Download_SundryCreditorsList_VendorGroup_PDF`
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
      .get(URL)
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
        const fileName = 'Sundry_Creditor_' + Tdate + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setState({...state, mainSearch, loading: false, objpdf: tmpdv})
      })
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/account-reports/sundry-creditor/list',
              state: {mainSearch: state.mainSearch},
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

export default SundryCreditorPDF
