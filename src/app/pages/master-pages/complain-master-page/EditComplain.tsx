import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {
  IAgencyTypeDropdownModel,
  IComplainModel,
  complainInitValue as initialValues,
} from '../../../models/master-page/IComplainModel'
import {getQuotationCateogryDropDownAPI} from '../../../modules/master-page/pdf-photo-master-page/PDFPhotoCRUD'
import {IQuotationCateogryDropDownModel} from '../../../models/master-page/IPDFPhotoMstModel'
import {getAllAgencyType} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {
  GetComplainByComplainIDAPI,
  UpdateComplainDetailsAPI,
} from '../../../modules/master-page/complain-master-page/ComplainCRUD'

const profileDetailsSchema = Yup.object().shape({
  projectTypeID: Yup.number()
    .min(1, 'Project Type Is Required')
    .required('Project Type Is Required'),
})

interface IComplain {
  loading: boolean
  projectTypeData: IQuotationCateogryDropDownModel[]
  agencyTypeData: IAgencyTypeDropdownModel[]
  selProjectTypeID: number
  selAgencyTypeID: number
  mainSearch: string
}

const EditComplain: React.FC = () => {
  const {complainID} = useParams<{complainID: string}>()
  const [data, setData] = useState<IComplainModel>(initialValues)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IComplainModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IComplain>({
    loading: false,
    projectTypeData: [] as IQuotationCateogryDropDownModel[],
    agencyTypeData: [] as IAgencyTypeDropdownModel[],
    selProjectTypeID: 0,
    selAgencyTypeID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.searchText !== undefined) {
        mainSearch = lc.searchText
      }
      geQuotationCateogryDropDownData(mainSearch)
    }, 100)
  }, [])

  function geQuotationCateogryDropDownData(mainSearch: string) {
    getQuotationCateogryDropDownAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getAllAgencyTypeData(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectTypeData: [], loading: false})
      })
  }

  function getAllAgencyTypeData(
    projectTypeData: IQuotationCateogryDropDownModel[],
    mainSearch: string
  ) {
    getAllAgencyType()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          getComplainDataByComplainID(projectTypeData, responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyTypeData: [], projectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyTypeData: [], projectTypeData: [], loading: false})
      })
  }

  function getComplainDataByComplainID(
    projectTypeData: IQuotationCateogryDropDownModel[],
    agencyTypeData: IAgencyTypeDropdownModel[],
    mainSearch: string
  ) {
    GetComplainByComplainIDAPI(parseInt(complainID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('agencyTypeID', response.data.agencyTypeID)
          formik.setFieldValue('projectTypeID', response.data.projectTypeID)
          formik.setFieldValue('complainDescription', response.data.complainDescription)
          setState({
            ...state,
            agencyTypeData: agencyTypeData,
            projectTypeData: projectTypeData,
            selAgencyTypeID: response.data.agencyTypeID,
            selProjectTypeID: response.data.projectTypeID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          agencyTypeData: [],
          projectTypeData: [],
          loading: false,
        })
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'agencyTypeID') {
      formik.setFieldValue('agencyTypeID', parseInt(value))
    } else if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
    }
  }

  // ===========================================
  const formik = useFormik<IComplainModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        UpdateComplainDetailsAPI(
          parseInt(complainID),
          values.projectTypeID,
          values.agencyTypeID,
          values.complainDescription
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({pathname: '/master/complaints/list', state: {search: state.mainSearch}})
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
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/master/complaints/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Project Category Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='projectTypeID'
                  >
                    <option selected={state.selProjectTypeID === 0 ? true : false} value={0}>
                      Select Project Category Type
                    </option>
                    {state.projectTypeData.length > 0 &&
                      state.projectTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.quotationCategoryID}
                            selected={
                              state.selProjectTypeID == data.quotationCategoryID ? true : false
                            }
                          >
                            {data.quotationCategoryName}
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
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>Agency Type:</label>
                <div className={'col-lg-3 fv-row'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='agencyTypeID'
                  >
                    <option selected={state.selAgencyTypeID === 0 ? true : false} value={0}>
                      Select Agency Type
                    </option>
                    {state.agencyTypeData.length > 0 &&
                      state.agencyTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.agencyTypeID}
                            selected={state.selAgencyTypeID == data.agencyTypeID ? true : false}
                          >
                            {data.agencyTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.agencyTypeID && formik.errors.agencyTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.agencyTypeID}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Complaint Description:</span>
                </label>
                <div className='col-lg-9 fv-row'>
                  <textarea
                    rows={3}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Complaint Description'
                    {...formik.getFieldProps('complainDescription')}
                  />
                  {formik.touched.complainDescription && formik.errors.complainDescription && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.complainDescription}</div>
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
                    pathname: '/master/complaints/list',
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
    </>
  )
}
export default EditComplain
