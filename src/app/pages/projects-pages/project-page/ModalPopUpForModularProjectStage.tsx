import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {
  IDIYWorkStageForSupervisorModel,
  IPMCAddonWorkOrderForSupervisorModel,
  IPMCOtherWorkForSupervisorModel,
} from '../../../models/master-page/IPMCWorkStageModel'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {
  getModularAddonWorkListForSupervisorByProjectID,
  getModularOtherVendorWorkListForSupervisorByProjectID,
  getModularWorkStageListForSupervisorByProjectIDAPI,
  ModularAddonWorkOrderVendorStageChangeAPI,
  ModularOtherVenWorkOrderVendorStageChangeAPI,
  ModularWorkStageOrderVendorStageChangeAPI,
} from '../../../modules/master-page/pmc-work-stage-master-page/PMCWorkStageCRUD'
import {UserModel} from '../../../modules/auth/models/UserModel'
type Props = {
  user: UserModel
  show: boolean
  handleClose: () => void
  modularWorkStageData: IDIYWorkStageForSupervisorModel[]
  // modularAddonWorkOrderData: IPMCAddonWorkOrderForSupervisorModel[]
  // modularOtherVendorData: IPMCOtherWorkForSupervisorModel[]
  // handleShowStage: (_PojectID: number, _ProjectCategoryID: number) => void
  setShowMd: (showid: boolean) => void
  setTab: (id: number) => void
  tab: number
  projectID: number
  ProjectCategoryID: number
  projectName: string
  projectCategoryName: string
}

interface IModular {
  loading: boolean
  workPMCModularStageData: IDIYWorkStageForSupervisorModel[]
  addonModularWorkOrder: IPMCAddonWorkOrderForSupervisorModel[]
  pmcModularOtherVendorWorkOrder: IPMCOtherWorkForSupervisorModel[]
  selProjectID: number
}

// interface IProject {
//   loading: boolean
//   projectData: IProjectModel[]
//   tmpProjectData: IProjectModel[]
//   workStageData: IPMCWorkStageForSupervisorModel[]
//   addonWorkOrder: IPMCAddonWorkOrderForSupervisorModel[]
//   addonModularWorkOrder: IPMCAddonWorkOrderForSupervisorModel[]
//   pmcOtherVendorWorkOrder: IPMCOtherWorkForSupervisorModel[]
//   pmcModularOtherVendorWorkOrder: IPMCOtherWorkForSupervisorModel[]
//   projectStatusData: IProjectStatusModel[]
//   objEmpData: IEmployeeMapModel[]
//   objProjData: IProjectModel
//   workDIYStageData: IDIYWorkStageForSupervisorModel[]
// workModularStageData: IDIYWorkStageForSupervisorModel[]

