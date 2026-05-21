import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {useHistory, useLocation} from 'react-router-dom'
import {GetProjectTypeDropdownListAPI} from '../../../../modules/project-master-page/project-master/ProjectCRUD'
import {IBHKMasterModel} from '../../../../models/master-page/IBHKMasterModel'
import {IProjectTypeodel} from '../../../../models/projects-page/IProjectsModel'
import {getActiveBHKApi} from '../../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {Col, Container, Row} from 'react-bootstrap-v5'
import {
  AddAreaWisePriceByAreaIDAPI,
  getPlanAreaByBhkIDAndProjectTypeIDAPI,
} from '../../../../modules/product-master-page/plan-area-master-page/AreaPriceCRUD'
import {
  AreaPriceModel,
  IAreaSqftModel,
  areaPriceInitValue as initialValues,
} from '../../../../models/product-page/AreaPriceModel'
import Search from 'antd/es/transfer/search'

const profileDetailsSchema = Yup.object().shape({
  areaRate: Yup.number().required('Area Rate is required').min(1, 'Area Rate is required'),
  bhkID: Yup.number().min(1, 'Bhk Name is required').required('Bhk Name is required'),
  projectTypeID: Yup.number()
    .min(1, 'Project Type is required')
    .required('Project Type is required'),
})

interface IUpgrade {
  loading: boolean
  bhkData: IBHKMasterModel[]
  ProjectTypeData: IProjectTypeodel[]
  areaSqftData: IAreaSqftModel[]
  selBHKID: number
  selProjectTypeID: number
  selAreaID: number
  mainSerach: string
}

const AddArea: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<AreaPriceModel>(initialValues)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<AreaPriceModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IUpgrade>({
    loading: false,
    bhkData: [] as IBHKMasterModel[],
    ProjectTypeData: [] as IProjectTypeodel[],
    areaSqftData: [] as IAreaSqftModel[],
    selBHKID: 0,
    selProjectTypeID: 0,
    selAreaID: 0,
    mainSerach: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let loData: any = location.state
      console.log(loData)
      let AreaID = loData.planAreaID
      var mainSerach = loData.mainSerach
      if (loData.mainSearch !== undefined) {
        mainSerach = loData.mainSearch
      }
      getProjectTypeData(AreaID, mainSerach)
    }, 100)
  }, [])

  function getProjectTypeData(AreaID: number, mainSerach: string) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getBHKData(responseData, AreaID, mainSerach)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, ProjectTypeData: [], loading: false})
      })
  }
  function getBHKData(ProjectTypeData: IProjectTypeodel[], AreaID: number, mainSerach: string) {
    getActiveBHKApi()
      .then((response) => {
        // let responseData = response.data.responseObject
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          setState({
            ...state,
            bhkData: responseData,
            selAreaID: AreaID,
            mainSerach,
            ProjectTypeData: ProjectTypeData,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkData: [], loading: false})
      })
  }

  function getAreaSquireFitByBhkID(temBhkID: number) {
    getPlanAreaByBhkIDAndProjectTypeIDAPI(state.selProjectTypeID, temBhkID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({...state, areaSqftData: responseData, selBHKID: temBhkID, loading: false})
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, areaSqftData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, areaSqftData: [], loading: false})
      })
  }

  function getAreaSquireFitByProjectTypeID(temProjectTypeID: number) {
    getPlanAreaByBhkIDAndProjectTypeIDAPI(temProjectTypeID, state.selBHKID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            areaSqftData: responseData,
            selProjectTypeID: temProjectTypeID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, areaSqftData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, areaSqftData: [], loading: false})
      })
  }

  // =================== For Asseccories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = state.areaSqftData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].carpetAreaID) {
        if (isChecked) {
          tmpTechno[k].isMember = 1
        } else {
          tmpTechno[k].isMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      areaSqftData: tmpTechno,
    })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
      getAreaSquireFitByProjectTypeID(parseInt(value))
    } else if (elementId === 'bhkID') {
      formik.setFieldValue('bhkID', parseInt(value))
      getAreaSquireFitByBhkID(parseInt(value))
    }
  }

  const formik = useFormik<AreaPriceModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let tmpTech = state.areaSqftData
        let strSelTechid: string = ''
        for (let k in tmpTech) {
          if (tmpTech[k].isMember === 1) {
            if (strSelTechid == '') {
              strSelTechid = `${tmpTech[k].carpetAreaID}`
            } else {
              strSelTechid = strSelTechid + ',' + `${tmpTech[k].carpetAreaID}`
            }
          }
        }
        AddAreaWisePriceByAreaIDAPI(
          state.selAreaID,
          values.projectTypeID,
          values.bhkID,
          strSelTechid,
          values.areaRate,
          user.employeeID,
          '192.66.22'
        )
          .then((response: {data: {isSuccess: boolean; message: any}}) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: `/p-product/plan-area/${state.selAreaID}/list`,
                state: {planAreaID: state.selAreaID, Search: state.mainSerach},
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      {' '}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Project Type:
                </label>
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>BHK:</label>
                <div className='col-lg-4 fv-row'>
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
                            selected={state.selBHKID == data.bhkid ? true : false}
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Rate:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Rate '
                    {...formik.getFieldProps('areaRate')}
                  />
                  {formik.touched.areaRate && formik.errors.areaRate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.areaRate}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* ====================================================================================================== */}
              {/* <div className='row mb-6'> */}
              <label
                className={
                  state.selProjectTypeID && state.selBHKID > 0
                    ? 'col-lg-2 col-form-label fw-bold fs-6'
                    : 'd-none'
                }
              >
                <span className='required'>Area Sqft:</span>
              </label>
              <Container className='ms-10 mt-2'>
                <Row>
                  {state.areaSqftData.length > 0 &&
                    state.areaSqftData.map((item, index) => (
                      <Col xs={6} md={2} key={index}>
                        <div className='form-check form-check-custom form-check-solid mb-5'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id={`${item.carpetAreaID}`}
                            value={item.carpetArea}
                            name={item.carpetArea}
                            checked={item.isMember === 1 ? true : false}
                            onChange={(e) => SetStatus(e)}
                          />
                          <label className='form-check-label' htmlFor='flexCheckDefault'>
                            {item.carpetArea}
                          </label>
                        </div>
                      </Col>
                    ))}
                </Row>
              </Container>
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
                    pathname: `/p-product/plan-area/${state.selAreaID}/list`,
                    state: {planAreaID: state.selAreaID, search: state.mainSerach},
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
export {AddArea}
