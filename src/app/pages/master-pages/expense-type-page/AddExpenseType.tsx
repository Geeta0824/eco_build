import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IExpenseModel,
  expenseInitValues as initialValues,
} from '../../../models/master-page/IExpenseTypeMode'
import {addExpenseType} from '../../../modules/master-page/expense-type-page/ExpenseTypeCRUD'
import {IExpenseHeadModel} from '../../../models/Accounts-page/expense-header/ExpenseHeaderModel'
import {getExpenseHeadList} from '../../../modules/account-page/expense-header-page/ExpenseHeaderCRUD'

const profileDetailsSchema = Yup.object().shape({
  expenseTypeName: Yup.string().required('Expense name is required'),
  expenseHeadID: Yup.number()
    .required('Expense Head is required')
    .min(1, 'Expense Head is required'),
})

interface ICountry {
  loading: boolean
  expenseHeadData: IExpenseHeadModel[]
  selExpenseHeadID: number
  SearchText: string
}

const AddExpenseType: React.FC = () => {
  const [data, setData] = useState<IExpenseModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IExpenseModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ICountry>({
    loading: false,
    expenseHeadData: [] as IExpenseHeadModel[],
    selExpenseHeadID: 0,
    SearchText: '',
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  // const [mainSearch, setMainSearch] = useState('')
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let SearchText: string = ''
      if (lc.mainSearch != undefined) {
        SearchText = lc.mainSearch
      }
      getExpenseHeaderData(SearchText)
    }, 100)
  }, [])

  // function getExpenseTypeDataByExpenxeTypeID(SearchText: string) {
  //   getExpenseHeaderData(SearchText)
  // }

  function getExpenseHeaderData(SearchText: string) {
    getExpenseHeadList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            expenseHeadData: responseData,
            SearchText,
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

  const imageUpload = (e: any) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)

    fetch(process.env.REACT_APP_API_URL + '/Country/SaveCountryFlag', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFile(data)
      })
  }

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'expenseHeadID') {
      formik.setFieldValue('expenseHeadID', parseInt(value))
    }
  }

  const formik = useFormik<IExpenseModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addExpenseType(
          values.expenseTypeName,
          values.expenseHeadID,
          isActive,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/accounts/expenseType/list',
                state: {search:state.SearchText},
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
              pathname: '/accounts/expenseType/list',
              state: {search:state.SearchText },
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
              </button>{' '}
              <Link
                className='btn btn-danger ms-3'
                to={{
                  pathname: '/accounts/expenseType/list',
                  state: {search:state.SearchText},
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

export {AddExpenseType}
