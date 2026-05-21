import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {ITalukaModel} from '../../../models/master-page/ITalukaModel'
import {ICountryModel} from '../../../models/master-page/ICountryModel'
import {getDropDownCountryList} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import {getStateByCountryId} from '../../../modules/master-page/state-master-page/StateCRUD'
import {getTalukaByDistrictID} from '../../../modules/master-page/taluka-master-page/TalukaCRUD'
import {IDistrictModel, IStateWebModel} from '../../../models/master-page/IDistrictModel'
import {getCityByStateId} from '../../../modules/master-page/district-master-page/DistrictCRUD'
import {
  branchInitValues as initialValues,
  IBranchModel,
} from '../../../models/master-page/IBranchModel'
import {addBranch} from '../../../modules/master-page/branch-master-page/BranchCRUD'
import {IDesignationModel} from '../../../models/master-page/IDesignationModel'
import {getAllDesignation} from '../../../modules/master-page/designation-master-page/DesignationCRUD'

const profileDetailsSchema = Yup.object().shape({
  branchName: Yup.string().required('Branch is required'),
  branchCode: Yup.string().required('Branch Code is required'),
  countryID: Yup.number().required('Country is required').min(1, 'Country is Required'),
  stateID: Yup.number().required('State is required').min(1, 'State is required'),
  districtID: Yup.number().required('District is required').min(1, 'District is Required'),
  talukaID: Yup.number().required('Taluka is required').min(1, 'Taluka is Required'),

  pincode: Yup.string().required('Pincode is required'),
  contactPerson: Yup.string().required('Contact Person is required'),
  mobileNumber: Yup.string().required('Mobile is required'),
  // phoneNumber: Yup.string().required('PhoneNumber is required'),
  // faxNumber: Yup.string().required('faxNumber is required'),
  email: Yup.string().required('Email is required'),
  address1: Yup.string().required('Address1 is required'),
  address2: Yup.string().required('Address2 is required'),
})

interface IBranch {
  loading: boolean
  countryData: ICountryModel[]
  stateData: IStateWebModel[]
  districtData: IDistrictModel[]
  talukaData: ITalukaModel[]
  designationData: IDesignationModel[]
  mainSearch: string
}

