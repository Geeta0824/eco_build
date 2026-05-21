import {Pagination} from 'antd'
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import moment from 'moment'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  DeleteProjectDataAPI,
  createProjectStatusHistory,
  getAllProjectListByRoleIDAndEmployeeIDAPI_Pagination,
  getEmployeeListWithProjectIDApi,
  getGetProjectDetailsList_ByProjectIDAPI,
} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IEmployeeMapModel, IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {
  Add_ProjectDesignStage_ChangeByDesignerAPI,
  diyOtherWarkStageChangeAPI,
  DIYWorkStageOrderVendorStageChangeAPI,
  Get_StageList_For_DesignerBy_ProjectIDAPI,
  getAddonWorkListForSupervisorByProjectID,
  getDiyOtherWorkStageListForSupervisorByProjectIDAPI,
  GetDIYWorkStageListForSupervisorByProjectIDAPI,
  getModularWorkStageListForSupervisorByProjectIDAPI,
  getOtherVendorWorkListForSupervisorByProjectID,
  GetPMCWorkStageListForSupervisorByProjectIDAPI,
  OtherVendorWorkOrderVendorStageChangeAPI,
  PMCAddonWorkVendorStageChangeAPI,
  PMCVendorStageChangeAPI,
} from '../../../modules/master-page/pmc-work-stage-master-page/PMCWorkStageCRUD'
import {RootState} from '../../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {ProjectCard} from './ProjectCard'
import {
  IDiyOtherWorkForSupervisorModel,
  IDIYWorkStageForSupervisorModel,
  IPMCAddonWorkOrderForSupervisorModel,
  IPMCOtherWorkForSupervisorModel,
  IPMCWorkStageForSupervisorModel,
} from '../../../models/master-page/IPMCWorkStageModel'
import {GetProjectStatusForDropDownListAPI} from '../../../modules/master-page/project-status-master-page/ProjectStatusCRUD'
import {IProjectStatusModel} from '../../../models/master-page/IProjectStatusModel'
import {ModelPopUpEmployeeMap} from './ModelPopUpEmployeeMap'
import {ModalPopUpForModularProjectStage} from './ModalPopUpForModularProjectStage'
import {IProjectDesignerStageChangeModel} from '../../../models/projects-page/ProjectDesignerStageModel'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {IDesignerRemarkModel} from '../../../models/projects-page/ImpRemarksModel'
import ProjectDesignRemark from './project-design-remark/ProjectDesignRemark'
import {GetProjectDesignerRemarkListListAPI} from '../../../modules/project-master-page/imp-remarks/DesignerRemarkCRUD'
import {debounce} from 'lodash'

type UIContextType = {
  getBHKFunc(value: number): void
  selBHKID: number
}

const defaultValues: UIContextType = {
  getBHKFunc: (): void => {},
  selBHKID: 0,
}

export const ProjectMain = createContext<UIContextType>(defaultValues)
export function useProjectMain() {
  return useContext(ProjectMain)
}

type Props = {}

interface IProject {
  loading: boolean
  projectData: IProjectModel[]
  tmpProjectData: IProjectModel[]
  projectDetailsData: IProjectModel[]
  workStageData: IPMCWorkStageForSupervisorModel[]
  addonWorkOrder: IPMCAddonWorkOrderForSupervisorModel[]
  pmcOtherVendorWorkOrder: IPMCOtherWorkForSupervisorModel[]
  projectStatusData: IProjectStatusModel[]
  objEmpData: IEmployeeMapModel[]
  objProjData: IProjectModel
  workDIYStageData: IDIYWorkStageForSupervisorModel[]
  temWorkDIYStageData: IDIYWorkStageForSupervisorModel[]
  workModularStageData: IDIYWorkStageForSupervisorModel[]
  diyOtherWorkStgtData: IDiyOtherWorkForSupervisorModel[]
  temDiyOtherWorkStgtData: IDiyOtherWorkForSupervisorModel[]
  projectDesignStageData: IProjectDesignerStageChangeModel[]
  selProjectID: number
  activeID: number
  selProjStatusID: number
  activeType: any
  imageShow: string
  action: string
  selProjectCategoryID: number
  projectName: string
  selProjectCategoryName: string
  designerRemarkData: IDesignerRemarkModel[]
  add_edit: number
}

