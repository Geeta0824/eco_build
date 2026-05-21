import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  IInvoiceModel,
  invoiceModelInitValues as initialValues,
} from '../../../../models/projects-page/IInvoiceModel'
import {shallowEqual, useSelector} from 'react-redux'
import {gstTypeData} from '../../../other-dropDowns/otherDropDowns'
import {
  getProjectInvoiceByProjectInvoiceIdAPI,
  updateProjectInvoiceDetailsAPI,
} from '../../../../modules/project-master-page/project-master/invoice-master/InvoiceCRUD'
import {toast} from 'react-toastify'

const profileDetailsSchema = Yup.object().shape({
  totalAmount: Yup.number()
    .required('Invoice Amount is required')
    .min(1, 'Invoice Amount is required'),
})

interface IInvoice {
  loading: boolean
  projectID: number
  paidAmount: number
  remainingAmount: number
  selGstTypeID: number
  projName: string
  customerName: string
  projectAmount: string
}

const EditInvoicePage: React.FC = () => {
  const [data, setData] = useState<IInvoiceModel>(initialValues)
  const {projectInvoiceID} = useParams<{projectInvoiceID: string}>()
  const [isgst, setIsgst] = useState(false)
  const [isPaymentReceive, setIsPaymentReceive] = useState(false)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IInvoiceModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IInvoice>({
    loading: false,
    projectID: 0,
    paidAmount: 0,
    remainingAmount: 0,
    selGstTypeID: 0,
    projName: '',
    customerName: '',
    projectAmount: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projectID: any = lc.projectID
      let projName: any = lc.projName
      let customerName: any = lc.customerName
      let projectAmount: any = lc.projectAmount
      let paidAmount: any = lc.paidAmount
      let remainingAmount: any = lc.remainingAmount
      getPayStructureDataByID(
        projectID,
        projName,
        customerName,
        projectAmount,
        paidAmount,
        remainingAmount
      )
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  //============================ GET BY ID API =================================

  function getPayStructureDataByID(
    projectID: number,
    projName: string,
    customerName: string,
    projectAmount: string,
    paidAmount: number,
    remainingAmount: number
  ) {
    getProjectInvoiceByProjectInvoiceIdAPI(parseInt(projectInvoiceID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('cgstVal', response.data.cgstVal)
          formik.setFieldValue('cgstPer', response.data.cgstPer)
          formik.setFieldValue('sgstVal', response.data.sgstVal)
          formik.setFieldValue('sgstPer', response.data.sgstPer)
          formik.setFieldValue('igstVal', response.data.igstVal)
          formik.setFieldValue('igstPer', response.data.igstPer)
          formik.setFieldValue('gstAmount', response.data.gstAmount)
          formik.setFieldValue('totalAmount', response.data.totalAmount)
          formik.setFieldValue('gstTypeID', response.data.gstTypeID)
          formik.setFieldValue('voucherNumber', response.data.voucherNumber)
          formik.setFieldValue('invDesc', response.data.invDesc)
          setIsgst(response.data.isgst)
          setProjectAmount(response.data.projectAmount)
          setIsPaymentReceive(response.data.isPaymentReceive)
          setState({
            ...state,
            projectID: projectID,
            selGstTypeID: response.data.gstTypeID,
            projName: projName,
            customerName: customerName,
            projectAmount: projectAmount,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount,
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

  //============ Select Change Function =======================

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'gstTypeID') {
      formik.setFieldValue('gstTypeID', parseInt(value))
      if (parseInt(value) == 1) {
        let tmpGST: number = 0
        let tmpValues: number = parseInt(projectAmount)
        tmpGST = (tmpValues * 18) / 100
        formik.setFieldValue('sgstVal', tmpGST / 2)
        formik.setFieldValue('cgstVal', tmpGST / 2)
        formik.setFieldValue('gstAmount', tmpGST)
        formik.setFieldValue('totalAmount', tmpGST + tmpValues)
      } else if (parseInt(value) == 2) {
        let tmpGST: number = 0
        let tmpValues: number = parseInt(projectAmount)
        tmpGST = (tmpValues * 18) / 100
        formik.setFieldValue('igstVal', tmpGST)
        formik.setFieldValue('gstAmount', tmpGST)
        formik.setFieldValue('totalAmount', tmpGST + tmpValues)
      }
      setState({...state, selGstTypeID: parseInt(value)})
      // setState({...state, selFromLocationID: parseInt(value)})
    }
  }

  const [projectAmount, setProjectAmount] = useState<string>('')
  function invoiceAmount(event: any) {
    const tmpAmount = event.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpAmount)) && re.test(tmpAmount)) {
      if (state.selGstTypeID == 1) {
        let tmpGST: number = 0
        tmpGST = (parseInt(tmpAmount) * 18) / 100
        formik.setFieldValue('sgstVal', tmpGST / 2)
        formik.setFieldValue('cgstVal', tmpGST / 2)
        formik.setFieldValue('gstAmount', tmpGST)
        formik.setFieldValue('totalAmount', tmpGST + parseInt(tmpAmount))
        setProjectAmount(tmpAmount)
      } else if (state.selGstTypeID == 2) {
        let tmpGST: number = 0
        tmpGST = (parseInt(tmpAmount) * 18) / 100
        formik.setFieldValue('igstVal', tmpGST)
        formik.setFieldValue('gstAmount', tmpGST)
        formik.setFieldValue('totalAmount', tmpGST + parseInt(tmpAmount))
        setProjectAmount(tmpAmount)
      } else {
        setProjectAmount(tmpAmount)
        formik.setFieldValue('totalAmount', tmpAmount)
      }
    } else if (tmpAmount == '') {
      if (state.selGstTypeID == 1) {
        formik.setFieldValue('sgstVal', 0)
        formik.setFieldValue('cgstVal', 0)
        formik.setFieldValue('gstAmount', 0)
        formik.setFieldValue('totalAmount', 0)
        setProjectAmount('')
      } else if (state.selGstTypeID == 2) {
        formik.setFieldValue('igstVal', 0)
        formik.setFieldValue('gstAmount', 0)
        formik.setFieldValue('totalAmount', 0)
        setProjectAmount('')
      } else {
        setProjectAmount('')
      }
    }
  }

  function checkedFunction(event: any) {
    if (event.target.checked === true) {
      if (parseInt(projectAmount) > 0.0) {
        setIsgst(event.target.checked)
      } else {
        toast.error(`Please Enter Invoice Amount`)
      }
    } else {
      formik.setFieldValue('sgstVal', 0)
      formik.setFieldValue('cgstVal', 0)
      formik.setFieldValue('igstVal', 0)
      formik.setFieldValue('gstAmount', 0)
      formik.setFieldValue('totalAmount', parseInt(projectAmount))
      setIsgst(event.target.checked)
      setState({...state, selGstTypeID: 0})
    }
  }

  function paymentReceive(event: any) {
    if (parseInt(projectAmount) > 0.0) {
      setIsPaymentReceive(event.target.checked)
    } else {
      setIsPaymentReceive(false)
    }
  }

  const formik = useFormik<IInvoiceModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let temCGSTPer = 0
        let temSGSTPer = 0
        let temIGSTPer = 0
        if (state.selGstTypeID === 1) {
          temCGSTPer = 9
          temSGSTPer = 9
        } else {
          temIGSTPer = 18
        }
        updateProjectInvoiceDetailsAPI(
          parseInt(projectInvoiceID),
          state.projectID,
          parseInt(projectAmount),
          values.gstTypeID,
          temSGSTPer,
          temCGSTPer,
          values.sgstVal,
          values.cgstVal,
          temIGSTPer,
          values.igstVal,
          values.gstAmount,
          values.totalAmount,
          isgst,
          isPaymentReceive,
          values.invDesc,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: `/projects/project/invoice/list`,
                state: {
                  projectID: state.projectID,
                  projName: state.projName,
                  customerName: state.customerName,
                  projectAmount: state.projectAmount,
                  paidAmount: state.paidAmount,
                  remainingAmount: state.remainingAmount,
                },
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
    <>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Invoice Amount:
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Invoice Amount'
                    value={projectAmount}
                    onChange={invoiceAmount}
                  />
                  {formik.touched.projectAmount && formik.errors.projectAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Is GST:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      checked={isgst}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
                <label
                  className={isgst === true ? 'col-lg-2 col-form-label  fw-bold fs-6' : 'd-none'}
                >
                  GST Type :
                </label>
                <div className={isgst === true ? 'col-lg-4 fv-row' : 'd-none'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='gstTypeID'
                  >
                    <option selected={state.selGstTypeID === 0 ? true : false} value={0}>
                      Select GST Type
                    </option>
                    {gstTypeData.length > 0 &&
                      gstTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.gstTypeID}
                            selected={state.selGstTypeID == data.gstTypeID ? true : false}
                          >
                            {data.gstTypeName}
                          </option>
                        )
                      })}
                  </select>
                </div>
                {formik.touched.gstTypeID && formik.errors.gstTypeID && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.gstTypeID}</div>
                  </div>
                )}
              </div>
              <div className='row mb-6'>
                <label
                  className={
                    state.selGstTypeID === 1 && isgst === true
                      ? 'col-lg-2 col-form-label fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  CGST Amount:
                </label>
                <div
                  className={
                    state.selGstTypeID === 1 && isgst === true ? 'col-lg-4 fv-row' : 'd-none'
                  }
                >
                  <input
                    type='text'
                    className='form-control form-control-lg  bg-white border-0'
                    placeholder='CGST Amount'
                    {...formik.getFieldProps('cgstVal')}
                  />
                  {formik.touched.cgstVal && formik.errors.cgstVal && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cgstVal}</div>
                    </div>
                  )}
                </div>
                <label
                  className={
                    state.selGstTypeID === 1 && isgst === true
                      ? 'col-lg-2 col-form-label fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  SGST Amount:
                </label>
                <div
                  className={
                    state.selGstTypeID === 1 && isgst === true ? 'col-lg-4 fv-row' : 'd-none'
                  }
                >
                  <input
                    type='text'
                    className='form-control form-control-lg  bg-white border-0'
                    placeholder='SGST Amount'
                    {...formik.getFieldProps('sgstVal')}
                  />
                  {formik.touched.sgstVal && formik.errors.sgstVal && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.sgstVal}</div>
                    </div>
                  )}
                </div>
                <label
                  className={
                    state.selGstTypeID === 2 && isgst === true
                      ? 'col-lg-2 col-form-label fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  IGST Amount:
                </label>
                <div
                  className={
                    state.selGstTypeID === 2 && isgst === true ? 'col-lg-4 fv-row' : 'd-none'
                  }
                >
                  <input
                    type='text'
                    className='form-control form-control-lg bg-white border-0'
                    placeholder='IGST Amount'
                    {...formik.getFieldProps('igstVal')}
                  />
                  {formik.touched.igstVal && formik.errors.igstVal && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.igstVal}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>GST Amount:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg bg-white border-0'
                    placeholder='GST Amount'
                    {...formik.getFieldProps('gstAmount')}
                    disabled
                  />
                  {formik.touched.gstAmount && formik.errors.gstAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.gstAmount}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Total Amount:
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg bg-white border-0'
                    placeholder='Total Amount'
                    {...formik.getFieldProps('totalAmount')}
                    disabled
                  />
                  {formik.touched.totalAmount && formik.errors.totalAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.totalAmount}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Invoice Description:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Invoice Description...'
                    {...formik.getFieldProps('invDesc')}
                  />
                  {formik.touched.invDesc && formik.errors.invDesc && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.invDesc}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='card-title m-0 d-flex'>
                <span className='form-group d-flex'>
                  <input
                    className='me-2'
                    type='checkbox'
                    id='checkBox'
                    checked={isPaymentReceive}
                    onClick={paymentReceive}
                  />
                  <span className='footer text-muted'>Payment Receive</span>
                </span>
              </div>
            </div>
            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary me-2' disabled={loading}>
                {!loading && 'Save'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <span
                className='btn btn-danger'
                onClick={() =>
                  history.push({
                    pathname: `/projects/project/invoice/list`,
                    state: {
                      projectID: state.projectID,
                    },
                  })
                }
              >
                Cancel
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default EditInvoicePage
