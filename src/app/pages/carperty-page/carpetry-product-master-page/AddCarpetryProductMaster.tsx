import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IUnitModel} from '../../../models/master-page/IUnitModel'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {getActiveUnit} from '../../../modules/master-page/unit-master-page/UnitCRUD'
import {
  getActiveProductCategoryApi,
  getMultiDropdownForCarpetryProdApi,
} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {createTurnkeyProductMaster} from '../../../modules/carpetry-master-page/carpetry-product-master-master-page/CarpetryProductMasterCRUD'
import {
  IProductMasterModel,
  productInitValue as initialValues,
} from '../../../models/carpetry-page/ITurnkeyProductMasterModel'

const profileDetailsSchema = Yup.object().shape({
  productCategoryID: Yup.number()
    .required('Product category is required')
    .min(1, 'Product category is required'),
  defaultUnitID: Yup.number()
    .required('Default unit is required')
    .min(1, 'defaultUnitID is required'),
  productName: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  length: Yup.number().required('Length is required').min(1, 'Length is required'),
  height: Yup.number().required('Height is required').min(1, 'Height is required'),
  depth: Yup.number().required('Depth is required').min(1, 'Depth is required'),
  noOfUnit: Yup.string().required('No of unit is required').min(1, 'No of unit is required'),
  pricePerSqFt: Yup.number().required('Price per unit is required'),
})
interface IEmpDocMap {
  loading: boolean
  productCategoryData: IProductCategoryModel[]
  defualtUnitData: IUnitModel[]
  selProductCategoryID: number
  selUnitID: number
  mainSearch: string
  productCategoryID: number
  unitID: number
}

