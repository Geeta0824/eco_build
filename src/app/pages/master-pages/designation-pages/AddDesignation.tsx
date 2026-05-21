import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IDesignationModel,
  designationInitValues as initialValues,
} from '../../../models/master-page/IDesignationModel'
import {IDepartmentModel} from '../../../models/master-page/IDepartmentModel'
import {getAllDepartmentData} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import {createDesignation} from '../../../modules/master-page/designation-master-page/NewDesignationCRUD'
import {Link, useHistory, useLocation} from 'react-router-dom'

const profileDetailsSchema = Yup.object().shape({
  designationName: Yup.string().required('Designation Name is required'),
  // departmentID: Yup.number().required('Department is required').min(1, 'Department is required'),
})

interface IDepartment {
  loading: boolean
  departmentData: IDepartmentModel[]
  mainSearch: string
}

const AddDesignation: React.FC = () => {
  const [data, setData] = useState<IDesignationModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IDesignationModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    loading: false,
    departmentData: [] as IDepartmentModel[],
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
      getDepartmentData(mainSearch)
    }, 100)
  }, [])

  const selectChange = (event: any) => {
    const value = event.target.value

    const elementId = event.target.id
    if (elementId === 'departmentID') {
      formik.setFieldValue('departmentID', parseInt(value))
    }
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  function getDepartmentData(mainSearch: string) {
    // getAllDepartmentData()
    //   .then((response) => {
    //     let responseData = response.data.responseObject
    //     if (response.data.isSuccess == true) {
    //       setState({...state, departmentData: responseData, loading: false})
    //     } else {
    //       toast.error(`${response.data.message}`)
    setState({...state, departmentData: [], loading: false, mainSearch})
    //   }
    // })
    // .catch((error) => {
    //   toast.error(`${error}`)
    //   setState({...state, departmentData: [], loading: false})
    // })
  }

  const formik = useFormik<IDesignationModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const createdValues = {
          ...values,
          isActive: isActive,
          createBy: user.employeeID,
          ipAddress: '192.168.0.1',
        } // assuming bhkId is defined somewhere
        var objDesignation = btoa(JSON.stringify(createdValues))
        createDesignation(`${objDesignation}`
        )
          .then((response) => {
            var decodeResp = JSON.parse(atob(response.data.encodedResponse))
            let resp = decodeResp
            if (resp.isSuccess == true) {
              toast.success('Created Successfull')
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
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{pathname: '/master/designation/list', state: {search: state.mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
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
                        <option key={index} value={data.departmentID}>
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
                      checked={isActive}
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

export {AddDesignation}
