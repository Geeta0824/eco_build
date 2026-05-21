import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {
  IPackageModel,
  packageInitValues as initialValues,
} from '../../models/package-page/IPackageModel'
import {IBHKMasterModel} from '../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../models/master-page/ICarpetAreaModel'
import {getActiveBHKApi} from '../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {
  createNewPackageApi,
  geMultipleDropdownListCarpetryPkgApi,
} from '../../modules/package-master-page/PackageCRUD'
import Loader from '../common-pages/Loader'
import {IProjectTypeodel} from '../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../modules/project-master-page/project-master/ProjectCRUD'

const profileDetailsSchema = Yup.object().shape({
  packageName: Yup.string().required('Package Name field is required'),
  projectTypeID: Yup.number()
    .min(1, 'Project Type field is required')
    .required('Project Type field is required'),
})

interface IPremium {
  loading: boolean
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  ProjectTypeData: IProjectTypeodel[]
  selBHKID: number
  selCarpetAreaID: number
  selProjectTypeID: number
  fullName: string
  mianBhkID: number
  mainCarpetAreaID: number
  mainProjectTypeID: number
  mainSearch: string
}

const AddPackage: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const [data, setData] = useState<IPackageModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IPackageModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IPremium>({
    loading: true,
    bhkData: [] as IBHKMasterModel[],
    carpetAreaData: [] as ICarpetAreaModel[],
    ProjectTypeData: [] as IProjectTypeodel[],
    selBHKID: 0,
    selCarpetAreaID: 0,
    selProjectTypeID: 0,
    fullName: '',
    mianBhkID: 0,
    mainCarpetAreaID: 0,
    mainProjectTypeID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mianBhkID: number = 0
      var mainCarpetAreaID: number = 0
      var mainProjectTypeID: number = 0
      var mainSearch: string = ''
      if (lc !== undefined) {
        mianBhkID = lc.bhkId
        mainCarpetAreaID = lc.carpetAreaId
        mainProjectTypeID = lc.projectTypeId

        mainSearch = lc.searchText
      }
      // getBHKData()
      getMultipleDropdownListCarpetryPkgData(
        mianBhkID,
        mainCarpetAreaID,
        mainProjectTypeID,
        mainSearch
      )
    }, 100)
  }, [])

  function getMultipleDropdownListCarpetryPkgData(
    mianBhkID: number,
    mainCarpetAreaID: number,
    mainProjectTypeID: number,
    mainSearch: string
  ) {
    geMultipleDropdownListCarpetryPkgApi()
      .then((response) => {
        let bhkData = response.data.bhkList
        let carpetAreaData = response.data.carpetAreaList
        let projectTypeData = response.data.projectTypeList
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            ProjectTypeData: projectTypeData,
            carpetAreaData: carpetAreaData,
            bhkData: bhkData,
            mianBhkID,
            mainCarpetAreaID,
            mainProjectTypeID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, carpetAreaData: [], ProjectTypeData: []})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: [], ProjectTypeData: []})
      })
  }

  // function getBHKData() {
  //   getActiveBHKApi()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getCarpetAreaData(responseData)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, bhkData: [], loading: false})
  //     })
  // }

  // function getCarpetAreaData(bhkData: IBHKMasterModel[]) {
  //   getAllCarpetArea()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getProjectTypeData(bhkData, responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, carpetAreaData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: [], loading: false})
  //     })
  // }

  // function getProjectTypeData(bhkData: IBHKMasterModel[], carpetAreaData: ICarpetAreaModel[]) {
  //   GetProjectTypeDropdownListAPI()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         setState({
  //           ...state,
  //           ProjectTypeData: responseData,
  //           carpetAreaData: carpetAreaData,
  //           bhkData: bhkData,
  //           loading: false,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, carpetAreaData: [], ProjectTypeData: []})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: [], ProjectTypeData: []})
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
    } else if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
      setState({...state, selProjectTypeID: parseInt(value)})
    }
  }

  const [photo, setPhoto] = useState('')
  const [fileLoader, setFileLoader] = useState(false)
  const imageUpload = (e: any) => {
    if (e.target.files[0].size > 20971520) {
      return toast.error('File size has exceeded it max limit of 20MB')
    }
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)

    fetch(process.env.REACT_APP_API_URL + `/Package/SavePackagePhoto`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        if (data.isSuccess === true) {
          setPhoto(data.photoPath)
          setFileLoader(false)
        } else {
          toast.error(`${data.message}`)
          setFileLoader(false)
        }
      })
      .catch((err) => {
        toast.error(`${err.message}`)
        setFileLoader(false)
      })
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IPackageModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createNewPackageApi(
          values.packageName,
          values.carpetAreaID,
          values.bhkid,
          values.projectTypeID,
          user.employeeID,
          '192.66.22',
          photo
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              let resData = response.data
              history.push({
                pathname: `/package/add-cart/${response.data.packageID}`,
                state: {
                  packageID: resData.packageID,
                  packageName: resData.packageName,
                  bhkName: resData.bhkName,
                  carpetAreaName: resData.carpetArea,
                  projectType: resData.projectType,
                  photoPath: process.env.REACT_APP_API_URL + resData.photoPath,
                  mianBhkID: state.mianBhkID,
                  mainCarpetAreaID: state.mainCarpetAreaID,
                  mainProjectTypeId: state.mainProjectTypeID,
                  mainSearch: state.mainSearch,
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
                  Package Name:
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg'
                    placeholder='Package Name'
                    {...formik.getFieldProps('packageName')}
                  />
                  {formik.touched.packageName && formik.errors.packageName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.packageName}</div>
                    </div>
                  )}
                </div>
              </div>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>BHK:</label>
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
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Carpet Area:</label>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Photo Path:</span>
                </label>
                <div className={photo == '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5'>
                    <img src={process.env.REACT_APP_API_URL + photo} alt='img' />
                  </div>
                </div>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='file'
                    // accept=''
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
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
                className='btn btn-danger ms-3'
                to={{
                  pathname: '/package/list',
                  state: {
                    BHKID: state.mianBhkID,
                    carpetAreaID: state.mainCarpetAreaID,
                    projectTypeID: state.mainProjectTypeID,
                    searchText: state.mainSearch,
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

export {AddPackage}
