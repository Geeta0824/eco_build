import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup'
import {
  IStandardQuotationModel,
  standardQuotationInitValues as initialValues,
} from '../../models/IStandardQuotationModel'
// import {createStandardQuotation} from '../../modules/product-master-page/satndard-quotation-page/StandardQuotationCRUD'
import {IBHKMasterModel} from '../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../models/master-page/ICarpetAreaModel'
import {getActiveBHKApi} from '../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {
  createStandardQuotation,
  getStandardQuotationByStandardQuotationId,
  updatStandardQuotation,
} from '../../modules/standard-quotation-master-page/StandardQuotationCRUD'
import {toAbsoluteUrl} from '../../../_Ecd/helpers'
import {geMultipleDropdownListCarpetryPkgApi} from '../../modules/package-master-page/PackageCRUD'
import {IProjectTypeodel} from '../../models/projects-page/IProjectsModel'

const profileDetailsSchema = Yup.object().shape({
  bhkID: Yup.number().min(1, 'BHK field is required').required('BHK field is required'),
  projectTypeID: Yup.number().min(1, 'Type field is required').required('Type field is required'),
  carpetAreaID: Yup.number()
    .min(1, 'Carpet Area field is required')
    .required('Carpet Area field is required'),
})
interface IStandard {
  loading: boolean
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  projectTypeData: IProjectTypeodel[]
  selBHKID: number
  selCarpetAreaID: number
  selProjectTypeID: number
  mainBHKID: number
  mainCarpetAreaID: number
  mainSearch: string
}