const AddCarpetryProductMaster: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const [isHeight, setHeight] = useState(false)
  const [isMadatory, setIsMadatory] = useState(false)
  const [askForQuote, setAskForQuote] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [filePath, setFilePath] = useState<string>('')
  const [data, setData] = useState<IProductMasterModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProductMasterModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IEmpDocMap>({
    loading: false,
    productCategoryData: [] as IProductCategoryModel[],
    defualtUnitData: [] as IUnitModel[],
    selProductCategoryID: 0,
    selUnitID: 0,
    mainSearch: '',
    productCategoryID: 0,
    unitID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let mainSearch: string = ''
      let productCategoryID: number = 0
      let unitID: number = 0
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        productCategoryID = lc.mainProductCatgryID
        unitID = lc.mainUnitID
      }
      getMultiDropdownForCarpetryProdData(mainSearch, productCategoryID, unitID)
    }, 100)
  }, [])

  function getMultiDropdownForCarpetryProdData(
    mainSearch: string,
    productCategoryID: number,
    unitID: number
  ) {
    getMultiDropdownForCarpetryProdApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let proCateListData = response.data.proCateList
          let unitListData = response.data.unitList
          setState({
            ...state,
            productCategoryData: proCateListData,
            defualtUnitData: unitListData,
            mainSearch,
            productCategoryID,
            unitID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, productCategoryData: [], defualtUnitData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, productCategoryData: [], defualtUnitData: [], loading: false})
      })
  }
  // function getProductDocumentDatas() {
  //   getActiveProductCategoryApi()
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         let responseData = response.data.responseObject
  //         getUnitTypeData(responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, productCategoryData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, productCategoryData: [], loading: false})
  //     })
  // }

  // function getUnitTypeData(productCategoryData: IProductCategoryModel[]) {
  //   getActiveUnit()
  //     .then((response) => {
  //       if (response.data.isSuccess == true) {
  //         let responseData = response.data.responseObject
  //         setState({
  //           ...state,
  //           productCategoryData: productCategoryData,
  //           defualtUnitData: responseData,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, productCategoryData: [], defualtUnitData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, productCategoryData: [], defualtUnitData: [], loading: false})
  //     })
  // }

  function checkedIsHeight(event: any) {
    setHeight(event.target.checked)
  }
  function checkedIsMadatory(event: any) {
    setIsMadatory(event.target.checked)
  }
  function checkedAskForQuote(event: any) {
    setAskForQuote(event.target.checked)
  }
  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  // -----------------upload photo----------------------
  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/CarpentryProduct/SaveTurnkeyProductPhoto', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
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
    }
  }

  function onLengthChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpheight = formik.values
      let countMulti = (tmpValue * tmpheight.height * tmpheight.depth).toFixed(2)
      formik.setFieldValue('length', tmpValue)
      //   formik.setFieldValue('sqft', countMulti)
    } else return
  }

  function onHeightChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpheight = formik.values
      //   let countMulti = (tmpValue * tmpheight.length * tmpheight.depth).toFixed(2)
      formik.setFieldValue('height', tmpValue)
      //   formik.setFieldValue('sqft', countMulti)
    }
  }

  function onDepthChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpDepth = formik.values
      //   let countMulti = (tmpValue * tmpDepth.length * tmpDepth.height).toFixed(2)
      formik.setFieldValue('depth', tmpValue)
      //   formik.setFieldValue('sqft', countMulti)
    }
  }

  function onNoOfUnitChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpNoOfUnit = formik.values
      formik.setFieldValue('sqft', tmpValue)
    }
  }

  function onTurnkeyQtyChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      const tmpNoOfUnit = formik.values
      formik.setFieldValue('noOfUnit', tmpValue)
    }
  }
  function onPricePerUnitChange(e: any) {
    let tmpValue = e.target.value
    if (!isNaN(tmpValue)) {
      formik.setFieldValue('pricePerSqFt', tmpValue)
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProductMasterModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createTurnkeyProductMaster(
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
          isMadatory,
          askForQuote,
          isActive,
          `${values.noOfUnit}`
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/carpetry/product-master/list',
                state: {
                  search: state.mainSearch,
                  UnitID: state.unitID,
                  ProductCategoryID: state.productCategoryID,
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
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 me-7 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/carpetry/product-master/list',
              state: {
                search: state.mainSearch,
                UnitID: state.unitID,
                ProductCategoryID: state.productCategoryID,
              },
            })
          }
        >
          Back To List
        </span>
      </div>
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Product Category:
                </label>
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Unit Type:</label>
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
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Length'
                    onChange={(e) => onLengthChange(e)}
                    value={formik.values.length}
                    // {...formik.getFieldProps('length')}
                  />
                  {formik.touched.length && formik.errors.length && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.length}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Height:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Height'
                    onChange={(e) => onHeightChange(e)}
                    value={formik.values.height}
                    // {...formik.getFieldProps('height')}
                  />
                  {formik.touched.height && formik.errors.height && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.height}</div>
                    </div>
                  )}
                </div>
                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Depth:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Depth'
                    onChange={(e) => onDepthChange(e)}
                    value={formik.values.depth}
                    // {...formik.getFieldProps('depth')}
                  />
                  {formik.touched.depth && formik.errors.depth && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.depth}</div>
                    </div>
                  )}
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
                    onChange={(e) => onNoOfUnitChange(e)}
                    value={formik.values.sqft}
                    // {...formik.getFieldProps('sqft')}
                  />
                  {formik.touched.sqft && formik.errors.sqft && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.sqft}</div>
                    </div>
                  )}
                </div>

                {/* </div>
              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Price Per Unit:
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='PricePerUnit'
                    onChange={(e) => onPricePerUnitChange(e)}
                    value={formik.values.pricePerSqFt}
                    // {...formik.getFieldProps('pricePerSqFt')}
                  />
                  {formik.touched.pricePerSqFt && formik.errors.pricePerSqFt && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.pricePerSqFt}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Turnkey Qty:
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    // type='number'
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Turnkey Qty'
                    // onChange={(e) => onTurnkeyQtyChange(e)}
                    // value={formik.values.noOfUnit}
                    {...formik.getFieldProps('noOfUnit')}
                    // {...formik.getFieldProps('sqft')}
                  />
                  {formik.touched.noOfUnit && formik.errors.noOfUnit && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.noOfUnit}</div>
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
                    {/* <img src={process.env.REACT_APP_API_URL + filePath} alt='img' /> */}
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
                        onChange={(e) => checkedIsMadatory(e)}
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
                        onChange={(e) => checkedAskForQuote(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading || fileLoader}>
                {!loading && !fileLoader && 'Save'}
                {(loading || fileLoader) && (
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
    </>
  )
}

export {AddCarpetryProductMaster}
