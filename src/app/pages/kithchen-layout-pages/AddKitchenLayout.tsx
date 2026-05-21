import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {toAbsoluteUrl} from '../../../_Ecd/helpers'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory} from 'react-router-dom'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {ICustomerPageModel} from '../../models/organization-page/customer/ICustomenrModel'
import {getCustomerList} from '../../modules/organization-page/customer-master-page/CustomerCRUD'
import {KTSVG} from '../../../_Ecd/helpers'
import {Button, Modal} from 'react-bootstrap-v5'
import {Pagination} from 'antd'
import {
  kitchenLayoutInitValues as initialValues,
  IKitchenLayoutModel,
} from '../../models/kithchen-layout-page/KitchenLayoutModel'
import {event} from 'jquery'
import KitchenLayout from './component/KitchenLayout'

const profileDetailsSchema = Yup.object().shape({
  // bhkid: Yup.number().min(1, 'BHK field is required').required('BHK field is required'),
})

interface IPremium {
  loading: boolean
  customerData: ICustomerPageModel[]
  tmpCustomerData: ICustomerPageModel[]
  selCustomerID: number
}

const AddKitchenLayout: React.FC = () => {
  const history = useHistory()
  const [wall, setWall] = useState<number>(0)
  const [finish, setFinish] = useState<number>(0)
  const [options, setOptions] = useState<number>(0)
  const [wallA, setWallA] = useState<string>('')
  const [wallB, setWallB] = useState<string>('')
  const [wallC, setWallC] = useState<string>('')
  const [kitchenHardware, setKitchenHardware] = useState<number>(0)
  const [data, setData] = useState<IKitchenLayoutModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IKitchenLayoutModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IPremium>({
    loading: true,
    customerData: [] as ICustomerPageModel[],
    tmpCustomerData: [] as ICustomerPageModel[],
    selCustomerID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getAllCustomerData()
    }, 100)
  }, [])

  function getAllCustomerData() {
    getCustomerList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            customerData: responseData,
            tmpCustomerData: responseData,
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

  const handleAddKitchen = (type: number) => {
    setWall(type)
  }

  const handleAddFinish = (type: number) => {
    setFinish(type)
  }
  const handleSelectOptions = (type: number) => {
    setOptions(type)
  }

  const handleAddKitchenHardware = (type: number) => {
    setKitchenHardware(type)
  }

  const handleAddWall = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(value)) && re.test(value)) {
      if (elementId == 'wallA') {
        setWallA(value)
      } else if (elementId == 'wallB') {
        setWallB(value)
      } else if (elementId == 'wallC') {
        setWallC(value)
      }
    } else if (value == '') {
      setWallA('')
      setWallB('')
      setWallC('')
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

  const [loading, setLoading] = useState(false)
  // --------For Model Data onClick Function-------
  function selectCustomer(tmpCustomerData: ICustomerPageModel) {
    formik.setFieldValue('customerID', tmpCustomerData.customerID)
    formik.setFieldValue('customerName', tmpCustomerData.fullName)
    formik.setFieldValue('crmid', tmpCustomerData.crmid)
    formik.setFieldValue('email', tmpCustomerData.email)
    formik.setFieldValue('mobileNumber', tmpCustomerData.mobileNumber)
    setState({...state, selCustomerID: tmpCustomerData.customerID})
    setShow(false)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.customerData.length) //  length
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

  const formik = useFormik<IKitchenLayoutModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.customerID < 1) {
          toast.error(`select a customer`)
          return setLoading(false)
        }
        // createCustomizationQuotationApi(
        //   values.customerID,
        //   values.carpetAreaID,
        //   values.bhkid,
        //   values.projectTypeID,
        //   user.employeeID,
        //   '192.66.22'
        // )
        //   .then((response) => {
        //     if (response.data.isSuccess == true) {
        //       let resData = response.data
        //       history.push({
        //         pathname: `/quotations/ready-made-quotation/add-package/${response.data.quotationID}`,
        //         state: {
        //           packageID: resData.packageID,
        //           packageTypeID: 1,
        //           customerName: resData.customerName,
        //           bhkName: resData.bhkName,
        //           carpetAreaName: resData.carpetArea,
        //           projectName: resData.projectName,
        //           projectNumber: resData.projectNumber,
        //           bhkid: resData.bhkid,
        //           carpetAreaID: resData.carpetAreaID,
        //           projectTypeID: values.projectTypeID,
        //         },
        //       })
        //       setLoading(false)
        //     } else {
        //       toast.error(`${response.data.message}`)
        //       setLoading(false)
        //     }
        //   })
        //   .catch((error) => {
        //     toast.error(`${error}`)
        //     setLoading(false)
        //   })
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
     <div className='text-end '>
                <span
                  className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
                  onClick={() => {
                    history.push('/kitchen-layout/list')
                  }}
                >
                  Back To List
                </span>
              </div>
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

              <div className={state.selCustomerID === 0 ? 'd-none' : 'row mb-6'}>
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

              <label
                className='col-lg-12 col-form-label required 
                 fw-bolder fs-5 mb-6'
              >
                Step 1 : Select your Kitchen Layout
              </label>
              <div className='row gx-5 mb-6'>
                {/* <KitchenLayout
                  handleAddKitchen={() => handleAddKitchen(1)}
                  wall={wall}
                  img={toAbsoluteUrl('/media/kitchen/kitchenLayout/a.jpg')}
                />
                <KitchenLayout
                  handleAddKitchen={() => handleAddKitchen(2)}
                  wall={wall}
                  img={toAbsoluteUrl('/media/kitchen/kitchenLayout/b.jpg')}
                />
                <KitchenLayout
                  handleAddKitchen={() => handleAddKitchen(3)}
                  wall={wall}
                  img={toAbsoluteUrl('/media/kitchen/kitchenLayout/c.jpg')}
                />
                <KitchenLayout
                  handleAddKitchen={() => handleAddKitchen(4)}
                  wall={wall}
                  img={toAbsoluteUrl('/media/kitchen/kitchenLayout/d.jpg')}
                /> */}
                <div
                  className={
                    wall == 1
                      ? 'col-lg-3 fv-row border border-primary border-2 cursor-pointer'
                      : 'col-lg-3 fv-row border border-primary border-hover border-2 cursor-pointer'
                  }
                  id='WallA'
                  onClick={() => handleAddKitchen(1)}
                >
                  <div className='card mb-10 card text-center'>
                    <h6
                      className='card-title text-muted position-absolute top-0
                       start-50 translate-middle-x pt-3'
                    >
                      Wall A
                    </h6>
                    <span className='align-self-center'>
                      <img
                        className='w-100'
                        src={toAbsoluteUrl('/media/kitchen/kitchenLayout/a.jpg')}
                        alt=''
                      />
                    </span>
                    <div className='mt-5'>
                      <p className='fs-5 text-bold'>Straight Kitchen</p>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    wall == 2
                      ? 'col-lg-3 fv-row border border-primary border-2 cursor-pointer'
                      : 'col-lg-3 fv-row border border-primary border-hover border-2 cursor-pointer'
                  }
                  onClick={() => handleAddKitchen(2)}
                  id='WallB'
                >
                  <div className='card mb-10 card text-center'>
                    <h6
                      className='card-title text-muted position-absolute top-0 start-50 
                     translate-middle mt-4'
                    >
                      Wall B
                    </h6>
                    <span className='align-self-center'>
                      <img
                        className='w-100'
                        src={toAbsoluteUrl('/media/kitchen/kitchenLayout/b.jpg')}
                        alt=''
                      />
                    </span>
                    <div className='mt-5'>
                      <p className='fs-5 text-bold'>L-Shaped Kitchen</p>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    wall == 3
                      ? 'col-lg-3 fv-row border border-primary border-2 cursor-pointer'
                      : 'col-lg-3 fv-row border border-primary border-hover border-2 cursor-pointer'
                  }
                  id='WallC'
                  onClick={() => handleAddKitchen(3)}
                >
                  <div className='card mb-10 card text-center'>
                    <h6
                      className='card-title text-muted position-absolute top-0 start-50 
                      translate-middle mt-4'
                    >
                      Wall C
                    </h6>
                    <span className='align-self-center'>
                      <img
                        className='w-100'
                        src={toAbsoluteUrl('/media/kitchen/kitchenLayout/c.jpg')}
                        alt=''
                      />
                    </span>
                    <div className='mt-5'>
                      <p className='fs-5 text-bold'>U-Shaped Kitchen</p>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    wall == 4
                      ? 'col-lg-3 fv-row border border-primary border-2 cursor-pointer'
                      : 'col-lg-3 fv-row border border-primary border-hover border-2 cursor-pointer'
                  }
                  id='WallD'
                  onClick={() => handleAddKitchen(4)}
                >
                  <div className='card mb-10 card text-center'>
                    <h6
                      className='card-title text-muted position-absolute top-0 start-50 
                      translate-middle mt-4'
                    >
                      Wall D
                    </h6>
                    <span className='align-self-center mt-5'>
                      <img
                        className='w-100'
                        src={toAbsoluteUrl('/media/kitchen/kitchenLayout/d.jpg')}
                        alt=''
                      />
                    </span>
                    <div className='mt-0'>
                      <p className='fs-5 text-bold'>Parallel Kitchen</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mb-6'>
                <label className={wall > 0 ? 'col-lg-1 col-form-label fw-bolder fs-5' : 'd-none'}>
                  <span className=''>Wall A:</span>
                </label>
                <div className={wall > 0 ? 'col-lg-3 fv-row d-flex' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Wall A'
                    value={wallA}
                    id='wallA'
                    onChange={handleAddWall}
                  />
                  <span className='d-flex mt-4 fw-bold fs-6 ms-2'>Feet</span>
                  {formik.touched.wallA && formik.errors.wallA && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.wallA}</div>
                    </div>
                  )}
                </div>
                <label className={wall > 1 ? 'col-lg-1 col-form-label fw-bolder fs-5' : 'd-none'}>
                  <span className=''>Wall B:</span>
                </label>
                <div className={wall > 1 ? 'col-lg-3 fv-rowd-none d-flex' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Wall B'
                    value={wallB}
                    id='wallB'
                    onChange={handleAddWall}
                  />
                  <span className='d-flex mt-4 fw-bold fs-6 ms-2'>Feet</span>
                  {formik.touched.wallB && formik.errors.wallB && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.wallB}</div>
                    </div>
                  )}
                </div>
                <label className={wall == 3 ? 'col-lg-1 col-form-label fw-bolder fs-5' : 'd-none'}>
                  <span className=''>Wall C:</span>
                </label>
                <div className={wall == 3 ? 'col-lg-3 fv-rowd-none d-flex' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Wall C'
                    value={wallC}
                    id='wallC'
                    onChange={handleAddWall}
                  />
                  <span className='d-flex mt-4 fw-bold fs-6 ms-2'>Feet</span>
                  {formik.touched.wallC && formik.errors.wallC && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.wallC}</div>
                    </div>
                  )}
                </div>
              </div>
              <label
                className='col-lg-12 col-form-label required 
                 fw-bolder fs-5 mb-6'
              >
                Step 2: Select your Finish
              </label>
              <div className='row g-5'>
                <div className='col-lg-6'>
                  <div className='card'>
                    <div
                      className={
                        finish == 1
                          ? 'card-body border border-primary border-2 cursor-pointer'
                          : 'card-body border border-primary border-hover border-2 cursor-pointer'
                      }
                      id='Laminate'
                      onClick={() => handleAddFinish(1)}
                    >
                      <h3 className='card-title'>Laminate</h3>
                      Decorative/Kraft paper along with a resin. They are available in a wide
                      variety of eye-catching colours, textures and finishes. Laminates are high on
                      durability and easy to clean, they are also light on your wallet and are the
                      most popular choice.
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='card'>
                    <div
                      className={
                        finish == 2
                          ? 'card-body border border-primary border-2 cursor-pointer'
                          : 'card-body border border-primary border-hover border-2 cursor-pointer'
                      }
                      id='PremiumLaminate'
                      onClick={() => handleAddFinish(2)}
                    >
                      <h3 className='card-title'>Premium Laminate</h3>
                      Premium laminates are one of the most preferred laminate finishes that are
                      used for the kitchen and other carpentry works. These laminates have a
                      moderate reflective surface, and good resistance to scratches and dust.
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='card'>
                    <div
                      className={
                        finish == 3
                          ? 'card-body border border-primary border-2 cursor-pointer'
                          : 'card-body border border-primary border-hover border-2 cursor-pointer'
                      }
                      id='Acrylic'
                      onClick={() => handleAddFinish(3)}
                    >
                      <h3 className='card-title'>Acrylic</h3>
                      Acrylic is a high-quality synthetic plastic material, which is used to give a
                      glossy finish to contemporary kitchen cabinets. They provide a
                      shatter-resistant mirror-like finish to the cabinet surfaces.
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='card'>
                    <div
                      className={
                        finish == 4
                          ? 'card-body border border-primary border-2 cursor-pointer'
                          : 'card-body border border-primary border-hover border-2 cursor-pointer'
                      }
                      id='PUMembrane'
                      onClick={() => handleAddFinish(4)}
                    >
                      <h3 className='card-title mb-5'>P/U Membrane</h3>
                      PU-MEMBRANE is a solvent less, two component urethane waterproofing membrane.
                      It is designed to be used as a layer to bridge new cracks in concrete. It
                      exhibits very good mechanical properties, such as high elongation and tear
                      resistance
                    </div>
                  </div>
                </div>
              </div>
              <label
                className='col-lg-12 col-form-label required 
                 fw-bolder fs-5 mb-6'
              >
                Step 3: Select your Storage Options
              </label>
              <div className='row'>
                <div className='col-lg-4'>
                  <div className='card'>
                    <div
                      className={
                        options == 1
                          ? 'card-body border border-primary border-2'
                          : 'card-body border border-primary border-hover border-2'
                      }
                      onClick={() => handleSelectOptions(1)}
                      id=''
                    >
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/storageOptions/storagebelow.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>Storage below Counter Top</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card'>
                    <div
                      className={
                        options == 2
                          ? 'card-body border border-primary border-2'
                          : 'card-body border border-primary border-hover border-2'
                      }
                      onClick={() => handleSelectOptions(2)}
                    >
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/storageOptions/upperstorage.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>Upper Storage above Counter Top</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card'>
                    <div
                      className={
                        options == 3
                          ? 'card-body border border-primary border-2'
                          : 'card-body border border-primary border-hover border-2'
                      }
                      onClick={() => handleSelectOptions(3)}
                    >
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/storageOptions/loftshutter.jpg')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>Loft Shutter on Frames</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <label
                className='col-lg-12 col-form-label required 
                 fw-bolder fs-5 mb-6'
              >
                Step 4 : Kitchen Hardware
              </label>
              <div className='row'>
                <div className='col-lg-4'>
                  <div className='card'>
                    <div
                      className={
                        kitchenHardware == 1
                          ? 'card-body border border-primary border-2'
                          : 'card-body border border-primary border-hover border-2'
                      }
                      id='Basket'
                      onClick={() => handleAddKitchenHardware(1)}
                    >
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/kitchenHardware/ssWiredBasket.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>SS Wired Basket</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card'>
                    <div
                      className={
                        kitchenHardware == 2
                          ? 'card-body border border-primary border-2'
                          : 'card-body border border-primary border-hover border-2'
                      }
                      id='Tandem'
                      onClick={() => handleAddKitchenHardware(2)}
                    >
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/kitchenHardware/hetitechBasket.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>Hettich Tandem Box</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <label
                className='col-lg-12 col-form-label required 
                 fw-bolder fs-5 mb-6'
              >
                Step 5 : Accessories
              </label>
              <div className='row'>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/magicCorner.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>CORNER ACCESSORIES</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/bottlePullOut.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>BOTTLE PULL OUT</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/profileHandle.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>PROFILE HANDLE, HARDWARE</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/Wicker-basket.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>WICKER BASKET</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/Rollar-shutter.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>ROLLAR SHUTTER</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/Tall-unit.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>TALL UNIT</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/Pull-out-dustbin.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>PULL OUT DUSTBIN</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-4'>
                  <div className='card row'>
                    <div className='card-body'>
                      <span className='align-self-center'>
                        <img
                          className='w-100'
                          src={toAbsoluteUrl('/media/kitchen/accessories/Tandem-channel.png')}
                          alt=''
                        />
                      </span>
                      <div className='mt-5'>
                        <span className='fs-5 text-bold'>TANDEM CHANNEL</span>
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='ms-20 form-control form-control-lg form-control-solid-black border-2 bg-white mb-5'
                        placeholder='QTY'
                        {...formik.getFieldProps('QTY')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Continue'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link className='btn btn-danger ms-3'to='/kitchen-layout/list'>Cancel</Link>
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
                        <tr key={index} onClick={() => selectCustomer(data)}>
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
                showTotal={(total) => `Total ${total} customer`}
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

export {AddKitchenLayout}