const EditStandardQuotation: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const {standardQuotationId} = useParams<{standardQuotationId: string}>()
  const [isActive, setIsActive] = useState(false)
  const [filePath, setFilePath] = useState<string>('')
  const [data, setData] = useState<IStandardQuotationModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IStandardQuotationModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IStandard>({
    loading: false,
    bhkData: [] as IBHKMasterModel[],
    carpetAreaData: [] as ICarpetAreaModel[],
    projectTypeData: [] as IProjectTypeodel[],
    selBHKID: 0,
    selCarpetAreaID: 0,
    selProjectTypeID: 0,
    mainBHKID: 0,
    mainCarpetAreaID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainBHKID: number = 0
      var mainCarpetAreaID: number = 0
      var mainSearch: string = ''
      if (
        lc.mainBHKID !== undefined ||
        lc.mainCarpetAreaID !== undefined ||
        lc.mainSearch !== undefined
      ) {
        mainBHKID = lc.mainBHKID
        mainCarpetAreaID = lc.mainCarpetAreaID
        mainSearch = lc.mainSearch
      }
      getMultipleDropdownListCarpetryPkgData(mainBHKID, mainCarpetAreaID, mainSearch)
      // getBHKData()
    }, 100)
  }, [])

  function getMultipleDropdownListCarpetryPkgData(
    mainBHKID: number,
    mainCarpetAreaID: number,
    mainSearch: string
  ) {
    geMultipleDropdownListCarpetryPkgApi()
      .then((response) => {
        let bhkData = response.data.bhkList
        let carpetAreaData = response.data.carpetAreaList
        let projectTypeData = response.data.projectTypeList
        if (response.data.isSuccess === true) {
          // setState({...state, bhkData, carpetAreaData, projectTypeData})
          getStandardQuotationDataByStandardQuotationId(
            bhkData,
            carpetAreaData,
            projectTypeData,
            mainBHKID,
            mainCarpetAreaID,
            mainSearch
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, carpetAreaData: [], projectTypeData: [], bhkData: []})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: [], projectTypeData: [], bhkData: []})
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
  //       getStandardQuotationDataByStandardQuotationId(bhkData, responseData)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: [], loading: false})
  //     })
  // }

  function getStandardQuotationDataByStandardQuotationId(
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    projectTypeData: IProjectTypeodel[],
    mainBHKID: number,
    mainCarpetAreaID: number,
    mainSearch: string
  ) {
    getStandardQuotationByStandardQuotationId(parseInt(standardQuotationId))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('standarQuotationPDFID', response.data.standarQuotationPDFID)
          formik.setFieldValue('bhkID', response.data.bhkID)
          formik.setFieldValue('carpetAreaID', response.data.carpetAreaID)
          formik.setFieldValue('projectTypeID', response.data.projectTypeID)
          setFilePath(response.data.filePath)
          setIsActive(response.data.isActive)
          setState({
            ...state,
            bhkData,
            carpetAreaData,
            projectTypeData,
            selBHKID: response.data.bhkID,
            selCarpetAreaID: response.data.carpetAreaID,
            selProjectTypeID: response.data.projectTypeID,
            mainBHKID,
            mainCarpetAreaID,
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

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'bhkID') {
      formik.setFieldValue('bhkID', parseInt(value))
    } else if (elementId === 'carpetAreaID') {
      formik.setFieldValue('carpetAreaID', parseInt(value))
    } else if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
    }
  }

  const imageUpload = (e: any) => {
    setLoading(true)
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)

    fetch(process.env.REACT_APP_API_URL + '/StandardQuotation/uploadStandardPDF', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        setFilePath(data)
      })
      .catch((err) => {
        setLoading(false)
        //  console.log(err)
      })
  }

  //   ------View on other tab --------------
  async function downloadFile(selURL: string) {
    var fullUrl = process.env.REACT_APP_API_URL + selURL
    //Split image name
    const nameSplit = fullUrl.split('/')
    const duplicateName = nameSplit.pop()
    // let url = window.URL.createObjectURL(new Blob([fullUrl]))
    // let a = document.createElement('a')
    // a.href = url
    // a.download = '' + duplicateName + ''
    // a.click()
    const link = document.createElement('a')
    // link.download = '' + duplicateName + ''
    link.target = '_blank'
    link.href = `${fullUrl}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IStandardQuotationModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updatStandardQuotation(
          parseInt(standardQuotationId),
          values.bhkID,
          values.projectTypeID,
          values.carpetAreaID,
          filePath,
          isActive,
          user.employeeID,
          '192.66.22'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/standard-quotation/list',
                state: {
                  BHKID: state.mainBHKID,
                  CarpetAreaID: state.mainCarpetAreaID,
                  SearchText: state.mainSearch,
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
      {/* <Loader loading={state.loading} /> */}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>BHK:</label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='bhkID'
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
                            selected={state.selBHKID === data.bhkid ? true : false}
                          >
                            {data.bhkName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.bhkID && formik.errors.bhkID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bhkID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Project Type:
                </label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='projectTypeID'
                  >
                    <option selected={state.selProjectTypeID === 0 ? true : false} value={0}>
                      Select Type
                    </option>
                    {state.projectTypeData.length > 0 &&
                      state.projectTypeData.map((data, index) => {
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
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Carpet Area:
                </label>
                <div className='col-lg-8 fv-row'>
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
                            selected={state.selCarpetAreaID === data.carpetAreaID ? true : false}
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
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Select PDF Quotation:</span>
                </label>
                <div className={filePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'}>
                  <div
                    className='symbol symbol-45px me-5 cursor-pointer'
                    onClick={() => downloadFile(filePath)}
                  >
                    {/* <img src={process.env.REACT_APP_API_URL + file} alt='img' /> */}
                    <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                  </div>
                </div>
                <div className='col-lg-7 fv-row'>
                  <input
                    type='file'
                    accept='.pdf'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>

              {/* <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
              </div> */}
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
                to={{
                  pathname: '/standard-quotation/list',
                  state: {
                    BHKID: state.mainBHKID,
                    CarpetAreaID: state.mainCarpetAreaID,
                    SearchText: state.mainSearch,
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

export {EditStandardQuotation}
