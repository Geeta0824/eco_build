import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {createPMCWorkStageStructure} from '../../../modules/master-page/pmc-work-stage-master-page/PMCWorkStageCRUD'
import { IDesignerTicketCategoryModel, designerTicketCategoryInitValue as initialValues} from '../../../models/master-page/IDesignerTicketCategoryModel'
import { AddDesignerTicketCategoryAPI } from '../../../modules/master-page/designer-ticket-catgry-page/DesignerTicketCategoryCRUD'

const profileDetailsSchema = Yup.object().shape({
  sequenceNo: Yup.number().required('Sequence No. is required').min(1, 'Sequence No. is required'),
  // amtPercentage: Yup.number()
  //   .required('Payment Percentage is required')
  //   .min(1, 'Payment Percentage is required'),
  title: Yup.string().required('Title Feild is required'),
})

const AddDesignerTicketCategory: React.FC = () => {
  const [data, setData] = useState<IDesignerTicketCategoryModel>(initialValues)
  const [mainSearch, setMainSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IDesignerTicketCategoryModel>): void => {
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
      getPMCWorkStageStructureDataByID(mainSearch)
    }, 100)
  }, [])

  function getPMCWorkStageStructureDataByID(mainSearch: string) {
    setMainSearch(mainSearch)
    setLoading(false)
  }
  const formik = useFormik<IDesignerTicketCategoryModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        AddDesignerTicketCategoryAPI(
          values.title,
          values.sequenceNo,
          // values.amtPercentage,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/master/designer-ticket-catgry/list',
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
            to={{pathname: '/master/designer-ticket-catgry/list', state: {search: mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Title:</label>

              <div className='col-lg-10 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Enter Title'
                  {...formik.getFieldProps('title')}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.title}</div>
                  </div>
                )}
              </div>
            </div>
{/* 
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Payment:</label>
              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='payment percentage'
                  {...formik.getFieldProps('amtPercentage')}
                />
                {formik.touched.amtPercentage && formik.errors.amtPercentage && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.amtPercentage}</div>
                  </div>
                )}
              </div>
              <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
            </div> */}
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className='required'>Seq No:</span>
              </label>
              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Sequence No'
                  {...formik.getFieldProps('sequenceNo')}
                />
                {formik.touched.sequenceNo && formik.errors.sequenceNo && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.sequenceNo}</div>
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
              to={{pathname: '/master/designer-ticket-catgry/list', state: {search: mainSearch}}}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDesignerTicketCategory
