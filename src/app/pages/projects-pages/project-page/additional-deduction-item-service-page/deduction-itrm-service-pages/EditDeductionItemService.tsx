import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'

import {shallowEqual, useSelector} from 'react-redux'
import {
  IReductionServiceModel,
  reductionServiceModelInitValues as initialValues,
} from '../../../../../models/projects-page/IReductionServiceModel'
import {UserModel} from '../../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../../setup'
import {getAdditionalItemByAdditionalItemIdAPI} from '../../../../../modules/project-master-page/project-master/AdditionalItemServiceCRUD'
import {
  EditProjectReductionDetailsAPI,
  getProjectReductionByProjectReductionIdAPI,
} from '../../../../../modules/project-master-page/project-master/DeductionItemServiceCRUD'

const profileDetailsSchema = Yup.object().shape({
  reductionItemDescription: Yup.string().required('Reduction Description is required'),
  reductionAmount: Yup.number()
    .required('Reduction Amount is required')
    .min(1, 'Reduction Amount is required'),
})

interface IProjectVendor {
  loading: boolean
  projectID: number
  projName: string
  customerName: string
}
const EditDeductionItemService: React.FC = () => {
  const [data, setData] = useState<IReductionServiceModel>(initialValues)
  const {projectDeductionItemID} = useParams<{projectDeductionItemID: string}>()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IReductionServiceModel>): void => {
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
      let projName: any = lc.projName
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      getReductionItemDataByID(projectID, projName, customerName)
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function getReductionItemDataByID(projectID: number, projName: string, customerName: string) {
    getProjectReductionByProjectReductionIdAPI(parseInt(projectDeductionItemID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('reductionItemDescription', response.data.reductionItemDescription)
          formik.setFieldValue('reductionAmount', response.data.reductionAmount)
          formik.setFieldValue('createDate', response.data.createDate)
          setState({
            ...state,
            projectID: projectID,
            projName: projName,
            customerName: customerName,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }
  const formik = useFormik<IReductionServiceModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        EditProjectReductionDetailsAPI(
          state.projectID,
          parseInt(projectDeductionItemID),
          values.reductionItemDescription,
          values.reductionAmount,
          values.createDate,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: `/projects/project/add-ded/deduction/list`,
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
        const updatedData = Object.assign(data, values)
        setData(updatedData)
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
                <span className='required'>Reduction Item:</span>
              </label>
              <div className='col-lg-10 fv-row'>
                <textarea
                  rows={2}
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Reduction Item...'
                  {...formik.getFieldProps('reductionItemDescription')}
                />
                {formik.touched.reductionItemDescription && formik.errors.reductionItemDescription && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.reductionItemDescription}</div>
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
                  {...formik.getFieldProps('reductionAmount')}
                />
                {formik.touched.reductionAmount && formik.errors.reductionAmount && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.reductionAmount}</div>
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
                  pathname: '/projects/project/add-ded/deduction/list',
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
export default EditDeductionItemService
