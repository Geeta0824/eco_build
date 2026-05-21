import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {
  IPMCWorkStageMapModel,
  venderPaymentMapInitValues as initialValues,
} from '../../../../models/master-page/IVenderModel'
import {addVenderPaymentStructureMapDetails} from '../../../../modules/master-page/vender-master-page/payment-structure-master-page/VenderPaymentStrCRUD'

const profileDetailsSchema = Yup.object().shape({
  sequenceNo: Yup.number().required('Sequence No. is required').min(1, 'Sequence No. is required'),
  amtPercentage: Yup.number().required('Payment Percentage is required'),
  stageName: Yup.string().required('Stage Name is required'),
})

interface ICustomerEdit {
  loading: boolean
  selVendorID: number
  selCustomerName: string
  action: string
}

const AddPaymentStructure: React.FC = () => {
  const [data, setData] = useState<IPMCWorkStageMapModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const {vendorID} = useParams<{vendorID: string}>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IPMCWorkStageMapModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const location = useLocation()

  const [state, setState] = useState<ICustomerEdit>({
    loading: false,
    selVendorID: 0,
    selCustomerName: '',
    action: 'Personal',
  })

  useEffect(() => {
    setTimeout(() => {
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  const formik = useFormik<IPMCWorkStageMapModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addVenderPaymentStructureMapDetails(
          values.sequenceNo,
          values.stageName,
          parseInt(vendorID),
          values.amtPercentage,
          user.employeeID
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push(`/vender/pay-str/${vendorID}/list`)
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
          <h3 className='fw-bolder m-0 ms-6'>Create Department</h3>
        </div>
      </div> */}
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Stage Name:</label>

              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='stage name'
                  {...formik.getFieldProps('stageName')}
                />
                {formik.touched.stageName && formik.errors.stageName && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.stageName}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Payment:</label>
              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='payment percentage'
                  {...formik.getFieldProps('amtPercentage')}
                />
                {formik.touched.amtPercentage && formik.errors.amtPercentage && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.amtPercentage}</div>
                  </div>
                )}
              </div>
              <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className='required'>Seq No:</span>
              </label>
              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Sequence No'
                  {...formik.getFieldProps('sequenceNo')}
                />
                {formik.touched.sequenceNo && formik.errors.sequenceNo && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.sequenceNo}</div>
                  </div>
                )}
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
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPaymentStructure
