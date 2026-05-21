import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IPlanAreaModel,
  planAreaInitValue as initialValues,
} from '../../../models/product-page/IPlanAreaModel'
import {createPlanArea} from '../../../modules/product-master-page/plan-area-master-page/PlanAreaCRUD'
import {List} from 'antd'

const profileDetailsSchema = Yup.object().shape({
  areaName: Yup.string().required('field is required'),
  areaPrice: Yup.string().required('field is required'),
})

const AddPlanArea: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [isMandatory, setIsMandatory] = useState(false)
  const [data, setData] = useState<IPlanAreaModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IPlanAreaModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      tmpPlanAreaSerachFun(mainSearch)
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  function checkedMandatoryFunction(event: any) {
    setIsMandatory(event.target.checked)
  }
  
  function tmpPlanAreaSerachFun(mainSearch: string) {
    setLoading(false)
    setSearchText(mainSearch)
  }
  
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IPlanAreaModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createPlanArea(
          values.areaName,
          values.areaPrice,
          isActive,
          isMandatory,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')

              history.push({
                pathname: '/p-product/plan-area/list',
                state: {search: searchText},
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
    <>
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Plan Area:</label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='PlanArea'
                    {...formik.getFieldProps('areaName')}
                  />
                  {formik.touched.areaName && formik.errors.areaName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.areaName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Area Price:</label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Area Price'
                    {...formik.getFieldProps('areaPrice')}
                  />
                  {formik.touched.areaPrice && formik.errors.areaPrice && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.areaPrice}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>

                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isMandatory:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      checked={isMandatory}
                      onChange={(e) => checkedMandatoryFunction(e)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-success' disabled={loading}>
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
                    pathname: '/p-product/plan-area/list',
                    state: {search: searchText},
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

export {AddPlanArea}
