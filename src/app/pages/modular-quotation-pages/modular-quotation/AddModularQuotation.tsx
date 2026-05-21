import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {ICustomerPageModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Button, Modal} from 'react-bootstrap-v5'
import {Pagination} from 'antd'
import {IBHKMasterModel} from '../../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../../models/master-page/ICarpetAreaModel'
import {getActiveBHKApi} from '../../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {createDIYQuotationApi} from '../../../modules/quotations-master-page/diy-quotation-master-page/DIYQuotationCRUD'
import {
  IModularQuotationModel,
  modularQuotationInitValues as initialValues,
} from '../../../models/modular-quotation-page/IModularQuotationModel'
import {
  CreateMakeModularQuotationApi,
  GetModularQuotationListAPI,
  GetMultipleDropdownListForModularQuoAPI,
} from '../../../modules/modular-quotation-master-page/diy-quotation-master-page/ModularQuotationCRUD'
import Loader from '../../common-pages/Loader'
import {modularTypeData} from '../../other-dropDowns/otherDropDowns'

const profileDetailsSchema = Yup.object().shape({
  bhkid: Yup.number().min(1, 'BHK field is required').required('BHK field is required'),
  carpetAreaID: Yup.number()
    .min(1, 'Carpet Area field is required')
    .required('Carpet Area field is required'),
})

interface IPremium {
  loading: boolean
  customerData: ICustomerPageModel[]
  tmpCustomerData: ICustomerPageModel[]
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  selBHKID: number
  selCarpetAreaID: number
  selCustomerId: number
  selModularTypeID: number
  fullName: string
  modularQuotationData: IModularQuotationModel[]
  tmpModularQuotationData: IModularQuotationModel[]
  selQuotationID: number
  mainCustomerID: number
  mainEmployeeID: number
  mainSearch: string
}

