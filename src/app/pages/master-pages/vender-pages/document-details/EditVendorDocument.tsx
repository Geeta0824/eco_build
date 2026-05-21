import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  IEmpDocMapModel,
  empDocMapIniValues as initialValues,
} from '../../../../models/organization-page/Employee/EmpDocMapModel'
import {IEmployeeWebModel} from '../../../../models/organization-page/Employee/IEmployeeModel'
import {
  getEmpDocMapByEmpDocMapId,
  updateEmpDocMap,
} from '../../../../modules/organization-page/employee-master-page/document-details/EmpDocMapCRUD'
import {getDocumentType} from '../../../../modules/master-page/document-type-page/DocumentTypeCRUD'
import {
  IDocumentTypeModel,
  IMediaTypeModel,
} from '../../../../models/master-page/IDocumentTypeModel'
import {getAllEmployeeList} from '../../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {getMediaTypeApi} from '../../../../modules/otherDropDowns/MediaTypeCRUD'
import Loader from '../../../common-pages/Loader'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {
  getVendorDocMapByVendorDocMapId,
  updateVendorDocMap,
} from '../../../../modules/master-page/vender-master-page/document-details/VendorDocMapCRUD'

const profileDetailsSchema = Yup.object().shape({
  documentTypeID: Yup.string().required('Document Type is required'),
  // docNumber: Yup.string().required('Document Number is required'),
  // description: Yup.string().required('Description is required'),
})

interface IEmpDocMap {
  loading: boolean
  mediaData: IMediaTypeModel[]
  documentTypeData: IDocumentTypeModel[]
  selMediaId: number
  selDocType: number
  selVenID: number
  pathUrl: string | undefined
  mainSearch: string
}

