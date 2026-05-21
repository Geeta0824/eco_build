import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IDNCPaymentStructureModel,
  dncInitValue as initialValues,
} from '../../../models/master-page/IDNCPaymentStructureModel'
import {postAllDNCProjPayStructureAPI} from '../../../modules/master-page/dnc-payment-structure-master-page/DNCPaymentStructureCRUD'

const profileDetailsSchema = Yup.object().shape({
  sequenceNo: Yup.number().required('Sequence No. is required').min(1, 'Sequence No. is required'),
  amtPercentage: Yup.number()
    .required('Payment Percentage is required')
    .min(1, 'Payment Percentage is required'),
  stageName: Yup.string().required('Stage Name is required'),
})

const AddDNCPaymentStructure: React.FC = () => {
  const [data, setData] = useState<IDNCPaymentStructureModel>(initialValues)
  const [loading, setLoading] = useState(false)
  const [mainSearch, setMainSearch] = useState('')
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IDNCPaymentStructureModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getDNCProjPayStructureDataByID(mainSearch)
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function getDNCProjPayStructureDataByID(mainSearch:string) {
    setLoading(false)
    setMainSearch(mainSearch)
  }
  function handleChange(e: any) {
    let id = e.target.id
    let value = e.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(value)) && re.test(value)) {
      formik.setFieldValue(`${id}`, parseInt(value))
    } else if (value == '') {
      formik.setFieldValue(`${id}`, '')
    }
  }

  const formik = useFormik<IDNCPaymentStructureModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        postAllDNCProjPayStructureAPI(
          values.sequenceNo,
          values.noOfDays,
          values.stageName,
          values.amtPercentage,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname:'/master/dnc-pay-struc/list',state:{search:mainSearch}})
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
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname:'/master/dnc-pay-struc/list',state:{search:mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
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
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>No. Of Days:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='No Of Days'
                    id='noOfDays'
                    {...formik.getFieldProps('noOfDays')}
                    onChange={handleChange}
                  />
                  {formik.touched.noOfDays && formik.errors.noOfDays && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.noOfDays}</div>
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
              </button>{' '}
              <Link className='btn btn-danger ms-3'  to={{pathname:'/master/dnc-pay-struc/list',state:{search:mainSearch}}}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default AddDNCPaymentStructure
