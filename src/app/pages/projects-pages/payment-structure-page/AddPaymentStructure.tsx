import React, {useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {
  IPaymentStructureModel,
  PaymentStructureModelInitValues as initialValues,
} from '../../../models/projects-page/IPaymentStructureModel'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'

import { AddProjectPaymentStructureByProjectID } from '../../../modules/project-master-page/payment-structure-master-page/PaymentStructureCRUD'


const profileDetailsSchema = Yup.object().shape({
  sequenceNo: Yup.number().required('Sequence No. is required').min(1, 'Sequence No. is required'),
  amtPercentage: Yup.number()
    .required('Payment Percentage is required')
    .min(1, 'Payment Percentage is required'),
  stageName: Yup.string().required('Stage Name is required'),
})

const AddPaymentStructure: React.FC = () => {
  const [data, setData] = useState<IPaymentStructureModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const {projectID}=useParams<{projectID:string}>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IPaymentStructureModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const formik = useFormik<IPaymentStructureModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        AddProjectPaymentStructureByProjectID(
          parseInt(projectID),
          values.sequenceNo,
          values.stageName,
          values.amtPercentage,
          user.employeeID,
          // '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push(`/projects/project/edit/${projectID}/paymentstructure/list`)
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
                  placeholder='amount percentage'
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
