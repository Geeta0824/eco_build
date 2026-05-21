import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {Button, Modal} from 'react-bootstrap-v5'
import {createEmpBankDetails} from '../../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import Loader from '../../../common-pages/Loader'
import { bankAccountTypeData } from '../../../other-dropDowns/otherDropDowns'
import moment from 'moment'
import { IVendorBankDetailsModel,vendorBankDetailsIniValue as initialValues } from '../../../../models/master-page/IVendorBankDetailsModel'
import { createVendorBankDetails } from '../../../../modules/master-page/vender-master-page/bank-details/VendorBankDetailsCRUD'

const profileDetailsSchema = Yup.object().shape({
  accountNumber: Yup.string().required('Account Number is required'),
  bankName: Yup.string().required('Bank Name is required'),
  accountName: Yup.string().required('Account Name is required'),
  accountTypeID: Yup.number()
    .required('Account Type is required')
    .min(1, 'Account Type is required'),
  branchName: Yup.string().required('Branch Name is required'),
  ifscCode: Yup.string().required('Leave Type is required'),
})

interface IVenBankDetails {
  loading: boolean
  selVenID: number
  mainSearch: string
}

const AddVendorBank: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const {vendorID} = useParams<{vendorID: string}>()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<IVendorBankDetailsModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IVendorBankDetailsModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IVenBankDetails>({
    loading: false,
    selVenID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      // let empID = localStorage.getItem('editEmpID')!
      // let finalempID: number = JSON.parse(empID)
      bankDetail(mainSearch)
    }, 100)
  }, [])

  function bankDetail(mainSearch: string) {
    setState({...state, loading: false, selVenID: parseInt(vendorID),mainSearch})
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'accountTypeID') {
      formik.setFieldValue('accountTypeID', parseInt(value))
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IVendorBankDetailsModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let esicStartDate: any
        let esicExpDate: any
        let pfaStartDate: any
        let pfaEndDate: any
        if (values.esicStartDate === '') {
          esicStartDate = null
        } else {
          esicStartDate = values.esicStartDate
        }
        if (values.esicExpDate === '') {
          esicExpDate = null
        } else {
          esicExpDate = values.esicExpDate
        }
        if (values.pfaStartDate === '') {
          pfaStartDate = null
        } else {
          pfaStartDate = values.pfaStartDate
        }
        if (values.pfaEndDate === '') {
          pfaEndDate = null
        } else {
          pfaEndDate = values.pfaEndDate
        }
        createVendorBankDetails(
          state.selVenID,
          values.bankName,
          values.branchName,
          values.ifscCode,
          values.accountNumber,
          values.accountName,
          values.accountTypeID,
          values.pfaCompanyName,
          values.pfaunNumber,
          values.pfaNumber,
          values.esicNumber,
          esicStartDate,
          esicExpDate,
          pfaStartDate,
          pfaEndDate,
          isActive,
          2,
          '192.66.33'
        )
          .then((response) => {
            toast.success('Created Successfull!')
            history.push({pathname:`/vender/edit/${state.selVenID}/bank/list`,state:{search:state.mainSearch}})
            setLoading(false)
          })
          .catch((error) => {
            toast.error(`${error}`)
            setLoading(false)
          })
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-5'>
        {/* <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_bank_details'
          aria-expanded={state.hideShow}
          aria-controls='kt_account_profile_bank_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Create Employee Bank Details </h3>
          </div>
        </div> */}
        <div id='kt_account_profile_bank_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Account Number:
                </label>

                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Account Number'
                    {...formik.getFieldProps('accountNumber')}
                  />
                  {formik.touched.accountNumber && formik.errors.accountNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.accountNumber}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Bank Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Bank Name'
                    {...formik.getFieldProps('bankName')}
                  />
                  {formik.touched.bankName && formik.errors.bankName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bankName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Account Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Account Name'
                    {...formik.getFieldProps('accountName')}
                  />
                  {formik.touched.accountName && formik.errors.accountName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.accountName}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Account Type:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='accountTypeID'
                  >
                    <option selected value={0}>
                      Select Account Type
                    </option>
                    {bankAccountTypeData.length > 0 &&
                      bankAccountTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.bankAccountTypeID}
                            // selected={state.selAccTypeID === data.bankAccountTypeID ? true : false}
                          >
                            {data.bankAccountTypeName}
                          </option>
                        )
                      })}
                    {/* <option value={1}> Saving </option>
                    <option value={2}> Current </option> */}
                  </select>
                  {formik.touched.accountTypeID && formik.errors.accountTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.accountTypeID}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Branch Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Branch Name'
                    {...formik.getFieldProps('branchName')}
                  />
                  {formik.touched.branchName && formik.errors.branchName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.branchName}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>IFSC Code:</label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='IFSC Code'
                    {...formik.getFieldProps('ifscCode')}
                  />
                  {formik.touched.ifscCode && formik.errors.ifscCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.ifscCode}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>PFA Company Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='PFA Company Name'
                    {...formik.getFieldProps('pfaCompanyName')}
                  />
                  {formik.touched.pfaCompanyName && formik.errors.pfaCompanyName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pfaCompanyName}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>UAN Number:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='UAN Number'
                    {...formik.getFieldProps('pfaunNumber')}
                  />
                  {formik.touched.pfaunNumber && formik.errors.pfaunNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pfaunNumber}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>PFA Number:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='PFA Number'
                    {...formik.getFieldProps('pfaNumber')}
                  />
                  {formik.touched.pfaNumber && formik.errors.pfaNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pfaNumber}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>ESIC Number:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='ESIC Number'
                    {...formik.getFieldProps('esicNumber')}
                  />
                  {formik.touched.esicNumber && formik.errors.esicNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.esicNumber}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>PFA Start Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    max={moment(new Date()).format('YYYY-MM-DD')}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='PFA Start Date'
                    {...formik.getFieldProps('pfaStartDate')}
                  />
                  {formik.touched.pfaStartDate && formik.errors.pfaStartDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pfaStartDate}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>PFA End Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    max={moment(new Date()).format('YYYY-MM-DD')}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='PFA End Date'
                    {...formik.getFieldProps('pfaEndDate')}
                  />
                  {formik.touched.pfaEndDate && formik.errors.pfaEndDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pfaEndDate}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>ESIC Start Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    max={moment(new Date()).format('YYYY-MM-DD')}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='ESIC Start Date'
                    {...formik.getFieldProps('esicStartDate')}
                  />
                  {formik.touched.esicStartDate && formik.errors.esicStartDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.esicStartDate}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>ESIC End Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    max={moment(new Date()).format('YYYY-MM-DD')}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='ESIC End Date'
                    {...formik.getFieldProps('esicExpDate')}
                  />
                  {formik.touched.esicExpDate && formik.errors.esicExpDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.esicExpDate}</div>
                    </div>
                  )}
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
                to={{pathname:`/vender/edit/${state.selVenID}/bank/list`,state:{search:state.mainSearch}}}
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

export {AddVendorBank}
