import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {IStateModel} from '../../../models/master-page/IStateModel'

import {
  createAreaPincode,
  getCityDropDownByStateID,
} from '../../../modules/master-page/area-pincode-master-page/AreaPincodeCRUD'
import {IDistrictModel} from '../../../models/master-page/IDistrictModel'
import {
  IAreaPinCodeModel,
  areaPincodeInitValues as initialValues,
} from '../../../models/master-page/IAreaPinCodeModel'
import {
  createAreaPincode_New,
  getCityDropDownByStateID_new,
} from '../../../modules/master-page/area-pincode-master-page/AreaPincodeNewCRUD'

const profileDetailsSchema = Yup.object().shape({
  areaName: Yup.string().required('Area Name is Required'),
  pincode: Yup.string().required('pin code is Required'),
})

interface IAreaPin {
  loading: boolean
  stateData: IStateModel[]
  districtData: IDistrictModel[]
  areaPinCodeData: IAreaPinCodeModel[]
  stateID: number
  stateid: number
  selStateID: number
  selcityID: number
}

const AddAreaPinCode: React.FC = () => {
  const [data, setData] = useState<IAreaPinCodeModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const updateData = (fieldsToUpdate: Partial<IAreaPinCodeModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const history = useHistory()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IAreaPin>({
    loading: false,
    stateData: [] as IStateModel[],
    districtData: [] as IDistrictModel[],
    areaPinCodeData: [] as IAreaPinCodeModel[],
    stateID: 0,
    stateid: 0,
    selStateID: 0,
    selcityID: 0,
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
    //       setState({...state, stateData: responseData})
    //     } else {
    //       toast.error(`${response.data.message}`)
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(`${error}`)
    //     setState({...state, stateData: [], loading: false})
    //   })
  }

  function getCityDropDownByStateIDData(stateid: number) {
    let values = {stateID: `${stateid}`}
    console.log(values)
    var objEmp = btoa(JSON.stringify(values))
    getCityDropDownByStateID_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let responseData = resp.responseObject
        if (resp.isSuccess == true) {
          setState({...state, districtData: responseData, stateid: stateid})
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
      setState({...state, selStateID: parseInt(value)})
      formik.setFieldValue('stateID', parseInt(value))
      getCityDropDownByStateIDData(parseInt(value))
    } else if (elementId === 'cityID') {
      setState({...state, selcityID: parseInt(value)})
      formik.setFieldValue('cityID', parseInt(value))
    }
  }
  const [loading, setLoading] = useState(false)

  const formik = useFormik<IAreaPinCodeModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)

      // Combine form values with additional fields
      const AddValues = {
        ...values,
        isActive,
        createBy: user.employeeID,
        ipAddress: '192.168.0.1', // If the IP is constant, define it here
      }

      console.log('Add Values:', AddValues)

      // Encode updated values and send API request
      const objEmp = btoa(JSON.stringify(AddValues))
      createAreaPincode_New(`${objEmp}`)
        .then((response) => {
          const decodeResp = JSON.parse(atob(response.data.encodedResponse))
          const {isSuccess, message} = decodeResp

          if (isSuccess) {
            toast.success('Created Successfully')
            history.push('/locations/areapincode/list')
          } else {
            toast.error(message)
          }
          setLoading(false) // Stop loading on success
        })
        .catch((error) => {
          toast.error(`Error: ${error.message || error}`)
          setLoading(false) // Stop loading on error
        })
    },
  })

  return (
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
                        <option key={index} value={data.stateID}>
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
                  <option selected>Select City</option>
                  {state.districtData.length > 0 &&
                    state.districtData.map((data, index) => {
                      return (
                        <option key={index} value={data.cityID}>
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
                  placeholder='Enter PinCode'
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
  )
}

export {AddAreaPinCode}
