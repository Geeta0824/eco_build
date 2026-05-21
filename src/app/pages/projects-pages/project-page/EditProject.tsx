import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {ICustomerPageModel} from '../../../models/organization-page/customer/ICustomenrModel'
import {getCustomerList} from '../../../modules/organization-page/customer-master-page/CustomerCRUD'

import {Button, Modal} from 'react-bootstrap-v5'
import {Pagination} from 'antd'
import {IBHKMasterModel} from '../../../models/master-page/IBHKMasterModel'
import {ICarpetAreaModel} from '../../../models/master-page/ICarpetAreaModel'
import {getActiveBHKApi} from '../../../modules/master-page/bhk-master-page/BHKCRUD'
import {getAllCarpetArea} from '../../../modules/master-page/carpet-area-page/CarpetAreaCRUD'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IProjectModel,
  IProjectTypeodel,
  projectModelInitValues as initialValues,
} from '../../../models/projects-page/IProjectsModel'
import Loader from '../../common-pages/Loader'
import {IProjectStatusModel} from '../../../models/master-page/IProjectStatusModel'
import {GetProjectStatusForDropDownListAPI} from '../../../modules/master-page/project-status-master-page/ProjectStatusCRUD'
import {
  EditProjectDetailsAPI,
  GetProjectTypeDropdownListAPI,
  getProjectByProjectIdAPI,
  getProjectForAllDropdownListDataAPI,
} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {getQuotationCateogryDropDownAPI} from '../../../modules/master-page/pdf-photo-master-page/PDFPhotoCRUD'
import {IQuotationCateogryDropDownModel} from '../../../models/master-page/IPDFPhotoMstModel'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  bhkid: Yup.number().min(1, 'BHK field is required').required('BHK field is required'),
  quotationCategoryID: Yup.number()
    .min(1, 'quotation Cateogry Type  is required')
    .required('quotation Cateogry Type  is required'),
  carpetAreaID: Yup.number()
    .min(1, 'Carpet Area field is required')
    .required('Carpet Area field is required'),
})

interface IProject {
  loading: boolean
  projectData: IProjectModel[]
  customerData: ICustomerPageModel[]
  temCustomerData: ICustomerPageModel[]
  projectStatusData: IProjectStatusModel[]
  bhkData: IBHKMasterModel[]
  carpetAreaData: ICarpetAreaModel[]
  projectTypeData: IProjectTypeodel[]
  quoCatogryDropDownData: IQuotationCateogryDropDownModel[]
  selBHKID: number
  selCarpetAreaID: number
  selCustomerId: number
  selProjectTypeID: number
  selQuotationCategoryID: number
  selProjStatusID: number
  fullName: string
  action: string
}

