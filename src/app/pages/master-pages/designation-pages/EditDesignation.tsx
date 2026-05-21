import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IDepartmentModel} from '../../../models/master-page/IDepartmentModel'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {
  IDesignationModel,
  designationInitValues as initialValues,
} from '../../../models/master-page/IDesignationModel'
import {getAllDepartmentData} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import {
  getDesignation,
  updateDesignation,
} from '../../../modules/master-page/designation-master-page/NewDesignationCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  designationName: Yup.string().required('Designation Name is required'),
  // departmentID: Yup.number().required('Department is required').min(1, 'Department is required'),
})

interface IDepartment {
  loading: boolean
  departmentData: IDepartmentModel[]
  selDepartmentId: number
  mainSearch: string
}

const EditDesignation: React.FC = () => {
  const [data, setData] = useState<IDesignationModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const {degignaId} = useParams<{degignaId: string}>()
  const updateData = (fieldsToUpdate: Partial<IDesignationModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IDepartment>({
    loading: false,
    departmentData: [] as IDepartmentModel[],
    selDepartmentId: 0,
    mainSearch: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.searchText !== undefined) {
        mainSearch = lc.searchText
      }
      getDesignationData(mainSearch)
    }, 100)
  }, [])

  function getDepartmentData(dId: number, mainSearch: string) {
    getAllDepartmentData()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        let responseData = resp.responseObject
        setState({
          ...state,
          departmentData: responseData,
          selDepartmentId: dId,
          mainSearch,
          loading: false,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, departmentData: [], selDepartmentId: 0, loading: false})
      })
  }

  function getDesignationData(mainSearch: string) {
    let value = {designationID: degignaId}
    var objDegigna = btoa(JSON.stringify(value))
    getDesignation(`${objDegigna}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let dId: number = resp.departmentID
        formik.setFieldValue('designationName', resp.designationName)
        formik.setFieldValue('departmentID', resp.departmentID)
        setIsActive(resp.isActive)
        getDepartmentData(dId, mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'departmentID') {
      formik.setFieldValue('departmentID', parseInt(value))
    }
  }

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IDesignationModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are you sure you want to update selected record')
        if (edit) {
          const updatedValues = {
            ...values,
            designationID: degignaId,
            isActive: isActive,
            updateBy: user.employeeID,
            ipAddress: '192.168.0.1'
          } // assuming bhkId is defined somewhere
          // console.log(updatedValues)
          var objDesignation = btoa(JSON.stringify(updatedValues))
          updateDesignation(`${objDesignation}`)
            .then((response) => {
              var decodeResp = JSON.parse(atob(response.data.encodedResponse))
              let resp = decodeResp
              if (resp.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/master/designation/list',
                  state: {search: state.mainSearch},
                })
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
      {' '}
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/designation/list', state: {search: state.mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              {/* <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Department Name:
                </label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='departmentID'
                  >
                    <option selected value='0'>
                      Select Department
                    </option>
                    {state.departmentData.length > 0 &&
                      state.departmentData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.departmentID}
                            selected={data.departmentID === state.selDepartmentId ? true : false}
                          >
                            {data.departmentName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.departmentID && formik.errors.departmentID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.departmentID}</div>
                    </div>
                  )}
                </div>
              </div> */}

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Designation Name:
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='designation name'
                    {...formik.getFieldProps('designationName')}
                  />
                  {formik.touched.designationName && formik.errors.designationName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.designationName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-2'
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
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/master/designation/list', state: {search: state.mainSearch}}}
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

export {EditDesignation}
