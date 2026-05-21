import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IProductMasterModel,
  productInitValue as initialValues,
} from '../../../models/product-page/IProductMasterModel'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {
  getProductMasterByproductID,
  updateProductMaster,
} from '../../../modules/product-master-page/product-master-page/ProductMasterCRUD'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'
import {getActiveUnit} from '../../../modules/master-page/unit-master-page/UnitCRUD'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {getActiveProductCategoryApi} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {IUnitModel} from '../../../models/master-page/IUnitModel'
import {getAllAgencyType} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {IAgencyTypeModel} from '../../../models/product-page/IAgencyTypeModel'

const profileDetailsSchema = Yup.object().shape({
  productCategoryID: Yup.number()
    .required('Product category is required')
    .min(1, 'Product category is required'),
  defaultUnitID: Yup.number()
    .required('Default unit is required')
    .min(1, 'defaultUnitID is required'),
  productName: Yup.string().required('Product Name is required'),
  description: Yup.string().required('Description is required'),
  // length: Yup.number().required('Length is required').min(1, 'Length is required'),
  // height: Yup.number().required('Height is required').min(1, 'Height is required'),
  // depth: Yup.number().required('Depth is required').min(1, 'Depth is required'),
  sqft: Yup.number().required('No of unit is required').min(1, 'No of unit is required'),
  pricePerSqFt: Yup.number()
    .required('Price per unit is required')
    .min(1, 'Price per unit is required'),
})

interface INatio {
  loading: boolean
  agencyTypeData: IAgencyTypeModel[]
  productCategoryData: IProductCategoryModel[]
  defualtUnitData: IUnitModel[]
  selProductCategoryID: number
  selUnitID: number
  selAgencyTypeId: number
  mainProductCategoryID: number
  mainUnitID: number
  mainSearch: string
}

