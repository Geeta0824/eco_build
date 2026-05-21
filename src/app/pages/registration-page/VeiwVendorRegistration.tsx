import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup/redux/RootReducer'
import {UserModel} from '../../modules/auth/models/UserModel'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import Loader from '../common-pages/Loader'
import {getVenderViewDataApi} from '../../modules/master-page/vender-master-page/VenderCRUD'
import {toast} from 'react-toastify'
import {IRegistrationModel} from '../../models/registration-page/IRegistrationModel'
import {getViewNewVendorRegistrationByVendorID} from '../../modules/registration-master-page/RegistrationCRUD'
import {Button, Modal} from 'react-bootstrap-v5'
import {toAbsoluteUrl} from '../../../_Ecd/helpers'

type Props = {}
interface IMyProfile {
  loading: boolean
  vendorRegistrationData: IRegistrationModel
  imageShow: string
  imagePan: string
  mainSearch: string
}

export function VeiwVendorRegistration() {
  const location = useLocation()
  const history = useHistory()
  const {vendorID} = useParams<{vendorID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    vendorRegistrationData: {} as IRegistrationModel,
    imageShow: '',
    imagePan: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state

      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getMyVendorRegistrationData(mainSearch)
    }, 100)
  }, [])

  function getMyVendorRegistrationData(mainSearch: string) {
    getViewNewVendorRegistrationByVendorID(parseInt(vendorID))
      .then((response) => {
        const personData = response.data
        setState({...state, vendorRegistrationData: personData, mainSearch, loading: false})
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, vendorRegistrationData: {} as IRegistrationModel, loading: false})
      })
  }

  const {vendorRegistrationData} = state

  // ====================Images Aadhaar============
  const [showAadhaar, setShowAadhaar] = useState(false)
  const handleCloseAadhaar = () => {
    setState({...state, imageShow: '', loading: false})
    setShowAadhaar(false)
  }
  const handleShowAadhaar = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowAadhaar(true)
  }
  // ====================Images Pan============
  const [showPan, setShowPan] = useState(false)
  const handleClosePan = () => {
    setState({...state, imagePan: '', loading: false})
    setShowPan(false)
  }
  const handleShowPan = (selImgPan: string) => {
    setState({...state, imagePan: process.env.REACT_APP_API_URL + selImgPan, loading: false})
    setShowPan(true)
  }
  return (
    <>
      <div className='text-end mb-4'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/registration/vendor-reg-req/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To List
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className='card mb-3 mb-xl-2' id='kt_profile_details_view'>
        <div className='card-body p-9 ms-5'>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Company Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{vendorRegistrationData.companyName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Contact Parson</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{vendorRegistrationData.contactPerson}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Contact Number</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{vendorRegistrationData.contactNumber}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Email</label>
            <div className='col-lg-8'>
              <a href='#' className='fw-bolder fs-6 text-dark'>
                {vendorRegistrationData.email}
              </a>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>About Vendor</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{vendorRegistrationData.aboutVendor}</span>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Address</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{vendorRegistrationData.address}</span>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>GST Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{vendorRegistrationData.gstNumber}</span>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Aadhar Card Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {vendorRegistrationData.aadharCardNumber}
              </span>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Pan Card Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {vendorRegistrationData.pancardNumber}
              </span>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted mt-5'>Aadhar Card</label>
            <div className='col-lg-8'>
              <div
                className='symbol symbol-50px cursor-pointer me-5'
                title='View'
                onClick={() => handleShowAadhaar(vendorRegistrationData.aadharCardAttach)}
              >
                {vendorRegistrationData.aadharCardAttach !== '' ? (
                  <img
                    src={process.env.REACT_APP_API_URL + vendorRegistrationData.aadharCardAttach}
                    alt=''
                  />
                ) : (
                  <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                )}
              </div>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted mt-5'>Pan Card</label>
            <div className='col-lg-8'>
              <div
                className='symbol symbol-50px me-5 cursor-pointer'
                title='View'
                onClick={() => handleShowPan(vendorRegistrationData.panCardAttach)}
              >
                {vendorRegistrationData.panCardAttach !== '' ? (
                  <img
                    src={process.env.REACT_APP_API_URL + vendorRegistrationData.panCardAttach}
                    alt=''
                  />
                ) : (
                  <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* =====================Aadhaar Card Image Model=================== */}
      <Modal
        size='lg'
        show={showAadhaar}
        onHide={handleCloseAadhaar}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Aadhaar Card Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img
              alt='image not found'
              className='img-fluid'
              src={
                state.imageShow == ''
                  ? toAbsoluteUrl('/media/img/NoProductImage.png')
                  : toAbsoluteUrl(`${state.imageShow}`)
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseAadhaar}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =====================Pan Card Image Model=================== */}
      <Modal
        size='lg'
        show={showPan}
        onHide={handleClosePan}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Pan Card Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img
              alt='image not found'
              className='img-fluid'
              src={
                state.imagePan == ''
                  ? toAbsoluteUrl('/media/img/NoProductImage.png')
                  : toAbsoluteUrl(`${state.imagePan}`)
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClosePan}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
