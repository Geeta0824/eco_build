import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {
  IAgencyWorkStageModel,
  agencyWorkStageInitValue as initialValues,
} from '../../../../models/product-page/IAgencyWorkStageModel'
import {AddAgencyWorkStageApi} from '../../../../modules/product-master-page/agency-type-master-page/AgenctWorkStageCRUD'

const profileDetailsSchema = Yup.object().shape({
  stageName: Yup.string().required('field is required'),
  workDetails: Yup.string().required('field is required'),

  // Percentage: Yup.string().required('field is required'),
})
type Props = {}

interface IAgency {
  loading: boolean
  selAgencyTypeID: number
  agencyTypeName: string
}

const AddAgencyWorkStage: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [isMandatory, setIsMandatory] = useState(false)
  //   const {agencyTypeId} = useParams<{agencyTypeId: string}>()
  const [data, setData] = useState<IAgencyWorkStageModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IAgencyWorkStageModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [state, setState] = useState<IAgency>({
    loading: true,
    selAgencyTypeID: 0,
    agencyTypeName:''
  })
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      var AgencyTypeID = lc.agencyTypeID
      let agencyTypeName = lc.agencyTypeName
      var mainSearch = lc.mainSearch
      console.log(lc)
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      tmpProductCatSerachFun(AgencyTypeID,mainSearch,agencyTypeName)
    }, 100)
  }, [])
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  function tmpProductCatSerachFun(agencyTypeId: number,mainSearch:string,agencyTypeName:string) {
    setLoading(false)
    setSearchText(mainSearch)
    setState({...state, selAgencyTypeID: agencyTypeId,agencyTypeName:agencyTypeName})
  }
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IAgencyWorkStageModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        AddAgencyWorkStageApi(
          state.selAgencyTypeID,
          values.stageName,
          values.workDetails,
          values.percentage,
          values.seqNo,
          isActive,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: `/p-product/agency-type/${state.selAgencyTypeID}/list`,
                state: {agencyTypeID: state.selAgencyTypeID},
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <><div className='text-end'>
    <span
      className='btn btn-sm btn-light-primary bg-success text-white fs-5 btn btn-rounded'
      onClick={() =>
        history.push({
          pathname: '/p-product/agency-type/list',
          state: { search: searchText },
        })
      }
    >
      Back To Main List
    </span>
  </div>
    <div className='d-flex flex-column mb-2'>
      <div className='d-flex align-items-center'>
        <label className='text-dark text-hover-primary cursor-pointer fs-2 fw-bolder'>
          Agency Type Name :
        </label>
        <span className='text-primary text-hover-dark cursor-pointer fs-3 fw-bolder ms-3'>
          {state.agencyTypeName}
        </span>
      </div>
    </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Stage Name:</label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='stage Name'
                    {...formik.getFieldProps('stageName')}
                  />
                  {formik.touched.stageName && formik.errors.stageName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.stageName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Work Details:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control requiredform-control-lg form-control-solid bg-light-primary'
                    placeholder='Work Details'
                    {...formik.getFieldProps('workDetails')}
                  />
                  {formik.touched.workDetails && formik.errors.workDetails && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.workDetails}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label  fw-bold fs-6'>
                  Percentage %:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Percentage'
                    {...formik.getFieldProps('percentage')}
                  />
                  {formik.touched.percentage && formik.errors.percentage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.percentage}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label  fw-bold fs-6'>
                Sequence No.:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' Sequence No.'
                    {...formik.getFieldProps('seqNo')}
                  />
                  {formik.touched.seqNo && formik.errors.seqNo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.seqNo}</div>
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
                className=' btn btn-danger ms-3'
                to={{
                  pathname: `/p-product/agency-type/${state.selAgencyTypeID}/list`,
                  state: {agencyTypeID: state.selAgencyTypeID},
                }}
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

export {AddAgencyWorkStage}
