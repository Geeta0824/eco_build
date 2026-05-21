import axios from 'axios'
import React, {useEffect, useState} from 'react'
import Loader from '../common-pages/Loader'
import {useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'

type Props = {}

interface IQuotaionPDFView {
  loading: boolean
  urlPath: string
}

const QuotaionPDFView: React.FC<Props> = () => {
  const {selQuotationID} = useParams<{selQuotationID: string}>()
  const location = useLocation()
  const [state, setState] = useState<IQuotaionPDFView>({
    loading: false,
    urlPath: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getLedgerPdf()
    }, 100)
  }, [])

  function getLedgerPdf() {
    var URL = `${process.env.REACT_APP_API_URL}/Quotation/GetQuotationPdfByQuotationID`
    axios
      .post(URL, {
        quotationID: parseInt(selQuotationID),
      })
      .then((response) => {
        if (response.data.isSuccess == true) {
          let fullPath = process.env.REACT_APP_API_URL + response.data.filePath
          setState({...state, loading: false, urlPath: fullPath})
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false, urlPath: ''})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false, urlPath: ''})
      })
  }

  return (
    <>
      {state.loading === true ? (
        <Loader loading={state.loading} />
      ) : (
        <iframe src={state.urlPath} height={800} width='100%' />
      )}
    </>
  )
}

export default QuotaionPDFView
