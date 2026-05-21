import React, {useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {
  IChangePasswordModel,
  changePasswordInitValue as initialValues,
} from '../../models/change-password-page/IChangePasswordModel'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import { employeeChangePassword } from '../../modules/change-password/ChangePasswordCRUD'

const profileDetailsSchema = Yup.object().shape({
  currentPassWord: Yup.string().required('Current Password Is Required'),
  newPassWord: Yup.string().required('New Password Is Required'),
  conformNewPassWord: Yup.string().required('Conform Password Is Required'),
})

const ChangePassword: React.FC = () => {
  const history = useHistory()
  const [data, setData] = useState<IChangePasswordModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IChangePasswordModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IChangePasswordModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.newPassWord === values.conformNewPassWord) {
          // toast.success('Password Changed Successfully')
          // history.push('/dashboard')
          // setLoading(false)
          employeeChangePassword(
            user.employeeID,
            values.currentPassWord,
            values.newPassWord,
          )
            .then((resp) => {
              if (resp.data.isSuccess == true) {
                toast.success('Password Changed Successfully')
                history.push('/dashboard')
                setLoading(false)
              } else {
                toast.error(`${resp.data.message}`)
                setLoading(false)
              }
            })
            .catch((error) => {
              toast.error(`${error}`)
              setLoading(false)
            })
        } else {
          toast.error('New password conform password must be same')
          setLoading(false)
        }
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0 ms-10'>Change Password</h3>
        </div>
      </div>
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9 ms-10'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Current Password:
              </label>

              <div className='col-lg-5 fv-row'>
                <input
                  type='password'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Current Password'
                  {...formik.getFieldProps('currentPassWord')}
                />
                {formik.touched.currentPassWord && formik.errors.currentPassWord && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.currentPassWord}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>New Password:</label>

              <div className='col-lg-5 fv-row'>
                <input
                  type='password'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='New Password'
                  {...formik.getFieldProps('newPassWord')}
                />
                {formik.touched.newPassWord && formik.errors.newPassWord && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.newPassWord}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Confirm Password:
              </label>

              <div className='col-lg-5 fv-row'>
                <input
                  type='password'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Confirm New Password'
                  {...formik.getFieldProps('conformNewPassWord')}
                />
                {formik.touched.conformNewPassWord && formik.errors.conformNewPassWord && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.conformNewPassWord}</div>
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

export {ChangePassword}
