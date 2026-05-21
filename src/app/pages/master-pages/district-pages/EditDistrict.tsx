import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {ICountryModel} from '../../../models/master-page/ICountryModel'

import {
  IDistrictModel,
  IStateWebModel,
  districtModelInitValues as initialValues,
} from '../../../models/master-page/IDistrictModel'
import {
  getCityByCityId,
  updateCity,
} from '../../../modules/master-page/district-master-page/DistrictCRUD'
import {
  getAllState,
  getStateByCountryId,
} from '../../../modules/master-page/state-master-page/StateCRUD'
import {getDropDownCountryList} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  stateID: Yup.number().required('State Name is required').min(1, 'State Name is Required'),
  countryID: Yup.number().required('Country Name is required').min(1, 'Country Name is Required'),
  cityName: Yup.string().required('City Nmae is required'),
})

interface IState {
  loading: boolean
  stateData: IStateWebModel[]
  countryData: ICountryModel[]
  selStateId: number
  selCountryId: number
  selDistrictID: number
  mainSearch: string
}

const EditDistrict: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [isActive, setIsActive] = useState(false)
  const {districtid} = useParams<{districtid: string}>()
  const [data, setData] = useState<IDistrictModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IDistrictModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IState>({
    loading: false,
    stateData: [] as IStateWebModel[],
    countryData: [] as ICountryModel[],
    selStateId: 0,
    selCountryId: 0,
    selDistrictID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      let selDistrictID: number = 0
      if (lc.searchText !== undefined) {
        mainSearch = lc.searchText
        selDistrictID = lc.selDistrictID
      }
      getAllCityData(mainSearch, selDistrictID)
    }, 100)
  }, [])

  function getAllCityData(mainSearch: string, selDistrictID: number) {
    getCityByCityId(districtid)
      .then((response) => {
        if (response.data.isSuccess == true) {
          let cid: number = response.data.countryID
          let sid: number = response.data.stateID
          formik.setFieldValue('countryID', response.data.countryID)
          formik.setFieldValue('stateID', response.data.stateID)
          formik.setFieldValue('cityName', response.data.cityName)
          setIsActive(response.data.isActive)
          getStateData(sid, cid, mainSearch, selDistrictID)
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

  function getStateData(sid: number, cid: number, mainSearch: string, selDistrictID: number) {
    getAllState()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          const temRows: IStateWebModel[] = []
          const Rows: IStateWebModel[] = responseData
          for (let key in Rows) {
            if (Rows[key].isActive === true) {
              temRows.push(Rows[key])
            }
          }
          getCountryStateCityData(sid, cid, temRows, mainSearch, selDistrictID)
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

  function getCountryStateCityData(
    sid: number,
    cid: number,
    temResponseData: IStateWebModel[],
    mainSearch: string,
    selDistrictID: number
  ) {
    getDropDownCountryList()
      .then((response) => {
        // let countryResponseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          const countryResponseData = resp.responseObject
          setState({
            ...state,
            countryData: countryResponseData,
            stateData: temResponseData,
            selStateId: sid,
            selCountryId: cid,
            mainSearch,
            selDistrictID,
            loading: false,
          })
        } else {
          toast.error(`${resp.message}`)
          setState({
            ...state,
            countryData: [],
            stateData: [],
            selDistrictID,
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          countryData: [],
          stateData: [],
          selDistrictID,
          loading: false,
        })
      })
  }

  function getStateDataCouId(countryId: number) {
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

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'countryID') {
      formik.setFieldValue('stateID', 0)
      formik.setFieldValue('countryID', parseInt(value))
      getStateDataCouId(parseInt(value))
    } else if (elementId === 'stateID') {
      formik.setFieldValue('stateID', parseInt(value))
    }
  }

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  const formik = useFormik<IDistrictModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are you sure you want to update selected record')
        if (edit) {
          updateCity(
            parseInt(districtid),
            values.stateID,
            values.cityName,
            isActive,
            user.employeeID,
            '192.168.0.1'
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Updated Successfully')
                history.push({
                  pathname: '/master/district/list',
                  state: {searchText: state.mainSearch, selDistrictID: state.selDistrictID},
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
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{
              pathname: '/master/district/list',
              state: {searchText: state.mainSearch, selDistrictID: state.selDistrictID},
            }}
          >
            Back To List
          </Link>
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
                <div className='col-lg-8 fv-row'>
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
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>State Name:</span>
                </label>

                <div className='col-lg-8 fv-row'>
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
                  <span className='required'>Destrict Name:</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Destrict Name'
                    {...formik.getFieldProps('cityName')}
                  />
                  {formik.touched.cityName && formik.errors.cityName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cityName}</div>
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
              </button>{' '}
              <Link
                className='btn btn-danger ms-3'
                to={{
                  pathname: '/master/district/list',
                  state: {searchText: state.mainSearch, selDistrictID: state.selDistrictID},
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

export {EditDistrict}
