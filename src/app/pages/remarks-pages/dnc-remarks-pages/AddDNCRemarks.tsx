import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation} from 'react-router-dom'
import {DNCRemarksDropdownApi} from '../../../modules/remarks-master-pages/dnc-remarks-master-page/DNCRemarksCRUD'
import {
  IDNCRemarksModel,
  IDNCTypeModel,
  dncRemarksInitValue as initialValues,
} from '../../../models/remarks-page/IDNCRemarksModel'
import {addDNCRemarksApi} from '../../../modules/remarks-master-pages/dnc-remarks-master-page/DNCRemarksCRUD'

const profileDetailsSchema = Yup.object().shape({
  remarks: Yup.string().required('Remarks is Required'),
  typeID: Yup.number()
    .test('is-valid-typeID', 'Dnc Type is required', (value) => value !== 0)
    .required('Dnc Type is required'),
})

interface IDepartment {
  DncTypeData: IDNCTypeModel[]
  loading: boolean
  seldncTypeID: number
  mainSearch: string
}

const AddDNCRemarks: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IDNCRemarksModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IDNCRemarksModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    DncTypeData: [] as IDNCTypeModel[],
    loading: false,
    seldncTypeID: 0,
    mainSearch: '',
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
      getDNCRemarksDropDown(mainSearch)
    }, 100)
  }, [])

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'typeID') {
      formik.setFieldValue('typeID', parseInt(value))
      setState({...state, seldncTypeID: parseInt(value)})
    }
  }
  function getDNCRemarksDropDown(mainSearch: string) {
    DNCRemarksDropdownApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            DncTypeData: responseData,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, DncTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, DncTypeData: [], loading: false})
      })
  }

  const formik = useFormik<IDNCRemarksModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addDNCRemarksApi(values.typeID, values.remarks, isActive, user.employeeID, '192.168.0.1')
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname: '/remarks/dnc-rmk/list', state: {search: state.mainSearch}})
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

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }
  return (
    <>
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({pathname: '/remarks/dnc-rmk/list', state: {search: state.mainSearch}})
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>DNC Type:</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='typeID'
                  >
                    <option selected={state.seldncTypeID === 0 ? true : false} value={0}>
                      Select Type
                    </option>
                    <option selected={state.seldncTypeID === -1 ? true : false} value={-1}>
                      All
                    </option>
                    {state.DncTypeData.length > 0 &&
                      state.DncTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.dncTypeID}
                            selected={state.seldncTypeID == data.dncTypeID ? true : false}
                          >
                            {data.dncTypeName}
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
              </div>
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
              </div>{' '}
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
                    pathname: '/remarks/dnc-rmk/list',
                    state: {search: state.mainSearch},
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
export default AddDNCRemarks
