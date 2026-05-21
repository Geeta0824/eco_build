import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IUnitModel, unitInitValue as initialValues} from '../../../models/master-page/IUnitModel'
import {createUnit} from '../../../modules/master-page/unit-master-page/UnitCRUD'

const profileDetailsSchema = Yup.object().shape({
  unitName: Yup.string().required('Name field is required'),
})

const AddUnit: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const [isActive, setIsActive] = useState(false)
  const [mainSearch, setMainSearch] = useState('')
  const [data, setData] = useState<IUnitModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IUnitModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      getUnitDataByUnitId(mainSearch)
    }, 100)
  }, [])
  
  function getUnitDataByUnitId(mainSearch:string){
    setMainSearch(mainSearch)
    setLoading(false)

  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IUnitModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createUnit(values.unitName, isActive, user.employeeID, '192.66.22')
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname:'/master/unit/list',state:{search:mainSearch}})
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
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => history.push({pathname:'/master/unit/list',state:{search:mainSearch}})}
        >
          Back To List
        </span>
      </div>
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Unit:</label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Unit'
                    {...formik.getFieldProps('unitName')}
                  />
                  {formik.touched.unitName && formik.errors.unitName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.unitName}</div>
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
                onClick={() => history.push({pathname:'/master/unit/list',state:{search:mainSearch}})}
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

export {AddUnit}
