import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IExpenseModel,
  expenseInitValues as initialValues,
} from '../../../models/master-page/IExpenseTypeMode'
import {
  getExpenseTypeByExpenseTypeId,
  updateExpenseType,
} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
import {getExpenseHeadList} from '../../../modules/account-page/expense-header-page/ExpenseHeaderCRUD'
import {IExpenseHeadModel} from '../../../models/Accounts-page/expense-header/ExpenseHeaderModel'

const profileDetailsSchema = Yup.object().shape({
  expenseTypeName: Yup.string().required('Expense name is required'),
})

interface IExpenseType {
  expenseHeadData: IExpenseHeadModel[]
  loading: boolean
  SearchText: string
  selExpenseHeadID: number
}
const EditExpenseType: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IExpenseModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const {expenseid} = useParams<{expenseid: string}>()
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IExpenseModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IExpenseType>({
    expenseHeadData: [] as IExpenseHeadModel[],
    loading: false,
    SearchText: '',
    selExpenseHeadID: 0,
  })

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let SearchText: string = ''
      if (lc.mainSearch != undefined) {
        SearchText = lc.mainSearch
      }
      getExpenseTypeDataByExpenxeTypeID(SearchText)
    }, 100)
  }, [])

  function getExpenseTypeDataByExpenxeTypeID(SearchText: string) {
    getExpenseTypeByExpenseTypeId(parseInt(expenseid)).then((response) => {
      formik.setFieldValue('expenseTypeName', response.data.expenseTypeName)
      formik.setFieldValue('expenseHeadID', response.data.expenseHeadID)
      setIsActive(response.data.isActive)
      getExpenseHeaderData(SearchText, response.data.expenseHeadID)
    })
  }

  function getExpenseHeaderData(SearchText: string, temExpenseHeadID: number) {
    getExpenseHeadList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            expenseHeadData: responseData,
            SearchText: SearchText,
            selExpenseHeadID: temExpenseHeadID,
            loading: false,
          })
          setLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, expenseHeadData: [], loading: false})
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, expenseHeadData: [], loading: false})
        setLoading(false)
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'expenseHeadID') {
      formik.setFieldValue('expenseHeadID', parseInt(value))
      setState({...state, selExpenseHeadID: parseInt(value)})
    }
  }

  const formik = useFormik<IExpenseModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updateExpenseType(
          parseInt(expenseid),
          values.expenseHeadID,
          values.expenseTypeName,
          isActive,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/accounts/expenseType/list',
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
            to={{pathname: '/accounts/expenseType/list', state: {search: state.SearchText}}}
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
                  Expense Head:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='expenseHeadID'
                  >
                    <option selected={state.selExpenseHeadID === 0 ? true : false} value={0}>
                      Select Expense Head
                    </option>
                    {state.expenseHeadData.length > 0 &&
                      state.expenseHeadData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.expenseHeadID}
                            selected={data.expenseHeadID === state.selExpenseHeadID ? true : false}
                          >
                            {data.expenseHeadName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.expenseHeadID && formik.errors.expenseHeadID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.expenseHeadID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Expense Type:
                </label>

                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Expense Type'
                    {...formik.getFieldProps('expenseTypeName')}
                  />
                  {formik.touched.expenseTypeName && formik.errors.expenseTypeName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.expenseTypeName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
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
              </button>
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/accounts/expenseType/list', state: {search: state.SearchText}}}
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

export {EditExpenseType}
