import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IBHKMasterModel,
  bhkMasterInitValue as initialValues,
} from '../../../models/master-page/IBHKMasterModel'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {getBHKByBHKId, updateBHK} from '../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  bhkName: Yup.string().required('Name Field is required'),
})

interface IBHK {
  loading: boolean
  mainSearch: string
}

const EditBHKMaster: React.FC = () => {
  const {bhkId} = useParams<{bhkId: string}>()
  const [isActive, setIsActive] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<IBHKMasterModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IBHKMasterModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IBHK>({
    loading: false,
    mainSearch: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getBHKDataByBHKId(mainSearch)
    }, 100)
  }, [])

  function getBHKDataByBHKId(mainSearch: string) {
    var tmpbhkId = btoa(JSON.stringify({bhkId}))
    getBHKByBHKId(`${tmpbhkId}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          // let responseData = resp.responseObject
          formik.setFieldValue('bhkName', resp.bhkName)
          formik.setFieldValue('bhkid', resp.bhkid)
          setIsActive(resp.isActive)
          setState({...state, loading: false, mainSearch})
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

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IBHKMasterModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          const updatedValues = { ...values, bhkid: bhkId, updateBy:user.employeeID,ipAddress:'192.168.0.1', isActive: isActive } // assuming bhkId is defined somewhere
          // console.log(updatedValues)
          var objBhk = btoa(JSON.stringify(updatedValues))
          updateBHK(`${objBhk}`)
            .then((response) => {
              var decodeResp = JSON.parse(atob(response.data.encodedResponse))
              let resp = decodeResp
              if (resp.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/master/bhkMaster/list',
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
      <div className='text-end'>
        <Link
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          to={{pathname: '/master/bhkMaster/list', state: {search: state.mainSearch}}}
        >
          Back To List
        </Link>
      </div>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>BHK Name:</label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='BHK name'
                    {...formik.getFieldProps('bhkName')}
                  />
                  {formik.touched.bhkName && formik.errors.bhkName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bhkName}</div>
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
                to={{pathname: '/master/bhkMaster/list', state: {search: state.mainSearch}}}
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

export {EditBHKMaster}
