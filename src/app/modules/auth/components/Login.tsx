/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useHistory} from 'react-router-dom'
import {useFormik} from 'formik'
import * as auth from '../redux/AuthRedux'
import {login, loginnew} from '../redux/AuthCRUD'
import {toast} from 'react-toastify'
import {EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons'
import CryptoJS, {enc} from 'crypto-js'
import {encryptusingaes256} from '../../../pages/common-pages/EncDecr'
const loginSchema = Yup.object().shape({
  username: Yup.string()
    // .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('UserName is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  username: '',
  password: '',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setTimeout(() => {
        //  var encypass=values.password;
        var objEmp3 = btoa(JSON.stringify(values))
        // encryptusingaes256(objEmp3)

        // const encryptedData = CryptoJS.AES.encrypt(objEmp3, "J@yH@num@n880088R@M").toString();
        // console.log(newObj)

        loginnew(`${objEmp3}`)
          .then(({data}) => {
            // console.log(data)
            // if (data.roleID == 0) {
            //   toast.error('You have not right to login, Please contact to concerned person')
            //   setLoading(false)
            //   setSubmitting(false)
            //   setStatus('The login detail is incorrect1')
            //   return
            // }
            var data2 = JSON.parse(atob(data.loginResp))
            // alert(data2.IsSuccess);
            if (data2.isSuccess == true) {
              // toast.error(`Testing mode RoleID:->${data.roleID}`)
              dispatch(auth.actions.login(data2))
              setLoading(false)
              setSubmitting(true)
            } else {
              toast.error('The login detail is incorrect')
              setLoading(false)
              setSubmitting(false)
              setStatus('The login detail is incorrect')
            }
          })
          .catch((e) => {
            toast.error(`Error Occured...${e}`)
            setLoading(false)
            setSubmitting(false)
            setStatus('The login detail is incorrect2')
          })
      }, 1000)
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading 
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Sign In to Montdor Interior</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          New Here?{' '}
          <Link to='/auth/registration' className='link-primary fw-bolder'>
            Create an Account
          </Link>
        </div>
      </div>
       */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>UserName</label>
        <input
          placeholder='UserName'
          {...formik.getFieldProps('username')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.username && formik.errors.username},
            {
              'is-valid': formik.touched.username && !formik.errors.username,
            }
          )}
          type='text'
          name='username'
          autoComplete='off'
        />
        {formik.touched.username && formik.errors.username && (
          <div className='fv-plugins-message-container text-danger'>
            <span role='alert'>{formik.errors.username}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            {/* begin::Label */}
            <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
            {/* end::Label */}
            {/* begin::Link */}
            <Link
              to='/auth/forgot-password'
              className='link-primary fs-6 fw-bolder'
              style={{marginLeft: '5px'}}
            >
              Forgot Password ?
            </Link>
            {/* end::Link */}
          </div>
        </div>
        <div className='position-relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            // type='password'
            autoComplete='off'
            placeholder='Password'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.password && formik.errors.password,
              },
              {
                'is-valid': formik.touched.password && !formik.errors.password,
              }
            )}
          />

          <span
            className='position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer'
            onClick={() => setShowPassword(!showPassword)}
            style={{color: '#6c757d'}}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container text-danger'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Action */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>

        {/* begin::Separator */}
        {/* <div className='text-center text-muted text-uppercase fw-bolder mb-5'>or</div> */}
        {/* end::Separator */}

        {/* begin::Google link */}
        {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
            className='h-20px me-3'
          />
          Continue with Google
        </a> */}
        {/* end::Google link */}

        {/* begin::Google link */}
        {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/facebook-4.svg')}
            className='h-20px me-3'
          />
          Continue with Facebook
        </a> */}
        {/* end::Google link */}
      </div>
      {/* end::Action */}
    </form>
  )
}
