import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Field, useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {IAgencyTypeModel} from '../../../models/product-page/IAgencyTypeModel'
import {getAllAgencyType} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {
  IUpgradeItemModel,
  upgradeItemInitValue as initialValues,
} from '../../../models/product-page/IUpgradeItemModel'
import {
  UpdateUpgradeItem,
  getUpgradeItemByUpgradeID,
} from '../../../modules/product-master-page/upgrade-item-master-page/UpradeItemCRUD'

const profileDetailsSchema = Yup.object().shape({
  agencyTypeID: Yup.number().min(1, 'field is required').required('field is required'),
  upGradeItemName: Yup.string().required('UpGradeItem name is required'),
})

interface IUpgrade {
  loading: boolean
  upgradeItemData: IUpgradeItemModel[]
  agencyTypeData: IAgencyTypeModel[]
  selAgencyTypeID: number
  mainSearch: string
}

const EditUpgradeItem: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IUpgradeItemModel>(initialValues)

  const {upGradeItemID} = useParams<{upGradeItemID: string}>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IUpgradeItemModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IUpgrade>({
    loading: false,
    upgradeItemData: [] as IUpgradeItemModel[],
    agencyTypeData: [] as IAgencyTypeModel[],
    selAgencyTypeID: 0,
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
      getagencyTypeData(mainSearch)
    }, 100)
  }, [])
  function getagencyTypeData(mainSearch: string) {
    getAllAgencyType()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getUpgradeItemByID(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyTypeData: [], loading: false})
      })
  }

  function getUpgradeItemByID(agencyTypeData: IAgencyTypeModel[], mainSearch: string) {
    getUpgradeItemByUpgradeID(parseInt(upGradeItemID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('agencyTypeID', response.data.agencyTypeID)
          formik.setFieldValue('upGradeItemName', response.data.upGradeItemName)
          formik.setFieldValue('upGradePercentage', response.data.upGradePercentage)

          setState({
            ...state,
            selAgencyTypeID: response.data.agencyTypeID,
            agencyTypeData: agencyTypeData,
            mainSearch,
            loading: false,
          })
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

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'agencyTypeID') {
      formik.setFieldValue('agencyTypeID', parseInt(value))
      setState({...state, selAgencyTypeID: parseInt(value)})
    }
  }

  const formik = useFormik<IUpgradeItemModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        UpdateUpgradeItem(
          parseInt(upGradeItemID),
          values.agencyTypeID,
          values.upGradeItemName,
          values.upGradePercentage,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/p-product/upgrade-item/list',
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
     
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/p-product/upgrade-item/list',
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
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Agency Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='agencyTypeID'
                  >
                    <option selected={state.selAgencyTypeID === 0 ? true : false} value={0}>
                      Select Agency Type
                    </option>
                    {state.agencyTypeData.length > 0 &&
                      state.agencyTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.agencyTypeID}
                            selected={state.selAgencyTypeID == data.agencyTypeID ? true : false}
                          >
                            {data.agencyTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.agencyTypeID && formik.errors.agencyTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.agencyTypeID}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>UpGrade Item Name:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='UpGrade Item Name...'
                    {...formik.getFieldProps('upGradeItemName')}
                  />
                  {formik.touched.upGradeItemName && formik.errors.upGradeItemName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.upGradeItemName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>UpGrade (%):</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder=' UpGrade '
                    {...formik.getFieldProps('upGradePercentage')}
                  />
                  {formik.touched.upGradePercentage && formik.errors.upGradePercentage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.upGradePercentage}</div>
                    </div>
                  )}
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
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
                    pathname: '/p-product/upgrade-item/list',
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
export default EditUpgradeItem
