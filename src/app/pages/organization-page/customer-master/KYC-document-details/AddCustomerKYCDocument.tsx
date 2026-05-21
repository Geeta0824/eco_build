import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useParams} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  ICustomerKYCDocumentModel,
  customerKYCDocumentIniValues as initialValues,
} from '../../../../models/organization-page/customer/ICustomerKYCDocumentModel'
import {
  createCustomerKYCDocument,
  // saveCustomerKycPhoto,
} from '../../../../modules/organization-page/customer-master-page/KYC-document-details/CustomerKYCDocCRUD'
import {getAllKycDocument} from '../../../../modules/master-page/kyc-document-page/KycDocumentCRUD'
import {IKycDocumentModel} from '../../../../models/master-page/IKycDocumentModel'
import Loader from '../../../common-pages/Loader'
import {IMediaTypeModel} from '../../../../models/master-page/IDocumentTypeModel'
import {getMediaTypeApi} from '../../../../modules/otherDropDowns/MediaTypeCRUD'

const profileDetailsSchema = Yup.object().shape({
  kycDocID: Yup.string()
    .required('Document Type Name is required')
    .min(1, 'Document Type Name is required'),
  // documentNumber: Yup.string().required('Document Number is required'),
})

interface ICustomerKYCDoc {
  loading: boolean
  kycDocumentTypeData: IKycDocumentModel[]
  customerKYCDocData: ICustomerKYCDocumentModel[]
  mediaData: IMediaTypeModel[]
  selCustomerID: number
  SearchText: string
  selDocMapId: number
  activeID: number
  activeType: any
  hideShow: boolean
  selMediaType: number
}

const AddCustomerKYCDocument: React.FC = () => {
  const history = useHistory()
  const [photo, setPhoto] = useState('')
  const [isActive, setIsActive] = useState(false)
  const {customerID} = useParams<{customerID: string}>()
  const [fileLoader, setFileLoader] = useState(false)
  const [data, setData] = useState<ICustomerKYCDocumentModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICustomerKYCDocumentModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<ICustomerKYCDoc>({
    loading: false,
    kycDocumentTypeData: [] as IKycDocumentModel[],
    customerKYCDocData: [] as ICustomerKYCDocumentModel[],
    mediaData: [] as IMediaTypeModel[],
    selCustomerID: 0,
    SearchText: '',
    selDocMapId: 0,
    activeID: 0,
    activeType: false,
    hideShow: false,
    selMediaType: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      // let customerID = localStorage.getItem('editCustomerID')!
      // let finalCustomerID: number = JSON.parse(customerID)
      getKYCDocumentTypeData(parseInt(customerID))
    }, 100)
  }, [])

  function getKYCDocumentTypeData(finalCustomerID: number) {
    getAllKycDocument()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getMediaTypeData(finalCustomerID, responseData)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, kycDocumentTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, kycDocumentTypeData: [], loading: false})
      })
  }

  function getMediaTypeData(finalCustomerID: number, kycDocumentTypeData: IKycDocumentModel[]) {
    getMediaTypeApi()
      .then((response) => {
        let responseData = response.data.responseObject
        setState({
          ...state,
          kycDocumentTypeData: kycDocumentTypeData,
          selCustomerID: finalCustomerID,
          mediaData: responseData,
          loading: false,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, mediaData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'kycDocID') {
      formik.setFieldValue('kycDocID', parseInt(value))
    } else if (elementId === 'mediaTypeID') {
      setState({...state, selMediaType: parseInt(value)})
      formik.setFieldValue('mediaTypeID', parseInt(value))
    }
  }

  const imageUpload = (e: any) => {
    if(e.target.files[0].size > 20971520){
      return toast.error('File size has exceeded it max limit of 20MB')
    }
    setFileLoader(true)
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)

    fetch(
      process.env.REACT_APP_API_URL + `/CustomerKYCDocument/SaveKycPhoto/${state.selCustomerID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setPhoto(data)
        setFileLoader(false)
      }).catch((err)=>{
     //  console.log(err)
        setFileLoader(false)
      })
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICustomerKYCDocumentModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if(values.mediaTypeID === 0 || state.selMediaType === 0){
          formik.setFieldValue('mediaTypeID', 0)
          setPhoto('')
        }
        createCustomerKYCDocument(
          state.selCustomerID,
          values.kycDocID,
          values.documentNumber,
          photo,
          isActive,
          user.employeeID,
          '128.66.88'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull')
              history.push(`/organization/customer/edit/1/document/list`)
              setLoading(false)
            } else {
              toast.error(`${response.data.message}`)
              setLoading(false)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
            setLoading(false)
          })
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        {/* <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0 ms-6'>Create Customer Document Map</h3>
        </div>
      </div> */}
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>KYC Document Type:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='kycDocID'
                  >
                    <option selected value={0}>
                      Select Document Type
                    </option>
                    {state.kycDocumentTypeData.length > 0 &&
                      state.kycDocumentTypeData.map((data, index) => {
                        return (
                          <option key={index} value={data.kycDocID}>
                            {data.documentName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.kycDocID && formik.errors.kycDocID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.kycDocID}</div>
                    </div>
                  )}
                </div>
                {/* </div>

              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Document Number:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Document Number'
                    {...formik.getFieldProps('documentNumber')}
                  />
                  {formik.touched.documentNumber && formik.errors.documentNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.documentNumber}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Media Type:</label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='mediaTypeID'
                  >
                    <option selected value={0}>
                      Select Media
                    </option>
                    {state.mediaData.length > 0 &&
                      state.mediaData.map((data, index) => {
                        return (
                          <option key={index} value={data.mediaTypeID}>
                            {data.mediaType}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.mediaTypeID && formik.errors.mediaTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.mediaTypeID}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className={state.selMediaType === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Upload Photo:</span>
                </label>

                <div className='col-lg-2 d-flex align-items-center'>
                  <div className='symbol symbol-45px me-5'>
                    <img src={process.env.REACT_APP_API_URL + photo} alt='img' />
                  </div>
                </div>
                <div className='col-lg-7 fv-row'>
                  <input
                    type='file'
                    // accept=''
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading || fileLoader}>
                {!loading && !fileLoader && 'Save'}
                {(loading || fileLoader) && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link
                to={`/organization/customer/edit/${state.selCustomerID}/document/list`}
                className='btn btn-danger ms-3'
              >
                Close
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {AddCustomerKYCDocument}
