import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Button, Modal} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import Loader from '../../common-pages/Loader'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {getVenderWebList} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {
  agencyTypeDataForModular,
  gstTypeData,
  venderTypeData,
} from '../../other-dropDowns/otherDropDowns'
import {
  IAgencyTypeDropDownModel,
  IProjectVendorModel,
  projectVendorInitValues as initialValues,
} from '../../../models/projects-page/IProjectVendorModel'
import {
  EditProjectVendorDetailsAPI,
  editProjectVendorDetailsAPI_WithGST,
  getAgencyTypeByVendorIDApi,
  getProjectVendorByVendorIdAPI,
  getProjectVendorByVendorId_WithGSTAPI,
} from '../../../modules/project-master-page/vendor-Master-page/ProjectVendorCRUD'
import {Pagination} from 'antd'

const profileDetailsSchema = Yup.object().shape({
  vendorTypeID: Yup.string().required('Vendor Type Is Required').min(1, 'Vendor Type Is Required'),
  remarks: Yup.string().required('Remarks Is Required'),
})

interface IProjectVendor {
  loading: boolean
  vendorData: IVenderModel[]
  tmpVendorData: IVenderModel[]
  projectVendorData: IProjectVendorModel[]
  agencyTypeDropDownData: IAgencyTypeDropDownModel[]
  vendorTypeID: number
  action: string
  selVendorID: number
  selvendorTypeID: number
  projVendorData: string
  ProjectName: string
  selProjectID: number
  projectCategoryID: number
  selAgencyTypeId: number
  selGstTypeID: number
}

