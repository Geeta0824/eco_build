import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IDepartmentModel,
  departmentInitValues as initialValues,
} from '../../../models/master-page/IDepartmentModel'
import {
  getDepartment,
  updateDepartment,
} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  departmentName: Yup.string().required('Department Name is required'),
  departmentCode: Yup.string().required('Department Code is required'),
})

interface IDep {
  loading: boolean
  mainSearch: string
}

const EditDepartment: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const {docmtId} = useParams<{docmtId: string}>()
  const [data, setData] = useState<IDepartmentModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IDepartmentModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IDep>({
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
      if (lc.searchText !== undefined) {
        mainSearch = lc.searchText
      }
      getDepartmentDataByDepartmentId(mainSearch)
    }, 100)
  }, [])

  function getDepartmentDataByDepartmentId(mainSearch: string) {
    let value = {departmentID: docmtId}
    var objDocmt = btoa(JSON.stringify(value))
    getDepartment(`${objDocmt}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        formik.setFieldValue('departmentID', resp.departmentID)
        formik.setFieldValue('departmentName', resp.departmentName)
        formik.setFieldValue('photoPath', resp.photoPath)
        formik.setFieldValue('iconPath', resp.iconPath)
        formik.setFieldValue('departmentCode', resp.departmentCode)
        setIsActive(resp.isActive)
        setState({...state, loading: false, mainSearch})
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  const formik = useFormik<IDepartmentModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are you sure you want to update selected record')
        if (edit) {
          const updatedValues = {
            ...values,
            departmentID: docmtId,
            photoPath: '',
            iconPath: '',
            isActive: isActive,
            updateBy: user.employeeID,
            ipAddress: '192.168.0.1'
          } // assuming bhkId is defined somewhere
          // console.log(updatedValues)
          var objDepartment = btoa(JSON.stringify(updatedValues))
          updateDepartment(
           `${ objDepartment}`
          )
            .then((response) => {
              var decodeResp = JSON.parse(atob(response.data.encodedResponse))
              let resp = decodeResp
              if (resp.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/master/department/list',
                  state: {search: state.mainSearch},
                })
                setLoading(false)
              } else {
                toast.error(`${resp.message}`)
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
            to={{pathname: '/master/department/list', state: {search: state.mainSearch}}}
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
          <h3 className='fw-bolder m-0 ms-6'>Update Department</h3>
        </div>
      </div> */}
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Department Name:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='department name'
                    {...formik.getFieldProps('departmentName')}
                  />
                  {formik.touched.departmentName && formik.errors.departmentName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.departmentName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Department Code:</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='department code'
                    {...formik.getFieldProps('departmentCode')}
                  />
                  {formik.touched.departmentCode && formik.errors.departmentCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.departmentCode}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
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
              </button>
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/master/department/list', state: {search: state.mainSearch}}}
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

export {EditDepartment}
