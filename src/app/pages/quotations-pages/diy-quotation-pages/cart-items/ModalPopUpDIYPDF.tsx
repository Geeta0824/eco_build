import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import Loader from '../../../common-pages/Loader'
import {Button, Card, Col, Form, Modal} from 'react-bootstrap-v5'

type Props = {}

interface IPDFQuotation {
  loading: boolean

  objpdf: HTMLElement | null
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
  mainEmployeeID: number
  mainCustomerID: number
  mainSearch: string
}

const ModalPopUpDIYPDF: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()

  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const location = useLocation()
  const [state, setState] = useState<IPDFQuotation>({
    loading: false,

    objpdf: null,
    customerName: '',
    bhkName: '',
    carpetAreaName: '',
    projectName: '',
    projectNumber: '',
    mainEmployeeID: 0,
    mainCustomerID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      var lc: any = location.state
      console.log(lc)
      var customerName = lc.customerName
      var bhkName = lc.bhkName
      var carpetAreaName = lc.carpetAreaName
      var projectName = lc.projectName
      var projectNumber = lc.projectNumber
      var mainEmployeeID = lc.mainEmployeeID
      var mainCustomerID = lc.mainCustomerID
      var mainSearch = lc.mainSearch
      var isExtraDiscount = lc.isExtraDiscount

      // var lc: any = location.state
      // // var packageName = lc.packageName
      // var isDownload = lc.isDownload
      getQuotationPdf(
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        mainEmployeeID,
        mainCustomerID,
        mainSearch,
        isExtraDiscount
      )
    }, 100)
  }, [])

  // ---------------------------Diy PDF Download -----------------------------------------------------
  const [showDIY, setShowDIY] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState('option1')

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    'sqNo',
    'photo',
    'productName',
    'description',
    'unit',
    'length',
    'height',
    // 'amount',
    // 'beforeDiscount',
    // 'afterDiscount',
  ])

  function handleCheckboxChange(id: string) {
    setSelectedCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function handleRadioChange(value: string) {
    setSelectedRadio(value)

    if (value === 'option1') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
      ])
    } else if (value === 'option2') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
      ])
    } else if (value === 'option3') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
        // 'amount',
        // 'beforeDiscount',
        // 'afterDiscount',
      ])
    } else if (value === 'option4') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
        // 'amount',
      ])
    } else if (value === 'option5') {
      setSelectedCheckboxes([
        'sqNo',
        'photo',
        'productName',
        'description',
        'unit',
        'length',
        'height',
        // 'amount',
      ])
    }
  }

  const isCheckboxDisabled = (checkboxId: string) => {
    return (
      (selectedRadio === 'option3' || selectedRadio === 'option4' || selectedRadio === 'option5') &&
      ['amount', 'beforeDiscount', 'afterDiscount'].includes(checkboxId)
    )
  }
  function handleShowDIY() {
    setShowDIY(true)
  }

  function hancleCloseDIY() {
    setShowDIY(false)
    setSelectedCheckboxes([
      'sqNo',
      'photo',
      'productName',
      'description',
      'unit',
      'length',
      'height',
    ])
    setSelectedRadio('option1')
  }

  const essentialCheckboxes = [
    'sqNo',
    'photo',
    'productName',
    'description',
    'unit',
    'length',
    'height',
  ]

  const radioOptions = [
    {label: 'Regular', value: 'option1', defaultChecked: true},
    {label: 'With Breakup ', value: 'option5', defaultChecked: false},
    {label: 'Area Wise', value: 'option2', defaultChecked: false},
    {label: 'Area Wise With Breakup ', value: 'option4', defaultChecked: false},

    {label: 'Discount Wise', value: 'option3', defaultChecked: false},
  ]
  const checkboxOptions = [
    {label: 'Sq No.', id: 'sqNo'},
    {label: 'Photo', id: 'photo'},
    {label: 'Product Name', id: 'productName'},
    {label: 'Description', id: 'description'},
    {label: 'Unit', id: 'unit'},
    {label: 'Length', id: 'length'},
    {label: 'Height', id: 'height'},

    {label: 'Amount', id: 'amount'},
    {label: 'Before Discount', id: 'beforeDiscount'},
    {label: 'After Discount', id: 'afterDiscount'},
  ]
  const checkboxOptions2 = checkboxOptions.filter((item) => item.id !== 'Amount')
  const displayedCheckboxes =
    selectedRadio === 'option3'
      ? checkboxOptions2
      : checkboxOptions.slice(0, selectedRadio === 'option4' || selectedRadio === 'option5' ? 8 : 7)