const EditProjectVendor: React.FC = () => {
  const [isgst, setIsgst] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const {projectVendorID} = useParams<{projectVendorID: string}>()
  const {projectID} = useParams<{projectID: string}>()
  const [projectFilePath, setProjectFilePath] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [data, setData] = useState<IProjectVendorModel>(initialValues)
  const [amount, setAmount] = useState({
    vendorCost: 0,
    paidAmount: 0,
    remainingAmount: 0,
  })
  const updateData = (fieldsToUpdate: Partial<IProjectVendorModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IProjectVendor>({
    loading: true,
    vendorData: [] as IVenderModel[],
    tmpVendorData: [] as IVenderModel[],
    projectVendorData: [] as IProjectVendorModel[],
    agencyTypeDropDownData: [] as IAgencyTypeDropDownModel[],
    vendorTypeID: 0,
    action: 'ProjInfo',
    selVendorID: 0,
    selvendorTypeID: 0,
    projVendorData: '',
    ProjectName: '',
    selProjectID: 0,
    projectCategoryID: 0,
    selAgencyTypeId: 0,
    selGstTypeID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      // console.log('Lc' + lc.projectID)
      // console.log('Lc' + lc.projectName)
      let projectID: any = lc.projectID
      let ProjectName: any = lc.projectName
      let projectCategoryID: any = lc.projectCategoryID
      console.log(projectCategoryID)
      getVenderData(ProjectName, projectID, projectCategoryID)
    }, 100)
  }, [])

  function getVenderData(ProjectName: string, ProjectID: number, projectCategoryID: number) {
    getVenderWebList()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getPayStructureDataByID(responseData, ProjectName, ProjectID, projectCategoryID)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getPayStructureDataByID(
    projVendorData: IVenderModel[],
    ProjectName: string,
    ProjectID: number,
    projectCategoryID: number
  ) {
    // getProjectVendorByVendorIdAPI(parseInt(projectVendorID))
    getProjectVendorByVendorId_WithGSTAPI(parseInt(projectVendorID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('vendorTypeName', response.data.vendorTypeName)
          formik.setFieldValue('companyName', response.data.companyName)
          formik.setFieldValue('contactPerson', response.data.contactPerson)
          formik.setFieldValue('contactNumber', response.data.contactNumber)
          formik.setFieldValue('vendorCost', response.data.vendorCost)
          formik.setFieldValue('paidAmount', response.data.paidAmount)
          formik.setFieldValue('remainingAmount', response.data.remainingAmount)
          formik.setFieldValue('assignDate', response.data.assignDate)
          formik.setFieldValue('workCompleteDate', response.data.workCompleteDate)
          formik.setFieldValue('remarks', response.data.remarks)
          formik.setFieldValue('vendorID', response.data.vendorID)
          formik.setFieldValue('agencyTypeID', response.data.agencyTypeID)
          formik.setFieldValue('isGST', response.data.isGST)
          formik.setFieldValue('gstTypeID', response.data.gstTypeID)
          formik.setFieldValue('cgstPer', response.data.cgstPer)
          formik.setFieldValue('cgstVal', response.data.cgstVal)
          formik.setFieldValue('sgstPer', response.data.sgstPer)
          formik.setFieldValue('sgstVal', response.data.sgstVal)
          formik.setFieldValue('igstPer', response.data.igstPer)
          formik.setFieldValue('igstVal', response.data.igstVal)
          formik.setFieldValue('gstAmount', response.data.gstAmount)
          formik.setFieldValue('afterGSTAmount', response.data.afterGSTAmount)
          formik.setFieldValue('subAmount', response.data.subTotal)
          formik.setFieldValue('finalAmount', response.data.finalAmount)
          setProjectFilePath(response.data.filePath)
          setAmount({
            ...amount,
            remainingAmount: response.data.remainingAmount,
            paidAmount: response.data.paidAmount,
            vendorCost: response.data.vendorCost,
          })
          setIsgst(response.data.isGST)
          getAgencyTypeData(
            projVendorData,
            ProjectName,
            ProjectID,
            projectCategoryID,
            response.data.vendorID,
            response.data.vendorTypeID,
            response.data.agencyTypeID,
            response.data.gstTypeID
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
  function getAgencyTypeData(
    projVendorData: IVenderModel[],
    ProjectName: string,
    ProjectID: number,
    projectCategoryID: number,
    vendorID: number,
    vendorTypeID: number,
    agencyTypeID: number,
    gstTypeID: number
  ) {
    getAgencyTypeByVendorIDApi(vendorID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            agencyTypeDropDownData: responseData,
            vendorData: projVendorData,
            selVendorID: vendorID,
            tmpVendorData: projVendorData,
            selvendorTypeID: vendorTypeID,
            ProjectName: ProjectName,
            selProjectID: ProjectID,
            projectCategoryID: projectCategoryID,
            selAgencyTypeId: agencyTypeID,
            selGstTypeID: gstTypeID,
            loading: false,
          })
          setTotal(projVendorData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }
  // ================= Agency Type =================
  function getAgencyTypeVendorIDData(vendorID: number) {
    getAgencyTypeByVendorIDApi(vendorID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            agencyTypeDropDownData: responseData,
            selVendorID: vendorID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }
  // function handleChange(e: any) {
  //   let id = e.target.id
  //   let value = e.target.value
  //   const re = /^[0-9\b.]+$/
  //   if (id == 'vendorCost') {
  //     if (!isNaN(parseInt(value)) && re.test(value)) {
  //       let paidAmount: any = amount.paidAmount == 0 ? 0 : amount.paidAmount
  //       let final = parseInt(value) - parseInt(`${paidAmount}`)
  //       setAmount({...amount, vendorCost: value, remainingAmount: final})
  //     } else if (value == 0) {
  //       let paidAmount: any = amount.paidAmount == value
  //       let final = parseInt(value) - parseInt(`${paidAmount}`)
  //       setAmount({...amount, vendorCost: value, remainingAmount: final})
  //     }
  //   }
  //   if (id == 'paidAmount') {
  //     if (!isNaN(parseInt(value)) && re.test(value)) {
  //       let vendorCost: any = amount.vendorCost == 0 ? 0 : amount.vendorCost
  //       let final = parseInt(`${vendorCost}`) - parseInt(value)
  //       setAmount({...amount, paidAmount: value, remainingAmount: final})
  //     } else if (value == 0) {
  //       let vendorCost: any = amount.vendorCost == value
  //       let final = parseInt(`${vendorCost}`) - parseInt(value)
  //       setAmount({...amount, paidAmount: value, remainingAmount: final})
  //     }
  //   }
  //   if (id == 'remainingAmount') {
  //     if (!isNaN(parseInt(value)) && re.test(value)) {
  //       setAmount({...amount, remainingAmount: value})
  //     }
  //   }
  // }

  // function handleChange(e: any) {
  //   let id = e.target.id
  //   let value = e.target.value
  //   if (id == 'vendorCost') {
  //     let paidAmount: any = amount.paidAmount == 0 ? 0 : amount.paidAmount
  //     let final = parseInt(value) - parseInt(`${paidAmount}`)
  //     setAmount({...amount, vendorCost: value, remainingAmount: final})
  //   } else if (id == 'paidAmount') {
  //     let vendorCost: any = amount.vendorCost == 0 ? 0 : amount.vendorCost
  //     let final = parseInt(`${vendorCost}`) - parseInt(value)
  //     setAmount({...amount, paidAmount: value, remainingAmount: final})
  //   } else if (id == 'remainingAmount') {
  //     setAmount({...amount, remainingAmount: value})
  //   }
  // }

  // // -----------------upload photo----------------------

  function handleChange(e: any) {
    let id = e.target.id
    let value = e.target.value
    const re = /^[0-9\b.]+$/

    if (id === 'vendorCost') {
      if (!isNaN(parseInt(value)) && re.test(value)) {
        let paidAmount: any = amount.paidAmount == 0 ? 0 : amount.paidAmount
        let final = parseInt(value) - parseInt(`${paidAmount}`)
        setAmount({...amount, vendorCost: value, remainingAmount: final})

        let tmpGST: number = (parseInt(value) * 18) / 100 // 18% Total GST

        if (state.selGstTypeID === 1) {
          // State GST (CGST + SGST)
          let sgstVal = tmpGST / 2 // 9% SGST
          let cgstVal = tmpGST / 2 // 9% CGST

          formik.setFieldValue('sgstPer', 9)
          formik.setFieldValue('sgstVal', sgstVal)
          formik.setFieldValue('cgstPer', 9)
          formik.setFieldValue('cgstVal', cgstVal)
          formik.setFieldValue('gstAmount', tmpGST)
          formik.setFieldValue('subAmount', parseInt(value) - tmpGST)
        } else if (state.selGstTypeID === 2) {
          // Central GST (IGST)
          formik.setFieldValue('igstPer', 18)
          formik.setFieldValue('igstVal', tmpGST)
          formik.setFieldValue('gstAmount', tmpGST)
          formik.setFieldValue('subAmount', parseInt(value) - tmpGST) // Sub Amount = Vendor Cost - GST
        } else {
          // No GST Selected
          formik.setFieldValue('subAmount', 0)
          formik.setFieldValue('gstAmount', 0)
          formik.setFieldValue('sgstPer', 0)
          formik.setFieldValue('sgstVal', 0)
          formik.setFieldValue('cgstPer', 0)
          formik.setFieldValue('cgstVal', 0)
          formik.setFieldValue('igstPer', 0)
          formik.setFieldValue('igstVal', 0)
        }
      } else if (value == 0) {
        let paidAmount: any = amount.paidAmount == value
        let final = parseInt(value) - parseInt(`${paidAmount}`)
        setAmount({...amount, vendorCost: value, remainingAmount: final})
      }
    }

    if (id === 'paidAmount') {
      if (!isNaN(parseInt(value)) && re.test(value)) {
        let vendorCost: any = amount.vendorCost == 0 ? 0 : amount.vendorCost
        let final = parseInt(`${vendorCost}`) - parseInt(value)
        setAmount({...amount, paidAmount: value, remainingAmount: final})
      } else if (value == 0) {
        let vendorCost: any = amount.vendorCost == value
        let final = parseInt(`${vendorCost}`) - parseInt(value)
        setAmount({...amount, paidAmount: value, remainingAmount: final})
      }
    }

    if (id === 'remainingAmount') {
      if (!isNaN(parseInt(value)) && re.test(value)) {
        setAmount({...amount, remainingAmount: value})
      }
    }
  }

  function checkedFunction(event: any) {
    const isChecked = event.target.checked

    if (isChecked) {
      if (amount.vendorCost > 0.0) {
        setIsgst(true)

        let vendorCost = amount.vendorCost
        let gstAmount = (vendorCost * 18) / 100 // 18% GST

        if (state.selGstTypeID === 1) {
          // State GST (CGST + SGST)
          let sgstVal = gstAmount / 2 // 9% SGST
          let cgstVal = gstAmount / 2 // 9% CGST

          formik.setFieldValue('sgstPer', 9)
          formik.setFieldValue('sgstVal', sgstVal)
          formik.setFieldValue('cgstPer', 9)
          formik.setFieldValue('cgstVal', cgstVal)
          formik.setFieldValue('gstAmount', gstAmount)
        } else if (state.selGstTypeID === 2) {
          // Central GST (IGST)
          formik.setFieldValue('igstPer', 18)
          formik.setFieldValue('igstVal', gstAmount)
          formik.setFieldValue('gstAmount', gstAmount)
        }
        // else {
        //   toast.error('Please select a GST Type')
        // }
      } else {
        toast.error('Please Enter Vendor Cost')
      }
    } else {
      // Reset GST values when unchecked
      formik.setFieldValue('cgstVal', 0)
      formik.setFieldValue('cgstPer', 0)
      formik.setFieldValue('sgstVal', 0)
      formik.setFieldValue('sgstPer', 0)
      formik.setFieldValue('igstVal', 0)
      formik.setFieldValue('igstPer', 0)
      formik.setFieldValue('gstAmount', 0)
      setIsgst(false)
      setState({...state, selGstTypeID: 0})
    }
  }

  const selectChange = (event: any) => {
    const value = parseInt(event.target.value)
    const elementId = event.target.id

    if (elementId === 'vendorTypeID') {
      formik.setFieldValue('vendorTypeID', value)
      getVenderData(state.ProjectName, state.projectCategoryID, value)
    } else if (elementId === 'selAgencyTypeId') {
      formik.setFieldValue('selAgencyTypeId', value)
      setState({...state, selAgencyTypeId: value})
    } else if (elementId === 'gstTypeID') {
      formik.setFieldValue('gstTypeID', value)
      setState({...state, selGstTypeID: value})

      if (amount.vendorCost > 0) {
        let vendorCost = amount.vendorCost
        let gstAmount = (vendorCost * 18) / 100 // 18% GST

        if (value === 1) {
          // State GST (CGST + SGST)
          let sgstVal = gstAmount / 2 // 9%
          let cgstVal = gstAmount / 2 // 9%

          formik.setFieldValue('sgstPer', 9)
          formik.setFieldValue('sgstVal', sgstVal)
          formik.setFieldValue('cgstPer', 9)
          formik.setFieldValue('cgstVal', cgstVal)
          formik.setFieldValue('gstAmount', gstAmount)
          formik.setFieldValue('subAmount', vendorCost - gstAmount)
        } else if (value === 2) {
          // Central GST (IGST)
          formik.setFieldValue('igstPer', 18)
          formik.setFieldValue('igstVal', gstAmount)
          formik.setFieldValue('gstAmount', gstAmount)
          formik.setFieldValue('subAmount', vendorCost - gstAmount)
        } else {
          // Reset GST fields if no GST type is selected
          formik.setFieldValue('cgstVal', 0)
          formik.setFieldValue('cgstPer', 0)
          formik.setFieldValue('sgstVal', 0)
          formik.setFieldValue('sgstPer', 0)
          formik.setFieldValue('igstVal', 0)
          formik.setFieldValue('igstPer', 0)
          formik.setFieldValue('gstAmount', 0)
          formik.setFieldValue('subAmount', 0)
        }
      } else {
        toast.error('Please Enter Vendor Cost First')
      }
    }
  }

  // ---------------------------------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/Project/AddVendorMapAttachDocument', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProjectFilePath(data)
        setFileLoader(false)
      })
  }

  // const selectChange = (event: any) => {
  //   const value = event.target.value
  //   const elementId = event.target.id
  //   if (elementId === 'vendorTypeID') {
  //     formik.setFieldValue('vendorTypeID', parseInt(value))
  //     setState({...state, selvendorTypeID: parseInt(value)})
  //   } else if (elementId === 'selAgencyTypeId') {
  //     formik.setFieldValue('selAgencyTypeId', parseInt(value))
  //     setState({...state, selAgencyTypeId: parseInt(value)})
  //   }
  // }

  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }
  function handleShowVendor() {
    setShowVendor(true)
  }

  // --------For Model Data onClick Function-------
  function selectVendor(tmpVendorData: IVenderModel) {
    getAgencyTypeVendorIDData(tmpVendorData.vendorID)
    formik.setFieldValue('vendorID', tmpVendorData.vendorID)
    formik.setFieldValue('companyName', tmpVendorData.companyName)
    formik.setFieldValue('contactPerson', tmpVendorData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendorData.contactNumber)
    // setState({...state, selVendorID: tmpVendorData.vendorID})
    setShowVendor(false)
  }

  // ===================== For vendor Filter =====================
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpVendorData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, vendorData: results})
      setTotal(results.length)
    } else {
      setState({...state, vendorData: state.tmpVendorData})
      setTotal(state.tmpVendorData.length)
    }
    setName(keyword)
  }
  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IVenderModel[] = state.vendorData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProjectVendorModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        // EditProjectVendorDetailsAPI(
        editProjectVendorDetailsAPI_WithGST(
          parseInt(projectVendorID),
          parseInt(projectID),
          values.vendorID,
          values.assignDate,
          values.workCompleteDate,
          values.remarks,
          projectFilePath,
          amount.vendorCost,
          user.employeeID,
          '192.66.22',
          amount.paidAmount,
          amount.remainingAmount,
          state.selAgencyTypeId,
          isgst,
          values.gstTypeID,
          values.cgstPer,
          values.cgstVal,
          values.sgstPer,
          values.sgstVal,
          values.igstPer,
          values.igstVal,
          values.gstAmount,
          amount.vendorCost,
          values.subAmount,
          amount.vendorCost
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: `/projects/project/edit/${projectID}/vendor/list`,
                state: {projName: state.ProjectName, projectCategoryID: state.projectCategoryID},
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
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: `/projects/project/edit/${parseInt(projectID)}/vendor/list`,
              state: {projName: state.ProjectName, projectCategoryID: state.projectCategoryID},
            })
          }
          title='vendor List'
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          {state.loading === true ? (
            <Loader loading={state.loading} />
          ) : (
            <>
              <div className='card mb-5 mb-xl-10'>
                <div id='kt_account_profile_details' className='collapse show'>
                  <form onSubmit={formik.handleSubmit} noValidate className='form'>
                    <div className='card-body border-top p-9 ms-6'>
                      <div className='row mb-6'>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className='required'> Select Vendor Type:</span>
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <select
                            className='form-select'
                            aria-label='Default select example'
                            onChange={selectChange}
                            id='vendorTypeID'
                          >
                            <option selected value={0}>
                              Select Vendor Type
                            </option>
                            {venderTypeData.length > 0 &&
                              venderTypeData.map((data, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={data.vendorTypeID}
                                    selected={
                                      state.selvendorTypeID == data.vendorTypeID ? true : false
                                    }
                                  >
                                    {data.vendorTypeName}
                                  </option>
                                )
                              })}
                          </select>
                          {formik.touched.vendorTypeID && formik.errors.vendorTypeID && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.vendorTypeID}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='row mb-6'>
                        <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                          Select Vendor:
                        </label>
                        <div className='col-lg-3 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg border-0 bg-white'
                            placeholder='Select Vendor'
                            disabled
                            {...formik.getFieldProps('companyName')}
                          />
                        </div>
                        <div className='col-lg-1 fv-row'>
                          <div
                            className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                            onClick={handleShowVendor}
                          >
                            <KTSVG
                              path='/media/icons/duotune/general/gen004.svg'
                              className='svg-icon-3 svg-icon-white'
                            />
                          </div>
                        </div>{' '}
                        <label
                          className={
                            state.selVendorID > 0 && state.projectCategoryID === 2
                              ? 'col-lg-2 col-form-label required fw-bold fs-6'
                              : 'd-none'
                          }
                        >
                          Select Agency:
                        </label>
                        <div
                          className={
                            state.selVendorID > 0 && state.projectCategoryID === 2
                              ? 'col-lg-3 fv-row'
                              : 'd-none'
                          }
                        >
                          <select
                            className='form-select'
                            aria-label='Default select example'
                            onChange={selectChange}
                            id='selAgencyTypeId'
                          >
                            <option selected value={0}>
                              Select Account Type
                            </option>
                            {state.agencyTypeDropDownData.length > 0 &&
                              state.agencyTypeDropDownData.map((data, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={data.agencyTypeID}
                                    selected={
                                      state.selAgencyTypeId == data.agencyTypeID ? true : false
                                    }
                                  >
                                    {data.agencyTypeName}
                                  </option>
                                )
                              })}
                          </select>
                          {formik.touched.agencyTypeID && formik.errors.agencyTypeID && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.agencyTypeID}</div>
                            </div>
                          )}
                        </div>
                        <label
                          className={
                            state.selvendorTypeID == 1 &&
                            (state.projectCategoryID == 3 ||
                              state.projectCategoryID == 8 ||
                              state.projectCategoryID == 9 ||
                              state.projectCategoryID == 10)
                              ? 'col-lg-2 col-form-label required fw-bold fs-6'
                              : 'd-none'
                          }
                        >
                          Select Agency:
                        </label>
                        <div
                          className={
                            state.selvendorTypeID == 1 &&
                            (state.projectCategoryID == 3 ||
                              state.projectCategoryID == 8 ||
                              state.projectCategoryID == 9 ||
                              state.projectCategoryID == 10)
                              ? 'col-lg-3 fv-row'
                              : 'd-none'
                          }
                        >
                          <select
                            className='form-select'
                            aria-label='Default select example'
                            onChange={selectChange}
                            id='selAgencyTypeId'
                          >
                            <option selected value={0}>
                              Select Agency
                            </option>
                            {agencyTypeDataForModular.length > 0 &&
                              agencyTypeDataForModular.map((data, index) => {
                                return (
                                  <option key={index} value={data.agencyTypeID}>
                                    {data.agencyTypeName}
                                  </option>
                                )
                              })}
                          </select>
                          {formik.touched.agencyTypeID && formik.errors.agencyTypeID && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.agencyTypeID}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={state.selVendorID === 0 ? 'd-none' : 'row mb-6'}>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className=''>Contact Person:</span>
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg  border-0 bg-white'
                            placeholder='Contact Person'
                            disabled
                            {...formik.getFieldProps('contactPerson')}
                          />
                        </div>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className=''>Contact Number:</span>
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg  border-0 bg-white'
                            placeholder='Contact Number'
                            disabled
                            {...formik.getFieldProps('contactNumber')}
                          />
                        </div>
                      </div>
                      <div className={'row mb-6'}>
                        <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                          Assign Date:
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='date'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            {...formik.getFieldProps('assignDate')}
                          />
                          {formik.touched.assignDate && formik.errors.assignDate && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.assignDate}</div>
                            </div>
                          )}
                        </div>
                        <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                          Work Order Complete Date:
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='date'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            {...formik.getFieldProps('workCompleteDate')}
                          />
                          {formik.touched.workCompleteDate && formik.errors.workCompleteDate && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.workCompleteDate}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* <div className={state.selvendorTypeID === 1 ? 'row mb-6' : 'd-none'}> */}
                      <div className={'row mb-6'}>
                        <label className={'col-lg-2 col-form-label required fw-bold fs-6'}>
                          Vendor Cost:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Vendor Cost'
                            id='vendorCost'
                            value={amount.vendorCost}
                            onChange={handleChange}
                          />
                          {formik.touched.vendorCost && formik.errors.vendorCost && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.vendorCost}</div>
                            </div>
                          )}
                        </div>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>Paid Amount:</label>
                        <div className={'col-lg-2 fv-row'}>
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
                            disabled
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
                      {/* -------------------------------------------- */}

                      <div
                        className={
                          // state.selProjectID > 0 && state.selProjectModeID === 1?
                          'row mb-6'
                          //   : 'd-none'
                        }
                      >
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className=''>Is GST:</span>
                        </label>
                        <div className='col-lg-3 fv-row'>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input mt-3'
                              type='checkbox'
                              id='isgst'
                              checked={isgst}
                              onChange={(e) => checkedFunction(e)}
                            />
                          </div>
                        </div>
                        <label
                          className={
                            isgst === true ? 'col-lg-3 col-form-label  fw-bold fs-6' : 'd-none'
                          }
                        >
                          GST Type :
                        </label>
                        <div className={isgst === true ? 'col-lg-3 fv-row' : 'd-none'}>
                          <select
                            className='form-select bg-light-primary'
                            aria-label='Default select example'
                            onChange={selectChange}
                            id='gstTypeID'
                          >
                            <option selected={state.selGstTypeID === 0 ? true : false} value={0}>
                              Select GST Type
                            </option>
                            {gstTypeData.length > 0 &&
                              gstTypeData.map((data, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={data.gstTypeID}
                                    selected={state.selGstTypeID === data.gstTypeID ? true : false}
                                  >
                                    {data.gstTypeName}
                                  </option>
                                )
                              })}
                          </select>
                        </div>
                        {formik.touched.gstTypeID && formik.errors.gstTypeID && (
                          <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>{formik.errors.gstTypeID}</div>
                          </div>
                        )}
                      </div>
                      <div
                        className={
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          CGST Percentage:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='CGST Percentage'
                            {...formik.getFieldProps('cgstPer')}
                            disabled
                          />
                          {formik.touched.cgstPer && formik.errors.cgstPer && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.cgstPer}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>
                          %
                        </span>
                        <label className={'col-lg-3 col-form-label fw-bold fs-6'}>
                          CGST Amount:
                        </label>
                        <div className={'col-lg-3 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='CGST Amount'
                            {...formik.getFieldProps('cgstVal')}
                            disabled
                          />
                          {formik.touched.cgstVal && formik.errors.cgstVal && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.cgstVal}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          SGST Percentage:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='SGST Percentage'
                            {...formik.getFieldProps('sgstPer')}
                            disabled
                          />
                          {formik.touched.sgstPer && formik.errors.sgstPer && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.sgstPer}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>
                          %
                        </span>
                        <label className={'col-lg-3 col-form-label fw-bold fs-6'}>
                          SGST Amount:
                        </label>
                        <div className={'col-lg-3 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='SGST Amount'
                            {...formik.getFieldProps('sgstVal')}
                            disabled
                          />
                          {formik.touched.sgstVal && formik.errors.sgstVal && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.sgstVal}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID === 2 && isgst === true ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          IGST Percentage:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='IGST Amount'
                            {...formik.getFieldProps('igstPer')}
                            disabled
                          />
                          {formik.touched.igstPer && formik.errors.igstPer && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.igstPer}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>
                          %
                        </span>
                        <label className={'col-lg-3 col-form-label fw-bold fs-6'}>
                          IGST Amount:
                        </label>
                        <div className={'col-lg-3 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='IGST Amount'
                            {...formik.getFieldProps('igstVal')}
                            disabled
                          />
                          {formik.touched.igstVal && formik.errors.igstVal && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.igstVal}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID > 0 ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          GST Amount:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='GST Amount'
                            // value={gstAmount}
                            {...formik.getFieldProps('gstAmount')}
                            disabled
                            // onChange={handleChangeGstAmount}
                          />{' '}
                          {formik.touched.gstAmount && formik.errors.gstAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.gstAmount}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'></span>
                        {/* <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          After GST Amount:
                        </label> */}
                        {/* <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='After GST Amount'
                            {...formik.getFieldProps('afterGSTAmount')}
                            disabled
                          />
                          {formik.touched.afterGSTAmount && formik.errors.afterGSTAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.afterGSTAmount}</div>
                            </div>
                          )}
                        </div> */}
                        <label className='col-lg-3 col-form-label fw-bold fs-6'>
                          <span className='required'>Sub Total:</span>
                        </label>
                        <div className='col-lg-3 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Enter Sub Amount'
                            // value={subAmount}
                            id='subAmount'
                            {...formik.getFieldProps('subAmount')}
                            disabled
                            // onChange={handleAmtChange}
                          />
                          {formik.touched.subAmount && formik.errors.subAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.subAmount}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* ----------------------------------- */}
                      <div className='row mb-6'>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className='required'>Remarks:</span>
                        </label>
                        <div className='col-lg-10 fv-row'>
                          <textarea
                            rows={2}
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Remarks'
                            {...formik.getFieldProps('remarks')}
                          />
                          {formik.touched.remarks && formik.errors.remarks && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.remarks}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='row mb-6'>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className='d-block'>Attached Document:</span>
                          <p className='text-muted fs-7'> (allow only .pdf files)</p>
                        </label>
                        <div
                          className={
                            projectFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                          }
                        >
                          <div className='symbol symbol-45px me-5 cursor-pointer'>
                            {/* <img src={process.env.REACT_APP_API_URL + file} alt='img' /> */}
                            <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                          </div>
                        </div>
                        <div
                          className={
                            projectFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'
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
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Vendor Type Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Company Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className='border-bottom'>
                  {state.vendorData.length > 0 &&
                    state.vendorData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isActive === false
                          //     ? 'd-none'
                          //     : 'bg-hover-light-primary text-hover-primary'
                          // }
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {/* {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? ( */}
                            <div className='d-flex align-items-center'>
                              <div className='text-dark text-hover-primary fs-6'>
                                {data.companyName}
                              </div>
                            </div>
                            {/* ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )} */}
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>{' '}
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
          <Button variant='danger' onClick={handleCloseVendor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {EditProjectVendor}
