import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IModularProductCategoryModel,
  IModularTypeModel,
  modularProductCategoryInitValue as initialValues,
} from '../../../models/modular-product-page/modular-product-category/IModularProductCategoryModel'
import {
  createModularProductCategory,
  getModularTypeListApi,
} from '../../../modules/modular-product-page/modular-product-category/ModularProductCategoryCRUD'
import Loader from '../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  productCategoryName: Yup.string().required('Name field is required'),
})

interface IEmpDocMap {
  loading: boolean
  modularTypeData: IModularTypeModel[]
  selmodularTypeID: number
  mainSearch: string
}

const AddModularProductCategory: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [filePath, setFilePath] = useState<string>('')
  const [data, setData] = useState<IModularProductCategoryModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IModularProductCategoryModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IEmpDocMap>({
    loading: false,
    modularTypeData: [] as IModularTypeModel[],
    selmodularTypeID: 0,
    mainSearch: '',
  })
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getModularTypeDatas(mainSearch)
    }, 100)
  }, [])

  function getModularTypeDatas(mainSearch: string) {
    getModularTypeListApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          setState({
            ...state,
            modularTypeData: responseData,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, modularTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, modularTypeData: [], loading: false})
      })
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
    fetch(process.env.REACT_APP_API_URL + '/ModularProductCategory/SaveModularProductCategory', {
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
    if (elementId === 'modularTypeID') {
      setState({...state, selmodularTypeID: parseInt(value)})
      formik.setFieldValue('modularTypeID', parseInt(value))
    }
  }
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IModularProductCategoryModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createModularProductCategory(
          values.productCategoryName,
          filePath,
          isActive,
          user.employeeID,
          '192.66.22',
          values.modularTypeID
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/module/product-category/list',
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{pathname: '/module/product-category/list', state: {search: state.mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Modular Type:
                </label>

                <div className='col-lg-7 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='modularTypeID'
                  >
                    <option selected={0 === state.selmodularTypeID ? true : false} value={0}>
                      Select Modular type
                    </option>
                    {state.modularTypeData.length > 0 &&
                      state.modularTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.modularTypeID}
                            selected={data.modularTypeID === state.selmodularTypeID ? true : false}
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
                to={{pathname: '/module/product-category/list', state: {search: state.mainSearch}}}
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

export {AddModularProductCategory}