const EditProductMaster: React.FC = () => {
  const location = useLocation()
  const {productMasterID} = useParams<{productMasterID: string}>()
  const history = useHistory()
  const [isMinLength, setIsMinLength] = useState<boolean>(false)
  const [isMinHeight, setIsMinHeight] = useState<boolean>(false)
  const [isMinTotalSqft, setIsMinTotalSqft] = useState<boolean>(false)
  const [isCrarpetArea, setIsCrarpetArea] = useState<boolean>(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [isHeight, setHeight] = useState<boolean>(false)
  const [isMandatory, setIsMandatory] = useState<boolean>(false)
  const [askForQuote, setAskForQuote] = useState<boolean>(false)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [filePath, setFilePath] = useState<string>('')
  const [data, setData] = useState<IProductMasterModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProductMasterModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<INatio>({
    loading: false,
    agencyTypeData: [] as IAgencyTypeModel[],
    productCategoryData: [] as IProductCategoryModel[],
    defualtUnitData: [] as IUnitModel[],
    selProductCategoryID: 0,
    selUnitID: 0,
    selAgencyTypeId: 0,
    mainProductCategoryID: 0,
    mainUnitID: 0,
    mainSearch: '',
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainProductCategoryID: number = 0
      var mainUnitID: number = 0
      var mainSearch: string = ''
      if (
        lc.mainProductCategoryID !== undefined ||
        lc.mainUnitID !== undefined ||
        lc.mainSearch !== undefined
      ) {
        mainProductCategoryID = lc.mainProductCategoryID
        mainUnitID = lc.mainUnitID
        mainSearch = lc.mainSearch
      }
      getProductDocumentDatas(mainProductCategoryID, mainUnitID, mainSearch)
    }, 100)
  }, [])

  function checkedBoxs(event: any) {
    console.log(event)
    let tmpId = event.target.id
    let tmpChecked = event.target.checked
    if (tmpId == 'IsHeightChange') {
      setIsMinHeight(tmpChecked)
    } else if (tmpId == 'IsMinLength') {
      setIsMinLength(tmpChecked)
    } else if (tmpId == 'IsMinHeight') {
      setIsMinHeight(tmpChecked)
    } else if (tmpId == 'IsMinTotalSqft') {
      setIsMinTotalSqft(tmpChecked)
    } else if (tmpId == 'IsCrarpetArea') {
      setIsCrarpetArea(tmpChecked)
    }
  }
  function checkedIsHeight(event: any) {
    setHeight(event.target.checked)
  }
  function checkedIsMandatory(event: any) {
    setIsMandatory(event.target.checked)
  }
  function checkedAskForQuote(event: any) {
    setAskForQuote(event.target.checked)
  }
  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  function getProductDocumentDatas(
    mainProductCategoryID: number,
    mainUnitID: number,
    mainSearch: string
  ) {
    getActiveProductCategoryApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          agencyDropDownTypeData(responseData, mainProductCategoryID, mainUnitID, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, productCategoryData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, productCategoryData: [], loading: false})
      })
  }

  function agencyDropDownTypeData(
    productCategoryData: IProductCategoryModel[],
    mainProductCategoryID: number,
    mainUnitID: number,
    mainSearch: string
  ) {
    getAllAgencyType()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          getUnitTypeData(
            productCategoryData,
            responseData,
            mainProductCategoryID,
            mainUnitID,
            mainSearch
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyTypeData: [], loading: false})
      })
  }

  function getUnitTypeData(
    productCategoryData: IProductCategoryModel[],
    agencyTypeData: IAgencyTypeModel[],
    mainProductCategoryID: number,
    mainUnitID: number,
    mainSearch: string
  ) {
    getActiveUnit()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          getProductMasterDataByProductMasterId(
            productCategoryData,
            agencyTypeData,
            responseData,
            mainProductCategoryID,

            mainUnitID,
            mainSearch
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, defualtUnitData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, defualtUnitData: [], loading: false})
      })
  }

  function getProductMasterDataByProductMasterId(
    productCategoryData: IProductCategoryModel[],
    agencyTypeData: IAgencyTypeModel[],
    defualtUnitData: IUnitModel[],
    mainProductCategoryID: number,
    mainUnitID: number,
    mainSearch: string
  ) {
    getProductMasterByproductID(productMasterID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('productCategoryID', response.data.productCategoryID)
          formik.setFieldValue('description', response.data.description)
          formik.setFieldValue('productName', response.data.productName)
          formik.setFieldValue('length', response.data.length)
          formik.setFieldValue('height', response.data.height)
          formik.setFieldValue('depth', response.data.depth)
          formik.setFieldValue('sqft', response.data.sqft)
          formik.setFieldValue('pricePerSqFt', response.data.pricePerSqFt)
          formik.setFieldValue('defaultUnitID', response.data.defaultUnitID)
          formik.setFieldValue('agencyTypeId', response.data.agencyTypeID)
          formik.setFieldValue('agnecyPrice', response.data.agnecyPrice)
          formik.setFieldValue('minLength', response.data.minLength)
          formik.setFieldValue('minHeight', response.data.minHeight)
          formik.setFieldValue('minTotalUnit', response.data.minTotalUnit)
          setFilePath(response.data.photoPath)
          setIsActive(response.data.isActive)
          setHeight(response.data.isHeightChange)
          setIsMandatory(response.data.isMandatory)
          setAskForQuote(response.data.isAskForQuote)
          setIsMinLength(response.data.isMinLength)
          setIsMinHeight(response.data.isMinHeight)
          setIsMinTotalSqft(response.data.isMinTotalSqft)
          setIsCrarpetArea(response.data.isCrarpetArea)
          setState({
            ...state,
            selProductCategoryID: response.data.productCategoryID,
            selUnitID: response.data.defaultUnitID,
            selAgencyTypeId: response.data.agencyTypeID,
            productCategoryData,
            agencyTypeData,
            defualtUnitData,
            mainProductCategoryID,
            mainUnitID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  // -----------------upload photo----------------------
  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/Product/SaveProductPhoto', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
        setFileLoader(false)
      })
  }

  // -----------------dropdown select----------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'defaultUnitID') {
      setState({...state, selUnitID: parseInt(value)})
      formik.setFieldValue('defaultUnitID', parseInt(value))
    } else if (elementId === 'productCategoryID') {
      setState({...state, selProductCategoryID: parseInt(value)})
      formik.setFieldValue('productCategoryID', parseInt(value))
    } else if (elementId === 'agencyTypeId') {
      let tmpAgnecyPrice: number = 0
      let tmpAdminyPrice: number = 0
      let tmpCom: number = 0
      let tmpNoOfUnit: number = formik.getFieldProps('sqft').value
      let tmpPricePerUnit: number = formik.getFieldProps('pricePerSqFt').value
      const adminComPerc = event.target.selectedOptions[0].lang

      tmpAdminyPrice = tmpNoOfUnit * tmpPricePerUnit
      //  console.log(tmpAdminyPrice)

      tmpCom = (parseInt(adminComPerc) * tmpAdminyPrice) / 100
      //  console.log(tmpCom)

      tmpAgnecyPrice = tmpAdminyPrice - tmpCom
      //  console.log(tmpAgnecyPrice)

      setState({...state, selAgencyTypeId: parseInt(value)})
      formik.setFieldValue('agencyTypeId', parseInt(value))
      formik.setFieldValue('agnecyPrice', tmpAgnecyPrice)
    }
  }

  function onLengthChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpheight = formik.values
      let countMulti = (tmpValue * tmpheight.height * tmpheight.depth).toFixed(2)
      formik.setFieldValue('length', tmpValue)
      formik.setFieldValue('sqft', countMulti)
    } else return
  }

  function onHeightChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpheight = formik.values
      let countMulti = (tmpValue * tmpheight.length * tmpheight.depth).toFixed(2)
      formik.setFieldValue('height', tmpValue)
      formik.setFieldValue('sqft', countMulti)
    }
  }

  function onDepthChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpDepth = formik.values
      let countMulti = (tmpValue * tmpDepth.length * tmpDepth.height).toFixed(2)
      formik.setFieldValue('depth', tmpValue)
      formik.setFieldValue('sqft', countMulti)
    }
  }

  function onChange(e: any) {
    let tmpValue = e.target.value
    let tmpid = e.target.id
    if (!isNaN(tmpValue)) {
      formik.setFieldValue(`${tmpid}`, tmpValue)
    }
  }

  function onAgnecyPriceChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      formik.setFieldValue('agnecyPrice', tmpValue)
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProductMasterModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (isMinLength) {
          if (values.minLength <= 0) {
            toast.error(`Minumum Length is required`, {autoClose: 1000})
            return setLoading(false)
          }
        }
        if (isMinHeight) {
          if (values.minHeight <= 0) {
            toast.error(`Minumum Height is required`, {autoClose: 1000})
            return setLoading(false)
          }
        }
        if (isMinTotalSqft) {
          if (values.minTotalUnit <= 0) {
            toast.error(`Minumum No Of Unit is required`, {autoClose: 1000})
            return setLoading(false)
          }
        }
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          updateProductMaster(
            parseInt(productMasterID),
            values.productCategoryID,
            values.productName,
            filePath,
            values.description,
            values.length,
            values.height,
            values.depth,
            values.sqft,
            values.pricePerSqFt,
            values.defaultUnitID,
            isHeight,
            isMandatory,
            askForQuote,
            values.agencyTypeId,
            `${values.agnecyPrice}`,
            isActive,
            isMinLength,
            isMinHeight,
            isMinTotalSqft,
            isCrarpetArea,
            values.minLength,
            values.minHeight,
            values.minTotalUnit
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/p-product/products/list',
                  state: {
                    ProductCategoryID: state.mainProductCategoryID,
                    unitID: state.mainUnitID,
                    search: state.mainSearch,
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
        } else {
          return setLoading(false)
        }
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Product Category:</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='productCategoryID'
                  >
                    <option selected={0 === state.selProductCategoryID ? true : false} value={0}>
                      Select Product Category
                    </option>
                    {state.productCategoryData.length > 0 &&
                      state.productCategoryData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.productCategoryID}
                            selected={
                              data.productCategoryID === state.selProductCategoryID ? true : false
                            }
                          >
                            {data.productCategoryName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.productCategoryID && formik.errors.productCategoryID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.productCategoryID}</div>
                    </div>
                  )}
                </div>
                {/* </div>

              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Unit Type:</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='defaultUnitID'
                  >
                    <option selected value={0}>
                      Select Unit
                    </option>
                    {state.defualtUnitData.length > 0 &&
                      state.defualtUnitData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.unitID}
                            selected={data.unitID === state.selUnitID ? true : false}
                          >
                            {data.unitName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.defaultUnitID && formik.errors.defaultUnitID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.defaultUnitID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Product Name:
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Product Name'
                    {...formik.getFieldProps('productName')}
                  />
                  {formik.touched.productName && formik.errors.productName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.productName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Description:
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    // type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Description'
                    {...formik.getFieldProps('description')}
                  ></textarea>
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Length:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Length'
                    // value={formik.values.length}
                    {...formik.getFieldProps('length')}
                    onChange={(e) => onLengthChange(e)}
                  />
                  {formik.touched.length && formik.errors.length && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.length}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span>Is Min Length</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='IsMinLength'
                      checked={isMinLength}
                      onChange={(e) => checkedBoxs(e)}
                    />
                  </div>
                </div>
                {isMinLength && (
                  <>
                    <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                      Min Length:
                    </label>
                    <div className='col-lg-2 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='Min Length'
                        {...formik.getFieldProps('minLength')}
                      />
                      {formik.touched.minLength && formik.errors.minLength && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.minLength}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Height:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Height'
                    // value={formik.values.height}
                    {...formik.getFieldProps('height')}
                    onChange={(e) => onHeightChange(e)}
                  />
                  {formik.touched.height && formik.errors.height && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.height}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span>Is Min Height</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='IsMinHeight'
                      checked={isMinHeight}
                      onChange={(e) => checkedBoxs(e)}
                    />
                  </div>
                </div>
                {isMinHeight && (
                  <>
                    <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                      Min Height:
                    </label>
                    <div className='col-lg-2 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='Min Height'
                        {...formik.getFieldProps('minHeight')}
                      />
                      {formik.touched.minHeight && formik.errors.minHeight && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.minHeight}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Depth:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Depth'
                    {...formik.getFieldProps('depth')}
                    onChange={(e) => onDepthChange(e)}
                  />
                  {formik.touched.depth && formik.errors.depth && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.depth}</div>
                    </div>
                  )}
                </div>
                <div className='col-lg-2 fv-row'></div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span>Is Crarpet Area:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='IsCrarpetArea'
                      checked={isCrarpetArea}
                      onChange={(e) => checkedBoxs(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>No Of Unit:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='NoOfUnit'
                    id='sqft'
                    {...formik.getFieldProps('sqft')}
                    onChange={(e) => onChange(e)}
                  />
                  {formik.touched.sqft && formik.errors.sqft && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.sqft}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span>Is Min No Of Unit:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='IsMinTotalSqft'
                      checked={isMinTotalSqft}
                      onChange={(e) => checkedBoxs(e)}
                    />
                  </div>
                </div>
                {isMinTotalSqft && (
                  <>
                    <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                      Min No Of Unit:
                    </label>
                    <div className='col-lg-2 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        placeholder='Min Height'
                        {...formik.getFieldProps('minTotalUnit')}
                      />
                      {formik.touched.minTotalUnit && formik.errors.minTotalUnit && (
                        <div className='fv-plugins-message-container text-danger'>
                          <div className='fv-help-block'>{formik.errors.minTotalUnit}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Price Per Unit:
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='PricePerUnit'
                    id='pricePerSqFt'
                    // value={formik.values.pricePerSqFt}
                    {...formik.getFieldProps('pricePerSqFt')}
                    onChange={(e) => onChange(e)}
                  />
                  {formik.touched.pricePerSqFt && formik.errors.pricePerSqFt && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pricePerSqFt}</div>
                    </div>
                  )}
                </div>
                {/* </div>

              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Agency Type:
                </label>
                <div className='col-lg-2 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='agencyTypeId'
                  >
                    <option selected value={0}>
                      Agency Type
                    </option>
                    {state.agencyTypeData.length > 0 &&
                      state.agencyTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.agencyTypeID}
                            lang={data.adminCommissionPercentage}
                            selected={data.agencyTypeID === state.selAgencyTypeId ? true : false}
                          >
                            {data.agencyTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.agencyTypeId && formik.errors.agencyTypeId && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.agencyTypeId}</div>
                    </div>
                  )}
                </div>
                {/* </div>
                <div className='row mb-6'> */}
                <label
                  className={
                    state.selAgencyTypeId == 0
                      ? 'd-none'
                      : 'col-lg-2 col-form-label required fw-bold fs-6'
                  }
                >
                  Agency Price :
                </label>
                <div className={state.selAgencyTypeId == 0 ? 'd-none' : 'col-lg-2 fv-row'}>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Agency Price Per Unit'
                    onChange={(e) => onAgnecyPriceChange(e)}
                    value={formik.values.agnecyPrice}
                    // {...formik.getFieldProps('pricePerSqFt')}
                  />
                  {formik.touched.agnecyPrice && formik.errors.agnecyPrice && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.agnecyPrice}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Upload File:</span>
                  <p className='text-muted fs-7'> (allow only .png files)</p>
                </label>
                <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5'>
                    <img src={process.env.REACT_APP_API_URL + filePath} alt='img' />
                  </div>
                </div>
                <div className={filePath === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.png'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>

              <div className='row mb-6'>
                <div className='row col-6'>
                  <label className='col-lg-8 col-form-label fw-bold fs-6'>
                    <span>Is Height Change</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input mt-3'
                        type='checkbox'
                        id='IsHeightChange'
                        checked={isHeight}
                        onChange={(e) => checkedIsHeight(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className='row col-6'>
                  <label className='col-lg-8 col-form-label fw-bold fs-6'>
                    <span>Is Mandatory</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input mt-3'
                        type='checkbox'
                        checked={isMandatory}
                        onChange={(e) => checkedIsMandatory(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mb-6'>
                <div className='row col-6'>
                  <label className='col-lg-8 col-form-label fw-bold fs-6'>
                    <span className=''>isActive:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
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
                <div className='row col-6'>
                  <label className='col-lg-8 col-form-label fw-bold fs-6'>
                    <span>Ask for Quote</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input mt-3'
                        type='checkbox'
                        checked={askForQuote}
                        onChange={(e) => checkedAskForQuote(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button
                type='submit'
                className='btn btn-primary me-2'
                disabled={loading || fileLoader}
              >
                {!loading && !fileLoader && 'Save'}
                {(loading || fileLoader) && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link
                className='btn btn-danger'
                to={{
                  pathname: '/p-product/products/list',
                  state: {
                    ProductCategoryID: state.mainProductCategoryID,
                    unitID: state.mainUnitID,
                    search: state.mainSearch,
                  },
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

export {EditProductMaster}
