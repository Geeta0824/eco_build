import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IProductCategoryModel,
  productCategoryInitValue as initialValues,
} from '../../../models/product-page/IProductCategoryModel'
import {createProductCategory} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'

const profileDetailsSchema = Yup.object().shape({
  productCategoryName: Yup.string().required('Name field is required'),
})

const AddProductCategory: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [filePath, setFilePath] = useState<string>('')
  const [data, setData] = useState<IProductCategoryModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProductCategoryModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      tmpProductCatSerachFun(mainSearch)
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  function tmpProductCatSerachFun(mainSearch: string) {
    setLoading(false)
    setSearchText(mainSearch)
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

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProductCategoryModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createProductCategory(
          values.productCategoryName,
          filePath,
          isActive,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/p-product/product-category/list',
                state: {search: searchText},
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
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Product Category Name:
                </label>

                <div className='col-lg-7 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Product Category Name'
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
                    <img src={process.env.REACT_APP_API_URL + filePath} alt='img' />
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
              <Link className=' btn btn-danger ms-3' to={{pathname:'/p-product/product-category/list',state:{search:searchText}}}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {AddProductCategory}
