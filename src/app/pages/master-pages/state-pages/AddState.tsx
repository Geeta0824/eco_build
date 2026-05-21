import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {ICountryModel} from '../../../models/master-page/ICountryModel'
import {
  IStateModel,
  stateInitValues as initialValues,
} from '../../../models/master-page/IStateModel'
import {getDropDownCountryList} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import {createState} from '../../../modules/master-page/state-master-page/StateCRUD'

const profileDetailsSchema = Yup.object().shape({
  countryID: Yup.number().required('Country Name is required').min(1, 'Country Name is Required'),
  stateMaster: Yup.string().required('State Name is Required'),
})

interface ICountry {
  loading: boolean
  countryData: ICountryModel[]
  mainSearch: string
  mainCountryID: number
}

const AddState: React.FC = () => {
  const [data, setData] = useState<IStateModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const updateData = (fieldsToUpdate: Partial<IStateModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const history = useHistory()
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<ICountry>({
    loading: false,
    countryData: [] as ICountryModel[],
    mainSearch: '',
    mainCountryID: 0,
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
        mainCountryID = lc.selDistrictID
      }
      getCountryDropDownData(mainSearch, mainCountryID)
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  function getCountryDropDownData(mainSearch: string, mainCountryID: number) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          const responseData = resp.responseObject
          setState({...state, countryData: responseData, mainSearch, mainCountryID})
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, countryData: [], loading: false})
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
        createState(values.countryID, values.stateMaster, isActive, user.employeeID, '192.168.0.1')
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/master/state/list',
                state: {search: state.mainSearch, countryID: state.mainCountryID},
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
      <div className='card mb-5 mb-xl-10'>
        {/* { <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          { <h3 className='fw-bolder m-0 ms-6'> Create State </h3> }
        </div>
      </div> } */}
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
                      checked={data.isActive}
                      className='form-check-input mt-3'
                      type='checkbox'
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

export {AddState}
