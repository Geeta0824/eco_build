import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IStateModel} from '../../../models/master-page/IStateModel'


import {
  getAreaPinCodeByAreaPincodeID,
  getCityDropDownByStateID,
  updateAreaPinCodeApi,
} from '../../../modules/master-page/area-pincode-master-page/AreaPincodeCRUD'
import {
  IAreaPinCodeModel,
  areaPincodeInitValues as initialValues,
} from '../../../models/master-page/IAreaPinCodeModel'
import {IDistrictModel} from '../../../models/master-page/IDistrictModel'
import {
  getAreaPinCodeByAreaPincodeID_new,
  getCityDropDownByStateID_new,
  updateAreaPinCodeApi_new,
} from '../../../modules/master-page/area-pincode-master-page/AreaPincodeNewCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  areaName: Yup.string().required('Area Name is Required'),
  pincode: Yup.string().required('pin code is Required'),
})

interface IAreaPin {
  loading: boolean
  areaPinCodeData: IAreaPinCodeModel[]
  stateData: IStateModel[]
  districtData: IDistrictModel[]
  selStateID: number
  selCityID: number
}

const EditAreaPinCode: React.FC = () => {
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const {areaPincodeid} = useParams<{areaPincodeid: string}>()

  const [data, setData] = useState<IAreaPinCodeModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IAreaPinCodeModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IAreaPin>({
    loading: false,
    areaPinCodeData: [] as IAreaPinCodeModel[],
    stateData: [] as IStateModel[],
    districtData: [] as IDistrictModel[],
    selStateID: 0,
    selCityID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getStateDropDownData()
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }
  function getStateDropDownData() {
    // getActiveStateDropdownListAPI()
    //   .then((response) => {
    //     let responseData = response.data.responseObject
    //     if (response.data.isSuccess == true) {
    //       getAreaPinCodeByAreaPincodeIDData(responseData)
    //     } else {
    //       toast.error(`${response.data.message}`)
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(`${error}`)
    //     setState({...state, stateData: [], loading: false})
    //   })
  }

  function getAreaPinCodeByAreaPincodeIDData(stateData: IStateModel[]) {
    let values = {areaPincodeID: parseInt(areaPincodeid)}
    var objEmp = btoa(JSON.stringify(values))
    console.log(values)
    getAreaPinCodeByAreaPincodeID_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        console.log(decodeResp)
        let resp = decodeResp
        if (resp.isSuccess == true) {
          formik.setFieldValue('countryID', resp.countryID)
          formik.setFieldValue('stateID', resp.stateID)
          formik.setFieldValue('cityID', resp.cityID)
          formik.setFieldValue('areaName', resp.areaName)
          formik.setFieldValue('pincode', resp.pincode)
          getCityDropDownByStateIDDataList(stateData, resp.stateID, resp.cityID)
          setIsActive(resp.isActive)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  function getCityDropDownByStateIDDataList(
    stateData: IStateModel[],
    temStateID: number,
    temCity: number
  ) {
    let values = {stateID: temStateID}
    var objEmp = btoa(JSON.stringify(values))
    console.log(values)
    getCityDropDownByStateID_new(`${objEmp}`)
      // getCityDropDownByStateID(temStateID)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        console.log(decodeResp)
        let resp = decodeResp
        let responseData = resp.responseObject
        if (resp.isSuccess == true) {
          setState({
            ...state,
            selStateID: temStateID,
            selCityID: temCity,
            stateData: stateData,
            districtData: responseData,

            loading: false,
          })
        } else {
          toast.error(`${resp.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, districtData: []})
      })
  }

  function getCityDropDownByStateIDData(temStateID: number) {
    let values = {stateID: temStateID}
    var objEmp = btoa(JSON.stringify(values))
    getCityDropDownByStateID_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        console.log(decodeResp)
        let resp = decodeResp
        let responseData = resp.responseObject
        if (resp.isSuccess == true) {
          setState({...state, districtData: responseData, selStateID: temStateID})
        } else {
          toast.error(`${resp.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, districtData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'stateID') {
      formik.setFieldValue('stateID', parseInt(value))
      getCityDropDownByStateIDData(parseInt(value))
    } else if (elementId === 'cityID') {
      setState({...state, selStateID: parseInt(value)})
      formik.setFieldValue('stateID', parseInt(value))
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IAreaPinCodeModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are you sure you want to update selected record')
        if (edit) {
          const updatedValues = {
            ...values,
            isActive: isActive,
            updateBy: user.employeeID,
            areaPincodeid: parseInt(areaPincodeid),
          } // assuming bhkId is defined somewhere
          console.log(updatedValues)
          var objEmp = btoa(JSON.stringify(updatedValues))
          // updateAreaPinCodeApi(
          //   parseInt(areaPincodeid),
          //   values.stateID,
          //   values.cityID,
          //   values.areaName,
          //   values.pincode,
          //   isActive,
          //   user.employeeID,
          //   '192.168.0.1'
          // )
          updateAreaPinCodeApi_new(`${objEmp}`)
            .then((response) => {
              var decodeResp = JSON.parse(atob(response.data.encodedResponse))
              let resp = decodeResp
              if (resp.isSuccess === true) {
                toast.success('Updated Successfulll')
                history.push('/locations/areapincode/list')
                setLoading(false)
              } else {
                toast.error(`${resp.message}`)
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
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>State Name:</label>
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
                    {/* {state.stateData.length > 0 &&
                      state.stateData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.stateID}
                            selected={data.stateID === state.selStateID ? true : false}
                          >
                            {data.stateName}
                          </option>
                        )
                      })} */}
                  </select>
                  {formik.touched.stateID && formik.errors.stateID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.stateID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>City Name:</label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cityID'
                  >
                    <option selected value={'0'}>
                      Select City
                    </option>
                    {state.districtData.length > 0 &&
                      state.districtData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.cityID}
                            selected={data.cityID === state.selCityID ? true : false}
                          >
                            {data.cityName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.cityID && formik.errors.cityID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cityID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'> Area Name</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Area Name'
                    {...formik.getFieldProps('areaName')}
                  />
                  {formik.touched.areaName && formik.errors.areaName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.areaName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'> Pin Code</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Pin Code'
                    {...formik.getFieldProps('pincode')}
                  />
                  {formik.touched.pincode && formik.errors.pincode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pincode}</div>
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
                {!loading && 'Submit'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link className='btn btn-danger ms-3' to='/locations/areapincode/list'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}


