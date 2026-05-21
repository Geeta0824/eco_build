import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {
  getPdfPhotosByPdfPhotosIDApi,
  getQuotationCateogryDropDownAPI,
  updatePDFPhotosApi,
} from '../../../modules/master-page/pdf-photo-master-page/PDFPhotoCRUD'
import {
  IPDFPhotoMstModel,
  pdfPhotoMstInitValue as initialValues,
  IQuotationCateogryDropDownModel,
} from '../../../models/master-page/IPDFPhotoMstModel'
import {IProjectTypeodel} from '../../../models/projects-page/IProjectsModel'
import {GetProjectTypeDropdownListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {KTSVG} from '../../../../_Ecd/helpers'
const profileDetailsSchema = Yup.object().shape({
  quotationCategoryID: Yup.number().required('quotation Cateogry Type field is required'),
})

interface IDepartment {
  loading: boolean
  quoCatogryDropDownData: IQuotationCateogryDropDownModel[]
  ProjectTypeData: IProjectTypeodel[]
  selProjectTypeID: number
  selQuotationCateogryID: number
  mainSearch: string
}

const EditPDFPhotoMaster: React.FC = () => {
  const [data, setData] = useState<IPDFPhotoMstModel>(initialValues)
  const [fileLoader, setFileLoader] = useState(true)
  const {pdfPhotoID} = useParams<{pdfPhotoID: string}>()
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
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      geQuotationCateogryDropDownData(mainSearch)
    }, 100)
  }, [])

  function geQuotationCateogryDropDownData(mainSearch: string) {
    getQuotationCateogryDropDownAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          DNCPdfPhotosByPdfPhotosID(responseData, mainSearch)
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
  function DNCPdfPhotosByPdfPhotosID(
    quoCatogryDropDownData: IQuotationCateogryDropDownModel[],
    mainSearch: string
  ) {
    getPdfPhotosByPdfPhotosIDApi(parseInt(pdfPhotoID))
      .then((response) => {
        if (response.data.isSuccess === true) {
          formik.setFieldValue('quotationCateogryID', response.data.quotationCategoryID)
          formik.setFieldValue('projectTypeID', response.data.projectTypeID)
          formik.setFieldValue('photoPath1', response.data.photo1Path)
          formik.setFieldValue('photoPath2', response.data.photo2Path)
          formik.setFieldValue('photoPath3', response.data.photo3Path)
          formik.setFieldValue('photoPath4', response.data.photo4Path)
          formik.setFieldValue('page2PhotoPath', response.data.page2PhotoPath)
          formik.setFieldValue('page3_OptionalPath', response.data.page3_OptionalPath)
          formik.setFieldValue('page4_OptionalPath', response.data.page4_OptionalPath)
          formik.setFieldValue('quotationCategoryName', response.data.quotationCategoryName)
          formik.setFieldValue('projectTypeName', response.data.projectTypeName)
          setPhotoPath1(response.data.photo1Path)
          setPhotoPath2(response.data.photo2Path)
          setPhotoPath3(response.data.photo3Path)
          setPhotoPath4(response.data.photo4Path)
          setPage2PhotoPath(response.data.page2PhotoPath)
          setPage3_OptionalPath(response.data.page3_OptionalPath)
          setPage4_OptionalPath(response.data.page4_OptionalPath)
          getProjectTypeData(
            quoCatogryDropDownData,
            response.data.quotationCategoryID,
            response.data.projectTypeID,
            mainSearch
          )
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

  function getProjectTypeData(
    quoCatogryDropDownData: IQuotationCateogryDropDownModel[],
    QuotationCategoryID: number,
    ProjectTypeID: number,
    mainSearch: string
  ) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            quoCatogryDropDownData: quoCatogryDropDownData,
            selQuotationCateogryID: QuotationCategoryID,
            selProjectTypeID: ProjectTypeID,
            ProjectTypeData: responseData,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, quoCatogryDropDownData: [], ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, quoCatogryDropDownData: [], ProjectTypeData: [], loading: false})
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

  // function checkedFunction(event: any) {
  //   setIsActive(event.target.checked)
  // }

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
      process.env.REACT_APP_API_URL + `/PDFPhotos/UploadPDFPhoto3/${state.selQuotationCateogryID}`,
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
  const [page3_OptionalPath, setPage3_OptionalPath] = useState<string>('')
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
        setPage3_OptionalPath(data)
        setFileLoader(false)
      })
  }
  // ------------------upload page4_Optional---------------------
  const [page4_OptionalPath, setPage4_OptionalPath] = useState<string>('')
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
        setPage4_OptionalPath(data)
        setFileLoader(false)
      })
  }
  //   =============================
  const formik = useFormik<IPDFPhotoMstModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updatePDFPhotosApi(
          parseInt(pdfPhotoID),
          state.selQuotationCateogryID,
          state.selProjectTypeID,
          photoPath1,
          photoPath2,
          photoPath3,
          photoPath4,
          page2PhotoPath,
          page3_OptionalPath,
          page4_OptionalPath,
          user.employeeID
          //   '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
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
                  className={
                    photoPath1 === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center mb-9'
                  }
                >
                  <div className='symbol symbol-50px me-5 mx-2'>
                    <img src={process.env.REACT_APP_API_URL + photoPath1} alt='img' />
                  </div>

                  <div
                    className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                    onClick={() => setPhotoPath1('')}
                    title='Remove Photo'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen027.svg'
                      className='ssvg-icon- svg-icon-danger'
                    />
                  </div>
                </div>
                <div className={photoPath1 === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
                  <input
                    type='file'
                    accept='.jpg'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload1(e)}
                  />
                </div>{' '}
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6 '>
                  <span className='d-block'>Page2 Photo :</span>
                  <p className='text-muted fs-7'> Size(1210 * 1712) only .jpg</p>
                </label>
                <div
                  className={
                    page2PhotoPath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center mb-9'
                  }
                >
                  <div className='symbol symbol-50px me-5 mx-2'>
                    <img src={process.env.REACT_APP_API_URL + page2PhotoPath} alt='img' />
                  </div>

                  <div
                    className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                    onClick={() => setPage2PhotoPath('')}
                    title='Remove Photo'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen027.svg'
                      className='ssvg-icon- svg-icon-danger'
                    />
                  </div>
                </div>
                <div className={page2PhotoPath === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
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
                  className={
                    page3_OptionalPath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center mb-9'
                  }
                >
                  {/* <div className='col-lg-1 d-flex align-items-center mb-9'> */}
                  <div className='symbol symbol-50px me-5 mx-2'>
                    <img src={process.env.REACT_APP_API_URL + page3_OptionalPath} alt='img' />
                  </div>
                  <div
                    className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                    onClick={() => setPage3_OptionalPath('')}
                    title='Remove Photo'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen027.svg'
                      className='ssvg-icon- svg-icon-danger'
                    />
                  </div>
                  {/* </div> */}
                </div>
                <div className={page3_OptionalPath === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
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
                  className={
                    page4_OptionalPath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center mb-9'
                  }
                >
                  {/* <div className='col-lg-1 d-flex align-items-center mb-9'> */}
                  <div className='symbol symbol-50px me-5 mx-2'>
                    <img src={process.env.REACT_APP_API_URL + page4_OptionalPath} alt='img' />
                  </div>
                  <div
                    className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                    onClick={() => setPage4_OptionalPath('')}
                    title='Remove Photo'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen027.svg'
                      className='ssvg-icon- svg-icon-danger'
                    />
                  </div>
                  {/* </div> */}
                </div>
                <div className={page4_OptionalPath === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
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
                  className={
                    photoPath2 === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center mb-9'
                  }
                >
                  <div className='symbol symbol-50px me-5 mx-2'>
                    <img src={process.env.REACT_APP_API_URL + photoPath2} alt='img' />
                  </div>
                  <div
                    className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                    onClick={() => setPhotoPath2('')}
                    title='Remove Photo'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen027.svg'
                      className='ssvg-icon- svg-icon-danger'
                    />
                  </div>
                </div>
                <div className={photoPath2 === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
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
                  className={
                    photoPath3 === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center mb-9'
                  }
                >
                  <div className='symbol symbol-50px me-5 mx-2'>
                    <img src={process.env.REACT_APP_API_URL + photoPath3} alt='img' />
                  </div>
                  <div
                    className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                    onClick={() => setPhotoPath3('')}
                    title='Remove Photo'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen027.svg'
                      className='ssvg-icon- svg-icon-danger'
                    />
                  </div>
                </div>
                <div className={photoPath3 === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
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
                  className={
                    photoPath4 === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center mb-9'
                  }
                >
                  <div className='symbol symbol-50px me-5 mx-2'>
                    <img src={process.env.REACT_APP_API_URL + photoPath4} alt='img' />
                  </div>
                  <div
                    className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                    onClick={() => setPhotoPath4('')}
                    title='Remove Photo'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen027.svg'
                      className='ssvg-icon- svg-icon-danger'
                    />
                  </div>
                </div>
                <div className={photoPath4 === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
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
export default EditPDFPhotoMaster
