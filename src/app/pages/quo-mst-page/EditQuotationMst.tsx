import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {Field, useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {
  IQuotationMstModel,
  quotationMstInitValues as initialValues,
} from '../../models/quo-mst/IQuotationMstModel'
import {
  getQuoMasterDataByQuoMasterID,
  updateQuoMasterApi,
} from '../../modules/quo-mst/NewQuotationMstCRUD'

const profileDetailsSchema = Yup.object().shape({
  quotationCategoryName: Yup.string().required('Quotation Name field is required'),
})

interface IQuoMst {
  loading: boolean
  selTypeID: number
  mainSearch: string
}

const EditQuotationMst: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IQuotationMstModel>(initialValues)
  // const [isActive, setIsActive] = useState(true)
  const {quoMstID} = useParams<{quoMstID: string}>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IQuotationMstModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IQuoMst>({
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
      quotationMstDataByQuoMstID(mainSearch)
    }, 100)
  }, [])

  function quotationMstDataByQuoMstID(mainSearch: string) {
    let value = {quotationCategoryID: quoMstID}
    var objQuoMst = btoa(JSON.stringify(value))
    getQuoMasterDataByQuoMasterID(`${objQuoMst}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          formik.setFieldValue(
            'quotationCategoryName',
            resp.responseObject[0].quotationCategoryName
          )
          formik.setFieldValue('quotationCategoryID', resp.responseObject[0].quotationCategoryID)
          setState({
            ...state,
            mainSearch,
            // selTypeID: resp.typeID,
            loading: false,
          })
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

  //   const selectChange = (event: any) => {
  //     const value = event.target.value
  //     const elementId = event.target.id
  //     if (elementId === 'typeID') {
  //       formik.setFieldValue('typeID', parseInt(value))
  //       setState({...state, selTypeID: parseInt(value)})
  //     }
  //   }

  const formik = useFormik<IQuotationMstModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const updatedValues = {
          ...values,
          quotationCategoryID: quoMstID,
          updateBy: user.employeeID,
          ipAddress: '192.168.0.1',
        } // assuming bhkId is defined somewhere
        console.log(updatedValues)
        var objQuoMaster = btoa(JSON.stringify(updatedValues))
        updateQuoMasterApi(`${objQuoMaster}`)
          .then((response) => {
            var decodeResp = JSON.parse(atob(response.data.encodedResponse))
            let resp = decodeResp
            if (resp.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/master/quotation-mst/list',
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
              pathname: '/master/quotation-mst/list',
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
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Quotation Category Name:</span>
                </label>
                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='quotation Category Name...'
                    {...formik.getFieldProps('quotationCategoryName')}
                  />
                  {formik.touched.quotationCategoryName && formik.errors.quotationCategoryName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.quotationCategoryName}</div>
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
              <button
                onClick={() =>
                  history.push({
                    pathname: '/master/quotation-mst/list',
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
export default EditQuotationMst
