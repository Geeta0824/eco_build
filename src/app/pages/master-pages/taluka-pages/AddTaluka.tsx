import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  ITalukaModel,
  talukaInitValues as initialValues,
} from '../../../models/master-page/ITalukaModel'
import {ICountryDDModel} from '../../../models/master-page/ICountryModel'
import {getDropDownCountryList} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import {getStateByCountryId} from '../../../modules/master-page/state-master-page/StateCRUD'
import {createTaluka} from '../../../modules/master-page/taluka-master-page/TalukaCRUD'
import {IDistrictModel} from '../../../models/master-page/IDistrictModel'
import {getCityByStateId} from '../../../modules/master-page/district-master-page/DistrictCRUD'
import {IStateDDModel} from '../../../models/master-page/IStateModel'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  countryID: Yup.number().required('Country is required').min(1, 'Country is Required'),
  stateID: Yup.number().required('State is required').min(1, 'State is required'),
  districtID: Yup.number().required('District is required').min(1, 'District is Required'),
  talukaName: Yup.string().required('Taluka Name is required'),
})

interface ITaluka {
  loading: boolean
  countryData: ICountryDDModel[]
  stateData: IStateDDModel[]
  districtData: IDistrictModel[]
  mainSearch: string
  mainCityID: number
}

const AddTaluka: React.FC = () => {
  const [data, setData] = useState<ITalukaModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const updateData = (fieldsToUpdate: Partial<ITalukaModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()
  const location = useLocation()

  const [state, setState] = useState<ITaluka>({
    loading: false,
    countryData: [] as ICountryDDModel[],
    stateData: [] as IStateDDModel[],
    districtData: [] as IDistrictModel[],
    mainSearch: '',
    mainCityID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      var mainCityID: number = 0
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        mainCityID = lc.selDistrictID
      }
      getAllCountryData(mainSearch, mainCityID)
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  function getAllCountryData(mainSearch: string, mainCityID: number) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          const responseData = resp.responseObject
          setState({
            ...state,
            countryData: responseData,
            mainSearch,
            mainCityID,
            loading: false,
          })
        } else {
          toast.error(`${resp.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  function getStateData(countryId: number) {
    state.stateData = []
    getStateByCountryId(countryId)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({...state, stateData: responseData, districtData: []})
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, stateData: [], districtData: []})
      })
  }

  function getDistrictData(stateId: number) {
    state.districtData = []
    getCityByStateId(stateId)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({...state, districtData: responseData})
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, districtData: []})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'countryID') {
      formik.setFieldValue('stateID', 0)
      formik.setFieldValue('countryID', parseInt(value))
      getStateData(parseInt(value))
    } else if (elementId === 'stateID') {
      formik.setFieldValue('stateID', parseInt(value))
      getDistrictData(parseInt(value))
    } else if (elementId === 'districtID') {
      formik.setFieldValue('districtID', parseInt(value))
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ITalukaModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createTaluka(values.districtID, values.talukaName, isActive, user.employeeID, '192.168.0.1')
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull!')
              history.push({
                pathname: '/master/taluka/list',
                state: {search: state.mainSearch, selcityID: state.mainCityID},
              })
            } else {
              toast.error(`${response.data.message}`)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
          })
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/master/taluka/list',
              state: {search: state.mainSearch, selcityID: state.mainCityID},
            })
          }
        >
          Back To List
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
            <h3 className='fw-bolder m-0 ms-6'> Create Taluka </h3>
          </div>
        </div> */}
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Country Name:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='countryID'
                  >
                    <option selected value='0'>
                      Select Country
                    </option>
                    {state.countryData.length > 0 &&
                      state.countryData.map((data, index) => {
                        return (
                          <option key={index} value={data.countryID}>
                            {data.countryName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.countryID && formik.errors.countryID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.countryID}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>State Name:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='stateID'
                  >
                    <option selected value='0'>
                      Select State
                    </option>
                    {state.stateData.length > 0 &&
                      state.stateData.map((data, index) => {
                        return (
                          <option key={index} value={data.stateID}>
                            {data.stateMaster}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.stateID && formik.errors.stateID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.stateID}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>District Name:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='districtID'
                  >
                    <option selected value='0'>
                      Select District
                    </option>
                    {state.districtData.length > 0 &&
                      state.districtData.map((data, index) => {
                        return (
                          <option key={index} value={data.cityID}>
                            {data.cityName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.districtID && formik.errors.districtID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.districtID}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Taluka Name:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Taluka Name '
                    {...formik.getFieldProps('talukaName')}
                  />
                  {formik.touched.talukaName && formik.errors.talukaName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.talukaName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-4'
                      type='checkbox'
                      id='Checked'
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
                    pathname: '/master/taluka/list',
                    state: {search: state.mainSearch, selcityID: state.mainCityID},
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

export {AddTaluka}
