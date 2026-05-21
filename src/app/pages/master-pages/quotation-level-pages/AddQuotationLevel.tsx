import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IQuotationLevelModel,
  quotationLevelInitValue as initialValues,
} from '../../../models/master-page/IQuotationLevelModel'
import {addQuotationLevelAPI} from '../../../modules/master-page/quotation-level-page/QuotationLevelCRUD'

const profileDetailsSchema = Yup.object().shape({
  quotationLevelName: Yup.string().required('Quotation Level Name is required'),
})

const AddQuotationLevel: React.FC = () => {
  const [data, setData] = useState<IQuotationLevelModel>(initialValues)
  const [mainSearch, setMainSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IQuotationLevelModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      getQuotationLevelDataByID(mainSearch)
    }, 100)
  }, [])

  function getQuotationLevelDataByID(mainSearch: string) {
    setMainSearch(mainSearch)
    setLoading(false)
  }
  const formik = useFormik<IQuotationLevelModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addQuotationLevelAPI(values.quotationLevelName)
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/master/quotation-level/list',
                state: {search: mainSearch},
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
    <div className='card mb-5 mb-xl-10'>
      {' '}
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/quotation-level/list', state: {search: mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                Quotation Level Name:
              </label>

              <div className='col-lg-10 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Enter Level Name'
                  {...formik.getFieldProps('quotationLevelName')}
                />
                {formik.touched.quotationLevelName && formik.errors.quotationLevelName && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.quotationLevelName}</div>
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
              to={{pathname: '/master/quotation-level/list', state: {search: mainSearch}}}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddQuotationLevel
