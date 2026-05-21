import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Field, useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {
  INewReadymadePkgModel,
  newReadymadePkgInitValues as initialValues,
} from '../../models/new-readymade-pkg/INewReadymadePkgModel'
import { addReadymadePackageType } from '../../modules/new-readymade-pkg-mst-page/NewReadymadePackageCRUD'

const profileDetailsSchema = Yup.object().shape({
  readymadeTypeName: Yup.string().required('Readymade Package Type  is required'),

})

interface IQuoMst {
  loading: boolean
  mainSearch: string
}

const AddProjectTypeMst: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<INewReadymadePkgModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<INewReadymadePkgModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IQuoMst>({
    loading: false,
    mainSearch: '',
  })

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const formik = useFormik<INewReadymadePkgModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const createdValues = {
          ...values,
          createBy: user.employeeID,
          ipAddress: '192.168.0.1',
          isActive: isActive,
        } // assuming bhkId is defined somewhere
        console.log(createdValues)
        var objBranch = btoa(JSON.stringify(createdValues))
        addReadymadePackageType(`${objBranch}`)
          .then((response) => {
            var decodeResp = JSON.parse(atob(response.data.encodedResponse))
            let resp = decodeResp
            if (resp.isSuccess === true) {
              toast.success('Created Successfull!')
              history.push({pathname: '/readymade-pkg/new-readymade-pkg/list', state: {search: state.mainSearch}})
            } else {
              toast.error(`${resp.message}`)
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
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/readymade-pkg/new-readymade-pkg/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              {' '}
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Readymade Package Type :
                </label>
                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Readymade Package Type'
                    {...formik.getFieldProps('readymadeTypeName')}
                  />
                  {formik.touched.readymadeTypeName && formik.errors.readymadeTypeName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.readymadeTypeName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Per Sqft:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Per Sqf'
                    {...formik.getFieldProps('perSqft')}
                  />
                  {formik.touched.perSqft && formik.errors.perSqft && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.perSqft}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>IsActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
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
              </button>{' '}
              <button
                onClick={() =>
                  history.push({
                    pathname: '/readymade-pkg/new-readymade-pkg/list',
                    state: {search: state.mainSearch},
                  })
                }
                className='btn btn-danger ms-3'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default AddProjectTypeMst
