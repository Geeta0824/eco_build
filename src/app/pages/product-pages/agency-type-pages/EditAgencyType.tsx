import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IAgencyTypeModel,
  agencyTypeInitValue as initialValues,
} from '../../../models/product-page/IAgencyTypeModel'
import {
  getAgencyTypeByAgencyTypeId,
  updateAgencyType,
} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  agencyTypeName: Yup.string().required('field is required'),
  adminCommissionPercentage: Yup.string().required('field is required'),
})
interface IAgency {
  loading: boolean
  mainSearch:string
}

const EditAgencyType: React.FC = () => {
  const location=useLocation()
  const {agencyTypeID} = useParams<{agencyTypeID: string}>()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
    const [isKazulencia, setKazulencia] = useState(false)
  const [data, setData] = useState<IAgencyTypeModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IAgencyTypeModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IAgency>({
    loading: false,
    mainSearch:''
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getAgencyTypeDataByAgencyTypeId(mainSearch)
    }, 100)
  }, [])

  function getAgencyTypeDataByAgencyTypeId(mainSearch:string) {
    getAgencyTypeByAgencyTypeId(parseInt(agencyTypeID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('agencyTypeName', response.data.agencyTypeName)
          formik.setFieldValue('adminCommissionPercentage', response.data.adminCommissionPercentage)
          setIsActive(response.data.isActive)
          setKazulencia(response.data.isKazulencia)
          setState({...state,mainSearch, loading: false})
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
  function checkedFunctionKazulencia(event: any) {
    setKazulencia(event.target.checked)
  }
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IAgencyTypeModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updateAgencyType(
          parseInt(agencyTypeID),
          values.agencyTypeName,
          values.adminCommissionPercentage,
          isActive,
          isKazulencia,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({pathname:'/p-product/agency-type/list',state:{search:state.mainSearch}})
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Agency Type Name:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Agency Type Name'
                    {...formik.getFieldProps('agencyTypeName')}
                  />
                  {formik.touched.agencyTypeName && formik.errors.agencyTypeName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.agencyTypeName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Admin Percentage %:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Admin Percentage'
                    {...formik.getFieldProps('adminCommissionPercentage')}
                  />
                  {formik.touched.adminCommissionPercentage && formik.errors.adminCommissionPercentage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.adminCommissionPercentage}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>IsActive:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      checked={isActive}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>IsKazulencia:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      checked={isKazulencia}
                      onChange={(e) => checkedFunctionKazulencia(e)}
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
              <Link className=' btn btn-danger ms-3'to={{pathname:'/p-product/agency-type/list',state:{search:state.mainSearch}}}>Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {EditAgencyType}