const ModalPopUpForModularProjectStage: React.FC<Props> = ({
  user,
  show,
  handleClose,
  modularWorkStageData,
  // modularAddonWorkOrderData,
  // modularOtherVendorData,
  // handleShowStage,
  setShowMd,
  setTab,
  tab,
  projectID,
  ProjectCategoryID,
  projectName,
  projectCategoryName,
}) => {
  const [state, setState] = useState<IModular>({
    loading: false,
    workPMCModularStageData: [] as IDIYWorkStageForSupervisorModel[],
    addonModularWorkOrder: [] as IPMCAddonWorkOrderForSupervisorModel[],
    pmcModularOtherVendorWorkOrder: [] as IPMCOtherWorkForSupervisorModel[],
    selProjectID: 0,
  })

  // const [showModularStage, setShowModularStage] = useState(false)
  // const handleModularCloseStage = () =>
  //
  const [modalLoader, setModalLoader] = useState(false)

  // const [tab, setTab] = useState(0)
  function handleChangeTab(type: number) {
    modularWorkStageData = []
    state.addonModularWorkOrder = []
    state.pmcModularOtherVendorWorkOrder = []
    setModalLoader(true)
    setState({...state, loading: true})
    if (type == 0) {
      handleShowModularWorkStage(projectID)
    } else if (type == 1) {
      handleShowSAddonWorkStage(projectID)
    } else if (type == 2) {
      handleShowOtherWork(projectID)
    }
    setTab(type)
  }
  // ==================List Api ###########################################

  // =====================Addon Work Order=============================
  const handleShowModularWorkStage = (projectID: number) => {
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
            workPMCModularStageData: tmplstModularCheckedOutputData,
            selProjectID: projectID,
            loading: false,
          })
        } else {
          setState({
            ...state,
            workPMCModularStageData: [],
            selProjectID: projectID,
            loading: false,
          })
          toast.error(`${response.data.massege}`)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          workPMCModularStageData: [],
          selProjectID: projectID,
          loading: false,
        })
        toast.error(`${error}`)
      })
    setModalLoader(false)
    setShowMd(true)
  }
  const handleShowSAddonWorkStage = (projectID: number) => {
    setModalLoader(true)
    getModularAddonWorkListForSupervisorByProjectID(projectID)
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
              assignDate: resultOptputObj[k]['assignDate'],
              contactPerson: resultOptputObj[k]['contactPerson'],
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
            addonModularWorkOrder: tmpAddonlstCheckedOutputData,
            selProjectID: projectID,
          })
        } else {
          setState({
            ...state,
            addonModularWorkOrder: [],
            selProjectID: projectID,
          })
          toast.error(`${response.data.massege}`)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          addonModularWorkOrder: [],
          selProjectID: projectID,
        })
        toast.error(`${error}`)
      })
    setModalLoader(false)
    setShowMd(true)
    //
  }

  // ================== Other Vendor Work Order ==========================
  const handleShowOtherWork = (projectID: number) => {
    setModalLoader(true)
    getModularOtherVendorWorkListForSupervisorByProjectID(projectID)
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
            pmcModularOtherVendorWorkOrder: tmpOtherVendorlstCheckedOutputData,
            selProjectID: projectID,
          })
        } else {
          setState({
            ...state,
            pmcModularOtherVendorWorkOrder: [],
            selProjectID: projectID,
          })
          toast.error(`${response.data.massege}`)
        }
      })
      .catch((error) => {
        setState({
          ...state,
          pmcModularOtherVendorWorkOrder: [],
          selProjectID: projectID,
        })
        toast.error(`${error}`)
      })
    setModalLoader(false)
    setShowMd(true)
  }

  // =================== For Asseccories ==========================

  function ModularPMCStageListItem(workStageList: IDIYWorkStageForSupervisorModel[]) {
    let tmpWorkStageList = workStageList
    let strPmcStageID: string = ''
    let strPmcStageID1: string = ''
    let strPmcStageID2: string = ''
    for (let k in tmpWorkStageList) {
      if (tmpWorkStageList[k].isMember === 1) {
        if (strPmcStageID == '') {
          strPmcStageID = `${tmpWorkStageList[k].vendorAgencyWorkStageID}`
        } else {
          strPmcStageID = strPmcStageID + ',' + `${tmpWorkStageList[k].vendorAgencyWorkStageID}`
        }
      }
    }
    addProdCategoryByProductMstID(strPmcStageID)
  }

  // ================= Add Product Category Function =============
  function addProdCategoryByProductMstID(technoIds: string) {
    ModularWorkStageOrderVendorStageChangeAPI(technoIds, user.employeeID)
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
        setState({...state, workPMCModularStageData: [], loading: false})
      })
    setShowMd(false)
  }

  //   // ================= Add Product Category Function =============

  // function addProdCategoryByProductMstID(technoIds: string) {
  //   AddProductCategoryByAgencyTypeIDApi(technoIds, ProductID)
  //     .then((response) => {
  //       if (response.data.isSuccess === true) {
  //
  //         toast.success('Product Category Created Successfully.', {position: 'top-center'})
  //       } else {
  //         toast.error(`${response.data.message}`, {position: 'top-center'})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`, {position: 'top-center'})
  //       setState({...state, productMasterData: [], loading: false})
  //     })
  // }

  //=========================  PMC Other Work Order =======================

  // =================== For  PMC Other Work ==============
  function SetPMCOtherStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpOtherWorkStage = state.pmcModularOtherVendorWorkOrder
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
      pmcModularOtherVendorWorkOrder: tmpOtherWorkStage,
    })
  }
  // ============================
  function modularOtherVendorDataListItem(
    modularOtherVendorData: IPMCOtherWorkForSupervisorModel[]
  ) {
    let tmpmodularOtherVendorData = modularOtherVendorData
    let strPmcOtherWorkStageID: string = ''
    for (let k in tmpmodularOtherVendorData) {
      if (tmpmodularOtherVendorData[k].isOtherMember === 1) {
        if (strPmcOtherWorkStageID == '') {
          strPmcOtherWorkStageID = `${tmpmodularOtherVendorData[k].projectVendorID}`
        } else {
          strPmcOtherWorkStageID =
            strPmcOtherWorkStageID + ',' + `${tmpmodularOtherVendorData[k].projectVendorID}`
        }
      }
    }
    addModularOtherVendorDataByProductMstID(strPmcOtherWorkStageID)
  }

  // ================= Add PMC Other Work Order Function =============
  function addModularOtherVendorDataByProductMstID(technoOthWkIds: string) {
    ModularOtherVenWorkOrderVendorStageChangeAPI(technoOthWkIds, user.employeeID)
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
        setState({...state, pmcModularOtherVendorWorkOrder: [], loading: false})
      })
    setShowMd(false)
  }

  // =================== For Asseccories ==============
  function SetAddonStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpAddonWorkStage = state.addonModularWorkOrder
    for (let k in tmpAddonWorkStage) {
      if (uid == tmpAddonWorkStage[k].projectPMCVendorMapDtl) {
        if (isChecked) {
          tmpAddonWorkStage[k].isAddonMember = 1
        } else {
          tmpAddonWorkStage[k].isAddonMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      addonModularWorkOrder: tmpAddonWorkStage,
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
    ModularAddonWorkOrderVendorStageChangeAPI(technoAddonWkOdrIds, user.employeeID)
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
        setState({...state, addonModularWorkOrder: [], loading: false})
      })
    setShowMd(false)
  }

  // =================== For Asseccories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpWorkStage = modularWorkStageData
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
      workPMCModularStageData: tmpWorkStage,
    })
  }

  // =====================================

  return (
    <Modal size='xl' show={show} onHide={handleClose}>
      <div className='card'>
        <div className='card-body pt-2 pb-1'>
          <div className='d-flex overflow-auto h-55px'>
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` + (tab == 0 ? 'active' : '')
                  }
                  onClick={() => handleChangeTab(0)}
                >
                  Modular PMC Work Stage
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` + (tab == 1 ? 'active' : '')
                  }
                  onClick={() => handleChangeTab(1)}
                >
                  PMC Addon Work Order
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={
                    `nav-link text-active-primary me-6 cursor-pointer ` + (tab == 2 ? 'active' : '')
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
          {/* <Modal.Title style={{color: 'white'}}> */}
          {/* {tab == 0
              ? `Modular Project Stage List`
              : tab == 1
              ? `Md Addon Work Order List`
              : tab == 2
              ? `Md Other Vendor Work List`
              : ''} */}
          {/* </Modal.Title> */}
          <div className='border-0 fs-5 fw-bolder text-white' id='kt_chat_contacts_header'>
            Project Name : &nbsp;<span className='text-primary fs-5 fw-bolder'>{projectName}</span>
          </div>
          <div className='border-0 fs-5 fw-bolder text-white' id='kt_chat_contacts_header'>
            Project Category : &nbsp;
            <span className='text-primary fs-5 fw-bolder'>{projectCategoryName}</span>
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
                      {modularWorkStageData.length > 0 &&
                        modularWorkStageData.map((data, index) => {
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
                                  {data.approvalName}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <BlankDataImageInTable
                        length={modularWorkStageData.length}
                        loading={state.loading}
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
                      {state.addonModularWorkOrder.length > 0 &&
                        state.addonModularWorkOrder.map((data, index) => {
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
                                <span className=' text-hover-primary fs-6'>{data.assignDate}</span>
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
                        length={state.addonModularWorkOrder.length}
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
                      {state.pmcModularOtherVendorWorkOrder.length > 0 &&
                        state.pmcModularOtherVendorWorkOrder.map((data, index) => {
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
                                <span className=' text-hover-primary fs-6'>{data.assignDate}</span>
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
                        length={state.pmcModularOtherVendorWorkOrder.length}
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
          <Button variant='primary' onClick={() => ModularPMCStageListItem(modularWorkStageData)}>
            Save
          </Button>
        ) : tab == 1 ? (
          <Button
            variant='primary'
            onClick={() => AddonWorkOrderListItem(state.addonModularWorkOrder)}
          >
            Save
          </Button>
        ) : tab == 2 ? (
          <Button
            variant='primary'
            onClick={() => modularOtherVendorDataListItem(state.pmcModularOtherVendorWorkOrder)}
          >
            Save
          </Button>
        ) : null}
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModalPopUpForModularProjectStage}
