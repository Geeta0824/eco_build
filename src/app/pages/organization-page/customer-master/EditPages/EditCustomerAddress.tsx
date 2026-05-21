import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {getDropDownCountryList} from '../../../../modules/master-page/country-master-page/NewCountryCRUD'
import {getStateByCountryId} from '../../../../modules/master-page/state-master-page/StateCRUD'
import {getCityByStateId} from '../../../../modules/master-page/district-master-page/DistrictCRUD'
import {ICountryModel} from '../../../../models/master-page/ICountryModel'
import {IDistrictModel, IStateWebModel} from '../../../../models/master-page/IDistrictModel'
import {
  ICustomerAddressModel,
  customerAddInitValues as initialValues,
} from '../../../../models/organization-page/customer/ICustomenrModel'
import {
  UpdateCustomerAddressDetails,
  customerAddressApi,
} from '../../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {getTalukaByDistrictID} from '../../../../modules/master-page/taluka-master-page/TalukaCRUD'
import {ITalukaModel} from '../../../../models/master-page/ITalukaModel'

const profileDetailsSchema = Yup.object().shape({})

interface ICustomerAddress {
  loading: boolean
  customerData: ICustomerAddressModel
  countryData: ICountryModel[]
  stateData: IStateWebModel[]
  districtData: IDistrictModel[]
  talukaData: ITalukaModel[]
  newCustomerID: number
  talukaID: number
  districtID: number
  countryID: number
  stateID: number
  mainBranchID: number
  mainSearch: string
}

const EditCustomerAddress: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const {customerID} = useParams<{customerID: string}>()
  const [data, setData] = useState<ICustomerAddressModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICustomerAddressModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ICustomerAddress>({
    loading: false,
    customerData: {} as ICustomerAddressModel,
    countryData: [] as ICountryModel[],
    stateData: [] as IStateWebModel[],
    districtData: [] as IDistrictModel[],
    talukaData: [] as ITalukaModel[],
    newCustomerID: 0,
    talukaID: 0,
    districtID: 0,
    countryID: 0,
    stateID: 0,
    mainBranchID: 0,
    mainSearch: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc.mainBranchID == undefined || lc.mainSearch !== undefined) {
        mainBranchID = lc.mainBranchID
        mainSearch = lc.mainSearch
      }
      getCustomerDataByCustomerID(mainBranchID, mainSearch)
    }, 100)
  }, [])

  // =====================Drop Down Selection Function==========================
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'countryID') {
      formik.setFieldValue('countryID', parseInt(value))
      getStateByCountryData(parseInt(value))
    } else if (elementId === 'stateID') {
      formik.setFieldValue('stateID', parseInt(value))
      getCityByStateData(parseInt(value))
    } else if (elementId === 'districtID') {
      formik.setFieldValue('districtID', parseInt(value))
      getTalukaByDistrictId(parseInt(value))
    } else if (elementId === 'talukaID') {
      formik.setFieldValue('talukaID', parseInt(value))
    }
  }

  // =====================Address By Customer ID Api==========================
  function getCustomerDataByCustomerID(mainBranchID: number, mainSearch: string) {
    customerAddressApi(parseInt(customerID))
      .then((response) => {
        let responseData = response.data
        if (response.data.isSuccess === true) {
          getCountryData(responseData, mainBranchID, mainSearch)
          formik.setFieldValue('customerID', responseData.customerID)
          formik.setFieldValue('districtID', responseData.districtID)
          formik.setFieldValue('countryID', responseData.countryID)
          formik.setFieldValue('address1', responseData.address1)
          formik.setFieldValue('address2', responseData.address2)
          formik.setFieldValue('pincode', responseData.pincode)
          formik.setFieldValue('stateID', responseData.stateID)
          formik.setFieldValue('cityName', responseData.cityName)
          formik.setFieldValue('talukaID', responseData.talukaID)
          // formik.setFieldValue('talukaName', responseData.talukaName)
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

  // =====================Country Api==========================
  function getCountryData(
    customerData: ICustomerAddressModel,
    mainBranchID: number,
    mainSearch: string
  ) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        const responseData = resp.responseObject
        if (resp.isSuccess == true) {
          getStateByCountry(customerData, responseData, mainBranchID, mainSearch)
        } else {
          setState({
            ...state,
            customerData: customerData,
            countryData: responseData,
            newCustomerID: parseInt(customerID),
            loading: false,
          })
          toast.error(`${resp.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          countryData: [],
          loading: false,
        })
      })
  }

  // =====================State Data By Country ID Api==========================
  function getStateByCountry(
    customerData: ICustomerAddressModel,
    countryData: ICountryModel[],
    mainBranchID: number,
    mainSearch: string
  ) {
    getStateByCountryId(customerData.countryID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getCityByState(customerData, countryData, responseData)
        } else {
          setState({
            ...state,
            stateData: responseData,
            countryID: customerData.countryID,
            stateID: 0,
            districtID: 0,
            districtData: [],
            mainBranchID,
            mainSearch,
            loading: false,
          })
          toast.error(`${response.data.message}`)
          setState({...state, stateData: [], districtData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, stateData: [], districtData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =====================District(City) Data By State ID Api==========================
  function getCityByState(
    customerData: ICustomerAddressModel,
    countryData: ICountryModel[],
    stateData: IStateWebModel[]
  ) {
    getCityByStateId(customerData.stateID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getTalukaDataByDistrictId(customerData, countryData, stateData, responseData)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, districtData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, districtData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =======================Taluka Data APi By District(City) ID=======================
  function getTalukaDataByDistrictId(
    customerData: ICustomerAddressModel,
    countryData: ICountryModel[],
    stateData: IStateWebModel[],
    districtData: IDistrictModel[]
  ) {
    getTalukaByDistrictID(customerData.districtID)
      .then((resp) => {
        if (resp.data.isSuccess == true) {
          const responseData = resp.data.responseObject
          setState({
            ...state,
            newCustomerID: parseInt(customerID),
            countryData: countryData,
            stateData: stateData,
            districtData: districtData,
            talukaData: responseData,
            countryID: customerData.countryID,
            stateID: customerData.stateID,
            districtID: customerData.districtID,
            talukaID: customerData.talukaID,
            loading: false,
          })
        } else {
          toast.error(`${resp.data.message}`)
          setState({...state, talukaData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, talukaData: [], loading: false})
      })
  }

  // =====================Drop Down State Data By Country ID Api==========================
  function getStateByCountryData(countryId: number) {
    getStateByCountryId(countryId)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          formik.setFieldValue('stateID', 0)
          formik.setFieldValue('districtID', 0)
          setState({
            ...state,
            stateData: responseData,
            countryID: countryId,
            stateID: 0,
            districtID: 0,
            talukaID: 0,
            districtData: [],
            talukaData: [],
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, stateData: [], districtData: [], talukaData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, stateData: [], districtData: [], talukaData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =====================Drop Down District(City) Data By State ID Api==========================
  function getCityByStateData(stateId: number) {
    getCityByStateId(stateId)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          formik.setFieldValue('districtID', 0)
          setState({
            ...state,
            districtData: responseData,
            stateID: stateId,
            districtID: 0,
            talukaID: 0,
            talukaData: [],
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, districtData: [], talukaData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, districtData: [], talukaData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =======================Drop Down Taluka Data APi By District(City) ID=======================
  function getTalukaByDistrictId(districtId: number) {
    getTalukaByDistrictID(districtId)
      .then((resp) => {
        if (resp.data.isSuccess == true) {
          const resDistData = resp.data.responseObject
          setState({
            ...state,
            talukaData: resDistData,
            districtID: districtId,
            talukaID: 0,
            loading: false,
          })
        } else {
          toast.error(`${resp.data.message}`)
          setState({...state, talukaData: [], districtID: districtId, talukaID: 0, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, talukaData: [], districtID: districtId, talukaID: 0, loading: false})
      })
  }

  // =====================Update Customer Adress Api==========================
  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICustomerAddressModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record ?')
        if (Edit) {
          if (state.newCustomerID !== 0) {
            UpdateCustomerAddressDetails(
              state.newCustomerID,
              values.address1,
              values.address2,
              values.pincode,
              values.cityName,
              // values.talukaName,
              values.talukaID,
              values.districtID,
              values.stateID,
              values.countryID,
              user.employeeID,
              '192.168.1.2'
            )
              .then((response) => {
                if (response.data.isSuccess === true) {
                  toast.success('Update Successfull!')
                  setLoading(false)
                } else {
                  toast.error(`${response.data.message}`)
                  setLoading(false)
                }
              })
              .catch((error) => {
                setLoading(false)
                toast.error(`${error}`)
              })
          } else {
            toast.error('...comming soon update...')
            setLoading(false)
          }
        } else {
          return setLoading(false)
        }
      }, 1000)
    },
  })

  return (
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
          <h3 className='fw-bolder m-0'>Update Address Details</h3>
        </div>
      </div> */}
      {state.loading === true ? (
        <div className='card-body p-9'>
          <div className='text-center mt-5 pt-5'>
            <div className='spinner-border' style={{width: '3rem', height: '3rem'}} role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div id='kt_account_profile_details' className='collapse show'>
            <form onSubmit={formik.handleSubmit} noValidate className='form' id='Address'>
              <div className='card-body p-9'>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Address Line 1:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Address 1'
                      {...formik.getFieldProps('address1')}
                    />
                    {formik.touched.address1 && formik.errors.address1 && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.address1}</div>
                      </div>
                    )}
                  </div>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Address Line 2:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Address 2'
                      {...formik.getFieldProps('address2')}
                    />
                    {formik.touched.address2 && formik.errors.address2 && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.address2}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Coutnry:</label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select'
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
                              selected={state.countryID === data.countryID ? true : false}
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>State:</label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select'
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
                              selected={state.stateID === data.stateID ? true : false}
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>District:</label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select'
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
                              selected={state.districtID === data.cityID ? true : false}
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
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Taluka:</label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='talukaID'
                    >
                      <option selected value='0'>
                        Select Taluka
                      </option>
                      {state.talukaData.length > 0 &&
                        state.talukaData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.talukaID}
                              selected={state.talukaID === data.talukaID ? true : false}
                            >
                              {data.talukaName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.talukaID && formik.errors.talukaID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.talukaID}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Pincode:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Pincode'
                      {...formik.getFieldProps('pincode')}
                    />
                    {formik.touched.pincode && formik.errors.pincode && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.pincode}</div>
                      </div>
                    )}
                  </div>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>City Name:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='City Name'
                      {...formik.getFieldProps('cityName')}
                    />
                    {formik.touched.cityName && formik.errors.cityName && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.cityName}</div>
                      </div>
                    )}
                  </div>
                  {/* <label className='col-lg-2 col-form-label fw-bold fs-6'>Taluka Name:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Taluka Name'
                      {...formik.getFieldProps('talukaName')}
                    />
                    {formik.touched.talukaName && formik.errors.talukaName && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.talukaName}</div>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>

              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-primary me-4' disabled={loading}>
                  {!loading && 'Save'}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export {EditCustomerAddress}
