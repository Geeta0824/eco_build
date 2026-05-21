import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Field, useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation} from 'react-router-dom'
import {getAllAgencyType} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {IAgencyTypeModel} from '../../../models/product-page/IAgencyTypeModel'
import {
  IAgencyRemarksModel,
  agencyRemarksInitValue as initialValues,
  IRemarkTypeModel,
} from '../../../models/remarks-page/IAgencyRemarksModel'
import {
  RemarksTypeGetListApi,
  addAgencyRemarksApi,
} from '../../../modules/remarks-master-pages/agency-remarks-master-page/AgencyRemarksCRUD'

const profileDetailsSchema = Yup.object().shape({
  agencyTypeID: Yup.number().min(1, 'field is required').required('field is required'),
  remarksTypeID: Yup.number().min(1, 'field is required').required('field is required'),
})

interface IDepartment {
  loading: boolean
  agencyTypeData: IAgencyTypeModel[]
  remarksTypeData: IRemarkTypeModel[]
  selAgencyTypeID: number
  selRemarksTypeID: number
  mainSearch: string
}

const AddAgencyRemarks: React.FC = () => {
  const location = useLocation()
 
  const [data, setData] = useState<IAgencyRemarksModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IAgencyRemarksModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    loading: false,
    agencyTypeData: [] as IAgencyTypeModel[],
    remarksTypeData: [] as IRemarkTypeModel[],
    selAgencyTypeID: 0,
    selRemarksTypeID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getagencyTypeData(mainSearch)
    }, 100)
  }, [])

  function getagencyTypeData(mainSearch: string) {
    getAllAgencyType()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          // setState({
          //   ...state,
          //   agencyTypeData: responseData,
          //   loading: false,
          // })
          getRemarksTypeData(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyTypeData: [], loading: false})
      })
  }

  function getRemarksTypeData(agencyTypeData: IAgencyTypeModel[], mainSearch: string) {
    RemarksTypeGetListApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            remarksTypeData: responseData,
            agencyTypeData: agencyTypeData,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, remarksTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, remarksTypeData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'agencyTypeID') {
      formik.setFieldValue('agencyTypeID', parseInt(value))
      setState({...state, selAgencyTypeID: parseInt(value)})
    } else if (elementId === 'remarksTypeID') {
      formik.setFieldValue('remarksTypeID', parseInt(value))
      setState({...state, selRemarksTypeID: parseInt(value)})
    }
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const formik = useFormik<IAgencyRemarksModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addAgencyRemarksApi(values.agencyTypeID, values.remarksTypeID, values.remarks,isActive)
          .then((response: {data: {isSuccess: boolean; message: any}}) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/remarks/agency-rmk/list',
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

  return (
    <>
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/remarks/agency-rmk/list',
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Agency Type:
                </label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Remarks Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='remarksTypeID'
                  >
                    <option selected={state.selRemarksTypeID === 0 ? true : false} value={0}>
                      Select Remarks Type
                    </option>
                    {state.remarksTypeData.length > 0 &&
                      state.remarksTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.remarksTypeID}
                            selected={state.selRemarksTypeID == data.remarksTypeID ? true : false}
                          >
                            {data.remarksTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.remarksTypeID && formik.errors.remarksTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.remarksTypeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Remarks:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Remarks...'
                    {...formik.getFieldProps('remarks')}
                  />
                  {formik.touched.remarks && formik.errors.remarks && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.remarks}</div>
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
                      className='form-check-input mt-4'
                      type='checkbox'
                      id='Checked'
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
              <button
                onClick={() =>
                  history.push({
                    pathname: '/remarks/agency-rmk/list',
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
export default AddAgencyRemarks
