import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IPMCMaterialInfoModel,
  IPMCMaterialMapModel,
} from '../../../models/product-page/IMaterialInfoModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {KTSVG} from '../../../../_Ecd/helpers'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {
  createPMCStageMaterialCompanyName_MapWithMaterialWiseApi,
  createTurnkeyProjectStageMaterialApi,
  deleteTurnkeyProjectStageMaterial,
  getAllTurnkeyProjectStageMaterial,
  getPMCStageMatrialCompanyNameByMaterialIDForMaterialNameMap,
  getTurnkeyProjectStageMaterialByStageMaterialId,
  updateTurnkeyProjectStageMaterial,
} from '../../../modules/master-page/pmc-work-stage-master-page/PMCMaterialInfoCRUD'
import BlankDataImage from '../../common-pages/BlankDataImage'

interface IMaterial {
  loading: boolean
  pmcMaterialInfoData: IPMCMaterialInfoModel[]
  tmpPmcMaterialInfoData: IPMCMaterialInfoModel[]
  materialCompMapCheckData: IPMCMaterialMapModel[]
  stageName: string
  agencyTypeName: string
  selMaterialName: string
  AgencyTypeID: number
  pmcWorkStageID: number
  tmpTurnkeyProjectmaterialInfoID: number
}
const PMCWorkMaterialInfo: React.FC = () => {
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [mainSearch, setMainSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [state, setState] = useState<IMaterial>({
    loading: false,
    pmcMaterialInfoData: [] as IPMCMaterialInfoModel[],
    tmpPmcMaterialInfoData: [] as IPMCMaterialInfoModel[],
    materialCompMapCheckData: [] as IPMCMaterialMapModel[],
    stageName: '',
    agencyTypeName: '',
    selMaterialName: '',
    AgencyTypeID: 0,
    pmcWorkStageID: 0,
    tmpTurnkeyProjectmaterialInfoID: 0,
  })
  const [action, setAction] = useState(0)
  const [showAddUpdate, setShowAddUpdate] = useState(0)
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setLoading(false)
    setTimeout(() => {
      let lc: any = location.state
      var pmcWorkStageID = lc.pmcWorkStageID
      let stageName = lc.stageName
      var mainSearch = lc.searchText
      console.log(lc)
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.searchText
      }
      getPMCWorkStageStructureDataByID(mainSearch, stageName, pmcWorkStageID)
    }, 100)
  }, [])

  function getPMCWorkStageStructureDataByID(
    mainSearch: string,
    stageName: string,
    pmcWorkStageID: number
  ) {
    setMainSearch(mainSearch)
    getAllTurnkeyProjectStageMaterial(pmcWorkStageID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setAction(2)
          setShowAddUpdate(0)
          setState({
            ...state,
            pmcMaterialInfoData: responseData,
            tmpPmcMaterialInfoData: responseData,
            stageName: stageName,
            pmcWorkStageID: pmcWorkStageID,
          })
          setLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, tmpPmcMaterialInfoData: [], loading: false})
        }
      })
      .catch((error: any) => {
        toast.error(`${error}`)
        setState({...state, tmpPmcMaterialInfoData: [], loading: false})
      })
  }

  const [materialName, setMaterialName] = useState('')
  const [materialCompanyName, setMaterialCompanyName] = useState('')
  const handleChangeMaterial = (e: any) => {
    const value = e.target.value
    const name = e.target.name
    if (name == 'materialName') {
      setMaterialName(value)
    } else {
      setMaterialName('')
      setMaterialCompanyName('')
    }
  }

  // ------------------------------AddSocietyBlock------------------------------
  function AddMaterialInfoDetails(materialName: string, pmcWorkStageID: number) {
    console.log(materialName, materialCompanyName, pmcWorkStageID)
    state.loading = true
    if (materialName === '') {
      return toast.error('Please Enter Material Name')
    } else {
      createTurnkeyProjectStageMaterialApi(pmcWorkStageID, materialName, user.employeeID)
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Created Successfully')
            setMaterialName('')
            getPMCWorkStageStructureDataByID(mainSearch, state.stageName, state.pmcWorkStageID)
          } else {
            toast.error(`${response.data.message}`)
          }
        })
        .catch((error: any) => {
          toast.error(`${error}`)
        })
    }
  }

  function UpdateClick(tmpTurnkeyProjectmaterialInfoID: number) {
    getTurnkeyProjectStageMaterialByStageMaterialId(tmpTurnkeyProjectmaterialInfoID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          setMaterialName(response.data.materialName)
          setAction(1)
          setShowAddUpdate(1)
          setState({
            ...state,
            tmpTurnkeyProjectmaterialInfoID: tmpTurnkeyProjectmaterialInfoID,
            pmcWorkStageID: response.data.pmcWorkStageID,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, pmcMaterialInfoData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, pmcMaterialInfoData: [], loading: false})
      })
  }

  // ------------------------------Update Material Info------------------------------
  function updateMaterialInfoDetails() {
    state.loading = true
    if (materialName === '') {
      return toast.error('Please Enter Material Name')
    } else {
      updateTurnkeyProjectStageMaterial(
        state.tmpTurnkeyProjectmaterialInfoID,
        state.pmcWorkStageID,
        materialName
      )
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Updated Successfully')
            setMaterialName('')
            getPMCWorkStageStructureDataByID(mainSearch, state.stageName, state.pmcWorkStageID)
          } else {
            toast.error(`${response.data.message}`)
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
        })
    }
  }

  const handleCloseMaterialInfo = () => {
    setMaterialName('')
    setMaterialCompanyName('')
    setAction(0)
    setShowAddUpdate(0)
  }
  // ==================== Delete API Call ===================
  const deleteMaterial = (stageMaterialID: number) => {
    const Delete = window.confirm('Are you sure you want to delete selected record')
    if (Delete) {
      deleteTurnkeyProjectStageMaterial(stageMaterialID)
        .then((response) => {
          if (response.data.isSuccess === true) {
            toast.success('Deleted Successfully')
            getPMCWorkStageStructureDataByID(mainSearch, state.stageName, state.pmcWorkStageID)
          } else {
            toast.error(`${response.data.message}`)
          }
        })
        .catch((error: any) => {
          toast.error(`${error}`)
        })
    }
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpPmcMaterialInfoData.filter((user) => {
        return user.materialName.toLowerCase().includes(keyword.toLowerCase())
        // user.areaPrice.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, pmcMaterialInfoData: results})
    } else {
      setState({...state, pmcMaterialInfoData: state.tmpPmcMaterialInfoData})
    }
    setName(keyword)
  }

  //************************** Company Name ********************** */
  function handleShowTurnkeyProjMaterialMap(
    turnkeyProjectStageMaterialID: number,
    materialName: string
  ) {
    getPMCStageMatrialCompanyNameByMaterialIDForMaterialNameMap(turnkeyProjectStageMaterialID)
      .then((response) => {
        const resServiceCatRateMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            materialCompMapCheckData: resServiceCatRateMapData,
            tmpTurnkeyProjectmaterialInfoID: turnkeyProjectStageMaterialID,
            selMaterialName: materialName,
            loading: false,
          })
          setShowMaterial(true)
        } else {
          setState({
            ...state,
            materialCompMapCheckData: resServiceCatRateMapData,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, materialCompMapCheckData: [], loading: false})
      })
  }
  // ------------------ Handle Show ----------------
  const [showMaterial, setShowMaterial] = useState(false)
  const handleCloseMaterial = () => setShowMaterial(false)

  function handleChange(event: any) {
    let tmpValue = event.target.value
    let srvCatId = event.target.id
    let tmpMaterialCheckData = [] as IPMCMaterialMapModel[]
    tmpMaterialCheckData = state.materialCompMapCheckData
    for (let k in tmpMaterialCheckData) {
      if (srvCatId == `${tmpMaterialCheckData[k].projectTypeID}`) {
        // if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
        //     tmpMaterialCheckData[k].materialCompanyName = tmpValue
        // } else if (tmpValue !== 0) {
        tmpMaterialCheckData[k].materialCompanyName = tmpValue
        // }
      }
    }
    setState({
      ...state,
      materialCompMapCheckData: tmpMaterialCheckData,
      loading: false,
    })
  }

  // =================== For Area ==========================
  function pmcWorkStageMaterial(tech: IPMCMaterialMapModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    let strSelCompNames: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          if (tmpTech[k].materialCompanyName == '') {
            return toast.error('Please Enter Company Name', {position: 'top-center'})
          }
          strSelTechid = `${tmpTech[k].projectTypeID}`
          strSelCompNames = `${tmpTech[k].materialCompanyName}`
        } else {
          if (tmpTech[k].materialCompanyName == '') {
            return toast.error('Please Enter Company Name', {position: 'top-center'})
          }
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].projectTypeID}`
          strSelCompNames = strSelCompNames + ',' + `${tmpTech[k].materialCompanyName}`
        }
      }
    }
    addTurnkeyProjectmaterialInfoMstID(strSelTechid, strSelCompNames)
  }

  // ================= Add Area Function =============

  function addTurnkeyProjectmaterialInfoMstID(strSelTechid: string, strSelCompNames: string) {
    if (strSelTechid == '') {
      return toast.error('Please Select Project Type')
    }
    if (strSelCompNames == '' || strSelCompNames == ',') {
      return toast.error('Please Enter Company Name')
    }
    createPMCStageMaterialCompanyName_MapWithMaterialWiseApi(
      state.tmpTurnkeyProjectmaterialInfoID,
      strSelTechid,
      strSelCompNames,
      user.employeeID,
      '192.66.22'
    )
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Service Created Successfully.', {position: 'top-center'})
          setShowMaterial(false)
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, loading: false})
      })
  }

  // ------------------------------
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = state.materialCompMapCheckData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].projectTypeID) {
        if (isChecked) {
          tmpTechno[k].isMember = 1
        } else {
          tmpTechno[k].isMember = 0
          tmpTechno[k].materialCompanyName = ''
        }
        break
      }
    }
    setState({
      ...state,
      materialCompMapCheckData: tmpTechno,
    })
  }

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/pmc-work-stage/list', state: {search: mainSearch}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div className='d-flex flex-column mb-2'>
        <div className='d-flex align-items-center'>
          <label className='text-dark text-hover-primary cursor-pointer fs-4 fw-bolder'>
            Stage Name :
          </label>
          <span className='text-primary text-hover-dark cursor-pointer fs-4 fw-bolder ms-3'>
            {state.stageName}
          </span>
        </div>
      </div>
      <div className='card mb-5 mb-xl-10 mt-3'>
        <div className='card-body border-top p-9 ms-6'>
          {showAddUpdate == 1 && (
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                Material Name:
              </label>
              <div className='col-lg-10 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Material Name'
                  value={materialName}
                  name='materialName'
                  onChange={(e) => handleChangeMaterial(e)}
                />
              </div>
            </div>
          )}
          {showAddUpdate == 1 && (
            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              {action == 0 ? (
                <Button
                  className='btn btn-danger ms-3 mx-2'
                  variant='danger'
                  onClick={() => AddMaterialInfoDetails(materialName, state.pmcWorkStageID)}
                >
                  Submit
                </Button>
              ) : action == 1 ? (
                <Button
                  variant='danger'
                  className='btn btn-danger ms-3 mx-2'
                  onClick={() => updateMaterialInfoDetails()}
                >
                  Update
                </Button>
              ) : (
                <></>
              )}
              <Button variant='secondary' onClick={handleCloseMaterialInfo}>
                Cancel
              </Button>
            </div>
          )}
          {showAddUpdate == 0 && (
            <div className='card-header border-0 ' style={{backgroundColor: '#000000'}}>
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
              <div
                className='card-toolbar'
                data-bs-toggle='tooltip'
                data-bs-placement='top'
                data-bs-trigger='hover'
                title='Click to add a user'
              >
                <span
                  className='btn btn-sm btn-light-primary bg-white'
                  onClick={() => {
                    setShowAddUpdate(1)
                    setAction(0)
                  }}
                >
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                  Add New
                </span>
              </div>
            </div>
          )}
          {/* </form> */}
          <div className='mt-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-bordered align-middle g-2'>
                {/* begin::Table head */}
                <thead style={{backgroundColor: '#f3722c'}}>
                  <tr className='fw-bolder fs-5 text-start'>
                    <th className='min-w-300px text-start p-3'>Material Name</th>
                    <th className='min-w-300px'>Company Name</th>
                    <th className='min-w-75px text-center p-3'>Edit | Delete</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className='text-start'>
                  <LoaderInTable loading={loading} column={5} />
                  {state.pmcMaterialInfoData.length > 0 &&
                    state.pmcMaterialInfoData.map((data, index) => {
                      return (
                        <tr className='fs-5 ps-2 text-start' key={index}>
                          <td className='text-dark text-hover-primary'>{data.materialName}</td>
                          <td>
                            <div className='d-flex flex-shrink-0'>
                              <div
                                onClick={() =>
                                  handleShowTurnkeyProjMaterialMap(
                                    data.turnkeyProjectStageMaterialID,
                                    data.materialName
                                  )
                                }
                                className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm m-1'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/maps/map002.svg'
                                  className='svg-icon-2 svg-icon-success'
                                />
                              </div>
                            </div>
                          </td>
                          <td className='text-end'>
                            <div className='d-flex justify-content-end flex-shrink-0 mx-2'>
                              <span
                                className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                                onClick={() => UpdateClick(data.turnkeyProjectStageMaterialID)}
                              >
                                <KTSVG
                                  path='/media/icons/duotune/art/art005.svg'
                                  className='svg-icon-3 svg-icon-primary'
                                />
                              </span>
                              <span
                                onClick={() => deleteMaterial(data.turnkeyProjectStageMaterialID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='ssvg-icon-3 svg-icon-danger'
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}{' '}
                  <div className='text-end ms-5'>
                    <BlankDataImage
                      length={state.materialCompMapCheckData.length}
                      loading={state.loading}
                    />
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* ============== Update Model ========== */}
      <Modal
        show={showMaterial}
        size='lg'
        onHide={handleCloseMaterial}
        backdrop='true'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className='fs-4'>Stage Name :</span>&nbsp;&nbsp;
            <span className='text-primary text-hover-dark fs-4'>{state.stageName}</span>
            <br />
            <span className='fs-4'>Material Name :</span>&nbsp;&nbsp;
            <span className='text-primary text-hover-dark fs-4'>{state.selMaterialName}</span>
          </Modal.Title>
        </Modal.Header>
        <div className='px-1'>
          <div className='table-responsive'>
            <table className='table g-5'>
              {/* begin::Table head */}
              <thead style={{backgroundColor: '#748cab'}}>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-50px'>Project Type</th>
                  <th className='min-w-250px'>Company Name</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {mainLoading ? (
                  <LoaderInTable loading={mainLoading} column={15} />
                ) : (
                  <>
                    {state.materialCompMapCheckData.length > 0 &&
                      state.materialCompMapCheckData.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td className=''>
                              <div className='form-check form-check-custom form-check-solid'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  id={`${data.projectTypeID}`}
                                  value={data.projectTypeID}
                                  name={data.projectType}
                                  checked={data.isMember == 1 ? true : false}
                                  onChange={(e) => SetStatus(e)}
                                />
                                <label
                                  className='form-check-label text-start ms-3 fs-5 col-lg-4'
                                  htmlFor='flexCheckDefault'
                                >
                                  {data.projectType}
                                </label>
                              </div>
                            </td>
                            <td>
                              <div className={data.isMember == 1 ? 'col-md-12 fv-row' : 'd-none'}>
                                <input
                                  className='form-control form-control-sm fs-5 bg-light-primary'
                                  type='text'
                                  id={`${data.projectTypeID}`}
                                  onChange={(event) => handleChange(event)}
                                  value={data.materialCompanyName}
                                />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Modal.Footer>
          <Button
            variant='danger'
            onClick={() => pmcWorkStageMaterial(state.materialCompMapCheckData)}
          >
            Save
          </Button>
          <Button variant='secondary' onClick={handleCloseMaterial}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PMCWorkMaterialInfo
