import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IProductCategoryModel,
  productCategoryInitValue as initialValues,
} from '../../../models/product-page/IProductCategoryModel'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {
  getProductCategoryByProductCategoryIdApi,
  updateProductCategory,
} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  productCategoryName: Yup.string().required('Field is required'),
})

interface IProductCategory {
  loading: boolean
  pathUrl: any
  mainSearch: string
}

const EditProductCategory: React.FC = () => {
  const location = useLocation()
  const {productCategoryId} = useParams<{productCategoryId: string}>()
  const history = useHistory()
  const [filePath, setFilePath] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [data, setData] = useState<IProductCategoryModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProductCategoryModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IProductCategory>({
    loading: false,
    pathUrl: process.env.REACT_APP_API_URL,
    mainSearch: '',
  })

  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [isActive, setIsActive] = useState(false)
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }

      getProductCategoryDataByProductCategoryId(mainSearch)
    }, 100)
  }, [])

  function getProductCategoryDataByProductCategoryId(mainSearch: string) {
    getProductCategoryByProductCategoryIdApi(productCategoryId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('productCategoryName', response.data.productCategoryName)
          setFilePath(response.data.photoPath)
          setIsActive(response.data.isActive)
          setState({...state, mainSearch, loading: false})
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
    fetch(process.env.REACT_APP_API_URL + '/ProductCategory/SaveProductCategory', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
        setFileLoader(false)
      })
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProductCategoryModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          updateProductCategory(
            parseInt(productCategoryId),
            values.productCategoryName,
            filePath,
            isActive,
            user.employeeID,
            '192.66.33'
          )
            .then((response) => {
              if (response.data.isSuccess === true) {
                toast.success('Edit Successfull')
                history.push({
                  pathname: '/p-product/product-category/list',
                  state: {search:state.mainSearch},
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
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Product Category:
                </label>

                <div className='col-lg-7 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Product Category'
                    {...formik.getFieldProps('productCategoryName')}
                  />
                  {formik.touched.productCategoryName && formik.errors.productCategoryName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.productCategoryName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Upload File:</span>
                </label>
                <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5'>
                    <img src={state.pathUrl + filePath} alt='img' />
                  </div>
                </div>
                <div className={filePath === '' ? 'col-lg-7 fv-row' : 'col-lg-6 fv-row'}>
                  <input
                    type='file'
                    // accept=''
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-7 fv-row'>
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
              <button type='submit' className='btn btn-primary' disabled={loading || fileLoader}>
                {!loading && !fileLoader && 'Save'}
                {(loading || fileLoader) && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link
                className=' btn btn-danger ms-3'
                to={{pathname: '/p-product/product-category/list', state: {search: state.mainSearch}}}
              >Cancle</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {EditProductCategory}
