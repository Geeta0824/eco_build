import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  INationalityWebModel,
  nationalityInitValue as initialValues,
} from '../../../models/master-page/INationalityModel'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {
  getNationalByNationalId,
  updateNationality,
} from '../../../modules/master-page/nationality-master-page/NationalityCRUD'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  nationalityName: Yup.string().required('Nationality Name is required'),
})

interface INatio {
  loading: boolean
  mainSearch: string
}

const EditNationality: React.FC = () => {
  const {nationaId} = useParams<{nationaId: string}>()
  const [isActive, setIsActive] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<INationalityWebModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<INationalityWebModel>): void => {
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
      console.log(lc)
      var mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getNationalDataByNationalId(mainSearch)
    }, 100)
  }, [])

  function getNationalDataByNationalId(mainSearch: string) {
    getNationalByNationalId(nationaId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('nationalityName', response.data.nationalityName)
          setIsActive(response.data.isActive)
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
  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  const [loading, setLoading] = useState(false)
  const formik = useFormik<INationalityWebModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          updateNationality(
            parseInt(nationaId),
            values.nationalityName,
            isActive,
            user.employeeID,
            '192.66.33'
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/master/nationality/list',
                  state: {search: state.mainSearch},
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
      {' '}
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/nationality/list', state: {search: state.mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <Loader loading={state.loading} />
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
          <h3 className='fw-bolder m-0 ms-6'>Update Nationality </h3>
        </div>
      </div> */}
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Nationality Name:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='nationality name'
                    {...formik.getFieldProps('nationalityName')}
                  />
                  {formik.touched.nationalityName && formik.errors.nationalityName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.nationalityName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      checked={isActive}
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
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/master/nationality/list', state: {search: state.mainSearch}}}
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

export {EditNationality}
