import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {AddProjectPaymentStructureByProjectID} from '../../../../../modules/project-master-page/payment-structure-master-page/PaymentStructureCRUD'
import {UserModel} from '../../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../../setup'
import {
  IAdditionalItemServiceModel,
  additionalItemServiceModelInitValues as initialValues,
} from '../../../../../models/projects-page/IAdditionalItemServiceModel'
import {shallowEqual, useSelector} from 'react-redux'
import {AddAdditionalItemDetailsAPI} from '../../../../../modules/project-master-page/project-master/AdditionalItemServiceCRUD'

const profileDetailsSchema = Yup.object().shape({
  additionalItemDescription: Yup.string().required('Additional ItemDescription is required'),
  additionalAmount: Yup.number()
    .required('Additional Amount is required')
    .min(1, 'Additional Amount is required'),
})
interface IProjectVendor {
  loading: boolean
  projectID: number
  projName: string
  customerName: string
}

const AddAdditionalItemService: React.FC = () => {
  const [data, setData] = useState<IAdditionalItemServiceModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const {projectID} = useParams<{projectID: string}>()

  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IAdditionalItemServiceModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    projectID: 0,
    projName: '',
    customerName: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projectID: any = lc.projectID
      let projName: any = lc.projName
      let customerName: any = lc.customerName
      setState({
        ...state,
        projectID: projectID,
        projName: projName,
        customerName: customerName,
        loading: false,
      })
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const formik = useFormik<IAdditionalItemServiceModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        AddAdditionalItemDetailsAPI(
          state.projectID,
          values.additionalItemDescription,
          values.additionalAmount,
          values.createDate,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: `/projects/project/add-ded/additional/list`,
                state: {
                  projectID: state.projectID,
                  projName: state.projName,
                  customerName: state.customerName,
                },
              })
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
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className='required'>Additional Item:</span>
              </label>
              <div className='col-lg-10 fv-row'>
                <textarea
                  rows={2}
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Description...'
                  {...formik.getFieldProps('additionalItemDescription')}
                />
                {formik.touched.additionalItemDescription &&
                  formik.errors.additionalItemDescription && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.additionalItemDescription}</div>
                    </div>
                  )}
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Amount:</label>
              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='amount'
                  {...formik.getFieldProps('additionalAmount')}
                />
                {formik.touched.additionalAmount && formik.errors.additionalAmount && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.additionalAmount}</div>
                  </div>
                )}
              </div>
            </div>{' '}
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>Date:</label>
              <div className='col-lg-3 fv-row ps-4'>
                <input
                  type='date'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  {...formik.getFieldProps('createDate')}
                />
                {formik.touched.createDate && formik.errors.createDate && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.createDate}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary me-2' disabled={loading}>
              {!loading && 'Save'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            <span
              className='btn btn-danger'
              onClick={() =>
                history.push({
                  pathname: '/projects/project/add-ded/additional/list',
                  state: {projectID: state.projectID},
                })
              }
            >
              Cancel
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddAdditionalItemService
