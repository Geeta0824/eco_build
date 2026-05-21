import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  ICarpetAreaModel,
  carpetAreaInitValue as initialValues,
} from '../../../models/master-page/ICarpetAreaModel'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {
  getCarpetAreaByCarpetAreaId,
  updateCarpetArea,
} from '../../../modules/master-page/carpet-area-page/NewCarpetAreaCRUD'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  carpetArea: Yup.string().required('Field is required'),
})

interface INatio {
  loading: boolean
  mainSearch: string
}

const EditCarpetArea: React.FC = () => {
  const {carpetAreaId} = useParams<{carpetAreaId: string}>()
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<ICarpetAreaModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICarpetAreaModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<INatio>({
    loading: false,
    mainSearch: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      if (lc.searchText !== undefined) {
        mainSearch = lc.searchText
      }
      getCarpetAreaDataByCarpetAreaId(mainSearch)
    }, 100)
  }, [])

  function getCarpetAreaDataByCarpetAreaId(mainSearch: string) {
    let value = {carpetAreaID:carpetAreaId}
    var objCarpetArea = btoa(JSON.stringify(value))
    getCarpetAreaByCarpetAreaId(`${objCarpetArea}`)
      .then((response) => {
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          formik.setFieldValue('carpetAreaID', resp.carpetAreaID)
          formik.setFieldValue('carpetArea', resp.carpetArea)
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

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICarpetAreaModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          const updatedValues = {
            ...values,
            carpetAreaID: carpetAreaId,
            updateBy: user.employeeID,
            ipAddress: '192.168.0.1',
          } // assuming bhkId is defined somewhere
          console.log(updatedValues)
          var objCarpetArea = btoa(JSON.stringify(updatedValues))
          updateCarpetArea(`${objCarpetArea}`)
            .then((response) => {
              var decodeResp = JSON.parse(atob(response.data.encodedResponse))
              let resp = decodeResp
              if (resp.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/master/carpetArea/list',
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
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/carpetArea/list', state: {search: state.mainSearch}}}
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
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Carpet Area:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Carpet Area'
                    {...formik.getFieldProps('carpetArea')}
                  />
                  {formik.touched.carpetArea && formik.errors.carpetArea && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.carpetArea}</div>
                    </div>
                  )}
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
                to={{pathname: '/master/carpetArea/list', state: {search: state.mainSearch}}}
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

export {EditCarpetArea}