// =====================

  function getQuotationPdf(
    customerName: string,
    bhkName: string,
    carpetAreaName: string,
    projectName: string,
    projectNumber: string,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string,
    isExtraDiscount: boolean
  ) {
    var URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDF`

    axios.post(URL, {quotationID: parseInt(quotationID), isDownload: 0}).then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData
      // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
      // var bin = atob(b64)
      // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
      // Embed the PDF into the HTML page and show it to the user
      //=============Show pdf======================
      var obj = document.createElement('object')
      obj.style.width = '100%'
      obj.style.height = '842pt'
      obj.type = 'application/pdf'
      obj.data = `data:application/pdf;base64,${b64}`
      //obj.title="Quotation Report";
      //  document.body.appendChild(obj)
      var tmpdv = document.getElementById('dvviewpdf')
      tmpdv?.appendChild(obj)

      setState({
        ...state,
        loading: false,
        objpdf: tmpdv,
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        mainEmployeeID,
        mainCustomerID,
        mainSearch,
      })
    })
  }

  function getQuotationPdfIsDownload() {
    setDownloadLoader(true)

   
    let URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDF` // Default URL
    if (selectedRadio === 'option1' || selectedRadio === 'option2') {
      const selectedEssentialCheckboxes = selectedCheckboxes.filter((id) =>
        essentialCheckboxes.includes(id)
      )

      if (selectedEssentialCheckboxes.length === 0) {
        alert(
          'Please select at least one checkbox to proceed with the download. This is required to continue.'
        )
        return
      }
    }
    const payload = {
      quotationID,
      skipID: 0,
      isDownload: 1,
      isSrNo: selectedCheckboxes.includes('sqNo'),
      isPhoto: selectedCheckboxes.includes('photo'),
      isProductName: selectedCheckboxes.includes('productName'),
      isDescription: selectedCheckboxes.includes('description'),
      isUnit: selectedCheckboxes.includes('unit'),
      isLength: selectedCheckboxes.includes('length'),
      isHeight: selectedCheckboxes.includes('height'),
      isAmount: selectedCheckboxes.includes('amount'),
      isDiscount: selectedCheckboxes.includes('beforeDiscount'),
      isAfterDisc: selectedCheckboxes.includes('afterDiscount'),
    }

    if (selectedRadio === 'option1') {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFWithClm`
    } else if (selectedRadio === 'option2') {
      URL = `${process.env.REACT_APP_API_URL}/PDF/DownloadDIYQuotationPDFAreaWiseWithClm`
    } else if (selectedRadio === 'option3') {
      URL = `${process.env.REACT_APP_API_URL}/pdf/DownloadDIYQuotationPDFAreaWiseDiscclm`
    } else if (selectedRadio === 'option4') {
      URL = `${process.env.REACT_APP_API_URL}/pdf/DownloadDIYQuotationPDFAreaWiseBreackupclm`
    } else if (selectedRadio === 'option5') {
      URL = `${process.env.REACT_APP_API_URL}/pdf/DownloadDIYQuotationPDFwithBreackupclm`
    }

    const todaydate = new Date()
    const Tdate = `${todaydate.getDate()}-${todaydate.getMonth() + 1}-${todaydate.getFullYear()}`

    axios
      .post(URL, payload || {quotationID: parseInt(quotationID), isDownload: 1})
      .then((response) => {
        const b64 = response.data.pdfData
        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        const fileName = `PACKAGE_${parseInt(quotationID)}_${Tdate}.pdf`

        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.click()
        aPdfDownload.remove()

        setDownloadLoader(false)
        setSelectedRadio('option1') // Different API for option3
        setSelectedCheckboxes([
          'sqNo',
          'photo',
          'productName',
          'description',
          'unit',
          'length',
          'height',
        ])
      })

    setShowDIY(false)
  }

  return (
    <>
      <div className={state.loading === true ? 'd-none' : 'text-end'}>
        <span className='d-flex justify-content-end g-5'>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 me-5 btn btn-rounded'
            to={{
              pathname: `/quotations/diy-quotation/view-cart/${parseInt(quotationID)}`,
              state: {
                quotationID,
                customerName: state.customerName,
                bhkName: state.bhkName,
                carpetAreaName: state.carpetAreaName,
                projectName: state.projectName,
                projectNumber: state.projectNumber,
                mainEmployeeID: state.mainEmployeeID,
                mainCustomerID: state.mainCustomerID,
                mainSearch: state.mainSearch,
                backList: 1,
              },
            }}
          >
            Back
          </Link>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 me-5 btn btn-rounded'
            to={{
              pathname: '/quotations/diy-quotation/list',
              state: {
                employeeID: state.mainEmployeeID,
                customerID: state.mainCustomerID,
                mainSearch: state.mainSearch,
              },
            }}
          >
            Back To List
          </Link>
          {downloadLoader ? (
            <span className='d-flex justify-content-end me-15 mb-2'>
              <span
                className='spinner-border text-primary'
                style={{width: '2rem', height: '2rem'}}
                role='status'
              >
                <span className='visually-hidden'>Loading...</span>
              </span>
            </span>
          ) : (
            <span>
              <span
                className='btn btn-sm btn-light-primary bg-dark fs-5 mb-2 me-5 btn btn-rounded'
                // onClick={getQuotationPdfIsDownload}
                onClick={() => handleShowDIY()}
              >
                Download
              </span>
            </span>
          )}
        </span>
      </div>
      <div id='dvviewpdf'>
        <Loader loading={state.loading} />
      </div>
      {/* ========================================Download POpUP================================= */}
      <Modal show={showDIY} onHide={hancleCloseDIY} size='lg' backdrop='true' keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-white'>DIY PDF Download</Modal.Title>
          {/* <Modal.Title className='text-white'>Project No: {state.selProjectNo}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-between'>
            {/* Left Side: Radio Buttons */}
            <Card style={{width: '48%'}} className='shadow-sm border-0'>
              <Card.Body>
                <h5 className='mb-3'>Select Option</h5>

                {radioOptions.map((option, index) => (
                  <Form.Check
                    type='radio'
                    key={index}
                    label={option.label}
                    name='radioGroup'
                    value={option.value}
                    defaultChecked={option.defaultChecked}
                    className='mb-6 text-hover-primary min-w-150px'
                    onChange={() => handleRadioChange(option.value)}
                  />
                ))}
              </Card.Body>
            </Card>

            {/* Right Side: Checkboxes */}
            <Card style={{width: '48%'}} className='shadow-sm border-0'>
              <Col xs={6} md={4}>
                {displayedCheckboxes.map((option, index) => (
                  <div
                    className='form-check form-check-custom form-check-solid mt-5 ms-3'
                    key={index}
                  >
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id={option.id}
                      // disabled={selectedRadio == 'option3'}
                      // disabled={selectedCheckboxes == ''}

                      checked={selectedCheckboxes.includes(option.id)} // Check if the checkbox is selected
                      onChange={() => handleCheckboxChange(option.id)} // Update selection state
                      disabled={isCheckboxDisabled(option.id)}
                    />
                    <label className='form-check-label min-w-150px' htmlFor={option.id}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </Col>
            </Card>
          </div>

          {/* Pagination */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            // onClick={() =>
            // getQuotationPdf(
            //   `/quotations/diy-quotation/pdf/${state.quotationID}`,
            //   state.quotationID, // Ensure this is not 0
            //   state.selIsModMerge
            // )
            // }
            onClick={getQuotationPdfIsDownload}
          >
            Download
          </Button>

          <Button variant='secondary' onClick={hancleCloseDIY}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalPopUpDIYPDF
