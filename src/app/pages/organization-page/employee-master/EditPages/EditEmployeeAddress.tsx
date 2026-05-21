import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useParams} from 'react-router-dom'
import {
  employeeAddressIniValues as initialValues,
  IEmployeeAddressModel,
} from '../../../../models/organization-page/Employee/IEmployeeModel'
import {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  UpdateEmployeeAddressDetails,
  employeeAddressApi,
} from '../../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {getDropDownCountryList} from '../../../../modules/master-page/country-master-page/NewCountryCRUD'
import {getStateByCountryId} from '../../../../modules/master-page/state-master-page/StateCRUD'
import {getCityByStateId} from '../../../../modules/master-page/district-master-page/DistrictCRUD'
import {ICountryModel} from '../../../../models/master-page/ICountryModel'
import {IDistrictModel, IStateWebModel} from '../../../../models/master-page/IDistrictModel'
import {ITalukaModel} from '../../../../models/master-page/ITalukaModel'
import {getTalukaByDistrictID} from '../../../../modules/master-page/taluka-master-page/TalukaCRUD'

const profileDetailsSchema = Yup.object().shape({})

interface IEmployeeAddress {
  loading: boolean
  employeeData: IEmployeeAddressModel
  perCountryData: ICountryModel[]
  perStateData: IStateWebModel[]
  perCityData: IDistrictModel[]
  perTalukaData: ITalukaModel[]
  curtCountryData: ICountryModel[]
  curtStateData: IStateWebModel[]
  curtCityData: IDistrictModel[]
  curtTalukaData: ITalukaModel[]
  newEmployeeID: number
  curntCountryID: number
  curntSateID: number
  curntCityID: number
  curntTalukaID: number
  perCityID: number
  perCoutnryID: number
  perStateID: number
  perTalukaID: number
}

