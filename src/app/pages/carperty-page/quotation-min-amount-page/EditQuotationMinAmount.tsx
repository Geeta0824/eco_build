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
  getGetMinAmountByIDApi,
  updateCarpetryMinAmount,
} from '../../../modules/carpetry-master-page/quotation-min-amount-master-page/QuotationMinAmountCRUD'
import {
  IQuotationMinAmountModel,
  quotationMinAmountInitValue as initialValues,
} from '../../../models/carpetry-page/IQuotationMinAmountModel'

const profileDetailsSchema = Yup.object().shape({
  minimumAmount: Yup.number().required('Amount is required'),
})

interface INatio {
  loading: boolean
  mainSearch: string
}

const EditQuotationMinAmount: React.FC = () => {
  const {carpetentryQutationMinAmountID} = useParams<{carpetentryQutationMinAmountID: string}>()
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<IQuotationMinAmountModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IQuotationMinAmountModel>): void => {
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
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getDiscountDataByDiscountId(mainSearch)
    }, 100)
  }, [])

  function getDiscountDataByDiscountId(mainSearch: string) {
    getGetMinAmountByIDApi(parseInt(carpetentryQutationMinAmountID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('minimumAmount', response.data.minimumAmount)
          setState({...state, loading: false, mainSearch})
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

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IQuotationMinAmountModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          updateCarpetryMinAmount(parseInt(carpetentryQutationMinAmountID), values.minimumAmount)
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/carpetry/quotation-min-amt/list',
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
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Minimun Amount:
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='enter min amount'
                    {...formik.getFieldProps('minimumAmount')}
                  />
                  {formik.touched.minimumAmount && formik.errors.minimumAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.minimumAmount}</div>
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
              </button>
              <Link
                className='btn btn-danger ms-3'
                to={{
                  pathname: '/carpetry/quotation-min-amt/list',
                  state: {search: state.mainSearch},
                }}
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

export {EditQuotationMinAmount}
