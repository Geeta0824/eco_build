import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'
import {
  IComplainExpireModel,
  complainExpireInitValue as initialValues,
} from '../../../models/master-page/IComplainExpireModel'
import {getQuotationCateogryDropDownAPI} from '../../../modules/master-page/pdf-photo-master-page/PDFPhotoCRUD'
import {IQuotationCateogryDropDownModel} from '../../../models/master-page/IPDFPhotoMstModel'
import {
  GetComplainExpireByComplainExpireIDAPI,
  UpdateComplainExpireDetailsAPI,
} from '../../../modules/master-page/complain-expire-page/NewComplainExpireCRUD'

const profileDetailsSchema = Yup.object().shape({
  categoryID: Yup.string().required('Category Type is required'),
})

interface INatio {
  loading: boolean
  projectTypeData: IQuotationCateogryDropDownModel[]
  selQuotationCategoryID: number
  mainSearch: string
}

const EditComplainExpire: React.FC = () => {
  const {complainExpireID} = useParams<{complainExpireID: string}>()
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<IComplainExpireModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IComplainExpireModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<INatio>({
    loading: false,
    projectTypeData: [] as IQuotationCateogryDropDownModel[],
    selQuotationCategoryID: 0,
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
      geQuotationCateogryDropDownData(mainSearch)
    }, 100)
  }, [])

  // =====================Branch Api==========================
  function geQuotationCateogryDropDownData(mainSearch: string) {
    getQuotationCateogryDropDownAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getComplainExpDataByComplainExpId(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectTypeData: [], loading: false})
      })
  }

  function getComplainExpDataByComplainExpId(
    projectTypeData: IQuotationCateogryDropDownModel[],
    mainSearch: string
  ) {
    let value = {complainExpireID: complainExpireID}
    var objComplainExpire = btoa(JSON.stringify(value))
    GetComplainExpireByComplainExpireIDAPI(`${objComplainExpire}`)
      .then((response) => {
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          formik.setFieldValue('complainExpireID', resp.complainExpireID)
          formik.setFieldValue('maintenanceDays', resp.maintenanceDays)
          formik.setFieldValue('categoryID', resp.categoryID)
          setState({
            ...state,
            projectTypeData: projectTypeData,
            selQuotationCategoryID: resp.categoryID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${resp.message}`)
          setState({...state, projectTypeData: [], selQuotationCategoryID: 0, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectTypeData: [], selQuotationCategoryID: 0, loading: false})
      })
  }

  //   ----------- Select Change Func ------------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'categoryID') {
      formik.setFieldValue('categoryID', parseInt(value))
    }
  }

  // ------------- Handle Change -----------------
  function handleMaintenance(event: any) {
    const tmpvalue = event.target.value
    const tmpID = event.target.id
    //  console.log(tmpvalue)
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpvalue)) && re.test(tmpvalue)) {
      formik.setFieldValue(tmpID, parseInt(tmpvalue))
    } else {
      formik.setFieldValue(tmpID, '')
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IComplainExpireModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          const updatedValues = {
            ...values,
            complainExpireID: complainExpireID,
            updateBy: user.employeeID,
            ipAddress: '192.168.0.1',
          } // assuming bhkId is defined somewhere
          console.log(updatedValues)
          var objComplainExpire = btoa(JSON.stringify(updatedValues))
          UpdateComplainExpireDetailsAPI(`${objComplainExpire}`)
            .then((response) => {
              var decodeResp = JSON.parse(atob(response.data.encodedResponse))
              let resp = decodeResp
              if (resp.isSuccess === true) {
                toast.success('Create Successfull')
                history.push({
                  pathname: '/master/expire-complaint/list',
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{pathname: '/master/expire-complaint/list', state: {search: state.mainSearch}}}
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
                <label className='col-lg-3 col-form-label required fw-bold fs-6 mb-6'>
                  Project Category Type:
                </label>
                <div className='col-lg-5 fv-row mb-6'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='categoryID'
                  >
                    <option selected={state.selQuotationCategoryID === 0 ? true : false} value={0}>
                      Select Project Category
                    </option>
                    {state.projectTypeData.length > 0 &&
                      state.projectTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.quotationCategoryID}
                            selected={
                              state.selQuotationCategoryID === data.quotationCategoryID
                                ? true
                                : false
                            }
                          >
                            {data.quotationCategoryName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.categoryID && formik.errors.categoryID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.categoryID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Maintenance Day:
                </label>
                <div className='col-lg-5 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='0'
                    {...formik.getFieldProps('maintenanceDays')}
                    id='maintenanceDays'
                    onChange={handleMaintenance}
                  />
                  {formik.touched.maintenanceDays && formik.errors.maintenanceDays && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.maintenanceDays}</div>
                    </div>
                  )}
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-4'>Day</span>
              </div>
            </div>
            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary me-2' disabled={loading}>
                {!loading && 'Save'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link
                className='btn btn-danger'
                to={{pathname: '/master/expire-complaint/list', state: {search: state.mainSearch}}}
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

export {EditComplainExpire}