const AddBranch: React.FC = () => {
  const [data, setData] = useState<IBranchModel>(initialValues)
  const [isActive, setIsActive] = useState(false)

  const updateData = (fieldsToUpdate: Partial<IBranchModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()
  const location = useLocation()

  const [state, setState] = useState<IBranch>({
    loading: false,
    countryData: [] as ICountryModel[],
    stateData: [] as IStateWebModel[],
    districtData: [] as IDistrictModel[],
    talukaData: [] as ITalukaModel[],
    designationData: [] as IDesignationModel[],
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getAllCountryData(mainSearch)
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  function getAllCountryData(mainSearch: string) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          const responseData = resp.responseObject
          getDesignationData(responseData, mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({
            ...state,
            countryData: [],
            loading: false,
          })
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

  function getDesignationData(resCountryData: ICountryModel[], SearchText: string) {
    getAllDesignation()
      .then((response) => {
        const responseData = response.data.responseObject
        // let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        // let resp = decodeResp
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            countryData: resCountryData,
            designationData: responseData,
            mainSearch: SearchText,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            countryData: [],
            designationData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        setState({...state, countryData: [], designationData: [], loading: false})
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

  function getTalukaData(districtid: number) {
    state.talukaData = []
    getTalukaByDistrictID(districtid)
      .then((response) => {
        let responseData = response.data.responseObject
        setState({...state, talukaData: responseData, loading: false})
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, talukaData: [], loading: false})
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
      getTalukaData(parseInt(value))
    } else if (elementId === 'talukaID') {
      formik.setFieldValue('talukaID', parseInt(value))
    } else if (elementId === 'cotactDesignation') {
      formik.setFieldValue('cotactDesignation', parseInt(value))
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IBranchModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const createdValues = {
          ...values,
          createBy: user.employeeID,
          ipAddress: '192.168.0.1',
          isActive: isActive,
        } // assuming bhkId is defined somewhere
        console.log(createdValues)
        var objBranch = btoa(JSON.stringify(createdValues))

        //   branchID: number,
        //   branchName: string,
        //   branchCode: string,
        //   contactPerson: string,
        //   cotactDesignation: number,
        //   mobileNumber: string,
        //   phoneNumber: string,
        //   faxNumber: string,
        //   email: string,
        //   address1: string,
        //   address2: string,
        //   countryID: number,
        //   stateID: number,
        //   districtID: number,
        //   talukaID: number,
        //   pincode: string,
        //   cityName: string,
        //   isActive: boolean,
        //   createBy: number,
        //   ipAddress: string
        addBranch(`${objBranch}`)
          .then((response) => {
            var decodeResp = JSON.parse(atob(response.data.encodedResponse))
            let resp = decodeResp
            if (resp.isSuccess === true) {
              toast.success('Created Successfull!')
              history.push({pathname: '/master/branch/list', state: {search: state.mainSearch}})
            } else {
              toast.error(`${resp.message}`)
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
        <Link
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          to={{pathname: '/master/branch/list', state: {search: state.mainSearch}}}
        >
          Back To List
        </Link>
      </div>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Branch Name:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Branch Name '
                    {...formik.getFieldProps('branchName')}
                  />
                  {formik.touched.branchName && formik.errors.branchName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.branchName}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Branch Code:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Branch Code '
                    {...formik.getFieldProps('branchCode')}
                  />
                  {formik.touched.branchCode && formik.errors.branchCode && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.branchCode}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Contact Person:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Contact Person '
                    {...formik.getFieldProps('contactPerson')}
                  />
                  {formik.touched.contactPerson && formik.errors.contactPerson && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.contactPerson}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Contact Number:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Contact Number '
                    {...formik.getFieldProps('mobileNumber')}
                  />
                  {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.mobileNumber}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Phone Number:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Phone Number '
                    {...formik.getFieldProps('phoneNumber')}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.phoneNumber}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Email:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Email'
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.email}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Fax Number:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Fax Number '
                    {...formik.getFieldProps('faxNumber')}
                  />
                  {formik.touched.faxNumber && formik.errors.faxNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.faxNumber}</div>
                    </div>
                  )}
                </div>
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
                 </div> 
              
              <div className='row mb-6'>
              
              {/* </div> */}
              {/* <div className='row mb-6'> */}
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
                {/* </div>
               
              <div className='row mb-6'>  */}
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
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Taluka Name:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
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
                          <option key={index} value={data.talukaID}>
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
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Pincode:</span>
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Pincode '
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
                  <span className=''>City Name:</span>
                </label>

                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter City Name '
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
                  <span className='required'>Address Line 1:</span>
                </label>

                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Address Line 1'
                    {...formik.getFieldProps('address1')}
                  />
                  {formik.touched.address1 && formik.errors.address1 && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.address1}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Address Line 2:</span>
                </label>

                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Address Line 2'
                    {...formik.getFieldProps('address2')}
                  />
                  {formik.touched.address2 && formik.errors.address2 && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.address2}</div>
                    </div>
                  )}
                </div>
                </div>
              {/* ============================ */}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Google Map Link:</span>
                </label>
                <div className='col-lg-1 d-flex align-items-center'>
                  <div className='symbol symbol-30px me-5'>
                    <img
                      src='/media/img/pointer.png'
                      alt=''
                      className='text-dark'
                      height={8} // Adjusted height
                      width={8} // Adjusted width
                      style={{borderRadius: '50%'}}
                    />
                  </div>
                </div>
                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Google Map URL'
                    {...formik.getFieldProps('googleMapPath')}
                  />
                  {formik.touched.googleMapPath && formik.errors.googleMapPath && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.googleMapPath}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>FaceBook Link :</label>
                <div className='col-lg-1 d-flex align-items-center'>
                  <div className='symbol symbol-30px me-5'>
                    <img
                      src='/media/img/fb.png'
                      alt='Facebook Icon'
                      className='text-dark'
                      height={8} // Adjusted height for proportional size
                      width={8} // Adjusted width for proportional size
                      style={{borderRadius: '25%'}} // Updated to make it circular
                    />
                  </div>
                </div>
                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Facebook URL'
                    {...formik.getFieldProps('facebookPath')}
                  />
                  {formik.touched.facebookPath && formik.errors.facebookPath && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.facebookPath}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Instagram Link :</label>
                <div className='col-lg-1 d-flex align-items-center'>
                  <div className='symbol symbol-30px me-5'>
                    <img
                      src='/media/img/insta.jpg'
                      alt='Instagram Icon'
                      className='text-dark'
                      height={8} // Adjusted height for proportional size
                      width={8} // Adjusted width for proportional size
                      style={{borderRadius: '25%'}} // Updated to make it circular
                    />
                  </div>
                </div>
                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Instagram URL'
                    {...formik.getFieldProps('instagramPath')}
                  />
                  {formik.touched.instagramPath && formik.errors.instagramPath && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.instagramPath}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Kazulencia Minimum Amount:</label>
               
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Kazulencia Minimum Amount'
                    {...formik.getFieldProps('kazulenciaMinAmt')}
                  />
                  {formik.touched.kazulenciaMinAmt && formik.errors.kazulenciaMinAmt && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.kazulenciaMinAmt}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-10 fv-row'>
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
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/master/branch/list', state: {search: state.mainSearch}}}
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

export {AddBranch}