const EditVendorDocument: React.FC = () => {
  // const {empDocId} = useParams<{empDocId: string}>()
  const {vendorDocID} = useParams<{vendorDocID: string}>()
  const {vendorID} = useParams<{vendorID: string}>()
  const [fileLoader, setFileLoader] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [isActive, setIsActive] = useState(false)
  const [file, setFile] = useState('')
  const [data, setData] = useState<IEmpDocMapModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IEmpDocMapModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IEmpDocMap>({
    loading: false,
    mediaData: [] as IMediaTypeModel[],
    documentTypeData: [] as IDocumentTypeModel[],
    selMediaId: 0,
    selDocType: 0,
    selVenID: 0,
    pathUrl: process.env.REACT_APP_API_URL,
    mainSearch: '',
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      // let empID = localStorage.getItem('editEmpID')!
      // let finalempID: number = JSON.parse(empID)
      getDocumentTypeData(mainSearch)
    }, 100)
  }, [])

  function getEmpDocMapDataById(
    temDocResData: IDocumentTypeModel[],
    temMediaTypeData: IMediaTypeModel[],
    mainSearch: string
  ) {
    getVendorDocMapByVendorDocMapId(vendorDocID)
      .then((response) => {
        formik.setFieldValue('vendorID', response.data.vendorID)
        formik.setFieldValue('mediaTypeID', response.data.mediaTypeID)
        formik.setFieldValue('documentTypeID', response.data.documentTypeID)
        formik.setFieldValue('docNumber', response.data.docNumber)
        formik.setFieldValue('description', response.data.description)
        formik.setFieldValue('filePath', response.data.filePath)
        setFile(response.data.filePath)
        setIsActive(response.data.isActive)
        setState({
          ...state,
          selVenID: response.data.vendorID,
          documentTypeData: temDocResData,
          mediaData: temMediaTypeData,
          selMediaId: response.data.mediaTypeID,
          selDocType: response.data.documentTypeID,
          mainSearch,
          loading: false,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          documentTypeData: [],
          selMediaId: 0,
          selDocType: 0,
          loading: false,
        })
      })
  }

  function getMediaTypeData(
    temDocResData: IDocumentTypeModel[],
    mainSearch: string
  ) {
    getMediaTypeApi()
      .then((response) => {
        let responseData = response.data.responseObject
        getEmpDocMapDataById(temDocResData, responseData, mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, mediaData: [], loading: false})
      })
  }

  function getDocumentTypeData(mainSearch: string) {
    getDocumentType()
      .then((response) => {
        let responseData = response.data.responseObject
        getMediaTypeData(responseData, mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, documentTypeData: [], loading: false})
      })
  }

  // -----------------dropdown select----------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'mediaTypeID') {
      setState({...state, selMediaId: parseInt(value)})
      formik.setFieldValue('mediaTypeID', parseInt(value))
    } else if (elementId === 'documentTypeID') {
      formik.setFieldValue('documentTypeID', parseInt(value))
    }
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  // -----------------upload file----------------------
  const fileUpload = (e: any) => {
    if (e.target.files[0].size > 20971520) {
      return toast.error('File size has exceeded it max limit of 20MB')
    }
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(state.pathUrl + `/EmployeeDocMap/uploadEmployeeDocument/${state.selVenID}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFile(data)
        setFileLoader(false)
      })
      .catch((err) => {
        //  console.log(err)
        setFileLoader(false)
      })
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IEmpDocMapModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.mediaTypeID === 0 || state.selMediaId === 0) {
          formik.setFieldValue('mediaTypeID', 0)
          setFile('')
        }
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          updateVendorDocMap(
            parseInt(vendorDocID),
            state.selVenID,
            values.documentTypeID,
            values.docNumber,
            values.description,
            values.mediaTypeID,
            file,
            isActive,
            user.employeeID,
            '128.66.88'
          )
            .then((response) => {
              toast.success('Updated Successfull')
              history.push({
                pathname: `/vender/edit/${state.selVenID}/document/list`,
                state: {search: state.mainSearch},
              })
              setLoading(false)
            })
            .catch((error) => {
              toast.error(`${error}`)
              setLoading(false)
            })
        } else {
          return setLoading(false)
        }
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Document Type:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='documentTypeID'
                  >
                    <option selected value='0'>
                      Select Document Type
                    </option>
                    {state.documentTypeData.length > 0 &&
                      state.documentTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.documentTypeID}
                            selected={data.documentTypeID === state.selDocType ? true : false}
                          >
                            {data.documentTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.documentTypeID && formik.errors.documentTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.documentTypeID}</div>
                    </div>
                  )}
                </div>
                {/* </div>

              <div className='row mb-6'> */}
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Document Number:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Document Number'
                    {...formik.getFieldProps('docNumber')}
                  />
                  {formik.touched.docNumber && formik.errors.docNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.docNumber}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Description:</span>
                </label>
                <div className='col-lg-9 fv-row'>
                  <textarea
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    rows={3}
                    placeholder='Description..'
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Media Type:</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='mediaTypeID'
                  >
                    <option selected value={0}>
                      Select Media
                    </option>
                    {state.mediaData.length > 0 &&
                      state.mediaData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.mediaTypeID}
                            selected={data.mediaTypeID === state.selMediaId ? true : false}
                          >
                            {data.mediaType}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.mediaTypeID && formik.errors.mediaTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.mediaTypeID}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className='row mb-6'> */}
              <div className={state.selMediaId === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Upload File:</span>
                </label>

                {/* <div className='col-lg-1 d-flex align-items-center'>
                  <div className='symbol symbol-45px me-5'>
                    <img src={state.pathUrl + file} alt='img' />
                  </div>
                </div> */}
                <div className='col-lg-4 fv-row'>
                  <input
                    type='file'
                    accept='image/*,.pdf'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => fileUpload(e)}
                  />
                </div>
              </div>

              <div className={state.selMediaId !== 0 && file !== '' ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''></span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <div className='symbol symbol-75px me-5'>
                    {state.selMediaId === 1 ? (
                      <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                    ) : (
                      <img src={process.env.REACT_APP_API_URL + file} alt='img' />
                    )}
                  </div>
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='Checked'
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
                to={{
                  pathname: `/vender/edit/${state.selVenID}/document/list`,
                  state: {search: state.mainSearch},
                }}
                className='btn btn-danger ms-3'
              >
                Close
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {EditVendorDocument}
