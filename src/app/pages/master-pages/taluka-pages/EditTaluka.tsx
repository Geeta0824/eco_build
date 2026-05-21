import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {ICountryDDModel} from '../../../models/master-page/ICountryModel'
import {IDistrictDDModel} from '../../../models/master-page/IDistrictModel'
import {getCityByStateId} from '../../../modules/master-page/district-master-page/DistrictCRUD'
import {getStateByCountryId} from '../../../modules/master-page/state-master-page/StateCRUD'
import {getDropDownCountryList} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import Loader from '../../common-pages/Loader'
import {
  getTalukaByTalukaId,
  updateTaluka,
} from '../../../modules/master-page/taluka-master-page/TalukaCRUD'
import {
  ITalukaModel,
  talukaInitValues as initialValues,
} from '../../../models/master-page/ITalukaModel'
import {IStateDDModel} from '../../../models/master-page/IStateModel'

const profileDetailsSchema = Yup.object().shape({
  stateID: Yup.number().required('State Name is required').min(1, 'State Name is Required'),
  countryID: Yup.number().required('Country Name is required').min(1, 'Country Name is Required'),
  districtID: Yup.number()
    .required('District Name is required')
    .min(1, 'District Name is Required'),
  talukaName: Yup.string().required('Taluka Nmae is required'),
})

interface ITaluka {
  loading: boolean
  countryData: ICountryDDModel[]
  stateData: IStateDDModel[]
  districtData: IDistrictDDModel[]
  selStateId: number
  selCountryId: number
  selDistrictId: number
  mainCityID: number
  mainSearch: string
}

const EditTaluka: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [isActive, setIsActive] = useState(false)
  const {talukaID} = useParams<{talukaID: string}>()
  const [data, setData] = useState<ITalukaModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ITalukaModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<ITaluka>({
    loading: false,
    stateData: [] as IStateDDModel[],
    countryData: [] as ICountryDDModel[],
    districtData: [] as IDistrictDDModel[],
    selStateId: 0,
    selCountryId: 0,
    selDistrictId: 0,
    mainCityID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      var mainCityID: number = 0
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        mainCityID = lc.mainCityID
      }
      getAllTalukaData(mainSearch, mainCityID)
    }, 100)
  }, [])

  function getAllTalukaData(mainSearch: string, mainCityID: number) {
    getTalukaByTalukaId(talukaID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          let tmpCountryID: number = response.data.countryID
          let tmpStateID: number = response.data.stateID
          let tmpDistrictID: number = response.data.districtID
          formik.setFieldValue('countryID', response.data.countryID)
          formik.setFieldValue('stateID', response.data.stateID)
          formik.setFieldValue('districtID', response.data.districtID)
          formik.setFieldValue('talukaName', response.data.talukaName)
          setIsActive(response.data.isActive)
          getCountryData(tmpStateID, tmpCountryID, tmpDistrictID, mainSearch, mainCityID)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  function getCountryData(
    tmpStateID: number,
    tmpCountryID: number,
    tmpDistrictID: number,
    mainSearch: string,
    mainCityID: number
  ) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          const responseData = resp.responseObject
          getStateDataByCountryID(
            tmpStateID,
            tmpCountryID,
            tmpDistrictID,
            responseData,
            mainSearch,
            mainCityID
          )
        } else {
          toast.error(`${resp.data.massege}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  function getStateDataByCountryID(
    tmpStateID: number,
    tmpCountryID: number,
    tmpDistrictID: number,
    selCountryData: ICountryDDModel[],
    mainSearch: string,
    mainCityID: number
  ) {
    getStateByCountryId(tmpCountryID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getDistrictDataByStateID(
            tmpStateID,
            tmpCountryID,
            tmpDistrictID,
            selCountryData,
            responseData,
            mainSearch,
            mainCityID
          )
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, stateData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  function getDistrictDataByStateID(
    tmpStateID: number,
    tmpCountryID: number,
    tmpDistrictID: number,
    selCountryData: ICountryDDModel[],
    selStateData: IStateDDModel[],
    mainSearch: string,
    mainCityID: number
  ) {
    getCityByStateId(tmpStateID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            countryData: selCountryData,
            stateData: selStateData,
            selStateId: tmpStateID,
            selCountryId: tmpCountryID,
            selDistrictId: tmpDistrictID,
            mainSearch,
            mainCityID,
            loading: false,
            districtData: responseData,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            districtData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false, districtData: []})
      })
  }

  // ------------------Drop Down ----------------------
  function getStateData(countryId: number) {
    state.stateData = []
    getStateByCountryId(countryId)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess) {
          setState({...state, stateData: responseData, loading: false})
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, stateData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, stateData: [], loading: false})
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

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  const formik = useFormik<ITalukaModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are you sure you want to update selected record')
        if (edit) {
          updateTaluka(
            parseInt(talukaID),
            values.districtID,
            values.talukaName,
            isActive,
            user.employeeID,
            '192.168.0.1'
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Updated Successfully')
                history.push({
                  pathname: '/master/taluka/list',
                  state: {search: state.mainSearch, selcityID: state.mainCityID}
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
        } else {
          return setLoading(false)
        }
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
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/master/taluka/list',
              state: {search: state.mainSearch, selcityID: state.mainCityID}
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
          <h3 className='fw-bolder m-0 ms-6'> Update City </h3>
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
                          <option
                            key={index}
                            value={data.countryID}
                            selected={data.countryID === state.selCountryId ? true : false}
                          >
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
                          <option
                            key={index}
                            value={data.stateID}
                            selected={data.stateID === state.selStateId ? true : false}
                          >
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
                          <option
                            key={index}
                            value={data.cityID}
                            selected={data.cityID === state.selDistrictId ? true : false}
                          >
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
                    placeholder='Enter Taluka Name'
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
              </button>
              <button
                onClick={() =>
                  history.push({
                    pathname: '/master/taluka/list',
                    state: {search: state.mainSearch, selcityID: state.mainCityID}
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

export {EditTaluka}
