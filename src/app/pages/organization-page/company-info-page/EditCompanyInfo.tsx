import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {
  ICompanyInfoModel,
  companyInfoInitValue as initialValues,
} from '../../../models/company-info/ICompanyInfoModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {
  UpdateCompanyInfo,
  getCompanyInfoListByID,
} from '../../../modules/organization-page/comany-info-master/ComanyInfoCRUD'

const profileDetailsSchema = Yup.object().shape({
  companyName: Yup.string().required('Account Number is required'),
})

interface ICustomerBankDetails {
  companyInfoData: ICompanyInfoModel[]
  loading: boolean
  companyID: number
  selCompanyID: number
  selStateID: number
  mainSearch: string
}

const EditCompanyInfo: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const {companyID} = useParams<{companyID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [isActive, setIsActive] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [fileLoader2, setFileLoader2] = useState<boolean>(false)
  const [logoPath, setLogoPath] = useState<string>('')
  const [signPath, setSignPath] = useState<string>('')
  const [data, setData] = useState<ICompanyInfoModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICompanyInfoModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ICustomerBankDetails>({
    companyInfoData: [] as ICompanyInfoModel[],
    loading: false,

    companyID: 0,
    selCompanyID: 0,
    selStateID: 0,

    mainSearch: '',
  })
  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getCompanyInfoListByCompanyId(mainSearch)
    }, 100)
  }, [])
  function getCompanyInfoListByCompanyId(mainSearch: string) {
    getCompanyInfoListByID(parseInt(companyID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          let resultData = response.data
          formik.setFieldValue('companyID', resultData.companyID)
          formik.setFieldValue('companyName', resultData.companyName)
          formik.setFieldValue('addressLine1', resultData.addressLine1)
          formik.setFieldValue('addressLine2', resultData.addressLine2)
          formik.setFieldValue('landmark', resultData.landmark)
          formik.setFieldValue('pinCode', resultData.pinCode)
          formik.setFieldValue('cityName', resultData.cityName)
          formik.setFieldValue('stateName', resultData.stateName)
          formik.setFieldValue('countryName', resultData.countryName)
          formik.setFieldValue('facebookPath', resultData.facebookPath)
          formik.setFieldValue('instaPath', resultData.instaPath)
          formik.setFieldValue('youTubePath', resultData.youTubePath)
          formik.setFieldValue('termsMessage', resultData.termsMessage)
          formik.setFieldValue('thankyouMsg', resultData.thankyouMsg)
          formik.setFieldValue('gstNumber', resultData.gstNumber)
          formik.setFieldValue('phoneNumber', resultData.phoneNumber)
          formik.setFieldValue('mobileNumber', resultData.mobileNumber)
          formik.setFieldValue('faxNumer', resultData.faxNumer)
          formik.setFieldValue('emailAddress', resultData.emailAddress)
          formik.setFieldValue('gstCode', resultData.gstCode)
          formik.setFieldValue('currencySymbole', resultData.currencySymbole)
          formik.setFieldValue('currencyName', resultData.currencyName)
          formik.setFieldValue('currencyCode', resultData.currencyCode)
          setIsActive(resultData.isActive)
          setLogoPath(resultData.logoPath)
          setSignPath(resultData.signaturePath)
          setSearchText(mainSearch)
        } else {
          toast.error(`${response.data.error}`)
          setState({...state,  loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  //  ==========================Upload logo image====================================
  const imageUploadsLogo = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/CompanyInfo/UploadLogo', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLogoPath(data)
        setFileLoader(false)
      })
  }

  // =================================Upload sign image======================
  const imageUploadSign = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/CompanyInfo/UploadSignature', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setSignPath(data)
        setFileLoader2(false)
      })
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICompanyInfoModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update records ?')
        if (Edit) {
          UpdateCompanyInfo(
            parseInt(companyID),
            values.companyName,
            values.addressLine1,
            values.addressLine2,
            values.landmark,
            values.pinCode,
            values.cityName,
            values.stateName,
            values.countryName,
            isActive,
            signPath,
            values.facebookPath,
            values.instaPath,
            values.youTubePath,
            logoPath,
            values.termsMessage,
            values.thankyouMsg,
            values.gstNumber,
            values.phoneNumber,
            values.mobileNumber,
            values.faxNumer,
            state.selStateID,
            values.emailAddress,
            values.gstCode,
            values.currencySymbole,
            values.currencyName,
            values.currencyCode
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Updated Successfull!')

                history.push({
                  pathname: '/organization/company-info/list',
                  state: {search: searchText},
                })
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
        } else {
          return setLoading(false)
        }

        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Company Name:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Company Name'
                    {...formik.getFieldProps('companyName')}
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.companyName}</div>
                    </div>
                  )}
                </div>

                {/* <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>GST Number:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' GST Number'
                    {...formik.getFieldProps('gstNumber')}
                  />

                  {formik.touched.gstNumber && formik.errors.gstNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.gstNumber}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Address Line1:
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Address Line1'
                    {...formik.getFieldProps('addressLine1')}
                  />

                  {formik.touched.addressLine1 && formik.errors.addressLine1 && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.addressLine1}</div>
                    </div>
                  )}
                </div>
                </div>
            <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Address Line2:
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Address Line2'
                    {...formik.getFieldProps('addressLine2')}
                  />

                  {formik.touched.addressLine2 && formik.errors.addressLine2 && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.addressLine2}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Land Mark:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Land Mark'
                    {...formik.getFieldProps('landmark')}
                  />

                  {formik.touched.landmark && formik.errors.landmark && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.landmark}</div>
                    </div>
                  )}
                </div>
                {/* {/* </div> */}
                {/* <div className='row mb-6'>  */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>City Name:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' City Name'
                    {...formik.getFieldProps('cityName')}
                  />

                  {formik.touched.cityName && formik.errors.cityName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cityName}</div>
                    </div>
                  )}
                </div>
                {/* </div> */}
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Pincode:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Pincode'
                    {...formik.getFieldProps('pinCode')}
                  />

                  {formik.touched.pinCode && formik.errors.pinCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pinCode}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                {/* <div className='row mb-6'> */}

                {/* </div>

            <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>State Name:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='state Name'
                    {...formik.getFieldProps('stateName')}
                  />
                  {formik.touched.stateName && formik.errors.stateName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.stateName}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* </div> */}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Country Name:
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Country Name'
                    {...formik.getFieldProps('countryName')}
                  />

                  {formik.touched.countryName && formik.errors.countryName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.countryName}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* </div> */}

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Phone No:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Phone No'
                    {...formik.getFieldProps('phoneNumber')}
                  />

                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.phoneNumber}</div>
                    </div>
                  )}
                </div>
                {/* </div>
            <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Mobile No:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Mobile no'
                    {...formik.getFieldProps('mobileNumber')}
                  />

                  {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.mobileNumber}</div>
                    </div>
                  )}
                </div>
                {/* </div>
            <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Fax No:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Fax No'
                    {...formik.getFieldProps('faxNumer')}
                  />

                  {formik.touched.faxNumer && formik.errors.faxNumer && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.faxNumer}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Facebook:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Facebook'
                    {...formik.getFieldProps('facebookPath')}
                  />

                  {formik.touched.facebookPath && formik.errors.facebookPath && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.facebookPath}</div>
                    </div>
                  )}
                </div>
                {/* </div>
            <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Instagram:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Instagram'
                    {...formik.getFieldProps('instaPath')}
                  />

                  {formik.touched.instaPath && formik.errors.instaPath && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.instaPath}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>You Tube:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='You Tube'
                    {...formik.getFieldProps('youTubePath')}
                  />

                  {formik.touched.youTubePath && formik.errors.youTubePath && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.youTubePath}</div>
                    </div>
                  )}
                </div>
                {/* </div>
            <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Email Address:
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Email Address'
                    {...formik.getFieldProps('emailAddress')}
                  />

                  {formik.touched.emailAddress && formik.errors.emailAddress && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.emailAddress}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  GST State Code:
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='GST State Code'
                    {...formik.getFieldProps('gstCode')}
                  />

                  {formik.touched.gstCode && formik.errors.gstCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.gstCode}</div>
                    </div>
                  )}
                </div>
               
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Currency:- Name:
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Name'
                    {...formik.getFieldProps('currencyName')}
                  />

                  {formik.touched.currencyName && formik.errors.currencyName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.currencyName}</div>
                    </div>
                  )}
                </div>
                {/* </div>
            <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Symbole:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Symbole'
                    {...formik.getFieldProps('currencySymbole')}
                  />

                  {formik.touched.currencySymbole && formik.errors.currencySymbole && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.currencySymbole}</div>
                    </div>
                  )}
                </div>
                {/* </div>
            <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Code:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Code'
                    {...formik.getFieldProps('currencyCode')}
                  />

                  {formik.touched.currencyCode && formik.errors.currencyCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.currencyCode}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Team message:
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Team Message'
                    {...formik.getFieldProps('termsMessage')}
                  />

                  {formik.touched.termsMessage && formik.errors.termsMessage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.termsMessage}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Thank You Message:
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Thank You Message'
                    {...formik.getFieldProps('thankyouMsg')}
                  />

                  {formik.touched.thankyouMsg && formik.errors.thankyouMsg && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.thankyouMsg}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Upload Logo File:</span>
                  <p className='text-muted fs-7'> (allow only .png& jpg files)</p>
                </label>
                <div className={logoPath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5 ms-5 mb-9'>
                    <img src={process.env.REACT_APP_API_URL + logoPath} alt='img' />
                  </div>
                </div>
                <div className={logoPath === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.png,.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUploadsLogo(e)}
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Upload Sign File:</span>
                  <p className='text-muted fs-7'> (allow only .png & jpg files)</p>
                </label>
                <div className={signPath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5 ms-5 mb-9'>
                    <img src={process.env.REACT_APP_API_URL + signPath} alt='img' />
                  </div>
                </div>
                <div className={signPath === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.png,.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUploadSign(e)}
                  />
                </div>
              </div>

              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {!loading && 'Save'}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
                <Link
                  className='btn btn-danger ms-3'
                  to={{pathname: `/organization/company-info/list`, state: {search: searchText}}}
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {EditCompanyInfo}
