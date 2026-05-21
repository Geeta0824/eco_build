import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useParams} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  ICustomerBankModel,
  customerBankIniValue as initialValues,
} from '../../../../models/organization-page/customer/ICustomerBankModel'
import {
  getCustomerBankDetByCustomerID,
  updateCustomerBank,
} from '../../../../modules/organization-page/customer-master-page/bank-details/CustomerBankCRUD'
import Loader from '../../../common-pages/Loader'
import { bankAccountTypeData } from '../../../other-dropDowns/otherDropDowns'

const profileDetailsSchema = Yup.object().shape({
  accountNumber: Yup.string().required('Account Number is required'),
  bankName: Yup.string().required('Bank Name is required'),
  branchName: Yup.string().required('Branch Name is required'),
  bankAccountTypeID: Yup.number()
    .required('Account Type is required')
    .min(1, 'Account Type Is Required'),
    micrCode: Yup.string().required('MICR Code is required'),
  ifscCode: Yup.string().required('IFSC Type is required'),
})

interface ICustomerBankDetails {
  loading: boolean
  selBankID: number
  selCustomerID: number
  selAccTypeID: number
}

const EditCustomerBank: React.FC = () => {
  const history = useHistory()
  const {bankID} = useParams<{bankID: string}>()
  const {customerID} = useParams<{customerID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<ICustomerBankModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICustomerBankModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ICustomerBankDetails>({
    loading: false,
    selBankID: 0,
    selCustomerID: 0,
    selAccTypeID: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      // let customerID = localStorage.getItem('editCustomerID')!
      // let finalCustomerID: number = JSON.parse(customerID)
      getCustomerBankDataByBankCustomerId(parseInt(customerID))
    }, 100)
  }, [])

  function getCustomerBankDataByBankCustomerId(finalCustomerID: number) {
    getCustomerBankDetByCustomerID(parseInt(bankID))
      .then((response) => {
        formik.setFieldValue('customerID', response.data.customerID)
        formik.setFieldValue('bankName', response.data.bankName)
        formik.setFieldValue('branchName', response.data.branchName)
        formik.setFieldValue('ifscCode', response.data.ifscCode)
        formik.setFieldValue('accountNumber', response.data.accountNumber)
        formik.setFieldValue('micrCode', response.data.micrCode)
        formik.setFieldValue('bankAccountTypeID', response.data.bankAccountTypeID)
        setIsActive(response.data.isActive)
        setState({
          ...state,
          loading: false,
          selBankID: parseInt(bankID),
          selCustomerID: finalCustomerID,
          selAccTypeID: response.data.bankAccountTypeID,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'bankAccountTypeID') {
      formik.setFieldValue('bankAccountTypeID', parseInt(value))
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICustomerBankModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are You Sure To Update')
        if (Edit) {
          updateCustomerBank(
            parseInt(bankID),
            state.selCustomerID,
            values.bankName,
            values.branchName,
            values.ifscCode,
            values.accountNumber,
            values.micrCode,
            values.bankAccountTypeID,
            isActive,
            user.employeeID,
            '192.66.33'
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Updated Successfull!')
                history.push(`/organization/customer/edit/${state.selCustomerID}/bank/list`)
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
          <h3 className='fw-bolder m-0'>Update Customer Bank Details </h3>
        </div>
      </div> */}
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Account Number:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
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
                    className='form-control form-control-lg form-control-solid'
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
                  <span className='required'>MICR Code:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='MICR Code'
                    {...formik.getFieldProps('micrCode')}
                  />
                  {formik.touched.micrCode && formik.errors.micrCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.micrCode}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Account Type ID:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='bankAccountTypeID'
                  >
                    <option value={0} selected={state.selAccTypeID === 0 ? true : false}>
                      Select Account Type
                    </option>
                    {bankAccountTypeData.length > 0 &&
                      bankAccountTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.bankAccountTypeID}
                            selected={state.selAccTypeID === data.bankAccountTypeID ? true : false}
                          >
                            {data.bankAccountTypeName}
                          </option>
                        )
                      })}
                    {/* <option value={1} selected={state.selAccTypeID === 1 ? true : false}>Saving</option>
                    <option value={2} selected={state.selAccTypeID === 2 ? true : false}>Current</option> */}
                  </select>
                  {formik.touched.bankAccountTypeID && formik.errors.bankAccountTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bankAccountTypeID}</div>
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
                    className='form-control form-control-lg form-control-solid'
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
                    className='form-control form-control-lg form-control-solid'
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
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='Checked'
                      checked={isActive}
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
                to={`/organization/customer/edit/${state.selCustomerID}/bank/list`}
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

export {EditCustomerBank}
