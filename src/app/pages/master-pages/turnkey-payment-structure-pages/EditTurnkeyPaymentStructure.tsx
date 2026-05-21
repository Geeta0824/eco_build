import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  ITurnkeyPaymentStructureModel,
  turnkeyInitValue as initialValues,
} from '../../../models/master-page/ITurnkeyPaymentStructureModel'
import {
  getTurnkeyProjPayStructureDataByTurnkeyProjPaymentStageID,
  updateTurnkeyProjPayStructure,
} from '../../../modules/master-page/turnkey-payment-structure-master-page/TurnkeyPaymentStructureCRUD'
import Loader from '../../common-pages/Loader'
import {IProjectTypeodel} from '../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'

const profileDetailsSchema = Yup.object().shape({
  // sequenceNo: Yup.number().required('Sequence No. is required').min(1, 'Sequence No. is required'),
  amtPercentage: Yup.number()
    .required('Payment Percentage is required')
    .min(1, 'Payment Percentage is required'),
  stageName: Yup.string().required('Stage Name is required'),
})

interface ITurnkey {
  loading: boolean
  turnkeyData: ITurnkeyPaymentStructureModel[]
  tmpturnkeyData: ITurnkeyPaymentStructureModel[]
  ProjectTypeData: IProjectTypeodel[]
  searchText: string
  turnkeyProjPaymentStageID: number
  selProjectTypeID: number
  mainSearch: string
}

const EditTurnkeyPaymentStructure: React.FC = () => {
  const {turnkeyid} = useParams<{turnkeyid: string}>()
  const [data, setData] = useState<ITurnkeyPaymentStructureModel>(initialValues)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<ITurnkeyPaymentStructureModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ITurnkey>({
    loading: false,
    turnkeyData: [] as ITurnkeyPaymentStructureModel[],
    tmpturnkeyData: [] as ITurnkeyPaymentStructureModel[],
    ProjectTypeData: [] as IProjectTypeodel[],
    searchText: '',
    turnkeyProjPaymentStageID: 0,
    selProjectTypeID: 0,
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
      getTurnkeyProjPayStructureDataByID(mainSearch)
    }, 100)
  }, [])

  function getTurnkeyProjPayStructureDataByID(mainSearch: string) {
    getTurnkeyProjPayStructureDataByTurnkeyProjPaymentStageID(parseInt(turnkeyid))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('sequenceNo', response.data.sequenceNo)
          formik.setFieldValue('stageName', response.data.stageName)
          formik.setFieldValue('amtPercentage', response.data.amtPercentage)
          formik.setFieldValue('noOfDays', response.data.noOfDays)
          formik.setFieldValue('projectTypeID', response.data.projectTypeID)
          getProjectTypeData(response.data.projectTypeID, mainSearch)
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

  function getProjectTypeData(projectTypeID: number, mainSearch: string) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            ProjectTypeData: responseData,
            selProjectTypeID: projectTypeID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, ProjectTypeData: [], loading: false})
      })
  }

  function handleChange(e: any) {
    let id = e.target.id
    let value = e.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(value)) && re.test(value)) {
      formik.setFieldValue(`${id}`, parseInt(value))
    } else if (value == '') {
      formik.setFieldValue(`${id}`, '')
    }
  }

  const formik = useFormik<ITurnkeyPaymentStructureModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updateTurnkeyProjPayStructure(
          parseInt(turnkeyid),
          values.projectTypeID,
          values.sequenceNo,
          values.noOfDays,
          values.stageName,
          values.amtPercentage,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/master/turnkey-pay-struc/list',
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
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
      setState({...state, selProjectTypeID: parseInt(value)})
    }
  }
  return (
    <>
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/master/turnkey-pay-struc/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To List
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
                    Project Type:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='projectTypeID'
                    >
                      <option value={0}>Select Type</option>
                      {state.ProjectTypeData.length > 0 &&
                        state.ProjectTypeData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              selected={data.projectTypeID == state.selProjectTypeID ? true : false}
                            >
                              {data.projectType}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.projectTypeID && formik.errors.projectTypeID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.projectTypeID}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Stage Name:
                  </label>

                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='stage name'
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
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>Payment:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='amount percentage'
                      {...formik.getFieldProps('amtPercentage')}
                    />
                    {formik.touched.amtPercentage && formik.errors.amtPercentage && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.amtPercentage}</div>
                      </div>
                    )}
                  </div>
                  <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'>Seq No:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Sequence No'
                      {...formik.getFieldProps('sequenceNo')}
                    />
                    {formik.touched.sequenceNo && formik.errors.sequenceNo && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.sequenceNo}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>No Of Days:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='No Of Days'
                      id='noOfDays'
                      {...formik.getFieldProps('noOfDays')}
                      onChange={handleChange}
                    />
                    {formik.touched.noOfDays && formik.errors.noOfDays && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.noOfDays}</div>
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
                <button
                  onClick={() =>
                    history.push({
                      pathname: '/master/turnkey-pay-struc/list',
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
      )}
    </>
  )
}

export default EditTurnkeyPaymentStructure