const EditProject: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const {projectID} = useParams<{projectID: string}>()
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [pastSearchText, setPastSearchText] = useState<string>('')
  const [projectFilePath, setProjectFilePath] = useState<string>('')
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [data, setData] = useState<IProjectModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProjectModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [amount, setAmount] = useState({
    projectAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    PMCCost: 0,
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IProject>({
    loading: true,
    projectData: [] as IProjectModel[],
    customerData: [] as ICustomerPageModel[],
    temCustomerData: [] as ICustomerPageModel[],
    projectStatusData: [] as IProjectStatusModel[],
    bhkData: [] as IBHKMasterModel[],
    carpetAreaData: [] as ICarpetAreaModel[],
    projectTypeData: [] as IProjectTypeodel[],
    quoCatogryDropDownData: [] as IQuotationCateogryDropDownModel[],
    selBHKID: 0,
    selCarpetAreaID: 0,
    selCustomerId: 0,
    selProjectTypeID: 0,
    selQuotationCategoryID: 0,
    selProjStatusID: 0,
    fullName: '',
    action: 'ProjInfo',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var searchText: any = ''
      if (lc != undefined) {
        searchText = lc.searchText
      }
      getProjectForAllDropdownListData(searchText)
    }, 100)
  }, [])

  function getProjectForAllDropdownListData(searchText: string) {
    setPastSearchText(searchText)
    getProjectForAllDropdownListDataAPI()
      .then((response) => {
        let bhkListData = response.data.bhkList
        let carpetAreaData = response.data.carpetAreaList
        // let customerData = response.data.customeraList
        let projectTypeData = response.data.projectTypeList
        let projectStatusData = response.data.projectStusList
        let quoCategoryData = response.data.queCategoryList
        getProjectDataByProjectID(
          bhkListData,
          carpetAreaData,
          // customerData,
          projectTypeData,
          projectStatusData,
          quoCategoryData
        )
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkData: [], loading: false})
      })
  }

  // function getCarpetAreaData(bhkData: IBHKMasterModel[]) {
  //   getAllCarpetArea()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       getAllCustomerData(bhkData, responseData)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, carpetAreaData: [], loading: false})
  //     })
  // }

  // function getAllCustomerData(bhkData: IBHKMasterModel[], carpetAreaData: ICarpetAreaModel[]) {
  //   getCustomerList()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getProjectTypeData(bhkData, carpetAreaData, responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, customerData: [], loading: false})
  //       }
  //       setTotal(responseData.length)
  //       setPage(1)
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, customerData: [], loading: false})
  //     })
  // }

  // function getProjectTypeData(
  //   bhkData: IBHKMasterModel[],
  //   carpetAreaData: ICarpetAreaModel[],
  //   customerData: ICustomerPageModel[]
  // ) {
  //   GetProjectTypeDropdownListAPI()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         getProjectDataByProjectID(bhkData, carpetAreaData, customerData, responseData)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, projectTypeData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, projectTypeData: [], loading: false})
  //     })
  // }

  function getProjectDataByProjectID(
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    // customerData: ICustomerPageModel[],
    projectTypeData: IProjectTypeodel[],
    projectStatusData: IProjectStatusModel[],
    quoCategoryData: IQuotationCateogryDropDownModel[]
  ) {
    getProjectByProjectIdAPI(parseInt(projectID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('projectName', response.data.projectName)
          formik.setFieldValue('customerID', response.data.customerID)
          formik.setFieldValue(
            'customerName',
            response.data.firstName + ' ' + response.data.lastName
          )
          formik.setFieldValue('email', response.data.email)
          formik.setFieldValue('mobileNumber', response.data.mobileNumber)
          formik.setFieldValue('bhkid', response.data.bhkid)
          formik.setFieldValue('projectTypeID', response.data.projectTypeID)
          formik.setFieldValue('quotationCategoryID', response.data.projectCategoryID)
          formik.setFieldValue('carpetAreaID', response.data.carpetAreaID)
          formik.setFieldValue('projectStatusID', response.data.projectStatus)
          formik.setFieldValue('bhkName', response.data.bhkName)
          formik.setFieldValue('projectAmount', response.data.projectAmount)
          formik.setFieldValue('paidAmount', response.data.paidAmount)
          formik.setFieldValue('remainingAmount', response.data.remainingAmount)
          formik.setFieldValue('description', response.data.description)
          formik.setFieldValue('entryDate', response.data.entryDate)
          formik.setFieldValue('latitude', response.data.latitude)
          formik.setFieldValue('longitude', response.data.longitude)
          setProjectFilePath(response.data.projectFilePath)
          setQuotationFilePath(response.data.quetFilePath)
          setAmount({
            ...state,
            projectAmount: response.data.projectAmount,
            paidAmount: response.data.paidAmount,
            remainingAmount: response.data.remainingAmount,
            PMCCost: response.data.pmcCost,
          })
          setState({
            ...state,
            quoCatogryDropDownData: quoCategoryData,
            // customerData: customerData,
            // temCustomerData: customerData,
            carpetAreaData: carpetAreaData,
            projectStatusData: projectStatusData,
            projectTypeData: projectTypeData,
            selQuotationCategoryID: response.data.projectCategoryID,
            selCarpetAreaID: response.data.carpetAreaID,
            selBHKID: response.data.bhkid,
            selProjectTypeID: response.data.projectTypeID,
            selProjStatusID: response.data.projectStatus,
            bhkData: bhkData,
            loading: false,
          })
          // setTotal(customerData.length)
          setPage(1)
          // getProjectStatusData(
          //   bhkData,
          //   carpetAreaData,
          //   customerData,
          //   projectTypeData,
          //   response.data.projectCategoryID,
          //   response.data.carpetAreaID,
          //   response.data.projectStatus,
          //   response.data.bhkid,
          //   response.data.projectTypeID
          // )
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

  function getProjectStatusData(
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    customerData: ICustomerPageModel[],
    projectTypeData: IProjectTypeodel[],
    tmpprojectID: number,
    tmpcarpetID: number,
    projectStatusID: number,
    bhkID: number,
    projectTypeID: number
  ) {
    GetProjectStatusForDropDownListAPI()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          getQuotationCateogryDropDownData(
            bhkData,
            carpetAreaData,
            customerData,
            projectTypeData,
            responseData.responseObject,
            tmpprojectID,
            tmpcarpetID,
            projectStatusID,
            bhkID,
            projectTypeID
          )
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, projectStatusData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectStatusData: [], loading: false})
      })
  }

  // --------------- Quotation Category -----------
  function getQuotationCateogryDropDownData(
    bhkData: IBHKMasterModel[],
    carpetAreaData: ICarpetAreaModel[],
    customerData: ICustomerPageModel[],
    projectTypeData: IProjectTypeodel[],
    projectStatusData: IProjectStatusModel[],
    tmpprojectID: number,
    tmpcarpetID: number,
    projectStatusID: number,
    bhkID: number,
    projectTypeID: number
  ) {
    getQuotationCateogryDropDownAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            quoCatogryDropDownData: responseData,
            customerData: customerData,
            temCustomerData: customerData,
            carpetAreaData: carpetAreaData,
            projectStatusData: projectStatusData,
            projectTypeData: projectTypeData,
            selQuotationCategoryID: tmpprojectID,
            selCarpetAreaID: tmpcarpetID,
            selBHKID: bhkID,
            selProjectTypeID: projectTypeID,
            selProjStatusID: projectStatusID,
            bhkData: bhkData,
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
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temCustomerData.filter((user) => {
        return (
          user.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.mobileNumber.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, customerData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, customerData: state.temCustomerData})
      // If the text field is empty, show all users
      setTotal(state.temCustomerData.length)
      setPage(1)
    }
    setName(keyword)
  }

  //   ------View on other tab --------------
  async function downloadProjectFile(selURL: string) {
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

  //   ------View on other tab --------------
  async function downloadQuotationFile(selURL: string) {
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

  // -----------------upload photo----------------------
  const imageUploadProject = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/Project/SaveProjectPhoto', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProjectFilePath(data)
        setFileLoader(false)
      })
  }

  // -----------------upload photo----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/Project/SaveQuotationPhoto', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
  }

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
    } else if (elementId === 'quotationCategoryID') {
      formik.setFieldValue('quotationCategoryID', parseInt(value))
      setState({...state, selQuotationCategoryID: parseInt(value)})
    } else if (elementId === 'projectStatusID') {
      formik.setFieldValue('projectStatusID', parseInt(value))
      setState({...state, selProjStatusID: parseInt(value)})
    }
  }

  // -----------------Customer Select-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    state.loading = true
    {
      state.temCustomerData.length == 0 &&
        getCustomerList()
          .then((response) => {
            const responseData = response.data.responseObject
            if (response.data.isSuccess === true) {
              setState({
                ...state,
                customerData: responseData,
                temCustomerData: responseData,
                loading: false,
              })
            } else {
              toast.error(`${response.data.message}`)
              setState({...state, customerData: [], loading: false})
            }
            setTotal(responseData.length)
            setPage(1)
          })
          .catch((error) => {
            toast.error(`${error}`)
            setState({...state, customerData: [], loading: false})
          })
    }
    setShow(true)
  }

  // --------For Model Data onClick Function-------
  function selectCustomer(tmpCustomerData: ICustomerPageModel) {
    formik.setFieldValue('customerID', tmpCustomerData.customerID)
    formik.setFieldValue('customerName', tmpCustomerData.fullName)
    formik.setFieldValue('email', tmpCustomerData.email)
    formik.setFieldValue('mobileNumber', tmpCustomerData.mobileNumber)
    setState({...state, selCustomerId: tmpCustomerData.customerID})
    setShow(false)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICustomerPageModel[] = state.customerData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  function handleChange(e: any) {
    let id = e.target.id
    let value = e.target.value
    const re = /^[0-9\b.]+$/
    if (id == 'projectAmount') {
      if (!isNaN(parseInt(value)) && re.test(value)) {
        let paidAmount: any = amount.paidAmount == 0 ? 0 : amount.paidAmount
        let final = parseInt(value) - parseInt(`${paidAmount}`)
        setAmount({...amount, projectAmount: value, remainingAmount: final})
      } else if (value == 0) {
        let paidAmount: any = amount.paidAmount == value
        let final = parseInt(value) - parseInt(`${paidAmount}`)
        setAmount({...amount, projectAmount: value, remainingAmount: final})
      }
    }
    if (id == 'paidAmount') {
      if (!isNaN(parseInt(value)) && re.test(value)) {
        let projectAmount: any = amount.projectAmount == 0 ? 0 : amount.projectAmount
        let final = parseInt(`${projectAmount}`) - parseInt(value)
        setAmount({...amount, paidAmount: value, remainingAmount: final})
      } else if (value == 0) {
        let projectAmount: any = amount.projectAmount == value
        let final = parseInt(`${projectAmount}`) - parseInt(value)
        setAmount({...amount, paidAmount: value, remainingAmount: final})
      }
    }
    if (id == 'remainingAmount') {
      if (!isNaN(parseInt(value)) && re.test(value)) {
        setAmount({...amount, remainingAmount: value})
      }
    }
    if (id == 'PMCCost') {
      if (!isNaN(parseInt(value)) && re.test(value)) {
        setAmount({...amount, PMCCost: value})
      } else if (value == 0) {
        setAmount({...amount, PMCCost: value})
      }
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProjectModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.customerID < 1) {
          toast.error(`select a customer`)
          return setLoading(false)
        }
        EditProjectDetailsAPI(
          parseInt(projectID),
          values.customerID,
          values.quotationCategoryID,
          values.projectTypeID,
          values.bhkid,
          values.carpetAreaID,
          values.projectStatusID,
          values.projectName,
          amount.projectAmount,
          projectFilePath,
          quotationFilePath,
          user.employeeID,
          '192.66.22',
          amount.paidAmount,
          amount.remainingAmount,
          amount.PMCCost,
          values.description,
          values.entryDate,
          values.latitude,
          values.longitude
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/projects/project/list',
                state: {searchText: pastSearchText},
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
      <div className={state.action === 'ProjInfo' ? 'row g-5 g-xxl-8' : 'd-none'}>
        {state.loading === true ? (
          <Loader loading={state.loading} />
        ) : (
          <>
            <div className='card mb-5 mb-xl-10'>
              <div id='kt_account_profile_details' className='collapse show'>
                <form onSubmit={formik.handleSubmit} noValidate className='form'>
                  <div className='card-body border-top p-9 ms-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Select Customer:
                      </label>
                      <div className='col-lg-3 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg border-0 bg-white'
                          placeholder='customer Name'
                          disabled
                          {...formik.getFieldProps('customerName')}
                        />
                        {formik.touched.customerName && formik.errors.customerName && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.customerName}</div>
                          </div>
                        )}
                      </div>
                      <div className='col-lg-1 fv-row'>
                        <div
                          className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                          onClick={handleShow}
                        >
                          <KTSVG
                            path='/media/icons/duotune/general/gen004.svg'
                            className='svg-icon-3 svg-icon-white'
                          />
                        </div>
                      </div>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>Entry Date:</label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='date'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          {...formik.getFieldProps('entryDate')}
                        />
                        {formik.touched.entryDate && formik.errors.entryDate && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.entryDate}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={state.selCustomerId === 0 ? 'd-none' : 'row mb-6'}>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className=''>Mobile Number:</span>
                      </label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg  border-0 bg-white'
                          placeholder='Mobile Number'
                          disabled
                          {...formik.getFieldProps('mobileNumber')}
                        />
                        {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.mobileNumber}</div>
                          </div>
                        )}
                      </div>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className=''>Email:</span>
                      </label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg  border-0 bg-white'
                          placeholder='Email'
                          disabled
                          {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.email}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Project Name:
                      </label>
                      <div className='col-lg-10 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Project Name'
                          {...formik.getFieldProps('projectName')}
                        />
                        {formik.touched.projectName && formik.errors.projectName && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.projectName}</div>
                          </div>
                        )}
                      </div>
                    </div>
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
                          <option
                            selected={state.selQuotationCategoryID === 0 ? true : false}
                            value={0}
                          >
                            Select Quotation Category Type
                          </option>
                          {state.quoCatogryDropDownData.length > 0 &&
                            state.quoCatogryDropDownData.map((data, index) => {
                              return (
                                <option
                                  key={index}
                                  value={data.quotationCategoryID}
                                  selected={
                                    state.selQuotationCategoryID == data.quotationCategoryID
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
                      <label className='col-lg-2 col-form-label  fw-bold fs-6'>Project Type:</label>
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
                          {state.projectTypeData.length > 0 &&
                            state.projectTypeData.map((data, index) => {
                              return (
                                <option
                                  key={index}
                                  value={data.projectTypeID}
                                  selected={
                                    state.selProjectTypeID == data.projectTypeID ? true : false
                                  }
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
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Select BHK:
                      </label>
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
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Carpet Area:
                      </label>
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
                                  selected={
                                    data.carpetAreaID === state.selCarpetAreaID ? true : false
                                  }
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
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Project Amount:
                      </label>
                      <div className='col-lg-2 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Project Amount'
                          id='projectAmount'
                          value={amount.projectAmount}
                          onChange={handleChange}
                        />
                        {formik.touched.projectAmount && formik.errors.projectAmount && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.projectAmount}</div>
                          </div>
                        )}
                      </div>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>Paid Amount:</label>
                      <div className='col-lg-2 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Paid Amount'
                          id='paidAmount'
                          value={amount.paidAmount}
                          onChange={handleChange}
                        />
                        {formik.touched.paidAmount && formik.errors.paidAmount && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.paidAmount}</div>
                          </div>
                        )}
                      </div>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>Rem Amount:</label>
                      <div className='col-lg-2 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Remening Amount'
                          id='remainingAmount'
                          value={amount.remainingAmount}
                          onChange={handleChange}
                        />
                        {formik.touched.remainingAmount && formik.errors.remainingAmount && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.remainingAmount}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>PMC Cost:</label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='PMC Cost'
                          id='PMCCost'
                          value={amount.PMCCost}
                          onChange={handleChange}
                          // {...formik.getFieldProps('PMCCost')}
                        />
                        {formik.touched.PMCCost && formik.errors.PMCCost && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.PMCCost}</div>
                          </div>
                        )}
                      </div>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Project Status:
                      </label>
                      <div className='col-lg-4 fv-row'>
                        <select
                          className='form-select bg-light-primary'
                          aria-label='Default select example'
                          onChange={selectChange}
                          id='projectStatusID'
                        >
                          <option selected={state.selProjStatusID === 0 ? true : false} value={0}>
                            Select Status
                          </option>
                          {state.projectStatusData.length > 0 &&
                            state.projectStatusData.map((data, index) => {
                              return (
                                <option
                                  key={index}
                                  value={data.projectStatusID}
                                  selected={
                                    data.projectStatusID === state.selProjStatusID ? true : false
                                  }
                                >
                                  {data.projectStatusName}
                                </option>
                              )
                            })}
                        </select>
                        {formik.touched.projectStatusID && formik.errors.projectStatusID && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.projectStatusID}</div>
                          </div>
                        )}
                      </div>
                    </div>{' '}
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>Latitude:</label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Latitude'
                          {...formik.getFieldProps('latitude')}
                        />
                        {formik.touched.latitude && formik.errors.latitude && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.latitude}</div>
                          </div>
                        )}
                      </div>
                      <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                        Longitude:
                      </label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Longitude'
                          {...formik.getFieldProps('longitude')}
                        />
                        {formik.touched.longitude && formik.errors.longitude && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.longitude}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className='d-block'>Upload Project:</span>
                        <p className='text-muted fs-7'> (allow only .pdf files)</p>
                      </label>
                      <div
                        className={
                          projectFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                        }
                      >
                        <div
                          className='symbol symbol-45px me-5 cursor-pointer'
                          onClick={() => downloadProjectFile(projectFilePath)}
                        >
                          <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                        </div>
                      </div>
                      <div
                        className={projectFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'}
                      >
                        <input
                          type='file'
                          accept='.pdf'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          onChange={(e) => imageUploadProject(e)}
                        />
                      </div>
                    </div>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className='d-block'>Upload Quotation:</span>
                        <p className='text-muted fs-7'> (allow only .pdf files)</p>
                      </label>
                      <div
                        className={
                          quotationFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                        }
                      >
                        <div
                          className='symbol symbol-45px me-5 cursor-pointer'
                          onClick={() => downloadQuotationFile(quotationFilePath)}
                        >
                          <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                        </div>
                      </div>
                      <div
                        className={
                          quotationFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'
                        }
                      >
                        <input
                          type='file'
                          accept='.pdf'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          onChange={(e) => imageUploadQuotation(e)}
                        />
                      </div>
                    </div>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>
                        <span className=''>Description:</span>
                      </label>
                      <div className='col-lg-10 fv-row'>
                        <textarea
                          rows={2}
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          placeholder='Description...'
                          {...formik.getFieldProps('description')}
                        />
                        {formik.touched.description && formik.errors.description && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.description}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='card-footer d-flex justify-content-end py-9'>
                    <button type='submit' className='btn btn-success me-5' disabled={loading}>
                      {!loading && 'Submit'}
                      {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...{' '}
                          <span className='spinner-border spinner-border-sm align-middle ms-5'></span>
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        history.push({
                          pathname: '/projects/project/list',
                          state: {searchText: pastSearchText},
                        })
                      }
                      className='btn btn-primary'
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
      {/* ----------------------------Customer Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Customer Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-light-primary'
                  // name='search'
                  placeholder='Search'
                  onChange={(e) => filter(e)}
                  value={name}
                />
              </span>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Mobile Number</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Email</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {state.loading === true ? (
                    <Loader loading={state.loading} />
                  ) : (
                    <>
                      {currentPosts.length > 0 &&
                        currentPosts.map((data, index) => {
                          return (
                            <tr
                              key={index}
                              className={
                                // data.isActive === false
                                //   ? 'd-none'
                                //   :
                                'bg-hover-light-primary text-hover-primary'
                              }
                              onClick={() => selectCustomer(data)}
                            >
                              <td>
                                <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                                  {data.fullName}
                                </span>
                              </td>
                              <td className=''>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.mobileNumber}
                                </span>
                              </td>
                              <td className=''>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.email}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={currentPosts.length}
                        loading={state.loading}
                        colSpan={9}
                      />
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPage(value)}
                pageSize={postPerPage}
                total={total}
                current={page}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChange}
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {EditProject}
