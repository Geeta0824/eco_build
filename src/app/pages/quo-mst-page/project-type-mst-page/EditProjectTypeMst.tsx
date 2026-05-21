import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Field, useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {
  getProjectTypeMasterDataByProjectTypeID,
  getQuoMasterDataByQuoMasterID,
  updateProjectTypeMasterApi,
  updateQuoMasterApi,
} from '../../../modules/quo-mst/QuotationMstCRUD'
import {
  IProjectTypeodel,
  projectTypelInitValues as initialValues,
} from '../../../models/projects-page/IProjectsModel'
import {getAllQuotationLevel} from '../../../modules/master-page/quotation-level-page/QuotationLevelCRUD'
import {IQuotationLevelModel} from '../../../models/master-page/IQuotationLevelModel'

const profileDetailsSchema = Yup.object().shape({
  projectType: Yup.string().required('Quotation Name field is required'),
  quotationLevelID: Yup.number().required('Quotation Level Type is required'),
  // .min(1, 'Quotation Level Type is required'),
})

interface IQuoMst {
  quotationLevelData: IQuotationLevelModel[]
  loading: boolean
  selTypeID: number
  mainSearch: string
}

const EditProjectTypeMst: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IProjectTypeodel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const {projTypeMstID} = useParams<{projTypeMstID: string}>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IProjectTypeodel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IQuoMst>({
    quotationLevelData: [] as IQuotationLevelModel[],
    loading: false,
    selTypeID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      projecrTypeDataByprojTypeMstID(mainSearch)
    }, 100)
  }, [])

  function projecrTypeDataByprojTypeMstID(mainSearch: string) {
    getProjectTypeMasterDataByProjectTypeID(parseInt(projTypeMstID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('projectType', response.data.projectType)
          formik.setFieldValue('quotationLevelID', response.data.quotationLevelID)
          formik.setFieldValue('isActive', response.data.isActive)
          setIsActive(response.data.isActive)
          getQuotationLevelData(mainSearch, response.data.quotationLevelID)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  function getQuotationLevelData(mainSearch: string, quoLevelID: number) {
    getAllQuotationLevel()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            quotationLevelData: responseData,
            mainSearch: mainSearch,
            selTypeID: quoLevelID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, quotationLevelData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, quotationLevelData: [], loading: false})
      })
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'quotationLevelID') {
      formik.setFieldValue('quotationLevelID', parseInt(value))
      setState({...state, selTypeID: parseInt(value)})
    }
  }

  const formik = useFormik<IProjectTypeodel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updateProjectTypeMasterApi(
          parseInt(projTypeMstID),
          values.quotationLevelID,
          values.projectType,
          '',
          isActive,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/master/project-type-mst/list',
                state: {search: state.mainSearch},
              })
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
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/master/project-type-mst/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              {' '}
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Quotation Level :
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='quotationLevelID'
                  >
                    <option selected={state.selTypeID === 0 ? true : false} value={0}>
                      Select Level Type
                    </option>
                    {state.quotationLevelData.length > 0 &&
                      state.quotationLevelData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.quotationLevelID}
                            selected={state.selTypeID == data.quotationLevelID ? true : false}
                          >
                            {data.quotationLevelName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.quotationLevelID && formik.errors.quotationLevelID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.quotationLevelID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Quotation Category Name:</span>
                </label>
                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='quotation Category Name...'
                    {...formik.getFieldProps('projectType')}
                  />
                  {formik.touched.projectType && formik.errors.projectType && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectType}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>IsActive:</span>
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
                    pathname: '/master/project-type-mst/list',
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
export default EditProjectTypeMst
