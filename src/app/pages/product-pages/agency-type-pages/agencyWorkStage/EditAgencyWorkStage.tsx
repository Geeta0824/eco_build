import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { UserModel } from '../../../../modules/auth/models/UserModel'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../../../setup'
import { Link, useHistory, useLocation } from 'react-router-dom'

import Loader from '../../../common-pages/Loader'
import {
  GetAgencyWorkStageByAgencyWorkStageIDApi,
  UpdateAgencyWorkStageApi,
} from '../../../../modules/product-master-page/agency-type-master-page/AgenctWorkStageCRUD'
import {
  IAgencyWorkStageModel,
  agencyWorkStageInitValue as initialValues,
} from '../../../../models/product-page/IAgencyWorkStageModel'

const profileDetailsSchema = Yup.object().shape({
  stageName: Yup.string().required('field is required'),
})

interface IUpgrade {
  loading: boolean
  agencyWorkStageData: IAgencyWorkStageModel[]
  selAgencyWorkStageID: number
  selAgencyTypeID: number
  mainSearch: string
  agencyTypeName: string
}

const EditAgencyWorkStage: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IAgencyWorkStageModel>(initialValues)
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState<boolean>(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IAgencyWorkStageModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IUpgrade>({
    loading: false,
    agencyWorkStageData: [] as IAgencyWorkStageModel[],
    selAgencyWorkStageID: 0,
    selAgencyTypeID: 0,
    mainSearch: '',
    agencyTypeName: '',
  })

  useEffect(() => {
    setState({ ...state, loading: true })
    setTimeout(() => {
      let lc: any = location.state
      if (!lc) {
        setState({ ...state, loading: false }) // Handle case where location.state is undefined
        return
      }
      console.log(lc)
      let AgencyWorkStageID = lc.agencyWorkStageID
      let AgencyTypeID = lc.agencyTypeID
      let agencyTypeName = lc.agencyTypeName
      var mainSearch = lc.mainSerach
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      GetAgencyWorkStageByAgencyWorkStageId(
        AgencyWorkStageID,
        AgencyTypeID,
        agencyTypeName,
        mainSearch
      )

    }, 100)
  }, [])
  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  function GetAgencyWorkStageByAgencyWorkStageId(
    agencyWorkStageID: number,
    agencyTypeID: number,
    agencyTypeName: string,
    mainSearch: string
  ) {
    GetAgencyWorkStageByAgencyWorkStageIDApi(agencyWorkStageID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('stageName', response.data.stageName)
          formik.setFieldValue('workDetails', response.data.workDetails)
          formik.setFieldValue('percentage', response.data.percentage)
          formik.setFieldValue('seqNo', response.data.seqNo)
          setIsActive(response.data.isActive)
          setState({
            ...state,
            selAgencyTypeID: agencyTypeID,
            selAgencyWorkStageID: agencyWorkStageID,
            agencyTypeName: agencyTypeName,
            mainSearch: mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({ ...state, agencyWorkStageData: [], loading: false })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({ ...state, agencyWorkStageData: [], loading: false })
      })
  }

  const formik = useFormik<IAgencyWorkStageModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        UpdateAgencyWorkStageApi(
          state.selAgencyWorkStageID,
          state.selAgencyTypeID,
          values.stageName,
          values.workDetails,
          values.percentage,
          values.seqNo,
          isActive,
          user.employeeID,
          '192.66.22'
        )
          .then((response: { data: { isSuccess: boolean; message: any } }) => {
            if (response.data.isSuccess) {
              toast.success('Updated Successfully')
              history.push({
                pathname: `/p-product/agency-type/${state.selAgencyTypeID}/list`,
                state: {
                  agencyTypeID: state.selAgencyTypeID,
                  agencyWorkStageID: state.selAgencyWorkStageID,
                  //   search: state.mainSearch,
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
        setLoading(false)
      }, 1000)
    },
  })
  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/p-product/agency-type/list',
              state: { search: state.mainSearch },
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
      <Loader loading={state.loading} />
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
                    className='form-control form-control-lg form-control-solid bg-light-primary'
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
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
                  <span className='indicator-progress' style={{ display: 'block' }}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link
                className=' btn btn-danger ms-3'
                to={{
                  pathname: `/p-product/agency-type/${state.selAgencyTypeID}/list`,
                  state: {
                    agencyTypeID: state.selAgencyTypeID,
                    agencyWorkStageID: state.selAgencyWorkStageID,
                    // search: state.mainSearch,
                  },
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

export { EditAgencyWorkStage }
