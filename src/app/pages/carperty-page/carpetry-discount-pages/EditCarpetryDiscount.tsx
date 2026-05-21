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
  ICarpetryDiscountModel,
  carpetryDiscountInitValue as initialValues,
} from '../../../models/carpetry-page/ICarpetryDiscountModel'
import {
  getDiscountByDiscountId,
  updateDiscount,
} from '../../../modules/carpetry-master-page/carpetry-discount-master-page/CarpetryDiscountCRUD'
import {getBranchDropdownList} from '../../../modules/master-page/branch-master-page/BranchCRUD'
import {IBranchModel} from '../../../models/master-page/IBranchModel'

const profileDetailsSchema = Yup.object().shape({
  discountPercentage: Yup.string().required('Discount is required'),
})

interface IDiscount {
  loading: boolean
  branchData: IBranchModel[]
  selBranchID: number
  mainSearch: string
}

const EditCarpetryDiscount: React.FC = () => {
  const {discountId} = useParams<{discountId: string}>()
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<ICarpetryDiscountModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICarpetryDiscountModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IDiscount>({
    loading: false,
    branchData: [] as IBranchModel[],
    selBranchID: 0,
    mainSearch: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getBranchData(mainSearch)
    }, 100)
  }, [])

  // =====================Branch Api==========================
  function getBranchData(mainSearch: string) {
    getBranchDropdownList()
      .then((response) => {
        // let responseData = response.data.responseObject
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          getDiscountDataByDiscountId(responseData, mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, branchData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, branchData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getDiscountDataByDiscountId(branchData: IBranchModel[], mainSearch: string) {
    getDiscountByDiscountId(discountId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('discountPercentage', response.data.discountPercentage)
          formik.setFieldValue('branchID', response.data.branchID)
          setState({
            ...state,
            branchData: branchData,
            selBranchID: response.data.branchID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, branchData: [], loading: false})
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
    if (elementId === 'branchID') {
      formik.setFieldValue('branchID', parseInt(value))
      setState({...state, selBranchID: parseInt(value)})
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICarpetryDiscountModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          updateDiscount(parseInt(discountId), values.discountPercentage, values.branchID)
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/carpetry/discount/list',
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
            to={{pathname: '/carpetry/discount/list', state: {search: state.mainSearch}}}
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
              {' '}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6 mb-6'>
                  Branch:
                </label>
                <div className='col-lg-3 fv-row mb-6'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='branchID'
                  >
                    <option selected={state.selBranchID === 0 ? true : false} value={0}>
                      Select Branch
                    </option>
                    {state.branchData.length > 0 &&
                      state.branchData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.branchID}
                            selected={state.selBranchID === data.branchID ? true : false}
                          >
                            {data.branchName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.branchID && formik.errors.branchID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.branchID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Discount:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Discount'
                    {...formik.getFieldProps('discountPercentage')}
                  />
                  {formik.touched.discountPercentage && formik.errors.discountPercentage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.discountPercentage}</div>
                    </div>
                  )}
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
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
                to={{pathname: '/carpetry/discount/list', state: {search: state.mainSearch}}}
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

export {EditCarpetryDiscount}
