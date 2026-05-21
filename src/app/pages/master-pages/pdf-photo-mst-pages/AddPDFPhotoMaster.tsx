import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation} from 'react-router-dom'
import {
  addPDFPhotosApi,
  getQuotationCateogryDropDownAPI,
} from '../../../modules/master-page/pdf-photo-master-page/PDFPhotoCRUD'
import {
  IPDFPhotoMstModel,
  pdfPhotoMstInitValue as initialValues,
  IQuotationCateogryDropDownModel,
} from '../../../models/master-page/IPDFPhotoMstModel'
import {IProjectTypeodel} from '../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'

const profileDetailsSchema = Yup.object().shape({
  quotationCategoryID: Yup.number()
    .min(1, 'quotation Cateogry Type field is required')
    .required('quotation Cateogry Type field is required'),
})

interface IDepartment {
  loading: boolean
  quoCatogryDropDownData: IQuotationCateogryDropDownModel[]
  ProjectTypeData: IProjectTypeodel[]
  selProjectTypeID: number
  selQuotationCateogryID: number
  mainSearch: string
}

const AddPDFPhotoMaster: React.FC = () => {
  const [data, setData] = useState<IPDFPhotoMstModel>(initialValues)
  const [fileLoader, setFileLoader] = useState(true)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IPDFPhotoMstModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    loading: false,
    quoCatogryDropDownData: [] as IQuotationCateogryDropDownModel[],
    ProjectTypeData: [] as IProjectTypeodel[],
    selProjectTypeID: 0,
    selQuotationCateogryID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      geQuotationCateogryDropDownData(mainSearch)
    }, 100)
  }, [])

  function geQuotationCateogryDropDownData(mainSearch: string) {
    getQuotationCateogryDropDownAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        getProjectTypeData(responseData, mainSearch)
        if (response.data.isSuccess === true) {
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, quoCatogryDropDownData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, quoCatogryDropDownData: [], loading: false})
      })
  }

  function getProjectTypeData(
    quoCatogryDropDownData: IQuotationCateogryDropDownModel[],
    mainSearch: string
  ) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            ProjectTypeData: responseData,
            quoCatogryDropDownData: quoCatogryDropDownData,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, quoCatogryDropDownData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, quoCatogryDropDownData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
      setState({...state, selProjectTypeID: parseInt(value)})
    } else if (elementId === 'quotationCategoryID') {
      formik.setFieldValue('quotationCategoryID', parseInt(value))
      setState({...state, selQuotationCateogryID: parseInt(value)})
    }
  }

  // -----------------upload photo1---------------------
  const [photoPath1, setPhotoPath1] = useState<string>('')
  const imageUpload1 = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL + `/PDFPhotos/UploadPDFPhoto1/${state.selQuotationCateogryID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setPhotoPath1(data)
        setFileLoader(false)
      })
  }

  // -----------------upload photo2---------------------
  const [photoPath2, setPhotoPath2] = useState<string>('')
  const imageUpload2 = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL + `/PDFPhotos/UploadPDFPhoto2/${state.selQuotationCateogryID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setPhotoPath2(data)
        setFileLoader(false)
      })
  }

  // -----------------upload photo3---------------------
  const [photoPath3, setPhotoPath3] = useState<string>('')
  const imageUpload3 = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL + `/PDFPhotos/UploadPDFPhoto3/${state.selQuotationCateogryID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setPhotoPath3(data)
        setFileLoader(false)
      })
  }
  // -----------------upload photo4---------------------
  const [photoPath4, setPhotoPath4] = useState<string>('')
  const imageUpload4 = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL + `/PDFPhotos/UploadPDFPhoto4/${state.selQuotationCateogryID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setPhotoPath4(data)
        setFileLoader(false)
      })
  }
  // -----------------upload page2PhotoPath---------------------
  const [page2PhotoPath, setPage2PhotoPath] = useState<string>('')
  const uploadPage2PhotoPath = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL +
        `/PDFPhotos/UploadPage2PhotoPath/${state.selQuotationCateogryID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setPage2PhotoPath(data)
        setFileLoader(false)
      })
  }
  // ------------------upload page3_Optional---------------------
  const [photoPage3_OptionalPath, setPhotoPage3_OptionalPath] = useState<string>('')
  const imageUploadPage3_Optional = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL +
        `/PDFPhotos/UploadPage3OptionalPhotoPath/${state.selQuotationCateogryID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setPhotoPage3_OptionalPath(data)
        setFileLoader(false)
      })
  }
  // ------------------upload page4_Optional---------------------
  const [photoPage4_OptionalPath, setPhotoPage4_OptionalPath] = useState<string>('')
  const imageUploadPage4_Optional = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL +
        `/PDFPhotos/UploadPage4OptionalPhotoPath/${state.selQuotationCateogryID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setPhotoPage4_OptionalPath(data)
        setFileLoader(false)
      })
  }
  // ===========================================
  const formik = useFormik<IPDFPhotoMstModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addPDFPhotosApi(
          values.quotationCategoryID,
          values.projectTypeID,
          photoPath1,
          photoPath2,
          photoPath3,
          photoPath4,
          page2PhotoPath,
          photoPage3_OptionalPath,
          photoPage4_OptionalPath,
          user.employeeID
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/master/pdf-photo-mst/list',
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
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/master/pdf-photo-mst/list',
              state: {search: state.mainSearch},
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
                  Quotation Category Type:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='quotationCategoryID'
                  >
                    <option selected={state.selQuotationCateogryID === 0 ? true : false} value={0}>
                      Select Quotation Category Type
                    </option>
                    {state.quoCatogryDropDownData.length > 0 &&
                      state.quoCatogryDropDownData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.quotationCategoryID}
                            selected={
                              state.selQuotationCateogryID == data.quotationCategoryID
                                ? true
                                : false
                            }
                          >
                            {data.quotationCategoryName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.quotationCategoryID && formik.errors.quotationCategoryID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.quotationCategoryID}</div>
                    </div>
                  )}
                </div>
                <label
                  className={
                    state.selQuotationCateogryID === 1
                      ? 'col-lg-2 col-form-label fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  Project Type:
                </label>
                <div className={state.selQuotationCateogryID === 1 ? 'col-lg-4 fv-row' : 'd-none'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='projectTypeID'
                  >
                    <option selected={state.selProjectTypeID === 0 ? true : false} value={0}>
                      Select Type
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
                  <span className='d-block'>Page1 Photo :</span>
                  {/* <span className='d-block'>Upload Photo 1 :</span> */}
                  <p className='text-muted fs-7'> Size(1210 * 1712) only .jpg</p>
                </label>
                <div
                  className={photoPath1 === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}
                >
                  <div className='symbol symbol-45px me-5'>
                    {/* <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' /> */}
                  </div>
                </div>
                <div className={photoPath1 === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload1(e)}
                  />
                </div>{' '}
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Page2 Photo :</span>
                  <p className='text-muted fs-7'> Size(1210 * 1712) only .jpg</p>
                </label>
                <div
                  className={
                    page2PhotoPath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'
                  }
                >
                  <div className='symbol symbol-45px me-5'>
                    {/* <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' /> */}
                  </div>
                </div>
                <div className={page2PhotoPath === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => uploadPage2PhotoPath(e)}
                  />
                </div>{' '}
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Page3_Optional Photo :</span>
                  {/* <span className='d-block'>Upload Photo 2 :</span> */}
                  <p className='text-muted fs-7'>Size(1210 * 441) only .jpg</p>
                </label>
                <div
                  className={photoPage3_OptionalPath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}
                >
                  <div className='symbol symbol-45px me-5'>
                    {/* <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' /> */}
                  </div>
                </div>
                <div className={photoPage3_OptionalPath === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUploadPage3_Optional(e)}
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Page4_Optional Photo :</span>
                  {/* <span className='d-block'>Upload Photo 3 :</span> */}
                  <p className='text-muted fs-7'> Size(1170 * 818) only .jpg</p>
                </label>
                <div
                  className={photoPage4_OptionalPath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}
                >
                  <div className='symbol symbol-45px me-5'>
                    {/* <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' /> */}
                  </div>
                </div>
                <div className={photoPage4_OptionalPath === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUploadPage4_Optional(e)}
                  />
                </div>{' '}
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Page3_1 Photo :</span>
                  {/* <span className='d-block'>Upload Photo 2 :</span> */}
                  <p className='text-muted fs-7'>Size(1210 * 441) only .jpg</p>
                </label>
                <div
                  className={photoPath2 === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}
                >
                  <div className='symbol symbol-45px me-5'>
                    {/* <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' /> */}
                  </div>
                </div>
                <div className={photoPath2 === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload2(e)}
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Page3_2 Photo :</span>
                  {/* <span className='d-block'>Upload Photo 3 :</span> */}
                  <p className='text-muted fs-7'> Size(1170 * 818) only .jpg</p>
                </label>
                <div
                  className={photoPath3 === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}
                >
                  <div className='symbol symbol-45px me-5'>
                    {/* <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' /> */}
                  </div>
                </div>
                <div className={photoPath3 === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload3(e)}
                  />
                </div>{' '}
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Page4 Photo :</span>
                  {/* <span className='d-block'>Upload Photo 4 :</span> */}
                  <p className='text-muted fs-7'> Size(1170 * 818) only .jpg</p>
                </label>
                <div
                  className={photoPath4 === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}
                >
                  <div className='symbol symbol-45px me-5'>
                    {/* <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' /> */}
                  </div>
                </div>
                <div className={photoPath4 === '' ? 'col-lg-10 fv-row' : 'col-lg-9 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload4(e)}
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
                    pathname: '/master/pdf-photo-mst/list',
                    state: {search: state.mainSearch},
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
export default AddPDFPhotoMaster
