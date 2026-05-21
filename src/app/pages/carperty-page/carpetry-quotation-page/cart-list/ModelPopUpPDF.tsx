import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import Loader from '../../../common-pages/Loader'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {Button, Modal, Card, Col, Form} from 'react-bootstrap-v5'

type Props = {}

interface IPDFQuotation {
  loading: boolean
  base64: string
  selProjectTypeID: number
  objpdf: HTMLElement | null
  selBHKID: number
  selPackageID: number
  selPackageTypeID: number
  planAreaID: number
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
  mainEmployeeID: number
  mainCustomerID: number
  mainSearch: string
}

const CheckOutPDFQuotation: React.FC<Props> = () => {
  const {quotationID} = useParams<{quotationID: string}>()
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  const location = useLocation()
  const [state, setState] = useState<IPDFQuotation>({
    loading: false,
    base64: '',
    selProjectTypeID: 0,
    objpdf: null,
    selBHKID: 0,
    selPackageID: 0,
    selPackageTypeID: 0,
    planAreaID: 0,
    customerName: '',
    bhkName: '',
    carpetAreaName: '',
    projectName: '',
    projectNumber: '',
    mainEmployeeID: 0,
    mainCustomerID: 0,
    mainSearch: '',
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)

      var selPackageID = lc.packageID
      var selPackageTypeID = lc.packageTypeID
      var customerName = lc.customerName
      var bhkName = lc.bhkName
      var carpetAreaName = lc.carpetAreaName
      var projectName = lc.projectName
      var projectNumber = lc.projectNumber
      var bhkid = lc.bhkid
      var carpetAreaID = lc.carpetAreaID
      var projectTypeID = lc.projectTypeID
      var mainEmployeeID = lc.mainEmployeeID
      var mainCustomerID = lc.mainCustomerID
      var mainSearch = lc.mainSearch
      // if (lc !== undefined) {
      //   projectTypeID = lc.projectTypeID
      // }
      getQuotationPdf(
        selPackageID,
        selPackageTypeID,
        customerName,
        bhkName,
        carpetAreaName,
        projectName,
        projectNumber,
        projectTypeID,
        mainEmployeeID,
        mainCustomerID,
        mainSearch
      )
    }, 100)
  }, [])

  // -----------------------------------------------------------------------------------------------------------------
  const [showDIY, setShowDIY] = useState(false)
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    'sqNo',
    'photo',
    'productName',
    'description',
    'unit',
    'quantity',
  ])
  const [selectedCheckboxesAddon, setSelectedCheckboxesAddOn] = useState<string[]>([])

  // ======================================
  function handleCheckboxChange(id: string) {
    setSelectedCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
    setSelectedCheckboxesAddOn((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }
  // ============================
  function handleShowDIY() {
    setShowDIY(true)
  }

  function handleCloseDIY() {
    setShowDIY(false)
    setSelectedCheckboxes(['sqNo', 'photo', 'productName', 'description', 'unit', 'quantity'])
    setSelectedCheckboxesAddOn([])
  }
  // ===============================
  const checkboxOptions = [
    {label: 'Sq No.', id: 'sqNo', checked: true},
    {label: 'Photo', id: 'photo', checked: true},
    {label: 'Product Name', id: 'productName', checked: true},
    {label: 'Description', id: 'description', checked: true},
    {label: 'Unit', id: 'unit', checked: true},
    {label: 'Quantity', id: 'quantity', checked: true},
  ]

  function getQuotationPdf(
    selPackageID: number,
    selPackageTypeID: number,
    customerName: string,
    bhkName: string,
    carpetAreaName: string,
    projectName: string,
    projectNumber: string,
    projectTypeID: number,
    mainEmployeeID: number,
    mainCustomerID: number,
    mainSearch: string
  ) {
 
    var URL = `${process.env.REACT_APP_API_URL}/TurnkeyPDF/Download_Carpentry_Quotaion_PDF`

    const headers = {
      'Content-Type': 'application/json',
      // 'Content-Disposition': 'inline; filename=filename.pdf'
    }
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      .post(
        URL,
      {quotationID: quotationID, isDownload: 1, employeeID: user.employeeID},
        {headers: headers}
      )
      .then((response) => {
        // The Base64 string of a simple PDF file
        var b64 = response.data.pdfData

        // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
        // var bin = atob(b64)
        // console.log('File Size:', Math.round(bin.length / 1024), 'KB')

        // Embed the PDF into the HTML page and show it to the user
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
          selProjectTypeID: projectTypeID,
          mainEmployeeID,
          mainCustomerID,
          mainSearch,
          selPackageID: selPackageID,
          customerName: customerName,
          bhkName: bhkName,
          carpetAreaName: carpetAreaName,
          projectName: projectName,
          projectNumber: projectNumber,
          loading: false,
        })
      })
  }

  function getQuotationPdfIsDownload() {
    setDownloadLoader(true)
    var payload = {
      quotationID,
      employeeID: user.employeeID,
      isDownload: 1,
      isSrNo: selectedCheckboxes.includes('sqNo'),
      isPhoto: selectedCheckboxes.includes('photo'),
      isProductName: selectedCheckboxes.includes('productName'),
      isDescription: selectedCheckboxes.includes('description'),
      isUnit: selectedCheckboxes.includes('unit'),
      isQty: selectedCheckboxes.includes('quantity'),
      addonPrice: selectedCheckboxesAddon.includes('AddonPrice'), // Keep this part for 'AddonPrice'
    }
    // var URL = `${process.env.REACT_APP_API_URL}/TurnkeyPDF/Download_Carpentry_Quotaion_PDF`
    var URL = `${process.env.REACT_APP_API_URL}/TurnkeyPDF/Download_Carpentry_Quotaion_PDF_WithClm`
   
    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '-' + (todaydate.getMonth() + 1) + '-' + todaydate.getFullYear()
    axios
    // .post(URL, {quotationID: parseInt(quotationID), isDownload: 1})
    .post(
      URL,
      payload || {quotationID: quotationID, isDownload: 1, employeeID: user.employeeID},
     
    )
    .then((response) => {
      // The Base64 string of a simple PDF file
      var b64 = response.data.pdfData

      const linkSource = `data:application/pdf;base64,${b64}`
      const aPdfDownload = document.createElement('a')
      const fileName = 'PACKAGE_' + parseInt(quotationID) + '_' + Tdate + '.pdf'
      aPdfDownload.setAttribute('download', fileName)
      aPdfDownload.href = linkSource
      aPdfDownload.download = fileName
      document.body.append(aPdfDownload)
      aPdfDownload.click()
      aPdfDownload.remove()
      setDownloadLoader(false)
      setSelectedCheckboxes(['sqNo', 'photo', 'productName', 'description', 'unit', 'quantity'])
      setSelectedCheckboxesAddOn([])
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
              pathname: `/quotations/ready-made-quotation/view-cart/${parseInt(quotationID)}`,
              state: {
                packageID: state.selPackageID,
                packageTypeID: state.selPackageTypeID,
                customerName: state.customerName,
                bhkName: state.bhkName,
                carpetAreaName: state.carpetAreaName,
                projectName: state.projectName,
                projectNumber: state.projectNumber,
                projectTypeID: state.selProjectTypeID,
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
              pathname: `/quotations/ready-made-quotation/list`,
              state: {
                packageID: state.selPackageID,
                packageTypeID: state.selPackageTypeID,
                customerName: state.customerName,
                bhkName: state.bhkName,
                carpetAreaName: state.carpetAreaName,
                projectName: state.projectName,
                projectNumber: state.projectNumber,
                projectTypeID: state.selProjectTypeID,

                backList: 1,
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
                onClick={handleShowDIY}
              >
                Download
              </span>
           
            </span>
          )}
        </span>
      </div>
      {/* <div className={state.loading === true ? 'd-none' : 'text-end'}>
        <span>
          <span
            className='btn btn-sm btn-light-primary bg-dark fs-5 mb-2 me-5 btn btn-rounded'
            onClick={getQuotationPdfIsDownload}
          >
            Back To List
          </span>
        </span>
      </div> */}
      <div id='dvviewpdf'>
        <Loader loading={state.loading} />
      </div>
         {/* ========================================Download POpUP================================= */}
         <Modal
        show={showDIY}
        onHide={handleCloseDIY}
        fullscreen='sm-down'
        backdrop='true'
        keyboard={false}
      >
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          {/* <Modal.Title className='text-white'>Project No : {state.selProjectNo}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-between'>
            {/* Single Card with two columns */}
            <Card style={{width: '100%'}} className='shadow-sm border-0'>
              <Col xs={12} md={12} className='d-flex'>
                {/* Left Side: Normal Checkboxes */}
                <div className='flex-grow-1'>
                  {checkboxOptions.map((option, index) => (
                    <div
                      className='form-check form-check-custom form-check-solid mt-5 ms-3'
                      key={index}
                    >
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={option.id}
                        checked={selectedCheckboxes.includes(option.id)}
                        onChange={() => handleCheckboxChange(option.id)}
                      />
                      <label className='form-check-label min-w-150px' htmlFor={option.id}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>

                <div className='ms-3'>
                  <div className='form-check form-check-custom form-check-success form-check-solid mt-5'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='AddonPrice'
                      checked={selectedCheckboxesAddon.includes('AddonPrice')}
                      onChange={() => handleCheckboxChange('AddonPrice')}
                    />
                    <label className='form-check-label min-w-150px' htmlFor='AddonPrice'>
                      Addon Items Price
                    </label>
                  </div>
                </div>
              </Col>
            </Card>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() =>
              getQuotationPdfIsDownload()
            }
          >
            Download
          </Button>

          <Button variant='secondary' onClick={handleCloseDIY}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default CheckOutPDFQuotation
