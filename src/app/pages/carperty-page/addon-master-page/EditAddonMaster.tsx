import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IAddonMasterModel,
  addonMasterInitValue as initialValues,
} from '../../../models/carpetry-page/IAddonMasterModel'
import {
  UpdateAddonItemApi,
  getAddonItemByIdApi,
} from '../../../modules/carpetry-master-page/addon-master-page/AddonMasterCRUD'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {getActiveProductCategoryApi} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'

const profileDetailsSchema = Yup.object().shape({
  addonItemName: Yup.string().required('Name field is required'),
  itemPrice: Yup.number().required('price field is required'),
  productCategoryID: Yup.number().required('Product Category is required'),
})
interface IAddon {
  loading: boolean
  productCategoryData: IProductCategoryModel[]
  selProductCategoryID: number
  mainSearch: string
}

const EditAddonMaster: React.FC = () => {
  const {addonItemID} = useParams<{addonItemID: string}>()
  const [filePath, setFilePath] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<IAddonMasterModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IAddonMasterModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IAddon>({
    loading: false,
    productCategoryData: [] as IProductCategoryModel[],
    selProductCategoryID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getProductDocumentDatas(mainSearch)
    }, 100)
  }, [])

  function getProductDocumentDatas(mainSearch: string) {
    getActiveProductCategoryApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          getAddonItemIdData(responseData, mainSearch)
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

  function getAddonItemIdData(productCategoryData: IProductCategoryModel[], mainSearch: string) {
    getAddonItemByIdApi(parseInt(addonItemID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('addonItemName', response.data.addonItemName)
          formik.setFieldValue('itemPrice', response.data.itemPrice)
          formik.setFieldValue('productCategoryID,', response.data.productCategoryID)
          setFilePath(response.data.filePath)
          setState({
            ...state,
            productCategoryData: productCategoryData,
            selProductCategoryID: response.data.productCategoryID,
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
    fetch(process.env.REACT_APP_API_URL + '/AddonItemMst/SaveAddonItemPhoto', {
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
    if (elementId === 'productCategoryID') {
      setState({...state, selProductCategoryID: parseInt(value)})
      formik.setFieldValue('productCategoryID', parseInt(value))
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IAddonMasterModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          UpdateAddonItemApi(
            parseInt(addonItemID),
            values.addonItemName,
            values.itemPrice,
            filePath,
            values.productCategoryID,
            user.employeeID,
            '192.66.22'
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/carpetry/addon-master/list',
                  state: {search: state.mainSearch},
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
  console.log(filePath)
  return (
    <>
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>Item Name:</label>

                <div className='col-lg-9 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Item Name'
                    {...formik.getFieldProps('addonItemName')}
                  />
                  {formik.touched.addonItemName && formik.errors.addonItemName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.addonItemName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>Price:</label>

                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Price'
                    {...formik.getFieldProps('itemPrice')}
                  />
                  {formik.touched.itemPrice && formik.errors.itemPrice && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.itemPrice}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Product Category:
                </label>
                <div className='col-lg-6 fv-row'>
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
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Upload File:</span>
                  <p className='text-muted fs-7'> (allow only .png files)</p>
                </label>
                <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5'>
                    <img src={process.env.REACT_APP_API_URL + filePath} alt='img' />
                  </div>
                </div>
                <div className={filePath === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
                  <input
                    type='file'
                    accept='.png'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
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
                to={{pathname: '/carpetry/addon-master/list', state: {search: state.mainSearch}}}
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

export {EditAddonMaster}
