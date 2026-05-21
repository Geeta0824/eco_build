import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

import {addExpenseType} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
import {IExpenseHeadModel} from '../../../models/Accounts-page/expense-header/ExpenseHeaderModel'
import {getExpenseHeadList} from '../../../modules/account-page/expense-header-page/ExpenseHeaderCRUD'
import {
  IMeetingTypeModel,
  meetingTypeInitValues as initialValues,
} from '../../../models/master-page/IMeetingTypeModel'
import {AddMeetingTypeApi} from '../../../modules/master-page/meeting-type-page/MeetingTypeCRUD'

const profileDetailsSchema = Yup.object().shape({
  meetingTypeName: Yup.string().required('meeting Type  name is required'),
})

interface ICountry {
  loading: boolean
  meetingTypeData: IMeetingTypeModel[]
  selExpenseHeadID: number
  SearchText: string
}

const AddMeetingType: React.FC = () => {
  const [data, setData] = useState<IMeetingTypeModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IMeetingTypeModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ICountry>({
    loading: false,
    meetingTypeData: [] as IMeetingTypeModel[],
    selExpenseHeadID: 0,
    SearchText: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const formik = useFormik<IMeetingTypeModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        AddMeetingTypeApi(values.meetingTypeName)
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/master/meeting-type/list',
                state: {search: state.SearchText},
              })
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
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{
              pathname: '/master/meeting-type/list',
              state: {search: state.SearchText},
            }}
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
                  Meeting Type:
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Meeting Type'
                    {...formik.getFieldProps('meetingTypeName')}
                  />
                  {formik.touched.meetingTypeName && formik.errors.meetingTypeName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.meetingTypeName}</div>
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
                to={{
                  pathname: '/master/meeting-type/list',
                  state: {search: state.SearchText},
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

export {AddMeetingType}
