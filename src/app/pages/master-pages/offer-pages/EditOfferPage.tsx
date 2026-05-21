import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IOfferModel, offerInitValue as initialValues} from '../../../models/master-page/IOfferModel'
import {
  getOfferByOfferIDApi,
  updateOfferApi,
} from '../../../modules/master-page/offer-master-page/OfferCRUD'

const profileDetailsSchema = Yup.object().shape({
  offerTitle: Yup.string().required('Offer Title is required'),
})

interface IOffer {
  loading: boolean
  mainSearch: string
}
const EditOfferPage: React.FC = () => {
  const [data, setData] = useState<IOfferModel>(initialValues)
  const [loading, setLoading] = useState(false)
  const [isPriceEffect, setPriceEffect] = useState(false)
  const {offerID} = useParams<{offerID: string}>()
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IOfferModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IOffer>({
    loading: false,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getOfferByDataByID(mainSearch)
    }, 100)
  }, [])

  function getOfferByDataByID(mainSearch: string) {
    getOfferByOfferIDApi(parseInt(offerID)).then((response) => {
      formik.setFieldValue('offerTitle', response.data.offerTitle)
      formik.setFieldValue('offerDesc', response.data.offerDesc)
      formik.setFieldValue('offerPercentage', response.data.offerPercentage)
      setPriceEffect(response.data.isPriceEffect)
      setState({...state, mainSearch, loading: false})
    })
  }

  function checkedFunction(event: any) {
    setPriceEffect(event.target.checked)
  }

  const formik = useFormik<IOfferModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let temOfferPercentage: number = 0

        if (isPriceEffect === true) {
          temOfferPercentage = values.offerPercentage
        }

        updateOfferApi(
          parseInt(offerID),
          values.offerTitle,
          values.offerDesc,
          user.employeeID,
          '192.168.0.1',
          temOfferPercentage,
          isPriceEffect
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Updated Successfull')
              history.push({pathname: '/master/offer/list', state: {search: state.mainSearch}})
            } else {
              toast.error(`${response.data.message}`)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
          })
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
            to={{pathname: '/master/offer/list', state: {search: state.mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Offer Title:
                </label>

                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter offer Title'
                    {...formik.getFieldProps('offerTitle')}
                  />
                  {formik.touched.offerTitle && formik.errors.offerTitle && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.offerTitle}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Description:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Description...'
                    {...formik.getFieldProps('offerDesc')}
                  />
                  {formik.touched.offerDesc && formik.errors.offerDesc && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.offerDesc}</div>
                    </div>
                  )}
                </div>
              </div>{' '}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Is Price Effect:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      checked={isPriceEffect}
                      className='form-check-input mt-3'
                      type='checkbox'
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
                <label
                  className={
                    isPriceEffect === true ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  Effect Percentage:
                </label>
                <div className={isPriceEffect === true ? 'col-lg-2 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Effect Percentage '
                    {...formik.getFieldProps('offerPercentage')}
                  />
                  {formik.touched.offerPercentage && formik.errors.offerPercentage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.offerPercentage}</div>
                    </div>
                  )}
                </div>
                <span
                  className={
                    isPriceEffect === true
                      ? 'col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'
                      : 'd-none'
                  }
                >
                  %
                </span>
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
                to={{pathname: '/master/offer/list', state: {search: state.mainSearch}}}
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

export {EditOfferPage}
