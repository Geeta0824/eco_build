import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IStandardQuotationsModel,
  standardQuotationsInitValues as initialValues,
} from '../../../models/quotations-page/standard-quotation-page/IStandardQuotationsModel'
import {ICustomerPageModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {KTSVG} from '../../../../_Ecd/helpers'
import {CustomerSelectionPage} from '../../common-pages/CustomerSelectionPage'
import {Button, Modal} from 'react-bootstrap-v5'
import {Pagination} from 'antd'
import {IBHKMasterModel} from '../../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../../models/master-page/ICarpetAreaModel'
import {getActiveBHKApi} from '../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {getAllCarpetArea} from '../../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {createStandardQuotationsApi} from '../../../modules/quotations-master-page/standard-quotations-master-page/StandardQuotationsCRUD'

const profileDetailsSchema = Yup.object().shape({
  // customerID: Yup.number()
  //   .min(1, 'Customer field is required')
  //   .required('Customer field is required'),
  bhkid: Yup.number().min(1, 'BHK field is required').required('BHK field is required'),
  carpetAreaID: Yup.number()
    .min(1, 'Carpet Area field is required')
    .required('Carpet Area field is required'),
})

interface IPremium {
  loading: boolean
  customerData: ICustomerPageModel[]
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  selBHKID: number
  selCarpetAreaID: number
  selCustomerId: number
  fullName: string
}

const AddStandardQuotation: React.FC = () => {
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<IStandardQuotationsModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IStandardQuotationsModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IPremium>({
    loading: true,
    customerData: [] as ICustomerPageModel[],
    bhkData: [] as IBHKMasterModel[],
    carpetAreaData: [] as ICarpetAreaModel[],
    selBHKID: 0,
    selCarpetAreaID: 0,
    selCustomerId: 0,
    fullName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getBHKData()
    }, 100)
  }, [])

  function getBHKData() {
    getActiveBHKApi()
      .then((response) => {
        // let responseData = response.data.responseObject
        
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        let responseData = resp.responseObject
        getCarpetAreaData(responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkData: [], loading: false})
      })
  }

  function getCarpetAreaData(bhkData: IBHKMasterModel[]) {
    getAllCarpetArea()
      .then((response) => {
        let responseData = response.data.responseObject
        getAllCustomerData(bhkData, responseData)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: [], loading: false})
      })
  }

  function getAllCustomerData(bhkData: IBHKMasterModel[], carpetAreaData: ICarpetAreaModel[]) {
    getCustomerList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            customerData: responseData,
            carpetAreaData: carpetAreaData,
            bhkData: bhkData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, customerData: [], loading: false})
        }
        setTotal(responseData.length)
        setPage(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, customerData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'bhkid') {
      formik.setFieldValue('bhkid', parseInt(value))
      setState({...state, selBHKID: parseInt(value)})
    } else if (elementId === 'carpetAreaID') {
      formik.setFieldValue('carpetAreaID', parseInt(value))
      setState({...state, selCarpetAreaID: parseInt(value)})
    }
  }

  // -----------------Customer Select-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  // --------For Model Data onClick Function-------
  function selectCustomer(tmpCustomerData: ICustomerPageModel) {
    formik.setFieldValue('customerID', tmpCustomerData.customerID)
    formik.setFieldValue('customerName', tmpCustomerData.fullName)
    formik.setFieldValue('email', tmpCustomerData.email)
    formik.setFieldValue('mobileNumber', tmpCustomerData.mobileNumber)
    setState({...state, selCustomerId: tmpCustomerData.customerID})
    setShow(false)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICustomerPageModel[] = state.customerData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IStandardQuotationsModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.customerID < 1) {
          toast.error(`select a customer`)
          return setLoading(false)
        }
        createStandardQuotationsApi(
          values.customerID,
          values.carpetAreaID,
          values.bhkid,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfully')
              history.push(`/quotations/premium-quotation/view/${response.data.quotationID}`)
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
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Customer:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='customer Name'
                    disabled
                    {...formik.getFieldProps('customerName')}
                  />
                  {formik.touched.customerName && formik.errors.customerName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.customerName}</div>
                    </div>
                  )}
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShow}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
              </div>

              <div className={state.selCustomerId === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Mobile Number:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Mobile Number'
                    disabled
                    {...formik.getFieldProps('mobileNumber')}
                  />
                  {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.mobileNumber}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Email:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Email'
                    disabled
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.email}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>BHK:</label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='bhkid'
                  >
                    <option selected={state.selBHKID === 0 ? true : false} value={0}>
                      Select BHK
                    </option>
                    {state.bhkData.length > 0 &&
                      state.bhkData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.bhkid}
                            selected={data.bhkid === state.selBHKID ? true : false}
                          >
                            {data.bhkName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.bhkid && formik.errors.bhkid && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bhkid}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Carpet Area:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='carpetAreaID'
                  >
                    <option selected={state.selCarpetAreaID === 0 ? true : false} value={0}>
                      Select Carpet Area
                    </option>
                    {state.carpetAreaData.length > 0 &&
                      state.carpetAreaData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.carpetAreaID}
                            selected={data.carpetAreaID === state.selCarpetAreaID ? true : false}
                          >
                            {data.carpetArea}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.carpetAreaID && formik.errors.carpetAreaID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.carpetAreaID}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Submit'}
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
      </div>

      {/* <CustomerSelectionPage
        show={show}
        customerData={state.customerData}
        handleClose={handleClose}
        selectCustomer={()=>selectCustomer(tmpCustomerData)}
      /> */}

      {/* ----------------------------Customer Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Customer Data</Modal.Title>
            {/* <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-light-primary'
                  // name='search'
                  placeholder='Search'
                  onChange={(e) => filter(e)}
                  value={name}
                />
              </span>
            </div> */}
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Mobile Number</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Email</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isActive === false
                          //     ? 'd-none'
                          //     : 'bg-hover-light-primary text-hover-primary'
                          // }
                          onClick={() => selectCustomer(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.fullName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.mobileNumber}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.email}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPage(value)}
                pageSize={postPerPage}
                total={total}
                current={page}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChange}
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {AddStandardQuotation}