const AddModularQuotation: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isBeforeDiscount, setIsBeforeDiscount] = useState(true)
  const [data, setData] = useState<IModularQuotationModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IModularQuotationModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IPremium>({
    loading: true,
    customerData: [] as ICustomerPageModel[],
    tmpCustomerData: [] as ICustomerPageModel[],
    bhkData: [] as IBHKMasterModel[],
    carpetAreaData: [] as ICarpetAreaModel[],
    selBHKID: 0,
    selCarpetAreaID: 0,
    selCustomerId: 0,
    selModularTypeID: 0,
    fullName: '',
    modularQuotationData: [] as IModularQuotationModel[],
    tmpModularQuotationData: [] as IModularQuotationModel[],
    selQuotationID: 0,
    mainCustomerID: 0,
    mainEmployeeID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let modularTypeID: any = 0
      var mainEmployeeID: number = 0
      var mainCustomerID: number = 0
      var mainSearch: string = ''

      if (
        lc !== undefined ||
        lc.mainEmployeeID !== undefined ||
        lc.mainCustomerID !== undefined ||
        lc.mainSearch !== undefined
      ) {
        modularTypeID = lc.modularTypeID
        mainEmployeeID = lc.mainEmployeeID
        mainCustomerID = lc.mainCustomerID
        mainSearch = lc.mainSearch
      }

      getMultipleDropdownListData(modularTypeID, mainCustomerID, mainEmployeeID, mainSearch)
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsBeforeDiscount(event.target.checked)
  }
  function getMultipleDropdownListData(
    modularTypeID: number,
    mainCustomerID: number,
    mainEmployeeID: number,
    mainSearch: string
  ) {
    GetMultipleDropdownListForModularQuoAPI()
      .then((response) => {
        let bhkData = response.data.bhkList
        let carpetAreaData = response.data.carpetAreaList
        let customerData = response.data.customeraList
        let modularQuotationData = response.data.projectList
        if (response.data.isSuccess == true) {
          formik.setFieldValue('modularTypeID', modularTypeID)
          setState({
            ...state,
            customerData: customerData,
            tmpCustomerData: customerData,
            carpetAreaData: carpetAreaData,
            bhkData: bhkData,
            selModularTypeID: modularTypeID,
            modularQuotationData: modularQuotationData,
            tmpModularQuotationData: modularQuotationData,
            mainCustomerID,
            mainEmployeeID,
            mainSearch,
            loading: false,
          })
          setTotal(customerData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            carpetAreaData: [],
            customerData: [],
            modularQuotationData: [],
            bhkData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          carpetAreaData: [],
          bhkData: [],
          customerData: [],
          modularQuotationData: [],
          loading: false,
        })
      })
  }

  // function getCarpetAreaData(modularTypeID: number, bhkData: IBHKMasterModel[]) {
  //   getAllCarpetArea()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getAllCustomerData(modularTypeID, bhkData, responseData)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: [], loading: false})
  //     })
  // }

  // function getAllCustomerData(
  //   modularTypeID: number,
  //   bhkData: IBHKMasterModel[],
  //   carpetAreaData: ICarpetAreaModel[]
  // ) {
  //   getCustomerList()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getAllmodularQuotationData(modularTypeID, bhkData, carpetAreaData, responseData)
  //         setState({
  //           ...state,
  //           customerData: responseData,
  //           tmpCustomerData: responseData,
  //           carpetAreaData: carpetAreaData,
  //           bhkData: bhkData,
  //           selModularTypeID: modularTypeID,
  //           loading: false,
  //         })
  //         formik.setFieldValue('modularTypeID', modularTypeID)
  //         setTotal(responseData.length)
  //         setPage(1)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, customerData: [], loading: false})
  //         setTotal(responseData.length)
  //         setPage(1)
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, customerData: [], loading: false})
  //     })
  // }

  // function getAllmodularQuotationData(
  //   modularTypeID: number,
  //   bhkData: IBHKMasterModel[],
  //   carpetAreaData: ICarpetAreaModel[],
  //   customerData: ICustomerPageModel[]
  // ) {
  //   GetModularQuotationListAPI(0, 0, 0, '')
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         const responseData = response.data.responseObject
  //         setState({
  //           ...state,
  //           customerData: customerData,
  //           tmpCustomerData: customerData,
  //           carpetAreaData: carpetAreaData,
  //           bhkData: bhkData,
  //           selModularTypeID: modularTypeID,
  //           modularQuotationData: responseData,
  //           tmpModularQuotationData: responseData,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, modularQuotationData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, modularQuotationData: [], loading: false})
  //     })
  // }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'bhkid') {
      formik.setFieldValue('bhkid', parseInt(value))
      setState({...state, selBHKID: parseInt(value)})
    } else if (elementId === 'carpetAreaID') {
      formik.setFieldValue('carpetAreaID', parseInt(value))
      setState({...state, selCarpetAreaID: parseInt(value)})
    } else if (elementId === 'modularTypeID') {
      formik.setFieldValue('modularTypeID', parseInt(value))
      setState({...state, selModularTypeID: parseInt(value)})
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

  // -----------------Customer Select-------------------
  const [showClone, setShowClone] = useState(false)
  function handleCloseClone() {
    setShowClone(false)
  }
  function handleShowClone() {
    setShowClone(true)
  }

  // --------For Model Data onClick Function-------
  function selectCustomer(tmpCustomerData: ICustomerPageModel) {
    formik.setFieldValue('customerID', tmpCustomerData.customerID)
    formik.setFieldValue('customerName', tmpCustomerData.fullName)
    formik.setFieldValue('crmid', tmpCustomerData.crmid)
    formik.setFieldValue('email', tmpCustomerData.email)
    formik.setFieldValue('mobileNumber', tmpCustomerData.mobileNumber)
    setState({...state, selCustomerId: tmpCustomerData.customerID})
    setShow(false)
  }

  // --------For Model Data onClick Function-------
  function selectCloneQuotation(tmpCloneQuotationData: IModularQuotationModel) {
    formik.setFieldValue('quotationID', tmpCloneQuotationData.quotationID)
    formik.setFieldValue('quotationNumber', tmpCloneQuotationData.quotationNumber)
    formik.setFieldValue('projectNumber', tmpCloneQuotationData.projectNumber)
    formik.setFieldValue('quotationDate', tmpCloneQuotationData.quotationDate)
    formik.setFieldValue('employeeName', tmpCloneQuotationData.employeeName)
    formik.setFieldValue('cloneCustomerName', tmpCloneQuotationData.customerName)
    setState({...state, selQuotationID: tmpCloneQuotationData.quotationID})
    setShowClone(false)
  }

  // ===================== For Customer Filter =====================
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCustomerData.filter((user) => {
        return (
          user.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.mobileNumber.toString().includes(keyword.toString()) ||
          user.crmid.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, customerData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, customerData: state.tmpCustomerData})
      setTotal(state.tmpCustomerData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ===================== For Customer Filter =====================
  const [cloneName, setCloneName] = useState('')

  const CloneFilter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpModularQuotationData.filter((user) => {
        return (
          user.projectNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.employeeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.quotationDate.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, modularQuotationData: results})
      setTotal(results.length)
    } else {
      setState({...state, modularQuotationData: state.tmpModularQuotationData})
      setTotal(state.tmpModularQuotationData.length)
    }
    setCloneName(keyword)
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
  const formik = useFormik<IModularQuotationModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.customerID < 1) {
          toast.error(`select a customer`)
          return setLoading(false)
        }
        CreateMakeModularQuotationApi(
          values.customerID,
          values.carpetAreaID,
          values.bhkid,
          values.modularTypeID,
          user.employeeID,
          '192.66.22',
          isBeforeDiscount,
          state.selQuotationID
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              let resData = response.data
              if (state.selQuotationID == 0) {
                history.push({
                  pathname: `/modular/modular-quotation/add-cart/${response.data.quotationID}`,
                  state: {
                    quotationID: resData.quotationID,
                    customerName: resData.customerName,
                    bhkName: resData.bhkName,
                    carpetAreaName: resData.carpetArea,
                    projectName: resData.projectName,
                    projectNumber: resData.projectNumber,
                    mainEmployeeID: state.mainEmployeeID,
                    mainCustomerID: state.mainCustomerID,
                    mainSearch: state.mainSearch,
                  },
                })
              } else {
                history.push({
                  pathname: `/modular/modular-quotation/view-cart/${response.data.quotationID}`,
                  state: {
                    quotationID: resData.quotationID,
                    customerName: resData.customerName,
                    bhkName: resData.bhkName,
                    carpetAreaName: resData.carpetArea,
                    projectName: resData.projectName,
                    projectNumber: resData.projectNumber,
                    mainEmployeeID: state.mainEmployeeID,
                    mainCustomerID: state.mainCustomerID,
                    mainSearch: state.mainSearch,
                  },
                })
              }
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Customer:
                </label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Mobile Number:</span>
                </label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Email:</span>
                </label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>BHK:</label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Carpet Area:
                </label>
                <div className='col-lg-4 fv-row'>
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
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Modular Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='modularTypeID'
                  >
                    <option selected={state.selModularTypeID === 0 ? true : false} value={0}>
                      Select Modular Type
                    </option>
                    {modularTypeData.length > 0 &&
                      modularTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.modularTypeID}
                            selected={data.modularTypeID === state.selModularTypeID ? true : false}
                          >
                            {data.modularTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.modularTypeID && formik.errors.modularTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.modularTypeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Is Default Discount:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-4'
                      type='checkbox'
                      id='Checked'
                      checked={isBeforeDiscount}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='row py-6 bg-light-warning'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Clone Quotation:</label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-light-warning'
                    placeholder='Project Number'
                    disabled
                    {...formik.getFieldProps('projectNumber')}
                  />
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShowClone}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
                <label
                  className={
                    state.selQuotationID === 0 ? 'd-none' : 'col-lg-2 col-form-label fw-bold fs-6'
                  }
                >
                  Clone Quotation Date:
                </label>
                <div className={state.selQuotationID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-light-warning'
                    placeholder='Quotation Date'
                    disabled
                    {...formik.getFieldProps('quotationDate')}
                  />
                </div>
              </div>
              <div className={state.selQuotationID === 0 ? 'd-none' : 'row pb-6 bg-light-warning'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Clone Customer Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-light-warning'
                    placeholder='Customer Name'
                    disabled
                    {...formik.getFieldProps('cloneCustomerName')}
                  />
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Clone Employee Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-light-warning'
                    placeholder='Employee Name'
                    disabled
                    {...formik.getFieldProps('employeeName')}
                  />
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <Link
                className='btn btn-danger me-2'
                to={{
                  pathname: `/modular/modular-quotation/list`,
                  state: {
                    modularTypeID: state.selModularTypeID,
                    employeeID: state.mainEmployeeID,
                    customerID: state.mainCustomerID,
                    mainSearch: state.mainSearch,
                  },
                }}
              >
                Cancel
              </Link>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Continue'}
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
      {/* ----------------------------Customer Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Customer Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
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
            </div>
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
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>CRM ID</span>
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
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.crmid}
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
      {/* ----------------------------Clone Quotation Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={showClone} onHide={handleCloseClone}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Modular Quotation Data</Modal.Title>
            <div className='border-0' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-light-primary'
                  placeholder='Search'
                  onChange={(e) => CloneFilter(e)}
                  value={cloneName}
                />
              </span>
            </div>
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
                      <span className='d-block mb-1 ps-2'>Project Number</span>
                    </th>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>

                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Quotation Date</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Employee Name</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.modularQuotationData.length > 0 &&
                    state.modularQuotationData.map((data, index) => {
                      return (
                        <tr key={index} onClick={() => selectCloneQuotation(data)}>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectNumber}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.customerName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.quotationDate}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.employeeName}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseClone}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {AddModularQuotation}
