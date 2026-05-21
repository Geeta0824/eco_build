import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {ITerminalTypeWebModel} from '../../../../models/master-page/ITerminalTypeModel'
import {
  ICustomerTerminalModel,
  customerTerminalInitValues as initialValues,
} from '../../../../models/organization-page/customer/ICustomerTerminalModel'
import {
  UpdateCustomerTerminalDetails,
  customerTerminalApi,
} from '../../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {getTerminalTypeDropdownList} from '../../../../modules/master-page/terminal-type-page/TerminalTypeCRUD'

const profileDetailsSchema = Yup.object().shape({})

interface ICustomerAddress {
  loading: boolean
  newCustomerID: number
  terminalTypeData: ITerminalTypeWebModel[]
  selTerminalTypeID: number
}

const CustomerTerminalPage: React.FC = () => {
  const history = useHistory()
  const {customerID} = useParams<{customerID: string}>()
  const [data, setData] = useState<ICustomerTerminalModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ICustomerTerminalModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ICustomerAddress>({
    loading: false,
    newCustomerID: 0,
    terminalTypeData: [] as ITerminalTypeWebModel[],
    selTerminalTypeID: 0,
  })

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getTerminalTypeData()
    }, 100)
  }, [])

  // =====================Drop Down Selection Function==========================
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'terminalTypeID') {
      formik.setFieldValue('terminalTypeID', parseInt(value))
      setState({...state, selTerminalTypeID: parseInt(value)})
    }
  }

  // =====================Terminal Type Api==========================
  function getTerminalTypeData() {
    getTerminalTypeDropdownList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getCustomerDataByCustomerID(responseData)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, terminalTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, terminalTypeData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // =====================Address By Customer ID Api==========================
  function getCustomerDataByCustomerID(terminalTypeData: ITerminalTypeWebModel[]) {
    customerTerminalApi(parseInt(customerID))
      .then((response) => {
        let responseData = response.data
        if (response.data.isSuccess === true) {
          // formik.setFieldValue('customerID', responseData.customerID)
          formik.setFieldValue('terminalTypeID', responseData.terminalTypeID)
          formik.setFieldValue('terminalCode', responseData.terminalCode)
          formik.setFieldValue('terminalTypeName', responseData.terminalTypeName)
          setState({
            ...state,
            newCustomerID: parseInt(customerID),
            terminalTypeData: terminalTypeData,
            selTerminalTypeID: responseData.terminalTypeID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // =====================Update Customer Adress Api==========================
  const [loading, setLoading] = useState(false)
  const formik = useFormik<ICustomerTerminalModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record ?')
        if (Edit) {
          if (state.newCustomerID !== 0) {
            UpdateCustomerTerminalDetails(
              state.newCustomerID,
              values.terminalTypeID,
              values.terminalCode,
              user.employeeID,
              '192.168.1.2'
            )
              .then((response) => {
                if (response.data.isSuccess === true) {
                  toast.success('Update Successfull!')
                  setLoading(false)
                } else {
                  toast.error(`${response.data.message}`)
                  setLoading(false)
                }
              })
              .catch((error) => {
                setLoading(false)
                toast.error(`${error}`)
              })
          } else {
            toast.error('...comming soon update...')
            setLoading(false)
          }
        } else {
          return setLoading(false)
        }
      }, 1000)
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      {state.loading === true ? (
        <div className='card-body p-9'>
          <div className='text-center mt-5 pt-5'>
            <div className='spinner-border' style={{width: '3rem', height: '3rem'}} role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div id='kt_account_profile_details' className='collapse show'>
            <form onSubmit={formik.handleSubmit} noValidate className='form' id='Address'>
              <div className='card-body p-9'>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Terminal Type:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='terminalTypeID'
                    >
                      <option selected value='0'>
                        Select Terminal Type
                      </option>
                      {state.terminalTypeData.length > 0 &&
                        state.terminalTypeData.map((data, index) => {
                          return (
                            <option
                              key={index}
                              value={data.terminalTypeID}
                              selected={
                                state.selTerminalTypeID === data.terminalTypeID ? true : false
                              }
                            >
                              {data.terminalTypeName}
                            </option>
                          )
                        })}
                    </select>
                    {formik.touched.terminalTypeID && formik.errors.terminalTypeID && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.terminalTypeID}</div>
                      </div>
                    )}
                  </div>
                  {/* </div>
                <div className='row mb-6'> */}
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Terminal Code:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg bg-light-primary'
                      placeholder='Terminal Code'
                      {...formik.getFieldProps('terminalCode')}
                    />
                    {formik.touched.terminalCode && formik.errors.terminalCode && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.terminalCode}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-primary me-4' disabled={loading}>
                  {!loading && 'Save'}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export {CustomerTerminalPage}