const ProjectList: React.FC<Props> = () => {
  const location = useLocation()
  const [modalLoader, setModalLoader] = useState(false)
  const [stageDate, setStageDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
  const [name, setName] = useState('')
  const [total, setTotal] = useState(0) //  length
  const {projectID} = useParams<{projectID: string}>()
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(15)
  // const indexOfLastPage = page * postPerPage
  // const indexOfFirstPage = indexOfLastPage - postPerPage
  // const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)

  const [showProDtl, setShowProDtl] = useState(false)
  const [state, setState] = useState<IProject>({
    loading: false,
    projectData: [] as IProjectModel[],
    tmpProjectData: [] as IProjectModel[],
    projectDetailsData: [] as IProjectModel[],
    workStageData: [] as IPMCWorkStageForSupervisorModel[],
    addonWorkOrder: [] as IPMCAddonWorkOrderForSupervisorModel[],
    pmcOtherVendorWorkOrder: [] as IPMCOtherWorkForSupervisorModel[],
    projectStatusData: [] as IProjectStatusModel[],
    objEmpData: [] as IEmployeeMapModel[],
    objProjData: {} as IProjectModel,
    workDIYStageData: [] as IDIYWorkStageForSupervisorModel[],
    temWorkDIYStageData: [] as IDIYWorkStageForSupervisorModel[],
    workModularStageData: [] as IDIYWorkStageForSupervisorModel[],
    diyOtherWorkStgtData: [] as IDiyOtherWorkForSupervisorModel[],
    temDiyOtherWorkStgtData: [] as IDiyOtherWorkForSupervisorModel[],
    projectDesignStageData: [] as IProjectDesignerStageChangeModel[],
    selProjectID: 0,
    activeID: 0,
    selProjStatusID: 0,
    activeType: false,
    imageShow: '',
    action: 'ProjInfo',
    selProjectCategoryID: 0,
    projectName: '',
    selProjectCategoryName: '',
    designerRemarkData: [] as IDesignerRemarkModel[],
    add_edit: 0,
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var searchText: any = ''
      if (lc != undefined) {
        searchText = lc.searchText
      }
      setName(searchText)
      getProjectStatusData(searchText)
    }, 100)
  }, [])

  const [selBHKID, setSelBHKID] = useState(defaultValues.selBHKID)

  function getProjectStatusData(searchText: string) {
    // getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
    GetProjectStatusForDropDownListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getAllProjectByRoleIdData(responseData, searchText)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectStatusData: [],
            // tmpProjectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectStatusData: [],
          // tmpProjectData: [],
          loading: false,
        })
      })
  }

  // function getAllProjectByRoleIdData(projectStatusData: IProjectStatusModel[], searchText: string) {
  //   getAllProjectListByRoleIDAndEmployeeIDAPI(user.roleID, user.employeeID)
  //     // GetProjectStatusForDropDownListAPI()
  //     .then((response) => {
  //       let responseData = response.data
  //       let projectData = responseData.responseObject
  //       if (responseData.isSuccess == true) {
  //         if (searchText !== '') {
  //           const results = projectData.filter((user: any) => {
  //             return (
  //               user.mobileNumber.toString().includes(searchText.toString()) ||
  //               user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
  //               user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
  //               user.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
  //               user.projectType.toLowerCase().includes(searchText.toLowerCase()) ||
  //               user.projectAmount.toString().includes(searchText.toString()) ||
  //               user.projectStatusName.toLowerCase().includes(searchText.toLowerCase()) ||
  //               user.remainingAmount.toString().includes(searchText.toLowerCase()) ||
  //               user.paidAmount.toString().includes(searchText.toLowerCase()) ||
  //               user.projectCategoryName.toLowerCase().includes(searchText.toLowerCase()) ||
  //               user.email.toLowerCase().includes(searchText.toLowerCase())
  //             )
  //             // Use the toLowerCase() method to make it case-insensitive
  //           })
  //           setState({
  //             ...state,
  //             projectData: results,
  //             tmpProjectData: projectData,
  //             projectStatusData,
  //             loading: false,
  //           })
  //           setTotal(results.length)
  //         } else {
  //           setState({
  //             ...state,
  //             projectData: projectData,
  //             tmpProjectData: projectData,
  //             projectStatusData,
  //             loading: false,
  //           })
  //           setTotal(projectData.length)
  //         }
  //         setPage(1)
  //         setName(searchText)
  //       } else {
  //         toast.error(`${response.data.massege}`)
  //         setState({...state, projectData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, projectData: [], loading: false})
  //     })
  // }

  function getAllProjectByRoleIdData(
    projectStatusData: IProjectStatusModel[],
    searchText: string,
    currentPage: number = page,
    currentPostPerPage: number = postPerPage
  ) {
    getAllProjectListByRoleIDAndEmployeeIDAPI_Pagination(
      user.roleID,
      user.employeeID,
      currentPage,
      currentPostPerPage,
      searchText
    )
      .then((response) => {
        const responseData = response.data
        const projectData = responseData.responseObject

        if (responseData.isSuccess) {
          setTotal(responseData.totalRecords || 0)

          setState((prev) => ({
            ...prev,
            projectData: projectData,
            tmpProjectData: projectData,
            projectStatusData,
            loading: false,
          }))
        } else {
          toast.error(responseData.message || 'Error fetching data')
          setState((prev) => ({...prev, projectData: [], loading: false}))
        }
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`)
        setState((prev) => ({...prev, projectData: [], loading: false}))
      })
  }

  // Pagination Change
  // const onPageChange = (value: number) => {
  //   state.loading = true
  //   setPage(value)
  //   getAllProjectByRoleIdData(state.projectStatusData, name, value, postPerPage) // Use updated page
  // }
  const onPageChange = useCallback(
    (value: number) => {
      setState((prev) => ({ ...prev, loading: true })); // Set loading state
      setPage(value)
      getAllProjectByRoleIdData(state.projectStatusData, name, value, postPerPage)
    },
    [name, postPerPage]
  )

  // const onShowSizeChange = (current: number, size: number) => {
  //   setPostPerPage(size)
  //   setPage(1) // Reset to first page when page size changes
  //   getAllProjectByRoleIdData(state.projectStatusData, name, 1, size)
  // }
  const onShowSizeChange = useCallback(
    (current: number, size: number) => {
      setState((prev) => ({ ...prev, loading: true })); // Set loading state
      setPostPerPage(size)
      setPage(1) // Reset to first page when page size changes
      getAllProjectByRoleIdData(state.projectStatusData, name, 1, size)
    },
    [name]
  )

  const handleSearch = debounce((value: string) => {
    // setName(value)
    getAllProjectByRoleIdData(state.projectStatusData, value, page, postPerPage)
  }, 1000) // 500ms debounce delay

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value) // Update input field immediately
    setState((prev) => ({ ...prev, loading: true })); // Set loading state
    handleSearch(value) // Call the debounced function
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectID: number) => {
    setState({
      ...state,
      selProjectID: projectID,
      loading: false,
    })
    setShow(true)
  }

  function deleteProject(projectID: number) {
    DeleteProjectDataAPI(projectID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllProjectByRoleIdData(state.projectStatusData, name)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }
  // ================== Comman for tabbing======================
  const [tab, setTab] = useState(0)
  function handleChangeTab(type: number) {
    state.workStageData = []
    state.addonWorkOrder = []
    state.pmcOtherVendorWorkOrder = []
    setModalLoader(true)
    if (type == 0) {
      handleShowStage(
        state.selProjectID,
        state.selProjectCategoryID,
        state.projectName,
        state.selProjectCategoryName
      )
    } else if (type == 1) {
      handleShowSAddonWorkStage(state.selProjectID)
    } else if (type == 2) {
      handleShowOtherWork(state.selProjectID)
    }
    setTab(type)
  }

  // ================== Stage List ===============
  const [showStage, setShowStage] = useState(false)
  const [tabMod, setTabMod] = useState(0)
  const [showDIYStage, setShowDIYStage] = useState(false)
  const handleDIYCloseStage = () => setShowDIYStage(false)
  const [showModularStage, setShowModularStage] = useState(false)
  const handleModularCloseStage = () => setShowModularStage(false)
  const [showDesignStage, setShowDesignStage] = useState(false)
  const handleDesignCloseStage = () => setShowDesignStage(false)
  const handleCloseStage = () => setShowStage(false)

  const handleShowStage = (
    projectID: number,
    temProjectCategoryID: number,
    projectName: string,
    projectCategoryName: string
  ) => {
    if (temProjectCategoryID == 1) {
      state.workStageData = []
      state.addonWorkOrder = []
      state.pmcOtherVendorWorkOrder = []
      setTab(0)
      setModalLoader(true)
      GetPMCWorkStageListForSupervisorByProjectIDAPI(projectID)
        .then((response) => {
          if (response.data.isSuccess === true) {
            const responseData = response.data.responseObject
            let tmplstCheckedOutputData = [] as IPMCWorkStageForSupervisorModel[]
            let resultOptputObj: IPMCWorkStageForSupervisorModel[] = responseData
            for (let k in resultOptputObj) {
              let tmpCheckedData: IPMCWorkStageForSupervisorModel = {
                projectVendorPaymentStructureID:
                  resultOptputObj[k]['projectVendorPaymentStructureID'],
                projectID: resultOptputObj[k]['projectID'],
                vendorID: resultOptputObj[k]['vendorID'],
                supervisorID: resultOptputObj[k]['supervisorID'],
                approvalBy: resultOptputObj[k]['approvalBy'],
                sequenceNo: resultOptputObj[k]['sequenceNo'],
                isMember: 0,
                isStage1: 0,
                isStage2: 0,
                isCompleted: resultOptputObj[k]['isCompleted'],
                isCompleted1: resultOptputObj[k]['isCompleted1'],
                isCompleted2: resultOptputObj[k]['isCompleted2'],
                isStageApprove: resultOptputObj[k]['isStageApprove'],
                stageName: resultOptputObj[k]['stageName'],
                approveByName: resultOptputObj[k]['approveByName'],
                supervisorName: resultOptputObj[k]['supervisorName'],
                stageCompleteDate: resultOptputObj[k]['stageCompleteDate'],
                approveStageChangeDate: resultOptputObj[k]['approveStageChangeDate'],
                targetDate: resultOptputObj[k]['targetDate'],
                targetDateApproveDate: resultOptputObj[k]['targetDateApproveDate'],
                isTargetDateApprove: resultOptputObj[k]['isTargetDateApprove'],
                isTargetDate: resultOptputObj[k]['isTargetDate'],
              }
              tmplstCheckedOutputData.push(tmpCheckedData)
            }
            setState({
              ...state,
              workStageData: tmplstCheckedOutputData,
              selProjectID: projectID,
              projectName: projectName,
              selProjectCategoryName: projectCategoryName,
              loading: false,
            })
          } else {
            setState({
              ...state,
              workStageData: [],
              selProjectID: projectID,
              projectName: projectName,
              loading: false,
            })
            toast.error(`${response.data.massege}`)
            setShowStage(false)
          }
        })
        .catch((error) => {
          setState({
            ...state,
            workStageData: [],
            selProjectID: projectID,
            projectName: projectName,
            loading: false,
          })
          toast.error(`${error}`)
          setShowStage(false)
        })
      setModalLoader(false)
      setShowStage(true)
    } else if (temProjectCategoryID == 2) {
      state.workStageData = []
      state.addonWorkOrder = []
      state.pmcOtherVendorWorkOrder = []
      setDiyTab(0)
      setModalLoader(true)
      GetDIYWorkStageListForSupervisorByProjectIDAPI(projectID)
        .then((response) => {
          if (response.data.isSuccess === true) {
            const responseData = response.data.responseObject
            let tmplstDIYCheckedOutputData = [] as IDIYWorkStageForSupervisorModel[]
            let resultDIYOptputObj: IDIYWorkStageForSupervisorModel[] = responseData
            for (let k in resultDIYOptputObj) {
              let tmpDIYCheckedData: IDIYWorkStageForSupervisorModel = {
                vendorAgencyWorkStageID: resultDIYOptputObj[k]['vendorAgencyWorkStageID'],
                vendorID: resultDIYOptputObj[k]['vendorID'],
                agencyTypeID: resultDIYOptputObj[k]['agencyTypeID'],
                supervisorID: resultDIYOptputObj[k]['supervisorID'],
                approvalBy: resultDIYOptputObj[k]['approvalBy'],
                seqNo: resultDIYOptputObj[k]['seqNo'],
                isMember: 0,
                isStage1: 0,
                isStage2: 0,
                isCompleted: resultDIYOptputObj[k]['isCompleted'],
                isCompleted1: resultDIYOptputObj[k]['isCompleted1'],
                isCompleted2: resultDIYOptputObj[k]['isCompleted2'],
                isStageApprove: resultDIYOptputObj[k]['isStageApprove'],
                stageName: resultDIYOptputObj[k]['stageName'],
                approvalName: resultDIYOptputObj[k]['approvalName'],
                supervisorName: resultDIYOptputObj[k]['supervisorName'],
                agencyTypeName: resultDIYOptputObj[k]['agencyTypeName'],
                contactPerson: resultDIYOptputObj[k]['contactPerson'],
                percentage: resultDIYOptputObj[k]['percentage'],
                stageCompleteDate: resultDIYOptputObj[k]['stageCompleteDate'],
                createDate: resultDIYOptputObj[k]['createDate'],
                approveStageChangeDate: resultDIYOptputObj[k]['approveStageChangeDate'],
                targetDate: resultDIYOptputObj[k]['targetDate'],
                targetDateApproveDate: resultDIYOptputObj[k]['targetDateApproveDate'],
                isTargetDateApprove: resultDIYOptputObj[k]['isTargetDateApprove'],
                isTargetDate: resultDIYOptputObj[k]['isTargetDate'],
              }
              tmplstDIYCheckedOutputData.push(tmpDIYCheckedData)
            }
            setState({
              ...state,
              workDIYStageData: tmplstDIYCheckedOutputData,
              temWorkDIYStageData: responseData,
              selProjectID: projectID,
              selProjectCategoryName: projectCategoryName,
              projectName: projectName,
              loading: false,
            })
          } else {
            setState({
              ...state,
              workDIYStageData: [],
              temWorkDIYStageData: [],
              selProjectID: projectID,
              projectName: projectName,
              loading: false,
            })
            toast.error(`${response.data.massege}`)
            setShowStage(false)
          }
        })
        .catch((error) => {
          setState({
            ...state,
            workDIYStageData: [],
            temWorkDIYStageData: [],
            selProjectID: projectID,
            projectName: projectName,
            loading: false,
          })
          toast.error(`${error}`)
          setShowStage(false)
        })
      setModalLoader(false)
      setShowDIYStage(true)
    } else if (
      temProjectCategoryID == 3 ||
      temProjectCategoryID == 8 ||
      temProjectCategoryID == 9 ||
      temProjectCategoryID == 10
    ) {
      // state.workStageData = []
      // state.addonWorkOrder = []
      // state.pmcOtherVendorWorkOrder = []
      setTabMod(0)
      setModalLoader(true)
      getModularWorkStageListForSupervisorByProjectIDAPI(projectID)
        .then((response) => {
          if (response.data.isSuccess === true) {
            const responseData = response.data.responseObject
            let tmplstModularCheckedOutputData = [] as IDIYWorkStageForSupervisorModel[]
            let resultModularOptputObj: IDIYWorkStageForSupervisorModel[] = responseData
            for (let k in resultModularOptputObj) {
              let tmpModularCheckedData: IDIYWorkStageForSupervisorModel = {
                vendorAgencyWorkStageID: resultModularOptputObj[k]['vendorAgencyWorkStageID'],
                vendorID: resultModularOptputObj[k]['vendorID'],
                agencyTypeID: resultModularOptputObj[k]['agencyTypeID'],
                supervisorID: resultModularOptputObj[k]['supervisorID'],
                approvalBy: resultModularOptputObj[k]['approvalBy'],
                seqNo: resultModularOptputObj[k]['seqNo'],
                isMember: 0,
                isStage1: 0,
                isStage2: 0,
                isCompleted: resultModularOptputObj[k]['isCompleted'],
                isCompleted1: resultModularOptputObj[k]['isCompleted1'],
                isCompleted2: resultModularOptputObj[k]['isCompleted2'],
                isStageApprove: resultModularOptputObj[k]['isStageApprove'],
                stageName: resultModularOptputObj[k]['stageName'],
                approvalName: resultModularOptputObj[k]['approvalName'],
                supervisorName: resultModularOptputObj[k]['supervisorName'],
                agencyTypeName: resultModularOptputObj[k]['agencyTypeName'],
                contactPerson: resultModularOptputObj[k]['contactPerson'],
                percentage: resultModularOptputObj[k]['percentage'],
                stageCompleteDate: resultModularOptputObj[k]['stageCompleteDate'],
                createDate: resultModularOptputObj[k]['createDate'],
                approveStageChangeDate: resultModularOptputObj[k]['approveStageChangeDate'],
                targetDate: resultModularOptputObj[k]['targetDate'],
                targetDateApproveDate: resultModularOptputObj[k]['targetDateApproveDate'],
                isTargetDateApprove: resultModularOptputObj[k]['isTargetDateApprove'],
                isTargetDate: resultModularOptputObj[k]['isTargetDate'],
              }
              tmplstModularCheckedOutputData.push(tmpModularCheckedData)
            }
            setState({
              ...state,
              workModularStageData: tmplstModularCheckedOutputData,
              selProjectID: projectID,
              selProjectCategoryName: projectCategoryName,
              projectName: projectName,
              loading: false,
            })
          } else {
            setState({
              ...state,
              workModularStageData: [],
              selProjectID: projectID,
              projectName: projectName,
              loading: false,
            })
            toast.error(`${response.data.massege}`)
            setShowStage(false)
          }
        })
        .catch((error) => {
          setState({
            ...state,
            workDIYStageData: [],
            selProjectID: projectID,
            projectName: projectName,
            loading: false,
          })
          toast.error(`${error}`)
          setShowStage(false)
        })
      setModalLoader(false)
      setShowModularStage(true)
    } else {
      state.workStageData = []
      state.addonWorkOrder = []
      state.pmcOtherVendorWorkOrder = []
      setTab(0)
      setModalLoader(true)
      GetPMCWorkStageListForSupervisorByProjectIDAPI(projectID)
        .then((response) => {
          if (response.data.isSuccess === true) {
            const responseData = response.data.responseObject
            let tmplstCheckedOutputData = [] as IPMCWorkStageForSupervisorModel[]
            let resultOptputObj: IPMCWorkStageForSupervisorModel[] = responseData
            for (let k in resultOptputObj) {
              let tmpCheckedData: IPMCWorkStageForSupervisorModel = {
                projectVendorPaymentStructureID:
                  resultOptputObj[k]['projectVendorPaymentStructureID'],
                projectID: resultOptputObj[k]['projectID'],
                vendorID: resultOptputObj[k]['vendorID'],
                supervisorID: resultOptputObj[k]['supervisorID'],
                approvalBy: resultOptputObj[k]['approvalBy'],
                sequenceNo: resultOptputObj[k]['sequenceNo'],
                isMember: 0,
                isStage1: 0,
                isStage2: 0,
                isCompleted: resultOptputObj[k]['isCompleted'],
                isCompleted1: resultOptputObj[k]['isCompleted1'],
                isCompleted2: resultOptputObj[k]['isCompleted2'],
                isStageApprove: resultOptputObj[k]['isStageApprove'],
                stageName: resultOptputObj[k]['stageName'],
                approveByName: resultOptputObj[k]['approveByName'],
                supervisorName: resultOptputObj[k]['supervisorName'],
                stageCompleteDate: resultOptputObj[k]['stageCompleteDate'],
                approveStageChangeDate: resultOptputObj[k]['approveStageChangeDate'],
                targetDate: resultOptputObj[k]['targetDate'],
                targetDateApproveDate: resultOptputObj[k]['targetDateApproveDate'],
                isTargetDateApprove: resultOptputObj[k]['isTargetDateApprove'],
                isTargetDate: resultOptputObj[k]['isTargetDate'],
              }
              tmplstCheckedOutputData.push(tmpCheckedData)
            }
            setState({
              ...state,
              workStageData: tmplstCheckedOutputData,
              selProjectID: projectID,
              selProjectCategoryName: projectCategoryName,
              projectName: projectName,
              loading: false,
            })
          } else {
            setState({
              ...state,
              workStageData: [],
              selProjectID: projectID,
              projectName: projectName,
              loading: false,
            })
            toast.error(`${response.data.massege}`)
            setShowStage(false)
          }
        })
        .catch((error) => {
          setState({
            ...state,
            workStageData: [],
            selProjectID: projectID,
            projectName: projectName,
            loading: false,
          })
          toast.error(`${error}`)
          setShowStage(false)
        })
      setModalLoader(false)
      setShowStage(true)
    }
  }

  // ----------------------------- Project Design Stage--------------------------------
  const handleShowDesign = (
    projectID: number,
    temProjectCategoryID: number,
    projectName: string,
    projectCategoryName: string
  ) => {
    Get_StageList_For_DesignerBy_ProjectIDAPI(projectID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          let tmplstCheckedOutputData = [] as IProjectDesignerStageChangeModel[]
          let resultDIYOptputObj: IProjectDesignerStageChangeModel[] = responseData
          for (let k in resultDIYOptputObj) {
            let tmpCheckedData: IProjectDesignerStageChangeModel = {
              projectDesignStageMapID: resultDIYOptputObj[k]['projectDesignStageMapID'],
              designStageID: resultDIYOptputObj[k]['designStageID'],
              projectID: resultDIYOptputObj[k]['projectID'],
              stageTitle: resultDIYOptputObj[k]['stageTitle'],
              stageChangeRequestDate: resultDIYOptputObj[k]['stageChangeRequestDate'],
              approveBy: resultDIYOptputObj[k]['approveBy'],
              apprveDate: resultDIYOptputObj[k]['apprveDate'],
              designerName: resultDIYOptputObj[k]['designerName'],
              approvalName: resultDIYOptputObj[k]['approvalName'],
              isComplete: resultDIYOptputObj[k]['isComplete'],
              isStageChangeRequestApprove: resultDIYOptputObj[k]['isStageChangeRequestApprove'],
              isMember: 0,
            }
            tmplstCheckedOutputData.push(tmpCheckedData)
          }
          setState({
            ...state,
            projectDesignStageData: tmplstCheckedOutputData,
            selProjectID: projectID,
            selProjectCategoryName: projectCategoryName,
            projectName: projectName,
            loading: false,
          })
        } else {
          setState({
            ...state,
            projectDesignStageData: [],
            selProjectID: projectID,
            projectName: projectName,
            loading: false,
          })
          toast.error(`${response.data.massege}`)
          setShowStage(false)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          projectDesignStageData: [],
          selProjectID: projectID,
          projectName: projectName,
          loading: false,
        })
        toast.error(`${error}`)
        setShowDesignStage(false)
      })
    setModalLoader(false)
    setShowDesignStage(true)
  }
  // =====================Addon Work Order=============================
  const handleShowSAddonWorkStage = (projectID: number) => {
    getAddonWorkListForSupervisorByProjectID(projectID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          let tmpAddonlstCheckedOutputData = [] as IPMCAddonWorkOrderForSupervisorModel[]
          let resultOptputObj: IPMCAddonWorkOrderForSupervisorModel[] = responseData
          for (let k in resultOptputObj) {
            let tmpAddonCheckedData: IPMCAddonWorkOrderForSupervisorModel = {
              projectPMCVendorMapDtl: resultOptputObj[k]['projectPMCVendorMapDtl'],
              projectID: resultOptputObj[k]['projectID'],
              vendorID: resultOptputObj[k]['vendorID'],
              // supervisorID: resultOptputObj[k]['supervisorID'],
              assignDate: resultOptputObj[k]['assignDate'],
              contactPerson: resultOptputObj[k]['contactPerson'],
              // isStage1: 0,
              // isStage2: 0,
              remarks: resultOptputObj[k]['remarks'],
              workOrderCost: resultOptputObj[k]['workOrderCost'],
              isAddonMember: 0,
              isWorkCompleted: resultOptputObj[k]['isWorkCompleted'],
              isWorkCompleteRequestApprove: resultOptputObj[k]['isWorkCompleteRequestApprove'],
              stageName: resultOptputObj[k]['stageName'],
              approveByName: resultOptputObj[k]['approveByName'],
              supervisorName: resultOptputObj[k]['supervisorName'],
              stageCompleteDate: resultOptputObj[k]['stageCompleteDate'],
              approveStageChangeDate: resultOptputObj[k]['approveStageChangeDate'],
            }
            tmpAddonlstCheckedOutputData.push(tmpAddonCheckedData)
          }
          setState({
            ...state,
            addonWorkOrder: tmpAddonlstCheckedOutputData,
            selProjectID: projectID,
            loading: false,
          })
        } else {
          setState({
            ...state,
            addonWorkOrder: [],
            selProjectID: projectID,
            loading: false,
          })
          toast.error(`${response.data.massege}`)
          setShowStage(false)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          addonWorkOrder: [],
          selProjectID: projectID,
          loading: false,
        })
        toast.error(`${error}`)
        setShowStage(false)
      })
    setModalLoader(false)
    setShowStage(true)
  }

  // ================== Other Vendor Work Order ==========================
  const handleShowOtherWork = (projectID: number) => {
    getOtherVendorWorkListForSupervisorByProjectID(projectID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          let tmpOtherVendorlstCheckedOutputData = [] as IPMCOtherWorkForSupervisorModel[]
          let resultOptputObj: IPMCOtherWorkForSupervisorModel[] = responseData
          for (let k in resultOptputObj) {
            let tmpOtherVenCheckedData: IPMCOtherWorkForSupervisorModel = {
              projectVendorID: resultOptputObj[k]['projectVendorID'],
              projectID: resultOptputObj[k]['projectID'],
              vendorID: resultOptputObj[k]['vendorID'],
              // supervisorID: resultOptputObj[k]['supervisorID'],
              // approvalBy: resultOptputObj[k]['approvalBy'],
              // sequenceNo: resultOptputObj[k]['sequenceNo'],
              // isMember: 0,
              // isStage1: 0,
              // isStage2: 0,
              // isCompleted: resultOptputObj[k]['isCompleted'],
              // isCompleted1: resultOptputObj[k]['isCompleted1'],
              assignDate: resultOptputObj[k]['assignDate'],
              contactPerson: resultOptputObj[k]['contactPerson'],
              remarks: resultOptputObj[k]['remarks'],
              workOrderCost: resultOptputObj[k]['workOrderCost'],
              isOtherMember: 0,
              isWorkCompleted: resultOptputObj[k]['isWorkCompleted'],
              isWorkCompleteRequestApprove: resultOptputObj[k]['isWorkCompleteRequestApprove'],
              stageName: resultOptputObj[k]['stageName'],
              approveByName: resultOptputObj[k]['approveByName'],
              supervisorName: resultOptputObj[k]['supervisorName'],
              stageCompleteDate: resultOptputObj[k]['stageCompleteDate'],
              approveStageChangeDate: resultOptputObj[k]['approveStageChangeDate'],
            }
            tmpOtherVendorlstCheckedOutputData.push(tmpOtherVenCheckedData)
          }
          setState({
            ...state,
            pmcOtherVendorWorkOrder: tmpOtherVendorlstCheckedOutputData,
            selProjectID: projectID,

            loading: false,
          })
        } else {
          setState({
            ...state,
            pmcOtherVendorWorkOrder: [],
            selProjectID: projectID,
            loading: false,
          })
          toast.error(`${response.data.massege}`)
          setShowStage(false)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          pmcOtherVendorWorkOrder: [],
          selProjectID: projectID,
          loading: false,
        })
        toast.error(`${error}`)
        setShowStage(false)
      })
    setModalLoader(false)
    setShowStage(true)
  }
  //====================Employee=========================

  const [empMap, setEmpMap] = useState(false)
  const [showEmpMap, setShowEmpMap] = useState(false)
  const handleCloseEmp = () => {
    setShowEmpMap(false)
    setState({...state, loading: false})
  }

  function handleShowEmpMap(objProjMdl: IProjectModel) {
    setEmpMap(true)
    getEmployeeListWithProjectIDApi(objProjMdl.projectID)
      .then((response) => {
        const resEmpMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            objEmpData: resEmpMapData,
            objProjData: objProjMdl,
            loading: false,
          })
          setEmpMap(false)
        } else {
          setState({
            ...state,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setEmpMap(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setEmpMap(false)
        setState({...state, loading: false})
      })
    setShowEmpMap(true)
  }

  // =================== For Asseccories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpWorkStage = state.workStageData
    for (let k in tmpWorkStage) {
      if (uid == tmpWorkStage[k].projectVendorPaymentStructureID) {
        if (isChecked) {
          tmpWorkStage[k].isMember = 1
        } else {
          tmpWorkStage[k].isMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      workStageData: tmpWorkStage,
    })
  }

  // =================== For DIY ==============
  function SetDIYStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpWorkStage = state.workDIYStageData
    for (let k in tmpWorkStage) {
      if (uid == tmpWorkStage[k].vendorAgencyWorkStageID) {
        if (isChecked) {
          tmpWorkStage[k].isMember = 1
        } else {
          tmpWorkStage[k].isMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      workDIYStageData: tmpWorkStage,
    })
  }

  const handleChangeStageDate = (event: any) => {
    const value = event.target.value
    setStageDate(value)
  }

  // // ---------------Stage 1----------------------
  // function SetStage1(e: any) {
  //   let uid: number = e.target.id
  //   let isChecked = e.target.checked
  //   let tmpWorkStage = state.workStageData
  //   for (let k in tmpWorkStage) {
  //     if (uid == tmpWorkStage[k].projectVendorPaymentStructureID) {
  //       if (isChecked) {
  //         tmpWorkStage[k].isStage1 = 1
  //       } else {
  //         tmpWorkStage[k].isStage1 = 0
  //       }
  //       break
  //     }
  //   }
  //   setState({
  //     ...state,
  //     workStageData: tmpWorkStage,
  //   })
  // }
  // // ----------------Stage 2--------------------
  // function SetStage2(e: any) {
  //   let uid: number = e.target.id
  //   let isChecked = e.target.checked
  //   let tmpWorkStage = state.workStageData
  //   for (let k in tmpWorkStage) {
  //     if (uid == tmpWorkStage[k].projectVendorPaymentStructureID) {
  //       if (isChecked) {
  //         tmpWorkStage[k].isStage2 = 1
  //       } else {
  //         tmpWorkStage[k].isStage2 = 0
  //       }
  //       break
  //     }
  //   }
  //   setState({
  //     ...state,
  //     workStageData: tmpWorkStage,
  //   })
  // }

  // =================== For Asseccories ==========================

  function PMCStageListItem(workStageList: IPMCWorkStageForSupervisorModel[]) {
    let tmpWorkStageList = workStageList
    let strPmcStageID: string = ''
    let strPmcStageID1: string = ''
    let strPmcStageID2: string = ''
    for (let k in tmpWorkStageList) {
      if (tmpWorkStageList[k].isMember === 1) {
        if (strPmcStageID == '') {
          strPmcStageID = `${tmpWorkStageList[k].projectVendorPaymentStructureID}`
        } else {
          strPmcStageID =
            strPmcStageID + ',' + `${tmpWorkStageList[k].projectVendorPaymentStructureID}`
        }
      }
      // if (tmpWorkStageList[k].isStage1 === 1) {
      //   if (strPmcStageID1 == '') {
      //     strPmcStageID1 = `${tmpWorkStageList[k].projectVendorPaymentStructureID}`
      //   } else {
      //     strPmcStageID1 =
      //       strPmcStageID1 + ',' + `${tmpWorkStageList[k].projectVendorPaymentStructureID}`
      //   }
      // }
      // if (tmpWorkStageList[k].isStage2 === 1) {
      //   if (strPmcStageID2 == '') {
      //     strPmcStageID2 = `${tmpWorkStageList[k].projectVendorPaymentStructureID}`
      //   } else {
      //     strPmcStageID2 =
      //       strPmcStageID2 + ',' + `${tmpWorkStageList[k].projectVendorPaymentStructureID}`
      //   }
      // }
    }
    addProdCategoryByProductMstID(strPmcStageID)
  }

  // ================= Add Product Category Function =============
  function addProdCategoryByProductMstID(technoIds: string) {
    PMCVendorStageChangeAPI(technoIds, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Stage Change Request Send Successfully.', {position: 'top-center'})
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, workStageData: [], loading: false})
      })
    setShowStage(false)
  }

  //   ------View on other tab --------------
  async function downloadPojectFile(selURL: string) {
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

  function getBHKFunc(value: number) {
    setSelBHKID(value)
  }

  const value: UIContextType = {
    getBHKFunc,
    selBHKID,
  }

  // ----------Stage Select change Function------------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'pmcWorkStageID') {
      setState({...state, selProjStatusID: parseInt(value)})
    }
  }

  const [showChange, setShowChange] = useState(false)
  const handleshowChange = (temProjStatusID: number, temProjectID: number) => {
    // alert(temProjStatusID)
    setState({...state, selProjStatusID: temProjStatusID, selProjectID: temProjectID})
    setShowChange(true)
  }
  const handleCloseChange = () => setShowChange(false)

  // =================== For Asseccories ==============
  function SetAddonStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpWorkStage = state.addonWorkOrder
    for (let k in tmpWorkStage) {
      if (uid == tmpWorkStage[k].projectPMCVendorMapDtl) {
        if (isChecked) {
          tmpWorkStage[k].isAddonMember = 1
        } else {
          tmpWorkStage[k].isAddonMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      addonWorkOrder: tmpWorkStage,
    })
  }

  //=========================  Addon Work Order =======================
  function AddonWorkOrderListItem(addonWorkOrder: IPMCAddonWorkOrderForSupervisorModel[]) {
    let tmpAddonWorkOrder = addonWorkOrder
    let strAddonWorkOrderID: string = ''
    for (let k in tmpAddonWorkOrder) {
      if (tmpAddonWorkOrder[k].isAddonMember === 1) {
        if (strAddonWorkOrderID == '') {
          strAddonWorkOrderID = `${tmpAddonWorkOrder[k].projectPMCVendorMapDtl}`
        } else {
          strAddonWorkOrderID =
            strAddonWorkOrderID + ',' + `${tmpAddonWorkOrder[k].projectPMCVendorMapDtl}`
        }
      }
    }
    addAddonWorkOrderByProductMstID(strAddonWorkOrderID)
  }

  // ================= Add Addon Work Order Function =============
  function addAddonWorkOrderByProductMstID(technoAddonWkOdrIds: string) {
    PMCAddonWorkVendorStageChangeAPI(technoAddonWkOdrIds, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Addon Work Order Change Request Send Successfully.', {
            position: 'top-center',
          })
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, addonWorkOrder: [], loading: false})
      })
    setShowStage(false)
  }

  // =================== For  PMC Other Work ==============
  function SetPMCOtherStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpOtherWorkStage = state.pmcOtherVendorWorkOrder
    for (let k in tmpOtherWorkStage) {
      if (uid == tmpOtherWorkStage[k].projectVendorID) {
        if (isChecked) {
          tmpOtherWorkStage[k].isOtherMember = 1
        } else {
          tmpOtherWorkStage[k].isOtherMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      pmcOtherVendorWorkOrder: tmpOtherWorkStage,
    })
  }

  //=========================  PMC Other Work Order =======================
  function PMCOtherVendorWorkOrderListItem(
    pmcOtherVendorWorkOrder: IPMCOtherWorkForSupervisorModel[]
  ) {
    let tmpPMCOtherVendorWorkOrder = pmcOtherVendorWorkOrder
    let strPmcOtherWorkStageID: string = ''
    for (let k in tmpPMCOtherVendorWorkOrder) {
      if (tmpPMCOtherVendorWorkOrder[k].isOtherMember === 1) {
        if (strPmcOtherWorkStageID == '') {
          strPmcOtherWorkStageID = `${tmpPMCOtherVendorWorkOrder[k].projectVendorID}`
        } else {
          strPmcOtherWorkStageID =
            strPmcOtherWorkStageID + ',' + `${tmpPMCOtherVendorWorkOrder[k].projectVendorID}`
        }
      }
    }
    addPMCOtherVendorWorkOrderByProductMstID(strPmcOtherWorkStageID)
  }

  // ================= Add PMC Other Work Order Function =============
  function addPMCOtherVendorWorkOrderByProductMstID(technoOthWkIds: string) {
    OtherVendorWorkOrderVendorStageChangeAPI(technoOthWkIds, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Other Vendor Work Change Request Send Successfully.', {
            position: 'top-center',
          })
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, pmcOtherVendorWorkOrder: [], loading: false})
      })
    setShowStage(false)
  }

  // =====================================
  function addStageData(projectID: number, temStageID: number) {
    createProjectStatusHistory(projectID, user.employeeID, temStageID, '192.66.22', stageDate)
      .then((repon) => {
        if (repon.data.isSuccess === true) {
          toast.success(`Status Updated Successfully`)
          getAllProjectByRoleIdData(state.projectStatusData, name)
          setShowChange(false)
        } else {
          toast.error(`${repon.data.massege}`)
          setShowChange(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowChange(false)
      })
  }

  //=========================  DIY Project Change Req  =======================
  function DIYProjectStageChangeListItem(workDIYStageData: IDIYWorkStageForSupervisorModel[]) {
    let tmpWorkDIYStageData = workDIYStageData
    let strDIYOtherWorkStageID: string = ''
    for (let k in tmpWorkDIYStageData) {
      if (tmpWorkDIYStageData[k].isMember === 1) {
        if (strDIYOtherWorkStageID == '') {
          strDIYOtherWorkStageID = `${tmpWorkDIYStageData[k].vendorAgencyWorkStageID}`
        } else {
          strDIYOtherWorkStageID =
            strDIYOtherWorkStageID + ',' + `${tmpWorkDIYStageData[k].vendorAgencyWorkStageID}`
        }
      }
    }
    addDIYStageChangeRequestBySupervisor(strDIYOtherWorkStageID)
  }

  // ================= Add PMC Other Work Order Function =============
  function addDIYStageChangeRequestBySupervisor(technoOthWkIds: string) {
    DIYWorkStageOrderVendorStageChangeAPI(technoOthWkIds, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('DIY Work Stage Change Request Successfully.', {
            position: 'top-center',
          })
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, pmcOtherVendorWorkOrder: [], loading: false})
      })
    setShowDIYStage(false)
  }
  // ------------------- Diy Other Wark -------------
  // =================== For  PMC Other Work ==============
  function SetPMCDiyOtherStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpOtherWorkStage = state.diyOtherWorkStgtData
    for (let k in tmpOtherWorkStage) {
      if (uid == tmpOtherWorkStage[k].projectVendorID) {
        if (isChecked) {
          tmpOtherWorkStage[k].isDiyOtherMember = 1
        } else {
          tmpOtherWorkStage[k].isDiyOtherMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      diyOtherWorkStgtData: tmpOtherWorkStage,
    })
  }
  //=========================  DIY Project Change Req  =======================
  function DiyOtherWorkChangeListItem(diyOtherWorkStgtData: IDiyOtherWorkForSupervisorModel[]) {
    let tmpDiyOtherWorkStgtData = diyOtherWorkStgtData
    let strDIYOtherWorkStageID: string = ''
    for (let k in tmpDiyOtherWorkStgtData) {
      if (tmpDiyOtherWorkStgtData[k].isDiyOtherMember === 1) {
        if (strDIYOtherWorkStageID == '') {
          strDIYOtherWorkStageID = `${tmpDiyOtherWorkStgtData[k].projectVendorID}`
        } else {
          strDIYOtherWorkStageID =
            strDIYOtherWorkStageID + ',' + `${tmpDiyOtherWorkStgtData[k].projectVendorID}`
        }
      }
    }
    addDiyOtherWorkChangeRequestBySupervisor(strDIYOtherWorkStageID)
  }

  // ================= Add PMC Other Work Order Function =============
  function addDiyOtherWorkChangeRequestBySupervisor(technoDiyOthWkIds: string) {
    diyOtherWarkStageChangeAPI(technoDiyOthWkIds, user.employeeID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('DIY Other Work Stage Change Request Successfully.', {
            position: 'top-center',
          })
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, diyOtherWorkStgtData: [], loading: false})
      })
    setShowDIYStage(false)
  }
  // ================ DIY ========================
  const [diyTab, setDiyTab] = useState(0)
  function handleChangeDiyTab(typeId: number) {
    state.workDIYStageData = []
    state.diyOtherWorkStgtData = []
    setModalLoader(true)
    if (typeId == 0) {
      handleDiyAjencyOtherWork(state.selProjectID)
    } else if (typeId == 1) {
      handleShowDiyOtherWork(state.selProjectID)
    }
    setDiyTab(typeId)
  }

  // ================== Other Vendor Work Order ==========================
  const handleDiyAjencyOtherWork = (projectID: number) => {
    setModalLoader(true)
    GetDIYWorkStageListForSupervisorByProjectIDAPI(projectID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          let tmplstDIYCheckedOutputData = [] as IDIYWorkStageForSupervisorModel[]
          let resultDIYOptputObj: IDIYWorkStageForSupervisorModel[] = responseData
          for (let k in resultDIYOptputObj) {
            let tmpDIYCheckedData: IDIYWorkStageForSupervisorModel = {
              vendorAgencyWorkStageID: resultDIYOptputObj[k]['vendorAgencyWorkStageID'],
              vendorID: resultDIYOptputObj[k]['vendorID'],
              agencyTypeID: resultDIYOptputObj[k]['agencyTypeID'],
              supervisorID: resultDIYOptputObj[k]['supervisorID'],
              approvalBy: resultDIYOptputObj[k]['approvalBy'],
              seqNo: resultDIYOptputObj[k]['seqNo'],
              isMember: 0,
              isStage1: 0,
              isStage2: 0,
              isCompleted: resultDIYOptputObj[k]['isCompleted'],
              isCompleted1: resultDIYOptputObj[k]['isCompleted1'],
              isCompleted2: resultDIYOptputObj[k]['isCompleted2'],
              isStageApprove: resultDIYOptputObj[k]['isStageApprove'],
              stageName: resultDIYOptputObj[k]['stageName'],
              approvalName: resultDIYOptputObj[k]['approvalName'],
              supervisorName: resultDIYOptputObj[k]['supervisorName'],
              agencyTypeName: resultDIYOptputObj[k]['agencyTypeName'],
              contactPerson: resultDIYOptputObj[k]['contactPerson'],
              percentage: resultDIYOptputObj[k]['percentage'],
              stageCompleteDate: resultDIYOptputObj[k]['stageCompleteDate'],
              createDate: resultDIYOptputObj[k]['createDate'],
              approveStageChangeDate: resultDIYOptputObj[k]['approveStageChangeDate'],
              targetDate: resultDIYOptputObj[k]['targetDate'],
              targetDateApproveDate: resultDIYOptputObj[k]['targetDateApproveDate'],
              isTargetDateApprove: resultDIYOptputObj[k]['isTargetDateApprove'],
              isTargetDate: resultDIYOptputObj[k]['isTargetDate'],
            }
            tmplstDIYCheckedOutputData.push(tmpDIYCheckedData)
          }
          setState({
            ...state,
            workDIYStageData: tmplstDIYCheckedOutputData,
            loading: false,
          })
        } else {
          setState({
            ...state,
            workDIYStageData: [],
            loading: false,
          })
          toast.error(`${response.data.massege}`)
          setShowStage(false)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          workDIYStageData: [],
          loading: false,
        })
        toast.error(`${error}`)
        setShowStage(false)
      })
    setModalLoader(false)
    setShowDIYStage(true)
  }
  //  ------------------------
  const handleShowDiyOtherWork = (projectID: number) => {
    setModalLoader(true)
    getDiyOtherWorkStageListForSupervisorByProjectIDAPI(projectID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          let tmpDiyOtherWrklstCheckedOutputData = [] as IDiyOtherWorkForSupervisorModel[]
          let resultDiyOthOptputObj: IDiyOtherWorkForSupervisorModel[] = responseData
          for (let k in resultDiyOthOptputObj) {
            let tmpDiyOthWrkCheckedData: IDiyOtherWorkForSupervisorModel = {
              projectVendorID: resultDiyOthOptputObj[k]['projectVendorID'],
              projectID: resultDiyOthOptputObj[k]['projectID'],
              vendorID: resultDiyOthOptputObj[k]['vendorID'],
              assignDate: resultDiyOthOptputObj[k]['assignDate'],
              contactPerson: resultDiyOthOptputObj[k]['contactPerson'],
              remarks: resultDiyOthOptputObj[k]['remarks'],
              workOrderCost: resultDiyOthOptputObj[k]['workOrderCost'],
              isDiyOtherMember: 0,
              isWorkCompleted: resultDiyOthOptputObj[k]['isWorkCompleted'],
              isWorkCompleteRequestApprove:
                resultDiyOthOptputObj[k]['isWorkCompleteRequestApprove'],
              stageName: resultDiyOthOptputObj[k]['stageName'],
              approveByName: resultDiyOthOptputObj[k]['approveByName'],
              supervisorName: resultDiyOthOptputObj[k]['supervisorName'],
              stageCompleteDate: resultDiyOthOptputObj[k]['stageCompleteDate'],
              approveStageChangeDate: resultDiyOthOptputObj[k]['approveStageChangeDate'],
            }
            tmpDiyOtherWrklstCheckedOutputData.push(tmpDiyOthWrkCheckedData)
          }
          setState({
            ...state,
            diyOtherWorkStgtData: tmpDiyOtherWrklstCheckedOutputData,
            temDiyOtherWorkStgtData: tmpDiyOtherWrklstCheckedOutputData,
            selProjectID: projectID,
          })
          setModalLoader(false)
        } else {
          setState({
            ...state,
            diyOtherWorkStgtData: [],
            selProjectID: projectID,
          })
          setModalLoader(false)
          toast.error(`${response.data.massege}`)
          setShowStage(false)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          diyOtherWorkStgtData: [],
          selProjectID: projectID,
        })
        setModalLoader(false)
        toast.error(`${error}`)
        setShowStage(false)
      })
    setModalLoader(false)
    setShowDIYStage(true)
  }
  // ----------------- For Designer Stage Change --------------------
  function SetDesignerStageStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpOtherWorkStage = state.projectDesignStageData
    for (let k in tmpOtherWorkStage) {
      if (uid == tmpOtherWorkStage[k].designStageID) {
        if (isChecked) {
          tmpOtherWorkStage[k].isMember = 1
        } else {
          tmpOtherWorkStage[k].isMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      projectDesignStageData: tmpOtherWorkStage,
    })
  }
  //=========================  DIY Project Change Req  =======================
  function DesignerProjectStageListItem(diyOtherWorkStgtData: IProjectDesignerStageChangeModel[]) {
    let tmpDiyOtherWorkStgtData = diyOtherWorkStgtData
    let strDIYOtherWorkStageID: string = ''
    let temProjectDesignStageMapID: string = ''
    let strStageTitle: string = ''
    for (let k in tmpDiyOtherWorkStgtData) {
      if (tmpDiyOtherWorkStgtData[k].isMember === 1) {
        if (strDIYOtherWorkStageID == '') {
          strDIYOtherWorkStageID = `${tmpDiyOtherWorkStgtData[k].designStageID}`
          strStageTitle = `${tmpDiyOtherWorkStgtData[k].stageTitle}`
          temProjectDesignStageMapID = `${tmpDiyOtherWorkStgtData[k].projectDesignStageMapID}`
        } else {
          strDIYOtherWorkStageID =
            strDIYOtherWorkStageID + ',' + `${tmpDiyOtherWorkStgtData[k].designStageID}`
          strStageTitle = strStageTitle + ',' + `${tmpDiyOtherWorkStgtData[k].stageTitle}`
          temProjectDesignStageMapID = `${tmpDiyOtherWorkStgtData[k].projectDesignStageMapID}`
        }
      }
    }
    ChangeDesignProjectStageChangeRequestByDesigner(
      strDIYOtherWorkStageID,
      strStageTitle,
      temProjectDesignStageMapID
    )
  }

  // ================= Add PMC Other Work Order Function =============
  function ChangeDesignProjectStageChangeRequestByDesigner(
    technoDiyOthWkIds: string,
    strStageTitle: string,
    temProjectDesignStageMapID: string
  ) {
    Add_ProjectDesignStage_ChangeByDesignerAPI(
      //parseInt(temProjectDesignStageMapID),
      state.selProjectID,
      technoDiyOthWkIds,
      strStageTitle,
      user.employeeID,
      '192.33.66'
    )
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Designer Stage Change Request Successfully.', {
            position: 'top-center',
          })
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, diyOtherWorkStgtData: [], loading: false})
      })
    setShowDesignStage(false)
  }
  // ---------------------------------------- For ProjectStage Change Filter -------------------
  const [stageName, setStageName] = useState('')
  const filterStage = (e: any) => {
    const keyword = e.target.value
    if (diyTab == 0) {
      if (keyword !== '') {
        const results = state.temWorkDIYStageData.filter((user) => {
          return (
            user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
            user.agencyTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
            user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
            user.supervisorName.toLowerCase().includes(keyword.toLowerCase())
          )
          // Use the toLowerCase() method to make it case-insensitive
        })
        setState({...state, workDIYStageData: results})
      } else {
        setState({...state, workDIYStageData: state.temWorkDIYStageData})
      }
    } else if (diyTab == 1) {
      if (keyword !== '') {
        const results = state.temDiyOtherWorkStgtData.filter((user) => {
          return (
            user.remarks.toLowerCase().includes(keyword.toLowerCase()) ||
            user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
            user.assignDate.toLowerCase().includes(keyword.toLowerCase()) ||
            user.workOrderCost.toString().includes(keyword.toString()) ||
            user.approveByName.toLowerCase().includes(keyword.toLowerCase())
          )
          // Use the toLowerCase() method to make it case-insensitive
        })
        setState({...state, diyOtherWorkStgtData: results})
      } else {
        setState({...state, diyOtherWorkStgtData: state.temDiyOtherWorkStgtData})
      }
    } else {
      if (keyword !== '') {
        const results = state.temWorkDIYStageData.filter((user) => {
          return (
            user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
            user.agencyTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
            user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
            user.supervisorName.toLowerCase().includes(keyword.toLowerCase())
          )
          // Use the toLowerCase() method to make it case-insensitive
        })
        setState({...state, workDIYStageData: results})
      } else {
        setState({...state, workDIYStageData: state.temWorkDIYStageData})
      }
    }
    setStageName(keyword)
  }
  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    filterByString(keyword)
  }

  const filterByString = (keyword: string) => {
    if (keyword !== '') {
      const results = state.tmpProjectData.filter((user) => {
        return (
          user.mobileNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectType.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toString()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.remainingAmount.toString().includes(keyword.toLowerCase()) ||
          user.paidAmount.toString().includes(keyword.toLowerCase()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, projectData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectData: state.tmpProjectData})
      // If the text field is empty, show all users
      setTotal(state.tmpProjectData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ====================Pagination==============
  // const onShowSizeChange = (current: any, pageSize: any) => {
  //   setPostPerPage(pageSize)
  // }

  function handleCloseProDtl() {
    setShowProDtl(false)
  }

  function handleShowProjectDetails(temProjectID: number) {
    getGetProjectDetailsList_ByProjectIDAPI(temProjectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectDetailsData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectDetailsData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectDetailsData: [],
          loading: false,
        })
      })
    setShowProDtl(true)
  }

  const [action, setAction] = useState(0)
  const [designerRemark, setDesignerRemark] = useState('')
  const [showAddUpdate, setShowAddUpdate] = useState(0)
  const [showDesignerRemark, setShowSocietyBlock] = useState(false)
  const handleCloseDesignerRemark = () => {
    setShowSocietyBlock(false)
  }
  const handleShowDesignerRemarkMap = (temProjectID: number, temProjectName: string) => {
    GetProjectDesignerRemarkListListAPI(temProjectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            designerRemarkData: responseData,
            projectName: temProjectName,
            selProjectID: temProjectID,
            add_edit: 0,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, designerRemarkData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, designerRemarkData: [], loading: false})
      })
    setShowSocietyBlock(true)
  }

  return (
    <ProjectMain.Provider value={value}>
      <div className={`card bg-light`}>
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
                onChange={handleSearchChange}
                value={name}
              />
            </span>
          </div>

          {/* <DropdownBHK /> */}

          <div
            className={user.roleID === 2 || user.roleID === 3 ? 'card-toolbar' : 'd-none'}
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: `/projects/project/add`,
                state: {
                  projectID: projectID,
                  searchText: name,
                },
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
          <div className='row g-6 g-xl-9'>
            {state.loading ? (
              <LoaderInTable loading={state.loading} column={15} />
            ) : (
              <>
                {state.projectData.length > 0 &&
                  state.projectData.map((data, index) => {
                    return (
                      <div className='col-md-6 col-xl-4' key={data.projectID}>
                        <ProjectCard
                          user={user}
                          data={data}
                          badgeColor='success'
                          badgeColor2='primaryMain'
                          statusColor='info'
                          progress={50}
                          handleQuotation={() => downloadQuotationFile(data.quetFilePath)}
                          downloadPojectFile={() => downloadPojectFile(data.projectFilePath)}
                          handleShowStage={() =>
                            handleShowStage(
                              data.projectID,
                              data.projectCategoryID,
                              data.projectName,
                              data.projectCategoryName
                            )
                          }
                          handleShowDesign={() =>
                            handleShowDesign(
                              data.projectID,
                              data.projectCategoryID,
                              data.projectName,
                              data.projectCategoryName
                            )
                          }
                          handleShow={() => handleShow(data.projectID)}
                          handleShowProjectDetails={() => handleShowProjectDetails(data.projectID)}
                          selProjectID={data.projectStageID}
                          handleshowChange={() =>
                            handleshowChange(data.projectStageID, data.projectID)
                          }
                          handleShowEmpMap={() => handleShowEmpMap(data)}
                          handleShowDesignerRemarkMap={() =>
                            handleShowDesignerRemarkMap(data.projectID, data.projectName)
                          }
                          name={name}
                        />
                      </div>
                    )
                  })}
              </>
            )}
            <BlankDataImageInTable
              length={state.projectData.length}
              loading={state.loading}
              colSpan={9}
            />
          </div>
        </div>
        <div className='text-center mt-7'>
          <Pagination
            onChange={onPageChange}
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
      {/* -------------------  For Work Complete Request ------------------------- */}
      <Modal size='xl' show={showStage} onHide={handleCloseStage}>
        <div className='card'>
          <div className='card-body pt-2 pb-1'>
            <div className='d-flex overflow-auto h-55px'>
              <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <div
                    className={
                      `nav-link text-active-primary me-6 cursor-pointer ` +
                      (tab == 0 ? 'active' : '')
                    }
                    onClick={() => handleChangeTab(0)}
                  >
                    PMC Work Stage
                  </div>
                </li>
                <li className='nav-item'>
                  <div
                    className={
                      `nav-link text-active-primary me-6 cursor-pointer ` +
                      (tab == 1 ? 'active' : '')
                    }
                    onClick={() => handleChangeTab(1)}
                  >
                    PMC Addon Work Order
                  </div>
                </li>
                <li className='nav-item'>
                  <div
                    className={
                      `nav-link text-active-primary me-6 cursor-pointer ` +
                      (tab == 2 ? 'active' : '')
                    }
                    onClick={() => handleChangeTab(2)}
                  >
                    Other Vendor Work
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            {/* <Modal.Title style={{color: 'white'}}>
              {tab == 0
                ? `Project Stage List`
                : tab == 1
                ? `Addon Work Order List`
                : tab == 2
                ? `Other Vendor Work List`
                : ''}
            </Modal.Title> */}
            <div className='border-0 text-white fs-5 fw-bolder' id='kt_chat_contacts_header'>
              Project Name : &nbsp;
              <span className='text-primary fs-5 fw-bolder'>{state.projectName}</span>
            </div>
            <div className='border-0 text-white fs-5 fw-bolder' id='kt_chat_contacts_header'>
              Project Category : &nbsp;
              <span className='text-primary fs-5 fw-bolder'>{state.selProjectCategoryName}</span>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          {tab == 0 ? (
            <div className='card-body p-0'>
              <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                  <thead className='bg-light-primary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-50px'>Sr.No.</th>
                      <th className='min-w-150px'>Stage</th>
                      <th className='min-w-50px'>Supervisor</th>
                      <th className='min-w-25px'>IsApprove</th>
                      <th className='min-w-50px'>Approve By</th>
                    </tr>
                  </thead>
                  <tbody className="border-bottom">
                    {modalLoader ? (
                      <LoaderInTable loading={modalLoader} column={15} />
                    ) : (
                      <>
                        {state.workStageData.length > 0 &&
                          state.workStageData.map((data, index) => {
                            return (
                              <tr
                                key={index}
                                className={data.isCompleted === true ? 'text-success' : ''}
                              >
                                <td>
                                  <span className=' text-hover-primary fs-6'>{index + 1}.</span>
                                </td>{' '}
                                <td>
                                  <div className='form-check form-check-custom form-check-solid mb-3'>
                                    <input
                                      className='form-check-input'
                                      type='checkbox'
                                      id={`${data.projectVendorPaymentStructureID}`}
                                      value={data.projectVendorPaymentStructureID}
                                      name={data.stageName}
                                      checked={
                                        data.isMember == 1 || data.isCompleted == true
                                          ? true
                                          : false
                                      }
                                      disabled={data.isCompleted == true ? true : false}
                                      onChange={(e) => SetStatus(e)}
                                    />
                                    <span className=' text-hover-primary fs-6 ms-5'>
                                      {data.stageName}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.supervisorName}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.isStageApprove === true ? 'YES' : 'NO'}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.approveByName}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <BlankDataImageInTable
                          length={state.workStageData.length}
                          loading={modalLoader}
                          colSpan={9}
                        />
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab == 1 ? (
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                  <thead className='bg-light-primary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-50px'>Sr.No.</th>
                      <th className='min-w-150px'>Addon Work Order</th>
                      <th className='min-w-150px'>Vendor Name</th>
                      <th className='min-w-150px'>Order Cost</th>
                      <th className='min-w-50px'>Assign Date</th>
                      <th className='min-w-50px'>Supervisor</th>
                      <th className='min-w-25px'>IsApprove</th>
                      <th className='min-w-50px'>Approve By</th>
                    </tr>
                  </thead>
                  <tbody className="border-bottom">
                    {modalLoader ? (
                      <LoaderInTable loading={modalLoader} column={15} />
                    ) : (
                      <>
                        {state.addonWorkOrder.length > 0 &&
                          state.addonWorkOrder.map((data, index) => {
                            return (
                              <tr
                                key={index}
                                className={data.isWorkCompleted === true ? 'text-success' : ''}
                              >
                                <td>
                                  <span className=' text-hover-primary fs-6'>{index + 1}.</span>
                                </td>{' '}
                                <td>
                                  <div className='form-check form-check-custom form-check-solid mb-3'>
                                    <input
                                      className='form-check-input'
                                      type='checkbox'
                                      id={`${data.projectPMCVendorMapDtl}`}
                                      value={data.projectPMCVendorMapDtl}
                                      name={data.remarks}
                                      checked={
                                        data.isAddonMember == 1 || data.isWorkCompleted == true
                                          ? true
                                          : false
                                      }
                                      disabled={data.isWorkCompleted == true ? true : false}
                                      onChange={(e) => SetAddonStatus(e)}
                                    />
                                    <span className=' text-hover-primary fs-6 ms-5'>
                                      {data.remarks}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.contactPerson}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.workOrderCost}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.assignDate}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.supervisorName}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.isWorkCompleteRequestApprove === true ? 'YES' : 'NO'}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.approveByName}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <BlankDataImageInTable
                          length={state.addonWorkOrder.length}
                          loading={modalLoader}
                          colSpan={9}
                        />
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab == 2 ? (
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                  <thead className='bg-light-primary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-50px'>Sr.No.</th>
                      <th className='min-w-150px'>Other Work Order</th>
                      <th className='min-w-150px'>Vendor Name</th>
                      <th className='min-w-150px'>Order Cost</th>
                      <th className='min-w-50px'>Assign Date</th>
                      <th className='min-w-50px'>Supervisor</th>
                      <th className='min-w-25px'>IsApprove</th>
                      <th className='min-w-50px'>Approve By</th>
                    </tr>
                  </thead>
                  <tbody className="border-bottom">
                    {modalLoader ? (
                      <LoaderInTable loading={modalLoader} column={15} />
                    ) : (
                      <>
                        {state.pmcOtherVendorWorkOrder.length > 0 &&
                          state.pmcOtherVendorWorkOrder.map((data, index) => {
                            return (
                              <tr
                                key={index}
                                className={data.isWorkCompleted === true ? 'text-success' : ''}
                              >
                                <td>
                                  <span className=' text-hover-primary fs-6'>{index + 1}.</span>
                                </td>{' '}
                                <td>
                                  <div className='form-check form-check-custom form-check-solid mb-3'>
                                    <input
                                      className='form-check-input'
                                      type='checkbox'
                                      id={`${data.projectVendorID}`}
                                      value={data.projectVendorID}
                                      name={data.remarks}
                                      checked={
                                        data.isOtherMember == 1 || data.isWorkCompleted == true
                                          ? true
                                          : false
                                      }
                                      disabled={data.isWorkCompleted == true ? true : false}
                                      onChange={(e) => SetPMCOtherStatus(e)}
                                    />
                                    <span className=' text-hover-primary fs-6 ms-5'>
                                      {data.remarks}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.contactPerson}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.workOrderCost}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.assignDate}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.supervisorName}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.isWorkCompleteRequestApprove === true ? 'YES' : 'NO'}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.approveByName}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <BlankDataImageInTable
                          length={state.pmcOtherVendorWorkOrder.length}
                          loading={modalLoader}
                          colSpan={9}
                        />
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {tab == 0 ? (
            <Button variant='primary' onClick={() => PMCStageListItem(state.workStageData)}>
              Save
            </Button>
          ) : tab == 1 ? (
            <Button variant='primary' onClick={() => AddonWorkOrderListItem(state.addonWorkOrder)}>
              Save
            </Button>
          ) : tab == 2 ? (
            <Button
              variant='primary'
              onClick={() => PMCOtherVendorWorkOrderListItem(state.pmcOtherVendorWorkOrder)}
            >
              Save
            </Button>
          ) : null}
          <Button variant='danger' onClick={handleCloseStage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ------------------- For Change Stage ------------------------- */}
      <Modal size='lg' scrollable={true} show={showChange} onHide={handleCloseChange}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Change Stage</Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body py-3'>
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                <tbody className="border-bottom">
                  <div className='row mb-6'>
                    <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                      Stage Type:
                    </label>
                    <div className='col-lg-6 fv-row'>
                      <select
                        className='form-select bg-light-primary'
                        aria-label='Default select example'
                        onChange={selectChange}
                        id='pmcWorkStageID'
                      >
                        <option selected={state.selProjStatusID === 0 ? true : false} value={0}>
                          Select Stage Type
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
                    </div>
                    <div className='row mb-6'>
                      <label className='col-lg-2 col-form-label fw-bold fs-6'>Stage Date:</label>
                      <div className='col-lg-4 fv-row'>
                        <input
                          type='date'
                          className='form-control form-control-lg form-control-solid bg-light-primary'
                          value={stageDate}
                          onChange={handleChangeStageDate}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex justify-content-end py-8'>
                    <Button
                      variant='success'
                      onClick={() => addStageData(state.selProjectID, state.selProjStatusID)}
                    >
                      Save
                    </Button>
                    <Button variant='danger' onClick={handleCloseChange} className='ms-2'>
                      Close
                    </Button>
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selProjectID}
        pageName={'Project'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProject(state.selProjectID)}
      />

      {/* ===================Employee Model=====================  */}
      <ModelPopUpEmployeeMap
        show={showEmpMap}
        handleClose={handleCloseEmp}
        EmployeeMapData={state.objEmpData}
        ProjectID={state.objProjData.projectID}
        ProjectName={state.objProjData.projectName}
      />
      {/* =================================== */}
      <ModalPopUpForModularProjectStage
        user={user}
        show={showModularStage}
        handleClose={handleModularCloseStage}
        modularWorkStageData={state.workModularStageData}
        // modularAddonWorkOrderData={state.addonModularWorkOrder}
        // modularOtherVendorData={state.pmcModularOtherVendorWorkOrder}
        // handleShowStage={() =>
        //   handleShowStage(state.selProjectID,state.selProjectCategoryID)
        // }
        setShowMd={setShowModularStage}
        setTab={setTabMod}
        tab={tabMod}
        projectID={state.selProjectID}
        ProjectCategoryID={state.selProjectCategoryID}
        projectName={state.projectName}
        projectCategoryName={state.selProjectCategoryName}
      />

      {/* -------------------  For DIY Work Complete Request ------------------------- */}
      <Modal size='xl' show={showDIYStage} onHide={handleDIYCloseStage}>
        {/* <div style={{backgroundColor: '#2a3952'}}> */}
        <div className='card'>
          <div className='card-body pt-2 pb-1'>
            <div className='d-flex overflow-auto h-55px'>
              <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <div
                    className={
                      `nav-link text-active-primary me-6 cursor-pointer ` +
                      (diyTab == 0 ? 'active' : '')
                    }
                    onClick={() => handleChangeDiyTab(0)}
                  >
                    DIY Agency Work Stage
                  </div>
                </li>
                <li className='nav-item'>
                  <div
                    className={
                      `nav-link text-active-primary me-6 cursor-pointer ` +
                      (diyTab == 1 ? 'active' : '')
                    }
                    onClick={() => handleChangeDiyTab(1)}
                  >
                    Other Work
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            {/* <Modal.Title style={{color: 'white'}}>
              {diyTab == 0
                ? `DIY Project Stage List`
                : diyTab == 1
                ? `Other Work List`
                : ''}
            </Modal.Title> */}
            <div className='border-0 text-white fs-5 fw-bolder' id='kt_chat_contacts_header'>
              Project Name : &nbsp;
              <span className='text-primary fs-5 fw-bolder'>{state.projectName}</span>
            </div>
            <div className='border-0 text-white fs-5 fw-bolder' id='kt_chat_contacts_header'>
              Project Category : &nbsp;
              <span className='text-primary fs-5 fw-bolder'>{state.selProjectCategoryName}</span>
            </div>
            {/* {diyTab == 0 ? ( */}
            <div className='border-1' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  placeholder='Search'
                  onChange={(e) => filterStage(e)}
                  value={stageName}
                />
              </span>
            </div>
            {/* ) : (
              <span className='d-none'></span>
            )} */}
          </Modal.Header>
        </div>
        {/* </div> */}
        <Modal.Body>
          {diyTab == 0 ? (
            <div className='card-body p-0'>
              <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                  <thead className='bg-light-primary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-50px'>Sr.No.</th>
                      <th className='min-w-150px'>Agency Name</th>
                      <th className='min-w-150px'>Stage</th>
                      <th className='min-w-50px text-center'>
                        <span className='d-block'>Target Date</span>
                        {/* <span className='d-block text-info'>Approved Date</span> */}
                      </th>
                      <th className='min-w-150px'>Vendor Name</th>
                      <th className='min-w-50px'>Supervisor</th>
                      <th className='min-w-25px'>IsApprove</th>
                      <th className='min-w-100px'>Approve By</th>
                    </tr>
                  </thead>
                  <tbody className="border-bottom">
                    <>
                      {state.workDIYStageData.length > 0 &&
                        state.workDIYStageData.map((data, index) => {
                          return (
                            <tr
                              key={index}
                              className={data.isCompleted === true ? 'text-success' : ''}
                            >
                              <td>
                                <span className=' text-hover-primary fs-6'>{index + 1}.</span>
                              </td>{' '}
                              <td>
                                <div className='form-check form-check-custom form-check-solid mb-3'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id={`${data.vendorAgencyWorkStageID}`}
                                    value={data.vendorAgencyWorkStageID}
                                    name={data.stageName}
                                    checked={
                                      data.isMember == 1 || data.isCompleted == true ? true : false
                                    }
                                    disabled={data.isCompleted == true ? true : false}
                                    onChange={(e) => SetDIYStatus(e)}
                                  />
                                  <span className=' text-hover-primary fs-6 ms-5'>
                                    {data.agencyTypeName}
                                    {/* {data.stageName} */}
                                  </span>
                                </div>
                              </td>{' '}
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {/* {data.agencyTypeName} */}
                                  {data.stageName}
                                </span>
                              </td>
                              <td className='text-center'>
                                <span className='d-block text-hover-primary fs-6'>
                                  {/* {data.targetDate == null ? '-' : data.targetDate} */}
                                  {data.targetDateApproveDate == null
                                    ? '-'
                                    : data.targetDateApproveDate}
                                </span>
                                {/* <span className='text-info text-hover-primary fs-6'>
                                  {data.targetDateApproveDate == null
                                    ? '-'
                                    : data.targetDateApproveDate}
                                </span> */}
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.contactPerson}
                                </span>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.supervisorName}
                                </span>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.isStageApprove === true ? 'YES' : 'NO'}
                                </span>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.approvalName}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={state.workDIYStageData.length}
                        loading={modalLoader}
                        colSpan={9}
                      />
                    </>
                  </tbody>
                </table>
              </div>
            </div>
          ) : diyTab == 1 ? (
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                  <thead className='bg-light-primary'>
                    <tr className='fw-bolder fs-5'>
                      <th className='min-w-50px'>Sr.No.</th>
                      <th className='min-w-150px'>Other Work Order</th>
                      <th className='min-w-150px'>Vendor Name</th>
                      <th className='min-w-150px'>Order Cost</th>
                      <th className='min-w-50px'>Assign Date</th>
                      <th className='min-w-50px'>Supervisor</th>
                      <th className='min-w-25px'>IsApprove</th>
                      <th className='min-w-50px'>Approve By</th>
                    </tr>
                  </thead>
                  <tbody className="border-bottom">
                    {modalLoader ? (
                      <LoaderInTable loading={modalLoader} column={15} />
                    ) : (
                      <>
                        {state.diyOtherWorkStgtData.length > 0 &&
                          state.diyOtherWorkStgtData.map((data, index) => {
                            return (
                              <tr
                                key={index}
                                className={data.isWorkCompleted === true ? 'text-success' : ''}
                              >
                                <td>
                                  <span className=' text-hover-primary fs-6'>{index + 1}.</span>
                                </td>{' '}
                                <td>
                                  <div className='form-check form-check-custom form-check-solid mb-3'>
                                    <input
                                      className='form-check-input'
                                      type='checkbox'
                                      id={`${data.projectVendorID}`}
                                      value={data.projectVendorID}
                                      name={data.remarks}
                                      checked={
                                        data.isDiyOtherMember == 1 || data.isWorkCompleted == true
                                          ? true
                                          : false
                                      }
                                      disabled={data.isWorkCompleted == true ? true : false}
                                      onChange={(e) => SetPMCDiyOtherStatus(e)}
                                    />
                                    <span className=' text-hover-primary fs-6 ms-5'>
                                      {data.remarks}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.contactPerson}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.workOrderCost}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.assignDate}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.supervisorName}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.isWorkCompleteRequestApprove === true ? 'YES' : 'NO'}
                                  </span>
                                </td>
                                <td>
                                  <span className=' text-hover-primary fs-6'>
                                    {data.approveByName}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        <BlankDataImageInTable
                          length={state.diyOtherWorkStgtData.length}
                          loading={modalLoader}
                          colSpan={9}
                        />
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {diyTab == 0 ? (
            <Button
              variant='primary'
              onClick={() => DIYProjectStageChangeListItem(state.workDIYStageData)}
            >
              Save
            </Button>
          ) : diyTab == 1 ? (
            <Button
              variant='primary'
              onClick={() => DiyOtherWorkChangeListItem(state.diyOtherWorkStgtData)}
            >
              Save
            </Button>
          ) : null}
          <Button variant='danger' onClick={handleDIYCloseStage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* -------------- Project Designer Stage Change List Model ------------------- */}
      <Modal size='xl' show={showDesignStage} onHide={handleDesignCloseStage}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <div className='border-0 fs-5 fw-bolder text-white' id='kt_chat_contacts_header'>
              Design Stages List
            </div>
            <div className='border-0 fs-5 fw-bolder text-white' id='kt_chat_contacts_header'>
              Project Name : &nbsp;
              <span className='text-primary fs-5 fw-bolder'>{state.projectName}</span>
            </div>
            <div className='border-0 fs-5 fw-bolder text-white' id='kt_chat_contacts_header'>
              Project Category : &nbsp;
              <span className='text-primary fs-5 fw-bolder'>{state.selProjectCategoryName}</span>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body p-0'>
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                <thead className='bg-light-primary'>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-50px'>Sr.No.</th>
                    <th className='min-w-150px'>Stage</th>
                    <th className='min-w-50px'>Designer</th>
                    <th className='min-w-25px'>IsApprove</th>
                    <th className='min-w-50px'>Approve By</th>
                  </tr>
                </thead>
                <tbody className="border-bottom">
                  {modalLoader ? (
                    <LoaderInTable loading={modalLoader} column={15} />
                  ) : (
                    <>
                      {state.projectDesignStageData.length > 0 &&
                        state.projectDesignStageData.map((data, index) => {
                          return (
                            <tr
                              key={index}
                              className={data.isComplete === true ? 'text-success' : ''}
                            >
                              <td>
                                <span className=' text-hover-primary fs-6'>{index + 1}.</span>
                              </td>{' '}
                              <td>
                                <div className='form-check form-check-custom form-check-solid mb-3'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id={`${data.designStageID}`}
                                    value={data.designStageID}
                                    name={data.stageTitle}
                                    checked={
                                      data.isMember == 1 || data.isComplete == true ? true : false
                                    }
                                    disabled={data.isComplete == true ? true : false}
                                    onChange={(e) => SetDesignerStageStatus(e)}
                                  />
                                  <span className=' text-hover-primary fs-6 ms-5'>
                                    {data.stageTitle}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.designerName}
                                </span>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.isStageChangeRequestApprove === true ? 'YES' : 'NO'}
                                </span>
                              </td>
                              <td>
                                <span className=' text-hover-primary fs-6'>
                                  {data.approvalName}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={state.projectDesignStageData.length}
                        loading={state.loading}
                        colSpan={9}
                      />
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() => DesignerProjectStageListItem(state.projectDesignStageData)}
          >
            Save
          </Button>
          <Button variant='danger' onClick={handleDesignCloseStage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ProjectDetailsModel
        data={state.projectDetailsData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
      <ProjectDesignRemark
        designerRemarkData={state.designerRemarkData}
        showDesignerRemark={showDesignerRemark}
        handleCloseDesignerRemark={handleCloseDesignerRemark}
        handleShowDesignerRemarkMap={() =>
          handleShowDesignerRemarkMap(state.selProjectID, state.projectName)
        }
        ProjectID={state.selProjectID}
        ProjectName={state.projectName}
        loading={state.loading}
      />
    </ProjectMain.Provider>
  )
}

export default ProjectList