const EditEmployeeAddress: React.FC = () => {
  const history = useHistory()
  const {employeeID} = useParams<{employeeID: string}>()
  const [data, setData] = useState<IEmployeeAddressModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IEmployeeAddressModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IEmployeeAddress>({
    loading: false,
    employeeData: {} as IEmployeeAddressModel,
    perCountryData: [] as ICountryModel[],
    perStateData: [] as IStateWebModel[],
    perCityData: [] as IDistrictModel[],
    perTalukaData: [] as ITalukaModel[],
    curtCountryData: [] as ICountryModel[],
    curtStateData: [] as IStateWebModel[],
    curtCityData: [] as IDistrictModel[],
    curtTalukaData: [] as ITalukaModel[],
    newEmployeeID: 0,
    curntCountryID: 0,
    curntSateID: 0,
    curntCityID: 0,
    curntTalukaID: 0,
    perCityID: 0,
    perTalukaID: 0,
    perCoutnryID: 0,
    perStateID: 0,
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getEmployeeDataByemployeeID()
    }, 100)
  }, [])

  // =============================Drop Down Selection and Function===================================
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'curntCountryID') {
      formik.setFieldValue('curntCountryID', parseInt(value))
      getStateData(parseInt(value), 'curntCountryID')
    } else if (elementId === 'curntSateID') {
      formik.setFieldValue('curntSateID', parseInt(value))
      getCityData(parseInt(value), 'curntSateID')
    } else if (elementId === 'curntCityID') {
      formik.setFieldValue('curntCityID', parseInt(value))
      getTalukaDataByDistrictIdDropDown(parseInt(value), 'curntCityID')
    } else if (elementId === 'perTalukaID') {
      formik.setFieldValue('perTalukaID', parseInt(value))
    } else if (elementId === 'perCoutnryID') {
      formik.setFieldValue('perCoutnryID', parseInt(value))
      getStateData(parseInt(value), 'perCoutnryID')
    } else if (elementId === 'perStateID') {
      formik.setFieldValue('perStateID', parseInt(value))
      getCityData(parseInt(value), 'perStateID')
    } else if (elementId === 'perCityID') {
      formik.setFieldValue('perCityID', parseInt(value))
      getTalukaDataByDistrictIdDropDown(parseInt(value), 'perCityID')
    } else if (elementId === 'curntTalukaID') {
      formik.setFieldValue('curntTalukaID', parseInt(value))
    }
  }

  // =============================Employee By Employee ID APi===================================
  function getEmployeeDataByemployeeID() {
    employeeAddressApi(parseInt(employeeID))
      .then((response) => {
        let responseData = response.data
        getCurtCountryStateCityData(responseData)
        formik.setFieldValue('employeeID', responseData.employeeID)
        formik.setFieldValue('curntAddress1', responseData.curntAddress1)
        formik.setFieldValue('curntAddress2', responseData.curntAddress2)
        formik.setFieldValue('curntCityID', responseData.curntCityID)
        formik.setFieldValue('curntTalukaID', responseData.curntTalukaID)
        formik.setFieldValue('curntCountryID', responseData.curntCountryID)
        formik.setFieldValue('curntPincode', responseData.curntPincode)
        formik.setFieldValue('curntPincodeCityName', responseData.curntPincodeCityName)
        formik.setFieldValue('curntSateID', responseData.curntSateID)
        formik.setFieldValue('perAddress1', responseData.perAddress1)
        formik.setFieldValue('perAddress2', responseData.perAddress2)
        formik.setFieldValue('perCityID', responseData.perCityID)
        formik.setFieldValue('perTalukaID', responseData.perTalukaID)
        formik.setFieldValue('perCoutnryID', responseData.perCoutnryID)
        formik.setFieldValue('perPincode', responseData.perPincode)
        formik.setFieldValue('perPincodeCityName', responseData.perPincodeCityName)
        formik.setFieldValue('perStateID', responseData.perStateID)
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =============================Country Api===================================
  function getCurtCountryStateCityData(employeeData: IEmployeeAddressModel) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        const responseData = resp.responseObject
        getCurtStateData(employeeData, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          perCountryData: [],
          curtCountryData: [],
        })
      })
  }

  // =============================Current State By Country ID Api===================================
  function getCurtStateData(employeeData: IEmployeeAddressModel, allCountryData: ICountryModel[]) {
    getStateByCountryId(employeeData.curntCountryID)
      .then((response) => {
        let responseData = response.data.responseObject
        getCurtCityData(employeeData, allCountryData, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =============================Current City By State ID Api===================================
  function getCurtCityData(
    employeeData: IEmployeeAddressModel,
    allCountryData: ICountryModel[],
    curtStateData: IStateWebModel[]
  ) {
    getCityByStateId(employeeData.curntSateID)
      .then((response) => {
        let responseData = response.data.responseObject
        getPerStateData(employeeData, allCountryData, curtStateData, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =============================Permanent State By Country ID Api===================================
  function getPerStateData(
    employeeData: IEmployeeAddressModel,
    allCountryData: ICountryModel[],
    curtStateData: IStateWebModel[],
    curtCityData: IDistrictModel[]
  ) {
    getStateByCountryId(employeeData.perCoutnryID)
      .then((response) => {
        let responseData = response.data.responseObject
        getPerCityData(employeeData, allCountryData, curtStateData, curtCityData, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =============================Permanent City By State ID Api===================================
  function getPerCityData(
    employeeData: IEmployeeAddressModel,
    allCountryData: ICountryModel[],
    curtStateData: IStateWebModel[],
    curtCityData: IDistrictModel[],
    perStateData: IStateWebModel[]
  ) {
    getCityByStateId(employeeData.perStateID)
      .then((response) => {
        let responseData = response.data.responseObject
        getCurrentTalukaDataByDistrictId(
          employeeData,
          allCountryData,
          curtStateData,
          curtCityData,
          perStateData,
          responseData
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =============================Current Taluka Data By City ID APi===================================
  function getCurrentTalukaDataByDistrictId(
    employeeData: IEmployeeAddressModel,
    allCountryData: ICountryModel[],
    curtStateData: IStateWebModel[],
    curtCityData: IDistrictModel[],
    perStateData: IStateWebModel[],
    perCityData: IDistrictModel[]
  ) {
    getTalukaByDistrictID(employeeData.curntCityID)
      .then((resp) => {
        if (resp.data.isSuccess == true) {
          const responseData = resp.data.responseObject
          getPermenantTalukaDataByDistrictId(
            employeeData,
            allCountryData,
            curtStateData,
            curtCityData,
            perStateData,
            perCityData,
            responseData
          )
        } else {
          toast.error(`${resp.data.message}`)
          setState({...state, curtTalukaData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, curtTalukaData: [], loading: false})
      })
  }

  // =============================Permenant Taluka Data By City ID APi===================================
  function getPermenantTalukaDataByDistrictId(
    employeeData: IEmployeeAddressModel,
    allCountryData: ICountryModel[],
    curtStateData: IStateWebModel[],
    curtCityData: IDistrictModel[],
    perStateData: IStateWebModel[],
    perCityData: IDistrictModel[],
    curtTalukaData: ITalukaModel[]
  ) {
    getTalukaByDistrictID(employeeData.curntCityID)
      .then((resp) => {
        if (resp.data.isSuccess == true) {
          const responseData = resp.data.responseObject
          setState({
            ...state,
            loading: false,
            newEmployeeID: parseInt(employeeID),
            employeeData: employeeData,
            perCountryData: allCountryData,
            curtCountryData: allCountryData,
            curtStateData: curtStateData,
            curtCityData: curtCityData,
            curtTalukaData: curtTalukaData,
            perTalukaData: responseData,
            perStateData: perStateData,
            perCityData: perCityData,
            curntCountryID: employeeData.curntCountryID,
            curntSateID: employeeData.curntSateID,
            curntCityID: employeeData.curntCityID,
            curntTalukaID: employeeData.curntTalukaID,
            perCoutnryID: employeeData.perCoutnryID,
            perStateID: employeeData.perStateID,
            perCityID: employeeData.perCityID,
            perTalukaID: employeeData.perTalukaID,
          })
        } else {
          toast.error(`${resp.data.message}`)
          setState({...state, perTalukaData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, perTalukaData: [], loading: false})
      })
  }

  // =============================Drop Down State By Country ID Api===================================
  function getStateData(countryId: number, type: string) {
    getStateByCountryId(countryId)
      .then((response) => {
        let responseData = response.data.responseObject
        if (type === 'curntCountryID') {
          formik.setFieldValue('curntSateID', 0)
          setState({
            ...state,
            curtStateData: responseData,
            curntCountryID: countryId,
            curntSateID: 0,
            curntCityID: 0,
            curntTalukaID: 0,
            curtCityData: [],
            curtTalukaData: [],
            loading: false,
          })
        } else if (type === 'perCoutnryID') {
          formik.setFieldValue('perStateID', 0)
          setState({
            ...state,
            perStateData: responseData,
            perCoutnryID: countryId,
            perStateID: 0,
            perTalukaID: 0,
            perCityID: 0,
            perCityData: [],
            perTalukaData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        setState({...state, perStateData: [], perCityData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =============================Drop Down District(City) By State ID Api===============================
  function getCityData(stateId: number, type: string) {
    getCityByStateId(stateId)
      .then((response) => {
        let responseData = response.data.responseObject
        if (type === 'curntSateID') {
          setState({
            ...state,
            curtCityData: responseData,
            curntSateID: 0,
            curntCityID: 0,
            curntTalukaID: 0,
            curtTalukaData: [],
            loading: false,
          })
        } else if (type === 'perStateID') {
          setState({
            ...state,
            perCityData: responseData,
            perStateID: 0,
            perCityID: 0,
            perTalukaID: 0,
            perTalukaData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        setState({...state, perCityData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =============================Drop Down Taluka APi By Drop Down Slection=============================
  function getTalukaDataByDistrictIdDropDown(DistrictId: number, type: string) {
    getTalukaByDistrictID(DistrictId)
      .then((resp) => {
        if (resp.data.isSuccess == true) {
          const responseData = resp.data.responseObject
          if (type === 'curntCityID') {
            formik.setFieldValue('curntTalukaID', 0)
            setState({
              ...state,
              curtTalukaData: responseData,
              curntCityID: DistrictId,
              curntTalukaID: 0,
              loading: false,
            })
          } else if (type === 'perCityID') {
            formik.setFieldValue('perTalukaID', 0)
            setState({
              ...state,
              perTalukaData: responseData,
              perCityID: DistrictId,
              perTalukaID: 0,
              loading: false,
            })
          }
        } else {
          toast.error(`${resp.data.message}`)
          setState({...state, curtCityData: [], perCityData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, curtCityData: [], perCityData: [], loading: false})
      })
  }

  // ======================Check Box Click Permenent State By Country ID Api=========================
  function getDropdownPerStateData(
    countryId: number,
    stateId: number,
    cityId: number,
    talukaId: number
  ) {
    getStateByCountryId(countryId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          getDropdownPerCityData(responseData, countryId, stateId, cityId, talukaId)
        } else {
          setState({...state, perStateData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, perStateData: [], perCityData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ===================Check Box Click Permenent District(City) By State ID Api=======================
  function getDropdownPerCityData(
    perStateData: [],
    countryId: number,
    stateId: number,
    cityId: number,
    talukaId: number
  ) {
    getCityByStateId(stateId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          getDropDownPerTalukaData(responseData, perStateData, countryId, stateId, cityId, talukaId)
        } else {
          setState({...state, perStateData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, perCityData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =============================Taluka APi By Drop Down Slection============================
  function getDropDownPerTalukaData(
    perCityData: [],
    perStateData: [],
    countryId: number,
    stateId: number,
    cityId: number,
    talukaId: number
  ) {
    getTalukaByDistrictID(cityId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            perTalukaData: responseData,
            perStateData: perStateData,
            perCityData: perCityData,
            perCoutnryID: countryId,
            perStateID: stateId,
            perCityID: cityId,
            perTalukaID: talukaId,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, perTalukaData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, perTalukaData: [], loading: false})
      })
  }

  // =============================Check Box Click Function===================================
  function autoFillAddress(event: any) {
    var perAddress1 = ''
    var perAddress2 = ''
    var perCityID = 0
    var perTalukaID = 0
    var perCoutnryID = 0
    var perStateID = 0
    var perPincode = ''
    var perPincodeCityName = ''
    if (event.target.checked == true) {
      perAddress1 = formik.getFieldProps('curntAddress1').value
      perAddress2 = formik.getFieldProps('curntAddress2').value
      perPincode = formik.getFieldProps('curntPincode').value
      perPincodeCityName = formik.getFieldProps('curntPincodeCityName').value
      perCoutnryID = formik.getFieldProps('curntCountryID').value
      perStateID = formik.getFieldProps('curntSateID').value
      perCityID = formik.getFieldProps('curntCityID').value
      perTalukaID = formik.getFieldProps('curntTalukaID').value
      formik.setFieldValue('perAddress1', perAddress1)
      formik.setFieldValue('perAddress2', perAddress2)
      formik.setFieldValue('perPincode', perPincode)
      formik.setFieldValue('perPincodeCityName', perPincodeCityName)
      formik.setFieldValue('perCoutnryID', perCoutnryID)
      getDropdownPerStateData(perCoutnryID, perStateID, perCityID, perTalukaID)
      formik.setFieldValue('perStateID', perStateID)
      formik.setFieldValue('perCityID', perCityID)
    } else {
      formik.setFieldValue('perAddress1', perAddress1)
      formik.setFieldValue('perAddress2', perAddress2)
      formik.setFieldValue('perCityID', perCityID)
      formik.setFieldValue('perTalukaID', perTalukaID)
      formik.setFieldValue('perCoutnryID', perCoutnryID)
      formik.setFieldValue('perStateID', perStateID)
      formik.setFieldValue('perPincode', perPincode)
      formik.setFieldValue('perPincodeCityName', perPincodeCityName)
      setState({...state, perCoutnryID: 0, perStateID: 0, perCityID: 0, perTalukaID: 0})
    }
  }

  // =============================Edit Employee Address Api===================================
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IEmployeeAddressModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record ?')
        if (Edit) {
          if (state.newEmployeeID !== 0) {
            UpdateEmployeeAddressDetails(
              state.newEmployeeID,
              values.perPincode,
              values.curntAddress1,
              values.curntAddress2,
              values.curntPincode,
              values.perPincodeCityName,
              values.curntPincodeCityName,
              values.perAddress1,
              values.perAddress2,
              values.perStateID,
              values.perCoutnryID,
              values.perCityID,
              values.curntSateID,
              values.curntCountryID,
              values.curntCityID,
              values.perTalukaID,
              values.curntTalukaID,
              user.employeeID,
              '192.168.1.2'
            )
              .then((response) => {
                toast.success('Created Successfull!')
                setLoading(false)
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
                <div className='card-title m-0'>
                  <h3 className='fw-bolder m-0'>Current Address:</h3>
                </div>
                <div className='p-7'>
                  <div className='row mb-6'>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>Address Line 1:</label>
                    <div className='col-lg-10 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='Address Line 1'
                        {...formik.getFieldProps('curntAddress1')}
                      />
                      {formik.touched.curntAddress1 && formik.errors.curntAddress1 && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntAddress1}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='row mb-6'>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>Address Line 2:</label>
                    <div className='col-lg-10 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='Address Line 2'
                        {...formik.getFieldProps('curntAddress2')}
                      />
                      {formik.touched.curntAddress2 && formik.errors.curntAddress2 && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntAddress2}</div>
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
                        id='curntCountryID'
                      >
                        <option selected value='0'>
                          Select Country
                        </option>
                        {state.curtCountryData.length > 0 &&
                          state.curtCountryData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.countryID}
                                selected={state.curntCountryID === data.countryID ? true : false}
                              >
                                {data.countryName}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.curntCountryID && formik.errors.curntCountryID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntCountryID}</div>
                        </div>
                      )}
                    </div>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>State:</label>
                    <div className='col-lg-4 fv-row'>
                      <select
                        className='form-select'
                        aria-label='Default select example'
                        onChange={selectChange}
                        id='curntSateID'
                      >
                        <option selected value='0'>
                          Select State
                        </option>
                        {state.curtStateData.length > 0 &&
                          state.curtStateData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.stateID}
                                selected={state.curntSateID === data.stateID ? true : false}
                              >
                                {data.stateMaster}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.curntSateID && formik.errors.curntSateID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntSateID}</div>
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
                        id='curntCityID'
                      >
                        <option selected value='0'>
                          Select District
                        </option>
                        {state.curtCityData.length > 0 &&
                          state.curtCityData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.cityID}
                                selected={state.curntCityID === data.cityID ? true : false}
                              >
                                {data.cityName}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.curntCityID && formik.errors.curntCityID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntCityID}</div>
                        </div>
                      )}
                    </div>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>Taluka:</label>
                    <div className='col-lg-4 fv-row'>
                      <select
                        className='form-select'
                        aria-label='Default select example'
                        onChange={selectChange}
                        id='curntTalukaID'
                      >
                        <option selected value='0'>
                          Select Taluka
                        </option>
                        {state.curtTalukaData.length > 0 &&
                          state.curtTalukaData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.talukaID}
                                selected={state.curntTalukaID === data.talukaID ? true : false}
                              >
                                {data.talukaName}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.curntTalukaID && formik.errors.curntTalukaID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntTalukaID}</div>
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
                        {...formik.getFieldProps('curntPincode')}
                      />
                      {formik.touched.curntPincode && formik.errors.curntPincode && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntPincode}</div>
                        </div>
                      )}
                    </div>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>City:</label>
                    <div className='col-lg-4 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='City Name'
                        {...formik.getFieldProps('curntPincodeCityName')}
                      />
                      {formik.touched.curntPincodeCityName && formik.errors.curntPincodeCityName && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.curntPincodeCityName}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='card-title m-0 d-flex mb-6'>
                  <h3 className='fw-bolder m-0 me-8'>Permanent Address :</h3>
                  <span className='form-group d-flex'>
                    <input
                      className='me-2'
                      type='checkbox'
                      id='checkBox'
                      onClick={autoFillAddress}
                    />
                    <span className='footer text-muted'>Same as current address</span>
                  </span>
                </div>
                <div className='p-7'>
                  <div className='row mb-6'>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>Address Line 1:</label>
                    <div className='col-lg-10 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='Address Line 1'
                        {...formik.getFieldProps('perAddress1')}
                      />
                      {formik.touched.perAddress1 && formik.errors.perAddress1 && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perAddress1}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='row mb-6'>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>Address Line 2:</label>
                    <div className='col-lg-10 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='Address Line 2'
                        {...formik.getFieldProps('perAddress2')}
                      />
                      {formik.touched.perAddress2 && formik.errors.perAddress2 && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perAddress2}</div>
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
                        id='perCoutnryID'
                      >
                        <option selected value='0'>
                          Select Country
                        </option>
                        {state.perCountryData.length > 0 &&
                          state.perCountryData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.countryID}
                                selected={state.perCoutnryID === data.countryID ? true : false}
                              >
                                {data.countryName}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.perCoutnryID && formik.errors.perCoutnryID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perCoutnryID}</div>
                        </div>
                      )}
                    </div>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>State:</label>
                    <div className='col-lg-4 fv-row'>
                      <select
                        className='form-select'
                        aria-label='Default select example'
                        onChange={selectChange}
                        id='perStateID'
                      >
                        <option selected value='0'>
                          Select State
                        </option>
                        {state.perStateData.length > 0 &&
                          state.perStateData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.stateID}
                                selected={state.perStateID === data.stateID ? true : false}
                              >
                                {data.stateMaster}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.perStateID && formik.errors.perStateID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perStateID}</div>
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
                        id='perCityID'
                      >
                        <option selected value='0'>
                          Select District
                        </option>
                        {state.perCityData.length > 0 &&
                          state.perCityData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.cityID}
                                selected={state.perCityID === data.cityID ? true : false}
                              >
                                {data.cityName}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.perCityID && formik.errors.perCityID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perCityID}</div>
                        </div>
                      )}
                    </div>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>Taluka:</label>
                    <div className='col-lg-4 fv-row'>
                      <select
                        className='form-select'
                        aria-label='Default select example'
                        onChange={selectChange}
                        id='perTalukaID'
                      >
                        <option selected value='0'>
                          Select Taluka
                        </option>
                        {state.perTalukaData.length > 0 &&
                          state.perTalukaData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.talukaID}
                                selected={state.perTalukaID === data.talukaID ? true : false}
                              >
                                {data.talukaName}
                              </option>
                            )
                          })}
                      </select>
                      {formik.touched.perTalukaID && formik.errors.perTalukaID && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perTalukaID}</div>
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
                        {...formik.getFieldProps('perPincode')}
                      />
                      {formik.touched.perPincode && formik.errors.perPincode && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perPincode}</div>
                        </div>
                      )}
                    </div>
                    <label className='col-lg-2 col-form-label fw-bold fs-6'>City:</label>
                    <div className='col-lg-4 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='City Name'
                        {...formik.getFieldProps('perPincodeCityName')}
                      />
                      {formik.touched.perPincodeCityName && formik.errors.perPincodeCityName && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.perPincodeCityName}</div>
                        </div>
                      )}
                    </div>
                  </div>
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

export {EditEmployeeAddress}
