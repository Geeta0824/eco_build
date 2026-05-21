import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IExpenseHeadModel,
  expenseHeadInitValues as initialValues,
} from '../../../models/Accounts-page/expense-header/ExpenseHeaderModel'
import {
  getExpenseHeadByExpenseHeadId,
  updateExpenseHead,
} from '../../../modules/account-page/expense-header-page/ExpenseHeaderCRUD'

const profileDetailsSchema = Yup.object().shape({
  expenseHeadName: Yup.string().required('Expense name is required'),
})

interface IExpenseType {
  loading: boolean
  SearchText: string
}
const EditExpenseHeader: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IExpenseHeadModel>(initialValues)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const {expenseid} = useParams<{expenseid: string}>()
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IExpenseHeadModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IExpenseType>({
    loading: false,
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let SearchText: string = ''
      if (lc.mainSearch != undefined) {
        SearchText = lc.mainSearch
      }
      getExpenseHeaderDataByExpenxeHeadID(SearchText)
    }, 100)
  }, [])

  function getExpenseHeaderDataByExpenxeHeadID(SearchText: string) {
    getExpenseHeadByExpenseHeadId(parseInt(expenseid)).then((response) => {
      formik.setFieldValue('expenseHeadName', response.data.expenseHeadName)
      setState({...state, loading: false, SearchText})
    })
  }

  const formik = useFormik<IExpenseHeadModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updateExpenseHead(
          parseInt(expenseid),
          values.expenseHeadName,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/accounts/expense-head/list',
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
      {' '}
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{pathname: '/accounts/expense-head/list', state: {search: state.SearchText}}}
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
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Expense Header Name:
                </label>

                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Expense Header'
                    {...formik.getFieldProps('expenseHeadName')}
                  />
                  {formik.touched.expenseHeadName && formik.errors.expenseHeadName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.expenseHeadName}</div>
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
                to={{pathname: '/accounts/expense-head/list', state: {search: state.SearchText}}}
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

export {EditExpenseHeader}
