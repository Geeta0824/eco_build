import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {ICountryModel} from '../../../models/master-page/ICountryModel'
import {
  IStateModel,
  stateInitValues as initialValues,
} from '../../../models/master-page/IStateModel'
import {getDropDownCountryList} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import {
  getStateByStateId,
  updateState,
} from '../../../modules/master-page/state-master-page/StateCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  countryID: Yup.number().required('Country Name is required').min(1, 'Country Name is Required'),
  stateMaster: Yup.string().required('State Name is Required'),
})

interface ICountry {
  loading: boolean
  countryData: ICountryModel[]
  selCountryId: number
  mainCountryID: number
  mainSearch: string
}

const EditState: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const [isActive, setIsActive] = useState(false)
  const {stateid} = useParams<{stateid: string}>()
  const [data, setData] = useState<IStateModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IStateModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<ICountry>({
    loading: false,
    countryData: [] as ICountryModel[],
    selCountryId: 0,
    mainCountryID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      var mainCountryID: number = 0
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        mainCountryID = lc.mainCountryID
      }
      getStateDataByStateId(mainSearch, mainCountryID)
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  function getCountryData(cId: number, mainSearch: string, mainCountryID: number) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        const responseData = resp.responseObject
        setState({
          ...state,
          countryData: responseData,
          selCountryId: cId,
          mainCountryID,
          mainSearch,
          loading: false,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, countryData: [], selCountryId: cId, loading: false})
      })
  }

  function getStateDataByStateId(mainSearch: string, mainCountryID: number) {
    getStateByStateId(stateid)
      .then((response) => {
        let cId: number = response.data.countryID
        getCountryData(cId, mainSearch, mainCountryID)
        formik.setFieldValue('countryID', response.data.countryID)
        formik.setFieldValue('stateMaster', response.data.stateMaster)
        setIsActive(response.data.isActive)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'countryID') {
      formik.setFieldValue('countryID', parseInt(value))
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IStateModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are you sure you want to update selected record')
        if (edit) {
          updateState(
            values.countryID,
            parseInt(stateid),
            values.stateMaster,
            true,
            user.employeeID,
            '192.168.0.1'
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Updated Successfulll')
                history.push({
                  pathname: '/master/state/list',
                  state: {search: state.mainSearch, countryID: state.mainCountryID},
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
              pathname: '/master/state/list',
              state: {search: state.mainSearch, countryID: state.mainCountryID},
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
            <h3 className='fw-bolder m-0 ms-6'>Update State</h3>
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
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='State Name'
                    {...formik.getFieldProps('stateMaster')}
                  />
                  {formik.touched.stateMaster && formik.errors.stateMaster && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.stateMaster}</div>
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
                    pathname: '/master/state/list',
                    state: {search: state.mainSearch, countryID: state.mainCountryID},
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

export {EditState}
