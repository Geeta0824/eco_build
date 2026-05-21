import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  IProjectVendorModel,
  IProjVendBreakupModel,
} from '../../../models/projects-page/IProjectVendorModel'
import {
  deleteProjectPMCVendorMapDtlDataAPI,
  DeleteProjectVendorDataAPI,
  getProjectVendorBreakupListAPI,
  getProjectVendorListAPI,
  UpdateProjectVendorBreakupDataAPI,
} from '../../../modules/project-master-page/vendor-Master-page/ProjectVendorCRUD'
import axios from 'axios'
import {Button, Modal} from 'react-bootstrap-v5'
import {ReductionItemList} from './reduction-itrm-pages/ReductionItemList'
import {getAllVendorReductionListAPI} from '../../../modules/project-master-page/vendor-Master-page/reduction-item-page/ReductionItemCRUD'
import {IVendorReductionItemModel} from '../../../models/projects-page/IVendorReductionItemModel'
type Props = {}

interface IProjectVendor {
  loading: boolean
  projectVendorData: IProjectVendorModel[]
  tmpProjectVendorData: IProjectVendorModel[]
  projVendBreakupData: IProjVendBreakupModel[]
  tmpProjVendBreakupData: IProjVendBreakupModel[]
  vendorReductionItemData: IVendorReductionItemModel[]
  tmpVendorReductionItemData: IVendorReductionItemModel[]
  selProjectVendorID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  selVendorID: number
  selProjectID: number
  selVendorTypeName: string
  selVendorName: string
  ProjectName: string
  selVendorCost: number
  selProjectVendorDtlID: number
  vendorTotalAmt: number
  reductionTotalAmt: number
  paidTotalAmt: number
  remTotalAmt: number
  workOrdTotalAmt: number
  projectCategoryID: number
}

