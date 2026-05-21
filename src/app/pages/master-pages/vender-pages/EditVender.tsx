import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IDepartmentModel} from '../../../models/master-page/IDepartmentModel'
import {createDesignation} from '../../../modules/master-page/designation-master-page/DesignationCRUD'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {
  IVenderModel,
  venderInitValues as initialValues,
} from '../../../models/master-page/IVenderModel'
import {venderTypeData} from '../../other-dropDowns/otherDropDowns'
import {
  addVenderDetails,
  getVendorByVendorID,
  updateVendorDetails,
  updateVendorIsactive,
} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  contactNumber: Yup.string().required('Contact Number is required'),
  contactPerson: Yup.string().required('Contact Person is required'),
  // departmentID: Yup.number().required('Department is required').min(1, 'Department is required'),
})

interface IDepartment {
  loading: boolean
  departmentData: IVenderModel[]
  selVenderId: number
  mainSearch: string
}

const EditVender: React.FC = () => {
  const {vendorID} = useParams<{vendorID: string}>()
  const [data, setData] = useState<IVenderModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IVenderModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    loading: false,
    departmentData: [] as IVenderModel[],
    selVenderId: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getVenderDataByVenderID(mainSearch)
    }, 100)
  }, [])

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'vendorTypeID') {
      formik.setFieldValue('vendorTypeID', parseInt(value))
      setState({...state, selVenderId: parseInt(value)})
    }
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  function getVenderDataByVenderID(mainSearch: string) {
    getVendorByVendorID(parseInt(vendorID))
      .then((response) => {
        const resData = response.data
        // formik.setFieldValue('bankAccountTypeID', resData.bankAccountTypeID)
        formik.setFieldValue('vendorTypeID', resData.vendorTypeID)
        formik.setFieldValue('companyName', resData.companyName)
        formik.setFieldValue('contactNumber', resData.contactNumber)
        formik.setFieldValue('contactPerson', resData.contactPerson)
        formik.setFieldValue('email', resData.email)
        formik.setFieldValue('address', resData.address)
        formik.setFieldValue('gstNumber', resData.gstNumber)
        formik.setFieldValue('pancardNumber', resData.pancardNumber)
        formik.setFieldValue('aboutVendor', resData.aboutVendor)

        setIsActive(resData.isActive)
        setState({...state, selVenderId: resData.vendorTypeID, mainSearch})
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }
  const formik = useFormik<IVenderModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updateVendorDetails(
          parseInt(vendorID),
          values.vendorTypeID,
          values.companyName,
          values.email,
          values.contactPerson,
          values.gstNumber,
          values.pancardNumber,
          values.aboutVendor,
          values.contactNumber,
          values.address,
          isActive,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({pathname: '/vender/list', state: {search: state.mainSearch}})
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
      {state.loading ? (
        <Loader loading={state.loading} />
      ) : (
        <div className='card mb-5 mb-xl-10'>
          <div id='kt_account_profile_details' className='collapse show'>
            <form onSubmit={formik.handleSubmit} noValidate className='form'>
              <div className='card-body border-top p-9 ms-6'>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'>Account Type:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='vendorTypeID'
                    >
                      <option selected value={0}>
                        Select Account Type
                      </option>
                      {venderTypeData.length > 0 &&
                        venderTypeData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.vendorTypeID}
                              selected={state.selVenderId == data.vendorTypeID ? true : false}
                            >
                              {data.vendorTypeName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.vendorTypeID && formik.errors.vendorTypeID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.vendorTypeID}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    state.selVenderId === 1 || state.selVenderId === 2 ? 'row mb-6' : 'd-none'
                  }
                >
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'>Company Name:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Company Name'
                      {...formik.getFieldProps('companyName')}
                    />
                    {formik.touched.companyName && formik.errors.companyName && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.companyName}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'>Contact Person:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Contact Person'
                      {...formik.getFieldProps('contactPerson')}
                    />
                    {formik.touched.contactPerson && formik.errors.contactPerson && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.contactPerson}</div>
                      </div>
                    )}
                  </div>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Email:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Email'
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.email}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'>Contact Number:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Contact Number'
                      {...formik.getFieldProps('contactNumber')}
                    />
                    {formik.touched.contactNumber && formik.errors.contactNumber && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.contactNumber}</div>
                      </div>
                    )}
                  </div>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>GST Number:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter GST Number'
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Pan Card Number:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Pan Number'
                      {...formik.getFieldProps('pancardNumber')}
                    />
                    {formik.touched.pancardNumber && formik.errors.pancardNumber && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.pancardNumber}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Address:</span>
                  </label>
                  <div className='col-lg-10 fv-row'>
                    <textarea
                      rows={2}
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Address'
                      {...formik.getFieldProps('address')}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.address}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>About Vendor:</span>
                  </label>
                  <div className='col-lg-10 fv-row'>
                    <textarea
                      rows={2}
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='About Vendor'
                      {...formik.getFieldProps('aboutVendor')}
                    />
                    {formik.touched.aboutVendor && formik.errors.aboutVendor && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.aboutVendor}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>isActive:</span>
                  </label>
                  <div className='col-lg-8 fv-row'>
                    <div className='form-check form-switch'>
                      <input
                        checked={isActive}
                        className='form-check-input mt-3'
                        type='checkbox'
                        onChange={(e) => checkedFunction(e)}
                      />
                    </div>
                  </div>
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
                </button>{' '}
                <button
                  onClick={() =>
                    history.push({
                      pathname: '/vender/list',
                      state: {search: state.mainSearch},
                    })
                  }
                  className='btn btn-danger ms-3'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
export default EditVender
