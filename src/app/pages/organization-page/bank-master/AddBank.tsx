import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import Loader from '../../common-pages/Loader'
import {bankAccountTypeData, bankTypeData} from '../../other-dropDowns/otherDropDowns'
import {createOrganizationBank} from '../../../modules/organization-page/bank-master-page/BankCRUD'
import {
  IBankModel,
  bankInitValues as initialValues,
} from '../../../models/organization-page/bank/IBankModel'

const profileDetailsSchema = Yup.object().shape({
  bankAccountTypeID: Yup.number()
    .required('Bank Account Type is required')
    .min(1, 'Bank Account Type is Required'),
  bankName: Yup.string().required('Bank Name is required'),
  branchName: Yup.string().required('Branch Name is required'),
  accountNumber: Yup.string().required('Account Number is required'),
  accountHolderName: Yup.string().required('Account Holder Name is required'),
  // micrCode: Yup.string().required('Micr Code is required'),
  ifscCode: Yup.string().required('Ifsc Code is required'),
})

interface IBank {
  loading: boolean
  orgaBankData: IBankModel[]
  temOrgaBankData: IBankModel[]
  selOrgaBankId: number
  activeID: number
  activeType: any
  selAccountTypeId: number
}

const AddBank: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IBankModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const updateData = (fieldsToUpdate: Partial<IBankModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()

  const [state, setState] = useState<IBank>({
    loading: false,
    orgaBankData: [] as IBankModel[],
    temOrgaBankData: [] as IBankModel[],
    selOrgaBankId: 0,
    activeID: 0,
    activeType: false,
    selAccountTypeId: 0,
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      tmpBankSearch(mainSearch)
    }, 100)
  }, [])

  function tmpBankSearch(mainSearch: string) {
    setLoading(false)
    setSearchText(mainSearch)
  }
  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }
 


  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'bankAccountTypeID') {
      formik.setFieldValue('bankAccountTypeID', parseInt(value))
      setState({...state, selAccountTypeId: parseInt(value)})
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IBankModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createOrganizationBank(
          values.bankTypeID,
          values.bankAccountTypeID,
          values.bankName,
          values.branchName,
          values.accountNumber,
          values.accountHolderName,
          values.ifscCode,
          values.micrCode,
          isActive,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull!')
              history.push({pathname: '/organization/bank/list', state: {search: searchText}})
            } else {
              toast.error(`${response.data.message}`)
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
      <Loader loading={state.loading} />
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
                    id='bankAccountTypeID'
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
                            selected={
                              data.bankAccountTypeID == state.selAccountTypeId ? true : false
                            }
                          >
                            {data.bankAccountTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.bankAccountTypeID && formik.errors.bankAccountTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bankAccountTypeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Account Holder Name:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Account Holder Name '
                    {...formik.getFieldProps('accountHolderName')}
                  />
                  {formik.touched.accountHolderName && formik.errors.accountHolderName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.accountHolderName}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Bank Name:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Bank Name'
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Branch Name:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Branch Name '
                    {...formik.getFieldProps('branchName')}
                  />
                  {formik.touched.branchName && formik.errors.branchName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.branchName}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Account Number:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Account Number'
                    {...formik.getFieldProps('accountNumber')}
                  />
                  {formik.touched.accountNumber && formik.errors.accountNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.accountNumber}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>IFSC Code:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter IFSC Code'
                    {...formik.getFieldProps('ifscCode')}
                  />
                  {formik.touched.ifscCode && formik.errors.ifscCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.ifscCode}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'>  */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Micr Code:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Micr Code'
                    {...formik.getFieldProps('micrCode')}
                  />
                  {formik.touched.micrCode && formik.errors.micrCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.micrCode}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-4'
                      type='checkbox'
                      id='Checked'
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
                className='btn btn-danger ms-3'
                to={{pathname: '/organization/bank/list', state: {search: searchText}}}
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

export {AddBank}