const ProjectVendorList: React.FC<Props> = () => {
  const location = useLocation()
  const {projectID} = useParams<{projectID: string}>()
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    projectVendorData: [] as IProjectVendorModel[],
    tmpProjectVendorData: [] as IProjectVendorModel[],
    projVendBreakupData: [] as IProjVendBreakupModel[],
    tmpProjVendBreakupData: [] as IProjVendBreakupModel[],
    vendorReductionItemData: [] as IVendorReductionItemModel[],
    tmpVendorReductionItemData: [] as IVendorReductionItemModel[],
    selProjectVendorID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    selVendorID: 0,
    selProjectID: 0,
    selVendorTypeName: '',
    selVendorName: '',
    ProjectName: '',
    selVendorCost: 0,
    selProjectVendorDtlID: 0,
    vendorTotalAmt: 0,
    reductionTotalAmt: 0,
    paidTotalAmt: 0,
    remTotalAmt: 0,
    workOrdTotalAmt: 0,
    projectCategoryID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectCategoryID: any = lc.projectCategoryID
      getAllProjectData(projName, projectCategoryID)
    }, 100)
  }, [])

  function getAllProjectData(ProjectName: string, projectCategoryID: number) {
    getProjectVendorListAPI(parseInt(projectID))
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let vendTtlAmt: any = 0
          let paidTtlAmt: any = 0
          let remTtlAmt: any = 0
          let workOrdTtlAmt: any = 0
          let reductionTtlAmt: any = 0
          for (let key in responseData) {
            // alert(responseData[key].vendorCost)
            vendTtlAmt = parseInt(vendTtlAmt) + parseInt(responseData[key].vendorCost)
            paidTtlAmt = parseInt(paidTtlAmt) + parseInt(responseData[key].paidAmount)
            remTtlAmt = parseInt(remTtlAmt) + parseInt(responseData[key].remainingAmount)
            workOrdTtlAmt = parseInt(workOrdTtlAmt) + parseInt(responseData[key].workOrderCost)
            reductionTtlAmt = parseInt(reductionTtlAmt) + parseInt(responseData[key].reductionCost)
          }
          setState({
            ...state,
            projectVendorData: responseData,
            tmpProjectVendorData: responseData,
            vendorTotalAmt: vendTtlAmt,
            paidTotalAmt: paidTtlAmt,
            remTotalAmt: remTtlAmt,
            workOrdTotalAmt: workOrdTtlAmt,
            reductionTotalAmt: reductionTtlAmt,
            ProjectName: ProjectName,
            projectCategoryID: projectCategoryID,
            // selProjectID:parseInt(projectID),
            loading: false,
          })
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectVendorData: [],
            tmpProjectVendorData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectVendorData: [],
          tmpProjectVendorData: [],
          loading: false,
        })
      })
  }
  // =============Breakup Model Popup ======
  const [showBreakup, setShowBreakup] = useState(false)
  const handleCloseBreakup = () => setShowBreakup(false)
  const handleShowBreakup = () => setShowBreakup(true)

  function getAllBreakupData(
    projectVendorID: number,
    vendorTypeName: string,
    vendorName: string,
    vendorCost: number
  ) {
    getProjectVendorBreakupListAPI(projectVendorID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let tmplstCheckedData = [] as IProjVendBreakupModel[]
          for (let k in responseData) {
            let tmpAllData: IProjVendBreakupModel = {
              projectPMCVendorMapDtl: responseData[k]['projectPMCVendorMapDtl'],
              projectVendorID: responseData[k]['projectVendorID'],
              vendorID: responseData[k]['vendorID'],
              assignDate: responseData[k]['assignDate'],
              workCompleteDate: responseData[k]['workCompleteDate'],
              vendorCost: responseData[k]['vendorCost'],
              filePath: responseData[k]['filePath'],
              remarks: responseData[k]['remarks'],
              editID: 0,
            }
            tmplstCheckedData.push(tmpAllData)
          }
          setState({
            ...state,
            projVendBreakupData: tmplstCheckedData,
            tmpProjVendBreakupData: tmplstCheckedData,
            selProjectVendorID: projectVendorID,
            selVendorTypeName: vendorTypeName,
            selVendorName: vendorName,
            selVendorCost: vendorCost,
            loading: false,
          })
          setShowBreakup(true)
          setTotalBrkup(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projVendBreakupData: [],
            tmpProjVendBreakupData: [],
            loading: false,
          })
          setShowBreakup(true)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projVendBreakupData: [],
          tmpProjVendBreakupData: [],
          loading: false,
        })
      })
  }

  // -----------------Edit BreakUp----------------
  function handleChangeAssignDate(e: any, uid: number) {
    const tmpValue = e.target.value
    const tmpID = e.target.id
    let tmplstBreakUp = [] as IProjVendBreakupModel[]
    tmplstBreakUp = state.projVendBreakupData
    for (let k in tmplstBreakUp) {
      if (uid === tmplstBreakUp[k].projectPMCVendorMapDtl) {
        tmplstBreakUp[k].assignDate = tmpValue
        break
      }
    }
    setState({
      ...state,
      projVendBreakupData: tmplstBreakUp,
    })
  }
  function handleChangeRemarks(e: any, uid: number) {
    const tmpValue = e.target.value
    const tmpID = e.target.id
    let tmplstBreakUp = [] as IProjVendBreakupModel[]
    tmplstBreakUp = state.projVendBreakupData
    for (let k in tmplstBreakUp) {
      if (uid === tmplstBreakUp[k].projectPMCVendorMapDtl) {
        tmplstBreakUp[k].remarks = tmpValue
        break
      }
    }
    setState({
      ...state,
      projVendBreakupData: tmplstBreakUp,
    })
  }
  function handleChangeVendorCost(e: any, uid: number) {
    let tmpValue = e.target.value
    let tmplstBreakUp = [] as IProjVendBreakupModel[]
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      tmplstBreakUp = state.projVendBreakupData
      for (let k in tmplstBreakUp) {
        if (uid === tmplstBreakUp[k].projectPMCVendorMapDtl) {
          tmplstBreakUp[k].vendorCost = tmpValue
          break
        }
      }
      setState({
        ...state,
        projVendBreakupData: tmplstBreakUp,
      })
    } else if ((tmpValue = '')) {
      tmplstBreakUp = state.projVendBreakupData
      for (let k in tmplstBreakUp) {
        if (uid === tmplstBreakUp[k].projectPMCVendorMapDtl) {
          tmplstBreakUp[k].vendorCost = tmpValue
          break
        }
      }
      setState({
        ...state,
        projVendBreakupData: tmplstBreakUp,
      })
    }
  }
  function handleChangeWorkCompleteDate(e: any, uid: number) {
    const tmpValue = e.target.value
    const tmpID = e.target.id
    let tmplstBreakUp = [] as IProjVendBreakupModel[]
    tmplstBreakUp = state.projVendBreakupData
    for (let k in tmplstBreakUp) {
      if (uid === tmplstBreakUp[k].projectPMCVendorMapDtl) {
        tmplstBreakUp[k].workCompleteDate = tmpValue
        break
      }
    }
    setState({
      ...state,
      projVendBreakupData: tmplstBreakUp,
    })
  }

  // -----------------Edit BreakUp----------------
  function handleEditBrkup(uid: number) {
    let tmplstBreakUp = [] as IProjVendBreakupModel[]
    tmplstBreakUp = state.projVendBreakupData
    for (let k in tmplstBreakUp) {
      if (uid === tmplstBreakUp[k].projectPMCVendorMapDtl) {
        tmplstBreakUp[k].editID = 1
        break
      }
    }
    setState({
      ...state,
      projVendBreakupData: tmplstBreakUp,
    })
  }

  function handleEditBrkupCancel() {
    state.projVendBreakupData = []
    setState({
      ...state,
      projVendBreakupData: state.tmpProjVendBreakupData,
    })
  }

  function EditBreakUpData(data: IProjVendBreakupModel) {
    if (data.vendorCost == '0' || data.vendorCost == '') {
      return toast.error('Vendor cost field is required')
    }
    UpdateProjectVendorBreakupDataAPI(
      data.projectPMCVendorMapDtl,
      data.projectVendorID,
      data.vendorCost,
      data.assignDate,
      data.workCompleteDate,
      data.remarks
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Updated Successfully')
          handleCloseBreakup()
          getAllProjectData(state.ProjectName, state.projectCategoryID)
        } else {
          toast.error(`${response.data.massege}`)
          handleCloseBreakup()
          getAllProjectData(state.ProjectName, state.projectCategoryID)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        handleCloseBreakup()
        getAllProjectData(state.ProjectName, state.projectCategoryID)
      })
  }
  // ============================
  function getAllVendorReductionDescData(
    vendorID: number,
    projectVendorID: number,
    vendorName: string
  ) {
    // if (vendorTypeID > 0) {
    getAllVendorReductionListAPI(projectVendorID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            vendorReductionItemData: responseData,
            tmpVendorReductionItemData: responseData,
            selVendorName: vendorName,
            selVendorID: vendorID,
            selProjectVendorID: projectVendorID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
          setShowReduct(true)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            vendorReductionItemData: [],
            tmpVendorReductionItemData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          vendorReductionItemData: [],
          tmpVendorReductionItemData: [],
          loading: false,
        })
      })
  }

  //==================Reduction Model Function===============
  const [showReduct, setShowReduct] = useState(false)
  const handleCloseReduct = () => {
    setShowReduct(false)
  }

  // const handleShowReduct = () => {
  //   setShowReduct(true)
  // }
  //==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectID: number) => {
    setState({
      ...state,
      selProjectVendorID: projectID,
      loading: false,
    })
    setShow(true)
  }

  //==================Delete Api ============================
  function deleteProjVendor(projectVendorID: number) {
    DeleteProjectVendorDataAPI(projectVendorID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllProjectData(state.ProjectName, state.projectCategoryID)
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }
  //==================Delete Breakup Model Function===============

  const [showBrkup, setShowBrkup] = useState(false)
  const handleCloseBrkup = () => setShowBrkup(false)
  const handleShowBrkup = (projectPMCVendorMapDtl: number) => {
    setState({
      ...state,
      selProjectVendorDtlID: projectPMCVendorMapDtl,
      loading: false,
    })
    setShowBrkup(true)
  }

  //==================Delete Breakup Api ============================
  function deleteProjVendorBrkup(projectPMCVendorDtlID: number) {
    deleteProjectPMCVendorMapDtlDataAPI(projectPMCVendorDtlID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllBreakupData(
            state.selProjectVendorID,
            state.selVendorTypeName,
            state.selVendorName,
            state.selVendorCost
          )
          setShowBrkup(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShowBrkup(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowBrkup(false)
      })
  }

  // ==================== Breakup Pagination==============
  const onShowSizeChangeBrkup = (current: any, pageSize: any) => {
    setPostPerPageBrkup(pageSize)
  }
  const [totalBrkup, setTotalBrkup] = useState(0) //  length

  const [pageBrkup, setPageBrkup] = useState(1)
  const [postPerPageBrkup, setPostPerPageBrkup] = useState(10)
  const indexOfLastPageBrkup = pageBrkup * postPerPageBrkup
  const indexOfFirstPageBrkup = indexOfLastPageBrkup - postPerPageBrkup
  const currentPostsBrkup: IProjVendBreakupModel[] = state.projVendBreakupData.slice(
    indexOfFirstPageBrkup,
    indexOfLastPageBrkup
  )

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProjectVendorData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorCost.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.remainingAmount.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, projectVendorData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectVendorData: state.tmpProjectVendorData})
      // If the text field is empty, show all users
      setTotal(state.tmpProjectVendorData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length

  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectVendorModel[] = state.projectVendorData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // --------------------Download Pdf---------------------
  const [selDwID, setselDwID] = useState<number>(0)
  const [downloadLoader, setDownloadLoader] = useState<boolean>(false)
  function getQuotationPdf(projectVendorID: number, ProjectName: string, CompanyName: string) {
    var URL = process.env.REACT_APP_API_URL
    if (projectVendorID == 0) {
     // URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadVendorWorkOrder`
       URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadVendorWorkOrder_WithGST`
      setDownloadLoader(true)
      setselDwID(projectVendorID)
    } else {
    //  URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadVendorWorkOrder`
        URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadVendorWorkOrder_WithGST`
      setDownloadLoader(true)
      setselDwID(projectVendorID)
    }

    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      .post(URL, {projectVendorID: projectVendorID})
      .then((response) => response.data.responseObject)
      .then((blob) => {
        // The Base64 string of a simple PDF file
        var b64 = blob
        // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
        // var bin = atob(b64)
        // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
        // Embed the PDF into the HTML page and show it to the user
        // -------------------------------------------------------------------------
        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        const fileName = 'WorkOrder_' + ProjectName + '_' + CompanyName + Tdate + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setDownloadLoader(false)
        setselDwID(0)
      })
  }

  // --------------------Download All WorkOrder Pdf---------------------
  const [downloadAllLoader, setDownloadAllLoader] = useState<boolean>(false)

  function getAllWorkOrderPdf(projectID: number, ProjectName: string) {
    var URL = process.env.REACT_APP_API_URL
    if (projectID == 0) {
     // URL = `${URL}/ProjectInvoice/DownloadVendorAllWorkOrder`
     URL = `${URL}/ProjectInvoice/DownloadVendorAllWorkOrder_WithGST`
      setDownloadAllLoader(true)
    } else {
     // URL = `${URL}/ProjectInvoice/DownloadVendorAllWorkOrder`
      URL = `${URL}/ProjectInvoice/DownloadVendorAllWorkOrder_WithGST`
      setDownloadAllLoader(true)
    }

    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      .post(URL, {projectID: projectID})
      .then((response) => response.data.responseObject)
      .then((blob) => {
        // The Base64 string of a simple PDF file
        var b64 = blob
        // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
        // var bin = atob(b64)
        // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
        // Embed the PDF into the HTML page and show it to the user
        // -------------------------------------------------------------------------
        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        const fileName = 'PMC_WorkOrder_All' + ProjectName + '_' + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setDownloadAllLoader(false)
      })
  }
  // --------------------Breakup Download Pdf---------------------
  const [selBrkupDwID, setselBrkuDwID] = useState<number>(0)
  const [BrkudownloadLoader, setBrkuDownloadLoader] = useState<boolean>(false)
  function getVendorBreakupPdf(
    projectPMCVendorMapDtl: number,
    ProjectName: string,
    VendorName: string
  ) {
    var URL = process.env.REACT_APP_API_URL
    if (projectPMCVendorMapDtl == 0) {
      URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadVendorBreackupWorkOrder`
      setBrkuDownloadLoader(true)
      setselBrkuDwID(projectPMCVendorMapDtl)
    } else {
      URL = `${process.env.REACT_APP_API_URL}/ProjectInvoice/DownloadVendorBreackupWorkOrder`
      setBrkuDownloadLoader(true)
      setselBrkuDwID(projectPMCVendorMapDtl)
    }

    var todaydate = new Date(),
      Tdate = todaydate.getDate() + '' + (todaydate.getMonth() + 1) + '' + todaydate.getFullYear()
    axios
      .post(URL, {projectPMCVendorMapDtlID: projectPMCVendorMapDtl})
      .then((response) => response.data.responseObject)
      .then((blob) => {
        // The Base64 string of a simple PDF file
        var b64 = blob
        // Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
        // var bin = atob(b64)
        // console.log('File Size:', Math.round(bin.length / 1024), 'KB')
        // Embed the PDF into the HTML page and show it to the user
        // -------------------------------------------------------------------------
        const linkSource = `data:application/pdf;base64,${b64}`
        const aPdfDownload = document.createElement('a')
        const fileName = 'WorkOrder_Breakup_' + ProjectName + '_' + VendorName + '.pdf'
        aPdfDownload.setAttribute('download', fileName)
        aPdfDownload.href = linkSource
        aPdfDownload.download = fileName
        document.body.append(aPdfDownload)
        aPdfDownload.click()
        aPdfDownload.remove()
        setBrkuDownloadLoader(false)
        setselBrkuDwID(0)
      })
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />

              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </span>
          </div>
          {state.projectCategoryID === 2 ||
          state.projectCategoryID === 3 ||
          state.projectCategoryID === 8 ||
          state.projectCategoryID === 9 ||
          state.projectCategoryID === 10 ? (
            <div className='col-1 text-end mt-5'>
              {downloadAllLoader ? (
                <span className='d-flex justify-content-center m-5'>
                  <span
                    className='spinner-border text-primary'
                    style={{width: '1rem', height: '1rem'}}
                    role='status'
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </span>
                </span>
              ) : (
                <div
                  onClick={() => getAllWorkOrderPdf(parseInt(projectID), state.ProjectName)}
                  className='symbol symbol-40px cursor-pointer d-block justify-content-center text-center'
                  data-bs-toggle='tooltip'
                  data-bs-placement='top'
                  data-bs-trigger='hover'
                  title='Download Work Order'
                >
                  <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
                </div>
              )}
            </div>
          ) : (
            <div className='d-none'></div>
          )}

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: `/projects/project/edit/${parseInt(projectID)}/vendor/add`,
                state: {projectName: state.ProjectName, projectCategoryID: state.projectCategoryID},
              }}
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Assign Date</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Vendor Type</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-flex mb-1'>Vendor Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Remarks</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-flex mb-1'>Vendor Cost</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-flex mb-1'>Reduction Cost</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-flex mb-1'>Final Cost</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-flex mb-1'>Paid Amount</span>
                  </th>
                  <th className='min-w-100px'>
                    <span className='d-flex mb-1'>Remaining Amount</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Work Complete Date</span>
                  </th>
                  <th className='min-w-50px'>
                    <span className='d-flex mb-1'>Reduction</span>
                  </th>
                  {/* <th className='min-w-50px'>
                    <span className='d-flex mb-1'>Breakup</span>
                  </th> */}
                  <th className='min-w-75px'>
                    <span className='d-flex mb-1'>Download Work Order</span>
                  </th>

                  <th className='min-w-75px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {state.projectVendorData.length > 0 &&
                  state.projectVendorData.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.assignDate}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.vendorTypeName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.companyName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.remarks}
                          </span>
                        </td>
                        <td>
                          <span className='text-info text-hover-primary d-block mb-1 fs-6'>
                            {data.workOrderCost}
                          </span>
                        </td>
                        <td>
                          <span className='text-info text-hover-primary d-block mb-1 fs-6'>
                            {data.reductionCost}
                          </span>
                        </td>
                        <td>
                          <span className='text-info text-hover-primary d-block mb-1 fs-6'>
                            {data.vendorCost}
                          </span>
                        </td>
                        <td>
                          <span className='text-success text-hover-primary d-block mb-1 fs-6'>
                            {data.paidAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-danger text-hover-primary mb-1 fs-6'>
                            {data.remainingAmount}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.workCompleteDate}
                          </span>
                        </td>
                        <td>
                          {data.vendorTypeID == 1 && data.projectCategoryID == 1 ? (
                            <span
                              // className='text-dark text-hover-primary mb-1 fs-6'
                              onClick={() =>
                                getAllVendorReductionDescData(
                                  data.vendorID,
                                  data.projectVendorID,
                                  data.companyName
                                )
                              }
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                              title='Vendor Reduction'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen024.svg'
                                className='svg-icon-2 svg-icon-danger'
                              />
                            </span>
                          ) : (
                            <span className='ms-3 fs-7'>N.A.</span>
                          )}
                        </td>
                        {/* <td>
                          {data.vendorTypeID == 1 && data.projectCategoryID == 1 ? (
                            <span
                              // className='text-dark text-hover-primary mb-1 fs-6'
                              onClick={() =>
                                getAllBreakupData(
                                  data.projectVendorID,
                                  data.vendorTypeName,
                                  data.companyName,
                                  data.vendorCost
                                )
                              }
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                              title='Vendor Breakup'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen023.svg'
                                className='svg-icon-2 svg-icon-danger'
                              />
                            </span>
                          ) : (
                            <span className='ms-3 fs-7'>N.A.</span>
                          )}
                        </td> */}
                        <td className='text-center'>
                          <>
                            {downloadLoader && selDwID == data.projectVendorID ? (
                              <span className='d-flex justify-content-center m-5 p-5'>
                                <span
                                  className='spinner-border text-primary'
                                  style={{width: '1rem', height: '1rem'}}
                                  role='status'
                                >
                                  <span className='visually-hidden'>Loading...</span>
                                </span>
                              </span>
                            ) : (
                              <span
                                onClick={() =>
                                  getQuotationPdf(
                                    data.projectVendorID,
                                    state.ProjectName,
                                    data.companyName
                                  )
                                }
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                                data-bs-toggle='tooltip'
                                data-bs-placement='top'
                                title='Download'
                              >
                                <span className='fa fa-download fs-2'></span>
                              </span>
                            )}
                          </>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/projects/project/edit/${parseInt(
                                  projectID
                                )}/vendor/edit/${data.projectVendorID}`,
                                state: {
                                  projectID: projectID,
                                  projectCategoryID: state.projectCategoryID,
                                  projectName: state.ProjectName,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.projectVendorID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                <tr className='text-dark'>
                  <td className='text-start fw-bolder fs-6'>Total</td>
                  <td className='text-start'></td>
                  <td className='text-start'></td>
                  <td className='text-start'></td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.workOrdTotalAmt}
                  </td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.reductionTotalAmt}
                  </td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.vendorTotalAmt}
                  </td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.paidTotalAmt}
                  </td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.remTotalAmt}
                  </td>
                  <td className='text-start' colSpan={5}></td>
                </tr>
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={state.projectVendorData.length}
                  loading={state.loading}
                  colSpan={15}
                />
              </tbody>
            </table>
          </div>
          {/* <div className='text-center'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div> */}
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selProjectVendorID}
        pageName={'projVendor'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProjVendor(state.selProjectVendorID)}
      />
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selProjectVendorID}
        pageName={'Vendor Breakup'}
        show={showBrkup}
        handleClose={handleCloseBrkup}
        deleteData={() => deleteProjVendorBrkup(state.selProjectVendorDtlID)}
      />
      {/* =====================Breakup Popup Model=================== */}
      <Modal
        size='xl'
        show={showBreakup}
        onHide={handleCloseBreakup}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <div className='d-flex mb-2 ms-10'>
              <span className='textwhite d-flex fw-bolder fs-5 text-light'>Vendor Name : </span>
              <span className='text-primary d-flex fs-5 text-hover-primary px-5'>
                {state.selVendorName}
              </span>
              <span className='text-white d-flex fw-bolder fs-5 text-light ms-5'>
                Vendor Cost :{' '}
              </span>
              <span className='text-primary d-flex text-hover-primary px-5 fs-5'>
                {state.selVendorCost}
              </span>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          <Modal.Body>
            <div className='card-body py-3'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                  {/* begin::Table head */}
                  <thead className='text-center'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-50px'>
                        <span className='d-block mb-1'>Assign Date</span>
                      </th>
                      <th className='min-w-50px'>
                        <span className='d-block mb-1 ps-2'>Work Order</span>
                      </th>
                      <th className='min-w-50px'>
                        <span className='d-block mb-1 ps-2'>Vendor Cost</span>
                      </th>
                      <th className='min-w-50px'>
                        <span className='d-block mb-1 ps-2'>Work Complete Date</span>
                      </th>
                      <th className='min-w-50px'>
                        <span className='d-block mb-1 ps-2'>Download</span>
                      </th>
                      <th className='min-w-50px'>
                        <span className='min-w-100px text-end'>Edit | Delete</span>
                      </th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className='text-center'>
                    {currentPostsBrkup.length > 0 &&
                      currentPostsBrkup.map((data, index) => {
                        return (
                          <tr className='text-center' key={index}>
                            <td className='text-center'>
                              {data.editID == 0 ? (
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.assignDate}
                                </span>
                              ) : (
                                <span className='d-flex justify-content-center'>
                                  <input
                                    type='date'
                                    className='form-control form-control-sm border-primary form-control-solid bg-light-primary text-center'
                                    // style={{padding: '0.25rem'}}
                                    id={`${data.projectPMCVendorMapDtl}`}
                                    disabled={data.editID == 0 ? true : false}
                                    value={data.assignDate}
                                    onChange={(e: any) =>
                                      handleChangeAssignDate(e, data.projectPMCVendorMapDtl)
                                    }
                                  />
                                </span>
                              )}
                            </td>
                            <td className='text-center'>
                              {data.editID == 0 ? (
                                <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                                  {data.remarks}
                                </span>
                              ) : (
                                <span className='d-flex justify-content-center'>
                                  <input
                                    type='text'
                                    className='form-control form-control-sm border-primary form-control-solid bg-light-primary text-center'
                                    id={`${data.projectPMCVendorMapDtl}`}
                                    disabled={data.editID == 0 ? true : false}
                                    value={data.remarks}
                                    onChange={(e: any) =>
                                      handleChangeRemarks(e, data.projectPMCVendorMapDtl)
                                    }
                                    autoFocus
                                  />
                                </span>
                              )}
                            </td>
                            <td className='text-center'>
                              {data.editID == 0 ? (
                                <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                                  {data.vendorCost}
                                </span>
                              ) : (
                                <span className='d-flex justify-content-center'>
                                  <input
                                    type='text'
                                    className='form-control form-control-sm border-primary form-control-solid bg-light-primary text-center'
                                    id={`${data.projectPMCVendorMapDtl}`}
                                    disabled={data.editID == 0 ? true : false}
                                    value={data.vendorCost}
                                    onChange={(e: any) =>
                                      handleChangeVendorCost(e, data.projectPMCVendorMapDtl)
                                    }
                                  />
                                </span>
                              )}
                            </td>
                            <td className='text-center'>
                              {data.editID == 0 ? (
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                  {data.workCompleteDate}
                                </span>
                              ) : (
                                <span className='d-flex justify-content-center'>
                                  <input
                                    type='date'
                                    className='form-control form-control-sm border-primary form-control-solid bg-light-primary text-center'
                                    id={`${data.projectPMCVendorMapDtl}`}
                                    disabled={data.editID == 0 ? true : false}
                                    value={data.workCompleteDate}
                                    onChange={(e: any) =>
                                      handleChangeWorkCompleteDate(e, data.projectPMCVendorMapDtl)
                                    }
                                  />
                                </span>
                              )}
                            </td>
                            <td className={'text-center'}>
                              <>
                                {BrkudownloadLoader && selBrkupDwID == data.projectVendorID ? (
                                  <span className='d-flex justify-content-center m-5 p-5'>
                                    <span
                                      className='spinner-border text-primary'
                                      style={{width: '1rem', height: '1rem'}}
                                      role='status'
                                    >
                                      <span className='visually-hidden'>Loading...</span>
                                    </span>
                                  </span>
                                ) : (
                                  <span
                                    onClick={() =>
                                      getVendorBreakupPdf(
                                        data.projectPMCVendorMapDtl,
                                        state.ProjectName,
                                        state.selVendorName
                                      )
                                    }
                                    className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                                    data-bs-toggle='tooltip'
                                    data-bs-placement='top'
                                    title='Breakup Download'
                                  >
                                    <span className='fa fa-download fs-2'></span>
                                  </span>
                                )}
                              </>
                            </td>
                            <td className='text-center'>
                              {index == 0 ? (
                                <span className='ms-7'>N.A.</span>
                              ) : (
                                <>
                                  {data.editID == 1 ? (
                                    <>
                                      <div
                                        onClick={() => EditBreakUpData(data)}
                                        className='btn btn-bg-light bg-hover-primary text-primary text-hover-inverse-primary btn-sm px-3 me-1 border border-primary'
                                      >
                                        <span>Update</span>
                                      </div>
                                      <div
                                        onClick={() => handleCloseBreakup()}
                                        // onClick={() => handleEditBrkupCancel()}
                                        className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger'
                                      >
                                        <KTSVG
                                          path='/media/icons/duotune/general/gen040.svg'
                                          className='svg-icon-2x svg-icon-danger'
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        onClick={() => handleEditBrkup(data.projectPMCVendorMapDtl)}
                                        className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                                      >
                                        <KTSVG
                                          path='/media/icons/duotune/art/art005.svg'
                                          className='svg-icon-3 svg-icon-primary'
                                        />
                                      </div>
                                      <div
                                        onClick={() => handleShowBrkup(data.projectPMCVendorMapDtl)}
                                        className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                                      >
                                        <KTSVG
                                          path='/media/icons/duotune/general/gen027.svg'
                                          className='svg-icon-3 svg-icon-danger'
                                        />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    <BlankDataImageInTable
                      length={state.projVendBreakupData.length}
                      loading={state.loading}
                      colSpan={9}
                    />
                  </tbody>
                </table>
              </div>
              <div className='text-center'>
                <Pagination
                  onChange={(value: any) => setPageBrkup(value)}
                  pageSize={postPerPageBrkup}
                  total={totalBrkup}
                  current={pageBrkup}
                  showSizeChanger
                  showQuickJumper
                  onShowSizeChange={onShowSizeChangeBrkup}
                  showTotal={(totalBrkup) => `Total ${totalBrkup} items`}
                />
              </div>
            </div>
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseBreakup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ReductionItemList
        showReduction={showReduct}
        handleCloseReduction={handleCloseReduct}
        vendorID={state.selVendorID}
        projectID={parseInt(projectID)}
        vendorReductionItemData={state.tmpVendorReductionItemData}
        projectVendorID={state.selProjectVendorID}
        vendorName={state.selVendorName}
        allVendorReductionDescListFunc={getAllVendorReductionDescData}
      />
    </>
  )
}

export {ProjectVendorList}
