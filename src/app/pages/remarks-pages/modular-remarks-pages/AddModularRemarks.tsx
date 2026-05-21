import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Field, useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation} from 'react-router-dom'
import {addModularRemarkApi} from '../../../modules/remarks-master-pages/modular-remarks-master-page/ModularRemarksCRUD'
import {
  IModularRemarksModel,
  modularRemarksInitValue as initialValues,
} from '../../../models/remarks-page/IModularRemarksModel'

const profileDetailsSchema = Yup.object().shape({
  remarks: Yup.string().required('Remarks field is required'),
})

interface IDepartment {
  loading: boolean
  selTypeID: number
}

const AddModularRemarks: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IModularRemarksModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const [searchText, setSearchText] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IModularRemarksModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    loading: false,
    selTypeID: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      tmpModularRemarkSearch(mainSearch)
    }, 100)
  }, [])

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'typeID') {
      formik.setFieldValue('typeID', parseInt(value))
      setState({...state, selTypeID: parseInt(value)})
    }
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  function tmpModularRemarkSearch(mainSearch: string) {
    setLoading(false)
    setSearchText(mainSearch)
  }
  const formik = useFormik<IModularRemarksModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addModularRemarkApi(0, values.remarks,isActive
          //  user.employeeID,
          //  '192.168.0.1'
          )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname: '/remarks/modular-rmk/list', state: {search: searchText}})
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
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({pathname: '/remarks/modular-rmk/list', state: {search: searchText}})
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              {/* <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Project Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='typeID'
                  >
                    <option selected={state.selTypeID === 0 ? true : false} value={0}>
                      Select Type
                    </option>
                    {projectTypeData.length > 0 &&
                      projectTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.projectTypeID}
                            selected={state.selTypeID == data.projectTypeID ? true : false}
                          >
                            {data.projectTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.typeID && formik.errors.typeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.typeID}</div>
                    </div>
                  )}
                </div>
              </div> */}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Remarks:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Remarks...'
                    {...formik.getFieldProps('remarks')}
                  />
                  {formik.touched.remarks && formik.errors.remarks && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.remarks}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-3 fv-row'>
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
              <button
                onClick={() =>
                  history.push({pathname: '/remarks/modular-rmk/list', state: {search: searchText}})
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
export default AddModularRemarks
