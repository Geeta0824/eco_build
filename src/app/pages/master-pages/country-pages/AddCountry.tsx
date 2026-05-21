import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  ICountryModel,
  countryInitValues as initialValues,
} from '../../../models/master-page/ICountryModel'
import {postCountry} from '../../../modules/master-page/country-master-page/NewCountryCRUD'

const profileDetailsSchema = Yup.object().shape({
  countryName: Yup.string().required('Country name is required'),
  countryCode: Yup.string().required('Country Code is required'),
})

const AddCountry: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState<ICountryModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [file, setFile] = useState('')
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<ICountryModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  useEffect(() => {
    setLoading(false)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      tmpCountryDataFunc(mainSearch)
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  // const OnFileChange = (e: any) => {
  //   setFile(e.target.file)
  // }
  function tmpCountryDataFunc(mainSearch: string) {
    setLoading(false)
    setSearchText(mainSearch)
  }
  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)

    fetch(process.env.REACT_APP_API_URL + '/Country_New/SaveCountryFlag', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        let decodeResp = JSON.parse(atob(data.encodedResponse)) 
        let resp = decodeResp
        setFile(resp)
        setFileLoader(false)
      })
      .catch((err) => {
         console.log(err)
        setFileLoader(false)
      })
  }

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  const formik = useFormik<ICountryModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const createdValues = {
          ...values,
          flagPath: file,
          isActive: isActive,
          createBy: user.employeeID,
          ipAddress: '192.168.0.1',
        } // assuming bhkId is defined somewhere
        var objCountry = btoa(JSON.stringify(createdValues))
        postCountry(`${objCountry}`)
          .then((response) => {
            var decodeResp = JSON.parse(atob(response.data.encodedResponse))
            let resp = decodeResp
            if (resp.isSuccess === true) {
              toast.success('Created Successfull')
              history.push({pathname: '/master/country/list', state: {search: searchText}})
            } else {
              toast.error(`${resp.message}`)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
          })
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/country/list', state: {search: searchText}}}
          >
            Back To List
          </Link>
        </span>
      </div>
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
            <h3 className='fw-bolder m-0 ms-6'>Create Country </h3>
          </div>
        </div> */}
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Country Name:
                </label>

                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Country name'
                    {...formik.getFieldProps('countryName')}
                  />
                  {formik.touched.countryName && formik.errors.countryName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.countryName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Country Code:</span>
                </label>

                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Country Code'
                    {...formik.getFieldProps('countryCode')}
                  />
                  {formik.touched.countryCode && formik.errors.countryCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.countryCode}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Upload File:</span>
                </label>
                <div className='col-lg-2 d-flex align-items-center'>
                  <div className='symbol symbol-45px me-5'>
                    <img src={process.env.REACT_APP_API_URL + file} alt='img' />
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
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
              </button>{' '}
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/master/country/list', state: {search: searchText}}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {AddCountry}
