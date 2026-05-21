import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {
  IPhotosProductModel,
  photosProductInitValue as initialValues,
} from '../../../../models/carpetry-page/IPhotosProductModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {
  getProductImageDataByProductImageID,
  updateTurnkeyProductImageApi,
} from '../../../../modules/carpetry-master-page/carpetry-product-master-master-page/carpetry-product-photos-master/ProductPhotosCRUD'
import {IProjectTypeodel} from '../../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../../modules/project-master-page/project-master/ProjectCRUD'

const profileDetailsSchema = Yup.object().shape({
  projectTypeID: Yup.number()
    .required('Project Type Feild is required')
    .min(1, 'Project Type Feild is required'),
})

interface IProjectVendor {
  loading: boolean
  ProjectTypeData: IProjectTypeodel[]
  productID: number
  selProjectTypeID: number
  productName: string
  description: string
  mainSearch: string
  productCategoryID: number
  unitID: number
}
const EditPhotoCarpetryProduct: React.FC = () => {
  const [data, setData] = useState<IPhotosProductModel>(initialValues)
  const [fileLoader, setFileLoader] = useState(false)
  const {turnkeyProductImageID} = useParams<{turnkeyProductImageID: string}>()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IPhotosProductModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    ProjectTypeData: [] as IProjectTypeodel[],
    productID: 0,
    selProjectTypeID: 0,
    productName: '',
    description: '',
    mainSearch: '',
    productCategoryID: 0,
    unitID: 0,
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let productID: any
      let productName: any
      let description: any
      let mainSearch: string = ''
      let productCategoryID: number = 0
      let unitID: number = 0
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        productCategoryID = lc.mainProductCatgryID
        unitID = lc.mainUnitID
        productID = lc.productID
        productName = lc.productName
        description = lc.description
      }
      getPayStructureDataByID(
        productID,
        productName,
        description,
        mainSearch,
        productCategoryID,
        unitID
      )
    }, 100)
  }, [])

  function getPayStructureDataByID(
    productID: number,
    productName: string,
    description: string,
    mainSearch: string,
    productCategoryID: number,
    unitID: number
  ) {
    getProductImageDataByProductImageID(parseInt(turnkeyProductImageID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('projectTypeID', response.data.projectTypeID)
          formik.setFieldValue('filePath', response.data.filePath)
          setFilePath(response.data.filePath)
          getProjectTypeData(
            productID,
            productName,
            description,
            response.data.projectTypeID,
            mainSearch,
            productCategoryID,
            unitID
          )
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  function getProjectTypeData(
    productID: number,
    productName: string,
    description: string,
    ProjectTypeID: number,
    mainSearch: string,
    productCategoryID: number,
    unitID: number
  ) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            productID: productID,
            productName: productName,
            description: description,
            mainSearch,
            productCategoryID,
            unitID,
            selProjectTypeID: ProjectTypeID,
            ProjectTypeData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, ProjectTypeData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
      setState({...state, selProjectTypeID: parseInt(value)})
    }
  }

  const formik = useFormik<IPhotosProductModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updateTurnkeyProductImageApi(
          parseInt(turnkeyProductImageID),
          state.productID,
          values.projectTypeID,
          filePath,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: `/carpetry/product-master/photos/${state.productID}/list`,
                state: {
                  productID: state.productID,
                  productName: state.productName,
                  description: state.description,
                  searchText: state.mainSearch,
                  mainUnitID: state.unitID,
                  mainProductCatgryID: state.productCategoryID,
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

  // -----------------upload photo----------------------

  const [filePath, setFilePath] = useState<string>('')
  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL +
        `/TurnkeyProductImageMap/UploadTurnkeyProductImage/${state.productID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setFilePath(data)
        setFileLoader(false)
      })
  }

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: `/carpetry/product-master/photos/${state.productID}/list`,
              state: {
                productID: state.productID,
                productName: state.productName,
                description: state.description,
                searchText: state.mainSearch,
                mainUnitID: state.unitID,
                mainProductCatgryID: state.productCategoryID,
              },
            })
          }
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
                  Project Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='projectTypeID'
                  >
                    <option selected={state.selProjectTypeID === 0 ? true : false} value={0}>
                      Select Project Type
                    </option>
                    {state.ProjectTypeData.length > 0 &&
                      state.ProjectTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.projectTypeID}
                            selected={state.selProjectTypeID == data.projectTypeID ? true : false}
                          >
                            {data.projectType}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.projectTypeID && formik.errors.projectTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectTypeID}</div>
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
              </button>{' '}
              <button
                onClick={() =>
                  history.push({
                    pathname: `/carpetry/product-master/photos/${state.productID}/list`,
                    state: {
                      productID: state.productID,
                      productName: state.productName,
                      description: state.description,
                      searchText: state.mainSearch,
                      mainUnitID: state.unitID,
                      mainProductCatgryID: state.productCategoryID,
                    },
                  })
                }
                className='btn btn-danger ms-3'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default EditPhotoCarpetryProduct
