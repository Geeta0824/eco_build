import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'
import {
  IDNCTypeModel,
  dncTypeInitValue as initialValues,
} from '../../../models/master-page/IDNCTypeModel'
import {
  UpdateDNCTypeApi,
  getDNCTypeByDNCTypeEditID,
} from '../../../modules/master-page/dnc-type-master-page/DNCTypeCRUD'

const profileDetailsSchema = Yup.object().shape({
  dncTypeName: Yup.string().required('Field is required'),
})

interface INatio {
  loading: boolean
  mainSearch: string
}

const EditDNCType = () => {
  const {dncTypeID} = useParams<{dncTypeID: string}>()
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<IDNCTypeModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IDNCTypeModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<INatio>({
    loading: false,
    mainSearch: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let mainSearch: string = ''
      if (lc.searchText !== undefined) {
        mainSearch = lc.searchText
      }
      getDNCTypeById(mainSearch)
    }, 100)
  }, [])

  function getDNCTypeById(mainSearch: string) {
    getDNCTypeByDNCTypeEditID(dncTypeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('dncTypeName', response.data.dncTypeName)
          formik.setFieldValue('amountPerSqft', response.data.amountPerSqft)
          setState({...state, loading: false, mainSearch})
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IDNCTypeModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          UpdateDNCTypeApi(parseInt(dncTypeID), values.dncTypeName, values.amountPerSqft)
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Updated Successfully')
                history.push({pathname: '/master/dnc-type/list', state: {search: state.mainSearch}})
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
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/dnc-type/list', state: {search: state.mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      {state.loading ? (
        <Loader loading={state.loading} />
      ) : (
        <div className='card mb-5 mb-xl-10'>
          <div id='kt_account_profile_details' className='collapse show'>
            <form onSubmit={formik.handleSubmit} noValidate className='form'>
              <div className='card-body border-top p-9 ms-6'>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    DNC Type Name:
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='DNC Type Name'
                      {...formik.getFieldProps('dncTypeName')}
                    />
                    {formik.touched.dncTypeName && formik.errors.dncTypeName && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.dncTypeName}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Amount Per Sqft:
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Amount Per Sqft'
                      {...formik.getFieldProps('amountPerSqft')}
                    />
                    {formik.touched.amountPerSqft && formik.errors.amountPerSqft && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.amountPerSqft}</div>
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
                <Link
                  className='btn btn-danger ms-3'
                  to={{pathname: '/master/dnc-type/list', state: {search: state.mainSearch}}}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default EditDNCType
