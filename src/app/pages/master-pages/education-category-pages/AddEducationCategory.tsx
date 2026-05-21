import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {postEduCategory} from '../../../modules/master-page/education-category-master-page/EducationCategoryCRUD'
import {
  IEduCategoryModel,
  eduCategoryInitValue as initialValues,
} from '../../../models/master-page/IEducationCategoryModel'
import {Link, useHistory, useLocation} from 'react-router-dom'

const profileDetailsSchema = Yup.object().shape({
  eduCategoryName: Yup.string().required('Education Category Name is required'),
})

const AddEducationCategory: React.FC = () => {
  const [mainSearch, setMainSearch] = useState('')
  const [isActive, setIsActive] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<IEduCategoryModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IEduCategoryModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      GetEduCatById(mainSearch)
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  function GetEduCatById(mainSearch: string) {
    setMainSearch(mainSearch)
    setLoading(false)
  }
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IEduCategoryModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        postEduCategory(values.eduCategoryName, isActive, user.employeeID, '192.168.0.1')
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname: '/master/eduCategory/list', state: {search: mainSearch}})
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
            to={{pathname: '/master/eduCategory/list', state: {search: mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
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
          <h3 className='fw-bolder m-0 ms-6'>Create Education Category </h3>
        </div>
      </div> */}
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Education Category Name:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='education category'
                    {...formik.getFieldProps('eduCategoryName')}
                  />
                  {formik.touched.eduCategoryName && formik.errors.eduCategoryName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.eduCategoryName}</div>
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
                to={{pathname: '/master/eduCategory/list', state: {search: mainSearch}}}
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

export {AddEducationCategory}
